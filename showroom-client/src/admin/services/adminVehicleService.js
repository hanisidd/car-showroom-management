import api from '../../services/api';

export const getAdminVehicles = async () => {
  const response = await api.get('/admin/vehicles');
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await api.post('/admin/vehicles', vehicleData);
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await api.delete(`/admin/vehicles/${id}`);
  return response.data;
};