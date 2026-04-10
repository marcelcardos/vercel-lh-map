import { GoogleAuth } from "google-auth-library";

const PROJECT_ID = "meli-bi-data";

async function getToken(): Promise<string> {
  const saJson = process.env.GCP_SA_JSON;
  if (!saJson) throw new Error("GCP_SA_JSON not configured");
  const credentials = JSON.parse(saJson);
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/bigquery"],
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (!token) throw new Error("Failed to get access token");
  return token;
}

function parseRows(json: any): unknown[] {
  const fields: { name: string }[] = json.schema?.fields ?? [];
  const rows: { f: { v: unknown }[] }[] = json.rows ?? [];
  return rows.map((row) =>
    Object.fromEntries(fields.map((f, i) => [f.name, row.f[i]?.v]))
  );
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { sql } = req.body || {};
  if (!sql || typeof sql !== "string") return res.status(400).json({ error: "Missing sql" });

  try {
    const token = await getToken();

    // Submit job async — don't wait for completion
    const resp = await fetch(
      `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT_ID}/jobs`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          configuration: {
            query: {
              query: sql,
              useLegacySql: false,
              maximumBytesBilled: "1000000000000", // 1TB safety cap
            },
          },
        }),
      }
    );

    if (!resp.ok) {
      const err = await resp.text();
      return res.status(500).json({ error: `BQ submit HTTP ${resp.status}: ${err.slice(0, 400)}` });
    }

    const json = await resp.json();
    if (json.status?.errorResult) {
      return res.status(500).json({ error: json.status.errorResult.message });
    }

    const jobId = json.jobReference?.jobId;
    if (!jobId) return res.status(500).json({ error: "No jobId returned" });

    // Check if already done (fast queries)
    if (json.status?.state === "DONE") {
      const queryResp = await fetch(
        `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT_ID}/queries/${jobId}?maxResults=200000&timeoutMs=100`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const qJson = await queryResp.json();
      if (qJson.jobComplete) {
        return res.status(200).json({ done: true, rows: parseRows(qJson) });
      }
    }

    return res.status(202).json({ done: false, jobId });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Unknown error" });
  }
}

export const config = { maxDuration: 15 };
