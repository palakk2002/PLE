import React from 'react';
import { CONDITIONS, GRADES, WARRANTY_OPTIONS, COSMETIC_CONDITIONS, FUNCTIONAL_CONDITIONS } from './refurbishedConstants';
import RefurbishedPreviewCard from './RefurbishedPreviewCard';
import { FiSliders, FiFileText, FiPercent, FiSettings, FiCheckSquare } from 'react-icons/fi';

const RefurbishedFieldsSection = ({ formData, onChange }) => {
  // Helpers to simulate standard event trigger for checkbox inputs or raw field setters
  const handleCheckboxChange = (name, checked) => {
    onChange({
      target: {
        name,
        type: 'checkbox',
        checked,
      },
    });
  };

  const handleValueChange = (name, value) => {
    onChange({
      target: {
        name,
        value,
      },
    });
  };

  const {
    condition = 'brand_new',
    refurbishedGrade = '',
    refurbishedWarrantyDuration = 'none',
    deviceHealthBattery = 100,
    deviceHealthCosmetic = 'excellent',
    deviceHealthFunctional = 'fully_working',
    isTested = false,
    isFullyFunctional = false,
    isCertified = false,
    refurbishedOriginalMrp = '',
    refurbishedSellingPrice = '',
    accessoryCharger = false,
    accessoryBox = false,
    accessoryOthers = false,
    cosmeticDamageNotes = '',
    productAgeMonths = '',
    purchaseYear = '',
    repairHistory = '',
  } = formData;

  const showRefurbishedOptions = condition !== 'brand_new';

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-5">
      {/* Header section with Condition Selector */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          Product Condition Settings
        </h2>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">
          Specify if this is a brand new, refurbished, renewed, or open-box item and configure its specs.
        </p>

        {/* Condition Card Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.values(CONDITIONS).map((cond) => {
            const isSelected = condition === cond.value;
            return (
              <button
                key={cond.value}
                type="button"
                onClick={() => handleValueChange('condition', cond.value)}
                className={`flex flex-col items-start text-left p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50/20 shadow-sm ring-1 ring-primary-500'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mb-2 ${
                  isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {cond.label}
                </span>
                <span className="text-[10px] text-gray-500 leading-normal">
                  {cond.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {showRefurbishedOptions && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Inputs Section - 2 Columns on desktop */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Grade Selector & Warranty */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-700 tracking-wider uppercase flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <FiSliders className="text-cyan-500" />
                Condition Grading & Warranty
              </h3>

              {/* Grade selector radio cards */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Certified Cosmetic Grade <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {Object.values(GRADES).map((g) => {
                    const isGradeSelected = refurbishedGrade === g.value;
                    return (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => handleValueChange('refurbishedGrade', g.value)}
                        className={`flex flex-col p-3 rounded-lg border text-left transition-all ${
                          isGradeSelected
                            ? 'border-primary-500 bg-primary-50/20 ring-1 ring-primary-500'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-gray-800">{g.label}</span>
                        <span className="text-[10px] text-gray-500 mt-1 leading-normal">{g.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Warranty Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Warranty Provided <span className="text-red-500">*</span>
                </label>
                <select
                  name="refurbishedWarrantyDuration"
                  value={refurbishedWarrantyDuration}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                >
                  {WARRANTY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Device Health Metrics */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-700 tracking-wider uppercase flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <FiSettings className="text-emerald-500" />
                Hardware Health Diagnostics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Battery health (Hide for open-box since it's practically brand new unused) */}
                {condition !== 'open_box' && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-gray-700">
                        Battery Health (Maximum Capacity %)
                      </label>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {deviceHealthBattery}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        name="deviceHealthBattery"
                        min="50"
                        max="100"
                        value={deviceHealthBattery}
                        onChange={onChange}
                        className="flex-grow accent-emerald-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        name="deviceHealthBattery"
                        min="50"
                        max="100"
                        value={deviceHealthBattery}
                        onChange={onChange}
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-center focus:ring-1 focus:ring-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Cosmetic wear level */}
                <div className={condition === 'open_box' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Cosmetic Condition Details
                  </label>
                  <select
                    name="deviceHealthCosmetic"
                    value={deviceHealthCosmetic}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  >
                    {COSMETIC_CONDITIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Functional condition level */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Functional Performance State
                  </label>
                  <select
                    name="deviceHealthFunctional"
                    value={deviceHealthFunctional}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  >
                    {FUNCTIONAL_CONDITIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Testing & Inclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Testing Checklist */}
              <div className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50/50">
                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FiCheckSquare className="text-primary-500" />
                  Testing & Verification
                </span>
                
                <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTested}
                    onChange={(e) => handleCheckboxChange('isTested', e.target.checked)}
                    className="rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span>Diagnostic tests completed (30+ points checklist)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFullyFunctional}
                    onChange={(e) => handleCheckboxChange('isFullyFunctional', e.target.checked)}
                    className="rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span>100% Fully Functional verified</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCertified}
                    onChange={(e) => handleCheckboxChange('isCertified', e.target.checked)}
                    className="rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span>Certified Refurbished / Inspected badge</span>
                </label>
              </div>

              {/* Accessories Checklist */}
              <div className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50/50">
                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FiCheckSquare className="text-secondary-500" />
                  Box & Accessories Included
                </span>

                <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessoryCharger}
                    onChange={(e) => handleCheckboxChange('accessoryCharger', e.target.checked)}
                    className="rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span>Compatible / OEM Charger included</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessoryBox}
                    onChange={(e) => handleCheckboxChange('accessoryBox', e.target.checked)}
                    className="rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span>Original retail box (or premium replacement box)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessoryOthers}
                    onChange={(e) => handleCheckboxChange('accessoryOthers', e.target.checked)}
                    className="rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span>Other components (earphones, cables, guides)</span>
                </label>
              </div>
            </div>

            {/* 4. Pricing details for refurbished savings */}
            <div className="space-y-3 bg-gradient-to-br from-primary-50/30 to-secondary-50/30 border border-primary-100 rounded-xl p-4">
              <h3 className="text-xs font-bold text-gray-700 tracking-wider uppercase flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <FiPercent className="text-primary-500" />
                Refurbished Pricing & Smart Savings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Original MRP (When Brand New) (₹)
                  </label>
                  <input
                    type="number"
                    name="refurbishedOriginalMrp"
                    value={refurbishedOriginalMrp}
                    onChange={onChange}
                    min="0"
                    placeholder="e.g., 69999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Refurbished Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    name="refurbishedSellingPrice"
                    value={refurbishedSellingPrice}
                    onChange={onChange}
                    min="0"
                    placeholder="e.g., 44999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Automatic savings calculation */}
              {refurbishedOriginalMrp && refurbishedSellingPrice && Number(refurbishedOriginalMrp) > Number(refurbishedSellingPrice) && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 mt-2">
                  <span className="text-xs font-semibold text-emerald-800">
                    Smart Discount Applied:
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-white px-2 py-0.5 rounded border border-emerald-100 animate-pulse">
                    Save ₹{(Number(refurbishedOriginalMrp) - Number(refurbishedSellingPrice)).toLocaleString()} ({Math.round(((Number(refurbishedOriginalMrp) - Number(refurbishedSellingPrice)) / Number(refurbishedOriginalMrp)) * 100)}% Off)
                  </span>
                </div>
              )}
            </div>

            {/* 5. Additional notes and metadata */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-700 tracking-wider uppercase flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <FiFileText className="text-purple-500" />
                Cosmetic notes & usage metadata
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Product Age / Usage Duration (Months)
                  </label>
                  <input
                    type="number"
                    name="productAgeMonths"
                    value={productAgeMonths}
                    onChange={onChange}
                    min="0"
                    placeholder="e.g., 8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Original Purchase Year
                  </label>
                  <select
                    name="purchaseYear"
                    value={purchaseYear}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Minor Cosmetic Flaws / Scratches Detail
                </label>
                <textarea
                  name="cosmeticDamageNotes"
                  value={cosmeticDamageNotes}
                  onChange={onChange}
                  rows="2"
                  placeholder="Minor hairline scratch on the top corner, nearly invisible from normal viewing distance."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Repair & Replacement History Details
                </label>
                <textarea
                  name="repairHistory"
                  value={repairHistory}
                  onChange={onChange}
                  rows="2"
                  placeholder="Screen replacement completed with OEM factory parts. Back panel original."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

          </div>

          {/* Sticky Customer Preview Side Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <span className="text-xs font-bold text-gray-700 tracking-wider uppercase block mb-1">
                  Storefront Live Preview
                </span>
                <p className="text-[10px] text-gray-500 mb-4 leading-normal">
                  This mock preview simulates how customers will see your listing details on the marketplace. Use it to check trust badges.
                </p>

                <RefurbishedPreviewCard
                  product={{
                    ...formData,
                    // If Refurbished Selling Price is set, preview uses it as main selling price
                    price: refurbishedSellingPrice || formData.price,
                    originalPrice: refurbishedOriginalMrp || formData.originalPrice,
                  }}
                />

                <div className="mt-4 p-3 bg-cyan-50 border border-cyan-100 rounded-lg flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1 flex-shrink-0" />
                  <p className="text-[10px] text-cyan-800 leading-normal">
                    <strong>Vetting Requirement:</strong> Refurbished items go through an automated catalog review upon submission. Complete details speed up approvals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefurbishedFieldsSection;
