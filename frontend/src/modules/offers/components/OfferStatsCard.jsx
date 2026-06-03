import React from "react";
import { motion } from "framer-motion";

export const OfferStatsCard = ({ title, value, icon: Icon, color = "primary" }) => {
  const colorMap = {
    primary: "from-[#C07A3D]/20 to-[#C07A3D]/5 border-[#C07A3D]/30 text-[#C07A3D]",
    green: "from-green-500/20 to-green-500/5 border-green-500/30 text-green-500",
    red: "from-red-500/20 to-red-500/5 border-red-500/30 text-red-500",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-500",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-500",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-500"
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${colorMap[color] || colorMap.primary} border rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all`}
    >
      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <h4 className="text-3xl font-black text-white mt-2">{value}</h4>
      </div>
      <div className="p-4 bg-white/[0.04] rounded-2xl">
        <Icon className="text-2xl" />
      </div>
    </motion.div>
  );
};

export default OfferStatsCard;
