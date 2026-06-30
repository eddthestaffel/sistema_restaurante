import api from './axios'

export const getMesas = (params) => api.get('/mesas', { params })
export const getSalon = () => api.get('/mesas/salon')
export const getMesa = (id) => api.get(`/mesas/${id}`)
export const createMesa = (data) => api.post('/mesas', data)
export const updateMesa = (id, data) => api.patch(`/mesas/${id}`, data)
export const deleteMesa = (id) => api.delete(`/mesas/${id}`)
