import React from "react";
import RefundOptionCard from "./RefundOptionCard";

const RefundDestinationSelector = ({ selected, onChange }) => {
  const options = [
    {
      id: "Original Payment Method",
      title: "Back to Original Payment Method",
      note: "Refund will be processed to your original payment source.",
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-4 bg-white dark:bg-[#1A1A1A] shadow-sm border border-gray-100 dark:border-white/5 space-y-3">
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
        Refund Destination
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <RefundOptionCard
            key={option.id}
            id={option.id}
            title={option.title}
            note={option.note}
            selected={selected === option.id}
            onSelect={onChange}
          />
        ))}
      </div>
    </div>
  );
};

export default RefundDestinationSelector;
