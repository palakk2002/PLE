import { FiFileText, FiArrowLeft, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import { useBusinessBuyer } from "../hooks/useBusinessBuyer";
import { useAuthStore } from "../../../shared/store/authStore";
import { useB2bStore } from "../../../shared/store/b2bStore";

const TermsConditions = () => {
  const navigate = useNavigate();
  const { isBusiness } = useBusinessBuyer();
  const { user } = useAuthStore();
  const b2bUserRole = useB2bStore((state) => state.userRole);

  const isB2BUser = isBusiness || user?.role === 'b2bAdmin' || user?.role === 'b2bEmployee' || user?.isEmployee || b2bUserRole === 'business_buyer';

  const b2bSections = [
    {
      title: "BUSINESS TERMS & CONDITIONS (B2B)",
      content: `Peoples League Of Electronics Private Limited\nVersion: 1.0`
    },
    {
      title: "Chapter 1 – Introduction",
      content: `Welcome to the business-to-business ("B2B") platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE", "we", "our", or "us"). These Business Terms & Conditions ("Terms") govern the access to and use of the Company's B2B platform, website, mobile applications, procurement services, products, software, and related commercial services by business customers. These Terms constitute a legally binding agreement between the Company and every Business Customer accessing or using the Platform for commercial purposes. By registering a business account, submitting a quotation request, placing a Purchase Order, purchasing Products or Services, or otherwise using the Platform, the Business Customer acknowledges that it has read, understood, and agrees to be legally bound by these Terms and all applicable policies incorporated by reference.

A. Purpose
The purpose of these Terms is to establish the rights, responsibilities, obligations, and commercial relationship between the Company and Business Customers in connection with:
• the purchase and sale of Products;
• procurement services;
• marketplace transactions;
• quotations;
• Purchase Orders;
• commercial deliveries;
• warranties;
• returns and replacements;
• payment obligations;
• business accounts; and
• all other services provided through the Company's B2B Platform.
These Terms are intended to promote fair, transparent, efficient, and legally compliant commercial transactions.

B. Applicability
These Terms apply exclusively to transactions conducted for business, commercial, institutional, governmental, educational, charitable, or professional purposes through the Company's B2B Platform. Business Customers may include, without limitation:
• companies;
• limited liability partnerships (LLPs);
• partnership firms;
• sole proprietorships;
• government departments;
• public sector undertakings (PSUs);
• statutory authorities;
• educational institutions;
• healthcare institutions;
• non-governmental organizations (NGOs);
• charitable organizations; and
• any other legally recognized business or institutional entity.
These Terms do not apply to consumer purchases made through the Company's B2C Platform, which are governed by separate consumer-facing Terms and Policies.

C. Commercial Nature of Transactions
All transactions conducted under these Terms are deemed to be commercial transactions. The Business Customer represents and warrants that:
• Products and Services are being acquired for business, professional, institutional, or commercial use;
• it is not acting as a consumer purchasing goods for personal, domestic, or household use unless expressly permitted by the Company;
• it possesses the legal authority to enter into commercial agreements; and
• all transactions are undertaken in good faith and for lawful purposes.

D. Relationship Between the Parties
Nothing contained in these Terms shall be interpreted as creating:
• a partnership;
• a joint venture;
• an agency relationship;
• an employer-employee relationship;
• a franchise;
• a fiduciary relationship; or
• any other legal association beyond that of independent contracting parties.
Each party shall remain solely responsible for its own business operations, personnel, taxes, liabilities, and regulatory obligations.

E. Incorporated Policies
These Terms should be read together with all applicable Company policies, including, where applicable:
• Business Privacy Policy;
• Business Customer Agreement;
• Shipping & Delivery Policy (B2B);
• Warranty Policy (B2B);
• Returns, RMA & Cancellation Policy (B2B);
• Payment Terms;
• Credit Policy;
• any Product-specific terms;
• Seller-specific conditions, where applicable; and
• any additional agreements expressly accepted by the Business Customer.
In the event of any inconsistency between these Terms and a separately executed written agreement signed by both parties, the signed agreement shall prevail to the extent of the inconsistency.

F. Amendments
The Company reserves the right to amend, revise, modify, or update these Terms from time to time to reflect changes in applicable laws, regulatory requirements, business practices, operational processes, technology, or services. Unless otherwise required by law or expressly agreed in writing, revised Terms shall become effective on the Effective Date specified in the updated version. Continued use of the Platform after the effective date constitutes acceptance of the revised Terms.

G. Acceptance of Terms
By accessing or using the Company's B2B Platform, registering a Business Account, requesting quotations, placing Purchase Orders, purchasing Products or Services, or otherwise engaging in commercial transactions with the Company, the Business Customer confirms that:
• it has carefully read these Terms;
• it understands its rights and obligations;
• it has the legal authority to enter into these Terms;
• the individual accepting these Terms is duly authorized to bind the Business Customer; and
• it agrees to comply with these Terms and all applicable laws, regulations, and Company policies.

H. Governing Principles
The Company is committed to conducting its business in accordance with the principles of:
• integrity;
• transparency;
• fairness;
• professionalism;
• regulatory compliance;
• responsible commercial practices;
• information security; and
• mutual respect in business relationships.
Business Customers are expected to uphold these principles while interacting with the Company and using the Platform.

I. Compliance with Applicable Law
These Terms shall be interpreted and enforced in accordance with the applicable laws of the Republic of India. Nothing contained in these Terms shall be construed as excluding, restricting, or limiting any legal obligation that cannot lawfully be excluded under applicable legislation.`
    },
    {
      title: "Chapter 2 – Definitions",
      content: `For the purposes of these Business Terms & Conditions, unless the context otherwise requires, the following terms shall have the meanings assigned to them below. Words importing the singular include the plural and vice versa, and references to one gender include all genders where the context so requires.

A. Account
"Account" means the registered business account created on the Company's B2B Platform through which a Business Customer accesses Products, Services, quotations, Purchase Orders, invoices, account information, and other commercial features.

B. Affiliate
"Affiliate" means any entity that directly or indirectly controls, is controlled by, or is under common control with a party, where "control" means ownership of more than fifty percent (50%) of the voting rights or the ability to direct the management and policies of such entity.

C. Authorized Representative
"Authorized Representative" means an individual who has been duly authorized by the Business Customer to act on its behalf in relation to the use of the Platform, placement of Orders, execution of agreements, acceptance of deliveries, and other commercial transactions.

D. Business Customer
"Business Customer" means any legally recognized business or institutional entity registered with the Company for commercial transactions, including but not limited to:
• companies;
• limited liability partnerships (LLPs);
• partnership firms;
• sole proprietorships;
• government departments;
• public sector undertakings (PSUs);
• statutory authorities;
• educational institutions;
• healthcare institutions;
• non-governmental organizations (NGOs);
• charitable organizations; and
• any other commercial or institutional entity approved by the Company.

E. Company
"Company", "PLE", "we", "our", or "us" means Peoples League Of Electronics Private Limited, together with its successors and permitted assigns.

F. Confidential Information
"Confidential Information" means any non-public information disclosed by either party relating to business operations, pricing, quotations, trade secrets, customer information, procurement strategies, technical information, software, financial information, intellectual property, security procedures, or any information designated as confidential or that would reasonably be understood to be confidential.

G. Contract
"Contract" means the legally binding agreement formed between the Company and the Business Customer upon acceptance of a Purchase Order, quotation, or any other commercial arrangement accepted by both parties.

H. Delivery
"Delivery" means the transfer of possession of Products to the Business Customer, its Authorized Representative, designated recipient, carrier, or any other person authorized to receive the Products.

I. Distributor
"Distributor" means an entity authorized by a Manufacturer to distribute or supply Products through the Company's Platform.

J. Force Majeure Event
"Force Majeure Event" means any event beyond the reasonable control of the affected party, including but not limited to natural disasters, war, terrorism, civil unrest, pandemics, governmental actions, transportation disruptions, cyber incidents, utility failures, strikes, or any similar event materially affecting performance under these Terms.

K. Goods / Products
"Goods" or "Products" means all hardware, software, peripherals, accessories, equipment, components, digital products, subscriptions, licenses, or other items offered through the Company's B2B Platform.

L. Intellectual Property
"Intellectual Property" means all present and future intellectual property rights, including copyrights, trademarks, service marks, trade names, logos, patents, industrial designs, domain names, trade secrets, know-how, software, databases, source code, object code, documentation, and any other proprietary rights recognized under applicable law.

M. Invoice
"Invoice" means the tax invoice, commercial invoice, debit note, credit note, or any other billing document issued by the Company or, where applicable, an authorized Seller in relation to a commercial transaction.

N. Logistics Partner
"Logistics Partner" means any third-party courier, freight carrier, transporter, warehouse operator, fulfillment provider, or logistics service provider engaged in connection with the transportation, storage, or delivery of Products.

O. Manufacturer
"Manufacturer" means the original equipment manufacturer (OEM) or producer responsible for designing, manufacturing, assembling, or branding a Product.

P. Order
"Order" means any request submitted by a Business Customer through the Platform or any other approved channel for the purchase of Products or Services.

Q. Platform
"Platform" means the Company's B2B website, mobile applications, procurement portal, APIs, software systems, and any other digital or electronic interface through which Products or Services are offered.

R. Purchase Order (PO)
"Purchase Order" or "PO" means a formal commercial order issued by a Business Customer specifying the Products or Services to be purchased, including applicable quantities, specifications, pricing, delivery requirements, and other commercial terms.

S. Quotation
"Quotation" means a written commercial proposal issued by the Company specifying pricing, availability, specifications, validity period, delivery estimates, payment terms, and other applicable commercial conditions for Products or Services.

T. Seller
"Seller" means the Company or any independent third-party business authorized to list and sell Products through the Company's B2B Platform.

U. Services
"Services" means procurement services, marketplace services, logistics coordination, technical support, installation, consulting, software services, subscription services, aftersales support, and any other commercial services provided by or through the Company.

V. Supplier
"Supplier" means any manufacturer, distributor, wholesaler, importer, or other business entity supplying Products to the Company or through the Platform.

W. Taxes
"Taxes" means all applicable taxes, duties, levies, cess, GST, customs duties, withholding taxes, or any other governmental charges imposed under applicable law.

X. Warranty
"Warranty" means the applicable manufacturer's warranty, the Company's warranty (where expressly provided), or any extended warranty separately purchased by the Business Customer.

Y. Working Day
"Working Day" means any day, other than a Saturday, Sunday, or public holiday, on which banks are generally open for business in the jurisdiction of the Company's registered office, unless otherwise specified in writing.

Z. Interpretation
Unless the context otherwise requires:
• headings are included for convenience only and shall not affect the interpretation of these Terms;
• references to any law include amendments, modifications, re-enactments, and subordinate legislation;
• references to the singular include the plural and vice versa;
• references to one gender include all genders;
• the words "including", "includes", and "such as" shall be interpreted as "including without limitation";
• references to a person include individuals, companies, partnerships, LLPs, trusts, government bodies, statutory authorities, and other legal entities; and
• any ambiguity shall not be interpreted against either party solely because that party drafted or proposed these Terms.`
    },
    {
      title: "Chapter 3 – Eligibility",
      content: `This Chapter sets out the eligibility requirements for accessing and using the Company's Business-to-Business ("B2B") Platform and entering into commercial transactions with Peoples League Of Electronics Private Limited ("Company", "PLE", "we", "our", or "us"). Only eligible Business Customers satisfying the requirements of this Chapter may register, access, purchase Products or Services, submit quotations, place Purchase Orders, or otherwise transact through the Platform.

A. Eligible Business Customers
The Platform is intended exclusively for legitimate commercial, institutional, governmental, and professional use. Eligible Business Customers may include, without limitation:
• private limited companies;
• public limited companies;
• one person companies (OPCs);
• limited liability partnerships (LLPs);
• partnership firms;
• sole proprietorships;
• government departments;
• public sector undertakings (PSUs);
• statutory authorities;
• educational institutions;
• healthcare institutions;
• research organizations;
• non-governmental organizations (NGOs);
• charitable or non-profit organizations;
• startups;
• micro, small and medium enterprises (MSMEs); and
• any other legally recognized business or institutional entity approved by the Company.
The Company reserves the right to determine whether an applicant qualifies as a Business Customer.

B. Legal Capacity
Every Business Customer represents and warrants that it:
• is validly existing under the applicable laws governing its establishment;
• possesses the legal capacity to enter into binding commercial agreements;
• has obtained all necessary registrations, licenses, approvals, and authorizations required for its business operations;
• is authorized to purchase the Products or Services ordered through the Platform; and
• shall comply with all applicable laws throughout its use of the Platform.

C. Authorized Representatives
Business Customers shall ensure that every individual accessing or using the Platform on their behalf:
• has been duly authorized by the Business Customer;
• acts within the scope of such authority;
• possesses the necessary authority to submit Purchase Orders, approve quotations, accept deliveries, make payments, and communicate with the Company; and
• complies with these Terms and all applicable Company policies.
The Company may rely upon instructions received from an Authorized Representative unless notified otherwise in writing.

D. Business Verification
The Company may require Business Customers to complete verification procedures before granting or continuing access to the Platform. Verification may include, where applicable:
• business registration certificates;
• GST registration details;
• Permanent Account Number (PAN);
• Tax Deduction and Collection Account Number (TAN), where applicable;
• Import Export Code (IEC), where applicable;
• UDYAM/MSME registration, where applicable;
• proof of registered office or principal place of business;
• identity and authorization documents of Authorized Representatives;
• banking information;
• beneficial ownership information, where legally required; and
• any additional information reasonably requested by the Company.
Submission of documentation does not guarantee approval.

E. Know Your Customer (KYC) Compliance
The Business Customer agrees to cooperate with all reasonable Know Your Customer ("KYC"), Anti-Money Laundering ("AML"), fraud prevention, and regulatory compliance procedures implemented by the Company. The Company may:
• request additional documentation;
• verify information through government or authorized third-party databases;
• conduct periodic compliance reviews;
• re-verify Business Customers from time to time; and
• refuse or suspend access where verification requirements are not satisfied.

F. Accuracy of Information
Business Customers shall ensure that all information provided to the Company is:
• accurate;
• complete;
• current;
• truthful; and
• not misleading.
Business Customers shall promptly update any information that becomes inaccurate or outdated. The Company may rely upon the information provided by the Business Customer unless notified otherwise.

G. Restricted Persons and Entities
The Platform shall not be used by any person or entity that:
• is prohibited from entering into commercial transactions under applicable law;
• is subject to applicable trade sanctions, embargoes, or government restrictions;
• has been suspended or debarred by a competent authority from carrying on business;
• has previously been suspended or terminated by the Company for material violations of these Terms, unless expressly reinstated by the Company; or
• is otherwise determined by the Company, acting reasonably, to present an unacceptable legal, regulatory, security, or fraud risk.

H. Right to Refuse or Reject Registration
The Company reserves the right, at its reasonable discretion, to:
• approve or reject any registration application;
• request additional information before approval;
• suspend the verification process pending clarification;
• reject incomplete or inaccurate applications; or
• decline to establish a commercial relationship where required for legal, regulatory, operational, or risk management reasons.
The Company is not obligated to provide detailed reasons for every decision where disclosure is restricted by law, confidentiality obligations, or security considerations.

I. Ongoing Eligibility
Eligibility to use the Platform is a continuing obligation. Business Customers shall immediately notify the Company of any material change affecting their eligibility, including:
• changes in legal status;
• mergers, acquisitions, or restructuring;
• insolvency or bankruptcy proceedings;
• suspension or cancellation of business registrations;
• changes in ownership or authorized representatives; or
• any event that may materially affect the Business Customer's ability to perform its obligations under these Terms.
Failure to provide such notification may result in suspension or termination of the Business Account.

J. Compliance with Applicable Laws
Business Customers shall ensure that their use of the Platform complies with all applicable laws, regulations, industry standards, and governmental requirements, including those relating to:
• taxation;
• import and export controls;
• consumer protection, where applicable;
• anti-corruption and anti-bribery;
• competition law;
• data protection and privacy;
• environmental regulations; and
• any licensing or certification requirements relevant to their business.

K. No Consumer Transactions
The B2B Platform is intended solely for commercial transactions. Individuals purchasing Products for personal, household, or domestic use should use the Company's consumer (B2C) Platform, which is governed by separate Terms and Policies. The Company reserves the right to redirect, refuse, or cancel transactions that are determined to be consumer purchases submitted through the B2B Platform.

L. Statutory Compliance
Nothing contained in this Chapter shall:
• exclude, restrict, or limit any legal obligation imposed upon the Company under applicable law;
• exempt the Business Customer from compliance with applicable legal or regulatory requirements; or
• affect any rights or obligations that cannot lawfully be excluded by contract.
Where any provision of this Chapter conflicts with mandatory legal requirements, the applicable law shall prevail to the extent of such inconsistency.`
    },
    {
      title: "Chapter 4 – Business Accounts",
      content: `This Chapter governs the creation, administration, maintenance, and use of Business Accounts on the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE", "we", "our", or "us"). A Business Account enables eligible Business Customers to access Products, Services, quotations, Purchase Orders, invoices, procurement tools, and other commercial features made available through the Platform.

A. Account Registration
To access the Company's B2B Platform, a Business Customer may be required to register a Business Account. During registration, the Company may request information including, but not limited to:
• legal business name;
• business registration details;
• GSTIN, where applicable;
• PAN and other tax identifiers;
• registered office address;
• principal place of business;
• billing and shipping addresses;
• contact information;
• Authorized Representative details;
• banking information, where applicable; and
• any additional information reasonably required for commercial or regulatory purposes.
Registration shall not create a contractual obligation for the Company to accept any future Order or provide any Product or Service.

B. Account Approval
Submission of a registration application does not automatically create a Business Account. The Company may, at its reasonable discretion:
• approve or reject any application;
• request additional documentation or clarification;
• conduct verification procedures;
• perform risk assessments;
• delay activation pending completion of verification; or
• refuse registration where required by law, regulatory obligations, operational requirements, or legitimate business considerations.
The Company is under no obligation to establish a commercial relationship with every applicant.

C. Authorized Users
A Business Customer may designate one or more Authorized Users to access and operate its Business Account. The Business Customer shall ensure that each Authorized User:
• acts within the authority granted by the Business Customer;
• complies with these Terms;
• protects confidential business information;
• maintains appropriate security practices; and
• uses the Platform solely for lawful business purposes.
The Business Customer remains fully responsible for all actions performed through its Business Account, whether undertaken by its Authorized Users or any person using valid account credentials.

D. Account Credentials and Security
Business Customers are responsible for maintaining the confidentiality and security of:
• usernames;
• passwords;
• authentication credentials;
• security tokens;
• application programming interface (API) keys, where applicable; and
• any other account access credentials.
Business Customers shall:
• implement appropriate internal access controls;
• prevent unauthorized access;
• promptly change compromised credentials;
• notify the Company immediately upon becoming aware of any actual or suspected unauthorized access or security incident; and
• cooperate with the Company in investigating and mitigating any such incident.
The Company shall not be responsible for losses arising from the Business Customer's failure to maintain reasonable account security.

E. Accuracy and Maintenance of Account Information
Business Customers shall ensure that all account information remains:
• accurate;
• complete;
• current;
• truthful; and
• capable of receiving official communications.
The Business Customer shall promptly update any material changes, including changes relating to:
• business name;
• legal structure;
• registered office;
• GST registration;
• billing information;
• shipping locations;
• banking details;
• Authorized Representatives; or
• contact information.
The Company may rely on the information available in the Business Account unless notified otherwise.

F. Multiple Locations and Business Units
Subject to the Company's approval, a Business Customer may maintain multiple business locations, branches, warehouses, cost centers, departments, or procurement units under a single Business Account or through linked accounts. The Company may provide administrative tools enabling the Business Customer to:
• manage multiple delivery locations;
• assign purchasing authority;
• allocate budgets;
• manage departmental procurement;
• monitor transactions; and
• administer user permissions.
Availability of such features may depend upon the Platform's capabilities or the applicable commercial arrangement.

G. Account Verification and Periodic Review
The Company may conduct periodic reviews of Business Accounts to:
• verify continued eligibility;
• confirm regulatory compliance;
• update business information;
• assess creditworthiness, where applicable;
• prevent fraud;
• satisfy legal obligations; and
• maintain the integrity of the Platform.
Business Customers shall reasonably cooperate with such reviews and provide updated information when requested.

H. Suspension or Restriction of Accounts
The Company may suspend, restrict, or temporarily disable a Business Account where it reasonably believes that:
• information provided is inaccurate, incomplete, or misleading;
• verification requirements have not been satisfied;
• unauthorized access is suspected;
• fraudulent, unlawful, or abusive activity is detected;
• payment obligations remain materially overdue;
• these Terms have been materially breached;
• continued access presents a legal, regulatory, operational, or security risk; or
• suspension is otherwise required by applicable law or a lawful order of a competent authority.
Where reasonably practicable, the Company shall notify the Business Customer of the suspension and, where appropriate, provide an opportunity to remedy the issue.

I. Account Termination
A Business Account may be terminated:
• by the Business Customer upon written request, subject to the completion of outstanding contractual obligations;
• by mutual written agreement between the parties; or
• by the Company in accordance with these Terms or applicable law.
Termination of a Business Account shall not:
• affect outstanding payment obligations;
• cancel completed transactions;
• extinguish accrued rights or liabilities;
• affect confidentiality obligations; or
• prejudice any legal remedies available to either party.

J. Record Retention
The Company may retain account records, transaction history, invoices, communications, verification documents, and other business records for such period as is reasonably necessary to:
• comply with applicable law;
• satisfy taxation and accounting requirements;
• resolve disputes;
• prevent fraud;
• enforce contractual rights; or
• meet legitimate business and regulatory obligations.
Such records shall be handled in accordance with the Company's Business Privacy Policy and applicable data protection laws.

K. Business Customer Responsibilities
The Business Customer is responsible for:
• maintaining internal controls over account access;
• ensuring that Authorized Users comply with these Terms;
• protecting confidential credentials;
• promptly reporting suspected security incidents;
• reviewing account activity on a regular basis;
• ensuring that Orders submitted through the Account are authorized; and
• complying with all applicable laws and Company policies.
The Business Customer acknowledges that actions performed through its Business Account may be relied upon by the Company as authorized business instructions unless proven otherwise.

L. Statutory Compliance
Nothing contained in this Chapter shall:
• exclude, restrict, or limit any legal obligation imposed upon the Company under applicable law;
• prevent the Company from complying with lawful requests or regulatory requirements;
• affect rights or obligations arising under separate written agreements; or
• limit any rights that cannot lawfully be excluded or restricted.
Where any provision of this Chapter conflicts with mandatory legal requirements, the applicable law shall prevail to the extent of such inconsistency.`
    },
    {
      title: "Chapter 5 – Products & Services",
      content: `This Chapter governs the Products and Services made available through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE", "we", "our", or "us"). The Company provides a commercial procurement platform through which Business Customers may purchase Products and access related Services offered by the Company and, where applicable, by authorized Sellers, Suppliers, Distributors, and Manufacturers. Availability of any Product or Service shall always remain subject to stock availability, commercial feasibility, regulatory requirements, and acceptance of the relevant Purchase Order or Contract.

A. Products Offered
The Company may offer a wide range of Products through its B2B Platform, including but not limited to:
• computer hardware;
• networking equipment;
• servers and storage solutions;
• consumer electronics;
• enterprise IT equipment;
• peripherals and accessories;
• office automation products;
• security and surveillance equipment;
• software and software licenses;
• cloud-based subscriptions;
• digital products;
• electrical and electronic components;
• industrial electronics; and
• any other Products introduced by the Company from time to time.
Product availability may vary based on region, inventory, Supplier availability, regulatory requirements, or other commercial considerations.

B. Marketplace Model
The Company operates a commercial marketplace and procurement platform. Products available through the Platform may be:
• sold directly by the Company;
• supplied through authorized Suppliers;
• distributed through authorized Distributors;
• manufactured by Original Equipment Manufacturers (OEMs);
• listed by authorized third-party Sellers; or
• fulfilled through one or more logistics or fulfillment partners.
Unless expressly stated otherwise, the Company is not the manufacturer of Products listed on the Platform.

C. Procurement Services
The Company may provide procurement-related services, including:
• sourcing Products from approved Suppliers;
• obtaining commercial quotations;
• coordinating with Manufacturers and Distributors;
• facilitating bulk procurement;
• assisting with commercial product selection;
• managing procurement workflows;
• coordinating deliveries; and
• providing post-sale commercial support.
Provision of procurement services does not guarantee Product availability or acceptance of any Purchase Order.

D. Product Information
The Company endeavours to provide accurate Product information, including:
• specifications;
• technical descriptions;
• compatibility information;
• model numbers;
• images;
• pricing;
• certifications;
• warranty information; and
• availability.
Product descriptions are provided for general commercial information. Business Customers remain responsible for verifying that Products are suitable for their intended business, operational, technical, regulatory, and compatibility requirements before placing an Order.

E. Product Availability
All Products are offered subject to availability. The Company reserves the right to:
• discontinue any Product;
• modify Product offerings;
• substitute equivalent Products where agreed by the Business Customer;
• limit available quantities;
• allocate inventory among customers;
• refuse Orders due to inventory shortages; or
• suspend Product availability due to operational, legal, regulatory, or commercial reasons.
Listing a Product on the Platform does not constitute a guarantee of availability.

F. Product Specifications
Manufacturers may revise Product specifications, packaging, firmware, software, documentation, or technical features without prior notice. Unless expressly agreed in writing:
• minor variations shall not constitute a breach of these Terms;
• Product images are illustrative and may differ from the actual Product;
• packaging may vary between production batches; and
• software or firmware versions may differ from those displayed on the Platform.
Where a material specification changes before shipment, the Company shall use reasonable efforts to notify the Business Customer where practicable.

G. Software and Digital Products
Where Products include software, firmware, digital content, cloud services, or subscription-based offerings:
• use may be governed by separate license agreements issued by the relevant Manufacturer or software provider;
• license terms shall remain binding upon the Business Customer;
• activation may require registration with the software provider;
• subscription periods shall be governed by the applicable license; and
• the Company is not responsible for third-party licensing decisions or software usage restrictions.
Business Customers agree to comply with all applicable software licensing terms.

H. Third-Party Products
Products supplied by independent Sellers, Suppliers, Distributors, or Manufacturers may be subject to additional commercial terms imposed by those parties. Where applicable:
• Manufacturer warranties shall be governed by the Manufacturer's warranty documentation;
• software licenses shall be governed by the applicable licensor;
• installation services may be performed by authorized service providers; and
• technical certifications may originate from the Manufacturer.
Nothing in this Section limits the Company's obligations expressly undertaken under these Terms or under any separate written agreement.

I. Value-Added Services
The Company may offer value-added business services, including but not limited to:
• product sourcing;
• commercial quotations;
• procurement assistance;
• logistics coordination;
• installation coordination;
• technical consultation;
• extended warranty offerings;
• after-sales support coordination;
• project procurement assistance;
• enterprise account management; and
• other commercial services introduced from time to time.
Availability of such services may depend upon location, Product category, Supplier participation, and applicable commercial agreements.

J. Product Compliance
The Company endeavours to source Products from legitimate Manufacturers, Suppliers, Distributors, and authorized Sellers. Where applicable, Products may comply with relevant:
• safety standards;
• certification requirements;
• regulatory approvals;
• environmental regulations; and
• quality standards.
Business Customers remain responsible for ensuring that Products comply with any industry-specific, organizational, contractual, or regulatory requirements applicable to their intended use.

K. Product Pricing
Product pricing is governed by the applicable quotation, Purchase Order, invoice, Contract, or commercial agreement. Prices displayed on the Platform:
• may change without prior notice until an Order is accepted;
• may vary based on quantity, availability, negotiated commercial terms, promotional offers, or Supplier pricing;
• may exclude applicable Taxes, shipping charges, installation charges, insurance, customs duties, or other fees unless expressly stated otherwise; and
• remain subject to correction in the event of genuine clerical, technical, or pricing errors.
Final pricing shall be determined in accordance with the accepted commercial documentation governing the transaction.

L. Business Customer Responsibilities
Business Customers are responsible for:
• reviewing Product specifications before purchase;
• ensuring Product compatibility with their systems and intended applications;
• obtaining any required regulatory approvals, licenses, or permits for their intended use;
• complying with applicable laws governing the use, installation, storage, export, or resale of Products; and
• using Products in accordance with the Manufacturer's instructions and applicable safety requirements.
The Company shall not be responsible for losses arising from improper installation, misuse, unauthorized modifications, or use inconsistent with the Product's intended purpose.

M. Statutory Compliance
Nothing contained in this Chapter shall:
• exclude, restrict, or limit any legal obligation imposed upon the Company under applicable law;
• affect any express warranty or contractual commitment provided by the Company;
• limit any rights or remedies that cannot lawfully be excluded by contract; or
• prevent the Company from complying with applicable legal or regulatory requirements.
Where any provision of this Chapter conflicts with mandatory legal requirements, the applicable law shall prevail to the extent of such inconsistency.`
    },
    {
      title: "Chapter 6 – Quotations & Pricing",
      content: `This Chapter governs the issuance of quotations, pricing, commercial offers, and related pricing terms applicable to Products and Services offered through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE", "we", "our", or "us"). All quotations and pricing are provided solely for legitimate commercial purposes and are subject to these Terms, any applicable Purchase Order, executed Contract, and any separate written agreement between the parties.

A. Quotations
The Company may issue written quotations upon request from a Business Customer. A quotation may include, where applicable:
• Product descriptions;
• model numbers;
• technical specifications;
• quantities;
• unit pricing;
• total pricing;
• applicable Taxes;
• estimated delivery timelines;
• payment terms;
• warranty information;
• quotation validity period; and
• any special commercial conditions.
Unless expressly stated otherwise, a quotation is an invitation to negotiate and does not constitute a legally binding offer capable of acceptance by the Business Customer.

B. Quotation Validity
Each quotation shall remain valid only for the period expressly specified in the quotation. Where no validity period is specified, the Company reserves the right to withdraw, modify, or revise the quotation at any time before acceptance of the corresponding Purchase Order. Upon expiry of the quotation validity period, pricing and commercial terms may be revised without prior notice.

C. Pricing
Product and Service pricing may be determined based on factors including:
• Manufacturer pricing;
• Supplier pricing;
• Distributor pricing;
• market conditions;
• exchange rate fluctuations;
• Product availability;
• order quantities;
• procurement costs;
• freight and logistics costs;
• insurance costs;
• applicable Taxes;
• negotiated commercial arrangements; and
• any other relevant commercial considerations.
Pricing may vary between Business Customers based on negotiated agreements or approved commercial programs.

D. Taxes and Government Charges
Unless expressly stated otherwise in writing:
• all prices are exclusive of applicable Taxes;
• Goods and Services Tax (GST) shall be charged at the applicable statutory rate;
• customs duties, import duties, levies, cess, withholding taxes, or similar governmental charges shall be borne by the party responsible under applicable law or the relevant commercial agreement; and
• the Business Customer shall provide any documentation reasonably required for tax compliance.
The Company shall issue invoices in accordance with applicable taxation laws.

E. Freight, Insurance and Additional Charges
Unless expressly included within the quotation, pricing may exclude:
• shipping charges;
• freight charges;
• insurance;
• packaging charges;
• installation costs;
• commissioning services;
• unloading charges;
• customs clearance expenses;
• storage charges;
• handling fees; and
• any other ancillary charges.
Such charges shall be separately communicated or reflected in the applicable quotation, Purchase Order, invoice, or Contract.

F. Pricing Errors
Despite reasonable efforts, pricing errors, typographical mistakes, calculation errors, technical issues, or system malfunctions may occasionally occur. If the Company discovers a genuine pricing error before accepting a Purchase Order, it may:
• correct the pricing;
• issue a revised quotation;
• request confirmation from the Business Customer; or
• decline the Order without liability.
Where an Order has already been accepted, the Company shall work with the Business Customer in good faith to resolve the issue in accordance with applicable law and any executed Contract.

G. Price Revisions
The Company reserves the right to revise Product or Service pricing before acceptance of a Purchase Order due to:
• Manufacturer price revisions;
• Supplier cost changes;
• changes in Taxes;
• regulatory changes;
• exchange rate fluctuations;
• freight or logistics cost increases;
• changes in Product availability;
• discontinuation of Products; or
• other commercially reasonable circumstances beyond the Company's control.
No price revision shall affect an accepted Purchase Order unless expressly permitted under the applicable Contract or required by law.

H. Discounts and Promotional Pricing
The Company may, at its sole discretion, offer:
• volume discounts;
• negotiated commercial pricing;
• promotional pricing;
• project-specific pricing;
• tender pricing;
• institutional pricing;
• reseller pricing;
• channel partner pricing; or
• other commercial incentives.
Unless expressly agreed in writing:
• discounts shall not be cumulative;
• promotional pricing shall remain subject to availability;
• discounts shall not create an ongoing entitlement for future Orders; and
• promotional programs may be modified or withdrawn without prior notice.

I. Currency
Unless otherwise agreed in writing, all quotations, invoices, Purchase Orders, and commercial transactions shall be denominated in the currency specified by the Company. Where foreign currency transactions are agreed, pricing may be adjusted to reflect:
• exchange rate movements;
• banking charges;
• import costs;
• regulatory requirements; and
• other agreed commercial terms.

J. Custom Quotations
For project-based procurement, enterprise deployments, government tenders, institutional procurements, or other specialized commercial transactions, the Company may issue customized quotations containing additional commercial terms, including:
• milestone-based pricing;
• phased deliveries;
• project implementation schedules;
• customized warranty terms;
• service-level commitments;
• installation services;
• support arrangements; and
• other mutually agreed commercial conditions.
In the event of any inconsistency, the mutually executed written agreement or accepted quotation shall prevail over this Chapter to the extent of the inconsistency.

K. Non-Binding Estimates
Any indicative pricing, budgetary estimates, preliminary quotations, catalog prices, or verbal pricing information provided by the Company are for informational purposes only and do not constitute binding commercial commitments. Only a written quotation or other commercial document issued by the Company and accepted in accordance with these Terms shall form the basis of a commercial transaction.

L. Business Customer Responsibilities
The Business Customer shall:
• review quotations carefully before placing a Purchase Order;
• verify Product specifications and quantities;
• notify the Company of any discrepancies without undue delay;
• ensure that Purchase Orders accurately reflect the agreed commercial terms; and
• obtain any internal approvals required before accepting a quotation or placing an Order.
Failure to identify obvious discrepancies before acceptance may delay Order processing or require the issuance of revised commercial documentation.

M. Good Faith
Both parties shall act in good faith during quotation, pricing negotiations, and commercial discussions. Neither party shall knowingly provide false, misleading, or fraudulent information or engage in conduct intended to manipulate pricing or procurement processes.

N. Compliance with Applicable Law
Nothing contained in this Chapter shall:
• exclude, restrict, or limit any legal obligation imposed upon either party under applicable law;
• prevent the Company from correcting genuine pricing errors in accordance with applicable law;
• affect any binding pricing terms contained in an executed written agreement; or
• limit any rights or remedies that cannot lawfully be excluded by contract.
Where any provision of this Chapter conflicts with mandatory legal requirements, the applicable law shall prevail to the extent of such inconsistency.`
    },
    {
      title: "Chapter 7 – Purchase Orders",
      content: `This Chapter governs the submission, acceptance, modification, execution, and administration of Purchase Orders ("POs") placed through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE", "we", "our", or "us"). All Purchase Orders shall be subject to these Terms, the applicable quotation, executed commercial agreements, and any other mutually agreed written terms.

A. Submission of Purchase Orders
A Business Customer may submit a Purchase Order through:
• the Company's B2B Platform;
• an approved procurement portal;
• email;
• electronic data interchange (EDI), where supported;
• application programming interfaces (APIs), where available; or
• any other method expressly approved by the Company.
Each Purchase Order should accurately specify, where applicable:
• Product descriptions;
• model numbers;
• quantities;
• pricing;
• delivery location(s);
• billing information;
• requested delivery schedule;
• reference quotation;
• payment terms; and
• any other applicable commercial requirements.
Submission of a Purchase Order does not obligate the Company to accept or fulfill it.

B. Review and Acceptance
Upon receipt of a Purchase Order, the Company may review it for:
• Product availability;
• pricing accuracy;
• technical specifications;
• commercial feasibility;
• payment arrangements;
• compliance with applicable laws;
• internal approval requirements; and
• consistency with any applicable quotation or commercial agreement.
A Purchase Order shall become binding only upon the Company's written acceptance, issuance of an Order Confirmation, commencement of performance, or any other form of acceptance expressly communicated by the Company. Until such acceptance, the Company may accept, reject, or request modifications to the Purchase Order.

C. Order Confirmation
Where a Purchase Order is accepted, the Company may issue an Order Confirmation containing, as applicable:
• Order reference number;
• accepted Products or Services;
• confirmed quantities;
• pricing;
• delivery schedule;
• payment terms;
• shipping arrangements;
• estimated fulfillment timeline; and
• any special commercial conditions.
The Business Customer should promptly review the Order Confirmation and notify the Company of any discrepancies without undue delay.

D. Modification and Fulfillment of Purchase Orders
A Purchase Order may only be modified before acceptance by the Company unless otherwise agreed in writing. Following acceptance, any changes requested by the Business Customer regarding quantities, delivery schedules, product specifications, or shipping locations shall require mutual written consent and may result in adjustments to pricing, delivery timelines, or ancillary fees. Fulfillment of Purchase Orders shall be carried out in accordance with agreed commercial terms, logistics procedures, and applicable laws.`
    }
  ];

  const sections = [
    {
      title: "1. Definitions",
      content: `For the purposes of these Terms & Conditions, the following terms shall have the meanings assigned to them below unless the context otherwise requires: 1. "Company", "PLE", "we", "our", or "us" means Peoples League Of Electronics Private Limited, its successors, affiliates, subsidiaries, assigns, directors, officers, employees, representatives, and authorized partners.  2. "Platform" means the PLE mobile application, website(s), web applications, software, APIs, digital services, and any other products or services owned, operated, or provided by the Company.  3. "User", "Customer", "you", or "your" means any individual who accesses, browses, registers, purchases from, or otherwise uses the Platform.  4. "Account" means a registered user profile created to access certain features and services available on the Platform.  5. "Products" means all physical goods, digital goods, software, subscriptions, accessories, services, warranties, or any other items offered through the Platform.  6. "Order" means a request submitted by a User to purchase one or more Products through the Platform.  7. "Seller" means Peoples League Of Electronics Private Limited and, where applicable, any authorized third-party seller, vendor, distributor, manufacturer, or merchant permitted to offer Products through the Platform.  8. "Content" includes text, graphics, logos, trademarks, software, images, videos, product descriptions, audio, data, documentation, designs, code, and all other material available on the Platform.  9. "Applicable Laws" means all laws, regulations, notifications, rules, circulars, judicial decisions, and governmental directives applicable within the Republic of India and any other jurisdiction where the Platform legally operates.  10. "Business Day" means any day other than Saturdays, Sundays, and public holidays on which banks are generally open for business in India, unless otherwise specified.  11. "Services" means all services, features, functionalities, support, digital tools, promotions, offers, customer assistance, and related facilities made available through the Platform.  12. "Third-Party Services" means services, software, payment gateways, logistics providers, financing partners, manufacturers, warranty providers, advertisers, analytics providers, or any external entity integrated with or accessible through the Platform.  13. Words importing the singular include the plural and vice versa. Headings are provided solely for convenience and shall not affect the interpretation of these Terms.`
    },
    {
      title: "2. Acceptance of Terms",
      content: `1. These Terms & Conditions ("Terms") constitute a legally binding agreement between Peoples League Of Electronics Private Limited ("Company", "PLE", "we", "our", or "us") and any person who accesses, browses, registers, purchases from, or otherwise uses the Platform ("User", "Customer", "you", or "your").  2. By accessing or using the Platform, creating an Account, placing an Order, purchasing any Product or Service, or otherwise interacting with the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and all other policies incorporated by reference.  3. If you do not agree to these Terms or any incorporated policy, you must immediately discontinue use of the Platform and refrain from accessing or using any of its Products or Services.  4. These Terms apply to all visitors, registered users, purchasers, and any other individuals or entities accessing or using the Platform, whether through the website, mobile application, or any other authorized channel operated by the Company.  5. Certain Products, Services, promotional offers, payment methods, or Platform features may be subject to additional terms, conditions, guidelines, or agreements. In the event of a conflict between these Terms and such specific terms, the specific terms shall prevail only to the extent of such conflict.  6. The Company reserves the right to modify, amend, update, or replace these Terms at any time in its sole discretion to reflect changes in law, business operations, technology, security requirements, or Platform functionality. Updated Terms shall become effective upon publication on the Platform unless otherwise stated.  7. Your continued access to or use of the Platform after any modification to these Terms constitutes your acceptance of the revised Terms. If you do not agree to any revised Terms, you must discontinue use of the Platform.  8. Nothing in these Terms shall be construed as creating any partnership, agency, joint venture, employment, franchise, or fiduciary relationship between you and the Company.  9. These Terms are governed by the applicable laws of India and are intended to comply with all applicable legal and regulatory requirements governing electronic commerce and consumer transactions, to the extent applicable.`
    },
    {
      title: "3. Eligibility",
      content: `1. The Platform is intended for use only by individuals who are legally competent to enter into binding contracts under the applicable laws of India.  2. By accessing or using the Platform, you represent and warrant that:  o You are at least eighteen (18) years of age, or have attained the age of majority under the laws applicable to you;  o You possess the legal capacity and authority to enter into and comply with these Terms;  o All information provided by you is true, accurate, complete, and up to date; and  o Your use of the Platform does not violate any applicable law, regulation, court order, or contractual obligation.  3. Individuals below the age of eighteen (18) years ("Minors") may use the Platform only under the supervision and consent of a parent or lawful guardian who agrees to be bound by these Terms. Any transaction carried out by or on behalf of a Minor shall be deemed to have been authorized by such parent or guardian, who shall remain responsible for the Minor's actions and obligations arising from the use of the Platform.  4. The Company reserves the right to request proof of identity, age, or any other information reasonably necessary to verify a User's eligibility at any time. Failure to provide satisfactory information may result in suspension, restriction, or termination of access to the Platform or cancellation of any pending Order, where permitted by applicable law.  5. The Company may, at its sole discretion and subject to applicable law, refuse access to the Platform, decline registration, restrict certain features, or reject any Order if it reasonably believes that a User:  o Is not eligible to use the Platform;  o Has provided false, misleading, or incomplete information;  o Has violated these Terms or any applicable policy;  o Is engaging in fraudulent, abusive, unlawful, or suspicious activities; or  o Poses a security, financial, operational, or legal risk to the Company, other Users, Sellers, or third parties.  6. Where a User is acting on behalf of another individual or organization, such User represents and warrants that they possess all necessary authority to bind such individual or organization to these Terms.  7. The Company shall not be liable for any loss, damage, liability, or claim arising from a User's misrepresentation regarding their identity, age, authority, or legal capacity to use the Platform.`
    },
    {
      title: "4. User Account & Registration",
      content: `1. Certain features of the Platform may require you to create and maintain a registered Account. By registering an Account, you agree to provide accurate, complete, current, and truthful information and to promptly update such information whenever necessary.  2. You are solely responsible for maintaining the confidentiality and security of your Account credentials, including your username, password, one-time passwords (OTPs), authentication codes, and any other security information associated with your Account.  3. You shall be solely responsible for all activities, transactions, communications, and actions carried out through your Account, whether authorized by you or resulting from your failure to safeguard your Account credentials, except where such unauthorized use is directly attributable to the Company's negligence or failure to implement reasonable security measures required under applicable law.  4. You agree to immediately notify the Company upon becoming aware of:  o Any unauthorized access to or use of your Account;  o Any actual or suspected breach of security;  o Loss, theft, or compromise of your login credentials; or  o Any activity that you reasonably believe is fraudulent, unlawful, or unauthorized.  5. The Company reserves the right to verify your identity, contact information, or other registration details at any time through reasonable means, including but not limited to OTP verification, email verification, government-issued identification (where legally required), or other verification mechanisms.  6. You shall not:  o Create an Account using false, misleading, or fraudulent information;  o Impersonate another individual or entity;  o Maintain multiple Accounts for fraudulent, abusive, or deceptive purposes;  o Buy, sell, transfer, lease, assign, or otherwise permit another person to use your Account without the Company's prior written authorization;  o Circumvent any restrictions imposed on your Account by creating additional Accounts.  7. The Company reserves the right, at its sole discretion and subject to applicable law, to suspend, restrict, deactivate, or permanently terminate any Account where it reasonably believes that:  o These Terms or any applicable policy has been violated;  o Fraudulent, unlawful, abusive, or suspicious activity has occurred;  o False or misleading information has been provided;  o Continued access poses a security, operational, financial, or legal risk to the Company, other Users, or third parties; or  o Such action is necessary to comply with applicable law, regulatory requirements, or lawful governmental requests.  8. You may request closure of your Account at any time through the Platform or by contacting the Company's customer support. Account closure shall not affect any rights, obligations, liabilities, payment obligations, pending Orders, disputes, investigations, or legal proceedings that arose prior to such closure.  9. The Company may retain certain Account information following closure, suspension, or termination where required or permitted under applicable law, regulatory obligations, fraud prevention requirements, dispute resolution, tax compliance, record retention obligations, or legitimate business purposes, in accordance with the Company's Privacy Policy.  10. Registration of an Account does not guarantee continued access to the Platform, availability of Products or Services, approval of Orders, or eligibility for promotions, offers, or specific Platform features.`
    },
    {
      title: "5. Products & Services",
      content: `1. The Platform enables Users to browse, compare, purchase, and access a variety of Products and Services offered by the Company and, where applicable, authorized third-party Sellers through the Platform.  2. The Company endeavors to ensure that all Product and Service descriptions, specifications, images, compatibility information, technical details, pricing, availability, and other related information displayed on the Platform are accurate and up to date. However, such information may contain typographical errors, inadvertent inaccuracies, omissions, or may change without prior notice.  3. Product images, videos, illustrations, colors, dimensions, packaging, and other visual representations are provided for illustrative purposes only. Actual Products may vary due to manufacturing changes, display settings, lighting conditions, software rendering, or other factors beyond the Company's reasonable control.  4. Product specifications, features, compatibility, accessories, bundled items, warranties, software versions, model numbers, and manufacturer information are subject to change by the respective manufacturer or Seller without prior notice. The Company shall not be liable for such changes where they are outside its reasonable control.  5. The availability of any Product or Service displayed on the Platform does not constitute a guarantee that such Product or Service will remain available for purchase. Products and Services may be discontinued, modified, substituted, or withdrawn at any time without prior notice.  6. The Company reserves the right to:  o Limit the quantity of any Product or Service available for purchase;  o Refuse or cancel Orders in accordance with these Terms and applicable law;  o Modify, suspend, discontinue, or replace any Product, Service, feature, promotion, or offering at any time; and  o Introduce eligibility criteria, geographic restrictions, purchase limits, or other reasonable conditions for certain Products or Services.  7. Certain Products or Services may require activation, registration, software updates, internet connectivity, manufacturer registration, or compliance with additional terms issued by the manufacturer, software provider, or third-party service provider. Users agree to comply with all such applicable terms.  8. The Company does not warrant that every Product or Service will be available in every location or that all Products can be delivered to every serviceable area. Availability may vary depending on inventory, logistics, regulatory restrictions, supplier limitations, or service coverage.  9. Products sold through the Platform may be supplied directly by the Company or, where applicable, fulfilled by authorized manufacturers, distributors, logistics partners, or third-party Sellers. Such fulfillment arrangements shall not affect the applicability of these Terms unless expressly stated otherwise.  10. The Company reserves the right to correct any inadvertent errors relating to Product descriptions, specifications, availability, pricing, promotions, or other information at any time, including after an Order has been placed, subject to applicable consumer protection laws.  11. Nothing contained on the Platform shall be construed as a guarantee of uninterrupted availability, future availability, or permanent offering of any particular Product, Service, brand, feature, or promotion.`
    },
    {
      title: "6. Pricing & Payments",
      content: `1. All prices displayed on the Platform are stated in Indian Rupees (INR) unless expressly indicated otherwise and are inclusive or exclusive of applicable taxes, duties, levies, or charges as specified at the time of purchase.  2. The Company makes reasonable efforts to ensure that pricing, discounts, promotional offers, taxes, and other charges displayed on the Platform are accurate. However, inadvertent errors, technical issues, or system malfunctions may occur. The Company reserves the right to correct such errors at any time, including after an Order has been placed, in accordance with applicable law.  3. Prices, discounts, promotional offers, exchange offers, cashback, coupons, loyalty benefits, financing options, and other commercial terms are subject to change without prior notice unless expressly confirmed by the Company for a specific Order.  4. The final amount payable by the User shall be the amount displayed at the checkout page at the time the Order is placed, together with any applicable taxes, delivery charges, convenience fees, handling charges, installation charges, or other charges disclosed before payment is completed.  5. Payments may be made through payment methods made available on the Platform from time to time, including but not limited to debit cards, credit cards, UPI, net banking, digital wallets, EMI facilities, Buy Now Pay Later (BNPL), gift cards, or any other payment methods supported by the Platform.  6. The Company utilizes third-party payment gateways and payment service providers to process transactions. By making a payment through the Platform, you acknowledge that your payment may also be subject to the terms and conditions of the relevant payment service provider. The Company is not responsible for the independent acts, omissions, delays, failures, or policies of such third-party providers.  7. An Order shall not be deemed accepted solely because payment has been initiated or successfully processed. Acceptance of an Order shall remain subject to verification, inventory availability, fraud prevention measures, compliance checks, and other conditions set forth in these Terms.  8. Where a payment transaction fails, is declined, is reversed, is charged back, or remains incomplete for any reason, the Company reserves the right to suspend processing of the relevant Order until successful payment is received or to cancel the Order where permitted under applicable law.  9. In the event that a payment is successfully debited but an Order cannot be processed or is cancelled by the Company, any eligible refund shall be processed in accordance with the Company's applicable refund policy and the timelines of the relevant payment service provider.  10. Users represent and warrant that they are legally authorized to use the selected payment method and that all payment information provided is accurate, complete, and lawfully obtained.  11. The Company reserves the right to refuse, suspend, limit, or decline any transaction where it reasonably suspects fraud, unauthorized activity, payment abuse, money laundering, sanctions violations, misuse of promotional benefits, or any activity prohibited under applicable law.  12. Electronic invoices, receipts, payment confirmations, credit notes, debit notes, and other transaction records generated by the Company shall, unless proven otherwise, constitute prima facie evidence of the relevant transaction.  13. Taxes shall be charged in accordance with applicable laws in force at the time of the transaction. Users shall be responsible for providing accurate billing information, including GST details where applicable.  14. Unless expressly stated otherwise, ownership of the Product shall pass to the User only upon receipt of full payment and subject to delivery in accordance with these Terms and applicable law.`
    },
    {
      title: "7. Orders & Acceptance",
      content: `1. By placing an Order through the Platform, you submit an offer to purchase the selected Product(s) or Service(s) subject to these Terms. Submission of an Order does not constitute acceptance of the Order by the Company.  2. An Order shall be deemed accepted only when the Company expressly confirms acceptance by initiating shipment, dispatching the Product, activating the Service, or otherwise communicating acceptance through the Platform or other authorized communication channels. An Order confirmation or payment acknowledgment merely confirms receipt of your Order request and shall not, by itself, constitute acceptance.  3. All Orders are subject to verification, inventory availability, serviceability, payment authorization, fraud prevention checks, pricing validation, regulatory compliance, and any other reasonable verification processes deemed necessary by the Company.  4. The Company reserves the right to refuse, reject, modify, partially fulfill, or cancel any Order, in whole or in part, at its sole discretion and subject to applicable law, including but not limited to circumstances involving:  o Pricing or technical errors;  o Product unavailability or stock shortages;  o Supplier, manufacturer, or logistics constraints;  o Payment failure or unsuccessful authorization;  o Suspected fraudulent, abusive, unlawful, or suspicious activity;  o Violation of these Terms or any applicable policy;  o Regulatory, legal, or governmental restrictions; or  o Events beyond the Company's reasonable control.  5. Where an Order cannot be fulfilled in full, the Company may, where appropriate, cancel the affected portion of the Order while proceeding with the remaining items, unless otherwise requested by the User or required by applicable law.  6. The Company reserves the right to impose reasonable purchase limits on specific Products, categories, promotional offers, or individual Users in order to prevent misuse, bulk purchasing, resale contrary to intended consumer use, inventory manipulation, or fraudulent activities.  7. Users are responsible for ensuring that all Order details, including the selected Products, quantities, specifications, billing information, shipping address, contact details, and any customization requests, are accurate before completing the Order. The Company shall not be responsible for delays, additional costs, or failed deliveries arising from incorrect information provided by the User.  8. If an Order is cancelled by the Company after successful payment has been received, any eligible refund shall be processed in accordance with the Company's applicable Refund Policy and subject to the processing timelines of the relevant payment service provider.  9. The Company may contact the User for additional verification, clarification, or confirmation before accepting or processing an Order. Failure to respond within a reasonable period may result in delay or cancellation of the Order.  10. Risk of loss or damage to Products shall pass to the User upon delivery in accordance with these Terms, while ownership shall transfer in accordance with Clause 6 (Pricing & Payments) or as otherwise required by applicable law.  11. The Company reserves the right to correct clerical, pricing, typographical, computational, inventory, or technical errors relating to an Order before or after Order acceptance, provided that such correction complies with applicable consumer protection laws.  12. Any estimated delivery dates, dispatch timelines, or availability information displayed on the Platform are estimates only and shall not constitute a guarantee or legally binding commitment unless expressly stated otherwise.`
    },
    {
      title: "8. Cancellations",
      content: `1. Orders may be cancelled by the User only in accordance with the Company's applicable Cancellation Policy and any cancellation options made available through the Platform.  2. A User may request cancellation of an Order before it has been dispatched, shipped, or otherwise processed for fulfillment, subject to the nature of the Product or Service, operational feasibility, payment status, and any applicable legal or regulatory requirements.  3. Once an Order has been dispatched, handed over to a logistics partner, delivered, activated, downloaded, installed, customized, or otherwise fulfilled, cancellation may not be permitted except where required by applicable law or expressly provided under the Company's separate Cancellation Policy.  4. Certain Products or Services, including but not limited to customized, personalized, made-to-order, digital, downloadable, software-based, activation-based, perishable, hygiene-sensitive, or otherwise non-cancellable items, may not be eligible for cancellation. Such restrictions shall be disclosed where reasonably practicable.  5. The Company reserves the right to cancel any Order, in whole or in part, prior to fulfillment where reasonably necessary, including but not limited to:  o Product unavailability or inventory shortages;  o Pricing, catalog, or technical errors;  o Payment failure or unsuccessful authorization;  o Suspected fraudulent, abusive, or unauthorized activity;  o Regulatory or legal requirements;  o Force Majeure events; or  o Any other circumstance that prevents the lawful or reasonable fulfillment of the Order.  6. Where the Company cancels an Order after receiving payment, any eligible refund shall be processed in accordance with the Company's Refund Policy and the timelines of the applicable payment service provider.  7. Repeated cancellations, abuse of cancellation privileges, fraudulent purchasing behavior, misuse of promotional offers, or other activities that adversely affect the Platform, Sellers, or other Users may result in restrictions on the User's Account, suspension of certain Platform features, or termination of the Account in accordance with these Terms.  8. Submission of a cancellation request does not automatically result in cancellation. A cancellation shall be effective only upon confirmation by the Company or where the Platform expressly indicates that the cancellation request has been successfully accepted.  9. Any cancellation fees, deductions, or charges, where legally permissible and applicable, shall be disclosed to the User before completion of the cancellation request.  10. This section shall be read together with the Company's separate Cancellation Policy, which forms an integral part of these Terms. In the event of any inconsistency relating specifically to cancellations, the Cancellation Policy shall prevail to the extent of such inconsistency.`
    },
    {
      title: "9. User Responsibilities",
      content: `1. Users shall use the Platform only for lawful purposes and in accordance with these Terms, all applicable laws, regulations, and any policies issued by the Company from time to time.  2. Users are responsible for ensuring that all information provided to the Company, including registration details, contact information, billing information, shipping information, and any other information submitted through the Platform, remains accurate, complete, and up to date.  3. Users shall review all Product descriptions, specifications, compatibility information, pricing, delivery details, and other relevant information before placing an Order. Users are responsible for ensuring that the selected Product or Service meets their requirements.  4. Users shall promptly inspect delivered Products and report any visible damage, incorrect items, shortages, or other delivery-related issues in accordance with the Company's applicable policies.  5. Users shall use Products purchased through the Platform in accordance with the manufacturer's instructions, safety guidelines, warranty terms, user manuals, and all applicable laws and regulations.  6. Users are responsible for maintaining the confidentiality and security of their Account and for all activities conducted through their Account, as provided in these Terms.  7. Users shall cooperate with the Company where reasonably required for identity verification, fraud prevention, payment verification, dispute resolution, regulatory compliance, product recalls, or investigations relating to Orders or use of the Platform.  8. Users shall not misuse, interfere with, damage, disrupt, overload, or attempt to gain unauthorized access to the Platform, its systems, networks, software, databases, security measures, or any services provided through the Platform.  9. Users shall comply with all instructions, notices, policies, guidelines, and reasonable requests issued by the Company in relation to the use of the Platform, Products, or Services.  10. Users are solely responsible for ensuring that their use of the Platform, Products, and Services complies with all applicable local, state, national, and international laws that may apply to them.  11. Users acknowledge that failure to comply with these Terms may result in cancellation of Orders, suspension or termination of Accounts, restriction of Platform access, or any other action permitted under these Terms or applicable law.  12. Users shall act honestly, fairly, and in good faith while interacting with the Company, Sellers, customer support representatives, delivery personnel, other Users, and any third parties associated with the Platform. Abuse, harassment, threats, fraudulent conduct, or any behavior that disrupts the safe and lawful operation of the Platform may result in appropriate action by the Company.`
    },
    {
      title: "10. Prohibited Activities",
      content: `Users shall not, directly or indirectly, engage in, attempt to engage in, encourage, facilitate, or assist any person in engaging in any of the following activities while accessing or using the Platform: 1. Violating these Terms, any other policy of the Company, or any applicable law, regulation, judicial order, or governmental directive.  2. Providing false, inaccurate, incomplete, misleading, or fraudulent information, or impersonating any individual, organization, or entity.  3. Creating, maintaining, or using multiple Accounts for fraudulent, deceptive, abusive, or unauthorized purposes.  4. Accessing or attempting to access another User's Account, personal information, or data without proper authorization.  5. Circumventing, disabling, bypassing, interfering with, or attempting to defeat any security feature, authentication mechanism, access control, rate limitation, encryption, or other protective measure implemented by the Company.  6. Uploading, transmitting, distributing, or introducing any virus, malware, ransomware, spyware, Trojan horse, worm, malicious code, or any other harmful software or technology that may damage, disrupt, or impair the Platform or any connected systems.  7. Interfering with, disrupting, overloading, reverse engineering, decompiling, disassembling, scraping, crawling, copying, extracting data from, or otherwise attempting to exploit the Platform, its infrastructure, software, source code, databases, or proprietary technologies, except where expressly permitted by applicable law.  8. Using automated tools, bots, scripts, artificial intelligence systems, spiders, crawlers, or similar technologies to access, monitor, collect data from, purchase Products, manipulate inventory, or otherwise interact with the Platform without the Company's prior written authorization.  9. Engaging in fraudulent transactions, payment fraud, identity theft, chargeback abuse, refund abuse, promotional abuse, coupon misuse, or any activity intended to obtain an unlawful or unfair commercial advantage.  10. Purchasing Products for unlawful purposes or using the Platform to facilitate illegal activities, including but not limited to money laundering, terrorist financing, fraud, trafficking of prohibited goods, intellectual property infringement, or any other criminal activity.  11. Posting, transmitting, or sharing any content that is unlawful, defamatory, obscene, abusive, threatening, discriminatory, hateful, harassing, misleading, invasive of privacy, or otherwise objectionable.  12. Infringing or violating the intellectual property rights, proprietary rights, privacy rights, publicity rights, or other legal rights of the Company, Sellers, manufacturers, other Users, or any third party.  13. Attempting to manipulate product ratings, reviews, rankings, search results, availability, pricing, promotions, or any other Platform functionality through deceptive or unfair means.  14. Reselling Products purchased through the Platform where prohibited by applicable law, contractual restrictions, manufacturer policies, or where purchase limits have been imposed by the Company.  15. Misusing customer support channels, making false complaints, submitting fraudulent warranty or service claims, threatening Company personnel, or engaging in abusive or inappropriate conduct towards employees, Sellers, logistics personnel, or other representatives of the Company.  16. Using the Platform in any manner that could damage the reputation, goodwill, integrity, security, reliability, or normal operation of the Company, the Platform, Sellers, other Users, or any third party.  17. Assisting, encouraging, facilitating, or attempting to commit any of the prohibited activities described in this section.  18. The Company reserves the right to investigate suspected violations of this Section and, subject to applicable law, take appropriate action, including suspension or termination of Accounts, cancellation of Orders, restriction of Platform access, reporting to competent authorities, or pursuing any civil, criminal, or other legal remedies available to it.`
    },
    {
      title: "11. Intellectual Property",
      content: `1. Unless otherwise expressly stated, the Platform and all intellectual property rights therein are owned by or licensed to Peoples League Of Electronics Private Limited and are protected under applicable intellectual property laws, including copyright, trademark, patent, trade secret, design, and other proprietary rights.  2. The Platform, including but not limited to its software, source code, object code, databases, user interfaces, layouts, designs, graphics, logos, icons, trademarks, service marks, trade names, domain names, product names, text, images, videos, audio, documentation, algorithms, features, functionalities, compilations, and other Content, is the exclusive property of the Company or its respective licensors, unless otherwise indicated.  3. All trademarks, logos, brand names, product names, service marks, trade dress, and other identifying marks displayed on the Platform are the property of their respective owners. Nothing contained on the Platform or in these Terms shall be construed as granting any license or right to use any such intellectual property without the prior written consent of the respective owner.  4. Subject to these Terms, the Company grants Users a limited, non-exclusive, nontransferable, non-sublicensable, revocable license to access and use the Platform solely for personal, lawful, and non-commercial purposes.  5. Except as expressly permitted by applicable law or with the Company's prior written consent, Users shall not:  o Copy, reproduce, modify, adapt, translate, publish, distribute, display, transmit, broadcast, sell, license, lease, sublicense, assign, or otherwise exploit any part of the Platform or its Content;  o Reverse engineer, decompile, disassemble, decode, or otherwise attempt to derive the source code or underlying technology of the Platform;  o Remove, alter, conceal, or modify any copyright, trademark, proprietary notice, watermark, or other ownership designation;  o Create derivative works based upon the Platform or its Content; or  o Use the Company's intellectual property in any manner that may cause confusion, dilution, or damage to the Company's rights or reputation.  6. Where Users submit reviews, ratings, feedback, suggestions, ideas, photographs, videos, comments, or other content ("User Content") to the Platform, Users represent and warrant that they own or have all necessary rights to submit such User Content and that such submission does not infringe the rights of any third party.  7. By submitting User Content, Users grant the Company a worldwide, non-exclusive, royalty-free, transferable, sublicensable, perpetual, irrevocable license to use, reproduce, modify, adapt, publish, distribute, display, translate, create derivative works from, and otherwise exploit such User Content in connection with the operation, promotion, improvement, marketing, and development of the Platform, subject to applicable law and the Company's Privacy Policy.  8. The Company reserves the right, but not the obligation, to monitor, remove, restrict, edit, or refuse to publish any User Content that it reasonably believes violates these Terms, applicable law, or the rights of any person or entity.  9. If you believe that any Content available on the Platform infringes your intellectual property rights, you may notify the Company by providing sufficient information to enable the Company to investigate the claim. The Company may take such action as it considers appropriate in accordance with applicable law.  10. All rights not expressly granted under these Terms are reserved by the Company and its licensors.`
    },
    {
      title: "12. Third-Party Products & Services",
      content: `1. The Platform may offer, display, advertise, facilitate, or provide access to Products, Services, software, content, payment solutions, logistics services, installation services, financing options, warranty services, insurance, or other offerings supplied by independent third parties, including authorized Sellers, manufacturers, distributors, service providers, and business partners ("Third-Party Services").  2. Certain Products available on the Platform may be sold directly by the Company, while others may be offered by independent third-party Sellers through the Platform. The applicable Seller for a Product shall be identified on the relevant product page, order confirmation, invoice, or other transaction records, where applicable.  3. Where the Company acts solely as a technology platform or marketplace facilitator for Products or Services offered by independent third-party Sellers, the respective Seller shall remain responsible for fulfilling its legal and contractual obligations relating to such Products or Services, subject to applicable law.  4. The availability of any Third-Party Product or Service on the Platform does not constitute an endorsement, certification, recommendation, guarantee, or warranty by the Company regarding such Product, Service, Seller, manufacturer, or provider unless expressly stated otherwise.  5. Certain Third-Party Products or Services may be governed by additional terms, conditions, end-user license agreements, warranty terms, privacy policies, or other agreements issued by the respective third party. Users agree to comply with all such applicable terms when using or purchasing such Products or Services.  6. The Company makes reasonable efforts to partner with reputable Sellers and service providers. However, to the fullest extent permitted by applicable law, the Company shall not be responsible for the independent acts, omissions, representations, warranties, negligence, misconduct, delays, defaults, or failures of independent third-party Sellers, manufacturers, logistics providers, payment service providers, installation partners, warranty providers, financing partners, or other third parties.  7. Any disputes arising specifically between a User and an independent third-party Seller or service provider should, where appropriate, first be addressed with the relevant third party. The Company may, at its discretion, facilitate communication or assist in resolving such disputes but shall not be obligated to act as an arbitrator or assume liability beyond its obligations under applicable law.  8. Third-party websites, applications, software, advertisements, or external resources accessible through the Platform are provided solely for the User's convenience. The Company does not control such third-party resources and shall not be responsible for their availability, content, security, privacy practices, or performance.  9. Users acknowledge that the use of Third-Party Products and Services may involve the collection, processing, or sharing of information by such third parties in accordance with their respective privacy policies and applicable laws. The Company encourages Users to review the applicable third-party terms and privacy policies before using such Products or Services.  10. Nothing contained in this Section shall limit or exclude any rights or remedies available to Users under applicable consumer protection laws where the Company is legally responsible for a Product, Service, transaction.`
    },
    {
      title: "13. Communications & Notifications",
      content: `1. By creating an Account, placing an Order, or otherwise using the Platform, you consent to receive communications from the Company through electronic and other lawful means, including but not limited to email, SMS, telephone calls, in-app notifications, push notifications, messaging applications, and other communication channels associated with your Account or provided by you.  2. Such communications may include, without limitation:  o Account verification and authentication;  o Order confirmations, invoices, receipts, and transaction updates;  o Shipping and delivery notifications;  o Customer support communications;  o Security alerts and fraud prevention notifications;  o Service announcements and operational updates;  o Product recalls, safety notices, and compliance-related communications;  o Changes to these Terms, policies, or Platform features; and  o Marketing, promotional offers, newsletters, surveys, and other commercial communications, where permitted by applicable law.  3. Users are responsible for ensuring that their contact information, including email address, mobile number, and other communication details, remains accurate, current, and accessible at all times.  4. The Company shall not be responsible for any loss, delay, or inconvenience arising from a User's failure to maintain accurate contact information or from technical issues beyond the Company's reasonable control that prevent delivery of communications.  5. Electronic communications sent by the Company shall be deemed received:  o For emails, when transmitted to the User's registered email address;  o For SMS, messaging applications, or push notifications, when successfully transmitted to the User's registered device or account; and  o For notices published on the Platform, from the date of publication unless otherwise specified.  6. Users may opt out of receiving marketing or promotional communications at any time through the unsubscribe mechanism provided in such communications or through available Account settings, where applicable. However, Users acknowledge that they may continue to receive essential transactional, legal, security, regulatory, or service-related communications that are necessary for the operation of the Platform or the fulfillment of Orders.  7. Where required by applicable law, the Company shall obtain any necessary consent before sending promotional or marketing communications.  8. Users consent to the Company recording, monitoring, or retaining communications with customer support, including telephone calls, emails, chats, and other interactions, for quality assurance, training, dispute resolution, fraud prevention, legal compliance, security, and service improvement purposes, in accordance with applicable law and the Company's Privacy Policy.  9. Any notice intended for the Company under these Terms shall be sent through the official communication channels designated by the Company on the Platform, unless otherwise expressly specified.`
    },
    {
      title: "14. Privacy",
      content: `1. The Company is committed to protecting the privacy and personal information of its Users. The collection, use, storage, processing, disclosure, retention, transfer, and protection of personal information are governed by the Company's Privacy Policy, which forms an integral part of these Terms.  2. By accessing or using the Platform, creating an Account, placing an Order, or otherwise interacting with the Company, you acknowledge that you have read, understood, and agree to the Company's Privacy Policy and consent to the handling of your information in accordance with applicable law.  3. Users are responsible for ensuring that all personal information provided to the Company is accurate, complete, and up to date. The Company shall not be responsible for any consequences arising from inaccurate, incomplete, or outdated information provided by a User.  4. The Company implements reasonable technical, administrative, and organizational measures designed to safeguard personal information against unauthorized access, alteration, disclosure, misuse, loss, or destruction. However, no method of electronic transmission, storage, or processing is completely secure, and the Company cannot guarantee absolute security.  5. The Platform may integrate with or provide access to third-party products, services, payment gateways, logistics providers, analytics providers, authentication services, or other third-party systems. The collection or processing of information by such third parties shall be governed by their respective privacy policies and applicable legal requirements.  6. Users acknowledge that the Company may collect, process, retain, share, or disclose information where necessary to:  o Provide and improve the Platform;  o Process Orders and payments;  o Prevent fraud and enhance security;  o Verify identity and comply with Know Your Customer (KYC) or other regulatory obligations, where applicable;  o Comply with applicable laws, court orders, governmental requests, or regulatory requirements;  o Resolve disputes and enforce these Terms; and  o Protect the rights, property, safety, or legitimate interests of the Company, its Users, Sellers, partners, or third parties.  7. Nothing contained in these Terms shall limit any rights available to Users under applicable data protection or privacy laws.  8. In the event of any inconsistency between these Terms and the Company's Privacy Policy regarding the processing of personal information, the Privacy Policy shall prevail to the extent of such inconsistency.`
    },
    {
      title: "15. Indemnification",
      content: `1. You agree to defend, indemnify, and hold harmless Peoples League Of Electronics Private Limited, its affiliates, subsidiaries, directors, officers, employees, agents, representatives, successors, assigns, licensors, authorized partners, and service providers (collectively, the "Indemnified Parties") from and against any and all claims, actions, proceedings, demands, liabilities, damages, losses, penalties, fines, costs, and expenses, including reasonable legal fees and expenses, arising out of or relating to:  o Your breach or violation of these Terms or any other policy of the Company;  o Your misuse of the Platform, Products, or Services;  o Your violation of any applicable law, regulation, or governmental requirement;  o Your infringement or alleged infringement of the intellectual property, privacy, contractual, or other legal rights of any person or entity;  o Any false, inaccurate, misleading, or fraudulent information provided by you;  o Any negligent, reckless, unlawful, or intentional act or omission committed by you in connection with the Platform; or  o Any dispute arising between you and another User, Seller, manufacturer, service provider, or other third party, to the extent such dispute results from your acts or omissions.  2. The Company reserves the right, at its own expense, to assume the exclusive defense and control of any matter that is subject to indemnification under this Section. In such event, you agree to fully cooperate with the Company in the investigation, defense, and settlement of such claim.`
    }
  ];

  const activeSections = isB2BUser ? b2bSections : sections;

  const handleDownload = () => {
    const title = isB2BUser ? "BUSINESS TERMS & CONDITIONS (B2B) - Peoples League Of Electronics Private Limited" : "Terms & Conditions";
    const date = isB2BUser ? "Version: 1.0" : "Last updated: June 2026";
    const intro = isB2BUser
      ? "Welcome to the business-to-business (\"B2B\") platform operated by Peoples League Of Electronics Private Limited."
      : "Please read these Terms and Conditions carefully before utilizing our applications or placing orders on our store.";
    const content = activeSections.map((s) => `${s.title}\n${s.content}`).join("\n\n");
    const footer = isB2BUser
      ? "If you have questions about these Business Terms & Conditions, please contact our B2B legal desk at b2blegal@peoplesleagueofelectronics.com."
      : "If you have questions about these Terms, please reach out to our legal desk at legal@ple.com.";
    const fullText = `${title}\n${date}\n\n${intro}\n\n${content}\n\n${footer}`;

    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isB2BUser ? "B2B_Terms_And_Conditions.txt" : "Terms_Conditions.txt";
    link.click();
    URL.revokeObjectURL(url);
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
              >
                <FiArrowLeft className="text-xl text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                  <FiFileText className="text-[#7B0A0A]" /> {isB2BUser ? "Business Terms & Conditions (B2B)" : "Terms & Conditions"}
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  {isB2BUser ? "Peoples League Of Electronics Private Limited | Version 1.0" : "Last updated: June 2026"}
                </p>
              </div>
            </div>
            {isB2BUser ? (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-primary-700 transition-colors"
              >
                <FiDownload className="text-sm" />
                <span>Download</span>
              </button>
            ) : (
              isBusiness && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-primary-700 transition-colors"
                >
                  <FiDownload className="text-sm" />
                  <span>Download</span>
                </button>
              )
            )}
          </div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6"
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              {isB2BUser
                ? "Please read these Business Terms & Conditions (B2B) carefully before registering a business account, submitting quotations, or placing Purchase Orders on our B2B Platform."
                : "Please read these Terms and Conditions carefully before utilizing our applications or placing orders on our store."}
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
                  ? "If you have questions about these Business Terms & Conditions, please contact our B2B legal desk at b2blegal@peoplesleagueofelectronics.com."
                  : "If you have questions about these Terms, please reach out to our legal desk at legal@ple.com."}
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default TermsConditions;
