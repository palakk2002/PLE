import React from "react";
import { OFFER_TYPES } from "../constants/offerTypes";

export const OfferBadge = ({ offer }) => {
  if (!offer) return null;

  let badgeText = "";
  let badgeStyle = "bg-gradient-to-r from-red-600 to-[#AE020B] text-white";

  switch (offer.offerType) {
    case OFFER_TYPES.BANK_OFFER:
      badgeText = `🏦 ${offer.discountValue ? offer.discountValue + "% OFF" : "Bank Offer"}`;
      badgeStyle = "bg-blue-600 text-white";
      break;
    case OFFER_TYPES.CASHBACK_OFFER:
      badgeText = `🎁 Cashback`;
      badgeStyle = "bg-purple-600 text-white";
      break;
    case OFFER_TYPES.FREE_SHIPPING:
      badgeText = `🚚 Free Shipping`;
      badgeStyle = "bg-green-600 text-white";
      break;
    case OFFER_TYPES.COUPON_OFFER:
      badgeText = `🏷️ ${offer.couponCode}`;
      badgeStyle = "bg-amber-600 text-white";
      break;
    case OFFER_TYPES.FESTIVAL_OFFER:
      badgeText = `🎉 ${offer.discountValue}% OFF`;
      badgeStyle = "bg-gradient-to-r from-red-500 to-orange-500 text-white";
      break;
    default:
      if (offer.discountValue) {
        badgeText = `${offer.discountValue}% OFF`;
      } else {
        badgeText = "Special Offer";
      }
  }

  return (
    <div className={`absolute top-0 left-0 text-[9px] md:text-xs font-black px-2.5 py-1 rounded-br-lg z-10 shadow-md ${badgeStyle}`}>
      {badgeText}
    </div>
  );
};

export default OfferBadge;
