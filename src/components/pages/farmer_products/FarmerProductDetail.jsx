import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  Phone,
  User,
  Package,
  Tag,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FarmarProductApi } from "../../../api/FarmarProductApi";

export default function FarmerProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("PENDING");
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await FarmarProductApi.getProductById(id);
        const data = res.data?.data || res.data;
        setProduct(data);
        setStatus(data?.approvalStatus || "PENDING");
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getStatusStyle = () => {
    if (status === "APPROVED")
      return "text-green-600 border-green-600 bg-green-50";
    if (status === "REJECTED") return "text-red-600 border-red-600 bg-red-50";
    return "text-amber-500 border-amber-500 bg-amber-50";
  };

  const getStockStyle = (s) => {
    if (s === "AVAILABLE") return "text-green-600 bg-green-50 border-green-200";
    return "text-red-500 bg-red-50 border-red-200";
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await FarmarProductApi.approveProduct(id);
      setStatus("APPROVED");
      toast.success("Product approved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Approval failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }
    setActionLoading(true);
    try {
      await FarmarProductApi.rejectProduct(id, rejectionReason);
      setStatus("REJECTED");
      setRejecting(false);
      setRejectionReason("");
      toast.success("Product rejected.");
    } catch (error) {
      console.error(error);
      toast.error("Rejection failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-2">
        <Loader2 className="animate-spin text-lime-600" size={38} />
        <p className="text-gray-500 font-semibold">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-bold">Product not found.</p>
      </div>
    );
  }

  // ── Field normalization ────────────────────────────────────
  const productName = product.farmerProductName || "-";
  const category = product.category || "-";
  const minPrice = product.farmerPrice ?? 0;
  const maxPrice = product.farmerMaxPrice ?? 0;
  const unit = product.farmerUnit || "-";
  const quantity = product.farmerQuantity ?? 0;
  const description = product.description || "No description provided.";
  const stockStatus = product.status || "-";
  const serialNo = product.serialNo || "-";
  const productImage = product.mainImage || null;

  const createdAt = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  const updatedAt = product.updatedAt
    ? new Date(product.updatedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  // ── Farmer details ─────────────────────────────────────────
  const farmerName = product.farmerName || "-";
  const farmerPhoto = product.farmerPhoto || null;
  const farmerPhone = product.farmerPhone || "-";
  const farmerCity = product.farmerCity || product.farmerVillage || "-";
  const farmerDistrict = product.farmerDistrict || "-";
  const farmerState = product.farmerState || "-";

  // Price display
  const priceDisplay =
    maxPrice > 0 && maxPrice !== minPrice
      ? `₹${Number(minPrice).toLocaleString("en-IN")} – ₹${Number(maxPrice).toLocaleString("en-IN")}`
      : `₹${Number(minPrice).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 text-left">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/farmer-products")}
          className="mb-6 inline-flex items-center gap-2 text-gray-500 hover:text-black font-bold transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Farmer Products
        </button>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* ── Header ──────────────────────────────────────────── */}
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-gray-400">
                    #{serialNo}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-black">{productName}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span
                    className="font-black text-lime-600 uppercase tracking-widest text-xs
                    bg-lime-50 border border-lime-200 px-2 py-0.5 rounded-full"
                  >
                    {category}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-black rounded-full border ${getStatusStyle()}`}
                  >
                    {status}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-full border ${getStockStyle(stockStatus)}`}
                  >
                    {stockStatus}
                  </span>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Listed: {createdAt}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleApprove}
                  disabled={status === "APPROVED" || actionLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-600
                    disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full
                    text-sm font-bold shadow-md transition-all"
                >
                  <CheckCircle className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={() => setRejecting(true)}
                  disabled={status === "REJECTED" || actionLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-600
                    disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full
                    text-sm font-bold shadow-md transition-all"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>

            {/* Rejection Reason Input */}
            {rejecting && (
              <div className="mt-4 flex gap-3 items-start">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason (required)..."
                  className="flex-1 border border-red-200 rounded-lg p-3 text-sm text-gray-700
                    outline-none focus:border-red-400 resize-none"
                  rows={2}
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-black
                      hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading ? "..." : "Confirm Reject"}
                  </button>
                  <button
                    onClick={() => {
                      setRejecting(false);
                      setRejectionReason("");
                    }}
                    className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg
                      text-xs font-black hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Body ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
            {/* Left – Product Image */}
            <div className="lg:col-span-5 space-y-4">
              <div
                className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100
                shadow-inner aspect-[4/3] flex items-center justify-center"
              >
                {productImage ? (
                  <img
                    src={productImage}
                    className="w-full h-full object-cover"
                    alt={productName}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-3xl">🌾</span>
                    </div>
                    <p className="text-sm font-medium">No product image</p>
                  </div>
                )}
              </div>

              {/* Meta info below image */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Serial No
                  </p>
                  <p className="text-sm font-black text-gray-700">
                    #{serialNo}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm font-black text-gray-700">
                    {updatedAt}
                  </p>
                </div>
              </div>
            </div>

            {/* Right – Details */}
            <div className="lg:col-span-7 space-y-5">
              {/* Price, Stock, Unit */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 col-span-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Price Range
                  </p>
                  <p className="text-lg font-black text-gray-900">
                    {priceDisplay}
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    per {unit}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Stock
                  </p>
                  <p className="text-lg font-black text-gray-900">{quantity}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    units
                  </p>
                </div>
              </div>

              {/* Product Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Category
                  </p>
                  <p className="text-sm font-bold text-gray-800">{category}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Unit
                  </p>
                  <p className="text-sm font-bold text-gray-800">{unit}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Min Price
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    ₹{Number(minPrice).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Max Price
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {maxPrice > 0
                      ? `₹${Number(maxPrice).toLocaleString("en-IN")}`
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3
                  className="text-xs font-black text-gray-800 uppercase tracking-widest mb-2
                  border-l-4 border-lime-600 pl-3"
                >
                  Product Description
                </h3>
                <p
                  className="text-gray-600 leading-relaxed font-medium text-sm bg-gray-50
                  p-3 rounded-xl border border-gray-100"
                >
                  {description}
                </p>
              </div>

              {/* Farmer Info */}
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">
                  Farmer Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    {/* Farmer Photo */}
                    {farmerPhoto ? (
                      <img
                        src={farmerPhoto}
                        className="h-16 w-16 rounded-full border-2 border-white shadow
                          object-cover flex-shrink-0"
                        alt={farmerName}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="h-16 w-16 rounded-full bg-gray-200 border-2 border-white
                        shadow flex items-center justify-center flex-shrink-0"
                      >
                        <User className="w-7 h-7 text-gray-400" />
                      </div>
                    )}

                    {/* Farmer Info */}
                    <div className="space-y-1.5">
                      <p className="font-black text-gray-900 text-base">
                        {farmerName}
                      </p>

                      {farmerPhone !== "-" && (
                        <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {farmerPhone}
                        </p>
                      )}

                      {(farmerCity !== "-" || farmerState !== "-") && (
                        <p className="text-xs font-bold text-lime-600 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          {[farmerCity, farmerDistrict, farmerState]
                            .filter((v) => v && v !== "-")
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
