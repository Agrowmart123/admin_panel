import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderService from "../../../api/orderService"; // Tujhya service file cha path

// Rupee helper function
export const rupee = (v) => `₹${v}`;

const Orders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 7;

  // 1. Backend kadun orders aanne
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await OrderService.getAllOrders();
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 2. Search Logic (ID, Shop Name kiwa Customer Name nusar)
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    return (
      order.id?.toLowerCase().includes(search) ||
      order.shopName?.toLowerCase().includes(search) ||
      order.customerName?.toLowerCase().includes(search)
    );
  });

  // 3. Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-green-600 uppercase tracking-widest">
        AgrowMart Orders Load Hot Aahet...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header & Search Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            In Progress Orders ({filteredOrders.length})
          </h1>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 " />
            <input
              type="text"
              placeholder="Search by name or order id"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 4. Desktop Table View - Sarv Columns Included */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                  Order #
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                  Merchant
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                  Customer
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                  Order Date
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                  Delivery Date
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Product Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-center min-w-[150px]">
                      <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 border border-gray-100 flex-shrink-0 shadow-sm">
                        <img
                          src={
                            order.shopPhoto ||
                            "https://images.wisegeek.com/group-of-fruits-and-vegetables.jpg"
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {order.itemsSummary?.[0]?.productName || "Agrow Item"}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Qty: {order.itemsSummary?.[0]?.quantity || 1}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Order ID */}
                  <td className="px-4 py-3 text-xs text-gray-600 font-medium">
                    #{order.id}
                  </td>

                  {/* Merchant */}
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        src={
                          order.shopPhoto || "https://via.placeholder.com/30"
                        }
                        className="w-6 h-6 rounded-full mr-2 border shadow-xs"
                      />
                      <span className="text-xs text-gray-700 font-semibold">
                        {order.shopName}
                      </span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3 text-xs text-gray-900 font-medium">
                    {order.customerName}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 text-center text-xs font-black text-gray-900">
                    {rupee(order.totalPrice)}
                  </td>

                  {/* Order Date */}
                  <td className="px-4 py-3 text-xs text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* Delivery Date */}
                  <td className="px-4 py-3 text-xs text-gray-700 font-bold">
                    {order.deliveredAt
                      ? new Date(order.deliveredAt).toLocaleDateString()
                      : "Pending"}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-black rounded-sm uppercase ${
                        order.status === "DELIVERED"
                          ? "text-green-700 bg-green-50"
                          : "text-yellow-700 bg-yellow-50"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="px-3 py-1.5 border border-green-600 text-green-600 rounded text-[11px] font-black hover:bg-green-600 hover:text-white transition-all shadow-sm"
                    >
                      VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Mobile Card View - Sagle sections included */}
      <div className="lg:hidden space-y-4">
        {paginatedOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-bold text-green-600">#{order.id}</p>
                <h3 className="text-sm font-black text-gray-900">
                  {order.shopName}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-sm font-black">{rupee(order.totalPrice)}</p>
                <span className="text-[10px] font-bold uppercase text-yellow-700">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3 border-t pt-3">
              <p>
                <span className="text-gray-400 font-bold uppercase text-[9px] block">
                  Customer
                </span>{" "}
                {order.customerName}
              </p>
              <p>
                <span className="text-gray-400 font-bold uppercase text-[9px] block">
                  Delivery
                </span>{" "}
                {order.deliveredAt
                  ? new Date(order.deliveredAt).toLocaleDateString()
                  : "Pending"}
              </p>
            </div>

            <button
              onClick={() => navigate(`/orders/${order.id}`)}
              className="w-full py-2 bg-green-50 border border-green-600 text-green-600 rounded-md text-sm font-black hover:bg-green-600 hover:text-white transition-colors"
            >
              View Full Detail
            </button>
          </div>
        ))}
      </div>

      {/* 6. Pagination UI */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 text-xs font-bold border rounded bg-white disabled:opacity-30"
          >
            PREV
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 text-xs font-bold rounded ${currentPage === i + 1 ? "bg-green-600 text-white shadow-md" : "bg-white border"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 text-xs font-bold border rounded bg-white disabled:opacity-30"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
