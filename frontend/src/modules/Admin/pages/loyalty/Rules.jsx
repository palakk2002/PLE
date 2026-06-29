import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSave, FiSettings, FiAward } from "react-icons/fi";
import api from "../../../../shared/utils/api";
import toast from "react-hot-toast";

const LoyaltyRules = () => {
  const [formData, setFormData] = useState({
    pointsPerOrder: 50,
    pointsPerAmountSpent: 5,
    redemptionRatio: 0.2,
    minRedeemPoints: 50,
    maxRedemptionPercent: 50,
    enabled: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await api.get("/admin/loyalty/config");
        if (res && res.data) {
          const rules = res.data;
          setFormData({
            pointsPerOrder: rules.pointsPerOrder ?? 0,
            pointsPerAmountSpent: rules.purchaseToPointsRatio ?? 5,
            redemptionRatio: rules.redemptionRatio ?? 0.2,
            minRedeemPoints: rules.minRedeemPoints ?? 50,
            maxRedemptionPercent: rules.maxRedemptionPercent ?? 50,
            enabled: rules.enabled ?? true,
          });
        }
      } catch (err) {
        console.error("Failed to load rules", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRules();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (parseFloat(value) || 0),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/admin/loyalty/config", {
        pointsPerOrder: formData.pointsPerOrder,
        purchaseToPointsRatio: formData.pointsPerAmountSpent,
        purchaseAmountUnit: 100, // Fixed unit representation
        redemptionRatio: formData.redemptionRatio,
        minRedeemPoints: formData.minRedeemPoints,
        maxRedemptionPercent: formData.maxRedemptionPercent,
        enabled: formData.enabled,
      });
      toast.success("Loyalty Program rules updated successfully!");
    } catch (err) {
      toast.error("Failed to save loyalty rules");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Loyalty Rules & Ratios</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Configure rule-based point allocation models and the redemption values for buyer checkouts.
        </p>
      </div>

      <div className="bg-white border border-gray-250/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2 text-primary-750">
          <FiSettings className="text-lg" />
          <h3 className="font-extrabold text-gray-800 text-base">Allocation & Redemption Policies</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Points per order */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Bonus Points Per Order
              </label>
              <input
                type="number"
                name="pointsPerOrder"
                value={formData.pointsPerOrder}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-250 focus:outline-none focus:border-amber-500 transition-colors text-base"
                placeholder="e.g. 50"
              />
              <p className="text-xs text-gray-400">
                Flat points reward given on every successfully completed checkout.
              </p>
            </div>

            {/* Spent earn ratio */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Points Earn Ratio (% of Order Value)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="pointsPerAmountSpent"
                  value={formData.pointsPerAmountSpent}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-250 focus:outline-none focus:border-amber-500 transition-colors text-base pr-12"
                  placeholder="e.g. 5"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">%</span>
              </div>
              <p className="text-xs text-gray-400">
                Percentage of purchase amount converted to reward points (e.g. 5% means ₹100 spend earns 5 points).
              </p>
            </div>

            {/* Redemption ratio */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Redemption Conversion Ratio (1 Point = ₹ Value)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">₹</span>
                <input
                  type="number"
                  name="redemptionRatio"
                  value={formData.redemptionRatio}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  required
                  className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-250 focus:outline-none focus:border-amber-500 transition-colors text-base"
                  placeholder="e.g. 0.10"
                />
              </div>
              <p className="text-xs text-gray-400">
                The equivalent cash discount value of one points token at checkout (e.g. 0.10 means 1 point equals ₹0.10).
              </p>
            </div>
          </div>

          {/* Policy Preview Sandbox */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 space-y-3">
            <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-1.5">
              <FiAward className="text-base" />
              <span>Simulated Rewards Calculator Preview</span>
            </h4>
            <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-amber-800">
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-sm text-center">
                <span className="text-gray-400 block font-medium mb-1 text-[10px]">On a purchase of</span>
                <span className="text-sm font-black text-gray-800">₹1,000</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-sm text-center">
                <span className="text-gray-400 block font-medium mb-1 text-[10px]">User earns</span>
                <span className="text-sm font-black text-emerald-600">
                  +{Math.round((1000 / 100) * formData.pointsPerAmountSpent)} Pts
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-sm text-center">
                <span className="text-gray-400 block font-medium mb-1 text-[10px]">Points value</span>
                <span className="text-sm font-black text-amber-600">
                  ₹{(Math.round((1000 / 100) * formData.pointsPerAmountSpent) * formData.redemptionRatio).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow shadow-amber-200"
            >
              <FiSave />
              Save Rules Configuration
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LoyaltyRules;
