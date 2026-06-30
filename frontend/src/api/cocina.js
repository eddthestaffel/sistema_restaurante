import api from './axios'

export const getCocinaItems = (params) => api.get('/cocina', { params })
export const cambiarEstadoCocina = (itemId, estadoCocina) =>
  api.patch(`/cocina/items/${itemId}`, { estadoCocina })
