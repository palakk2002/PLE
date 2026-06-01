import { FiFileText, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const TermsConditions = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Agreement to Terms",
      content:
        "By accessing or using our B2C customer application, you explicitly agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree, you are prohibited from using the platform.",
    },
    {
      title: "2. Account Registration & Safety",
      content:
        "When registering, you agree to supply authentic, exact, and complete registration details. You are responsible for preserving credentials and password confidentiality and assume liability for actions occurring under your account.",
    },
    {
      title: "3. Acceptable Platform Use",
      content:
        "You must not abuse, disrupt, or exploit platform assets. Attempting unauthorized penetration, reverse-engineering our codebases, or executing automated scripts without permission is strictly prohibited.",
    },
    {
      title: "4. Purchasing & Payments",
      content:
        "We support diverse secure online payments. You warrant that you own or possess legal rights to use any selected credit card, mobile wallet, or online instrument. All transactions are final unless stated otherwise in our Return Policy.",
    },
    {
      title: "5. Intellectual Property Rights",
      content:
        "All visual designs, text assets, product lists, interactive widgets, scripts, source code, logo, and brand images are proprietary and intellectual properties of our system. No redistribution or cloning is permitted without consent.",
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
                <FiFileText className="text-[#7B0A0A]" /> Terms & Conditions
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
              Please read these Terms and Conditions carefully before utilizing our applications or placing orders on our store.
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
                If you have questions about these Terms, please reach out to our legal desk at legal@ple.com.
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default TermsConditions;
