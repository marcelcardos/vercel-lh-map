// Credenciais da Service Account para acesso ao BigQuery via browser (Web Crypto API)
// Trocar pelos valores reais da sua SA antes de subir pro Vercel
export const BQ_CREDENTIALS = {
  projectId: "meli-bi-data",
  clientEmail: "SEU_SA@PROJECT.iam.gserviceaccount.com",
  privateKey: `-----BEGIN PRIVATE KEY-----
COLE_SUA_CHAVE_PRIVADA_AQUI
-----END PRIVATE KEY-----`,
};
