import React from 'react';
import { FiTrendingDown } from 'react-icons/fi';

export const B2BWholesaleBadge = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-0.5',
    sm: 'px-2 py-0.8 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full bg-primary-50 text-primary-600 border border-primary-100 ${sizeClasses[size]} ${className}`}
    >
      <FiTrendingDown className="flex-shrink-0" />
      <span>Wholesale</span>
    </span>
  );
};
export default B2BWholesaleBadge;
