import React from 'react';
import Badge from '../../../../shared/components/Badge';
import { CONDITIONS, GRADES } from './refurbishedConstants';

const RefurbishedBadge = ({ condition, grade, warranty, showDetails = true, className = '' }) => {
  if (!condition || condition === 'brand_new') return null;

  const config = CONDITIONS[condition];
  if (!config) return null;

  const gradeInfo = grade ? GRADES[grade] : null;

  // Format warranty string nicely (e.g. '3_months' -> '3 Months')
  const formatWarranty = (w) => {
    if (!w || w === 'none') return '';
    return w.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
      
      {showDetails && (
        <>
          {grade && gradeInfo && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 border border-gray-200">
              Grade {grade}
            </span>
          )}
          {warranty && warranty !== 'none' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary-50 text-primary-700 border border-primary-100">
              {formatWarranty(warranty)}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default RefurbishedBadge;
