import api from './axios'

export const getComandas = (params) => api.get('/comandas', { params })
export const getComanda = (id) => api.get(`/comandas/${id}`)
export const getComandaTotal = (id) => api.get(`/comandas/${id}/total`)
export const abrirComanda = (mesaId) => api.post('/comandas', { mesaId })
export const agregarItem = (id, menuItemId, cantidad) =>
  api.post(`/comandas/${id}/items`, { menuItemId, cantidad })
export const cerrarComanda = (id, propina = 0) =>
  api.post(`/comandas/${id}/cerrar`, { propina })
export const deleteComanda = (id) => api.delete(`/comandas/${id}`)
