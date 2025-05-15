import API from '../config/api'  // tu axios instance configurada con baseURL y token

/**
 * Llama a GET /dia/resumen y devuelve la Promise de Axios
 */
export function getDailySummary() {
  return API.get('/dia/resumen')
}