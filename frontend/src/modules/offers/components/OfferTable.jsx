import React, { useState } from "react";
import { FiEye, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import OfferStatusChip from "./OfferStatusChip";

export const OfferTable = ({
  offers,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  itemsPerPage = 5
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = offers.slice(startIndex, startIndex + itemsPerPage);

  const formatText = (text, maxLength = 25) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="bg-[#120D0B] rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="p-4 text-xs font-bold text-[#8E7768] uppercase tracking-wider">Offer Name</th>
              <th className="p-4 text-xs font-bold text-[#8E7768] uppercase tracking-wider">Offer Type</th>
              <th className="p-4 text-xs font-bold text-[#8E7768] uppercase tracking-wider">Created By</th>
              <th className="p-4 text-xs font-bold text-[#8E7768] uppercase tracking-wider text-center">Priority</th>
              <th className="p-4 text-xs font-bold text-[#8E7768] uppercase tracking-wider">Start Date</th>
              <th className="p-4 text-xs font-bold text-[#8E7768] uppercase tracking-wider">End Date</th>
              <th className="p-4 text-xs font-bold text-[#8E7768] uppercase tracking-wider text-center">Status</th>
              <th className="p-4 text-xs font-bold text-[#8E7768] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {paginatedOffers.map((offer) => (
              <tr key={offer.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="p-4">
                  <div>
                    <p className="text-sm font-bold text-white leading-snug">{formatText(offer.title)}</p>
                    <p className="text-xs text-[#8E7768] leading-normal">{formatText(offer.subtitle, 35)}</p>
                  </div>
                </td>
                <td className="p-4 text-sm text-[#F5E6DA]">{offer.offerType}</td>
                <td className="p-4">
                  <div>
                    <p className="text-sm text-white font-medium">{offer.createdBy}</p>
                    <p className="text-[10px] text-[#8E7768] uppercase font-bold">{offer.creatorType}</p>
                  </div>
                </td>
                <td className="p-4 text-sm text-[#F5E6DA] text-center font-bold">
                  <span className="bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.06]">
                    {offer.priority}
                  </span>
                </td>
                <td className="p-4 text-sm text-[#8E7768]">{offer.startDate}</td>
                <td className="p-4 text-sm text-[#8E7768]">{offer.endDate}</td>
                <td className="p-4 text-center">
                  <OfferStatusChip status={offer.status} isActive={offer.isActive} />
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(offer.id)}
                        title="View Details"
                        className="p-2 bg-white/[0.04] text-[#C8B3A3] hover:text-[#C07A3D] hover:bg-white/[0.08] rounded-xl transition-all"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(offer.id)}
                        title="Edit Offer"
                        className="p-2 bg-white/[0.04] text-[#C8B3A3] hover:text-[#C07A3D] hover:bg-white/[0.08] rounded-xl transition-all"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                    )}
                    {onToggleStatus && (
                      <button
                        onClick={() => onToggleStatus(offer.id)}
                        title={offer.isActive ? "Disable Offer" : "Enable Offer"}
                        className={`p-2 bg-white/[0.04] rounded-xl transition-all ${
                          offer.isActive ? "text-green-500 hover:bg-green-500/10" : "text-gray-500 hover:bg-white/[0.08]"
                        }`}
                      >
                        {offer.isActive ? <FiToggleRight className="text-lg" /> : <FiToggleLeft className="text-lg" />}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(offer.id)}
                        title="Delete Offer"
                        className="p-2 bg-white/[0.04] text-[#C8B3A3] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white/[0.02] border-t border-white/[0.06]">
          <span className="text-xs text-[#8E7768]">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, offers.length)} of {offers.length} offers
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[#8E7768] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 text-xs font-bold rounded-lg border transition-all ${
                  currentPage === idx + 1
                    ? "bg-[#C07A3D] text-white border-[#C07A3D] shadow-sm"
                    : "bg-white/[0.04] text-[#C8B3A3] border-white/[0.06] hover:bg-white/[0.08]"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[#8E7768] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferTable;
