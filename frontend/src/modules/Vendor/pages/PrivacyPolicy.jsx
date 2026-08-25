import { motion } from "framer-motion";
import { FiShield, FiArrowLeft, FiMail, FiPhone, FiUser, FiDownload } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import PageTransition from "../../../shared/components/PageTransition";

const CONTACT_DETAILS = {
  name: "Mohmmad Jain kankudti",
  email: "peoplesleagueofelectronics@gmail.com",
  phone: "9513164326",
  company: "Peoples League Of Electronics Private Limited (PLE)",
  address: "SHOP NO 25, R.S NO. 1045/3, Ujwal Nagar Main Road, 2nd Cross Left Side, Belagavi, Karnataka - 590010",
};

const SECTIONS = [
  {
    title: "1. Introduction & Scope",
    content: `Welcome to the Vendor & Seller Privacy Policy of Peoples League Of Electronics Private Limited ("PLE", "Company", "we", "us", or "our"). This Privacy Policy applies to all registered sellers, merchants, distributors, manufacturers, service partners, and authorized business representatives interacting with the PLE Vendor Portal, Vendor APIs, and Marketplace platforms.

As a registered Vendor or applicant, you entrust us with business details, tax identifiers, banking information, catalog data, and operational records. We take the privacy and confidentiality of your commercial and personal data with utmost priority.`
  },
  {
    title: "2. Information We Collect from Vendors",
    content: `To onboard, verify, and support your merchant account on PLE, we collect and process the following information:

A. Business & Identity Information
• Business / Legal Entity Name, Trade Name, and Company Registration details
• Authorized Representative's Name, Designation, and Contact Information
• GSTIN (GST Number) and PAN (Permanent Account Number)
• Address Proof (Registered Business Office & Dispatch / Pickup Warehouses)
• Government-issued ID proof of the primary business account holder

B. Banking & Financial Details
• Bank Account Number, Account Holder Name, and IFSC Code
• Cancelled Cheque / Bank verification documents for payout settlements
• Ledger transactions, settlement statements, platform commission deductions, and Tax Deducted/Collected at Source (TDS/TCS) records

C. Catalog, Inventory & Operational Data
• Product listings, SKU identifiers, descriptions, pricing, warranty terms, and stock levels
• Order dispatch, fulfillment records, shipping tracking numbers, and delivery confirmations
• Customer return and replacement inspections
• Chat conversations and support escalations conducted via the Vendor Portal`
  },
  {
    title: "3. How We Use Vendor Information",
    content: `We process merchant information for lawful business operations, including:
• Verifying seller eligibility, compliance with Indian e-commerce statutory requirements, and GST/PAN validation
• Facilitating marketplace product listings, catalog indexing, and customer order assignments
• Processing payouts, automated payment gateway settlements, and issuing tax invoices/credit notes
• Managing reverse logistics, returns verification, and customer dispute resolution
• Detecting, preventing, and mitigating fraudulent transactions, duplicate listings, or unauthorized brand representation
• Complying with mandatory tax reporting (GST, Income Tax TDS/TCS) and regulatory notices under applicable Indian laws`
  },
  {
    title: "4. Payouts, Financial Data & Third-Party Sharing",
    content: `We do not sell, rent, or trade vendor data to any third party for marketing purposes.
Data is strictly shared on a need-to-know basis with:
• Banking & Payment Gateway Partners: For processing automated settlements and refunds.
• Logistics & Courier Partners: For scheduling warehouse pickups and customer doorstep deliveries.
• Regulatory & Tax Authorities: As required by the GST Council, Central Board of Direct Taxes, or statutory law enforcement agencies under applicable legal warrants.
• Technical Service Providers: Cloud infrastructure providers hosting encrypted databases and audit logs under strict non-disclosure agreements.`
  },
  {
    title: "5. Data Security & Storage",
    content: `All vendor credentials, API tokens, and banking records are secured using enterprise-grade encryption (TLS/HTTPS in transit and AES-256 at rest). Multi-factor authentication (2FA) and role-based access control (RBAC) are enforced across the vendor backend. Sellers are responsible for keeping their vendor passwords and OTPs confidential.`
  },
  {
    title: "6. Vendor Rights & Account Termination",
    content: `Vendors have the right to review, update, or correct their store information, bank details, and contact points via the Vendor Profile Settings. 
Vendors may request termination or permanent deletion of their vendor profile via the Vendor Settings page or by contacting our Grievance Officer, subject to settlement of all outstanding customer orders, pending return windows, and statutory tax audit retention requirements.`
  },
  {
    title: "7. Grievance Officer & Contact Information",
    content: `For any privacy inquiries, data requests, or seller compliance questions, please contact our designated Grievance Officer:

Name: Mohmmad Jain kankudti
Designation: Grievance Officer & Vendor Operations Head
Company: Peoples League Of Electronics Private Limited
Email: peoplesleagueofelectronics@gmail.com
Phone / Mobile: 9513164326
Postal Address:
SHOP NO 25, R.S NO. 1045/3, Ujwal Nagar Main Road, 2ND CROSS, LEFT SIDE, Belagavi, Karnataka - 590010, India.`
  }
];

const VendorPrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const title = "Vendor & Seller Privacy Policy - Peoples League Of Electronics Private Limited";
    const date = "Last updated: July 2026";
    const content = SECTIONS.map((s) => `${s.title}\n${s.content}`).join("\n\n");
    const fullText = `${title}\n${date}\n\n${content}`;

    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PLE_Vendor_Privacy_Policy.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (window.history.state && window.history.state.idx > 0) {
                    navigate(-1);
                  } else {
                    navigate("/vendor/login");
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 border border-gray-200"
              >
                <FiArrowLeft className="text-lg" />
              </button>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Vendor Portal
                </span>
                <h1 className="text-base sm:text-lg font-extrabold text-gray-900 flex items-center gap-1.5 mt-0.5">
                  <FiShield className="text-purple-600" /> Vendor Privacy Policy
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleDownload}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all"
              >
                <FiDownload />
                <span>Download</span>
              </button>
              <Link
                to="/vendor/login"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Vendor Login
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
          {/* Spotlight Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg mb-8 relative overflow-hidden"
          >
            <div className="relative z-10 space-y-4">
              <span className="inline-block px-3 py-1 bg-white/10 text-purple-200 rounded-full text-xs font-semibold uppercase tracking-wider">
                Seller Protection & Compliance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Merchant Data Protection & Privacy
              </h2>
              <p className="text-sm text-purple-100 leading-relaxed max-w-2xl">
                This policy outlines our commitments regarding how merchant credentials, financial transactions, product catalogs, and payout records are handled with confidentiality and data protection standards.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-purple-200 border-t border-white/10">
                <span><strong>Last Updated:</strong> July 2026</span>
                <span>•</span>
                <span><strong>Applicability:</strong> All PLE Registered Sellers & Suppliers</span>
              </div>
            </div>
          </motion.div>

          {/* Policy Sections */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-8">
            {SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-2 border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">{section.title}</h3>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}

            {/* Grievance & Officer Box */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 sm:p-6 space-y-3 mt-6">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-base">
                <FiUser className="text-purple-700 text-lg" />
                <span>Designated Grievance & Compliance Officer</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
                <div>
                  <span className="text-gray-500 block font-medium">Officer Name:</span>
                  <span className="font-bold text-gray-900 text-sm">{CONTACT_DETAILS.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Designation:</span>
                  <span className="font-bold text-gray-900 text-sm">Grievance Officer & Operations Head</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Contact Email:</span>
                  <a
                    href={`mailto:${CONTACT_DETAILS.email}`}
                    className="font-bold text-purple-700 hover:underline text-sm"
                  >
                    {CONTACT_DETAILS.email}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500 block font-medium">Contact Phone:</span>
                  <a
                    href={`tel:${CONTACT_DETAILS.phone}`}
                    className="font-bold text-purple-700 hover:underline text-sm"
                  >
                    {CONTACT_DETAILS.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default VendorPrivacyPolicy;
