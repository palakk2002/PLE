import { FiRefreshCw, FiArrowLeft, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import { useAuthStore } from "../../../shared/store/authStore";
import { useB2bStore } from "../../../shared/store/b2bStore";
import toast from "react-hot-toast";

const ReturnPolicy = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const b2bUserRole = useB2bStore((state) => state.userRole);
  const isB2BUser = user?.role === 'b2bAdmin' || user?.role === 'b2bEmployee' || user?.isEmployee || b2bUserRole === 'business_buyer';

  const sections = [
    {
      title: "1. Return Window",
      content: isB2BUser 
        ? "For bulk B2B purchases, return claims must be initiated within 14 days of delivery. Standard B2C purchases have a 7-day return window."
        : "We offer a 7-day return/replacement window for standard B2C customer purchases. If you receive a damaged, defective, or incorrect product, you can initiate a claim directly via your Orders page within 7 days of delivery.",
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
    ...(isB2BUser ? [
      {
        title: "6. B2B Restocking Fees & Bulk Conditions",
        content:
          "All verified bulk B2B returns for non-defective items are subject to a 15% restocking fee. Custom-manufactured goods or bulk orders exceeding 100 units cannot be returned unless found defective or damaged upon arrival.",
      }
    ] : []),
  ];

  const handleDownload = () => {
    const title = isB2BUser ? "PLE B2B Return Policy" : "PLE Return Policy";
    const date = "Last updated: June 2026";
    let text = `${title}\n${date}\n\n`;
    
    sections.forEach(s => {
      text += `${s.title}\n${s.content}\n\n`;
    });
    
    text += "If you have questions about our Return Policy, please reach out to our customer service desk at support@ple.com.";
    
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isB2BUser ? "B2B_Return_Policy.txt" : "Return_Policy.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

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
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-[#7B0A0A] hover:bg-[#9B1C1C] text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <FiDownload className="text-sm" />
                {isB2BUser ? "Download B2B Return Policy" : "Download Return Policy"}
              </button>
            </div>
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
