import React from "react";
import { FiCheck } from "react-icons/fi";

const RefundOptionCard = ({
  id,
  title,
  note,
  selected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`relative cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex items-start gap-3 select-none ${
        selected
          ? "border-[#7B0A0A] bg-red-50/30 dark:bg-red-950/10 shadow-md ring-1 ring-[#7B0A0A]"
          : "border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] hover:border-gray-300 dark:hover:border-white/20 shadow-sm"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${
          selected
            ? "border-[#7B0A0A] bg-[#7B0A0A] text-white"
            : "border-gray-300 dark:border-white/30 bg-white dark:bg-[#222]"
        }`}
      >
        {selected && <FiCheck className="text-[10px] stroke-[4]" />}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">
          {title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
          {note}
        </p>
      </div>
    </div>
  );
};

export default RefundOptionCard;
