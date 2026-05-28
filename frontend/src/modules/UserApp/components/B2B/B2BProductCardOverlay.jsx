import React from 'react';
import { useBusinessBuyer } from '../../hooks/useBusinessBuyer';
import { B2BWholesaleBadge } from './B2BWholesaleBadge';
import { formatPrice } from '../../../../shared/utils/helpers';
import { FiAlertCircle, FiMessageCircle, FiPackage } from 'react-icons/fi';

export const B2BProductCardOverlay = ({ product, className = '' }) => {
  const { isBusiness, getWholesaleSpecs } = useBusinessBuyer();

  if (!isBusiness) return null;

  const specs = getWholesaleSpecs(product.id, product.price);
  const bestTierPrice = specs.tiers[specs.tiers.length - 1]?.price;
  const entryTierPrice = specs.tiers[0]?.price;

  return (
    <div className={`mt-auto pt-1 md:pt-1.5 border-t border-dashed border-gray-100 flex flex-col gap-0.5 ${className}`}>
      {/* Pricing & MOQ - Extremely compact to match standard B2C price row height perfectly */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-gray-500 font-medium font-semibold">Bulk Price:</span>
          <span className="text-xs md:text-sm font-extrabold text-primary-600 leading-tight">
            {formatPrice(entryTierPrice)}
          </span>
          <span className="text-[9px] text-gray-400">/{product.unit || 'Pc'}</span>
        </div>
        <div className="text-[9px] text-gray-500 font-medium flex items-center gap-1">
          <FiAlertCircle className="w-2.5 h-2.5 text-primary-500 flex-shrink-0" />
          <span>MOQ: {specs.moq} {product.unit}s</span>
        </div>
      </div>
    </div>
  );
};

export default B2BProductCardOverlay;
