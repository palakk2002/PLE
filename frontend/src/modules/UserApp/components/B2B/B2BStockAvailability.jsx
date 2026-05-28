import React from 'react';
import { useBusinessBuyer } from '../../hooks/useBusinessBuyer';
import { FiAlertTriangle, FiCheckCircle, FiPackage, FiInfo } from 'react-icons/fi';

export const B2BStockAvailability = ({ product, stockQuantity = 0 }) => {
  const { isBusiness, getWholesaleSpecs } = useBusinessBuyer();

  if (!isBusiness) return null;

  const specs = getWholesaleSpecs(product.id, product.price);
  const moq = specs.moq;
  const LOW_STOCK_THRESHOLD = 20;

  const getStockStatus = () => {
    if (stockQuantity === 0 || product.stock === 'out_of_stock') {
      return {
        status: 'out_of_stock',
        message: 'Out of Stock',
        subMessage: 'Bulk quantity available on request',
        color: 'red',
        icon: <FiAlertTriangle className="w-5 h-5" />
      };
    } else if (stockQuantity < LOW_STOCK_THRESHOLD) {
      return {
        status: 'low_stock',
        message: `Only ${stockQuantity} units left`,
        subMessage: 'Bulk quantity available on request',
        color: 'orange',
        icon: <FiAlertTriangle className="w-5 h-5" />
      };
    } else if (stockQuantity >= moq * 10) {
      return {
        status: 'bulk_available',
        message: 'Bulk Stock Available',
        subMessage: `Ready for immediate dispatch (${stockQuantity} ${product.unit}s)`,
        color: 'green',
        icon: <FiCheckCircle className="w-5 h-5" />
      };
    } else {
      return {
        status: 'in_stock',
        message: 'In Stock',
        subMessage: `${stockQuantity} ${product.unit}s available`,
        color: 'green',
        icon: <FiCheckCircle className="w-5 h-5" />
      };
    }
  };

  const stockStatus = getStockStatus();

  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600'
    }
  };

  const colors = colorClasses[stockStatus.color];

  return (
    <div className={`${colors.bg} rounded-xl p-4 border ${colors.border} space-y-3`}>
      {/* Main Status */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center ${colors.iconText} flex-shrink-0`}>
          {stockStatus.icon}
        </div>
        <div className="flex-1">
          <p className={`font-bold text-sm ${colors.text}`}>
            {stockStatus.message}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {stockStatus.subMessage}
          </p>
        </div>
      </div>

      {/* MOQ Badge */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-200/50">
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
          <FiPackage className="w-3.5 h-3.5 text-primary-600" />
          <span className="text-xs font-bold text-gray-700">
            MOQ: {moq} {product.unit}s
          </span>
        </div>
        
        {(stockStatus.status === 'out_of_stock' || stockStatus.status === 'low_stock') && (
          <div className="flex items-center gap-1.5 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-200">
            <FiInfo className="w-3.5 h-3.5 text-primary-600" />
            <span className="text-xs font-bold text-primary-700">
              Request Bulk
            </span>
          </div>
        )}
      </div>

      {/* Additional Info for Low/Out of Stock */}
      {(stockStatus.status === 'out_of_stock' || stockStatus.status === 'low_stock') && (
        <div className="bg-white/50 rounded-lg p-2.5 text-xs text-gray-600">
          <p className="font-medium text-gray-700 mb-1">💡 Bulk Order Information</p>
          <p>
            {stockStatus.status === 'out_of_stock' 
              ? 'This product is currently out of stock, but we can arrange bulk orders with extended delivery timelines.'
              : 'Limited stock available for immediate delivery. Bulk orders may require additional processing time.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default B2BStockAvailability;
