import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Trash2,
  X,
  Star,
  User,
  MapPin,
  ShieldCheck,
  Check,
  Ban,
  Landmark,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { farmerApi } from "../../../api/farmerApi";

const FarmerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info");
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [farmerData, setFarmerData] = useState(null);

  const [docStatuses, setDocStatuses] = useState({
    aadhaarStatus: "PENDING",
    panStatus: "PENDING",
    udhyamStatus: "PENDING",
    rejectionReason: "",
  });

  const [accountStatus, setAccountStatus] = useState("PENDING");

  const loadFarmerProfile = async () => {
    try {
      setLoading(true);
      const res = await farmerApi.getFarmerById(id);
      const data = res.data?.data;
      setFarmerData(data);

      // Map actual DTO fields
      setDocStatuses({
        aadhaarStatus: data?.aadhaarStatus || "PENDING",
        panStatus: data?.panStatus || "PENDING",

        rejectionReason: data?.rejectionReason || "",
      });

      setAccountStatus(data?.accountStatus || "PENDING");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load farmer profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmerProfile();
  }, [id]);

  const updateDocStatus = (field, newStatus) => {
    setDocStatuses((prev) => ({ ...prev, [field]: newStatus }));
    toast.success(
      `${field.replace("Status", "").toUpperCase()} set to ${newStatus}`,
    );
  };

  const getVerificationPayload = (finalAccountStatus) => ({
    aadhaarStatus: docStatuses.aadhaarStatus,
    panStatus: docStatuses.panStatus,

    accountStatus: finalAccountStatus,
    rejectionReason: docStatuses.rejectionReason,
    remarks:
      finalAccountStatus === "APPROVED"
        ? "Verified by admin"
        : "Rejected by admin",
  });

  const handleApproveProfile = async () => {
    try {
      await farmerApi.approveFarmer(id, getVerificationPayload("APPROVED"));
      setAccountStatus("APPROVED");
      toast.success("Farmer approved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Approve failed");
    }
  };

  const handleRejectProfile = async () => {
    try {
      await farmerApi.rejectFarmer(id, getVerificationPayload("REJECTED"));
      setAccountStatus("REJECTED");
      toast.success("Farmer rejected successfully");
    } catch (error) {
      console.error(error);
      toast.error("Reject failed");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure you want to move this farmer to archive?")
    )
      return;

    try {
      await farmerApi.deleteFarmer(id);
      toast.success("Farmer moved to archive!");
      navigate("/farmers");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-2">
        <Loader2 className="animate-spin text-lime-600" size={38} />
        <p className="text-gray-500 font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (!farmerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-bold">Farmer not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6 text-left font-sans">
      {/* Header - UNCHANGED */}
      <div className="max-w-full mx-auto mb-4 flex justify-between items-center px-2">
        <button
          onClick={() => navigate("/farmers")}
          className="flex items-center gap-2 text-gray-600 font-bold hover:text-black transition-all"
        >
          <ArrowLeft size={20} /> Back to Farmers
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
        >
          <Trash2 size={16} /> Delete Farmer Account
        </button>
      </div>

      {/* Profile Card - FIXED FIELDS */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-5 border-b bg-white gap-4">
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
            Farmer Verification
          </h1>
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 border shadow-inner">
            <button
              onClick={handleApproveProfile}
              className={`px-8 py-1.5 rounded-full text-xs font-black uppercase transition-all ${
                accountStatus === "APPROVED"
                  ? "bg-lime-600 text-white shadow"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              Approve Profile
            </button>
            <button
              onClick={handleRejectProfile}
              className={`px-8 py-1.5 rounded-full text-xs font-black uppercase transition-all ${
                accountStatus === "REJECTED"
                  ? "bg-red-500 text-white shadow"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              Reject Profile
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 p-6 border-b bg-white">
          <img
            src={farmerData.photoUrl || "https://via.placeholder.com/120"}
            className="w-28 h-28 rounded-2xl object-cover border-4 border-lime-50 cursor-pointer shadow-md"
            alt="Farmer"
            onClick={() => setPreviewImage(farmerData.photoUrl)}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/120";
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-3xl text-gray-900">
                {farmerData.name || "-"}
              </h2>
              {farmerData.phoneVerified && (
                <ShieldCheck size={24} className="text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 font-medium">
              <MapPin size={16} className="text-red-500" />
              {farmerData.village || "-"}, {farmerData.district || "-"},{" "}
              {farmerData.state || "-"}
            </p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold text-gray-400 uppercase tracking-widest border">
                UUID: {farmerData.uuid || "-"}
              </span>
              <span
                className={`text-[10px] px-2 py-1 rounded font-bold uppercase border ${
                  accountStatus === "APPROVED"
                    ? "bg-green-50 text-green-600"
                    : accountStatus === "REJECTED"
                      ? "bg-red-50 text-red-600"
                      : "bg-yellow-50 text-yellow-600"
                }`}
              >
                Account: {accountStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs - UNCHANGED */}
        <div className="flex gap-8 px-6 border-b overflow-x-auto bg-white sticky top-0 z-10">
          {["info", "kyc", "bank", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 border-lime-600 text-lime-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "info"
                ? "Personal Info"
                : tab === "kyc"
                  ? "KYC & Documents"
                  : tab === "bank"
                    ? "Banking"
                    : "Reviews"}
            </button>
          ))}
        </div>

        {/* Content - FIXED FIELDS */}
        <div className="p-4 sm:p-8 bg-gray-50/30">
          {activeTab === "info" && (
            <Section title="BASIC CONTACT & LOCATION">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Info
                  icon={<User size={14} />}
                  label="FULL NAME"
                  value={farmerData.name}
                />
                <Info
                  icon={<Mail size={14} />}
                  label="EMAIL ADDRESS"
                  value={farmerData.email}
                />
                <Info
                  icon={<Phone size={14} />}
                  label="PHONE NUMBER"
                  value={farmerData.phone}
                />
                <Info label="VILLAGE" value={farmerData.village} />
                <Info label="DISTRICT" value={farmerData.district} />
                <Info label="STATE" value={farmerData.state} />
                <Info
                  label="LAND AREA"
                  value={`${farmerData.landAreaAcres || 0} Acres`}
                />
                <Info label="POSTAL CODE" value={farmerData.postalCode} />
                <Info label="COUNTRY" value={farmerData.country} />
              </div>
              <div className="mt-8 pt-6 border-t">
                <Info label="COMPLETE ADDRESS" value={farmerData.address} />
              </div>
            </Section>
          )}

          {activeTab === "kyc" && (
            <div className="space-y-8">
              <Section title="IDENTIFICATION NUMBERS">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <Info label="AADHAAR NO" value={farmerData.aadhaarNumber} />
                  <Info label="PAN NO" value={farmerData.panNumber} />

                  <Info
                    label="KYC CONSENT"
                    value={farmerData.kycConsentGivenAt}
                  />
                </div>
              </Section>

              <Section title="VERIFY UPLOADED DOCUMENTS">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  <DocBox
                    name="Aadhaar Card"
                    status={docStatuses.aadhaarStatus}
                    img={farmerData.aadhaarImagePath}
                    onOpen={setPreviewImage}
                    onApprove={() =>
                      updateDocStatus("aadhaarStatus", "APPROVED")
                    }
                    onReject={() =>
                      updateDocStatus("aadhaarStatus", "REJECTED")
                    }
                  />
                  <DocBox
                    name="PAN Card"
                    status={docStatuses.panStatus}
                    img={farmerData.panImagePath}
                    onOpen={setPreviewImage}
                    onApprove={() => updateDocStatus("panStatus", "APPROVED")}
                    onReject={() => updateDocStatus("panStatus", "REJECTED")}
                  />

                  <DocBox
                    name="Farm Image"
                    status="PENDING"
                    img={farmerData.farmImageUrl}
                    onOpen={setPreviewImage}
                  />
                </div>
              </Section>
            </div>
          )}

          {activeTab === "bank" && (
            <div className="max-w-4xl">
              <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
                <Landmark className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5" />
                <div className="relative z-10 space-y-12">
                  <p className="text-[10px] font-black text-lime-400 uppercase tracking-[4px]">
                    Settlement Bank Details
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <Info
                      light
                      label="ACCOUNT HOLDER"
                      value={farmerData.accountHolderName}
                    />
                    <Info light label="BANK NAME" value={farmerData.bankName} />
                    <Info light label="IFSC CODE" value={farmerData.ifscCode} />
                    <Info light label="UPI ID" value={farmerData.upiId} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-white p-6 rounded-xl border">
              <p className="text-gray-500 font-semibold">
                No reviews available yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal - UNCHANGED */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[2000] flex items-center justify-center p-6"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute top-6 right-6 text-white p-2 bg-white/10 rounded-full hover:bg-red-500 transition-all shadow-2xl">
            <X size={40} />
          </button>
          <img
            src={previewImage}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/20"
            alt="Preview"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x300?text=Image+Not+Found";
            }}
          />
        </div>
      )}
    </div>
  );
};

// Components - UNCHANGED
const Section = ({ title, children }) => (
  <div className="border border-gray-100 rounded-[32px] p-6 sm:p-10 bg-white shadow-sm mb-8">
    <h3 className="font-black mb-10 text-[12px] text-lime-600 uppercase tracking-[4px] border-l-4 border-lime-600 pl-6">
      {title}
    </h3>
    <div>{children}</div>
  </div>
);

const Info = ({ label, value, light, icon }) => (
  <div className="min-w-0 group">
    <p
      className={`text-[10px] font-black uppercase tracking-[2px] mb-2 flex items-center gap-2 ${
        light ? "text-white/40" : "text-gray-400"
      }`}
    >
      {icon} {label}
    </p>
    <p
      className={`text-sm font-black truncate leading-relaxed ${light ? "text-white" : "text-gray-700"}`}
    >
      {value || "---"}
    </p>
  </div>
);

const DocBox = ({
  name,
  status = "PENDING",
  img,
  onOpen,
  onApprove,
  onReject,
}) => {
  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";

  return (
    <div className="border border-gray-100 rounded-3xl p-5 flex flex-col bg-white shadow-sm h-full group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[11px] font-black text-gray-800 uppercase tracking-tighter pr-3">
          {name}
        </p>
        <span
          className={`px-2.5 py-1 text-[9px] font-black rounded-full uppercase border shrink-0 ${
            isApproved
              ? "bg-green-100 text-green-600 border-green-200"
              : isRejected
                ? "bg-red-100 text-red-600 border-red-200"
                : "bg-yellow-100 text-yellow-600 border-yellow-200"
          }`}
        >
          {status}
        </span>
      </div>

      <div
        className="h-44 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative cursor-pointer mb-5 shrink-0 shadow-inner"
        onClick={() => img && onOpen(img)}
      >
        <img
          src={img || "https://via.placeholder.com/400x300?text=No+File"}
          className="w-full h-full object-cover"
          alt={name}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x300?text=File+Not+Found";
          }}
        />
      </div>

      {onApprove && onReject && (
        <div className="flex gap-3 mt-auto pt-4 border-t">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              isApproved
                ? "bg-green-600 text-white border-green-600"
                : "text-green-600 border-green-200 hover:bg-green-50"
            }`}
          >
            <Check size={16} /> Approve
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              isRejected
                ? "bg-red-600 text-white border-red-600"
                : "text-red-600 border-red-100 hover:bg-red-50"
            }`}
          >
            <Ban size={16} /> Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default FarmerProfile;
