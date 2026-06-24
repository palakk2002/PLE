import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSettings,
  FiShield,
  FiPercent,
  FiShoppingBag,
  FiBell,
  FiSave,
  FiInfo,
} from "react-icons/fi";
import AnimatedSelect from "../../components/AnimatedSelect";
import toast from "react-hot-toast";
import { getSettingByKey, updateSettingByKey } from "../../services/adminService";
import { useNavigate } from "react-router-dom";

const B2BSettings = () => {
  const navigate = useNavigate();

  // Verification Settings
  const [autoApprove, setAutoApprove] = useState(false);
  const [requireGST, setRequireGST] = useState(true);
  const [requirePAN, setRequirePAN] = useState(true);
  const [requireTradeLicense, setRequireTradeLicense] = useState(false);

  // Pricing Rules
  const [defaultCreditTerms, setDefaultCreditTerms] = useState("Net 30");
  const [minWholesaleDiscount, setMinWholesaleDiscount] = useState(15);
  const [allowBulkSlabs, setAllowBulkSlabs] = useState(true);

  // Order Settings
  const [minOrderValue, setMinOrderValue] = useState(10000);
  const [autoInvoice, setAutoInvoice] = useState(true);

  // Notification Settings
  const [notifyNewSignup, setNotifyNewSignup] = useState(true);
  const [notifyNewOrder, setNotifyNewOrder] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettingByKey("b2b");
        if (response?.data?.value) {
          const s = response.data.value;
          if (s.autoApprove !== undefined) setAutoApprove(s.autoApprove);
          if (s.requireGST !== undefined) setRequireGST(s.requireGST);
          if (s.requirePAN !== undefined) setRequirePAN(s.requirePAN);
          if (s.requireTradeLicense !== undefined) setRequireTradeLicense(s.requireTradeLicense);
          if (s.defaultCreditTerms !== undefined) setDefaultCreditTerms(s.defaultCreditTerms);
          if (s.minWholesaleDiscount !== undefined) setMinWholesaleDiscount(s.minWholesaleDiscount);
          if (s.allowBulkSlabs !== undefined) setAllowBulkSlabs(s.allowBulkSlabs);
          if (s.minOrderValue !== undefined) setMinOrderValue(s.minOrderValue);
          if (s.autoInvoice !== undefined) setAutoInvoice(s.autoInvoice);
          if (s.notifyNewSignup !== undefined) setNotifyNewSignup(s.notifyNewSignup);
          if (s.notifyNewOrder !== undefined) setNotifyNewOrder(s.notifyNewOrder);
        }
      } catch (error) {
        console.warn("Could not fetch B2B settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettingByKey("b2b", {
        value: {
          autoApprove,
          requireGST,
          requirePAN,
          requireTradeLicense,
          defaultCreditTerms,
          minWholesaleDiscount,
          allowBulkSlabs,
          minOrderValue,
          autoInvoice,
          notifyNewSignup,
          notifyNewOrder,
        }
      });
      toast.success("B2B Settings updated successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      toast.error("Failed to update B2B Settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">
          B2B Settings
        </h1>
        <p className="text-sm text-gray-500">
          Configure business verification criteria, credit limit protocols, pricing slabs, and notification rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Verification Settings Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <FiShield className="w-5 h-5 text-blue-600" />
            Verification & Compliance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-gray-700">Auto-Approve Business Signups</label>
                <p className="text-xs text-gray-400">If disabled, new business signups remain pending until GSTIN is manually verified.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">Required Documentation</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requireGST}
                    onChange={(e) => setRequireGST(e.target.checked)}
                    className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-700">GST Registration</p>
                    <p className="text-[10px] text-gray-400">Mandatory for GSTIN</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requirePAN}
                    onChange={(e) => setRequirePAN(e.target.checked)}
                    className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-700">Company PAN Card</p>
                    <p className="text-[10px] text-gray-400">For taxation checks</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requireTradeLicense}
                    onChange={(e) => setRequireTradeLicense(e.target.checked)}
                    className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-700">Trade License</p>
                    <p className="text-[10px] text-gray-400">Verify retail status</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Rules Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <FiPercent className="w-5 h-5 text-teal-600" />
            Wholesale Pricing & Credit Slabs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Default Approved Credit Terms</label>
              <AnimatedSelect
                value={defaultCreditTerms}
                onChange={(e) => setDefaultCreditTerms(e.target.value)}
                options={[
                  { value: "Prepaid Only", label: "Prepaid Only" },
                  { value: "Net 15", label: "Net 15 Days Credit" },
                  { value: "Net 30", label: "Net 30 Days Credit" },
                  { value: "Net 45", label: "Net 45 Days Credit" },
                ]}
                className="w-full"
              />
              <p className="text-[10px] text-gray-400">Standard payment timeline allowed to verified business partners.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Minimum Wholesale Discount (%)</label>
              <input
                type="number"
                value={minWholesaleDiscount}
                onChange={(e) => setMinWholesaleDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                min="0"
                max="90"
              />
              <p className="text-[10px] text-gray-400">Minimum markdown required on B2B listings relative to B2C retail.</p>
            </div>

            <div className="flex items-center justify-between col-span-1 sm:col-span-2 pt-2">
              <div>
                <label className="text-sm font-semibold text-gray-700">Allow Multiple Bulk Slabs</label>
                <p className="text-xs text-gray-400">Allow sellers to set progressive pricing tiers (e.g. 10-20 units: 10% off, 20-50 units: 15% off).</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowBulkSlabs}
                  onChange={(e) => setAllowBulkSlabs(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Settings Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <FiShoppingBag className="w-5 h-5 text-amber-600" />
            B2B Procurement & Order Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Minimum B2B Order Value (₹)</label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-bold text-gray-900"
                min="0"
                step="500"
              />
              <p className="text-[10px] text-gray-400">Orders must meet this minimum threshold to qualify for wholesale rates.</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <label className="text-sm font-semibold text-gray-700">Auto-Generate GST Tax Invoices</label>
                <p className="text-xs text-gray-400">Instantly generate PDF tax invoice with buyer GSTIN upon order validation.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoInvoice}
                  onChange={(e) => setAutoInvoice(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <FiBell className="w-5 h-5 text-purple-600" />
            Communication & Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-gray-700">Notify Admin on New B2B Registrations</label>
                <p className="text-xs text-gray-400">Receive system alerts when a new business signs up with GST credentials.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifyNewSignup}
                  onChange={(e) => setNotifyNewSignup(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold text-gray-700">Notify Admin on High-Value B2B Orders</label>
                <p className="text-xs text-gray-400">Receive alert when wholesale transactions exceeding ₹50,000 are placed.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notifyNewOrder}
                  onChange={(e) => setNotifyNewOrder(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-xs sm:text-sm text-amber-800">
          <FiInfo className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">B2B Core System Policy Reminder</p>
            <p className="mt-0.5 text-amber-700/90 leading-relaxed">
              Modifying wholesale settings updates global validation triggers. These rules affect MOQ validations at the cart and tax configurations during invoice rendering.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <FiSave className="w-5 h-5" />
            {saving ? "Saving Changes..." : "Save B2B Settings"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default B2BSettings;
