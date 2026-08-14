import React from "react";
import { FiCheckSquare, FiArrowLeft, FiShield, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const ExecutionAcceptancePolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Effective Date",
      content: `This Business User Agreement shall become effective on the date the Business User first:
• registers a Business Account;
• accesses or uses the Platform;
• places a Purchase Order;
• accepts this Agreement electronically;
• executes a written commercial agreement incorporating this Agreement; or
• otherwise conducts business with Peoples League Of Electronics Private Limited ("Company", "PLE"),
whichever occurs first ("Effective Date").`
    },
    {
      title: "2. Acceptance of Agreement",
      content: `By accessing or using the Platform, creating a Business Account, purchasing Products or Services, or electronically accepting this Agreement, the Business User confirms that it:
• has carefully read this Agreement;
• understands its contents;
• agrees to be legally bound by its terms;
• has the legal authority to enter into this Agreement; and
• will comply with all applicable laws and Company policies.`
    },
    {
      title: "3. Electronic Acceptance",
      content: `The Parties acknowledge and agree that acceptance through electronic means, including click-through acceptance, electronic signatures, authenticated digital consent, or other legally recognized electronic methods, shall constitute valid and enforceable acceptance of this Agreement in accordance with applicable law.`
    },
    {
      title: "4. Authority",
      content: `The individual accepting this Agreement on behalf of the Business User represents and warrants that they are duly authorized to bind the Business User to this Agreement. If such authority does not exist, the individual may be personally responsible for any unauthorized representation to the extent permitted by applicable law.`
    },
    {
      title: "5. Company Information",
      content: `Peoples League Of Electronics Private Limited
Registered Office:
Building No./Flat No.: SHOP NO 25, R.S NO. 1045/3
Road/Street: Ujwal Nagar Main Road
Locality/Sub Locality: 2ND CROSS, LEFT SIDE
City/Town/Village: Belagavi
District: Belagavi
State: Karnataka
Pin Code: 590010

Corporate Identification Number (CIN): U26209KA2025PTC212469
GSTIN: 29AAQCP4616C1Z9
Email: Legal@plebusiness.com
Website: plebusiness.com / peoplesleagueofelectronics.com`
    },
    {
      title: "6. Business User Information",
      content: `• Business Name: ______________________
• Business Registration Number: ______________________
• GSTIN (if applicable): ______________________
• Registered Address: ______________________
• Authorized Representative: ______________________
• Designation: ______________________
• Email: ______________________
• Telephone: ______________________`
    },
    {
      title: "7. Signature",
      content: `For Peoples League Of Electronics Private Limited
Authorized Signatory Name: Owais Raja Mahammad Pathan
Designation: Director

For the Business User
Authorized Representative Name: ______________________
Designation: ______________________
Business Name: ______________________
Signature: ______________________
Date: ______________________`
    },
    {
      title: "8. Good Faith",
      content: `The Parties confirm that they enter into this Agreement voluntarily, honestly, fairly, and in good faith with the intention of creating legally binding obligations.`
    },
    {
      title: "9. Compliance with Applicable Law",
      content: `This Agreement shall be executed and interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Information Technology Act, 2000;
• the Companies Act, 2013;
• the Digital Personal Data Protection Act, 2023; and
• all other applicable laws and regulations.`
    }
  ];

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="max-w-4xl mx-auto px-4 py-6 pb-24 min-h-screen">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                if (window.history.state && window.history.state.idx > 0) {
                  navigate(-1);
                } else {
                  navigate("/profile");
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm border border-gray-200"
              aria-label="Go Back"
            >
              <FiArrowLeft className="text-xl text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                <FiCheckSquare className="text-[#7B0A0A]" /> Execution & Acceptance Policy
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Peoples League Of Electronics Private Limited | B2B Legal Framework
              </p>
            </div>
          </div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-3 p-4 bg-red-50/60 rounded-xl border border-red-100">
              <FiShield className="text-2xl text-[#7B0A0A] shrink-0" />
              <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                This Execution & Acceptance Policy forms a binding commercial agreement for Business Users accessing or transacting on the B2B Platform of Peoples League Of Electronics Private Limited.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-8">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <FiFileText className="text-[#7B0A0A] text-sm" /> {section.title}
                  </h2>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line font-normal">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-xs text-gray-500">
                For legal inquiries regarding execution or acceptance, please contact Legal@plebusiness.com.
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default ExecutionAcceptancePolicy;
