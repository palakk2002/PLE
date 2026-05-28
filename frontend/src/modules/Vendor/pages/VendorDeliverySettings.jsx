import { useState } from "react";
import {
  FiTruck,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiAlertTriangle,
  FiSettings,
  FiTrendingUp,
  FiPlus,
  FiTrash2,
  FiSave
} from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const VendorDeliverySettings = () => {
  // Local states for configuration
  const [expressEligible, setExpressEligible] = useState(true);
  const [processingTime, setProcessingTime] = useState("2"); // 2 hours for express
  const [standardLeadTime, setStandardLeadTime] = useState("24"); // 24 hours for standard
  const [newPincode, setNewPincode] = useState("");
  const [coveragePincodes, setCoveragePincodes] = useState([
    "400001",
    "400002",
    "400012",
    "400025",
    "400050"
  ]);

  // Handle add pincode
  const handleAddPincode = (e) => {
    e.preventDefault();
    const cleanPin = newPincode.trim();
    if (!cleanPin || cleanPin.length < 5) {
      toast.error("Please enter a valid postal code");
      return;
    }
    if (coveragePincodes.includes(cleanPin)) {
      toast.error("This postal code is already registered");
      return;
    }
    setCoveragePincodes([...coveragePincodes, cleanPin]);
    setNewPincode("");
    toast.success(`Postal code ${cleanPin} added to coverage!`);
  };

  // Handle remove pincode
  const handleRemovePincode = (pin) => {
    setCoveragePincodes(coveragePincodes.filter((p) => p !== pin));
    toast.success(`Postal code ${pin} removed from coverage`);
  };

  // Save settings
  const handleSaveSettings = () => {
    toast.success("Logistics configurations updated successfully!");
  };

  // Performance statistics cards
  const stats = [
    {
      label: "Fast Dispatch Rate",
      value: "94.2%",
      desc: "SLA handover within 2 hrs",
      icon: FiTrendingUp,
      color: "bg-emerald-50 text-emerald-700 border-emerald-100"
    },
    {
      label: "On-Time Dispatch %",
      value: "98.7%",
      desc: "Platform benchmark is 96%",
      icon: FiCheckCircle,
      color: "bg-amber-50 text-amber-700 border-amber-100"
    },
    {
      label: "Delayed Handover Counts",
      value: "2 shipments",
      desc: "Critical SLA warnings",
      icon: FiAlertTriangle,
      color: "bg-red-50 text-red-700 border-red-100 animate-pulse"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-6xl mx-auto pb-12"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 flex items-center gap-2.5">
          <FiTruck className="text-[#C07A3D]" /> Delivery & Logistics Setup
        </h1>
        <p className="text-sm text-gray-500">
          Configure Same-City express delivery options, manage local shipping coverage zones, and track your SLA dispatch fulfillment.
        </p>
      </div>

      {/* Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className={`p-5 rounded-2xl border bg-white flex items-center gap-4 shadow-sm ${s.color}`}>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">{s.label}</p>
                <h3 className="text-xl font-extrabold mt-0.5">{s.value}</h3>
                <p className="text-xs opacity-85 mt-0.5">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Settings Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Settings Form (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
              <FiSettings className="text-[#C07A3D]" /> Fulfillment SLA Timelines
            </h2>

            {/* Same-city express activation */}
            <div className="flex items-start justify-between gap-6 p-4 bg-gray-55 rounded-2xl border border-gray-100">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-800">Same-City Express Dispatch</h3>
                <p className="text-xs text-gray-400 leading-normal max-w-md">
                  Activate express shipment for customers located in your city. Orders must be packaged and handed to the delivery courier inside the designated processing window.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpressEligible(!expressEligible)}
                className={`w-14 h-8 rounded-full transition-all duration-300 relative ${
                  expressEligible ? "bg-[#C07A3D]" : "bg-gray-250"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-md ${
                    expressEligible ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Timing controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                  <FiClock /> Same-City Handover Deadline
                </label>
                <select
                  disabled={!expressEligible}
                  value={processingTime}
                  onChange={(e) => setProcessingTime(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C07A3D] font-medium"
                >
                  <option value="1">1 Hour (Super Fast Dispatch)</option>
                  <option value="2">2 Hours (Standard Express)</option>
                  <option value="4">4 Hours (Flexible Same-Day)</option>
                  <option value="8">8 Hours</option>
                </select>
                <p className="text-[10px] text-gray-400">
                  Time allocated from order approval to driver handover.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                  <FiClock /> Outstation Standard Dispatch Lead-time
                </label>
                <select
                  value={standardLeadTime}
                  onChange={(e) => setStandardLeadTime(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C07A3D] font-medium"
                >
                  <option value="12">12 Hours (Half Day)</option>
                  <option value="24">24 Hours (Next Day Dispatch)</option>
                  <option value="48">48 Hours (2 Business Days)</option>
                  <option value="72">72 Hours</option>
                </select>
                <p className="text-[10px] text-gray-400">
                  Target timeline to pack and handover outstation regional cargo.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="py-2.5 px-6 bg-[#C07A3D] hover:bg-[#A96328] text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-[#C07A3D]/25 flex items-center justify-center gap-1.5"
              >
                <FiSave className="w-4 h-4" /> Save Timeline Rules
              </button>
            </div>
          </div>
        </div>

        {/* Coverage Pincodes List (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
              <FiMapPin className="text-[#C07A3D]" /> Express Local Coverage
            </h2>

            {/* Add pincode form */}
            <form onSubmit={handleAddPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={newPincode}
                onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Pincode (e.g. 400005)"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C07A3D]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1"
              >
                <FiPlus className="w-4.5 h-4.5" /> Add
              </button>
            </form>

            {/* List */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {coveragePincodes.map((pin) => (
                <div key={pin} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100/50 transition-colors">
                  <span className="text-xs font-mono font-bold text-gray-800">{pin}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePincode(pin)}
                    className="p-1 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {coveragePincodes.length === 0 && (
                <p className="text-[10px] text-gray-400 text-center py-4">
                  No registered pincodes. Express shipping is disabled platform-wide.
                </p>
              )}
            </div>

            <p className="text-[10px] text-gray-400 leading-normal border-t border-gray-100 pt-3">
              Buyers inside registered postal zones will be automatically eligible for Same-City Express fast shipping.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VendorDeliverySettings;
