import React from 'react';
import { useBusinessBuyer } from '../../hooks/useBusinessBuyer';
import { FiBriefcase } from 'react-icons/fi';

export const B2BBusinessBadge = ({ className = '' }) => {
  const { isBusiness } = useBusinessBuyer();

  if (!isBusiness) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black tracking-wide shadow-sm animate-pulse ${className}`}
    >
      <FiBriefcase className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
      <span>Business Account</span>
    </span>
  );
};

export default B2BBusinessBadge;
