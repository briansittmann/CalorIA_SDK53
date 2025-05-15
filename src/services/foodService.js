// src/services/foodService.js
import API from '../config/api'  // 👉 Asegúrate de que la ruta es correcta

/**
 * Registra un alimento en el endpoint /comida/analizar
 * @param {{ nombre: string, gramos: number }} payload
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const registerFood = payload =>
  API.post('/comida/analizar', payload)