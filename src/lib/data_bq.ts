/**
 * Credenciais da Service Account do BigQuery
 * Em produção, estas chaves devem vir de variáveis de ambiente seguras.
 */
export const BQ_CREDENTIALS = {
  projectId: "bidata-cross-sa-batch",
  clientEmail: "iup-marcelcardos-01@bidata-cross-sa-batch.iam.gserviceaccount.com",
  // IMPORTANTE: A privateKey abaixo é um PLACEHOLDER.
  // Você DEVE substituí-la pela privateKey REAL da sua Service Account do BigQuery
  // em um ambiente SEGURO (ex: variáveis de ambiente).
  // Uma privateKey inválida resultará em falhas de autenticação com o BigQuery.
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsC6NWAAR2kmTn\n8tQe4zqrfAbqONgkl6I2u7JBcnBF+lgAWLuvEAYZkziInSerKUGrZRlceOt278ZT\nF7AKbUFhqRyyPmmO/6aXKQvtInm7HPu7fGcx4oii8gvc55l0iX692i+LkFNGUFCH\n2Bdboxrk+v+u8jG2t9Pmmi9eNZ2IDfcJ33IkBbCWdL7hnJop/DTDnVAuEBHpC20l\niBUJUfiOfEqJYqFUx/YVDpZwInSta4aJNgJ1t4Mea6DGxvyBtI2Ox2iDOgdxjr00\noqDK/+siOJX/T3wI24c64SUD0sKc+wPJn8r39sxac/ue/QZCHMg8mNz5AcMevshX\nVxgDlk8nAgMBAAECggEAAo3lregwKMaBowPy7EZ5X4Rm4eFYLCroKKHewqP9ULyn\nw9GNb8rwHD8YTsbuiNcC95V3q+zLqidjLWajoXP/zYBiQa81h/75rTLZz3p8ji+e\n+Sieq5nuZ2TqkiwKFjXYYN81Z4AMDHYyy+GEb0LbqlyjoShNXqYaCkltvJtVLGjq\nb52U4It9F3pWd/otdO6mdb18HSqm+KiYrvmRs+/0ExLDSLiRKgHncL2D7NlUJtb6\n5Wm0Ttrypi1AiVGS2YlH6jRr76Irtsf6if4wApf+xVv2zFjsckwkbyFyvqHu6RoY\nR/HobX/x9zQyczca+l/z8pVqnzcWJsCq7Ah4NvEXOQKBgQDUPCiPAX0YlnkCFW9+\nXpaK6BNk6qYvkS0+2nCUWxf7jSQ2cfd1ESpFm26r3sujubJH6PQW/DzWugygTg0S\nMavmuJy4pcH6PBN+FyKD8CfGQ2emZOweuyh99S+xF5fGTXwKU/3UdveP7f0ORnXy\nt4QcjFtU7SsmgspcS2dtZWxMDQKBgQDPheHoGcFBtfAszAGVDnXfbZNt2sKDi0lv\n60FrwxomTjaR/axz8Lhoemz2T8Js7aM2oSbkv+x28v/Vb30YEFQLNuaBi1o6vQ+N\nhxO2kKXLlb420oCfjCnERGibGp8V0oUwLLQE3gmjQg/hqSeE0BLt2XOtPaRDMjwS\naC6/CB1XAwKBgQC1LBmPYjzwpVrtLXE81e/66fvMVQbCalLOadhavJxvb1/vXkBY\n3etQ+ktySkFaJWYMPs9HY9Fnl/C5U4eS9XYCAaw/b7h0LZ6SL5uWN4csl1O+1j4+\nSZRaWdh5e2Njs7dkdaikG15frlAsRHfhV0leuW4pxD/moxWtzeyflUnqbQKBgDAu\ndXTeBfCrvUepVfS1lsh5OHGZCPBhtns1s8rBUaDzJ9hdfVyt1yLqycGmYw3HXs2g\nPNd/d/dmE+AKMpETuW+hH4OURy68FpBVfE4250eNTMyNsy9X65qWB3N7itQWPLYi\nquk2ZCZzgBx0mahMZxiyFBl05l5zm17qsW/JAobhAoGAM3VjvwtwnqQ0essdSg/A\n41poI88htTC/ROQPvdXaBhF9dqTjjXnl6QjA0KmeONcax3Pwlq4mw0OlTJVQw1Eu\npPUmdr52Tb2AEbuSljbEsorY2gAYsAHH4ha67F64eAsTrxxGRIRNsPjF8RE/11BA\nwh7XsEAgSCvbW/ZiF3JUZDg=\n-----END PRIVATE KEY-----\n"
}
