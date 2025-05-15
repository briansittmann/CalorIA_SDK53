import API from '../config/api'

/**
 * Genera recetas para el usuario autenticado.
 * @param {number} numComidas – número de recetas deseadas (1–4)
 * @returns {Promise<Array>} – Promise que resuelve al array de recetas
 */
export function generarRecetas(numComidas) {
  return API
    .post(`/recetas/generar?numComidas=${numComidas}`, {})
    .then(res => {
      let data = res.data
      // parsea si viene como string
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch {
          throw new Error('Respuesta inválida del servidor')
        }
      }
      // si es directamente un array, lo devolvemos
      if (Array.isArray(data)) {
        return data
      }
      // si viene envuelto en { recetas: [...] }
      if (data.recetas && Array.isArray(data.recetas)) {
        return data.recetas
      }
      throw new Error('Formato de recetas inválido')
    })
}

export function guardarRecetas(recetas) {
  return API
    .post('/recetas/guardar', recetas)
    .then(res => res.data)
}


/**
 * Carga todas las recetas que el usuario ya guardó en su perfil.
 * @returns {Promise<Array<Receta>>}
 */
export function cargarRecetas() {
  return API
    .get('/recetas/mis')
    .then(res => res.data)
}


/**
 * Elimina una receta (por ID) del perfil del usuario.
 */
export function eliminarReceta(id) {
  return API
    .delete(`/recetas/${id}`)
    .then(res => res.data)  // opcionalmente devuelve la lista actualizada
}