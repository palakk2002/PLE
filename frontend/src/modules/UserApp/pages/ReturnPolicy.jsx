import { FiRefreshCw, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const ReturnPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Return Window",
      content:
        "We offer a 7-day return/replacement window for standard B2C customer purchases. If you receive a damaged, defective, or incorrect product, you can initiate a claim directly via your Orders page within 7 days of delivery.",
    },
    {
      title: "2. Conditions for Returns",
      content:
        "Products must be returned in their original packaging, unused, and with all original tags, user manuals, and warranty cards intact. Certain items (such as personal hygiene products or customized orders) are strictly non-returnable.",
    },
    {
      title: "3. Refund Processing",
      content:
        "Once a returned item is received at our fulfillment center and successfully passes quality inspection, refunds are processed within 3-5 business days. Funds will be issued directly to the original payment instrument or account wallet.",
    },
    {
      title: "4. Return Shipping",
      content:
        "We provide free return shipping labels for verified damaged or incorrect items. For general returns based on subjective preferences, a minor return logistics fee may be deducted from your final refund amount.",
    },
    {
      title: "5. Replacement Policy",
      content:
        "If you prefer a direct replacement instead of a refund, simply specify your choice during the return creation flow. Replacements are subject to real-time vendor inventory availability.",
    },
  ];

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="max-w-3xl mx-auto px-4 py-6 pb-24 min-h-screen">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm border border-gray-200"
            >
              <FiArrowLeft className="text-xl text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                <FiRefreshCw className="text-[#7B0A0A]" /> Return Policy
              </h1>
              <p className="text-xs text-gray-500 font-medium">Last updated: June 2026</p>
            </div>
          </div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6"
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              We want you to be completely satisfied with your purchase. This Return Policy outlines our guidelines for returns, refunds, and product replacements.
            </p>

            <div className="border-t border-gray-100 pt-6 space-y-6">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-gray-800">{section.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-xs text-gray-500">
                If you have questions about our Return Policy, please reach out to our customer service desk at support@ple.com.
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default ReturnPolicy;
