async function poll<T>(jobId: string): Promise<T[]> {
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const resp = await fetch(`/api/bq/poll?jobId=${encodeURIComponent(jobId)}`);
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: resp.statusText }));
      throw new Error(err?.error || `Poll HTTP ${resp.status}`);
    }
    const json = await resp.json();
    if (json.error) throw new Error(json.error);
    if (json.done) return json.rows as T[];
    // still running, loop
  }
  throw new Error("BigQuery timeout após 6 minutos");
}

export async function runBigQuery<T>(sql: string): Promise<T[]> {
  const resp = await fetch("/api/bq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: resp.statusText }));
    throw new Error(err?.error || `API HTTP ${resp.status}`);
  }

  const json = await resp.json();
  if (json.error) throw new Error(json.error);

  // Fast query returned immediately
  if (json.done) return json.rows as T[];

  // Slow query — poll until done
  return poll<T>(json.jobId);
}
