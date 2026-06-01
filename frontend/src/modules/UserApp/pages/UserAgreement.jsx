import { FiUsers, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const UserAgreement = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Scope of Agreement",
      content:
        "This User Agreement forms a legally binding contract between you and our platform, defining user privileges, permissions, and operational constraints inside the digital storefront and customer services.",
    },
    {
      title: "2. Eligibility & Representation",
      content:
        "By participating in activities, making purchases, or providing testimonials, you affirm you are legally capable of executing contracts and represent your personal interests or have proper corporate authorizations.",
    },
    {
      title: "3. User Reviews & Community Code",
      content:
        "We allow public product reviews and customer suggestions. You agree that any feedback, comments, or multimedia uploads are respectful, free of spam or slander, and accurately represent honest consumer reviews.",
    },
    {
      title: "4. Account Disabling & Restricting",
      content:
        "We retain absolute rights to limit profile activity, suspend delivery benefits, or terminate access privileges permanently if any violations of the community code, scam actions, or suspicious transactions are observed.",
    },
    {
      title: "5. Disclaimers & Liabilities",
      content:
        "Our platform is provided 'as is' without warranty. While we maintain reliable delivery timelines and product catalog precision, we cannot guarantee zero minor system lag or short-term vendor inventory issues.",
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
                <FiUsers className="text-[#7B0A0A]" /> User Agreement
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
              This Agreement details the rights, guidelines, and obligations for using our B2C customer portal, apps, and services.
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
                If you have questions about this Agreement, please contact our support desk at support@ple.com.
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default UserAgreement;
