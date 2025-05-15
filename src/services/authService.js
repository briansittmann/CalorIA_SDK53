// src/services/authService.js
import API from '../config/api'

/**
 * Llama al endpoint de login y devuelve el token.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<string>} token JWT
 */
export function loginUser({ email, password }) {
  return API
    .post('/auth/login', { email, password })
    .then(res => {
      const token = res.data?.token
      if (!token) throw new Error('Credenciales inválidas')
      return token
    })
}

/**
 * Llama al endpoint de registro y devuelve el token.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<string>} token JWT
 */
export function registerUser({ email, password }) {
  return API
    .post('/auth/register', { email, password })
    .then(res => {
      const token = res.data?.token
      if (!token) throw new Error('No se recibió token tras registrar')
      return token
    })
}