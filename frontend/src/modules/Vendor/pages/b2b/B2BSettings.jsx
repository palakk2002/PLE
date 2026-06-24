import { useState, useEffect } from "react";
import {
  FiSettings,
  FiMessageSquare,
  FiCreditCard,
  FiTruck,
  FiBell,
  FiSave,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useVendorB2BStore } from "../../store/vendorB2BStore";
import toast from "react-hot-toast";

const B2BSettings = () => {
  const { settings, fetchSettings, updateSettings } = useVendorB2BStore();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    autoResponse: false,
    autoResponseMessage: "",
    defaultPaymentTerms: "",
    defaultShippingTerms: "",
    minimumOrderValue: 50000,
    defaultQuoteValidity: 15,
    notifyOnNewEnquiry: true,
    notifyOnQuoteResponse: true,
    notifyOnEnquiryExpiring: true,
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchSettings();
      setLoading(false);
    };
    loadData();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setForm({
        autoResponse: settings.autoResponse || false,
        autoResponseMessage: settings.autoResponseMessage || "",
        defaultPaymentTerms: settings.defaultPaymentTerms || "",
        defaultShippingTerms: settings.defaultShippingTerms || "",
        minimumOrderValue: settings.minimumOrderValue || 50000,
        defaultQuoteValidity: settings.defaultQuoteValidity || 15,
        notifyOnNewEnquiry: settings.notifyOnNewEnquiry ?? true,
        notifyOnQuoteResponse: settings.notifyOnQuoteResponse ?? true,
        notifyOnEnquiryExpiring: settings.notifyOnEnquiryExpiring ?? true,
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(form);
      toast.success("B2B settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#C07A3D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 max-w-4xl"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 lg:hidden mb-1">
          B2B Settings
        </h1>
        <p className="text-sm text-gray-500 lg:hidden">
          Configure default values and notifications for the RFQ system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Rules & Quotation Defaults */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3 text-base">
            <FiSettings className="text-amber-800" />
            Core B2B Trading Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-550 mb-1.5">
                Minimum Order Value for RFQs (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">₹</span>
                <input
                  type="number"
                  name="minimumOrderValue"
                  value={form.minimumOrderValue}
                  onChange={handleChange}
                  className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                  min="0"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Buyers cannot request quotes for orders below this total estimated target price.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-550 mb-1.5">
                Default Quotation Validity (Days)
              </label>
              <input
                type="number"
                name="defaultQuoteValidity"
                value={form.defaultQuoteValidity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                min="1"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Standard number of days a submitted quotation remains valid before automatic expiration.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-550 mb-1.5 flex items-center gap-1.5">
                <FiCreditCard className="text-gray-400" /> Default Payment Terms
              </label>
              <input
                type="text"
                name="defaultPaymentTerms"
                value={form.defaultPaymentTerms}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                placeholder="e.g. Net 30, COD, 50% advance"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-550 mb-1.5 flex items-center gap-1.5">
                <FiTruck className="text-gray-400" /> Default Shipping & Delivery Terms
              </label>
              <input
                type="text"
                name="defaultShippingTerms"
                value={form.defaultShippingTerms}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                placeholder="e.g. FOB Origin, Free delivery"
                required
              />
            </div>
          </div>
        </div>

        {/* Auto Response Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
              <FiMessageSquare className="text-amber-800" />
              Automated Customer Responses
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="autoResponse"
                checked={form.autoResponse}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-250 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-800"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-550 mb-1.5">
              Auto-Acknowledgment Message (Sent to buyer immediately upon RFQ)
            </label>
            <textarea
              name="autoResponseMessage"
              value={form.autoResponseMessage}
              onChange={handleChange}
              disabled={!form.autoResponse}
              className={`w-full h-[100px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm leading-relaxed ${
                form.autoResponse ? "bg-white border-gray-200" : "bg-gray-50 border-gray-150 text-gray-400"
              }`}
              placeholder="Thank you for submitting a Request For Quotation. We will review your product requirement list and submit a custom wholesale quotation shortly."
            ></textarea>
            <p className="text-xs text-gray-400 mt-1">
              Provides reassurance to corporate buyers that their enquiry is actively being compiled.
            </p>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3 text-base">
            <FiBell className="text-amber-800" />
            Wholesale Notification Settings
          </h2>

          <div className="divide-y divide-gray-100 text-sm">
            {/* Notify 1 */}
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-gray-800">New RFQ Inquiries</p>
                <p className="text-xs text-gray-500">Get push updates and emails when new B2B inquiries are assigned to you.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyOnNewEnquiry"
                  checked={form.notifyOnNewEnquiry}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-800"></div>
              </label>
            </div>

            {/* Notify 2 */}
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-gray-800">Quote Approvals / Rejections</p>
                <p className="text-xs text-gray-500">Get real-time updates when buyers accept or reject your quoted prices.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyOnQuoteResponse"
                  checked={form.notifyOnQuoteResponse}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-800"></div>
              </label>
            </div>

            {/* Notify 3 */}
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-gray-800">Quote Expiration Warnings</p>
                <p className="text-xs text-gray-500">Get alert 48 hours before an outstanding quote validity is set to expire.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyOnEnquiryExpiring"
                  checked={form.notifyOnEnquiryExpiring}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-800"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <FiSave /> Save B2B Configuration
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default B2BSettings;
