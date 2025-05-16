// src/services/registerService.js
import API from '../config/api'



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

/**
 * Paso 1 – datos básicos.
 * POST /usuarios/perfil/basicos
 */
export function updateBasics(basicsDto) {
  // basicsDto = { nombre, edad, sexo, pesoKg, alturaCm, horaInicioDia }
  return API.post('/usuarios/perfil/basicos', basicsDto)
    .then(res => res.data)
}

/**
 * Paso 2 – nivel de actividad.
 * POST /usuarios/perfil/actividad
 */
export function updateActivity({ nivelActividad }) {
  return API.post('/usuarios/perfil/actividad', { nivelActividad })
    .then(res => res.data)
}

/**
 * Paso 3 – objetivo nutricional.
 * POST /usuarios/perfil/objetivo
 */
export function updateGoal({ objetivo }) {
  return API.post('/usuarios/perfil/objetivo', { objetivo })
    .then(res => res.data)
}

/**
 * Paso 4 – preferencias y alergias.
 * Reutilizamos el endpoint general de perfil:
 * PUT /usuarios/perfil
 */
export function updatePreferences({ preferencias, alergias }) {
  // leemos antes el perfil, o bien enviamos sólo los campos que ocupen preferences   
  return API.put('/usuarios/perfil/preferencias', { preferencias, alergias })
    .then(res => res.data)
}

/**
 * Comprueba si el perfil está completo.
 * GET /usuarios/perfil/completo
 */
export function checkProfileComplete() {
  return API.get('/usuarios/perfil/completo')
    .then(res => res.data.perfilCompleto)
}

export function recalcMetas() {
  return API.put('/usuarios/perfil/recalcular-metas').then(r => r.data);
}
/**
 * Recupera el perfil completo.
 * GET /usuarios/perfil
 */
export function fetchFullProfile() {
  return API.get('/usuarios/perfil')
    .then(res => res.data)
}


export function fetchProfileState() {
  return API.get('/usuarios/perfil/estado')
    .then(res => res.data);               // { basicos, actividad, objetivo, preferencias, perfilCompleto }
}