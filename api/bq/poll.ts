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

async function fetchAllRows(jobId: string, token: string): Promise<unknown[]> {
  const allRows: unknown[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(
      `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT_ID}/queries/${jobId}`
    );
    url.searchParams.set("maxResults", "50000");
    url.searchParams.set("timeoutMs", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const resp = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resp.ok) throw new Error(`BQ poll HTTP ${resp.status}`);
    const json = await resp.json();
    if (!json.jobComplete) return [];  // still running, caller retries

    allRows.push(...parseRows(json));
    pageToken = json.pageToken;
  } while (pageToken);

  return allRows;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { jobId } = req.query || {};
  if (!jobId || typeof jobId !== "string") return res.status(400).json({ error: "Missing jobId" });

  try {
    const token = await getToken();

    // Check job status
    const statusResp = await fetch(
      `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT_ID}/jobs/${jobId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!statusResp.ok) throw new Error(`BQ status HTTP ${statusResp.status}`);
    const statusJson = await statusResp.json();

    if (statusJson.status?.errorResult) {
      return res.status(500).json({ error: statusJson.status.errorResult.message });
    }

    if (statusJson.status?.state !== "DONE") {
      return res.status(200).json({ done: false });
    }

    const rows = await fetchAllRows(jobId, token);
    return res.status(200).json({ done: true, rows });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Unknown error" });
  }
}

export const config = { maxDuration: 15 };
