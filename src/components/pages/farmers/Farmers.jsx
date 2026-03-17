import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2, Loader2, FileText } from "lucide-react";
import toast from "react-hot-toast";

// Export Libraries
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// API Import (Tuza api folder path check kar)
import { farmerApi } from "../../../api/farmerApi";

const ITEMS_PER_PAGE = 10;

const Farmers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [farmersData, setFarmersData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ 1. API Fetch Logic (Sagalya entities sobat)
  const fetchFarmers = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam =
        sortBy === "pending"
          ? "PENDING"
          : sortBy === "approved"
            ? "APPROVED"
            : undefined;

      const res = await farmerApi.getAllFarmers({
        page: page - 1,
        size: ITEMS_PER_PAGE,
        search: search || undefined,
        status: statusParam,
      });

      // Backend response structure check kar (content & totalElements)
      const responseData = res.data?.data || {};
      const content = responseData.content || [];

      setFarmersData(content);
      setTotalElements(responseData.totalElements || 0);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch farmers.");
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy]);

  useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  // ✅ 2. Delete Function
  const deleteFarmer = async (id) => {
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      try {
        await farmerApi.deleteFarmer(id);
        toast.success("Farmer moved to Archive!");
        fetchFarmers(); // Refresh List
      } catch (error) {
        toast.error("Failed to delete farmer.");
      }
    }
  };

  const totalPages = Math.ceil(totalElements / ITEMS_PER_PAGE) || 1;

  // ✅ 3. PDF Export Logic
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Agrowmart - All Farmers List", 14, 15);
    autoTable(doc, {
      head: [
        ["Name", "Phone", "Email", "Vendor Type", "Subscription", "Status"],
      ],
      body: farmersData.map((f) => [
        f.name || "-",
        f.phone || "-",
        f.email || "-",
        f.vendorType || "FARMER",
        f.subscriptionPlan || "BASIC",
        f.accountStatus || "PENDING",
      ]),
      startY: 20,
      headStyles: { fillColor: [101, 163, 13] },
    });
    doc.save("Agrowmart_Farmers.pdf");
  };

  if (loading)
    return (
      <div className="p-10 text-center flex flex-col items-center gap-2 min-h-screen justify-center">
        <Loader2 className="animate-spin text-lime-600" size={40} />
        <p className="text-gray-500 font-medium">Updating farmers list...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-left w-full overflow-x-hidden font-sans">
      {/* Header & Export Buttons */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
            All Farmers List{" "}
            <span className="text-gray-500 font-normal">
              (Total {totalElements} found)
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">
            Manage registered agricultural producers
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-red-200 text-red-600 rounded-md text-xs font-bold hover:bg-red-50 shadow-sm transition-all"
          >
            <FileText size={14} /> PDF
          </button>
          <button
            onClick={() => navigate("/deletedfarmers")}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm font-semibold hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            <Trash2 size={16} /> Deleted
          </button>
        </div>
      </div>

      {/* Search & Sort Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name, email or phone"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md text-sm outline-none focus:border-green-500 bg-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none font-medium text-gray-600"
        >
          <option value="popular">Sort by : Default</option>
          <option value="pending">Pending First</option>
          <option value="approved">Approved First</option>
        </select>
      </div>

      {/* Table Section - Exact UI Columns */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">
                FARMER NAME
              </th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">
                PHONE NUMBER
              </th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">
                EMAIL ADDRESS
              </th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">
                VENDOR TYPE
              </th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">
                SUBSCRIPTION
              </th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase text-center">
                STATUS
              </th>
              <th className="px-4 py-3 text-xs font-bold text-gray-600 uppercase text-center">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {farmersData.length > 0 ? (
              farmersData.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={f.photoUrl || "https://via.placeholder.com/40"}
                        className="w-8 h-8 rounded-full border shadow-sm object-cover"
                        alt=""
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/40")
                        }
                      />
                      <div>
                        <p className="font-semibold text-gray-700 leading-none">
                          {f.name || "-"}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                          {f.village || "-"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-medium">
                    {f.phone || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{f.email || "-"}</td>
                  <td className="px-4 py-3 text-gray-600 uppercase text-[10px] font-bold">
                    {f.vendorType || "FARMER"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-[10px] font-black bg-blue-50 text-blue-600 uppercase border border-blue-100">
                      {f.subscriptionPlan || "BASIC"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase border ${
                        f.accountStatus === "APPROVED"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-yellow-50 text-yellow-600 border-yellow-100"
                      }`}
                    >
                      {f.accountStatus || "PENDING"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                    <button
                      onClick={() => navigate(`/farmer/${f.id}`)}
                      className="px-3 py-1 border border-green-600 text-green-600 rounded-md text-xs font-bold hover:bg-green-600 hover:text-white transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteFarmer(f.id)}
                      className="p-1.5 border border-red-200 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-8 text-center text-gray-400 font-semibold"
                  colSpan={7}
                >
                  No farmers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-end items-center gap-1.5 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-3 py-1 font-bold text-xs ${page === 1 ? "text-gray-300" : "text-gray-700 hover:text-green-600"}`}
        >
          PREV
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-7 h-7 rounded text-xs font-bold transition-all ${
              page === i + 1
                ? "bg-green-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {i + 1}
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
  );
};

export default Farmers;
