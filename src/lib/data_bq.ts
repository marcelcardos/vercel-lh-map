/**
 * Credenciais da Service Account do BigQuery — lidas de variáveis de ambiente.
 * Configure no Vercel: Settings → Environment Variables
 * Localmente: .env.development.local
 */
function parsePrivateKey(raw: string | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/^"|"$/g, "")   // remove aspas externas se existirem
    .replace(/\\n/g, "\n")   // \n literal → newline real
    .trim();
}

export const BQ_CREDENTIALS = {
  projectId:   (import.meta.env.VITE_BQ_PROJECT_ID   as string)?.trim(),
  clientEmail: (import.meta.env.VITE_BQ_CLIENT_EMAIL  as string)?.trim(),
  privateKey:  parsePrivateKey(import.meta.env.VITE_BQ_PRIVATE_KEY as string),
}
