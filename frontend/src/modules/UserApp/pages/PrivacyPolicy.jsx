import { FiShield, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We collect personal information that you provide to us, such as your name, email address, phone number, and delivery details when you create an account, make purchases, or contact our support team. We also gather technical data, including device information and usage logs, to optimize your experience.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "Your data is used to process transactions, manage accounts, ship orders, and send notifications regarding updates, special offers, and daily deals. Additionally, we analyze user trends to continuously improve our product quality and platform services.",
    },
    {
      title: "3. Data Sharing & Disclosure",
      content:
        "We do not sell or lease your personal information. We only share details with trusted third parties (such as logistics partners, payment processors, and system administrators) as required to fulfill purchases and maintain security.",
    },
    {
      title: "4. Information Security",
      content:
        "We utilize state-of-the-art security measures, including data encryption and regular vulnerability scanning, to shield your information against unauthorized access, loss, or manipulation.",
    },
    {
      title: "5. Your Privacy Rights",
      content:
        "You reserve the right to review, update, or request the deletion of your personal accounts and historical data at any time. Simply navigate to your Profile page or reach out to our customer support desk for help.",
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
                <FiShield className="text-[#7B0A0A]" /> Privacy Policy
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
              We value your trust and are fully committed to protecting your privacy. This Privacy Policy details how we collect, store, share, and utilize your personal information.
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
                If you have questions about this Policy, please contact our support desk at support@ple.com.
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default PrivacyPolicy;
