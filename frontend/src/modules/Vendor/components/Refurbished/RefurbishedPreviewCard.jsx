import React from 'react';
import { CONDITIONS, GRADES } from './refurbishedConstants';
import { FiShield, FiCheckCircle, FiBattery, FiLayers } from 'react-icons/fi';

const RefurbishedPreviewCard = ({ product, className = '' }) => {
  if (!product) return null;

  const {
    name = 'Product Title Placeholder',
    price = 0,
    originalPrice = 0,
    image = '',
    condition = 'brand_new',
    refurbishedGrade = '',
    refurbishedWarrantyDuration = 'none',
    deviceHealthBattery = 100,
    deviceHealthCosmetic = 'excellent',
    deviceHealthFunctional = 'fully_working',
    isTested = false,
    isFullyFunctional = false,
    isCertified = false,
    accessoryCharger = false,
    accessoryBox = false,
    accessoryOthers = false,
    cosmeticDamageNotes = '',
  } = product;

  if (condition === 'brand_new') return null;

  const conditionConfig = CONDITIONS[condition];
  const gradeConfig = refurbishedGrade ? GRADES[refurbishedGrade] : null;

  const discountPercent = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const formatWarranty = (w) => {
    if (!w || w === 'none') return null;
    return w.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Image and Condition Overlay */}
      <div className="relative aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400 text-xs">No image provided</div>
        )}
        
        {/* Condition Badge Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${
            condition === 'refurbished' ? 'from-cyan-500 to-blue-600' :
            condition === 'renewed' ? 'from-emerald-500 to-teal-600' : 'from-amber-500 to-orange-600'
          }`}>
            {conditionConfig?.label || condition}
          </span>
          {refurbishedGrade && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-gray-800 border border-gray-200 shadow-sm">
              Grade {refurbishedGrade}
            </span>
          )}
        </div>

        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white font-bold text-xs px-2 py-0.5 rounded shadow-sm">
            Save {discountPercent}%
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="p-4 space-y-3.5">
        <div>
          <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{name}</h4>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-bold text-gray-900">₹{Number(price || 0).toLocaleString()}</span>
            {originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">₹{Number(originalPrice || 0).toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Condition details grid */}
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-100 pt-3">
          {/* Warranty */}
          {refurbishedWarrantyDuration !== 'none' && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <FiShield className="text-cyan-500 flex-shrink-0" />
              <span>{formatWarranty(refurbishedWarrantyDuration)}</span>
            </div>
          )}

          {/* Battery Health */}
          {condition !== 'open_box' && deviceHealthBattery && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <FiBattery className="text-emerald-500 flex-shrink-0" />
              <span>Battery: {deviceHealthBattery}%</span>
            </div>
          )}

          {/* Cosmetic Condition */}
          <div className="flex items-center gap-1.5 text-gray-600">
            <FiLayers className="text-purple-500 flex-shrink-0" />
            <span className="capitalize">{deviceHealthCosmetic} wear</span>
          </div>

          {/* Certification indicator */}
          {(isCertified || isTested) && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
              <span>Tested & Certified</span>
            </div>
          )}
        </div>

        {/* Accessories checklist */}
        {(accessoryCharger || accessoryBox || accessoryOthers) && (
          <div className="text-[10px] text-gray-500 bg-gray-50 rounded-lg p-2 flex flex-wrap gap-2">
            <span className="font-semibold">Included:</span>
            {accessoryCharger && <span>• Charger</span>}
            {accessoryBox && <span>• Original Box</span>}
            {accessoryOthers && <span>• Accessories</span>}
          </div>
        )}

        {/* Cosmetic damage notes */}
        {cosmeticDamageNotes && (
          <div className="text-[10px] text-gray-500 italic bg-amber-50/50 border border-amber-100 rounded-lg p-2 leading-relaxed">
            Note: {cosmeticDamageNotes}
          </div>
        )}
      </div>
    </div>
  );
};

export default RefurbishedPreviewCard;
