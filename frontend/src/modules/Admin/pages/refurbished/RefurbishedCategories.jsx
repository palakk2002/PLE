import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiToggleLeft,
  FiToggleRight,
  FiPercent,
  FiSave,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

// Initial categories mapping setup
const DEFAULT_CATEGORY_SETTINGS = [
  { id: 1, name: "Clothing", refurbished: true, renewed: false, openBox: true, commission: 8 },
  { id: 2, name: "Footwear", refurbished: true, renewed: true, openBox: true, commission: 9 },
  { id: 3, name: "Bags", refurbished: true, renewed: false, openBox: true, commission: 8 },
  { id: 4, name: "Jewelry", refurbished: true, renewed: true, openBox: false, commission: 10 },
  { id: 5, name: "Accessories", refurbished: true, renewed: false, openBox: true, commission: 8 },
  { id: 6, name: "Athletic", refurbished: true, renewed: true, openBox: true, commission: 8 },
];

const RefurbishedCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("refurbished-categories-settings");
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(DEFAULT_CATEGORY_SETTINGS);
      localStorage.setItem("refurbished-categories-settings", JSON.stringify(DEFAULT_CATEGORY_SETTINGS));
    }
  }, []);

  const handleToggle = (id, key) => {
    const updated = categories.map((cat) => {
      if (cat.id === id) {
        return { ...cat, [key]: !cat[key] };
      }
      return cat;
    });
    setCategories(updated);
    localStorage.setItem("refurbished-categories-settings", JSON.stringify(updated));
  };

  const handleCommissionChange = (id, value) => {
    const parsed = parseFloat(value) || 0;
    const updated = categories.map((cat) => {
      if (cat.id === id) {
        return { ...cat, commission: parsed };
      }
      return cat;
    });
    setCategories(updated);
    localStorage.setItem("refurbished-categories-settings", JSON.stringify(updated));
  };

  const handleSaveAll = () => {
    localStorage.setItem("refurbished-categories-settings", JSON.stringify(categories));
    toast.success("Category mappings saved successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <FiGrid className="text-[#C07A3D]" />
            Category Management
          </h1>
          <p className="text-sm text-gray-500">
            Map open-box sections, renewed sub-routes, and adjust commission rates overrides safely.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#C07A3D] hover:bg-[#D18B4A] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <FiSave /> Save Configuration
        </button>
      </div>

      {/* Grid of Categories Map */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 text-base pb-3 border-b border-gray-100 flex items-center justify-between">
          <span>Active Category Marketplace Mapping</span>
          <span className="text-xs text-gray-400 font-semibold uppercase">Overrides</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-3">
                <th className="pb-3">Base Category</th>
                <th className="pb-3 text-center">Refurbished Section</th>
                <th className="pb-3 text-center">Renewed Section</th>
                <th className="pb-3 text-center">Open-Box Section</th>
                <th className="pb-3 text-right">Commission Override (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-bold text-gray-800 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200/80 flex items-center justify-center font-black text-gray-500 text-xs shadow-sm">
                      {cat.name.charAt(0)}
                    </div>
                    {cat.name}
                  </td>
                  <td className="py-4 text-center">
                    <button
                      onClick={() => handleToggle(cat.id, "refurbished")}
                      className={`text-2xl transition-all ${
                        cat.refurbished ? "text-[#C07A3D]" : "text-gray-300"
                      }`}
                    >
                      {cat.refurbished ? <FiToggleRight /> : <FiToggleLeft />}
                    </button>
                  </td>
                  <td className="py-4 text-center">
                    <button
                      onClick={() => handleToggle(cat.id, "renewed")}
                      className={`text-2xl transition-all ${
                        cat.renewed ? "text-[#C07A3D]" : "text-gray-300"
                      }`}
                    >
                      {cat.renewed ? <FiToggleRight /> : <FiToggleLeft />}
                    </button>
                  </td>
                  <td className="py-4 text-center">
                    <button
                      onClick={() => handleToggle(cat.id, "openBox")}
                      className={`text-2xl transition-all ${
                        cat.openBox ? "text-[#C07A3D]" : "text-gray-300"
                      }`}
                    >
                      {cat.openBox ? <FiToggleRight /> : <FiToggleLeft />}
                    </button>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <FiPercent className="text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={cat.commission}
                        onChange={(e) => handleCommissionChange(cat.id, e.target.value)}
                        className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-right font-bold text-gray-800 focus:outline-none"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info warning */}
      <div className="bg-[#C07A3D]/5 border border-[#C07A3D]/20 p-5 rounded-2xl flex gap-3 text-xs leading-relaxed text-gray-600">
        <FiInfo className="text-[#C07A3D] text-lg flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-gray-800">Operational Policy Note:</span>
          <p>
            Enabling specific sections overlays the respective condition tab option inside B2C product filters dynamically. Commission overrides represent the percentage deductions calculated per sale under the Refurbished Marketplace catalog policy.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RefurbishedCategories;
