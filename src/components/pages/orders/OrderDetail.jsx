import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../../../api/orderService";
import { ArrowLeft } from "lucide-react";

// Rupee helper function - undefined/0 fix karnya sathi
const rupee = (v) => `₹${v || 0}`;

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Backend kadun exact data fetch karne
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        // Admin Order Controller cha path '/api/admin/orders' logic
        const data = await OrderService.getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderId]);

  if (loading)
    return (
      <div className="p-10 text-center font-bold">
        Loading AgrowMart Data...
      </div>
    );
  if (!order)
    return (
      <div className="p-10 text-center font-bold text-red-500">
        Order not found in Database
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 uppercase">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 mb-6 hover:text-black transition font-bold"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Product Section - Top Part */}
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={
              order.items?.[0]?.primaryImageUrl ||
              "https://images.wisegeek.com/group-of-fruits-and-vegetables.jpg"
            }
            alt="Product"
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border border-gray-200 flex-shrink-0 shadow-sm"
          />

          <div className="flex-1 w-full md:w-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
            <div className="flex flex-col gap-2 md:gap-1">
              <div className="text-green-600 font-black text-sm tracking-widest uppercase">
                {order.id}
              </div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase">
                {order.items?.[0]?.productName || "Agrow Item Name"}
              </h1>

              <div className="flex pb-2">
                <p className="text-gray-700 font-medium w-40 text-sm">
                  QUANTITY:
                </p>
                <p className="text-gray-900 font-black">
                  {order.items?.[0]?.quantity || 0}
                </p>
              </div>

              <div className="flex">
                <p className="text-gray-700 font-medium w-40 text-sm uppercase">
                  Payment Mode:
                </p>
                <p className="text-gray-700 font-medium uppercase font-black">
                  {order.deliveryMode === "SELF_DELIVERY"
                    ? "COD / SELF"
                    : order.paymentMode || "ONLINE"}
                </p>
              </div>

              <div className="flex pb-4">
                <p className="text-gray-700 font-medium w-40 text-sm uppercase">
                  Payment Status:
                </p>
                <p
                  className={`font-black uppercase ${order.paymentStatus === "PAID" ? "text-green-600" : "text-orange-500"}`}
                >
                  {order.paymentStatus ||
                    (order.status === "DELIVERED" ? "PAID" : "PENDING")}
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 text-right md:text-left flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
              <div className="flex gap-3">
                <button className="px-5 py-2 bg-green-600 text-white text-xs font-black rounded hover:bg-green-700 transition shadow-sm uppercase">
                  Accept
                </button>
                <button className="px-5 py-2 bg-red-500 text-white text-xs font-black rounded hover:bg-red-600 transition shadow-sm uppercase">
                  Cancel
                </button>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  Total Amount
                </p>
                <p className="text-3xl font-black text-green-600">
                  {rupee(order.totalPrice)}.00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex gap-0 px-6 font-black text-xs tracking-widest">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-8 py-4 transition ${
                activeTab === "info"
                  ? "text-green-600 border-b-4 border-green-600 bg-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              ORDER INFO
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`px-8 py-4 transition ${
                activeTab === "track"
                  ? "text-green-600 border-b-4 border-green-600 bg-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              TRACK ORDER
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "info" ? (
            <div className="grid grid-cols-[240px_20px_1fr] gap-y-6 items-start uppercase">
              <p className="text-gray-500 font-bold text-xs uppercase">
                Customer ID
              </p>
              <p className="text-gray-400">:</p>
              <p className="text-gray-900 font-black text-sm">
                {order.customerId}
              </p>

              <p className="text-gray-500 font-bold text-xs uppercase">
                Customer Name
              </p>
              <p className="text-gray-400">:</p>
              <p className="text-gray-900 font-black text-sm uppercase">
                {order.customerName || "N/A"}
              </p>

              <p className="text-gray-500 font-bold text-xs uppercase">
                Customer Phone
              </p>
              <p className="text-gray-400">:</p>
              <p className="text-gray-900 font-black text-sm">
                {order.customerPhone || "N/A"}
              </p>

              <p className="text-gray-500 font-bold text-xs uppercase">
                Merchant ID
              </p>
              <p className="text-gray-400">:</p>
              <p className="text-gray-900 font-black text-sm">
                {order.merchantId}
              </p>

              <p className="text-gray-500 font-bold text-xs uppercase">
                Merchant / Seller
              </p>
              <p className="text-gray-400">:</p>
              <p className="text-gray-900 font-black text-sm uppercase">
                AGROWMART SHOP OWNER
              </p>

              <p className="text-gray-500 font-bold text-xs uppercase">
                Shipping Address
              </p>
              <p className="text-gray-400">:</p>
              <p className="text-gray-800 text-sm leading-relaxed font-bold uppercase">
                {order.deliveryAddress?.addressLine},{" "}
                {order.deliveryAddress?.townCity},<br />
                {order.deliveryAddress?.state} -{" "}
                {order.deliveryAddress?.pincode}
              </p>

              <p className="text-gray-500 font-bold text-xs uppercase">
                Order Date
              </p>
              <p className="text-gray-400">:</p>
              <p className="text-gray-800 text-sm font-black">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
              </p>

              <p className="text-gray-500 font-bold text-xs uppercase">
                Delivery Partner
              </p>
              <p className="text-gray-400">:</p>
              <p className="text-gray-900 font-black text-sm">
                {order.deliveryPartnerId || "NOT ASSIGNED"}
              </p>

              <p className="text-gray-500 font-bold text-xs uppercase">
                Delivery Date
              </p>
              <p className="text-gray-400">:</p>
              <p className="text-green-700 font-black text-sm italic">
                {order.deliveredAt
                  ? new Date(order.deliveredAt).toLocaleDateString()
                  : "PENDING DELIVERY"}
              </p>

              <p className="text-gray-500 font-bold text-xs uppercase">
                Quantity
              </p>
              <p className="text-gray-400">:</p>
              <p className="text-gray-900 font-black text-sm">
                {order.items?.[0]?.quantity || 0}
              </p>
            </div>
          ) : (
            /* Track Order logic matches DB status */
            <div className="py-10 max-w-md">
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-green-600 ring-4 ring-green-100 shadow-sm" />
                  <div
                    className={`w-1 h-20 ${order.status === "DELIVERED" ? "bg-green-300" : "bg-gray-100"}`}
                  />
                  <div
                    className={`w-5 h-5 rounded-full ${order.status === "DELIVERED" ? "bg-green-600" : "bg-gray-200"}`}
                  />
                </div>
                <div className="flex-1 space-y-20 pt-1">
                  <div>
                    <p className="font-black text-sm uppercase text-gray-900">
                      Order Placed Successfully
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`font-black text-sm uppercase ${order.status === "DELIVERED" ? "text-green-700" : "text-gray-300"}`}
                    >
                      {order.status === "DELIVERED"
                        ? "Order Delivered"
                        : "Delivery Pending"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {order.deliveredAt
                        ? new Date(order.deliveredAt).toLocaleString()
                        : "Awaiting..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
