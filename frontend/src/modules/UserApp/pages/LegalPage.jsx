import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiFileText, FiShield, FiUsers, FiAward, FiBriefcase } from "react-icons/fi";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import { legalContent } from "../data/legalContent";

const iconMap = {
  terms: FiFileText,
  privacy: FiShield,
  "user-agreement": FiUsers,
  trademark: FiAward,
  "business-terms": FiBriefcase,
};

const LegalPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const content = legalContent[type];

  if (!content) {
    return (
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
          <p className="text-gray-500 mt-2">The requested legal document could not be found.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-4 py-2 bg-[#AE020B] text-white rounded-xl font-bold"
          >
            Go Back Home
          </button>
        </div>
      </MobileLayout>
    );
  }

  const IconComponent = iconMap[type] || FiFileText;

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="max-w-3xl mx-auto px-4 py-6 pb-24 min-h-screen">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm border border-gray-200"
              aria-label="Go Back"
            >
              <FiArrowLeft className="text-xl text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                <IconComponent className="text-[#AE020B]" /> {content.title}
              </h1>
              <p className="text-xs text-gray-500 font-medium">Last updated: {content.lastUpdated}</p>
            </div>
          </div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6"
          >
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {content.intro}
            </p>

            <div className="border-t border-gray-100 pt-6 space-y-8">
              {content.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900">{section.heading}</h3>
                  <div className="space-y-2">
                    {section.clauses.map((clause, cIdx) => {
                      if (clause.startsWith("•")) {
                        return (
                          <div key={cIdx} className="flex items-start gap-2 pl-4 text-sm text-gray-600 leading-relaxed">
                            <span className="text-[#AE020B] select-none">•</span>
                            <span>{clause.replace("•", "").trim()}</span>
                          </div>
                        );
                      }
                      return (
                        <p key={cIdx} className="text-sm text-gray-600 leading-relaxed pl-2">
                          {clause}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-xs text-gray-500">
                {content.footer}
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default LegalPage;
