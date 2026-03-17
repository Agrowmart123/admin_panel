// src/api/FarmarProductApi.js

import axios from "./apiClient";

export const FarmarProductApi = {

  // GET all farmer products (paginated)
  // AdminFarmerController → GET /api/admin/farmers/products
  getAllProducts: (page = 0, size = 10) => {
    return axios.get(`/admin/farmers/products`, {
      params: { page, size },
    });
  },

  // GET single product by ID
  // AdminFarmerController → GET /api/admin/farmers/product/{id}
  getProductById: (id) => {
    return axios.get(`/admin/farmers/product/${id}`);
  },

  // GET products for a specific farmer (paginated)
  // AdminFarmerController → GET /api/admin/farmers/{farmerId}/products
  getFarmerProducts: (farmerId, page = 0, size = 10) => {
    return axios.get(`/admin/farmers/${farmerId}/products`, {
      params: { page, size },
    });
  },

  // PATCH approve a farmer product
  // AdminProductController → PATCH /api/admin/farmer-products/{id}/approve
  approveProduct: (id) => {
    return axios.patch(`/admin/farmer-products/${id}/approve`);
  },

  // PATCH reject a farmer product
  // AdminProductController → PATCH /api/admin/farmer-products/{id}/reject
  rejectProduct: (id, reason) => {
    return axios.patch(`/admin/farmer-products/${id}/reject`, {
      rejectionReason: reason,
    });
  },
};