import { BQ_CREDENTIALS } from "./data_bq";

let cachedToken: string | null = null;
let tokenExpiry = 0;

function base64urlEncode(data: ArrayBuffer | string): string {
  let bytes: Uint8Array;
  if (typeof data === "string") {
    bytes = new TextEncoder().encode(data);
  } else {
    bytes = new Uint8Array(data);
  }
  let str = "";
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function generateJwt(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64urlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64urlEncode(
    JSON.stringify({
      iss: BQ_CREDENTIALS.clientEmail,
      scope: "https://www.googleapis.com/auth/bigquery",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  const keyData = pemToArrayBuffer(BQ_CREDENTIALS.privateKey);
  const key = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signingInput = `${header}.${payload}`;
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput)
  );

  return `${signingInput}.${base64urlEncode(signature)}`;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const jwt = await generateJwt();
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`OAuth2 token error: ${err.slice(0, 300)}`);
  }

  const json = await resp.json();
  cachedToken = json.access_token;
  tokenExpiry = Date.now() + (json.expires_in - 60) * 1000;
  return cachedToken!;
}

function parseRows<T>(resp: Record<string, unknown>): T[] {
  const fields = (resp?.schema as Record<string, unknown[]> | undefined)?.fields ?? [];
  const rows = (resp?.rows as unknown[]) ?? [];
  return rows.map((row) =>
    Object.fromEntries(
      (fields as Array<{ name: string }>).map((f, i) => [
        f.name,
        ((row as { f: Array<{ v: unknown }> }).f[i])?.v ?? null,
      ])
    )
  ) as T[];
}

export async function runBigQuery<T>(sql: string): Promise<T[]> {
  const token = await getAccessToken();
  const { projectId } = BQ_CREDENTIALS;

  const resp = await fetch(
    `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: sql,
        useLegacySql: false,
        timeoutMs: 120000,
        maxResults: 100000,
        location: "US",
      }),
    }
  );

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`BigQuery error ${resp.status}: ${err.slice(0, 300)}`);
  }

  const json = await resp.json();

  if (json.status?.errorResult) {
    throw new Error(json.status.errorResult.message);
  }

  if (json.jobComplete) {
    return parseRows<T>(json);
  }

  // Job still running — poll
  const jobId = json.jobReference?.jobId;
  if (!jobId) throw new Error("BigQuery: jobId não retornado");

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const pollResp = await fetch(
      `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries/${jobId}?timeoutMs=5000&maxResults=100000`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!pollResp.ok) {
      const err = await pollResp.text();
      throw new Error(`BigQuery poll error: ${err.slice(0, 200)}`);
    }
    const pollJson = await pollResp.json();
    if (pollJson.jobComplete) return parseRows<T>(pollJson);
  }

  throw new Error("BigQuery timeout após 2 minutos");
}
