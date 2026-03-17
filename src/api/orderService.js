import api from "../api/apiClient";

const OrderService = {
  // Fetch all orders for the admin table
  getAllOrders: async (params) => {
    try {
      // Must include /api/admin/orders to match your Spring Boot @RequestMapping
      const response = await api.get("/admin/orders", { params });
      return response.data; 
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Fetch single order details
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  },

  // Update order status (e.g., PENDING -> ACCEPTED)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default OrderService;