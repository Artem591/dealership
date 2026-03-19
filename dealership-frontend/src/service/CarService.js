import api from './api';

export const carService = {
  getAll: (page = 0, size = 10) =>
    api.get(`/cars?page=${page}&size=${size}`),

  getAvailable: (page = 0, size = 10) =>
    api.get(`/cars/available?page=${page}&size=${size}`),

  filter: (params, page = 0, size = 10) =>
    api.get('/cars/filter', { params: { ...params, page, size } }),

  getById: (id) =>
    api.get(`/cars/${id}`),
};