import React from "react";
import { OFFER_TYPES, OFFER_STATUS, CREATOR_TYPES } from "../constants/offerTypes";
import { FiSearch, FiSliders } from "react-icons/fi";

export const OfferFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  selectedCreator,
  setSelectedCreator,
  showCreatorFilter = true
}) => {
  return (
    <div className="flex flex-col gap-4 bg-[#120D0B] p-5 rounded-2xl border border-white/[0.06] mb-6">
      <div className="flex items-center gap-3">
        <FiSliders className="text-[#C07A3D]" />
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Search & Filters</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E7768] text-sm" />
          <input
            type="text"
            placeholder="Search offers by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-[#C07A3D]/50 focus:ring-1 focus:ring-[#C07A3D]/30"
          />
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-[#C07A3D]/50"
          >
            <option value="" className="bg-[#120D0B] text-white">All Offer Types</option>
            {Object.values(OFFER_TYPES).map((type) => (
              <option key={type} value={type} className="bg-[#120D0B] text-white">{type}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-[#C07A3D]/50"
          >
            <option value="" className="bg-[#120D0B] text-white">All Statuses</option>
            {Object.values(OFFER_STATUS).map((status) => (
              <option key={status} value={status} className="bg-[#120D0B] text-white">{status}</option>
            ))}
          </select>
        </div>

        {/* Creator Filter */}
        {showCreatorFilter && (
          <div>
            <select
              value={selectedCreator}
              onChange={(e) => setSelectedCreator(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-[#C07A3D]/50"
            >
              <option value="" className="bg-[#120D0B] text-white">All Creators</option>
              {Object.values(CREATOR_TYPES).map((creator) => (
                <option key={creator} value={creator} className="bg-[#120D0B] text-white">{creator}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferFilterBar;
