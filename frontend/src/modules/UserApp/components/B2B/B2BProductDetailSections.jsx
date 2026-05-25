import React from 'react';
import { useBusinessBuyer } from '../../hooks/useBusinessBuyer';
import { formatPrice } from '../../../../shared/utils/helpers';
import { FiPercent, FiTruck, FiShield, FiBriefcase } from 'react-icons/fi';

export const B2BProductDetailSections = ({ product }) => {
  const { isBusiness, getWholesaleSpecs } = useBusinessBuyer();

  if (!isBusiness) return null;

  const specs = getWholesaleSpecs(product.id, product.price);

  return (
    <div className="border-t border-gray-100 pt-6 mt-6 space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
          Wholesale Specifications
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
              <FiPercent size={20} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block">GST input credit</span>
              <span className="text-sm font-bold text-gray-800">
                {specs.gstSlab}% GST Claimable
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
              <FiTruck size={20} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block">Bulk Delivery</span>
              <span className="text-sm font-bold text-gray-800">3 - 5 Dispatch Days</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
              <FiBriefcase size={20} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block">Credit Terms</span>
              <span className="text-sm font-bold text-gray-800">NET 30 Available</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
              <FiShield size={20} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block">Packaging</span>
              <span className="text-sm font-bold text-gray-800">
                {specs.unitsPerCarton} {product.unit}s/Carton
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-50/50 rounded-xl p-4 border border-primary-100 flex items-start gap-3">
        <FiBriefcase className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-primary-800 space-y-1">
          <p className="font-bold text-sm">💡 Business Buyer Benefit Info</p>
          <p>
            GSTIN is pre-filled from your profile on invoices. Bulk shipping rates are automatically calculated during checkout. For custom high-volume contract pricing (&gt;500 units), use the "Request Wholesale Quote" button below.
          </p>
        </div>
      </div>
    </div>
  );
};

export default B2BProductDetailSections;
