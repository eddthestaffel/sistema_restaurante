import api from './axios'

export const getMenuItems = (params) => api.get('/menu', { params })
export const getMenuItem = (id) => api.get(`/menu/${id}`)
export const createMenuItem = (data) => api.post('/menu', data)
export const updateMenuItem = (id, data) => api.patch(`/menu/${id}`, data)
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`)
