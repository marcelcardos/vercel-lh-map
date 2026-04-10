/**
 * Credenciais da Service Account do BigQuery — lidas de variáveis de ambiente.
 * Configure no Vercel: Settings → Environment Variables
 * Localmente: .env.development.local
 */
export const BQ_CREDENTIALS = {
  projectId:   import.meta.env.VITE_BQ_PROJECT_ID   as string,
  clientEmail: import.meta.env.VITE_BQ_CLIENT_EMAIL  as string,
  privateKey:  (import.meta.env.VITE_BQ_PRIVATE_KEY  as string)?.replace(/\\n/g, "\n"),
}
