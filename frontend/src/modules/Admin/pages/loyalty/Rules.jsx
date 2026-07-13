import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSave, FiSettings, FiAward } from "react-icons/fi";
import api from "../../../../shared/utils/api";
import toast from "react-hot-toast";

const LoyaltyRules = () => {
  const [formData, setFormData] = useState({
    pointsPerOrder: 50,
    pointsPerAmountSpent: 5,
    purchaseAmountUnit: 100,
    pointsToRupeeRatio: 5,
    minRedeemPoints: 50,
    maxRedemptionPercent: 50,
    enabled: true,

    b2bEnabled: true,
    b2bPointsPerAmountSpent: 5,
    b2bPurchaseAmountUnit: 100,
    b2bPointsToRupeeRatio: 5,
    b2bMinRedeemPoints: 50,
    b2bMaxRedemptionPercent: 50,
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
            purchaseAmountUnit: rules.purchaseAmountUnit ?? 100,
            pointsToRupeeRatio: rules.pointsToRupeeRatio ?? (rules.redemptionRatio ? Math.round(1 / rules.redemptionRatio) : 5),
            minRedeemPoints: rules.minRedeemPoints ?? 50,
            maxRedemptionPercent: rules.maxRedemptionPercent ?? 50,
            enabled: rules.enabled ?? true,

            b2bEnabled: rules.b2bEnabled ?? true,
            b2bPointsPerAmountSpent: rules.b2bPurchaseToPointsRatio ?? 5,
            b2bPurchaseAmountUnit: rules.b2bPurchaseAmountUnit ?? 100,
            b2bPointsToRupeeRatio: rules.b2bPointsToRupeeRatio ?? (rules.b2bRedemptionRatio ? Math.round(1 / rules.b2bRedemptionRatio) : 5),
            b2bMinRedeemPoints: rules.b2bMinRedeemPoints ?? 50,
            b2bMaxRedemptionPercent: rules.b2bMaxRedemptionPercent ?? 50,
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
        purchaseAmountUnit: formData.purchaseAmountUnit,
        redemptionRatio: 1 / (formData.pointsToRupeeRatio || 5),
        pointsToRupeeRatio: formData.pointsToRupeeRatio,
        minRedeemPoints: formData.minRedeemPoints,
        maxRedemptionPercent: formData.maxRedemptionPercent,
        enabled: formData.enabled,

        b2bEnabled: formData.b2bEnabled,
        b2bPurchaseToPointsRatio: formData.b2bPointsPerAmountSpent,
        b2bPurchaseAmountUnit: formData.b2bPurchaseAmountUnit,
        b2bPointsToRupeeRatio: formData.b2bPointsToRupeeRatio,
        b2bRedemptionRatio: 1 / (formData.b2bPointsToRupeeRatio || 5),
        b2bMinRedeemPoints: formData.b2bMinRedeemPoints,
        b2bMaxRedemptionPercent: formData.b2bMaxRedemptionPercent,
      });
      toast.success("Loyalty Program rules updated successfully!");
    } catch (err) {
      toast.error("Failed to save loyalty rules");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading configurations...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Loyalty Rules & Ratios</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Configure rule-based point allocation models and the redemption values for B2C and B2B checkouts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* B2C Configurations Card */}
        <div className="bg-white border border-gray-250/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between text-primary-750">
            <div className="flex items-center gap-2">
              <FiSettings className="text-lg" />
              <h3 className="font-extrabold text-gray-800 text-base">B2C Allocation & Redemption Policies</h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
              <input
                type="checkbox"
                name="enabled"
                checked={formData.enabled}
                onChange={handleChange}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Purchase Unit */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  B2C Purchase Amount Unit
                </label>
                <input
                  type="number"
                  name="purchaseAmountUnit"
                  value={formData.purchaseAmountUnit}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-250 focus:outline-none focus:border-amber-500 transition-colors text-base"
                />
              </div>

              {/* Spent earn ratio */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  B2C Points Earn Ratio (Points per Unit Spent)
                </label>
                <input
                  type="number"
                  name="pointsPerAmountSpent"
                  value={formData.pointsPerAmountSpent}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-250 focus:outline-none focus:border-amber-500 transition-colors text-base"
                />
              </div>

              {/* Points to Rupee ratio */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  B2C Points To Rupee Ratio (Points = ₹1)
                </label>
                <input
                  type="number"
                  name="pointsToRupeeRatio"
                  value={formData.pointsToRupeeRatio}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-250 focus:outline-none focus:border-amber-500 transition-colors text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* B2B Configurations Card */}
        <div className="bg-white border border-gray-250/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between text-primary-750">
            <div className="flex items-center gap-2">
              <FiSettings className="text-lg" />
              <h3 className="font-extrabold text-gray-800 text-base">B2B Allocation & Redemption Policies</h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
              <input
                type="checkbox"
                name="b2bEnabled"
                checked={formData.b2bEnabled}
                onChange={handleChange}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* B2B Purchase Unit */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  B2B Purchase Amount Unit
                </label>
                <input
                  type="number"
                  name="b2bPurchaseAmountUnit"
                  value={formData.b2bPurchaseAmountUnit}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-250 focus:outline-none focus:border-amber-500 transition-colors text-base"
                />
              </div>

              {/* B2B Spent earn ratio */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  B2B Points Earn Ratio (Points per Unit Spent)
                </label>
                <input
                  type="number"
                  name="b2bPointsPerAmountSpent"
                  value={formData.b2bPointsPerAmountSpent}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-250 focus:outline-none focus:border-amber-500 transition-colors text-base"
                />
              </div>

              {/* B2B Points to Rupee ratio */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  B2B Points To Rupee Ratio (Points = ₹1)
                </label>
                <input
                  type="number"
                  name="b2bPointsToRupeeRatio"
                  value={formData.b2bPointsToRupeeRatio}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-250 focus:outline-none focus:border-amber-500 transition-colors text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Options */}
        <div className="bg-white border border-gray-250/60 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                Minimum Redemption Limit (Points)
              </label>
              <input
                type="number"
                name="minRedeemPoints"
                value={formData.minRedeemPoints}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-250 focus:outline-none focus:border-amber-500 transition-colors text-base"
              />
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
        </div>
      </form>
    </motion.div>
  );
};

export default LoyaltyRules;
