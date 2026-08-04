import { FiUsers, FiArrowLeft, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import { useAuthStore } from "../../../shared/store/authStore";
import { useB2bStore } from "../../../shared/store/b2bStore";
import { useBusinessBuyer } from "../hooks/useBusinessBuyer";
import toast from "react-hot-toast";

const UserAgreement = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const b2bUserRole = useB2bStore((state) => state.userRole);
  const { isBusiness } = useBusinessBuyer();
  
  const isB2BUser = isBusiness || user?.role === 'b2bAdmin' || user?.role === 'b2bEmployee' || user?.isEmployee || b2bUserRole === 'business_buyer';

  const b2bSections = [
    {
      title: "BUSINESS USER AGREEMENT (B2B)",
      content: `Peoples League Of Electronics Private Limited\nVersion: 1.0`
    },
    {
      title: "Chapter 1 – Introduction",
      content: `1.1 Purpose
This Business User Agreement ("Agreement") establishes the legally binding terms governing access to and use of the Business-to-Business ("B2B") Platform, Products, Services, software, applications, websites, procurement solutions, corporate wallet services, and related business offerings provided by Peoples League Of Electronics Private Limited ("Company", "PLE", "we", "our", or "us"). This Agreement is intended to define the rights, obligations, responsibilities, and commercial relationship between the Company and each registered Business User.

1.2 Parties
This Agreement is entered into between: Peoples League Of Electronics Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at the address notified by the Company from time to time, and the business entity, organization, institution, government body, partnership, sole proprietorship, limited liability partnership, corporation, association, or other legally recognized entity that registers for or uses the Company's B2B Platform ("Business User", "Customer", or "Organization"). Each may be referred to individually as a "Party" and collectively as the "Parties."

1.3 Scope of Agreement
This Agreement governs the Business User's access to and use of:
• the Company's B2B Platform;
• business procurement services;
• quotation and RFQ systems;
• purchase order management;
• supplier and marketplace services;
• corporate wallet services;
• employee wallet functionality;
• payment solutions;
• logistics coordination;
• warranty services;
• support services;
• software applications;
• APIs and integrations, where applicable; and
• any other business services made available by the Company.
This Agreement applies to all administrators, employees, authorized representatives, contractors, consultants, and other individuals accessing the Platform on behalf of the Business User.

1.4 Acceptance of this Agreement
By:
• registering a Business Account;
• creating an Administrator Account;
• inviting employees;
• accessing the Platform;
• placing Purchase Orders;
• depositing funds into the Corporate Wallet;
• allocating funds to Employee Wallets;
• using any Product or Service; or
• otherwise continuing to use the Company's services,
the Business User confirms that it has read, understood, and agrees to be legally bound by this Agreement. Where an individual accepts this Agreement on behalf of a Business User, such individual represents and warrants that they possess the necessary authority to legally bind that Business User.

1.5 Definitions
Unless otherwise defined elsewhere in this Agreement:
• Administrator means an individual authorized by the Business User to manage the Business Account.
• Authorized User means any individual permitted by the Business User to access the Platform.
• Business Account means the registered organizational account maintained on the Platform.
• Corporate Wallet means the organizational digital wallet maintained for a Business User.
• Employee Wallet means an individual wallet assigned to an authorized employee under the Corporate Wallet.
• Platform means the Company's websites, applications, software, APIs, procurement systems, and related digital services.
• Products means goods supplied through the Platform.
• Services means all business services provided by the Company.
• Purchase Order or PO means an order submitted through the Platform or otherwise accepted by the Company.
• Business Terms & Conditions means the Company's Business Terms & Conditions, including all applicable schedules.
• Applicable Law means all laws, regulations, governmental orders, rules, directives, and judicial decisions applicable to the Parties.
Capitalized terms not defined in this Agreement shall have the meanings assigned to them in the Business Terms & Conditions.

1.6 Relationship with Other Policies
This Agreement shall be read together with the Company's:
• Business Terms & Conditions;
• Privacy Policy;
• Data Processing Requirements;
• Corporate Wallet & Fund Management Policy;
• Seller & Partner Policies, where applicable;
• Warranty Policy;
• Return Merchandise Authorization (RMA) Policy;
• Shipping & Logistics Policies;
• Cookies Policy;
• Intellectual Property Policy; and
• any additional policies or guidelines published by the Company from time to time.
In the event of any inconsistency:
1. a separately executed commercial agreement between the Parties shall prevail to the extent of the inconsistency;
2. this Agreement shall prevail over operational policies;
3. operational schedules and policies shall prevail for the specific subject matter they govern.

1.7 Amendments
The Company reserves the right to amend, update, modify, or replace this Agreement from time to time where reasonably necessary for:
• legal compliance;
• regulatory requirements;
• operational improvements;
• security enhancements;
• new Products or Services;
• technological developments; or
• legitimate business purposes.
Material changes shall become effective upon publication on the Platform or upon such later date as specified by the Company. Continued use of the Platform after the effective date of any amendment shall constitute acceptance of the revised Agreement. Where required by applicable law, the Company shall provide prior notice of material changes.

1.8 Electronic Records and Communications
The Business User agrees that:
• this Agreement may be executed electronically;
• electronic records shall have the same legal effect as physical records, where permitted by applicable law;
• electronic communications, notices, approvals, invoices, purchase confirmations, and transaction records may be maintained electronically;
• electronic acceptance shall constitute legally binding acceptance; and
• the Company may communicate through email, the Platform, SMS, or other approved electronic means.

1.9 Independent Commercial Relationship
Nothing contained in this Agreement shall be construed as creating:
• a partnership;
• joint venture;
• employment relationship;
• agency relationship;
• fiduciary relationship;
• franchise;
• representative office; or
• exclusive commercial arrangement
between the Parties. Each Party shall remain an independent legal entity responsible for its own business operations.

1.10 Good Faith
The Parties agree to perform their respective obligations honestly, fairly, transparently, and in good faith. Each Party shall cooperate with the other to facilitate efficient commercial operations, resolve operational issues, and support the successful use of the Platform.

1.11 Compliance with Applicable Law
This Agreement shall be interpreted and enforced in accordance with:
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023;
• the Indian Contract Act, 1872;
• the Goods and Services Tax laws;
• the Foreign Exchange Management Act, 1999, where applicable;
• and all other applicable laws and regulations.
Where any provision of this Agreement conflicts with mandatory legal requirements, the applicable law shall prevail to the extent of such inconsistency.`
    },
    {
      title: "Chapter 2 – Business Eligibility",
      content: `2.1 Purpose
This Chapter establishes the eligibility requirements for organizations seeking to register for, access, or use the Business-to-Business ("B2B") Platform and Services provided by Peoples League Of Electronics Private Limited ("Company", "PLE"). Only eligible Business Users meeting the requirements of this Chapter may register and maintain a Business Account.

2.2 Eligible Business Entities
The Company's B2B Platform is intended exclusively for legitimate business and institutional use. Eligible entities may include:
• Companies incorporated under applicable law;
• Limited Liability Partnerships (LLPs);
• Partnership Firms;
• Sole Proprietorships;
• Government Departments and Public Sector Undertakings;
• Educational Institutions;
• Hospitals and Healthcare Institutions;
• Non-Governmental Organizations (NGOs);
• Trusts and Societies;
• Startups;
• Manufacturers;
• Importers and Exporters;
• Distributors;
• Wholesalers;
• Retail Businesses purchasing for commercial purposes; and
• any other entity approved by the Company.
The Company reserves the right to determine whether an applicant qualifies as an eligible Business User.

2.3 Legal Capacity
The Business User represents and warrants that it:
• is duly organized and validly existing under applicable law;
• possesses the legal authority to conduct its business;
• has the legal capacity to enter into binding contracts;
• has obtained all necessary corporate approvals for entering into this Agreement; and
• is not prohibited by law from using the Platform or purchasing Products or Services offered by the Company.

2.4 Authorized Representative
Registration on behalf of a Business User shall only be completed by an individual who:
• is at least eighteen (18) years of age or has otherwise attained the legal age required under applicable law;
• has authority to legally bind the Business User;
• has been duly authorized by the Business User;
• provides accurate registration information; and
• accepts this Agreement on behalf of the Business User.
The Company may request evidence of such authority at any time.

2.5 Business Registration Requirements
The Business User shall provide accurate and complete business information, which may include:
• Legal Name;
• Trade Name, if applicable;
• Certificate of Incorporation or Registration;
• GST Identification Number (GSTIN), where applicable;
• Permanent Account Number (PAN);
• Corporate Identification Number (CIN), where applicable;
• LLP Identification Number (LLPIN), where applicable;
• UDYAM Registration, where applicable;
• Registered Office Address;
• Principal Place of Business;
• Authorized Contact Details;
• Banking Information, where required; and
• any additional information reasonably requested by the Company.
Submission of information does not guarantee approval.

2.6 Identity Verification (KYC)
The Company may require the Business User and its authorized representatives to complete Know Your Customer ("KYC") verification. KYC verification may include:
• identity verification;
• business registration verification;
• tax registration verification;
• address verification;
• banking verification;
• verification of authorized signatories;
• sanctions screening;
• fraud prevention checks; and
• any other due diligence considered necessary by the Company.
The Company may engage third-party verification providers for this purpose.

2.7 Accuracy of Information
The Business User represents and warrants that all information provided:
• is accurate;
• is complete;
• is current;
• is not misleading;
• is supported by authentic documentation where required; and
• shall remain updated throughout the duration of the Business Account.
The Business User shall promptly notify the Company of any material changes to its information.

2.8 Ongoing Eligibility
Eligibility is an ongoing requirement. The Business User shall continuously maintain:
• valid legal existence;
• applicable licenses and registrations;
• tax compliance;
• operational capacity;
• regulatory compliance;
• authority of its representatives; and
• compliance with this Agreement.
Failure to maintain eligibility may result in suspension or termination of the Business Account.

2.9 Restricted Persons and Prohibited Entities
The following may be restricted from accessing or using the Platform:
• entities prohibited under applicable law;
• entities subject to applicable sanctions or trade restrictions;
• entities involved in unlawful activities;
• organizations providing false or misleading information;
• businesses previously suspended or terminated by the Company for material breaches;
• entities using the Platform for fraudulent, abusive, or unauthorized purposes; and
• any person or entity that, in the Company's reasonable judgment, presents an unacceptable legal, regulatory, financial, operational, or reputational risk.
Any restriction or refusal shall be exercised in accordance with applicable law and the Company's internal risk management policies.

2.10 Approval of Registration
Business registration is subject to review and approval by the Company. The Company may:
• approve;
• conditionally approve;
• request additional documentation;
• defer approval pending verification; or
• reject an application,
where it reasonably determines that eligibility requirements have not been met or that approval would expose the Company to unacceptable legal, regulatory, financial, operational, or reputational risk. Unless required by applicable law, the Company is not obligated to disclose the detailed reasons for rejection.

2.11 Business Responsibilities
The Business User agrees to:
• use the Platform solely for lawful business purposes;
• ensure that only authorized individuals access the Business Account;
• maintain the confidentiality of account credentials;
• comply with all applicable laws and Company policies;
• cooperate during verification or compliance reviews; and
• promptly report any unauthorized access or suspected misuse of the Business Account.

2.12 Good Faith
The Business User and the Company shall act honestly, transparently, and in good faith throughout the registration, verification, and ongoing business relationship. The Business User shall provide truthful information and cooperate with reasonable verification requests, while the Company shall administer eligibility assessments fairly and consistently.

2.13 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Companies Act, 2013;
• the Indian Contract Act, 1872;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023;
• the Goods and Services Tax laws;
• the Prevention of Money Laundering Act, 2002, where applicable;
• the Foreign Exchange Management Act, 1999, where applicable; and
• all other applicable laws and regulations.
Where any provision of this Chapter conflicts with mandatory legal requirements, the applicable law shall prevail to the extent of such inconsistency.`
    },
    {
      title: "Chapter 3 – Business Account",
      content: `3.1 Purpose
This Chapter establishes the terms governing the creation, administration, operation, security, and management of Business Accounts maintained on the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). A Business Account serves as the primary organizational account through which a Business User may access the Company's Products, Services, Corporate Wallet, procurement tools, employee management features, and other business functionalities.

3.2 Business Account Registration
Eligible Business Users may apply to register a Business Account by completing the registration process prescribed by the Company. Registration may require the Business User to provide:
• business information;
• authorized representative details;
• statutory registrations;
• contact information;
• tax information;
• verification documents;
• banking information where required; and
• any additional information reasonably requested by the Company.
The Company may verify the information provided before activating the Business Account.

3.3 Account Approval
Business Accounts shall become active only after approval by the Company. The Company may:
• approve the application;
• request additional information;
• approve the account subject to conditions;
• temporarily suspend activation pending verification; or
• reject the application.
Approval of a Business Account does not guarantee approval for any specific Product, Service, credit facility, or commercial transaction.

3.4 Business Account Structure
Each Business Account shall operate under an organizational hierarchy. The account may include:
• one or more Administrators;
• department managers;
• procurement managers;
• finance personnel;
• purchasing officers;
• employees;
• auditors;
• viewers; and
• other user roles approved by the Company.
Access rights shall depend upon the permissions assigned by the Business User.

3.5 Administrator Accounts
The first approved user shall ordinarily become the Primary Administrator unless otherwise determined by the Business User. Administrators may:
• invite employees;
• remove employees;
• assign user roles;
• manage permissions;
• manage the Corporate Wallet;
• allocate funds;
• approve purchases;
• manage departments;
• configure approval workflows;
• monitor transactions;
• access reports;
• suspend employee access; and
• perform other administrative functions made available by the Platform.
Administrators act on behalf of the Business User.

3.6 Employee Accounts
The Business User may authorize employees to access the Platform. Employees may receive access to:
• assigned procurement functions;
• Employee Wallets;
• quotations;
• purchase requests;
• approved budgets;
• invoices;
• transaction history;
• project information; and
• other features permitted by the Administrator.
Employee access remains subject to the permissions established by the Business User.

3.7 User Roles and Permissions
The Platform may support role-based access control. Available roles may include:
• Primary Administrator;
• Administrator;
• Finance Manager;
• Procurement Manager;
• Department Manager;
• Project Manager;
• Purchasing Officer;
• Employee;
• Finance Reviewer;
• Auditor;
• Read-Only User; and
• any additional role introduced by the Company.
Each role shall have only those permissions assigned by the Business User or the Platform.

3.8 Responsibility for Authorized Users
The Business User remains fully responsible for:
• all actions performed through its Business Account;
• activities conducted by Administrators;
• activities conducted by employees;
• purchases made using assigned permissions;
• management of internal approvals;
• maintenance of accurate user records; and
• compliance with this Agreement.
The Business User shall ensure that all Authorized Users comply with this Agreement and applicable Company policies.

3.9 Account Security
The Business User shall implement reasonable security measures, including:
• maintaining secure passwords;
• protecting login credentials;
• enabling Multi-Factor Authentication (MFA), where available;
• restricting unauthorized access;
• periodically reviewing user permissions;
• removing inactive users;
• monitoring account activity; and
• promptly reporting suspected security incidents.
The Company may implement additional security measures where reasonably necessary.

3.10 Account Information
The Business User shall ensure that all Business Account information remains:
• accurate;
• complete;
• current;
• truthful; and
• supported by authentic documentation where required.
Material changes relating to ownership, contact information, authorized representatives, tax registrations, or legal status shall be updated promptly.

3.11 Internal Organizational Management
The Platform may allow Business Users to establish internal organizational structures, including:
• departments;
• branches;
• regional offices;
• subsidiaries;
• business units;
• project teams;
• procurement groups;
• approval hierarchies; and
• cost centers.
Such organizational structures are intended solely for operational convenience and do not alter the legal responsibilities of the Business User under this Agreement.

3.12 Account Monitoring
The Company may monitor Business Accounts for purposes including:
• fraud prevention;
• cybersecurity;
• regulatory compliance;
• operational performance;
• service improvement;
• technical support;
• audit activities; and
• enforcement of this Agreement.
Monitoring shall be conducted in accordance with applicable law and the Company's Privacy Policy.

3.13 Suspension of Business Accounts
The Company may suspend a Business Account, in whole or in part, where it reasonably determines that:
• this Agreement has been materially breached;
• fraudulent or unauthorized activity is suspected;
• required verification cannot be completed;
• applicable laws require suspension;
• security of the Platform may be compromised;
• payment obligations remain materially overdue;
• false information has been provided; or
• continued access presents significant legal, regulatory, operational, financial, or reputational risk.
Where reasonably practicable, the Company may provide notice before suspension.

3.14 Closure of Business Accounts
A Business Account may be closed:
• at the request of the Business User;
• upon mutual agreement of the Parties;
• following termination of this Agreement;
• upon dissolution of the Business User;
• where required by law; or
• by the Company in accordance with this Agreement.
Closure shall not affect:
• outstanding payment obligations;
• pending Purchase Orders;
• ongoing warranty claims;
• dispute resolution procedures;
• audit rights; or
• obligations intended to survive termination.

3.15 Account Records
The Company may maintain records relating to:
• Business Account registration;
• user access;
• login history;
• administrative actions;
• employee invitations;
• permission changes;
• procurement activity;
• Corporate Wallet transactions;
• Employee Wallet transactions;
• audit logs;
• communications; and
• security events.
Such records may be retained for operational management, regulatory compliance, auditing, fraud prevention, dispute resolution, and legal purposes.

3.16 No Transfer of Business Account
A Business Account is personal to the registered Business User. The Business User shall not:
• sell;
• assign;
• transfer;
• lease;
• sublicense;
• permit unauthorized access to; or
• otherwise dispose of
the Business Account without the Company's prior written consent. Any approved transfer shall remain subject to the Company's verification procedures.

3.17 Good Faith
The Parties shall cooperate in good faith to maintain secure, accurate, and efficient Business Account operations. The Business User shall responsibly manage its Administrators and Authorized Users, and the Company shall administer the Platform in a fair, transparent, and commercially reasonable manner.

3.18 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Companies Act, 2013;
• the Indian Contract Act, 1872;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023;
• the Goods and Services Tax laws;
• applicable cybersecurity regulations; and
• all other applicable laws and regulations.
Where any provision of this Chapter conflicts with mandatory legal requirements, the applicable law shall prevail to the extent of such inconsistency.`
    },
    {
      title: "Chapter 4 – Corporate Wallet & Employee Wallet",
      content: `4.1 Purpose
This Chapter governs the creation, administration, funding, allocation, management, and use of the Corporate Wallet and Employee Wallet services provided by Peoples League Of Electronics Private Limited ("Company", "PLE") through its Business-to-Business ("B2B") Platform. The Corporate Wallet enables Business Users to centrally manage organizational purchasing funds while allowing authorized employees to conduct approved business transactions within limits established by the Business User. The Wallet Services are designed solely as an internal business payment and fund management tool within the Platform and shall not be construed as a banking service, deposit account, electronic money, prepaid payment instrument, or regulated financial product unless expressly stated otherwise and required by applicable law.

4.2 Wallet Structure
Each approved Business Account may be assigned one or more Corporate Wallets by the Company. The Wallet structure consists of:
• Corporate Wallet, managed by the Business User through its Administrators;
• Employee Wallets, assigned to Authorized Employees;
• transaction records;
• allocation records;
• audit logs; and
• associated wallet management tools made available by the Platform.
The Company reserves the right to modify wallet functionality as the Platform evolves.

4.3 Corporate Wallet
The Corporate Wallet serves as the primary organizational wallet. It may be used to:
• receive company-funded deposits;
• maintain organizational purchasing balances;
• allocate funds to Employee Wallets;
• approve departmental budgets;
• manage project allocations;
• receive refunds;
• maintain transaction records;
• monitor expenditures; and
• perform other functions provided by the Platform.
The Corporate Wallet shall remain under the control of the Business User through its designated Administrators.

4.4 Employee Wallet
The Company may assign an individual Employee Wallet to each Authorized Employee. An Employee Wallet may:
• receive allocations from the Corporate Wallet;
• receive personal deposits made by the Employee, where permitted;
• receive approved refunds;
• make purchases authorized by the Business User;
• maintain transaction history;
• display available balances; and
• perform other wallet functions supported by the Platform.
An Employee Wallet shall remain linked to the Business User's Corporate Wallet and shall not constitute an independent business account.

4.5 Sources of Funds
Funds within the Wallet system may originate from one or more of the following sources:
(a) Company Funds
Funds deposited into the Corporate Wallet by the Business User.
(b) Employee Personal Funds
Funds voluntarily deposited by an Employee into the Employee Wallet using approved payment methods.
(c) Refund Credits
Amounts credited following approved refunds, cancellations, warranty claims, or other adjustments.
(d) Promotional Credits
Credits, incentives, rewards, cashback, or promotional balances issued by the Company.
(e) Other Credits
Any additional credit category introduced by the Company from time to time.
The Platform may separately identify each category of funds for accounting and operational purposes.

4.6 Administrator Authority
Subject to permissions configured by the Business User, Administrators may:
• deposit Company Funds into the Corporate Wallet;
• allocate Company Funds to Employee Wallets;
• approve or reject funding requests;
• establish departmental budgets;
• set employee spending limits;
• approve purchases;
• freeze Employee Wallets;
• suspend wallet access;
• monitor wallet activity;
• review reports;
• reallocate available Company Funds; and
• perform additional administrative functions provided by the Platform.
Administrators act solely on behalf of the Business User.

4.7 Employee Authority
Employees may, subject to permissions granted by the Business User:
• receive Company Fund allocations;
• deposit personal funds into their Employee Wallet;
• use available balances for authorized purchases;
• submit purchase requests;
• request additional funding;
• review wallet balances;
• access transaction history;
• download available statements; and
• perform other wallet functions permitted by the Platform.
Employees shall use the Wallet solely for lawful business purposes unless expressly authorized by the Business User.

4.8 Allocation of Company Funds
Administrators may allocate Company Funds from the Corporate Wallet to one or more Employee Wallets. Allocations may be based upon:
• departments;
• projects;
• business units;
• purchase requests;
• employee roles;
• procurement requirements;
• expense budgets; or
• other organizational criteria established by the Business User.
Allocated Company Funds remain organizational assets of the Business User until applied to an authorized transaction.

4.9 Employee Personal Funds
Employees may voluntarily deposit personal funds into their Employee Wallet where the Platform permits. Personal funds:
• shall remain separately identifiable from Company Funds;
• may be used for purchases permitted by the Platform;
• shall not automatically become Company property;
• may be subject to separate refund procedures; and
• shall remain subject to applicable payment processing requirements.
The Company shall maintain reasonable operational separation between Company Funds and Employee Personal Funds within its records.

4.10 Spending Limits
The Business User may establish spending controls including:
• maximum transaction values;
• daily spending limits;
• weekly spending limits;
• monthly spending limits;
• departmental budgets;
• project budgets;
• merchant restrictions;
• Product category restrictions;
• approval thresholds; and
• other configurable spending controls supported by the Business User.
The Company shall not be responsible for internal spending policies established by the Business User.

4.11 Purchase Approval Workflow
Where enabled by the Business User, purchases may require one or more internal approvals before completion. Approval workflows may include:
• employee request;
• manager approval;
• finance approval;
• procurement approval;
• administrator approval; or
• any other approval hierarchy configured by the Business User.
The Company provides the workflow functionality but is not responsible for internal approval decisions.

4.12 Wallet Transactions
Wallet transactions may include:
• Company deposits;
• employee deposits;
• fund allocations;
• purchase payments;
• refunds;
• cancellations;
• promotional credits;
• wallet adjustments;
• administrative corrections; and
• other transactions supported by the Platform.
Each transaction may generate an electronic record.

4.13 Refunds and Reversals
Approved refunds may be credited to:
• the original funding source;
• the Corporate Wallet;
• the Employee Wallet;
• another approved payment method; or
• another destination determined under the applicable refund policy.
Where purchases were funded using multiple funding sources, refunds may be apportioned in accordance with the Platform's refund procedures.

4.14 Wallet Suspension
The Company may suspend or restrict Wallet functionality where it reasonably determines that:
• fraudulent activity is suspected;
• unauthorized access has occurred;
• legal or regulatory requirements require suspension;
• payment verification is incomplete;
• material security concerns exist;
• this Agreement has been materially breached; or
• continued operation presents significant legal, financial, operational, or reputational risk.
Where reasonably practicable, the Company shall provide notice of such suspension.

4.15 Audit Trail
The Platform may maintain comprehensive electronic records relating to:
• deposits;
• allocations;
• spending;
• approvals;
• transfers;
• refunds;
• administrative actions;
• login activity;
• wallet adjustments;
• security events; and
• other wallet-related activities.
Such records may be retained for accounting, auditing, fraud prevention, regulatory compliance, dispute resolution, and operational purposes.

4.16 Wallet Balances
Wallet balances displayed on the Platform represent the recorded available balance at the time of display and may be subject to pending authorizations, processing delays, reversals, settlements, or technical adjustments. The Company reserves the right to correct any clerical, accounting, or technical errors affecting wallet balances after providing appropriate notice where reasonably practicable.

4.17 No Interest or Investment
Unless expressly required by applicable law or agreed in writing:
• Wallet balances shall not earn interest;
• Wallet balances shall not constitute investments;
• Wallet balances shall not create any fiduciary relationship between the Company and the Business User or Employee; and
• the Company shall not be liable for any opportunity cost associated with maintaining Wallet balances.

4.18 Good Faith
The Parties shall administer and use the Corporate Wallet and Employee Wallet honestly, responsibly, and in good faith. The Business User shall establish appropriate internal controls over wallet usage, and the Company shall administer the Wallet Services in a fair, transparent, and commercially reasonable manner.

4.19 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Companies Act, 2013;
• the Indian Contract Act, 1872;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023;
• the Goods and Services Tax laws;
• the Prevention of Money Laundering Act, 2002, where applicable;
• the Foreign Exchange Management Act, 1999, where applicable; and
• all other applicable laws and regulations.
Where any provision of this Chapter conflicts with mandatory legal requirements, the applicable law shall prevail to the extent of such inconsistency.`
    },
    {
      title: "Chapter 5 – Orders & Procurement",
      content: `5.1 Purpose
This Chapter governs the procurement lifecycle for Products and Services acquired through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). It establishes the procedures governing product discovery, requests for quotations, purchase requests, approvals, Purchase Orders, order acceptance, modifications, cancellations, fulfillment, and related procurement activities.

5.2 Scope
This Chapter applies to all procurement activities conducted through the Platform, including:
• Product browsing;
• Requests for Quotations (RFQs);
• quotations;
• purchase requests;
• Purchase Orders (POs);
• corporate procurement;
• employee purchases;
• departmental procurement;
• project procurement;
• recurring orders;
• supplier-assisted procurement; and
• any other procurement services offered by the Company.

5.3 Procurement Workflow
The Platform may support one or more procurement workflows, including:
• Direct Purchase;
• Request for Quotation (RFQ);
• Purchase Request;
• Multi-level Approval Workflow;
• Department-Based Procurement;
• Budget-Controlled Procurement;
• Tender-Based Procurement;
• Contract Procurement; and
• Custom procurement workflows approved by the Company.
The availability of any workflow may depend on the Business User's subscription, configuration, or commercial arrangement.

5.4 Product Information
The Company endeavors to provide accurate information regarding Products and Services, including:
• Product descriptions;
• specifications;
• technical documentation;
• compatibility information;
• pricing;
• warranty information;
• availability;
• certifications;
• Manufacturer information; and
• Product images.
The Business User remains responsible for determining whether a Product is suitable for its intended use. Minor typographical, technical, or clerical errors may be corrected by the Company without creating any contractual obligation.

5.5 Requests for Quotation (RFQs)
Business Users may submit RFQs through the Platform. An RFQ may include:
• Product specifications;
• quantity;
• delivery location;
• preferred delivery timeline;
• technical requirements;
• project requirements;
• warranty expectations;
• commercial terms; and
• any additional procurement information.
Submission of an RFQ does not create any obligation upon either Party.

5.6 Quotations
The Company may issue quotations based on information provided by the Business User. Unless expressly stated otherwise, quotations:
• are non-binding invitations to contract;
• remain subject to Product availability;
• may include validity periods;
• may be withdrawn before acceptance;
• may be revised to correct clerical or technical errors; and
• do not constitute acceptance of a Purchase Order.
A quotation shall expire upon the earlier of its stated validity period or withdrawal by the Company.

5.7 Purchase Requests
Where enabled by the Business User, employees may submit internal purchase requests through the Platform. Purchase requests may be routed through internal approval workflows configured by the Business User. The Company is not responsible for the Business User's internal procurement approvals or authorization procedures.

5.8 Purchase Orders
A Purchase Order ("PO") may be submitted electronically through the Platform or by any other method accepted by the Company. A Purchase Order should accurately specify, where applicable:
• Product details;
• quantities;
• agreed pricing;
• delivery location;
• delivery schedule;
• billing information;
• applicable tax information;
• reference numbers;
• payment terms; and
• any special procurement requirements.
The Business User shall ensure that all Purchase Orders are accurate and complete.

5.9 Order Acceptance
Submission of a Purchase Order does not automatically create a binding contract. A Purchase Order shall be deemed accepted only when the Company:
• issues written confirmation;
• generates an order confirmation through the Platform;
• dispatches the Product;
• begins performance of the applicable Services; or
• otherwise expressly accepts the Purchase Order.
The Company reserves the right to reject any Purchase Order prior to acceptance.

5.10 Pricing and Availability
Product prices and availability may change prior to acceptance of a Purchase Order. The Company reserves the right to:
• correct pricing errors;
• revise quotations before acceptance;
• decline orders affected by material pricing inaccuracies;
• substitute discontinued Products where agreed;
• allocate inventory during shortages; and
• update Product availability without prior notice.
Where a material pricing error exists, the Company may contact the Business User to obtain revised approval before processing the order.

5.11 Order Modifications
The Business User may request modifications to a Purchase Order before dispatch or commencement of Services. Modification requests may include changes to:
• Product quantity;
• delivery location;
• delivery schedule;
• billing information;
• authorized recipient; or
• other commercial terms.
The Company shall use commercially reasonable efforts to accommodate such requests but does not guarantee acceptance. Approved modifications may affect pricing, availability, delivery timelines, or other commercial terms.

5.12 Order Cancellation
Purchase Orders may be cancelled only:
• before acceptance by the Company;
• in accordance with the applicable Contract;
• where permitted by applicable law; or
• with the Company's written approval.
The Company may recover reasonable costs incurred before cancellation, including procurement, logistics, customization, or administrative expenses, where permitted by applicable law and the applicable commercial agreement. Customized, special-order, or non-standard Products may not be eligible for cancellation after acceptance.

5.13 Backorders and Partial Fulfilment
Where Products are temporarily unavailable, the Company may, subject to the Business User's instructions and the applicable commercial arrangement:
• place Products on backorder;
• fulfill the order in installments;
• substitute equivalent Products with the Business User's approval;
• revise delivery schedules; or
• cancel the unavailable portion of the order.
The Company shall make commercially reasonable efforts to communicate significant delays or changes.

5.14 Delivery and Risk
Delivery shall be governed by:
• the applicable Purchase Order;
• the Business Terms & Conditions;
• Schedule C – Logistics & Delivery Standards;
• any agreed Incoterms®, where applicable; and
• any separately executed commercial agreement.
Risk and ownership shall transfer in accordance with the applicable contractual terms.

5.15 Order Records
The Company may maintain records relating to:
• RFQs;
• quotations;
• purchase requests;
• Purchase Orders;
• approvals;
• order confirmations;
• delivery records;
• invoices;
• communications;
• amendments; and
• procurement history.
Such records may be retained for operational, accounting, auditing, regulatory, legal, and dispute resolution purposes.

5.16 Fraud Prevention
The Company may suspend, investigate, reject, or cancel any procurement activity where it reasonably suspects:
• unauthorized transactions;
• fraudulent activity;
• identity misuse;
• payment fraud;
• procurement abuse;
• false representations;
• sanctions violations; or
• other unlawful or prohibited conduct.
The Company may request additional verification before proceeding with the transaction.

5.17 Good Faith
The Parties shall conduct procurement activities honestly, transparently, and in good faith. The Business User shall submit accurate procurement information and comply with internal approval processes, while the Company shall administer procurement services in a fair, commercially reasonable, and professional manner.

5.18 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930;
• the Companies Act, 2013;
• the Goods and Services Tax laws;
• the Information Technology Act, 2000;
• applicable import and export regulations;
• applicable competition laws; and
• all other applicable laws and regulations.
Where any provision of this Chapter conflicts with mandatory legal requirements, the applicable law shall prevail to the extent of such inconsistency.`
    },
    {
      title: "Chapter 6 – Payments",
      content: `6.1 Purpose
This Chapter establishes the terms governing payments for Products and Services purchased through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). It governs payment methods, Corporate Wallet payments, Employee Wallet payments, invoices, taxes, credit facilities, payment verification, refunds, and related financial transactions.

6.2 Payment Methods
The Company may accept one or more of the following payment methods, subject to availability and applicable law:
• Corporate Wallet;
• Employee Wallet;
• Bank Transfer (NEFT, RTGS, IMPS);
• Unified Payments Interface (UPI);
• Net Banking;
• Credit or Debit Cards;
• Payment Gateway Services;
• Letter of Credit (LC);
• Escrow arrangements;
• Approved Credit Facilities; and
• any other payment method approved by the Company.
The availability of any payment method may vary based on the Business User, Product, transaction value, jurisdiction, or commercial agreement.

6.3 Corporate Wallet Payments
The Business User may make payments using funds available in its Corporate Wallet. Payments made from the Corporate Wallet shall:
• be deducted from the available wallet balance;
• generate an electronic transaction record;
• be reflected in the Business User's transaction history; and
• be subject to the Corporate Wallet & Employee Wallet provisions of this Agreement.
The Business User is responsible for maintaining sufficient available funds prior to initiating a transaction.

6.4 Employee Wallet Payments
Where permitted by the Business User, Employees may complete transactions using their Employee Wallet. An Employee Wallet transaction may utilize:
• Company-allocated funds;
• Employee Personal Funds; or
• a combination of both,
in accordance with the Business User's configured payment preferences and Platform rules. The Platform may display the funding source used for each transaction.

6.5 Internal Approval Prior to Payment
The Business User may configure internal approval workflows before payment is authorized. Such workflows may include:
• employee purchase requests;
• department manager approval;
• procurement approval;
• finance approval;
• administrator approval; or
• other approval hierarchies determined by the Business User.
The Company provides the technical functionality for such workflows but is not responsible for the Business User's internal financial controls or approval decisions.

6.6 Invoices
The Company may issue invoices electronically or in another legally recognized format. Invoices may include:
• invoice number;
• invoice date;
• Purchase Order reference;
• Product descriptions;
• quantity;
• unit price;
• taxes;
• discounts;
• freight charges;
• total payable amount;
• payment due date; and
• payment instructions.
Invoices shall constitute the official commercial record unless corrected by the Company.

6.7 Taxes
Unless expressly stated otherwise:
• all applicable taxes shall be calculated in accordance with applicable law;
• Goods and Services Tax (GST) shall be charged where applicable;
• statutory deductions shall remain the responsibility of the applicable Party;
• the Business User shall provide valid tax information where required; and
• each Party shall comply with applicable tax laws.
The Company may modify tax calculations where required by changes in applicable law.

6.8 Credit Facilities
Where separately approved, the Company may extend commercial credit facilities to eligible Business Users. Approval of a credit facility shall remain entirely discretionary. Credit facilities may include:
• approved credit limits;
• deferred payment terms;
• project-based credit;
• milestone-based payments;
• revolving commercial credit; or
• other commercial arrangements agreed in writing.
Credit facilities shall remain subject to Schedule B – Credit Policy.

6.9 Payment Due Date
Payments shall become due in accordance with:
• the applicable invoice;
• approved quotation;
• Purchase Order;
• commercial agreement;
• credit arrangement; or
• other agreed payment terms.
Payment shall be deemed completed only after cleared funds are received by the Company or a successful Wallet transaction has been confirmed by the Platform.

6.10 Failed or Declined Payments
Where a payment fails or is declined, the Company may:
• suspend order processing;
• cancel the pending transaction;
• request an alternative payment method;
• suspend Wallet functionality;
• suspend applicable credit facilities; or
• take other commercially reasonable actions necessary to complete the transaction.
The Business User remains responsible for ensuring timely payment using an approved payment method.

6.11 Payment Verification
The Company may verify payments before confirming an order. Verification may include:
• payment gateway confirmation;
• banking confirmation;
• Wallet verification;
• fraud detection;
• identity verification;
• transaction monitoring; and
• regulatory compliance checks.
Order fulfillment may be delayed until verification is successfully completed.

6.12 Refunds
Approved refunds shall be processed in accordance with:
• this Agreement;
• the applicable Purchase Order;
• the Business Terms & Conditions;
• the Return Merchandise Authorization (RMA) Policy;
• the Corporate Wallet & Employee Wallet provisions; and
• applicable law.
Refunds may be credited to:
• the original payment source;
• the Corporate Wallet;
• the Employee Wallet; or
• another method approved by the Company and permitted by law.

6.13 Chargebacks and Payment Disputes
The Business User shall promptly notify the Company of any disputed payment. The Parties shall cooperate in good faith to investigate and resolve payment disputes. Unauthorized or fraudulent chargebacks may result in:
• suspension of the Business Account;
• suspension of Wallet Services;
• suspension of credit facilities;
• recovery proceedings; or
• other contractual or legal remedies available to the Company.

6.14 Financial Records
The Company may maintain records relating to:
• payments;
• invoices;
• Wallet transactions;
• credit facilities;
• refunds;
• payment disputes; and
• statutory accounting details.
Such records may be retained in accordance with applicable tax, accounting, and legal requirements.`
    }
  ];

  const b2cSections = [
    {
      title: "1. Introduction",
      content: `Welcome to Peoples League Of Electronics Private Limited ("Company", "PLE", "we", "our", or "us"). This User Agreement ("Agreement") governs your access to and use of the consumer ("B2C") services offered through the Company's websites, mobile applications, and other digital platforms (collectively, the "Platform"). This Agreement establishes the rights, responsibilities, and obligations between the Company and registered Users of the Platform. It applies to all consumer accounts created for personal, household, or non-commercial use.

By creating an Account, accessing, or using the Platform, placing an Order, or otherwise using the Services, you acknowledge that you have read, understood, and agree to be legally bound by this Agreement, the Company's Terms & Conditions, Privacy Policy, Return, Refund & Cancellation Policy, Shipping & Delivery Policy, Warranty Policy, Cookie Policy, Trademark Policy, and any other applicable policies published by the Company, all of which are incorporated into this Agreement by reference.

If you do not agree with this Agreement or any applicable policy, you must not create an Account or use the Platform. The Company may modify this Agreement from time to time in accordance with applicable law. Continued use of the Platform following the effective date of any revised Agreement constitutes your acceptance of such revisions. Nothing in this Agreement shall limit any rights or remedies available to the Company under applicable law.`
    },
    {
      title: "2. Definitions",
      content: `For the purposes of this User Agreement, unless the context otherwise requires, the following terms shall have the meanings assigned below:
1. "Agreement" means this User Agreement, together with any amendments, schedules, annexures, and policies incorporated by reference.
2. "Account" means a registered consumer (B2C) account created by a User to access and use the Platform and its Services.
3. "Company", "PLE", "we", "our", or "us" means Peoples League Of Electronics Private Limited, its successors, affiliates, subsidiaries, directors, officers, employees, representatives, authorized partners, and permitted assigns.
4. "Platform" means the Company's websites, mobile applications, software, digital platforms, APIs, and all related Products, Services, and technologies operated by the Company.
5. "User", "you", or "your" means an individual who registers for, accesses, or uses the Platform for personal, household, or non-commercial purposes.
6. "Consumer" means a User purchasing Products or Services primarily for personal, household, or non-commercial use.
7. "Product" means any physical or digital goods, accessories, software, subscriptions, or other items offered for sale through the Platform by the Company or authorized third-party Sellers.
8. "Service" means any feature, functionality, support service, digital service, warranty service, rewards program, or other offering made available through the Platform.
9. "Seller" means either the Company or an authorized third-party seller offering Products or Services through the Platform.
10. "Order" means a request submitted by a User through the Platform to purchase one or more Products or Services.
11. "Rewards Program" means the Company's loyalty program through which eligible Users may earn, redeem, or otherwise use PLE Points in accordance with applicable policies.
12. "PLE Points" means reward points issued under the Company's Rewards Program, which may be earned and redeemed in accordance with the applicable terms. PLE Points have no cash value except as expressly provided by the Company.
13. "Content" means any text, images, graphics, videos, audio, reviews, ratings, comments, documents, software, trademarks, logos, or other materials available on or through the Platform.
14. "User Content" means any information, reviews, ratings, comments, feedback, photographs, or other materials submitted, uploaded, or otherwise provided by a User through the Platform.
15. "Applicable Law" means all applicable laws, rules, regulations, governmental notifications, judicial decisions, and regulatory requirements governing this Agreement and the use of the Platform.

Unless the context otherwise requires:
• Words importing the singular include the plural and vice versa.
• References to one gender include all genders.
• Headings are included for convenience only and shall not affect the interpretation of this Agreement.`
    },
    {
      title: "3. Acceptance of this Agreement",
      content: `By accessing or using the Platform, creating an Account, placing an Order, purchasing any Product or Service, participating in the PLE Rewards Program, or otherwise interacting with the Platform, you acknowledge that you have read, understood, and agree to be legally bound by this Agreement.

By accepting this Agreement, you also agree to comply with the Company's:
• Terms & Conditions;
• Privacy Policy;
• Return, Refund & Cancellation Policy;
• Shipping & Delivery Policy;
• Warranty Policy;
• Cookie Policy;
• Trademark Policy; and
• Any other policies, guidelines, notices, or terms published by the Company from time to time,

all of which are incorporated into this Agreement by reference and form an integral part of your contractual relationship with the Company. If you are using the Platform on behalf of another individual, you represent and warrant that you are duly authorized to bind such individual to this Agreement.

If you do not agree to this Agreement or any incorporated policy, you must immediately discontinue use of the Platform and refrain from creating an Account, placing Orders, or using any Products or Services.

The Company reserves the right to modify, update, or amend this Agreement from time to time in accordance with applicable law. Material changes may be communicated through the Platform, email, or other reasonable means of communication. Your continued use of the Platform after the effective date of any revised Agreement constitutes your acceptance of the updated Agreement, except where applicable law requires your express consent.

If any provision of this Agreement is determined by a court or competent authority to be invalid, illegal, or unenforceable, the remaining provisions shall remain in full force and effect to the maximum extent permitted by applicable law. Nothing in this Agreement shall be interpreted as limiting any statutory rights that cannot be waived under applicable law.`
    },
    {
      title: "4. Eligibility",
      content: `To create an Account and use the Platform as a Consumer (B2C User), you must satisfy the eligibility requirements set forth in this Agreement and under applicable law. By creating an Account or using the Platform, you represent and warrant that:
• You have the legal capacity to enter into a binding contract under applicable law.
• All information provided during registration and throughout your use of the Platform is true, accurate, complete, and up to date.
• You will promptly update your Account information whenever necessary to maintain its accuracy.
• You will use the Platform solely for lawful purposes and in accordance with this Agreement and applicable law.
• You are not prohibited from using the Platform under any applicable law, regulation, court order, or governmental directive.

Age Requirements
Where applicable law requires a minimum age for entering into legally binding agreements, you must satisfy such requirement before creating an Account or using the Platform. Where the use of the Platform by a minor is permitted under applicable law, such use must be under the supervision of, and with the consent of, a parent or legal guardian who agrees to be bound by this Agreement on behalf of the minor. The Company reserves the right to request reasonable information to verify a User's age or eligibility where considered necessary.

Account Restrictions
Each User may maintain only the number of Accounts expressly permitted by the Company. You shall not:
• Create an Account using false, inaccurate, or misleading information.
• Impersonate another individual or entity.
• Create an Account on behalf of another person without proper authorization.
• Use another person's Account without permission.
• Circumvent any Account restrictions, suspensions, or bans imposed by the Company.
• Create multiple Accounts for fraudulent, deceptive, abusive, or unlawful purposes.

The Company reserves the right to refuse registration, reject any Account application, suspend, restrict, or terminate any Account where it reasonably believes that a User does not satisfy the eligibility requirements of this Agreement or has provided false, misleading, or incomplete information. Nothing in this section obligates the Company to approve or maintain any User Account, and the Company reserves the right to determine eligibility for access to the Platform in accordance with this Agreement and applicable law.`
    },
    {
      title: "5. User Account Registration",
      content: `To access certain features of the Platform, including placing Orders, participating in the PLE Rewards Program, managing purchases, and accessing personalized services, you may be required to create and maintain a registered Account.

A. Registration
When creating an Account, you agree to:
• Provide accurate, complete, and current information during the registration process.
• Maintain and promptly update your Account information whenever necessary.
• Register only using information that belongs to you or that you are legally authorized to use.
• Use a valid email address and mobile number capable of receiving communications from the Company.
• Create only the number of Accounts permitted by the Company.
The Company reserves the right to reject, suspend, or terminate any registration that does not comply with this Agreement or applicable law.

B. Verification
The Company may, at its sole discretion, verify the information provided during registration or at any time thereafter. Verification may include, but is not limited to:
• Email verification;
• Mobile number verification through one-time passwords (OTP) or similar methods;
• Identity verification, where required;
• Requests for additional information or documentation; or
• Other reasonable verification measures considered necessary to protect the Platform, its Users, or the Company.
Failure to complete any required verification process may result in restricted access to certain features or suspension of the Account.

C. Accuracy of Information
You are responsible for ensuring that all information associated with your Account remains accurate, complete, and up to date. If any information changes, you agree to update your Account promptly through the Platform or by contacting customer support where applicable. The Company shall not be responsible for any loss, delay, or inconvenience arising from inaccurate, incomplete, or outdated information provided by you.

D. One Account Per User
Unless expressly permitted by the Company, each User may maintain only one personal consumer (B2C) Account. The Company may merge, suspend, restrict, or terminate duplicate Accounts where it reasonably believes that multiple Accounts have been created in violation of this Agreement or for fraudulent, deceptive, abusive, or unlawful purposes.

E. Account Ownership
Your Account is personal to you and may not be sold, assigned, transferred, licensed, shared, gifted, or otherwise made available to any other individual or entity without the Company's prior written authorization. You remain responsible for all activities conducted through your Account, whether authorized by you or resulting from your failure to adequately protect your Account credentials.

F. Company's Right to Refuse Registration
The Company reserves the right, at its sole discretion and subject to applicable law, to:
• Approve or reject any Account registration;
• Request additional information or verification;
• Restrict access to certain Platform features;
• Suspend or terminate an Account; or
• Refuse registration where it reasonably believes that doing so is necessary to protect the Platform, its Users, or the Company's legitimate interests.
Where reasonably practicable and required by applicable law, the Company may communicate the basis for such action, provided that doing so would not compromise security, fraud prevention measures, legal obligations, or the rights of third parties. Nothing in this section shall be construed as creating an obligation on the Company to approve, maintain, or continue any User Account. Access to the Platform remains subject to this Agreement, the Company's policies, and applicable law.`
    },
    {
      title: "6. Account Security",
      content: `The security of your Account is important to both you and the Company. While the Company implements reasonable security measures to protect the Platform, you are responsible for maintaining the confidentiality and security of your Account credentials.

A. Confidentiality of Credentials
You are solely responsible for maintaining the confidentiality of your username (where applicable), email address, mobile number, password, One-Time Passwords (OTPs), authentication codes, and any other security credentials used to access your Account. You must not disclose, share, lend, transfer, or otherwise make your Account credentials available to any other person.

B. Responsibility for Account Activity
You are responsible for all activities conducted through your Account, whether such activities are authorized by you or result from your failure to adequately safeguard your Account credentials. This includes, without limitation, Orders placed, changes made to Account information, redemption of PLE Points, and communications sent through your Account.

C. Unauthorized Access
If you believe or suspect that your Account has been accessed without authorization, your credentials compromised, or your device lost/stolen, you must promptly:
1. Change your password, where possible;
2. Secure your device and associated accounts; and
3. Notify the Company through appropriate customer support or grievance channels without undue delay.
The Company may temporarily suspend or restrict access to your Account while investigating a suspected security incident.

D. Security Measures
The Company may implement security measures including, but not limited to, password protection, OTP verification, multi-factor authentication, device verification, login monitoring, fraud detection systems, risk-based authentication, session management, and other security mechanisms. Users agree to cooperate with reasonable security procedures.

E. Prohibited Security Practices
You agree not to share your Account, circumvent security measures, use automated tools/bots to gain access, attempt to access another User's Account, interfere with security, or engage in any activity intended to compromise the security of the Platform.

F. Company's Rights
Where the Company reasonably believes that an Account has been compromised, misused, or used in violation of this Agreement, it may require additional verification, reset credentials, restrict features, temporarily suspend or terminate the Account, or take any other reasonable action.

G. Limitation of Responsibility
To the fullest extent permitted by applicable law, the Company shall not be liable for losses arising from unauthorized access to an Account resulting from the User's failure to maintain confidentiality, negligence, compromise of User devices, or circumstances beyond the Company's reasonable control.`
    },
    {
      title: "7. User Responsibilities",
      content: `By creating an Account or using the Platform, you agree to use the Platform responsibly, lawfully, and in accordance with this Agreement, the Company's policies, and applicable law.

A. Compliance with Laws
You agree to use the Platform only for lawful purposes and in compliance with all applicable laws, regulations, and this Agreement. You shall not use the Platform for any illegal, fraudulent, deceptive, abusive, or unauthorized activity.

B. Accurate Information
You agree to provide accurate, complete, and truthful information, keep your Account information current, and promptly correct any inaccuracies. Providing false, misleading, or fraudulent information may result in suspension or termination of your Account.

C. Responsible Use of the Platform
You agree to use the Platform in a responsible manner and not to disrupt operations, circumvent security, attempt unauthorized access, introduce malware/viruses, reverse engineer the Platform, use scraping tools or bots without authorization, or interfere with other Users.

D. Orders & Purchases
You agree that Orders placed through your Account are genuine and made in good faith, that you will provide accurate billing/delivery info, pay all applicable amounts, and not place fraudulent or speculative Orders.

E. Reviews, Ratings & Feedback
Where the Platform permits, you agree that reviews, ratings, comments, or feedback shall be truthful and based on genuine experience, not false, misleading, defamatory, obscene, infringing, or containing spam. The Company reserves the right to moderate, edit, or remove User Content.

F. Respect for Intellectual Property
You agree to respect the intellectual property rights of the Company and third parties. You shall not copy, reproduce, distribute, modify, display, sell, or license any Content available through the Platform without authorization.

G. Cooperation
You agree to reasonably cooperate with the Company in connection with fraud investigations, security incidents, verification requests, regulatory compliance, customer support inquiries, and dispute resolution.

H. Consequences of Non-Compliance
If the Company reasonably believes that you have violated this Agreement, it may issue warnings, remove or restrict access to Content/features, suspend or terminate your Account, cancel or refuse Orders, restrict rewards participation, or take other reasonable actions.`
    },
    {
      title: "8. Orders & Transactions",
      content: `All Orders placed through the Platform are subject to this Agreement, the Company's Terms & Conditions, and all applicable policies.

A. Placing an Order
Submission of an Order constitutes an offer by you to purchase the selected Products or Services. You represent and warrant that Order information is accurate, payment methods are authorized, and you intend to purchase in good faith.

B. Order Acceptance
Submission of an Order does not constitute acceptance. An Order shall be deemed accepted only when confirmed by the Company/Seller, the Product is dispatched, or such other process as communicated. The Company reserves the right to refuse, reject, cancel, or limit any Order before acceptance.

C. Product Availability
All Products and Services are subject to availability. Descriptions, pricing, and availability may change without notice. Where a Product becomes unavailable after an Order is placed, the Company may cancel the Order, offer an alternative, hold the Order with your consent, or process a refund.

D. Pricing
Prices displayed on the Platform are subject to change. If an Order is affected by a material pricing error, the Company reserves the right to cancel the Order, contact you for confirmation, or issue a refund. Taxes, shipping, and other charges will be displayed during checkout.

E. Order Modifications & Cancellations
Requests to modify or cancel an Order may be accepted only if the Order has not progressed beyond the stage where modification/cancellation is possible. Returns and refunds are governed by the Return, Refund & Cancellation Policy.

F. Delivery
Delivery timelines, shipping methods, and related matters are governed by the Shipping & Delivery Policy. Estimated delivery dates are for convenience only and not guaranteed commitments.

G. Third-Party Sellers
Where Products are offered by third-party Sellers, the Seller is responsible for listings, availability, and fulfillment. The Company facilitates processing, payment collection, customer support, and logistics.

H. Fraud Prevention
The Company reserves the right to verify Orders and may delay, restrict, or cancel any Order where it suspects fraudulent activity, unauthorized payment, identity theft, or policy violations.

I. Order Records
The Company may maintain records relating to Orders, invoices, payments, communications, and shipments for operational, legal, tax, regulatory, fraud prevention, and dispute resolution purposes.`
    },
    {
      title: "9. PLE Rewards Program",
      content: `Participation in the PLE Rewards Program is voluntary and subject to this Agreement and applicable rewards policies.

A. Eligibility
Participation is available to eligible registered B2C Users in good standing. The Company reserves the right to determine eligibility and restrict participation.

B. Earning PLE Points
Eligible purchases earn 5 PLE Points for every ₹100 spent on qualifying Products or Services. Points are credited after successful completion of the Order, returns periods, and fraud reviews.

C. Redemption of PLE Points
Unless otherwise notified, 10 PLE Points = ₹1 in redemption value. Points may be redeemed for eligible Orders, Products, or Services. Minimum/maximum limits or category restrictions may apply.

D. No Cash Value
PLE Points are promotional benefits, do not constitute legal tender, currency, or stored value, have no cash value, and are not redeemable for cash unless required by law.

E. Non-Transferability
PLE Points cannot be transferred, assigned, sold, exchanged, pledged, or shared, and may only be used by the Account to which they were credited.

F. Expiry, Suspension & Forfeiture
PLE Points may expire or be forfeited/reversed if an Order is cancelled/refunded, fraud is detected, an Account is suspended/terminated, or points were awarded in error.

G. Modification or Discontinuation
The Company reserves the right to modify earning rates, redemption values, eligibility criteria, or suspend/amend the Rewards Program. Material changes will be communicated.

H. Fraud Prevention
The Company may investigate reward activities and reverse points, suspend redemption, cancel transactions, or terminate Accounts for fraud or abuse.

I. Final Determination
The Company's records regarding PLE Points shall be presumed accurate, and its interpretation and administration of the program shall be final.`
    },
    {
      title: "10. Payments",
      content: `By placing an Order, you agree to pay all applicable charges associated with your purchase.

A. Accepted Payment Methods
The Company may offer Credit Cards, Debit Cards, UPI, Net Banking, Digital Wallets, BNPL, Bank Transfers, EMI options, or other methods. Availability may vary.

B. Payment Authorization
You represent and warrant that you are authorized to use the selected payment method, info is accurate, and sufficient funds exist. You authorize the Company/providers to process the payment.

C. Pricing, Taxes & Charges
Prices are quoted in Indian Rupees (INR). Applicable taxes (including GST), shipping, handling, installation, or other fees will be charged and displayed before Order confirmation.

D. Payment Verification
The Company may verify payments using authentication, identity verification, fraud screening, and bank confirmations. Verification failure may result in rejection/cancellation of the Order.

E. Failed or Declined Payments
If payment is declined, reversed, charged back, or unsuccessful, the Company may cancel the Order, suspend delivery, restrict access, or take other reasonable actions.

F. Refunds
Refunds are processed in accordance with the Return, Refund & Cancellation Policy. The timing depends on payment methods, banking processes, and provider policies. The Company is not responsible for gateway/banking delays.

G. Payment Security
The Company implements reasonable measures and uses authorized payment service providers. Complete card details are not stored unless permitted by applicable law and industry standards.

H. Fraudulent Payments
The Company reserves the right to investigate payments suspected of involving unauthorized use, identity theft, money laundering, chargeback fraud, or other unlawful activities.

I. Billing Records
The Company maintains records of payments, invoices, refunds, and financial transactions for accounting, taxation, audit, and regulatory compliance in accordance with the Privacy Policy.`
    },
    {
      title: "11. Communications",
      content: `By creating an Account, you agree that the Company may communicate with you through various channels.

A. Methods of Communication
Communications may occur via Email, SMS, telephone calls, push notifications, in-app notifications, WhatsApp/messaging platforms, or postal mail. You must maintain accurate contact info.

B. Transactional Communications
Transactional communications include registration details, OTPs, password resets, order/payment confirmations, shipping updates, customer support, and security alerts. These are essential and cannot be opted out of while the Account is active.

C. Promotional Communications
Where permitted, we may send marketing communications about new products, discounts, loyalty programs, and surveys. You may opt out at any time via unsubscribe links, account settings, or contacting support.

D. Electronic Records
You agree that electronic records, notices, agreements, and invoices satisfy any legal requirement that such communications be in writing, to the extent permitted by law.

E. User Communications
When you contact support, the Company maintains records of communications to provide support, resolve disputes, improve services, investigate fraud, and comply with legal obligations.

F. Accuracy of Contact Information
You are responsible for maintaining accurate contact info. The Company is not responsible for delayed or failed delivery of communications due to inaccurate details.

G. Service Notices
The Company may issue notices regarding scheduled maintenance, interruptions, updates, or policy changes. Advance notice will be provided where practicable.`
    },
    {
      title: "12. User Content",
      content: `A. Ownership of User Content
You retain ownership of intellectual property rights in your User Content. Nothing in this Agreement transfers ownership to the Company.

B. License Granted to the Company
You grant the Company a worldwide, non-exclusive, royalty-free, transferable, sublicensable, and perpetual license to store, host, display, publish, reproduce, distribute, modify, translate, and use your User Content to operate the Platform, provide services, and market products.

C. User Representations
You warrant that you own the User Content or have necessary rights, that submission does not violate any third-party rights or laws, and that it is accurate and based on genuine experience.

D. Prohibited User Content
You agree not to submit content that is false, misleading, defamatory, obscene, offensive, hateful, discriminatory, promotes violence, violates privacy, contains malware, constitutes spam, or impersonates others.

E. Moderation
The Company reserves the right (but not the obligation) to review, monitor, remove, or edit User Content, or restrict Accounts, to comply with laws or enforce this Agreement.

F. Feedback & Suggestions
Any suggestions or feedback provided may be used by the Company without restriction, compensation, or obligation, granting us a perpetual, irrevocable, royalty-free license.

G. Removal of User Content
Users may request removal where permitted, but the Company may retain content to comply with legal obligations, resolve disputes, preserve evidence, or prevent fraud.

H. Responsibility for User Content
User Content reflects the views of the individual submitting it, not the Company. The Company does not endorse or accept responsibility for User Content.`
    },
    {
      title: "13. Prohibited Conduct",
      content: `To maintain the security, integrity, and reliability of the Platform, you shall not:

A. Illegal or Unauthorized Activities
• Use the Platform for unlawful, fraudulent, or unauthorized purposes.
• Violate any applicable law, regulation, or court order.
• Assist or encourage others to engage in unlawful activities.

B. Misrepresentation
• Provide false, inaccurate, or misleading information.
• Impersonate any individual, organization, or entity.
• Create or use Accounts on behalf of another without authorization.

C. Abuse of the Platform
• Disrupt or interfere with Platform operations.
• Attempt unauthorized access to servers, databases, or systems.
• Circumvent or disable security features.
• Reverse engineer, decompile, or disassemble the Platform.
• Use scraping tools, bots, crawlers, or spiders without authorization.
• Overload or impair the Platform infrastructure.

D. Fraudulent Activities
• Place fraudulent or fictitious Orders.
• Use stolen or unauthorized payment instruments.
• Engage in chargeback fraud or abuse promotions/rewards.
• Manipulate pricing, inventory, reviews, or Platform features.

E. Malicious Activities
• Distribute malware, viruses, ransomware, spyware, or harmful code.
• Conduct denial-of-service attacks, phishing, or other cyberattacks.

F. Intellectual Property Violations
• Copy, reproduce, distribute, or exploit Platform Content without authorization.
• Remove copyright, trademark, or proprietary notices.
• Infringe the intellectual property rights of the Company or third parties.

G. Prohibited User Content
• Submit, upload, or publish User Content that is false, misleading, defamatory, abusive, threatening, obscene, offensive, hateful, discriminatory, or otherwise objectionable.
• Infringe any patent, trademark, trade secret, copyright, right of publicity, privacy right, or other proprietary right of any party.
• Contain software viruses, malware, or computer code designed to interrupt, destroy, or limit functionality of software or hardware.
• Constitute unsolicited or unauthorized advertising, spam, chain letters, or pyramid schemes.
• Violate any applicable local, state, national, or international law or regulation.`
    },
    {
      title: "14. Intellectual Property Rights",
      content: `All content, trademarks, logos, service marks, designs, graphics, text, images, software, and other materials available on the Platform (collectively, "Company Content") are the property of the Company or its licensors and are protected by intellectual property laws.

You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for your personal, non-commercial use in accordance with this Agreement. You shall not copy, modify, distribute, sell, license, lease, or reverse engineer any part of the Platform or Company Content without our express written consent.`
    },
    {
      title: "15. Disclaimer of Warranties",
      content: `The Platform and all Products, Services, and Content are provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied.

To the fullest extent permitted by applicable law, the Company disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, and title. We do not warrant that the Platform will be secure, uninterrupted, error-free, free of viruses, or that any defects will be corrected.`
    },
    {
      title: "16. Limitation of Liability",
      content: `To the fullest extent permitted by applicable law, the Company, its directors, officers, employees, agents, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, arising out of or in connection with:
(i) your access to or use of, or inability to access or use, the Platform;
(ii) any transaction or contract entered into through the Platform;
(iii) any conduct or content of third parties on the Platform; or
(iv) unauthorized access, use, or alteration of your transmissions or content.

In no event shall the Company's aggregate liability exceed the total amount paid by you to the Company for the specific transaction giving rise to the claim, or ₹1,000, whichever is greater.`
    },
    {
      title: "17. Indemnification",
      content: `You agree to defend, indemnify, and hold harmless the Company, its successors, affiliates, subsidiaries, directors, officers, employees, representatives, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from:
(i) your use of and access to the Platform;
(ii) your violation of any term of this Agreement or any incorporated policy;
(iii) your violation of any third-party right, including without limitation any copyright, property, privacy, or intellectual property right;
(iv) User Content submitted through your Account; or
(v) your violation of any applicable law.`
    },
    {
      title: "18. Termination & Suspension",
      content: `The Company reserves the right, in its sole discretion, to suspend, restrict, or terminate your Account, access to the Platform, or participation in the PLE Rewards Program, at any time and without prior notice, for any reason, including but not limited to a breach of this Agreement, suspected fraudulent, abusive, or illegal activity, or to protect the integrity of the Platform and its Users.`
    },
    {
      title: "19. Governing Law & Dispute Resolution",
      content: `This Agreement and any dispute or claim arising out of or in connection with it shall be governed by and construed in accordance with the laws of the Republic of India, without regard to its conflict of law principles.

Any legal action, suit, or proceeding arising out of or relating to this Agreement shall be subject to the exclusive jurisdiction of the courts located in Belagavi, Karnataka, India.`
    },
    {
      title: "20. Miscellaneous",
      content: `This Agreement, together with the Terms & Conditions, Privacy Policy, and other policies incorporated by reference, constitutes the entire agreement between you and the Company regarding your use of the Platform.

If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, and the remaining provisions shall remain in full force and effect. The Company's failure to enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision.`
    },
    {
      title: "21. Contact Information & Grievances",
      content: `If you have any questions, concerns, or grievances regarding this Agreement, you may contact our Grievance Officer:

Name: Owais Raja Mahammed Pathan
Designation: Grievance Officer
Email: grievance@peoplesleagueofelectronics.com

Registered Address:
Building No./Flat No.: SHOP NO 25, R.S NO. 1045/3
Road/Street: Ujwal Nagar Main Road
Locality/Sub Locality: 2ND CROSS, LEFT SIDE
City/Town/Village: Belagavi
District: Belagavi
State: Karnataka
Pin Code: 590010`
    }
  ];

  const activeSections = isB2BUser ? b2bSections : b2cSections;

  const handleDownload = () => {
    const header = isB2BUser ? "BUSINESS USER AGREEMENT (B2B)\nPeoples League Of Electronics Private Limited\n\n" : "USER AGREEMENT (B2C)\nPeoples League Of Electronics Private Limited\n\n";
    const textContent = header + activeSections.map(s => `${s.title}\n\n${s.content}`).join("\n\n----------------------------------------\n\n");
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isB2BUser ? "PLE_Business_User_Agreement_B2B.txt" : "PLE_User_Agreement_B2C.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("User Agreement downloaded successfully");
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="max-w-3xl mx-auto px-4 py-6 pb-24 min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm border border-gray-200"
                aria-label="Go Back"
              >
                <FiArrowLeft className="text-xl text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                  <FiUsers className="text-[#7B0A0A]" /> {isB2BUser ? "Business User Agreement" : "User Agreement"}
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  {isB2BUser ? "Peoples League Of Electronics Private Limited | Version 1.0" : "Last updated: June 2026"}
                </p>
              </div>
            </div>
            {isB2BUser && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-primary-700 transition-colors"
              >
                <FiDownload className="text-sm" />
                <span>Download</span>
              </button>
            )}
          </div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6"
          >
            <p className="text-sm text-gray-600 leading-relaxed font-semibold">
              {isB2BUser
                ? "This Business User Agreement governs access to and use of the B2B Platform, Corporate & Employee Wallet services, procurement workflows, and related business offerings provided by Peoples League Of Electronics Private Limited."
                : "This Agreement details the B2C user rights, guidelines, and obligations for using our customer portal, apps, and services."}
            </p>

            <div className="border-t border-gray-100 pt-6 space-y-6">
              {activeSections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-gray-800">{section.title}</h3>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-xs text-gray-500">
                {isB2BUser
                  ? "If you have questions about this Business User Agreement, please contact our B2B legal desk at b2blegal@peoplesleagueofelectronics.com."
                  : "If you have questions about this Agreement, please contact our support desk at support@ple.com."}
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default UserAgreement;
