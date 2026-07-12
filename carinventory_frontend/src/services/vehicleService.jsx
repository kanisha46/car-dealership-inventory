import api from './api';

export const vehicleService = {
  async getAllVehicles() {
    const response = await api.get('/api/vehicles');
    return response.data;
  },

  async getVehicleById(id) {
    const response = await api.get(`/api/vehicles/${id}`);
    return response.data;
  },

  async searchVehicles(params) {
    // filter empty params
    const filteredParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        filteredParams[key] = params[key];
      }
    });
    const response = await api.get('/api/vehicles/search', { params: filteredParams });
    return response.data;
  },

  async createVehicle(vehicleData) {
    const response = await api.post('/api/vehicles', vehicleData);
    return response.data;
  },

  async updateVehicle(id, vehicleData) {
    const response = await api.put(`/api/vehicles/${id}`, vehicleData);
    return response.data;
  },

  async deleteVehicle(id) {
    const response = await api.delete(`/api/vehicles/${id}`);
    return response.data;
  },

  async purchaseVehicle(id) {
    const response = await api.post(`/api/vehicles/${id}/purchase`);
    return response.data;
  },

  async restockVehicle(id, quantity) {
    const response = await api.post(`/api/vehicles/${id}/restock`, null, {
      params: { quantity }
    });
    return response.data;
  }
};
