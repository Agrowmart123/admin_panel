import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { FarmarProductApi } from "../../../api/FarmarProductApi";

const ITEMS_PER_PAGE = 8;

export default function FarmerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await FarmarProductApi.getAllProducts(
        page - 1,
        ITEMS_PER_PAGE,
      );
      const data = res.data?.data || res.data || {};
      const content = data.content || [];
      setProducts(content);
      setTotalElements(data.totalElements || content.length);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch farmer products.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side search filter on fetched page
  const filteredProducts = products.filter(
    (p) =>
      (p.farmerProductName || p.FarmerProductName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (p.vendorName || p.farmerName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(totalElements / ITEMS_PER_PAGE));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-2">
        <Loader2 className="animate-spin text-lime-600" size={36} />
        <p className="text-gray-500 font-semibold">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-3 md:p-6 text-left">
      <div className="max-w-full mx-auto">
        {/* HEADER */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">
              Farmer Products
            </h1>
            <span className="text-gray-400 text-sm font-normal">
              ({totalElements} total)
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by product or farmer name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-100 rounded-md overflow-x-auto shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-gray-100">
              <tr className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4 text-left font-bold">Product Name</th>
                <th className="px-6 py-4 text-left font-bold">Category</th>
                <th className="px-6 py-4 text-left font-bold">Price / Unit</th>
                <th className="px-6 py-4 text-left font-bold">Stock</th>
                <th className="px-6 py-4 text-left font-bold">Vendor</th>
                <th className="px-6 py-4 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const productName =
                    product.farmerProductName ||
                    product.FarmerProductName ||
                    "-";
                  const category = product.category || "-";
                  const price =
                    product.farmerPrice ??
                    product.FarmerPrice ??
                    product.price ??
                    0;
                  const unit =
                    product.farmerUnit ||
                    product.FarmerUnit ||
                    product.unit ||
                    "-";
                  const quantity =
                    product.farmerQuantity ??
                    product.FarmerQuantity ??
                    product.quantity ??
                    0;
                  const vendorName =
                    product.vendorName || product.farmerName || "-";
                  const vendorPhoto =
                    product.vendorPhoto ||
                    product.farmerPhoto ||
                    product.photoUrl ||
                    null;
                  const approvalStatus =
                    product.approvalStatus || product.status || "PENDING";
                  const mainImage =
                    product.mainImage ||
                    (product.imageUrls && product.imageUrls[0]) ||
                    "https://via.placeholder.com/200";
                  const createdAt = product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString()
                    : "-";

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/50 transition-all cursor-pointer"
                      onClick={() => navigate(`/farmer-product/${product.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={mainImage}
                            alt=""
                            className="w-12 h-12 rounded-md object-cover border border-gray-100"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/200";
                            }}
                          />
                          <div>
                            <div className="text-[13px] font-bold text-gray-800">
                              {productName}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {createdAt}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[12px] text-gray-600 font-medium">
                        {category}
                      </td>
                      <td className="px-6 py-4 text-[12px] text-gray-800 font-semibold">
                        ₹{Number(price).toLocaleString()} / {unit}
                      </td>
                      <td className="px-6 py-4 text-[12px] text-gray-800 font-medium">
                        {quantity}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {vendorPhoto ? (
                            <img
                              src={vendorPhoto}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200" />
                          )}
                          <span className="text-[12px] text-gray-700 font-medium">
                            {vendorName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`text-[10px] font-black px-3 py-1 rounded-md tracking-wider ${
                            approvalStatus === "APPROVED"
                              ? "text-green-600"
                              : approvalStatus === "REJECTED"
                                ? "text-red-500"
                                : "text-orange-400"
                          }`}
                        >
                          {approvalStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-400 font-semibold"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-8 gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 py-1 font-bold text-xs ${page === 1 ? "text-gray-300" : "text-gray-700 hover:text-green-600"}`}
          >
            PREV
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                page === p
                  ? "bg-green-600 text-white shadow-md shadow-green-100"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 font-bold text-xs ${page === totalPages ? "text-gray-300" : "text-gray-700 hover:text-green-600"}`}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
