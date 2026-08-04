import React from "react";
import { FiBriefcase, FiArrowLeft, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const BusinessOnboardingPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Copyright Notice & Intellectual Property",
      content: `© Peoples League Of Electronics Private Limited. All Rights Reserved.

This Business Onboarding Terms & Conditions document and all associated legal content are the exclusive intellectual property of Peoples League Of Electronics Private Limited. No part of this document may be copied, reproduced, modified, translated, distributed, published, stored, transmitted, or otherwise used in any form or by any means without the Company's prior written consent, except where required by applicable law. Unauthorized use of this document may result in civil and/or criminal liability under applicable intellectual property, contract, and other applicable laws.`
    },
    {
      title: "Chapter 1 – Introduction",
      content: `1.1 Purpose
These Business Onboarding Terms & Conditions ("Onboarding Terms") establish the legal framework governing the registration, onboarding, verification, approval, and activation of Business Users seeking access to the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE").
The purpose of these Onboarding Terms is to:
• establish uniform onboarding standards;
• define eligibility requirements;
• outline verification procedures;
• facilitate regulatory compliance;
• reduce commercial and financial risk;
• protect the integrity of the Platform; and
• establish the rights and obligations of the Company and Business Users throughout the onboarding process.
These Onboarding Terms are intended to promote secure, transparent, and legally compliant commercial relationships before any business transactions are conducted through the Platform.

1.2 Scope
These Onboarding Terms apply to every organization seeking registration or access to the Company's B2B Platform, including:
• private limited companies;
• public limited companies;
• limited liability partnerships (LLPs);
• partnership firms;
• sole proprietorships;
• one person companies (OPCs);
• government organizations;
• public sector undertakings (PSUs);
• statutory bodies;
• educational institutions;
• healthcare institutions;
• non-governmental organizations (NGOs), where approved;
• trusts and societies, where applicable;
• distributors;
• wholesalers;
• retailers;
• channel partners;
• system integrators;
• resellers;
• manufacturers;
• importers;
• exporters; and
• other commercial entities approved by the Company.
These Terms govern only the onboarding process and do not independently create any obligation for the Company to enter into commercial transactions with any applicant.

1.3 Definitions
Unless the context otherwise requires:
"Applicant" means any individual or legal entity applying for registration on the Company's B2B Platform.
"Business User" means an Applicant whose registration has been approved by the Company.
"Authorized Representative" means an individual authorized by the Applicant to act on its behalf.
"Business Account" means the registered B2B account maintained by an approved Business User.
"KYB" means Know Your Business verification procedures.
"KYC" means Know Your Customer verification applicable to authorized individuals.
"Verification" means the process undertaken by the Company to verify business identity, ownership, legal existence, regulatory compliance, banking details, and other onboarding information.
"Platform" means the Company's B2B website, applications, software systems, APIs, portals, and associated digital infrastructure.

1.4 Applicability
These Onboarding Terms apply:
• before Business Account approval;
• during verification procedures;
• throughout onboarding reviews;
• during account activation;
• during periodic re-verification;
• whenever updated onboarding information is required; and
• throughout any subsequent compliance review conducted by the Company.
Completion of onboarding does not guarantee approval of registration, continuation of Business Account access, extension of credit, financing, commercial partnership, or any other commercial relationship unless separately agreed in writing.

1.5 Relationship with Other Agreements
These Onboarding Terms form an integral part of the Company's enterprise legal framework and shall be read together with Business Terms & Conditions, Business User Agreement, Privacy Policy, Shipping & Delivery Policy, Warranty Policy, Return Policy, Purchase Orders, Commercial Agreements, and Schedules A through J.

1.6 Commercial Nature of Onboarding
Business onboarding is a commercial risk management process conducted by the Company for legitimate business purposes including verification, financial assessment, compliance reviews, and sanctions screening.

1.7 Policy Updates
The Company reserves the right to amend, modify, suspend, replace, or update these Onboarding Terms whenever reasonably necessary due to changes in applicable law, regulatory requirements, operational improvements, or fraud prevention measures.

1.8 Interpretation & 1.9 Good Faith
These Terms shall be interpreted reasonably and consistently in accordance with accepted commercial practices. The Company and every Applicant shall perform their respective rights and obligations honestly, reasonably, fairly, and in good faith.

1.10 Compliance with Applicable Law
Interpreted in accordance with the Indian Contract Act 1872, Companies Act 2013, LLP Act 2008, IT Act 2000, Digital Personal Data Protection Act 2023, CGST/SGST Acts 2017, PMLA 2002, and all other applicable laws of India.`
    },
    {
      title: "Chapter 2 – Eligibility for Business Registration",
      content: `2.1 Purpose & 2.2 Eligible Business Entities
Establishes eligibility criteria for registration of Business Users. Eligible entities include Private & Public Limited Companies, OPCs, LLPs, Partnerships, Sole Proprietorships, Government Departments, PSUs, Statutory Authorities, Educational & Healthcare Institutions, NGOs, Trusts, Manufacturers, Distributors, Wholesalers, Retailers, Resellers, Importers, and Exporters.

2.3 Authorized Representatives
Applicants must appoint Authorized Representatives with lawful authority to act on their behalf, provide accurate details, execute agreements, and respond to verification requests.

2.4 Minimum Eligibility Requirements
Applicants must possess valid legal existence, material licenses/registrations, tax registration (GST/PAN), business bank account, accurate info, and satisfy risk assessment.

2.5 Restricted Businesses
Registration may be refused for unlawful activities, sanctions violations, counterfeit goods, stolen property, fraud, money laundering, IP infringement, or unacceptable reputational risk.

2.6 Government Organizations & 2.7 International Businesses
Government bodies and international entities incorporated outside India may register subject to applicable procurement/export control laws, trade regulations, and enhanced documentation (Certificate of Incorporation, Tax IDs, Import-Export Code, beneficial ownership details).

2.8 Verification Standards
Verification includes KYB, KYC, corporate registry, GST/PAN validation, bank account verification, beneficial ownership, sanctions & PEP screening, and financial risk assessment.`
    },
    {
      title: "Chapter 3 – Registration & Verification",
      content: `3.1 Purpose & 3.2 Account Registration
Applicants must complete the prescribed registration providing legal business name, type, registration number, GSTIN, PAN, registered office address, authorized representative details, contact info, and banking details.

3.3 Know Your Business (KYB) Verification
Includes verification of legal existence, incorporation, ownership structure, directors/partners, beneficial ownership, operations, business addresses, and regulatory registrations.

3.4 GST & 3.5 PAN Verification
Validation of GSTIN, trade name, filing status, PAN authenticity, entity name matching, and tax identity.

3.6 Company Registration & 3.7 Bank Account Verification
Verification of Certificate of Incorporation, CIN/LLPIN, bank account ownership, account holder name, banking institution, settlement capability, and penny drop/banking API testing.

3.8 Identity Verification of Authorized Users & 3.9 Enhanced Due Diligence
Verification via government IDs, photo/video/biometric checks where permitted, email/mobile verification, and enhanced due diligence for high-volume or elevated-risk sectors.`
    },
    {
      title: "Chapter 4 – Required Documentation",
      content: `4.1 Purpose & 4.2 Company Documents
Required documentation includes Certificate of Incorporation, MOA, AOA, Partnership Deed, LLP Agreement, Proprietorship Declaration, Trust Deed, or Business Registration Certificate.

4.3 Government Registrations & 4.4 Tax Documents
CIN, LLPIN, GSTIN, IEC, UDYAM Registration, Factory License, PAN, TAN, tax exemption certificates, and withholding tax filings.

4.5 Authorized Signatory & 4.6 Address Verification
Board Resolution, Power of Attorney, Authorization Letter, specimen signature, utility bills, lease agreements, property records, or GST registration certificates.

4.7 Banking Documents & 4.8 Additional Documents
Cancelled cheque, bank verification letter, recent bank statement, financial statements, audit reports, beneficial ownership declarations, insurance certificates, OEM authorizations, and AML declarations.

4.9 Document Validity
All documents must be authentic, accurate, complete, current, and unaltered. Submission of false or forged documents results in immediate rejection, account termination, and legal action.`
    },
    {
      title: "Chapter 5 – Account Approval & Activation",
      content: `5.1 Purpose & 5.2 Review Process
Applications undergo comprehensive review covering business eligibility, legal status, verification results, compliance, and financial suitability.

5.3 Commercial Risk Assessment & 5.4 Approval Decision
Risk assessment evaluates business sector, volume, sanctions screening, fraud indicators, and beneficial ownership complexity. Decisions include Approval, Conditional Approval, Deferral, or Rejection.

5.5 Rejection & 5.6 Conditional Approval
Rejections occur for incomplete docs, fraud indicators, sanctions, or compliance failures. Conditional approvals may require additional security, collateral, or compliance training.

5.7 Account Activation & 5.8 Account Categories
Accounts are activated upon full compliance. Categories include Buyer, Seller, Distributor, Reseller, Manufacturer, Supplier, Government, Educational, Healthcare, and Enterprise Accounts with distinct transaction limits and platform permissions.`
    },
    {
      title: "Chapter 6 – Business User Responsibilities",
      content: `6.1 Purpose & 6.2 Accuracy of Information
Business Users must ensure all submitted information remains truthful, complete, accurate, and current.

6.3 Updating Business Information
Immediate notification is mandatory for changes in business name, ownership, directors, authorized representatives, registered address, GST, PAN, or banking details.

6.4 Security of Credentials & 6.5 Authorized Users
Users are responsible for safeguarding credentials, managing employee permissions, revoking access for departed staff, and reporting security breaches immediately.

6.6 Regulatory Compliance & 6.7 Confidentiality
Users must maintain all active licenses, tax registrations, and statutory filings, and protect non-public platform pricing, quotations, and technical disclosures.

6.8 Cooperation During Verification
Users must cooperate with periodic re-verification, audit requests, compliance reviews, and fraud inquiries.`
    },
    {
      title: "Chapter 7 – Compliance & Due Diligence",
      content: `7.1 Purpose & 7.2 Anti-Fraud Compliance
Prohibits fraud, identity theft, invoice manipulation, document forgery, tax fraud, and unauthorized platform access.

7.3 Anti-Money Laundering (AML) & 7.4 KYB Monitoring
Strict prohibition against laundering proceeds of crime, concealing beneficial ownership, or facilitating illicit financing. Periodic KYB re-verification is enforced.

7.5 Sanctions & 7.6 PEP Screening
Prohibits transacting with sanctioned entities/individuals. Enhanced due diligence applies to Politically Exposed Persons (PEPs).

7.7 Ongoing Monitoring & 7.8 Suspension Pending Review
The Company continuously monitors transactions, ownership changes, and risk indicators. Accounts may be suspended immediately pending investigation of irregularities.`
    }
  ];

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="max-w-4xl mx-auto px-4 py-6 pb-24 min-h-screen">
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
                <FiBriefcase className="text-[#7B0A0A]" /> Business Onboarding Policy
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Peoples League Of Electronics Private Limited • Terms & Conditions
              </p>
            </div>
          </div>

          {/* Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6"
          >
            <div className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
              <FiShield className="text-2xl text-[#7B0A0A] shrink-0 mt-0.5" />
              <p className="text-xs text-[#7B0A0A] leading-relaxed font-semibold">
                These Business Onboarding Terms & Conditions establish the legal framework governing the registration, verification, eligibility, documentation, account approval, and ongoing compliance obligations for B2B applicants and registered Business Users on the PLE Platform.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-8">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-3 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#7B0A0A]"></span>
                    {section.title}
                  </h2>
                  <div className="text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line font-medium">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-xs text-gray-500">
                For questions regarding Business Onboarding or Verification, please contact our Compliance & Onboarding desk at{" "}
                <a href="mailto:compliance@peoplesleagueofelectronics.com" className="text-[#7B0A0A] font-bold underline">
                  compliance@peoplesleagueofelectronics.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default BusinessOnboardingPolicy;
