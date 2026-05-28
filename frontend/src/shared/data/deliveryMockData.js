// Shared Smart Delivery & Fast Logistics Mock Layer

/**
 * Estimates delivery ETA based on vendor and buyer postal pincodes/ZIPs
 * @param {string} vendorZip 
 * @param {string} buyerZip 
 * @param {boolean} isB2B 
 * @returns {object} delivery metadata
 */
export const estimateDeliveryETA = (vendorZip = "", buyerZip = "", isB2B = false) => {
  const cleanVendor = String(vendorZip).trim();
  const cleanBuyer = String(buyerZip).trim();

  // If buyer profile is B2B bulk, apply pallet secure dispatch terms
  if (isB2B) {
    return {
      type: "bulk",
      etaType: "outstation",
      estimatedHours: "72-120",
      displayETA: "3–5 Days (Bulk Secure Dispatch)",
      priority: true,
      coverageZone: "Tier-1 Industrial Hub",
      shippingFee: 1500,
      badgeText: "Fast Bulk Cargo",
      badgeColor: "bg-blue-50 text-blue-700 border border-blue-100"
    };
  }

  // Same-city estimation (check if first 3 digits match, representing standard postal district)
  const isSameCity = cleanVendor.substring(0, 3) === cleanBuyer.substring(0, 3) && cleanVendor.length > 0;

  if (isSameCity) {
    return {
      type: "express",
      etaType: "same-city",
      estimatedHours: "8-16",
      displayETA: "8–16 Hours (Same-City Express)",
      priority: true,
      coverageZone: "Local Metro Loop",
      shippingFee: 150,
      badgeText: "⚡ 8-16h Express",
      badgeColor: "bg-orange-50 text-orange-700 border border-orange-100 animate-pulse"
    };
  }

  // Outstation / Regional standard delivery
  return {
    type: "standard",
    etaType: "outstation",
    estimatedHours: "48-96",
    displayETA: "2–4 Days (Outstation Standard)",
    priority: false,
    coverageZone: "Outstation Zone-B",
    shippingFee: 0, // Free Standard Shipping
    badgeText: "🚚 Standard 2-4 Days",
    badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-100"
  };
};

/**
 * Platform delivery zones
 */
export const deliveryZones = [
  { id: "ZONE-1", name: "Mumbai Local Metro", type: "same-city", code: "400", activeDrivers: 14, successRate: 98.4 },
  { id: "ZONE-2", name: "Delhi/NCR Ring Loop", type: "same-city", code: "110", activeDrivers: 22, successRate: 97.8 },
  { id: "ZONE-3", name: "Bangalore Hub A", type: "same-city", code: "560", activeDrivers: 19, successRate: 99.1 },
  { id: "ZONE-4", name: "Regional Western Zone", type: "nearby-city", code: "411", activeDrivers: 8, successRate: 94.5 },
  { id: "ZONE-5", name: "Outstation East Corridor", type: "outstation", code: "700", activeDrivers: 5, successRate: 91.2 }
];

/**
 * Driver dashboard and orders mock data
 */
export const initialDeliveryOrders = [
  {
    id: "DLV-ORD-8001",
    customer: "Rajesh Wholesale Traders",
    amount: 145000,
    address: "Crawford Market, Fort, Mumbai - 400001",
    distance: "2.4 km",
    status: "pending", // pending, accepted, packed, picked-up, local-hub, in-transit, completed
    delivery: {
      type: "bulk",
      etaType: "same-city",
      estimatedHours: "8-24",
      displayETA: "Same-Day Bulk Delivery",
      priority: true,
      slaStatus: "on-time"
    },
    items: [
      { name: "Premium Leather Office Chairs", qty: 15, weight: "120 kg" }
    ],
    timeline: [
      { stage: "Order Confirmed", date: "2026-05-28T08:00:00Z", completed: true },
      { stage: "Packed", date: null, completed: false },
      { stage: "Ready for Dispatch", date: null, completed: false },
      { stage: "Local Hub Handover", date: null, completed: false },
      { stage: "Out for Delivery", date: null, completed: false },
      { stage: "Delivered", date: null, completed: false }
    ]
  },
  {
    id: "DLV-ORD-8002",
    customer: "Anjali Sharma",
    amount: 8400,
    address: "Bandra West, Mumbai - 400050",
    distance: "12.8 km",
    status: "in-transit",
    delivery: {
      type: "express",
      etaType: "same-city",
      estimatedHours: "8-16",
      displayETA: "8–16 Hours Same-City Express",
      priority: true,
      slaStatus: "on-time"
    },
    items: [
      { name: "Smart WiFi LED bulb", qty: 3, weight: "0.5 kg" },
      { name: "Ergonomic Standing Desk Keyboard", qty: 1, weight: "2.1 kg" }
    ],
    timeline: [
      { stage: "Order Confirmed", date: "2026-05-28T06:00:00Z", completed: true },
      { stage: "Packed", date: "2026-05-28T07:30:00Z", completed: true },
      { stage: "Ready for Dispatch", date: "2026-05-28T08:15:00Z", completed: true },
      { stage: "Local Hub Handover", date: "2026-05-28T09:00:00Z", completed: true },
      { stage: "Out for Delivery", date: "2026-05-28T10:30:00Z", completed: true },
      { stage: "Delivered", date: null, completed: false }
    ]
  },
  {
    id: "DLV-ORD-8003",
    customer: "Senthil Kumar",
    amount: 24500,
    address: "Mount Road, Chennai - 600002",
    distance: "1032 km",
    status: "pending",
    delivery: {
      type: "standard",
      etaType: "outstation",
      estimatedHours: "48-72",
      displayETA: "2–3 Days Outstation Shipping",
      priority: false,
      slaStatus: "on-time"
    },
    items: [
      { name: "Heavy Duty 5-Ply Cartons", qty: 500, weight: "45 kg" }
    ],
    timeline: [
      { stage: "Order Confirmed", date: "2026-05-27T14:00:00Z", completed: true },
      { stage: "Packed", date: "2026-05-27T18:00:00Z", completed: true },
      { stage: "Ready for Dispatch", date: null, completed: false },
      { stage: "Local Hub Handover", date: null, completed: false },
      { stage: "Out for Delivery", date: null, completed: false },
      { stage: "Delivered", date: null, completed: false }
    ]
  },
  {
    id: "DLV-ORD-8004",
    customer: "Vikram Sengupta",
    amount: 95000,
    address: "G-14, Sector 62, Noida - 201301",
    distance: "1420 km",
    status: "local-hub",
    delivery: {
      type: "standard",
      etaType: "outstation",
      estimatedHours: "72-96",
      displayETA: "3–4 Days Outstation Shipping",
      priority: false,
      slaStatus: "delayed"
    },
    items: [
      { name: "Amber Glass Bottles 30ml", qty: 2000, weight: "38 kg" }
    ],
    timeline: [
      { stage: "Order Confirmed", date: "2026-05-25T11:00:00Z", completed: true },
      { stage: "Packed", date: "2026-05-25T16:00:00Z", completed: true },
      { stage: "Ready for Dispatch", date: "2026-05-26T09:00:00Z", completed: true },
      { stage: "Local Hub Handover", date: "2026-05-28T04:00:00Z", completed: true },
      { stage: "Out for Delivery", date: null, completed: false },
      { stage: "Delivered", date: null, completed: false }
    ]
  }
];

/**
 * Platform wide operational analytics metrics
 */
export const platformLogisticsStats = {
  sameCitySuccessRate: 98.6,
  averageDeliveryHours: 11.2,
  delayedShipmentPercentage: 1.4,
  activeCarrierPartners: 350,
  sellerSlaCompliance: 96.8,
  monthlyPerformances: [
    { name: "Jan", sameCity: 97.2, outstation: 91.0 },
    { name: "Feb", sameCity: 97.9, outstation: 92.5 },
    { name: "Mar", sameCity: 98.4, outstation: 93.1 },
    { name: "Apr", sameCity: 98.1, outstation: 94.0 },
    { name: "May", sameCity: 98.6, outstation: 94.6 }
  ]
};
