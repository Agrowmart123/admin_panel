import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, ArrowLeft, Trash2, Calendar, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { farmerApi } from "../../../api/farmerApi";

const DeletedFarmers = () => {
  const navigate = useNavigate();
  const [deletedList, setDeletedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeletedFarmers = useCallback(async () => {
    try {
      setLoading(true);

      // ⚠️ Adjust status value if backend uses different enum for deleted
      const res = await farmerApi.getAllFarmers({
        page: 0,
        size: 100,
        status: "DELETED",
      });

      const pageData = res.data?.data;
      setDeletedList(pageData?.content || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch deleted farmers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeletedFarmers();
  }, [fetchDeletedFarmers]);

  const handleRestore = async (id) => {
    try {
      await farmerApi.restoreFarmer(id);
      toast.success("Farmer account restored successfully!");
      fetchDeletedFarmers();
    } catch (error) {
      console.error(error);
      toast.error("Restore failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-2">
        <Loader2 className="animate-spin text-lime-600" size={36} />
        <p className="text-gray-500 font-semibold">Loading archive...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 text-left">
      <button
        onClick={() => navigate("/farmers")}
        className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 font-bold"
      >
        <ArrowLeft size={18} /> BACK TO FARMERS
      </button>

      <div className="mb-10">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <Trash2 className="text-red-500" size={28} /> DELETED FARMERS ARCHIVE
        </h1>
        <p className="text-sm text-gray-400 font-medium mt-1">
          Showing {deletedList.length} inactive farmer accounts
        </p>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
        {deletedList.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Farmer Profile
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Type
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Deletion Date
                </th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {deletedList.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-8 py-6 font-bold text-gray-800">
                    {f.name || "-"} <br />
                    <span className="text-[10px] text-gray-400 font-normal">
                      {f.email || "-"}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-[10px] text-indigo-500 uppercase">
                    {f.vendorType || "FARMER"}
                  </td>
                  <td className="px-8 py-6 text-red-400 font-bold text-xs">
                    <Calendar size={12} className="inline mr-1" />
                    {f.deletedAt
                      ? new Date(f.deletedAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => handleRestore(f.id)}
                      className="px-5 py-2.5 border-2 border-lime-500 text-lime-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lime-500 hover:text-white flex items-center gap-2 mx-auto"
                    >
                      <RotateCcw size={14} /> Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-20 text-center">
            <p className="text-gray-400 font-bold">
              No deleted farmers found in archive.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletedFarmers;
