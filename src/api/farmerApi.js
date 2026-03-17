// src/api/farmerApi.js
import apiClient from "./apiClient";

// response expected: ApiResponseDTO { success, message, data }
export const farmerApi = {
  getAllFarmers: (params) =>
    apiClient.get("/admin/farmers", { params }), // {page,size,search,status}

  getFarmerById: (id) =>
    apiClient.get(`/admin/farmers/${id}`),

  approveFarmer: (id, payload) =>
    apiClient.put(`/admin/farmers/${id}/approve`, payload),

  rejectFarmer: (id, payload) =>
    apiClient.put(`/admin/farmers/${id}/reject`, payload),

  blockFarmer: (id) =>
    apiClient.put(`/admin/farmers/${id}/block`),

  unblockFarmer: (id) =>
    apiClient.put(`/admin/farmers/${id}/unblock`),

  deleteFarmer: (id) =>
    apiClient.delete(`/admin/farmers/${id}`),

  restoreFarmer: (id) =>
    apiClient.post(`/admin/farmers/${id}/restore`),

 };