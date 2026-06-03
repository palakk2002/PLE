import React from "react";
import { OFFER_STATUS } from "../constants/offerTypes";

export const OfferStatusChip = ({ status, isActive }) => {
  let chipClass = "";

  if (!isActive) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
        Inactive / Disabled
      </span>
    );
  }

  switch (status) {
    case OFFER_STATUS.ACTIVE:
      chipClass = "bg-green-50 text-green-700 border-green-200";
      break;
    case OFFER_STATUS.SCHEDULED:
      chipClass = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case OFFER_STATUS.EXPIRED:
      chipClass = "bg-red-50 text-red-700 border-red-200";
      break;
    case OFFER_STATUS.DISABLED:
      chipClass = "bg-gray-50 text-gray-700 border-gray-200";
      break;
    default:
      chipClass = "bg-gray-50 text-gray-700 border-gray-200";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${chipClass}`}>
      {status}
    </span>
  );
};

export default OfferStatusChip;
