import api from './api';

// Fetch vehicles list with optional filters
export const fetchVehicles = async (fuelType = 'All') => {
  const params = {};
  if (fuelType !== 'All') {
    params.fuel_type = fuelType;
  }
  const response = await api.get('/vehicles', { params });
  return response.data; // Returns paginated Laravel response
};

// Book a test drive
export const bookTestDrive = async (bookingData) => {
  const response = await api.post('/test-drives', bookingData);
  return response.data;
};