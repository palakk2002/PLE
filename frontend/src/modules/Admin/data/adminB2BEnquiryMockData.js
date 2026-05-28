// Admin B2B Enquiry & RFQ Mock Data

export const initialB2BEnquiries = [
  {
    id: "RFQ-2026-1001",
    enquiryNumber: "RFQ-1001",
    buyer: {
      name: "Rajesh K. Mehta",
      company: "Mehta Industrial Supplies Ltd",
      gstin: "27AABCR4821M1Z3",
      email: "rajesh@mehtasupplies.com",
      phone: "+91 98200 12345",
      address: "G-14, Industrial Area Phase II, Noida, UP - 201305"
    },
    seller: {
      name: "Super Electro Corp",
      storeName: "Super Electro Online Store",
      id: "SEL-301",
      email: "sales@superelectro.com",
      phone: "+91 98111 88888"
    },
    products: [
      { id: "P-101", name: "Premium Brass Connector Terminals", qty: 2500, targetPrice: 42, subtotal: 105000 },
      { id: "P-102", name: "Industrial Grade Copper Bushings", qty: 1000, targetPrice: 75, subtotal: 75000 }
    ],
    status: "Pending", // Pending, Under Review, Seller Responded, Quotation Sent, Approved, Rejected
    priority: "High", // High, Medium, Low
    totalEstimatedValue: 180000,
    buyerMessage: "We are seeking a reliable, long-term supplier for copper bushings and brass connector terminals for our automated assembly lines. Dimensions must strictly adhere to the technical drawings attached. Need delivery within 15 days of order confirmation.",
    sellerQuotation: null,
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "System / Buyer",
        date: "2026-05-24T10:30:00Z",
        comment: "RFQ submitted by Mehta Industrial Supplies Ltd with target prices."
      },
      {
        stage: "Assigned to Seller",
        user: "Admin (Auto)",
        date: "2026-05-24T10:32:00Z",
        comment: "RFQ forwarded to Super Electro Corp based on product category match."
      }
    ],
    createdAt: "2026-05-24T10:30:00Z",
    expiresAt: "2026-06-08T10:30:00Z",
    flagged: false,
    disputes: []
  },
  {
    id: "RFQ-2026-1002",
    enquiryNumber: "RFQ-1002",
    buyer: {
      name: "Anjali Sharma",
      company: "Vertex Tech Solutions",
      gstin: "07AAACG9871A1Z9",
      email: "purchasing@vertextech.in",
      phone: "+91 99100 98765",
      address: "Building 4B, Cyber City, Gurgaon, Haryana - 122002"
    },
    seller: {
      name: "Apex Office Solutions",
      storeName: "Apex Workspace Direct",
      id: "SEL-302",
      email: "info@apexoffice.in",
      phone: "+91 99555 44433"
    },
    products: [
      { id: "P-201", name: "Ergonomic Mesh Chair (High Back)", qty: 45, targetPrice: 6200, subtotal: 279000 },
      { id: "P-202", name: "Dual Motor Standing Desk (Oak Top)", qty: 20, targetPrice: 15500, subtotal: 310000 }
    ],
    status: "Seller Responded",
    priority: "High",
    totalEstimatedValue: 589000,
    buyerMessage: "Setting up a new wing in our Gurgaon office. Need high-quality ergonomic seating and active-standing desks. Need a custom quote including bulk discount, doorstep shipping, and installation services.",
    sellerQuotation: {
      quotedValue: 565000,
      paymentTerms: "Net 30",
      shippingTerms: "Included",
      validUntil: "2026-06-15T18:00:00Z",
      message: "We are pleased to offer our flagship Ergonomic Mesh Chairs at ₹6,000 each and Dual Motor Standing Desks at ₹14,750 each. Total package price of ₹5,65,000 includes delivery, setup, and 3-year on-site warranty.",
      items: [
        { id: "P-201", name: "Ergonomic Mesh Chair (High Back)", qty: 45, quotedPrice: 6000, subtotal: 270000 },
        { id: "P-202", name: "Dual Motor Standing Desk (Oak Top)", qty: 20, quotedPrice: 14750, subtotal: 295000 }
      ]
    },
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "Buyer",
        date: "2026-05-23T09:00:00Z",
        comment: "Bulk setup inquiry submitted."
      },
      {
        stage: "Seller Response",
        user: "Seller (Apex Workspace Direct)",
        date: "2026-05-24T14:15:00Z",
        comment: "Detailed quotation submitted with discounted bulk rates."
      }
    ],
    createdAt: "2026-05-23T09:00:00Z",
    expiresAt: "2026-06-06T09:00:00Z",
    flagged: false,
    disputes: []
  },
  {
    id: "RFQ-2026-1003",
    enquiryNumber: "RFQ-1003",
    buyer: {
      name: "Senthil Kumar",
      company: "SKV Logistics Chennai Pvt Ltd",
      gstin: "33AAAAS1212B1Z7",
      email: "skumar@skvlogistics.com",
      phone: "+91 94440 54321",
      address: "102, Beach Road, Chennai, Tamil Nadu - 600001"
    },
    seller: {
      name: "Vanguard Packaging",
      storeName: "Vanguard Box & Carton Co",
      id: "SEL-303",
      email: "orders@vanguardpack.com",
      phone: "+91 44 2444 8888"
    },
    products: [
      { id: "P-301", name: "Heavy Duty 5-Ply Corrugated Box (18x12x12)", qty: 10000, targetPrice: 18, subtotal: 180000 }
    ],
    status: "Approved",
    priority: "Medium",
    totalEstimatedValue: 180000,
    buyerMessage: "Regular requirement for monthly shipping operations. We need high crushing resistance 5-ply cartons. Custom branding print on 2 sides. Sample required before placing bulk order.",
    sellerQuotation: {
      quotedValue: 175000,
      paymentTerms: "Net 15",
      shippingTerms: "FOB Origin",
      validUntil: "2026-06-10T18:00:00Z",
      message: "Quoting ₹17.50 per unit for 5-ply boxes. Standard lead time is 7 working days. Branding setup cost is waived for this initial order.",
      items: [
        { id: "P-301", name: "Heavy Duty 5-Ply Corrugated Box (18x12x12)", qty: 10000, quotedPrice: 17.5, subtotal: 175000 }
      ]
    },
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "Buyer",
        date: "2026-05-20T11:45:00Z",
        comment: "Monthly carton box supply request submitted."
      },
      {
        stage: "Seller Response",
        user: "Seller (Vanguard Box & Carton Co)",
        date: "2026-05-21T16:30:00Z",
        comment: "Quoted ₹17.50 with waived layout fees."
      },
      {
        stage: "Approved by Admin",
        user: "Admin",
        date: "2026-05-22T10:10:00Z",
        comment: "Verified Buyer profile and Seller quotation, transaction approved for contract creation."
      }
    ],
    createdAt: "2026-05-20T11:45:00Z",
    expiresAt: "2026-06-03T11:45:00Z",
    flagged: false,
    disputes: []
  },
  {
    id: "RFQ-2026-1004",
    enquiryNumber: "RFQ-1004",
    buyer: {
      name: "Vikram Sengupta",
      company: "Apex Global Sourcing",
      gstin: "29AAACA9922P1Z6",
      email: "v.sengupta@apexglobal.in",
      phone: "+91 80 4111 2222",
      address: "402, Outer Ring Road, Bangalore, Karnataka - 560103"
    },
    seller: {
      name: "Global Glassworks",
      storeName: "Global Glass & Ceramic Ind",
      id: "SEL-304",
      email: "glassworks@globalind.in",
      phone: "+91 80 2555 1234"
    },
    products: [
      { id: "P-401", name: "Amber Glass Dropper Bottles (30ml)", qty: 15000, targetPrice: 8.5, subtotal: 127500 }
    ],
    status: "Under Review",
    priority: "Low",
    totalEstimatedValue: 127500,
    buyerMessage: "Urgent procurement of amber dropper bottles for our skincare product line launch. Caps must be child-resistant with glass pipettes. Needs to be chemical grade glass.",
    sellerQuotation: null,
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "Buyer",
        date: "2026-05-26T15:20:00Z",
        comment: "Enquiry submitted. Target price of ₹8.50 per unit."
      },
      {
        stage: "Moved to Under Review",
        user: "Admin",
        date: "2026-05-27T09:15:00Z",
        comment: "RFQ held for verification due to low target price vs current market rate."
      }
    ],
    createdAt: "2026-05-26T15:20:00Z",
    expiresAt: "2026-06-09T15:20:00Z",
    flagged: false,
    disputes: []
  },
  {
    id: "RFQ-2026-1005",
    enquiryNumber: "RFQ-1005",
    buyer: {
      name: "Sunil Gupta",
      company: "Gupta Retail Mart",
      gstin: "07AAACG9871A1Z9",
      email: "sunil@guptaretail.co.in",
      phone: "+91 98101 22334",
      address: "45, Karol Bagh, New Delhi, Delhi - 110005"
    },
    seller: {
      name: "Super Electro Corp",
      storeName: "Super Electro Online Store",
      id: "SEL-301",
      email: "sales@superelectro.com",
      phone: "+91 98111 88888"
    },
    products: [
      { id: "P-501", name: "Smart WiFi LED Bulb 9W (Warm White)", qty: 1500, targetPrice: 110, subtotal: 165000 }
    ],
    status: "Quotation Sent",
    priority: "Medium",
    totalEstimatedValue: 165000,
    buyerMessage: "Wholesale purchasing for festive season inventory. Need bulk discounts and extended warranty. Can do immediate full advance payment if pricing is aggressive.",
    sellerQuotation: {
      quotedValue: 157500,
      paymentTerms: "Advance Payment",
      shippingTerms: "Included",
      validUntil: "2026-06-12T23:59:59Z",
      message: "We can offer the 9W Smart LED bulb at ₹105 each (against target of ₹110) for 1500 units, provided payment is made 100% advance. Delivery in 4 days.",
      items: [
        { id: "P-501", name: "Smart WiFi LED Bulb 9W (Warm White)", qty: 1500, quotedPrice: 105, subtotal: 157500 }
      ]
    },
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "Buyer",
        date: "2026-05-22T14:40:00Z",
        comment: "Bulk requirement for warm white LED bulbs."
      },
      {
        stage: "Seller Quote Submitted",
        user: "Seller (Super Electro Online Store)",
        date: "2026-05-23T11:20:00Z",
        comment: "Offered at ₹105 per unit (below target!) for full advance term."
      },
      {
        stage: "Quotation Sent to Buyer",
        user: "System (Auto)",
        date: "2026-05-23T11:25:00Z",
        comment: "Quotation approved for buyer viewing."
      }
    ],
    createdAt: "2026-05-22T14:40:00Z",
    expiresAt: "2026-06-05T14:40:00Z",
    flagged: false,
    disputes: []
  },
  {
    id: "RFQ-2026-1006",
    enquiryNumber: "RFQ-1006",
    buyer: {
      name: "Amit Jain",
      company: "Jaipur Fab House",
      gstin: "08AAACJ4411C1ZY",
      email: "amit@jaipurfabhouse.com",
      phone: "+91 94140 12121",
      address: "D-25, Johari Bazar, Jaipur, Rajasthan - 302003"
    },
    seller: {
      name: "Vanguard Packaging",
      storeName: "Vanguard Box & Carton Co",
      id: "SEL-303",
      email: "orders@vanguardpack.com",
      phone: "+91 44 2444 8888"
    },
    products: [
      { id: "P-302", name: "Eco Kraft Shopping Bag (Large)", qty: 5000, targetPrice: 12, subtotal: 60000 }
    ],
    status: "Rejected",
    priority: "Low",
    totalEstimatedValue: 60000,
    buyerMessage: "Custom print bags with paper handles. Target price is strict. Need by next week.",
    sellerQuotation: {
      quotedValue: 75000,
      paymentTerms: "Net 15",
      shippingTerms: "Ex-Works",
      validUntil: "2026-05-20T18:00:00Z",
      message: "Due to rising paper pulp prices, we cannot match ₹12. Our absolute minimum for custom prints with handles is ₹15 per unit.",
      items: [
        { id: "P-302", name: "Eco Kraft Shopping Bag (Large)", qty: 5000, quotedPrice: 15, subtotal: 75000 }
      ]
    },
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "Buyer",
        date: "2026-05-12T10:00:00Z",
        comment: "Bags request submitted."
      },
      {
        stage: "Seller Response",
        user: "Seller (Vanguard Box & Carton Co)",
        date: "2026-05-13T12:00:00Z",
        comment: "Quoted ₹15 per bag due to material costs."
      },
      {
        stage: "Rejected by Buyer",
        user: "Buyer",
        date: "2026-05-14T15:30:00Z",
        comment: "Pricing exceeds our budget constraints. Closing enquiry."
      }
    ],
    createdAt: "2026-05-12T10:00:00Z",
    expiresAt: "2026-05-26T10:00:00Z",
    flagged: false,
    disputes: []
  },
  {
    id: "RFQ-2026-1007",
    enquiryNumber: "RFQ-1007",
    buyer: {
      name: "Sanjay Shah",
      company: "Micro Hardware & Electricals",
      gstin: "24AABCS4455E1ZR",
      email: "sanjay@microelec.in",
      phone: "+91 93777 66554",
      address: "18, GIDC Estate, Vatva, Ahmedabad, Gujarat - 382445"
    },
    seller: {
      name: "Super Electro Corp",
      storeName: "Super Electro Online Store",
      id: "SEL-301",
      email: "sales@superelectro.com",
      phone: "+91 98111 88888"
    },
    products: [
      { id: "P-103", name: "Heavy Duty Toggle Switch 16A", qty: 4000, targetPrice: 35, subtotal: 140000 }
    ],
    status: "Pending",
    priority: "High",
    totalEstimatedValue: 140000,
    buyerMessage: "URGENT: Required for defense-grade switchboards. Need full certification sheets (RoHS & CE) along with bid. Will finalize this week.",
    sellerQuotation: null,
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "Buyer",
        date: "2026-05-27T16:00:00Z",
        comment: "Urgent defense switch inquiry submitted."
      }
    ],
    createdAt: "2026-05-27T16:00:00Z",
    expiresAt: "2026-06-10T16:00:00Z",
    flagged: false,
    disputes: []
  },
  {
    id: "RFQ-2026-1008",
    enquiryNumber: "RFQ-1008",
    buyer: {
      name: "John Doe",
      company: "Fake Buyer Corp Pvt Ltd",
      gstin: "99AAAAA0000A1Z0",
      email: "spammyjohnny@dispostable.com",
      phone: "+91 99999 99999",
      address: "123, Fake Street, Noida, UP - 201301"
    },
    seller: {
      name: "Apex Office Solutions",
      storeName: "Apex Workspace Direct",
      id: "SEL-302",
      email: "info@apexoffice.in",
      phone: "+91 99555 44433"
    },
    products: [
      { id: "P-999", name: "Super Luxury Gold Plated Executive Chair", qty: 500, targetPrice: 1000, subtotal: 500000 }
    ],
    status: "Pending",
    priority: "Low",
    totalEstimatedValue: 500000,
    buyerMessage: "i need 500 gold plated chairs for 1000 rs very urgent contact me on whatsapp immediately or text me now discount needed super fast shipping now now.",
    sellerQuotation: null,
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "Buyer",
        date: "2026-05-27T18:30:00Z",
        comment: "Bulk inquiry created."
      }
    ],
    createdAt: "2026-05-27T18:30:00Z",
    expiresAt: "2026-06-10T18:30:00Z",
    flagged: true,
    flagReason: "Unrealistic target price, temporary/disposable email domain, repetitive spam keywords.",
    riskScore: 89,
    spamStatus: "Flagged", // Flagged, Verified, Blocked
    detectionMethod: "Auto (AI filter)"
  },
  {
    id: "RFQ-2026-1009",
    enquiryNumber: "RFQ-1009",
    buyer: {
      name: "Pooja Hegde",
      company: "Hegde Hospitality Group",
      gstin: "29BBBCB5566G1Z2",
      email: "pooja@hegdehospitality.com",
      phone: "+91 88844 33221",
      address: "77, Residency Road, Bangalore, Karnataka - 560025"
    },
    seller: {
      name: "Apex Office Solutions",
      storeName: "Apex Workspace Direct",
      id: "SEL-302",
      email: "info@apexoffice.in",
      phone: "+91 99555 44433"
    },
    products: [
      { id: "P-203", name: "Premium Leather Office Chair", qty: 30, targetPrice: 8500, subtotal: 255000 }
    ],
    status: "Seller Responded",
    priority: "Medium",
    totalEstimatedValue: 255000,
    buyerMessage: "Need high-end executive chairs for conference room and VIP suites. Delivery required in Bangalore within 10 days.",
    sellerQuotation: {
      quotedValue: 246000,
      paymentTerms: "Net 30",
      shippingTerms: "Doorstep",
      validUntil: "2026-06-08T18:00:00Z",
      message: "Offering our elite Premium Leather Office Chairs at ₹8,200 per unit. Hand-stitched premium leather, 5-year cylinder warranty.",
      items: [
        { id: "P-203", name: "Premium Leather Office Chair", qty: 30, quotedPrice: 8200, subtotal: 246000 }
      ]
    },
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "Buyer",
        date: "2026-05-24T12:00:00Z",
        comment: "Hospitality suite furnishing request submitted."
      },
      {
        stage: "Seller Response",
        user: "Seller (Apex Workspace Direct)",
        date: "2026-05-25T10:15:00Z",
        comment: "Quoted ₹8,200 per chair, ready stock available."
      }
    ],
    createdAt: "2026-05-24T12:00:00Z",
    expiresAt: "2026-06-07T12:00:00Z",
    flagged: false,
    disputes: [
      {
        id: "DISP-101",
        raisedBy: "Buyer",
        type: "Price Discrepancy",
        description: "Seller previously committed to ₹7,800 on email but quoted ₹8,200 in official RFQ. Requesting admin intervention to check logs.",
        status: "Open", // Open, Under Investigation, Resolved, Escalated
        createdAt: "2026-05-26T11:00:00Z",
        resolutionNotes: ""
      }
    ]
  },
  {
    id: "RFQ-2026-1010",
    enquiryNumber: "RFQ-1010",
    buyer: {
      name: "Ramanathan Iyer",
      company: "Iyer Electronics Wholesale",
      gstin: "33DDDDD4433K1Z1",
      email: "riyer@iyerelectronics.in",
      phone: "+91 94450 11223",
      address: "15, Richie Street, Chennai, Tamil Nadu - 600002"
    },
    seller: {
      name: "Super Electro Corp",
      storeName: "Super Electro Online Store",
      id: "SEL-301",
      email: "sales@superelectro.com",
      phone: "+91 98111 88888"
    },
    products: [
      { id: "P-104", name: "HDMI Cable 2.0 (Gold Plated - 3m)", qty: 2000, targetPrice: 110, subtotal: 220000 }
    ],
    status: "Seller Responded",
    priority: "Medium",
    totalEstimatedValue: 220000,
    buyerMessage: "High-speed Ethernet HDMI cables, individually retail packed. Looking for high quality shielding.",
    sellerQuotation: {
      quotedValue: 260000,
      paymentTerms: "Net 15",
      shippingTerms: "Ex-Works",
      validUntil: "2026-06-05T18:00:00Z",
      message: "We quote ₹130 per piece for custom double-shielded copper wires. The target of ₹110 is only possible with steel alloy wiring, which we do not recommend.",
      items: [
        { id: "P-104", name: "HDMI Cable 2.0 (Gold Plated - 3m)", qty: 2000, quotedPrice: 130, subtotal: 260000 }
      ]
    },
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "Buyer",
        date: "2026-05-15T10:00:00Z",
        comment: "Bulk high-spec HDMI cables inquiry."
      },
      {
        stage: "Seller Response",
        user: "Seller (Super Electro Online Store)",
        date: "2026-05-18T16:45:00Z",
        comment: "Quoted ₹130 explaining quality standard differences."
      }
    ],
    createdAt: "2026-05-15T10:00:00Z",
    expiresAt: "2026-05-29T10:00:00Z", // Expires today!
    flagged: false,
    disputes: [
      {
        id: "DISP-102",
        raisedBy: "Seller",
        type: "Communication Breach",
        description: "Buyer is threatening to leave negative reviews if we do not reduce the quote below cost. Harassment on platform.",
        status: "Under Investigation",
        createdAt: "2026-05-20T09:00:00Z",
        resolutionNotes: "Admin verified communication logs. Warning issued to buyer regarding review blackmail policies."
      }
    ]
  },
  {
    id: "RFQ-2026-1011",
    enquiryNumber: "RFQ-1011",
    buyer: {
      name: "Ritesh Deshmukh",
      company: "Deshmukh Infrastructure",
      gstin: "27DDDDD5544J1Z8",
      email: "ritesh@deshmukhinfra.co.in",
      phone: "+91 90000 88888",
      address: "Plot 45, MIDC Industrial Area, Pune - 411018"
    },
    seller: {
      name: "Vanguard Packaging",
      storeName: "Vanguard Box & Carton Co",
      id: "SEL-303",
      email: "orders@vanguardpack.com",
      phone: "+91 44 2444 8888"
    },
    products: [
      { id: "P-303", name: "Stretch Wrap Film Roll (500mm)", qty: 200, targetPrice: 380, subtotal: 76000 }
    ],
    status: "Pending",
    priority: "Low",
    totalEstimatedValue: 76000,
    buyerMessage: "Stretch wrap rolls for warehouse pallet wrapping. Clear 23 micron thickness required. Heavy duty. Quote with delivery to Pune warehouse.",
    sellerQuotation: null,
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "Buyer",
        date: "2026-05-28T08:00:00Z",
        comment: "RFQ initiated."
      }
    ],
    createdAt: "2026-05-28T08:00:00Z",
    expiresAt: "2026-06-11T08:00:00Z",
    flagged: false,
    disputes: []
  },
  {
    id: "RFQ-2026-1012",
    enquiryNumber: "RFQ-1012",
    buyer: {
      name: "Spam Bot 5000",
      company: "Earn Money Fast Ltd",
      gstin: "99AAAAA9999A1Z9",
      email: "winiphone@freecashmail.xyz",
      phone: "+91 90123 45678",
      address: "Internet Highway 1"
    },
    seller: {
      name: "Vanguard Packaging",
      storeName: "Vanguard Box & Carton Co",
      id: "SEL-303",
      email: "orders@vanguardpack.com",
      phone: "+91 44 2444 8888"
    },
    products: [
      { id: "P-000", name: "Make $5000/day online work from home click link", qty: 99999, targetPrice: 1, subtotal: 99999 }
    ],
    status: "Rejected",
    priority: "Low",
    totalEstimatedValue: 99999,
    buyerMessage: "Get free crypto currency and cash immediately click here at www.scampage.com for your cash reward. guaranteed no fraud secure and fast.",
    sellerQuotation: null,
    responseHistory: [
      {
        stage: "RFQ Created",
        user: "Buyer",
        date: "2026-05-27T01:00:00Z",
        comment: "Inquiry generated by automated scraper."
      }
    ],
    createdAt: "2026-05-27T01:00:00Z",
    expiresAt: "2026-06-10T01:00:00Z",
    flagged: true,
    flagReason: "Automated advertisement bot, containing spam link, nonsensical products, high bounce rate email.",
    riskScore: 98,
    spamStatus: "Blocked",
    detectionMethod: "Auto (IP Blocklist)"
  }
];

export const initialAdminB2BAnalytics = {
  totalRFQs: 12,
  pendingCount: 4,
  sellerResponseRate: 85, // in %
  avgResponseTime: "8.4 hours",
  approvalRate: 92, // in %
  disputeCount: 2,
  spamCount: 2,
  topRequestedProducts: [
    { name: "Premium Brass Connectors", count: 2500, value: 105000 },
    { name: "Ergonomic Mesh Chair", count: 45, value: 279000 },
    { name: "Eco Kraft Shopping Bag", count: 5000, value: 60000 },
    { name: "HDMI Cable 2.0", count: 2000, value: 220000 }
  ],
  monthlyTrend: [
    { month: "Jan", rfqs: 15, value: 1200000 },
    { month: "Feb", rfqs: 22, value: 1850000 },
    { month: "Mar", rfqs: 28, value: 2400000 },
    { month: "Apr", rfqs: 35, value: 3100000 },
    { month: "May", rfqs: 48, value: 4250000 }
  ]
};
