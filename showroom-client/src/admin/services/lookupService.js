import api from '../../services/api';

// Aggregated Lookup
export const getAllLookups = async () => (await api.get('/admin/lookups')).data;

// Makes API
export const getMakes = async () => (await api.get('/makes')).data;
export const createMake = async (data) => (await api.post('/admin/makes', data)).data;
export const updateMake = async (id, data) => (await api.put(`/admin/makes/${id}`, data)).data;
export const deleteMake = async (id) => (await api.delete(`/admin/makes/${id}`)).data;

// Models API
export const getModels = async () => (await api.get('/models')).data;
export const createModel = async (data) => (await api.post('/admin/models', data)).data;
export const updateModel = async (id, data) => (await api.put(`/admin/models/${id}`, data)).data;
export const deleteModel = async (id) => (await api.delete(`/admin/models/${id}`)).data;

// Fuel Types API
export const getFuelTypes = async () => (await api.get('/fuel-types')).data;
export const createFuelType = async (data) => (await api.post('/admin/fuel-types', data)).data;
export const updateFuelType = async (id, data) => (await api.put(`/admin/fuel-types/${id}`, data)).data;
export const deleteFuelType = async (id) => (await api.delete(`/admin/fuel-types/${id}`)).data;

// Body Types API
export const getBodyTypes = async () => (await api.get('/body-types')).data;
export const createBodyType = async (data) => (await api.post('/admin/body-types', data)).data;
export const updateBodyType = async (id, data) => (await api.put(`/admin/body-types/${id}`, data)).data;
export const deleteBodyType = async (id) => (await api.delete(`/admin/body-types/${id}`)).data;