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

  const sections = isB2BUser ? [
    {
      title: "Chapter 1 – Introduction",
      content: `1.1 Purpose
This Business Return, Refund & Cancellation Policy ("Policy") establishes the terms and conditions governing the return, replacement, refund, credit, and cancellation of Products and Services purchased through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). This Policy is designed to ensure a transparent, fair, and commercially reasonable process for Business Users while protecting the legitimate interests of the Company, its suppliers, manufacturers, distributors, logistics partners, and other stakeholders.
The Policy seeks to:
• establish standardized procedures for product returns;
• define eligibility criteria for refunds and cancellations;
• outline the Return Merchandise Authorization ("RMA") process;
• clarify the responsibilities of the Company and Business Users;
• reduce operational disputes;
• protect against fraud and misuse;
• facilitate efficient reverse logistics; and
• ensure compliance with applicable laws and contractual obligations.

1.2 Scope
This Policy applies to all Business Users registered on the Company's B2B Platform and governs transactions involving:
• Products purchased through the Platform;
• procurement orders;
• Purchase Orders;
• quotations accepted by the Company;
• Corporate Wallet purchases;
• Employee Wallet purchases made on behalf of a Business User;
• business credit purchases;
• invoices issued by the Company;
• marketplace transactions where expressly applicable; and
• other commercial transactions specifically designated by the Company.

This Policy applies regardless of whether Products are supplied:
• directly by the Company;
• through authorized distributors;
• through manufacturers;
• through approved suppliers;
• through marketplace sellers authorized by the Company; or
• through other approved fulfillment partners.

1.3 Applicability
This Policy applies only to Business-to-Business (B2B) transactions. It does not apply to:
• retail consumer purchases governed by the Company's Consumer Return, Refund & Cancellation Policy;
• employee purchases made solely for personal consumption outside the Business Account;
• employment-related reimbursements;
• internal corporate procurement policies of Business Users; or
• transactions expressly governed by separate written commercial agreements.

Where a separate executed commercial agreement provides different return or refund terms, such agreement shall prevail to the extent of any inconsistency.

1.4 Definitions
For the purposes of this Policy:
Business User means any legally registered business entity approved to use the Company's B2B Platform.
Company means Peoples League Of Electronics Private Limited.
Product means any tangible good, equipment, hardware, accessory, component, software license, subscription, or other item made available through the Platform.
Service means any installation, support, consulting, maintenance, logistics, subscription, software, or related service offered by or through the Company.
Purchase Order (PO) means a confirmed order accepted by the Company.
Return Merchandise Authorization (RMA) means the authorization issued by the Company permitting the return of eligible Products.
Refund means repayment of amounts approved under this Policy.
Replacement means the substitution of an eligible Product with another Product approved by the Company or the applicable supplier.
Credit Note means a commercial document issued to offset future purchases where permitted.
Capitalized terms not defined in this Policy shall have the meanings assigned to them in the Business User Agreement or Business Terms & Conditions.

1.5 Relationship with Other Agreements
This Policy shall be read together with the following documents, as applicable:
• Business User Agreement;
• Business Terms & Conditions;
• Privacy Policy;
• Schedule A – Payment Terms;
• Schedule B – Credit Policy;
• Schedule C – Logistics & Delivery Standards;
• Schedule D – Product Acceptance Procedure;
• Schedule E – Return Merchandise Authorization (RMA) Process;
• Schedule F – Warranty Matrix;
• Schedule G – Data Processing Requirements;
• Schedule H – Compliance Requirements;
• Schedule I – Seller & Partner Obligations;
• Schedule J – Corporate Wallet & Fund Management Policy (where applicable); and
• any executed commercial agreement between the Parties.

In the event of any inconsistency, the order of precedence specified in the Business User Agreement shall apply.

1.6 Commercial Nature of Transactions
Business Users acknowledge that transactions conducted through the Platform are commercial in nature and are intended for business, industrial, institutional, governmental, educational, or professional purposes. Accordingly:
• return rights may differ from consumer transactions;
• statutory consumer protections applicable to retail consumers may not apply;
• commercial procurement practices shall govern where permitted by applicable law; and
• Business Users are expected to perform reasonable due diligence before placing Purchase Orders.

1.7 Policy Updates
The Company reserves the right to amend, revise, suspend, or replace this Policy where reasonably necessary for:
• legal compliance;
• regulatory changes;
• operational improvements;
• supplier requirements;
• technological developments;
• fraud prevention;
• security enhancements; or
• legitimate business purposes.

Material changes shall be communicated through the Platform, electronic communication, or other reasonable means. Continued use of the Platform following the effective date of such amendments constitutes acceptance of the updated Policy, except where applicable law requires express consent.

1.8 Interpretation
Unless the context otherwise requires:
• headings are provided for convenience only and shall not affect interpretation;
• references to the singular include the plural and vice versa;
• references to statutes include amendments and successor legislation;
• the words "including," "include," and similar expressions shall mean "including without limitation";
• references to "days" mean calendar days unless expressly stated otherwise; and
• references to electronic records include records recognized under applicable law.

1.9 Good Faith
The Company and Business Users shall implement and administer this Policy honestly, fairly, reasonably, and in good faith. The Parties shall cooperate in resolving return, refund, replacement, and cancellation requests efficiently while balancing commercial practicality, contractual obligations, and the legitimate interests of all stakeholders.

1.10 Compliance with Applicable Law
This Policy shall be interpreted and enforced in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930, where applicable;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023, where applicable;
• applicable Goods and Services Tax (GST) laws;
• other applicable commercial, tax, and regulatory laws of India; and
• any mandatory legal requirements applicable to the transaction.

Where any provision of this Policy conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 2 – Eligibility for Returns",
      content: `2.1 Purpose
This Chapter establishes the eligibility criteria, conditions, and limitations applicable to the return of Products purchased through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The purpose of this Chapter is to ensure that return requests are processed consistently, fairly, and in accordance with commercially accepted procurement practices, while protecting the interests of the Company, its suppliers, manufacturers, distributors, logistics partners, marketplace sellers, and Business Users.

2.2 Eligible Business Users
Only Business Users holding an active and verified Business Account may submit return requests under this Policy. The Company may require verification of:
• Business Account ownership;
• Purchase Order details;
• invoice information;
• delivery records;
• product serial numbers;
• authorized representative details; and
• any additional documentation reasonably required to process the request.

2.3 Eligible Products
Subject to this Policy, Products may be eligible for return where they are:
• delivered in a damaged condition;
• materially defective upon delivery;
• Dead on Arrival ("DOA"), where applicable;
• materially different from the accepted Purchase Order;
• delivered in incorrect quantities;
• supplied with incorrect specifications;
• supplied due to fulfillment errors attributable to the Company or its authorized fulfillment partner;
• covered by an applicable warranty or executed commercial agreement; or
• otherwise approved by the Company under exceptional commercial circumstances.

Eligibility for return shall remain subject to successful inspection and approval by the Company or the applicable supplier.

2.4 Return Window
Unless otherwise specified in:
• an executed commercial agreement;
• the applicable Purchase Order;
• the applicable warranty terms;
• a manufacturer's return policy; or
• applicable law,
Business Users shall submit a return request within the inspection or acceptance period specified in Schedule D – Product Acceptance Procedure. Warranty-related returns shall be governed by the applicable warranty terms and Schedule F – Warranty Matrix. Requests submitted after the applicable period may be rejected unless otherwise required by applicable law or expressly approved by the Company.

2.5 Conditions for Return
A Product shall generally be eligible for return only where:
• it has not been subjected to misuse, abuse, neglect, unauthorized repair, or improper installation;
• it remains substantially in the condition in which it was delivered, except to the extent necessary for reasonable inspection or testing;
• all original accessories, documentation, manuals, certificates, security labels, and packaging are included where reasonably available;
• product identification labels and serial numbers remain intact and legible;
• the Product has not been materially altered or modified without prior written authorization; and
• the return complies with this Policy and any applicable RMA instructions.

The Company reserves the right to reject any return that does not satisfy these conditions.

2.6 Inspection Requirement
All returned Products shall be subject to inspection by:
• the Company;
• the manufacturer;
• the authorized distributor;
• the authorized supplier;
• the marketplace seller, where applicable; or
• an authorized technical service provider.

Return approval, replacement, repair, refund, or issuance of a Credit Note shall remain subject to the outcome of such inspection. Submission of a return request or issuance of an RMA does not constitute acceptance of liability or approval of the requested remedy.

2.7 Partial Returns
Where a Purchase Order includes multiple Products, the Company may permit the return of only the affected Products. Acceptance of a partial return shall not automatically entitle the Business User to return the remaining Products unless those Products independently satisfy the requirements of this Policy.

2.8 Bulk and Commercial Orders
Bulk procurement orders, project-based procurements, institutional purchases, government contracts, and enterprise procurement transactions may be subject to:
• separate contractual terms;
• supplier-specific return conditions;
• manufacturer approval requirements;
• inspection protocols;
• acceptance certificates; or
• project completion milestones.

Where such requirements conflict with this Policy, the applicable executed commercial agreement or Purchase Order shall prevail.

2.9 Products Purchased Through Marketplace Sellers
Where Products are supplied by an approved marketplace seller through the Platform:
• return eligibility may additionally be governed by the seller's approved return policy;
• the Company may coordinate the return process on behalf of the seller;
• technical inspection may be conducted by the seller or manufacturer; and
• refund or replacement decisions may require confirmation from the seller, subject to this Policy and applicable law.

The Company shall use commercially reasonable efforts to facilitate communication between the Business User and the marketplace seller.

2.10 Proof of Purchase
To process a return request, the Business User shall provide, where applicable:
• the Purchase Order number;
• invoice number;
• delivery confirmation;
• Product serial number;
• photographs or videos of the Product and packaging, where reasonably requested;
• details of the defect or issue;
• inspection reports, where applicable; and
• any other supporting documentation reasonably required by the Company.

Failure to provide sufficient documentation may delay or result in the rejection of the return request.

2.11 Reservation of Rights
The Company reserves the right to:
• verify all return requests;
• conduct technical inspections;
• request additional documentation;
• reject fraudulent or abusive claims;
• deny returns that fail to satisfy this Policy;
• require compliance with the applicable RMA procedure; and
• exercise any other rights available under this Agreement or applicable law.

The exercise of these rights shall not relieve the Company of any obligations imposed by applicable law.

2.12 Good Faith
The Company and the Business User shall act honestly, reasonably, and in good faith when submitting, reviewing, investigating, and resolving return requests. The Parties shall cooperate by providing accurate information, timely documentation, and reasonable assistance to facilitate the efficient resolution of eligible return requests.

2.13 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930, where applicable;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023, where applicable;
• applicable Goods and Services Tax (GST) laws; and
• all other applicable commercial and regulatory laws of India.

Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 3 – Return Merchandise Authorization (RMA)",
      content: `3.1 Purpose
This Chapter establishes the mandatory Return Merchandise Authorization ("RMA") process governing the return of eligible Products purchased through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The RMA process is intended to:
• ensure efficient handling of return requests;
• facilitate technical assessment and inspection;
• maintain traceability of returned Products;
• protect the interests of Business Users, suppliers, manufacturers, distributors, and logistics partners;
• minimize operational disruption; and
• prevent fraudulent, duplicate, or unauthorized returns.

Except where prohibited by applicable law or expressly agreed otherwise in writing, no Product shall be returned without a valid RMA issued by the Company.

3.2 Mandatory RMA Requirement
Business Users shall obtain an approved RMA before returning any eligible Product. Returns submitted without a valid RMA may be:
• refused upon delivery;
• returned to the sender at the sender's expense;
• held pending verification;
• subject to additional inspection charges where applicable; or
• otherwise processed in accordance with this Policy and applicable law.

Issuance of an RMA does not constitute acceptance of liability, approval of a refund, or confirmation that the returned Product satisfies the eligibility requirements of this Policy.

3.3 Submission of RMA Request
An RMA request shall be submitted through one or more of the Company's approved communication channels, including:
• the Business User dashboard;
• the Company's B2B Platform;
• designated customer support channels;
• procurement support;
• authorized account managers; or
• any other communication channel designated by the Company.

The Business User shall submit the request within the applicable return, inspection, or warranty period.

3.4 Required Information
An RMA request shall include, where applicable:
• Business Account details;
• Purchase Order number;
• invoice number;
• Product name;
• Product model;
• Product serial number;
• quantity involved;
• delivery date;
• description of the issue;
• photographs or videos demonstrating the reported condition;
• installation details, where applicable;
• diagnostic reports, where applicable;
• warranty information, where applicable; and
• any additional documentation reasonably requested by the Company.

Incomplete requests may delay processing until the required information has been provided.

3.5 Initial Technical Assessment
Upon receipt of an RMA request, the Company or its authorized representative may conduct a preliminary assessment to determine:
• whether the Product appears eligible for return;
• whether remote troubleshooting may resolve the issue;
• whether additional technical information is required;
• whether manufacturer support should be engaged;
• whether on-site inspection is appropriate; or
• whether the request should proceed to formal RMA approval.

The Company may request additional testing or diagnostic information before making a determination.

3.6 RMA Approval or Rejection
Following review of the submitted information, the Company may:
• approve the RMA request;
• approve the request subject to specific conditions;
• request additional information;
• refer the matter to the manufacturer or supplier;
• recommend warranty service instead of return;
• recommend repair instead of replacement; or
• reject the request where the Product is not eligible under this Policy.

The Company shall provide commercially reasonable reasons for rejection where appropriate.

3.7 Issuance of RMA Number
Where an RMA request is approved, the Company shall issue a unique RMA reference number. The RMA shall specify, where applicable:
• Products authorized for return;
• approved quantities;
• designated return location;
• packaging instructions;
• shipping instructions;
• validity period;
• documentation requirements; and
• any additional return conditions.

The Business User shall clearly reference the assigned RMA number on all related communications, shipping documentation, and package labels.

3.8 Validity of RMA
Unless otherwise specified by the Company, an approved RMA shall remain valid for the period stated in the RMA authorization. If the Product is not shipped within the validity period:
• the RMA may expire automatically;
• a new RMA request may be required; and
• eligibility for return shall be reassessed based on the circumstances at that time.

3.9 Packaging Requirements
The Business User shall package returned Products in a manner reasonably sufficient to protect them during transportation. Where applicable, returned Products shall include:
• original packaging;
• accessories;
• manuals;
• cables;
• warranty documentation;
• licenses;
• security seals, where reasonably available; and
• any components specifically identified in the RMA.

Products inadequately packaged may be rejected or may affect eligibility for refund, replacement, or repair where damage occurs during transit due to improper packaging.

3.10 Shipping Instructions
Returned Products shall be shipped only to the location specified in the approved RMA. The Company may specify:
• approved logistics partners;
• shipping methods;
• insurance requirements;
• documentation requirements;
• customs documentation for cross-border returns;
• freight terms; and
• delivery instructions.

Failure to follow the prescribed shipping instructions may delay or invalidate the RMA process.

3.11 Receipt and Inspection
Upon receipt of the returned Product, the Company, manufacturer, supplier, distributor, marketplace seller, or authorized service provider may conduct:
• physical inspection;
• serial number verification;
• functional testing;
• warranty verification;
• tamper inspection;
• diagnostic testing; and
• any other reasonable technical evaluation necessary to determine the appropriate resolution.

The outcome of such inspection shall determine whether the Product qualifies for repair, replacement, refund, Credit Note, or rejection under this Policy.

3.12 Closure of RMA
An RMA shall be deemed closed upon the earliest of:
• completion of repair;
• dispatch of a replacement Product;
• issuance of a refund;
• issuance of a Credit Note;
• rejection of the return following inspection;
• return of the Product to the Business User; or
• withdrawal of the RMA request by the Business User.

The Company shall retain appropriate records of completed RMA cases in accordance with its record retention policies and applicable law.

3.13 Fraud Prevention
The Company reserves the right to reject or investigate any RMA request involving:
• altered or missing serial numbers;
• counterfeit Products;
• unauthorized modifications;
• repeated abusive return patterns;
• false or misleading information;
• duplicate claims;
• intentional damage;
• substitution of Products; or
• any other suspected fraudulent activity.

Where fraud is reasonably suspected, the Company may suspend processing, conduct further investigations, notify relevant authorities where legally required, and exercise any rights available under this Agreement or applicable law.

3.14 Good Faith
The Company and the Business User shall participate in the RMA process honestly, accurately, and in good faith. Each Party shall provide timely information, cooperate in technical assessments, and take reasonable steps to facilitate the efficient resolution of eligible return requests while safeguarding the integrity of the RMA process.

3.15 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930, where applicable;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023, where applicable;
• applicable Goods and Services Tax (GST) laws; and
• all other applicable commercial and regulatory laws of India.

Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 4 – Product Inspection & Acceptance",
      content: `4.1 Purpose
This Chapter establishes the procedures governing the inspection, verification, acceptance, rejection, and reporting of Products delivered through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The objective of this Chapter is to ensure that Products supplied under Purchase Orders are promptly inspected, verified against contractual requirements, and accepted or rejected in accordance with commercially reasonable procurement practices. This Chapter shall be read together with Schedule D – Product Acceptance Procedure, Schedule E – Return Merchandise Authorization (RMA) Process, and the applicable Purchase Order.

4.2 Inspection upon Delivery
Immediately upon delivery, the Business User shall conduct a reasonable inspection of the delivered Products to verify:
• package integrity;
• quantity delivered;
• Product model and specifications;
• serial numbers, where applicable;
• visible physical damage;
• accessories and included components;
• accompanying documentation;
• compliance with the Purchase Order; and
• any apparent defects.

Inspection shall be performed before the Products are installed, deployed, modified, or placed into commercial use, where reasonably practicable.

4.3 Inspection Period
The Business User shall complete its inspection within the inspection period specified in:
• the applicable Purchase Order;
• the executed commercial agreement;
• Schedule D – Product Acceptance Procedure; or
• another period expressly agreed by the Parties.

Where no inspection period is specified, inspection shall be completed within a commercially reasonable time after delivery, taking into account the nature, complexity, and intended use of the Products.

4.4 Acceptance Criteria
A Product shall generally be deemed acceptable where it:
• conforms to the accepted Purchase Order;
• matches the agreed specifications;
• is free from visible shipping damage;
• includes all required accessories and documentation;
• bears accurate identification and serial numbers where applicable;
• successfully passes any agreed inspection or functional testing; and
• complies with the applicable contractual requirements.

Acceptance of a Product does not waive any warranty rights that arise after acceptance.

4.5 Inspection for Damage
If the Business User identifies:
• damaged packaging;
• physical damage;
• water exposure;
• broken components;
• missing items;
• evidence of tampering; or
• other visible defects,
the Business User shall:
• document the condition with photographs or videos where reasonably possible;
• retain all original packaging until instructed otherwise;
• notify the Company promptly;
• avoid unnecessary use of the Product where continued operation may worsen the condition; and
• cooperate with any inspection requested by the Company or the applicable supplier.

4.6 Incorrect or Non-Conforming Deliveries
Where the delivered Products:
• differ from the accepted Purchase Order;
• contain incorrect models;
• contain incorrect specifications;
• contain incorrect quantities;
• include unauthorized substitutions; or
• otherwise fail to conform to the contractual requirements,
the Business User shall promptly notify the Company and provide reasonable supporting documentation. The Company may, subject to verification:
• replace the affected Products;
• arrange collection of incorrectly supplied Products;
• issue revised documentation;
• issue a Credit Note;
• process a refund where applicable; or
• provide another commercially reasonable remedy.

4.7 Functional Testing
Where Products require installation, commissioning, activation, or configuration before functionality can reasonably be assessed, the Business User may conduct functional testing in accordance with:
• manufacturer instructions;
• Company guidance;
• applicable technical documentation; or
• the executed commercial agreement.

Reasonable testing performed solely to verify conformity shall not, by itself, disqualify an otherwise eligible return under this Policy.

4.8 Acceptance by Use
Unless otherwise agreed in writing or prohibited by applicable law, a Product may be deemed accepted where the Business User:
• confirms acceptance in writing;
• installs or deploys the Product into operational use beyond reasonable inspection or testing;
• resells the Product;
• materially modifies the Product;
• incorporates the Product into another system;
• fails to report any non-conformity within the applicable inspection period; or
• otherwise demonstrates acceptance through its conduct.

Acceptance shall not affect any rights arising under an applicable warranty for latent defects.

4.9 Rejection Procedure
Where a Product fails inspection, the Business User shall:
• notify the Company promptly;
• submit an RMA request where required;
• provide supporting documentation;
• preserve the Product in substantially the condition in which it was delivered, except for reasonable inspection or testing; and
• comply with any instructions provided by the Company regarding storage, packaging, or return.

The Company may conduct further investigation before determining the appropriate remedy.

4.10 Technical Evaluation
The Company, manufacturer, supplier, distributor, marketplace seller, or authorized service provider may perform technical evaluation to determine:
• the reported defect;
• the cause of failure;
• whether the Product conforms to specifications;
• whether damage occurred during transit;
• whether misuse or unauthorized modification occurred;
• warranty eligibility; and
• the appropriate corrective action.

The findings of such evaluation shall form the basis for any repair, replacement, refund, Credit Note, or rejection, subject to applicable law.

4.11 Resolution Following Inspection
Following inspection and evaluation, the Company may, where appropriate:
• accept the return;
• repair the Product;
• replace the Product;
• provide an equivalent Product;
• issue a Credit Note;
• issue a refund in accordance with this Policy;
• return the Product to the Business User with an explanation of the findings; or
• take any other commercially reasonable action permitted under this Agreement.

The selected remedy shall be determined based on the nature of the issue, applicable warranty terms, supplier obligations, and the circumstances of the transaction.

4.12 Inspection Records
The Company may maintain records relating to inspections, including:
• inspection reports;
• photographs;
• diagnostic results;
• serial number verification;
• technical findings;
• correspondence;
• delivery records; and
• any other information reasonably necessary for quality assurance, dispute resolution, regulatory compliance, or legal purposes.

Such records shall be retained in accordance with the Company's record retention policies and applicable law.

4.13 Good Faith
The Company and the Business User shall conduct inspections, evaluations, and acceptance procedures honestly, fairly, and in good faith. Each Party shall provide accurate information, preserve relevant evidence, and cooperate reasonably to facilitate the prompt and equitable resolution of inspection-related issues.

4.14 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930, where applicable;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023, where applicable;
• applicable Goods and Services Tax (GST) laws; and
• all other applicable commercial and regulatory laws of India.

Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 5 – Non-Returnable Products",
      content: `5.1 Purpose
This Chapter identifies the categories of Products that are generally ineligible for return, refund, replacement, or cancellation under this Business Return, Refund & Cancellation Policy. The purpose of this Chapter is to provide clarity regarding Products that, due to their nature, customization, licensing, commercial value, regulatory restrictions, hygiene considerations, or supplier limitations, cannot ordinarily be returned after acceptance or delivery. Nothing in this Chapter shall limit any rights that cannot lawfully be excluded under applicable law or any obligations expressly assumed by the Company under a separate written agreement.

5.2 General Rule
Unless otherwise expressly approved in writing by the Company or required by applicable law, Products falling within the categories specified in this Chapter shall not be eligible for:
• return;
• refund;
• replacement;
• exchange;
• cancellation after acceptance;
• Credit Notes; or
• any other commercial remedy based solely on buyer preference or change in business requirements.

5.3 Customized and Special Procurement Products
The following Products are generally non-returnable:
• custom-built systems;
• configured hardware;
• build-to-order Products;
• specially imported Products;
• Products manufactured specifically for the Business User;
• customized branding;
• engraved or serialized Products prepared specifically for the Business User;
• project-specific procurements; and
• any Product procured exclusively based upon the Business User's specifications.

Returns may only be accepted where:
• the Product contains a verified manufacturing defect;
• the Company supplied an incorrect Product;
• the Product materially differs from the agreed specifications; or
• applicable law requires otherwise.

5.4 Software and Digital Products
Unless otherwise provided by applicable law or the applicable license agreement, the following are non-returnable once delivered, activated, downloaded, registered, or accessed:
• software licenses;
• activation keys;
• digital subscriptions;
• cloud services;
• downloadable software;
• firmware licenses;
• SaaS subscriptions;
• electronic certificates;
• digital documentation;
• API subscriptions; and
• other electronically delivered Products or Services.

Where activation has not occurred and cancellation is commercially feasible, the Company may, at its sole discretion, permit cancellation subject to supplier approval.

5.5 Opened Consumables
Unless defective at the time of delivery, the following are generally non-returnable once opened, installed, or used:
• batteries;
• printer consumables;
• ink cartridges;
• toner cartridges;
• storage media;
• cleaning materials;
• maintenance kits;
• cables sold for single-use applications;
• adhesives; and
• other consumable Products designated by the Company or manufacturer.

5.6 Hygiene and Safety Products
Where applicable, Products intended for hygienic, medical, safety, or personal protective use shall not be eligible for return after their sealed packaging has been opened, except where:
• the Product is defective;
• the incorrect Product was supplied;
• applicable law requires otherwise; or
• the Company expressly approves the return.

5.7 Products Damaged After Delivery
The Company shall not accept returns where damage results from:
• improper installation;
• misuse;
• abuse;
• negligence;
• unauthorized repair;
• improper maintenance;
• unauthorized modification;
• accident;
• environmental exposure;
• power fluctuations;
• natural disasters;
• improper storage; or
• failure to follow manufacturer instructions.

Such Products may remain eligible for paid repair services where available.

5.8 Products with Missing Identification
Products may be rejected where:
• serial numbers have been removed;
• warranty seals have been broken without authorization;
• security labels have been altered;
• Product identification has been intentionally obscured;
• manufacturer labels are missing; or
• Product authenticity cannot reasonably be verified.

This provision shall not apply where the alteration was caused by the Company, manufacturer, or an authorized service provider.

5.9 Clearance, Liquidation, and End-of-Life Products
Unless otherwise stated in writing, Products sold as:
• clearance stock;
• liquidation inventory;
• end-of-life Products;
• discontinued Products;
• refurbished Products sold on an "as-is" basis; or
• specially discounted inventory,
are generally non-returnable except where:
• the Product is Dead on Arrival (DOA);
• the Product contains a verified manufacturing defect;
• the Company supplied an incorrect Product; or
• applicable law requires otherwise.

5.10 Third-Party Marketplace Products
Products supplied by third-party marketplace sellers may be subject to additional non-returnable conditions imposed by:
• manufacturers;
• distributors;
• suppliers; or
• marketplace sellers,
provided such conditions:
• are disclosed before purchase where reasonably practicable;
• do not conflict with mandatory legal requirements; and
• do not override any express contractual obligations assumed by the Company.

5.11 Services Already Performed
The following Services are generally non-refundable after commencement or completion:
• installation services;
• on-site support;
• commissioning;
• consulting;
• professional services;
• implementation services;
• technical inspections;
• training services;
• configuration services; and
• other Services that have already been substantially performed.

Where Services are not performed in accordance with contractual obligations, the Company may provide commercially reasonable corrective measures.

5.12 Exceptional Commercial Approval
Notwithstanding this Chapter, the Company may, at its sole discretion and without creating any precedent, approve a return, replacement, Credit Note, or refund where exceptional commercial circumstances justify such action. Such approval shall not modify this Policy or establish any continuing obligation to grant similar exceptions in future transactions.

5.13 Good Faith
The Company and the Business User shall interpret and apply the non-returnable provisions of this Chapter honestly, fairly, and in good faith. The Parties shall cooperate to determine whether a Product genuinely falls within a non-returnable category and whether any contractual, warranty, or statutory exception applies.

5.14 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930, where applicable;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023, where applicable;
• applicable Goods and Services Tax (GST) laws;
• applicable Intellectual Property laws; and
• all other applicable commercial and regulatory laws of India.

Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 6 – Refund Policy",
      content: `6.1 Purpose
This Chapter establishes the terms, conditions, procedures, and limitations governing refunds arising from Business-to-Business ("B2B") transactions conducted through the Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The purpose of this Chapter is to ensure that refunds are processed fairly, transparently, and in accordance with commercially accepted procurement practices, while protecting the legitimate interests of the Company, Business Users, suppliers, manufacturers, distributors, marketplace sellers, payment service providers, and other stakeholders. Refunds are not automatic and shall be subject to the eligibility requirements, verification procedures, and approval process set forth in this Policy, the Business User Agreement, the Business Terms & Conditions, and any applicable commercial agreement.

6.2 Refund Eligibility
A refund may be considered where:
• the Product qualifies for return under this Policy;
• the Company is unable to repair or replace an eligible Product within a commercially reasonable period;
• the incorrect Product was supplied and replacement is not commercially feasible;
• the ordered Product becomes permanently unavailable before fulfillment;
• duplicate payment has been successfully verified;
• excess payment has been received due to administrative error;
• the Company cancels the order prior to shipment without providing an acceptable alternative;
• a refund is expressly required under an executed commercial agreement; or
• applicable law requires a refund.

Refund eligibility shall always remain subject to verification, inspection, and approval by the Company.

6.3 Non-Refundable Transactions
Unless otherwise required by applicable law or expressly agreed in writing, refunds shall generally not be available for:
• Products classified as non-returnable under this Policy;
• completed installation or implementation services;
• professional consulting services already rendered;
• software licenses that have been activated or delivered electronically;
• cloud subscriptions already provisioned;
• customized or special-order Products;
• Products damaged due to misuse or unauthorized modification;
• Products rejected after inspection for non-eligible reasons; or
• cancellation requests made after Products have been accepted, except as otherwise provided in this Policy.

6.4 Refund Approval Process
All refund requests shall undergo an internal review, which may include:
• verification of the Purchase Order;
• invoice verification;
• payment confirmation;
• inspection of returned Products;
• technical evaluation;
• warranty assessment;
• supplier or manufacturer consultation, where applicable;
• fraud prevention review; and
• approval by the Company's authorized personnel.

Submission of a refund request does not constitute approval of the refund. The Company reserves the right to request additional information or documentation reasonably necessary to complete its review.

6.5 Refund Methods
Approved refunds may be issued through one or more of the following methods, as determined by the Company or as agreed with the Business User:
• reversal to the original payment method;
• bank transfer to the verified Business User account;
• Credit Note;
• Corporate Wallet credit;
• adjustment against outstanding invoices;
• adjustment against future Purchase Orders; or
• any other commercially agreed settlement method.

The refund method may depend upon:
• the original payment method;
• banking regulations;
• supplier arrangements;
• tax requirements;
• commercial agreements; and
• applicable law.

6.6 Credit Notes
Instead of a monetary refund, the Company may issue a Credit Note where:
• agreed by the Business User;
• permitted under the applicable Purchase Order;
• provided in an executed commercial agreement;
• commercially appropriate; or
• permitted by applicable tax laws.

Credit Notes:
• may be applied against future eligible purchases;
• shall not constitute legal tender;
• shall not accrue interest unless required by law or agreed in writing; and
• shall remain subject to any validity period stated therein, where legally permissible.

6.7 Corporate Wallet Refunds
Where a purchase was made using the Corporate Wallet, the Company may refund the approved amount to:
• the originating Corporate Wallet;
• the Business User's designated bank account;
• a Credit Note; or
• another approved refund method.

Refunds credited to the Corporate Wallet shall remain subject to the Company's Corporate Wallet policies and applicable law.

6.8 Employee Wallet Refunds
Where a purchase was made using an Employee Wallet, refunds shall be processed in accordance with the source of funds used for the transaction. Where the purchase utilized:
• Company-allocated funds, the refund may be credited to the Corporate Wallet or otherwise directed by the Business Administrator; or
• employee-funded personal balances, the refund may be returned to the Employee Wallet or another approved payment method, subject to Company policies and applicable law.

The Company reserves the right to verify the source of funds before processing such refunds.

6.9 Refund Processing Time
Following approval, the Company shall use commercially reasonable efforts to process refunds within a reasonable period. Actual receipt of refunded amounts may depend upon:
• banking systems;
• payment gateway processing;
• financial institution procedures;
• supplier settlements;
• government holidays;
• regulatory requirements; and
• circumstances beyond the Company's reasonable control.

The Company shall not be liable for delays attributable solely to third-party financial institutions or payment processors.

6.10 Taxes
Refunds involving taxes shall be processed in accordance with:
• applicable Goods and Services Tax (GST) laws;
• invoicing requirements;
• credit note regulations;
• tax adjustment procedures; and
• other applicable tax laws.

The Company may deduct or adjust taxes where required by law or regulatory authority. Business Users remain responsible for their own accounting and tax reporting obligations.

6.11 Partial Refunds
Where only a portion of an order qualifies for refund, the Company may issue a partial refund corresponding to:
• the affected Products;
• approved quantities;
• verified shortages;
• verified defects; or
• other approved adjustments.

Shipping charges, installation fees, taxes, or other service charges may be adjusted separately depending on the circumstances of the transaction.

6.12 Set-Off Rights
To the extent permitted by applicable law and any executed commercial agreement, the Company may set off an approved refund against:
• outstanding invoices;
• overdue payment obligations;
• unpaid service charges;
• authorized deductions; or
• other lawful amounts owed by the Business User to the Company.

The Company shall provide reasonable details of any such adjustment upon request.

6.13 Fraud Prevention
The Company reserves the right to suspend, reject, or investigate any refund request involving:
• suspected fraud;
• duplicate claims;
• forged documentation;
• payment irregularities;
• unauthorized account access;
• altered Products;
• counterfeit Products;
• intentional misuse of this Policy; or
• any activity reasonably believed to violate this Agreement or applicable law.

Where fraud is reasonably suspected, the Company may report the matter to competent authorities where legally required.

6.14 Good Faith
The Company and the Business User shall submit, review, process, and resolve refund requests honestly, fairly, and in good faith. Each Party shall provide accurate information, cooperate in verification procedures, and avoid conduct intended to improperly obtain or deny refunds.

6.15 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930, where applicable;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023, where applicable;
• applicable Goods and Services Tax (GST) laws;
• the Reserve Bank of India (RBI) regulations governing payment processing, where applicable; and
• all other applicable commercial and regulatory laws of India.

Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 7 – Cancellation Policy",
      content: `7.1 Purpose
This Chapter establishes the terms, conditions, procedures, and limitations governing the cancellation of Purchase Orders, Products, and Services under the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The purpose of this Chapter is to balance the legitimate commercial interests of the Company, Business Users, suppliers, manufacturers, distributors, logistics partners, and marketplace sellers while providing a transparent and commercially reasonable cancellation process. Cancellation requests shall be subject to this Policy, the Business User Agreement, the Business Terms & Conditions, applicable Purchase Orders, executed commercial agreements, and applicable law.

7.2 Scope
This Chapter applies to the cancellation of:
• Purchase Orders;
• quotations accepted by the Company;
• Products;
• Services;
• subscription services;
• project procurements;
• Corporate Wallet purchases;
• Employee Wallet purchases made on behalf of a Business User; and
• other commercial transactions processed through the Platform.

Cancellation rights may vary depending upon the stage of procurement, fulfillment, shipment, installation, or service delivery.

7.3 Cancellation Before Order Acceptance
A Business User may request cancellation of a Purchase Order before it has been formally accepted or confirmed by the Company. Where the Company has not yet accepted the Purchase Order or committed resources toward fulfillment, the cancellation request shall ordinarily be approved without cancellation charges.`
    }
  ] : [
    {
      title: "1. Introduction",
      content: `Welcome to Peoples League Of Electronics Private Limited ("Company", "PLE", "we", "our", or "us"). This Return, Refund & Cancellation Policy ("Policy") explains the circumstances under which Customers may request the return, replacement, exchange, refund, or cancellation of Products purchased through the Company's consumer-facing website, mobile application, or other official digital platforms (collectively, the "Platform"). The Company is committed to providing a transparent, fair, and efficient post-purchase experience while ensuring compliance with applicable consumer protection laws and maintaining the integrity of its marketplace. This Policy forms an integral part of the Company's legal framework and should be read together with the: • Terms and Conditions; • User Agreement; • Privacy Policy; • Shipping & Delivery Policy; • Warranty Policy; and • any other policies published by the Company from time to time. By purchasing Products through the Platform, Customers acknowledge that they have read, understood, and agree to be bound by this Policy.

A. Purpose
The purpose of this Policy is to establish clear procedures governing: • Product returns; • Refund requests; • Product replacements; • Product exchanges; • Order cancellations; and • the rights and responsibilities of Customers and the Company in relation to such requests. This Policy seeks to ensure that eligible requests are handled in a fair, transparent, and consistent manner while balancing the interests of Customers, independent Sellers, Suppliers, Manufacturers, and the Company.

B. Consumer Marketplace
The Platform operates as a consumer marketplace through which Products may be: • sold directly by the Company; • supplied through authorized Suppliers or Manufacturers; or • sold by independent third-party Sellers. Depending upon the Product purchased, fulfilment, delivery, warranty support, return processing, and refund administration may involve the Company, the applicable Seller, Supplier, Manufacturer, Logistics Partner, or another authorized service provider. Where reasonably practicable, the Company will coordinate and facilitate communication among the relevant parties to assist Customers throughout the return, refund, replacement, exchange, or cancellation process. Nothing in this Policy shall be interpreted as making the Company the manufacturer or seller of every Product listed on the Platform.

C. Consumer Purchases Only
This Policy applies exclusively to purchases made by individual consumers for personal, domestic, or household use through the Company's consumer platform. Commercial, wholesale, reseller, institutional, enterprise, government, or other business purchases are not governed by this Policy and shall instead be subject to separate contractual arrangements and policies applicable to business customers.

D. Good Faith
The Company expects all Customers to use this Policy honestly and in good faith. Likewise, the Company is committed to handling eligible requests fairly, impartially, and within a reasonable timeframe, subject to verification, applicable law, and the operational requirements of the relevant Seller, Supplier, Manufacturer, Logistics Partner, payment service provider, or other authorized party.

E. Statutory Rights
Nothing contained in this Policy shall: • exclude or limit any mandatory rights available to Customers under applicable law; • prevent the Company or an independent Seller from offering more favourable return or refund terms; • affect any statutory warranties or legal guarantees applicable to Products; or • limit any other legal remedies available to Customers under applicable law. Where any provision of this Policy conflicts with mandatory legal requirements, the applicable law shall prevail to the extent of such conflict.`
    },
    {
      title: "2. Definitions",
      content: `For the purposes of this Policy, unless the context otherwise requires:
"Account" means a registered customer account created on the Platform.
"Business Day" means any day on which commercial banks are ordinarily open for business in the jurisdiction where the Company operates, excluding public holidays.
"Cancellation" means the withdrawal or termination of an Order before its successful completion in accordance with this Policy.
"Company", "PLE", "we", "our", or "us" means Peoples League Of Electronics Private Limited, together with its successors and permitted assigns.
"Customer" means an individual consumer purchasing Products through the Platform for personal, domestic, or household use.
"Exchange" means the replacement of an eligible Product with another Product of the same or similar specification in accordance with this Policy.
"Force Majeure Event" means an event beyond the reasonable control of the affected party that materially prevents or delays performance of its obligations.
"Logistics Partner" means any third-party courier, shipping company, freight carrier, or delivery service engaged for transportation of Products.
"Manufacturer" means the original manufacturer or brand owner of a Product.
"Order" means a request submitted by a Customer through the Platform for the purchase of one or more Products.
"Platform" means the Company's website, mobile application, and any other official online services through which Products are offered for sale.
"Product" means any physical or digital item offered for sale through the Platform.
"Refund" means repayment of an eligible amount to the Customer following approval of a return, cancellation, or other eligible request under this Policy.
"Replacement" means the supply of another Product in place of an eligible Product that is defective, damaged, incorrect, or otherwise qualifies for replacement.
"Return" means the process by which an eligible Product is sent back to the Company, Seller, Supplier, or another authorized return location in accordance with this Policy.
"Seller" means an independent third-party merchant authorized to sell Products through the Platform.
"Supplier" means an authorized distributor, wholesaler, or supplier responsible for providing Products to the Company or fulfilling Orders through the Platform.
"Warranty" means the applicable manufacturer, seller, or Company warranty governing repair, replacement, or other warranty services for a Product.`
    },
    {
      title: "3. Scope",
      content: `This Return, Refund & Cancellation Policy ("Policy") applies exclusively to eligible purchases made by individual consumers through the consumer-facing Platform operated by Peoples League Of Electronics Private Limited ("PLE"). This Policy governs the circumstances under which Customers may request the return, replacement, exchange, refund, or cancellation of eligible Products purchased through the Platform. The availability of any return, refund, replacement, exchange, or cancellation shall always remain subject to this Policy, the applicable Product listing, the Company's Terms and Conditions, User Agreement, Warranty Policy, Shipping & Delivery Policy, and applicable law.

A. Transactions Covered
This Policy applies to eligible consumer purchases made through the Company's official Platform, including Products: • sold directly by the Company; • sold by authorized independent Sellers through the Platform; • supplied by authorized Suppliers; • fulfilled by Manufacturers where applicable; or • delivered through authorized Logistics Partners engaged by the Company or the applicable Seller. Regardless of the fulfilment model, Customers may submit eligible requests through the Platform in accordance with this Policy.

B. Marketplace Products
The Platform may display Products offered by independent third-party Sellers. For such Products: • the applicable Seller remains responsible for fulfilling its legal obligations relating to the Product; • the Company may facilitate customer support, communication, return coordination, refund processing, dispute resolution, and other marketplace services; • the availability of returns, refunds, exchanges, or replacements may depend upon the applicable Product listing and this Policy; and • Customers shall ordinarily submit their requests through the Platform unless otherwise instructed. Nothing contained in this Policy shall be interpreted as making the Company the seller or manufacturer of every Product available through the Platform.

C. Product Categories
This Policy applies to eligible consumer Products offered through the Platform, including but not limited to: • Mobile Phones; • Laptops and Computers; • Tablets; • Consumer Electronics; • Home Appliances; • Smart Devices; • Audio and Video Equipment; • Computer Accessories; • Networking Products; • Security and Surveillance Products; • Office Electronics; • Gaming Products; • Wearable Devices; and • other consumer Products made available on the Platform. Certain Product categories may have additional return conditions or restrictions, which shall be clearly communicated on the relevant Product page or during the checkout process.

D. Services Not Covered
Unless expressly stated otherwise, this Policy does not apply to: • installation services; • repair services performed after delivery; • maintenance services; • extended warranty services governed by separate terms; • third-party services purchased independently of the Platform; • insurance services; • subscription services governed by separate terms; or • any transaction not completed through the Company's official Platform. Warranty-related matters shall be governed separately under the Company's Warranty Policy and, where applicable, the relevant manufacturer's warranty.

E. Territorial Scope
This Policy applies to eligible consumer purchases delivered within the territories where the Company officially offers Products and services. Products delivered outside such territories may be subject to additional legal, customs, taxation, import, export, or regulatory requirements, which shall apply in addition to this Policy where relevant.

F. Product-Specific Conditions
Certain Products may be subject to additional conditions relating to: • return eligibility; • cancellation; • exchange; • replacement; • inspection requirements; • packaging requirements; or • refund eligibility. Such conditions shall be disclosed in the applicable Product listing, checkout process, or accompanying documentation. Where a Product-specific condition conflicts with this Policy, the Product-specific condition shall prevail only to the extent of that specific Product, unless prohibited by applicable law.

G. Consumer Rights
Nothing contained in this Policy shall: • exclude, restrict, or limit any statutory rights available to Customers under applicable law; • prevent the Company or an independent Seller from voluntarily providing more favourable return or refund rights; • affect any applicable legal warranties or guarantees; or • prevent Customers from exercising any other remedies available under applicable law.

H. Interpretation
This Policy shall be interpreted in a manner that: • promotes transparency and fairness; • protects the legitimate interests of Customers; • supports efficient marketplace operations; • recognises the respective responsibilities of the Company, Sellers, Suppliers, Manufacturers, and Logistics Partners; and • complies with applicable consumer protection laws. Where any provision of this Policy is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect to the maximum extent permitted by law. This section should be read together with the provisions relating to Return Eligibility, Non-Returnable Products, Return Request Procedure, Refund Policy, and the Company's Terms and Conditions.`
    },
    {
      title: "4. Return Eligibility",
      content: `The Company strives to ensure that Customers receive Products that meet the expected standards of quality and condition. Subject to this Policy, eligible Customers may request the return of certain Products where the applicable return conditions are satisfied. Approval of a return request shall be subject to verification by the Company, the applicable Seller, Supplier, Manufacturer, or any authorized service provider, as applicable. Submission of a return request does not automatically entitle a Customer to a return, replacement, exchange, or refund.

A. General Eligibility
A Product may be eligible for return if: • it is delivered in a damaged condition; • it is defective or fails to function as intended upon delivery; • an incorrect Product has been delivered; • the Product materially differs from its description on the Platform; • required accessories or components are missing upon delivery; • the Product is incomplete at the time of delivery; • the wrong quantity has been delivered; or • the Product otherwise qualifies for return under this Policy or applicable law. The applicable return window shall commence from the date the Product is delivered to the Customer or to a person authorised by the Customer to receive the delivery.

B. Return Window
Unless otherwise specified on the Product page or required by applicable law, eligible return requests must be submitted within the return period displayed for the relevant Product on the Platform. Different Products may have different return periods depending on factors including: • Product category; • Manufacturer requirements; • Seller policies adopted by the Platform; • hygiene considerations; • safety considerations; • legal restrictions; or • operational requirements. Requests submitted after the applicable return period may not be accepted except where required by law.

C. Product Condition
To qualify for a return, the Product should ordinarily: • be returned in substantially the same condition in which it was delivered; • be free from avoidable physical damage caused after delivery; • include all original accessories, manuals, cables, adapters, warranty cards, promotional items, and complimentary items supplied with the Product; • include the original packaging wherever reasonably available; • not show evidence of misuse, negligence, abuse, or unauthorised modification; and • satisfy any Product-specific return requirements disclosed at the time of purchase. The absence of original packaging alone shall not automatically result in rejection where the return is based on a verified manufacturing defect, transit damage, incorrect Product delivery, or any circumstance where applicable law provides otherwise.

D. Inspection Before Approval
Every returned Product may undergo inspection after it is received. The inspection may include verification of: • Product identity; • serial number or IMEI (where applicable); • accessories; • cosmetic condition; • physical damage; • operational status; • tampering; • warranty seals; • security labels; and • any other information reasonably necessary to determine eligibility. The Company or the applicable Seller may request photographs, videos, diagnostic reports, or other reasonable information before arranging a return.

E. Eligible Reasons for Return
Subject to verification, eligible reasons may include: • Product received damaged during transit; • manufacturing defect; • dead-on-arrival (DOA) Product; • incorrect Product delivered; • incorrect model, colour, specification, or variant delivered; • missing accessories; • missing components; • incomplete shipment; • significantly different Product than described; • duplicate shipment; • quantity discrepancy; • Product becoming unusable due to a verified manufacturing defect within the applicable return window; or • any other reason expressly approved by the Company. Acceptance of any return request remains subject to verification.

F. Products Requiring Manufacturer Verification
Certain Products may require inspection or certification by the Manufacturer or an authorised service centre before a return, replacement, or refund can be approved. Where such verification is required, the Customer shall reasonably cooperate with the inspection process. Nothing in this clause limits any mandatory statutory rights available under applicable law.

G. Marketplace Seller Products
Where a Product is sold by an independent Seller through the Platform: • the applicable Seller may participate in reviewing the return request; • the Company may coordinate communication between the Customer and the Seller; • inspection may be carried out by the Seller, Supplier, Manufacturer, or an authorised service provider; and • any approved return shall be processed in accordance with this Policy and the Platform's operational procedures. The Company may assist in facilitating the return process but does not guarantee approval where the eligibility requirements of this Policy are not met.

H. Right to Reject Return Requests
The Company or the applicable Seller reserves the right to decline a return request where, after reasonable verification, it is determined that: • the Product is not eligible under this Policy; • the Product has been intentionally damaged; • the Product has been altered, repaired, or modified without authorisation; • mandatory accessories or essential components have not been returned without reasonable explanation; • the return request contains false, misleading, or fraudulent information; • the Product has been used in a manner inconsistent with its intended purpose; or • the Customer has otherwise failed to comply with the requirements of this Policy. Where a return request is rejected, the Customer shall be informed of the decision and, where appropriate, the reasons for such rejection.

I. No Effect on Statutory Rights
Nothing contained in this Section shall limit or exclude any non-waivable rights or remedies available to Customers under applicable consumer protection laws. Where mandatory legal protections provide broader rights than those contained in this Policy, such statutory rights shall prevail to the extent of any inconsistency.`
    },
    {
      title: "6. Return Request Procedure",
      content: `The Company is committed to providing Customers with a transparent, efficient, and convenient process for submitting and resolving eligible return requests. Customers are encouraged to initiate return requests promptly upon discovering any issue with a Product. Submission of a return request does not constitute automatic approval. Each request shall be reviewed in accordance with this Policy and the applicable Product listing.

A. Initiating a Return Request
Customers may submit a return request through any of the following official channels, as made available by the Company: • the Company's website; • the Company's mobile application; • the Customer's account dashboard; • customer support services; or • any other official communication channel designated by the Company. Return requests submitted through unofficial channels may not be processed.

B. Time for Submitting Requests
Customers should submit their return request within the applicable return period specified: • on the Product page; • in the Order confirmation; • within this Policy; or • as otherwise communicated by the Company. Requests received after the applicable return period may be declined unless: • required by applicable law; • covered under the applicable warranty; • expressly approved by the Company; or • justified by exceptional circumstances accepted by the Company.

C. Information Required
To facilitate timely processing, Customers may be requested to provide information including: • Order number; • Customer name; • registered email address; • registered mobile number; • Product name; • Product model or variant; • serial number or IMEI, where applicable; • reason for the return request; • description of the issue; and • any other information reasonably required to verify the request. Providing complete and accurate information helps reduce processing delays.

D. Supporting Evidence
Depending on the nature of the request, the Company may request supporting evidence such as: • photographs of the Product; • photographs of the shipping package; • photographs of damaged packaging; • videos demonstrating the reported issue; • screenshots of error messages; • proof of missing items; • proof of delivery; or • any other reasonable evidence necessary to assess the claim. Failure to provide requested information may delay or affect the processing of the request.

E. Preliminary Review
Upon receiving the request, the Company or the applicable Seller may conduct an initial review to determine whether: • the request falls within the applicable return period; • the Product appears eligible for return; • sufficient information has been provided; • additional information is required; or • inspection by the Seller, Manufacturer, Supplier, or an authorised service provider is necessary. Customers may be contacted if clarification or additional documentation is required.

F. Return Approval
If the request satisfies the applicable eligibility requirements, the Company or the applicable Seller may approve the return. Upon approval, the Customer may receive instructions relating to: • return packaging; • pickup scheduling; • self-shipping, where applicable; • return address; • documentation requirements; • inspection procedures; and • any other steps necessary to complete the return. Approval of a return request does not automatically guarantee a refund. Refunds, replacements, or exchanges shall be determined after verification of the returned Product.

G. Packaging Requirements
Customers should ensure that returned Products are packaged securely to minimise the risk of damage during transit. Where reasonably available, Customers should include: • the original packaging; • Product box; • accessories; • manuals; • warranty cards; • complimentary items; and • any other components originally supplied with the Product. If the original packaging is unavailable, the Customer should use appropriate protective packaging that reasonably safeguards the Product during transportation.

H. Return Collection
Depending upon the Product, location, and operational availability, the Company or the applicable Seller may: • arrange pickup of the Product; • provide a prepaid shipping label; • request the Customer to deliver the Product to an authorised collection point; or • require self-shipping to a designated return address. The applicable return method shall be communicated after approval of the return request.

I. Failure to Return the Product
If a Customer fails to: • hand over the Product for scheduled pickup; • dispatch the Product within the specified time; • comply with reasonable return instructions; or • otherwise cooperate with the approved return process, the Company may cancel the approved return request and close the case. The Customer may be required to submit a new request, subject to the applicable return window and this Policy.

J. Inspection After Receipt
After the returned Product is received, it may undergo inspection to verify: • Product identity; • serial number or IMEI; • completeness; • physical condition; • reported defect or issue; • signs of misuse or tampering; and • compliance with this Policy. The outcome of this inspection shall determine whether the Customer is entitled to a refund, replacement, exchange, repair, or any other applicable remedy.

K. Communication During the Process
The Company may communicate updates regarding the return request through: • email; • SMS; • telephone; • mobile application notifications; • the Customer account dashboard; or • any other official communication channel. Customers are responsible for ensuring that their registered contact details remain accurate and up to date.

L. Customer Cooperation
Customers agree to cooperate reasonably throughout the return process, including by: • responding to verification requests; • providing accurate information; • making the Product available for pickup or inspection; • following return instructions; and • acting in good faith. Failure to cooperate may result in delays, suspension, or rejection of the return request where reasonably justified.

M. Statutory Rights
Nothing contained in this Section shall limit, exclude, or waive any mandatory consumer rights available under applicable law. Where applicable law provides greater protection than this Policy, the provisions of applicable law shall prevail to the extent of any inconsistency.`
    },
    {
      title: "7. Return Approval & Inspection",
      content: `To ensure fairness, prevent fraud, and maintain the quality and integrity of Products sold through the Platform, all approved return requests may be subject to verification and inspection before a refund, replacement, exchange, or other remedy is provided. Approval of a return request allows the Product to be returned for evaluation. The final outcome shall be determined after inspection of the returned Product in accordance with this Policy.

A. Inspection Process
Upon receipt of a returned Product, the Company, the applicable Seller, Supplier, Manufacturer, or an authorised service provider may conduct an inspection to verify: • the identity of the Product; • the Product's condition; • the reported defect or issue; • eligibility under this Policy; • the completeness of the returned package; and • compliance with applicable return requirements. The inspection process may vary depending on the nature, value, and category of the Product.

B. Verification Criteria
During inspection, the following factors may be reviewed, where applicable: • Product model; • serial number; • IMEI number; • barcode; • security labels; • warranty seals; • physical condition; • cosmetic condition; • operational functionality; • accessories; • manuals; • warranty documentation; • original components; • signs of transit damage; • signs of misuse; • signs of unauthorised repair or modification; and • any other information reasonably necessary to determine eligibility.

C. Functional Testing
Where appropriate, the Company or the applicable Seller may perform reasonable testing to determine whether the Product: • powers on correctly; • functions in accordance with its intended purpose; • exhibits the reported defect; • contains manufacturing faults; • has software-related issues; • has hardware-related issues; or • otherwise satisfies the conditions for return, replacement, exchange, or refund. Testing shall be limited to what is reasonably necessary to assess the reported issue.

D. Manufacturer or Authorised Service Centre Inspection
For certain Products, particularly electronics and technology Products, inspection may be carried out by: • the Manufacturer; • an authorised service centre; • an authorised repair partner; or • another qualified service provider approved by the Company. Where such inspection is required, Customers may be requested to cooperate by providing reasonable information or allowing the Product to be examined.

E. Verification of Reported Issues
Where a Customer reports that a Product is: • damaged; • defective; • incomplete; • incorrect; • materially different from its description; or • otherwise unsuitable, the Company or the applicable Seller may verify the claim using: • physical inspection; • diagnostic testing; • photographic evidence; • video evidence; • service reports; • shipping records; • delivery records; or • any other reasonable means of verification.

F. Outcomes of Inspection
Following inspection, one or more of the following outcomes may apply: • approval of a refund; • approval of a replacement; • approval of an exchange; • repair under the applicable warranty; • partial approval, where appropriate; • rejection of the return request with reasons; or • any other remedy available under applicable law or Company policy. The Company shall endeavour to communicate the inspection outcome within a reasonable period.

G. Rejection of Returned Products
A returned Product may not qualify for a refund, replacement, or exchange where inspection reasonably determines that: • the Product returned is not the same Product originally supplied; • the Product has been intentionally damaged; • the Product has been misused or abused after delivery; • unauthorised repairs or modifications have been performed; • essential accessories or components are missing without reasonable explanation; • serial numbers or IMEI numbers have been altered or removed; • warranty seals or security labels have been tampered with; • the reported defect cannot be verified; • false or misleading information has been provided; or • the Product otherwise fails to satisfy the eligibility requirements of this Policy. Where practicable, the Customer shall be informed of the reasons for rejection.

H. Return of Rejected Products
Where a returned Product is found to be ineligible for a refund, replacement, or exchange, the Company or the applicable Seller may: • return the Product to the Customer; • request the Customer to arrange collection of the Product; or • take any other reasonable action permitted under applicable law. If return shipping charges are applicable, the Customer shall be informed before the Product is dispatched.

I. Fraud Prevention
To protect Customers, Sellers, and the integrity of the Platform, the Company reserves the right to conduct reasonable investigations where it suspects: • fraudulent return requests; • substitution of Products or components; • submission of counterfeit Products; • manipulation of serial numbers or IMEI numbers; • repeated abuse of the return process; • false claims regarding Product condition; or • any other fraudulent, deceptive, or unlawful activity. Where fraud is reasonably suspected, the Company may reject the request, suspend further processing, restrict access to Platform services, or take any other action permitted by applicable law.

J. Communication of Decision
The Company shall endeavour to notify the Customer of the inspection outcome through the registered email address, mobile number, account dashboard, or any other official communication channel. Where additional information is required before a final decision can be made, the Customer may be contacted accordingly.

K. Good Faith and Fair Dealing
The Company is committed to conducting inspections fairly, objectively, and in good faith. Customers are expected to provide accurate information and cooperate throughout the inspection process. Deliberate misrepresentation, concealment of material facts, or abuse of this Policy may result in rejection of the request and other appropriate action in accordance with applicable law.

L. Statutory Rights
Nothing contained in this Section shall exclude, limit, or waive any mandatory rights or remedies available to Customers under applicable consumer protection laws. Where applicable law grants broader rights than those provided under this Policy, such statutory rights shall prevail to the extent of any inconsistency.`
    },
    {
      title: "8. Return Shipping",
      content: `The Company shall endeavour to make the return shipping process as convenient and efficient as reasonably practicable. Depending on the Product, the Customer's location, the applicable Seller, and operational availability, returned Products may be collected through scheduled pickup, drop-off at an authorised location, or self-shipping. Return shipping arrangements shall be communicated to the Customer once the return request has been approved.

A. Approved Return Shipping Methods
Where a return request has been approved, the Company or the applicable Seller may determine the most appropriate return method, including: • doorstep pickup by an authorised Logistics Partner; • drop-off at an authorised return centre; • shipment through an authorised courier service; • self-shipping by the Customer to a designated return address; or • any other return method communicated by the Company. The applicable return method may vary depending upon: • the Product category; • Product size or weight; • delivery location; • courier service availability; • Seller fulfilment model; or • operational considerations.

B. Scheduled Pickup
Where doorstep pickup is available: • the Company or the applicable Seller shall coordinate a pickup schedule; • Customers should ensure that the Product is securely packaged and ready for collection at the agreed location; • pickup dates and times may vary depending upon courier availability; and • multiple pickup attempts may be made where operationally feasible. If the Customer is unavailable during scheduled pickup attempts, the return request may be delayed or cancelled after reasonable notice.

C. Self-Shipping
Where doorstep pickup is unavailable or impracticable, Customers may be requested to self-ship the Product to a designated return address. Customers should: • use a reliable courier service; • retain proof of shipment; • securely package the Product; • comply with any shipping instructions provided by the Company; and • provide shipment tracking details where requested. Failure to retain proof of shipment may affect the Company's ability to investigate lost shipments.

D. Packaging Requirements
Customers shall take reasonable care to ensure that returned Products are packaged appropriately to minimise the risk of damage during transportation. Where reasonably available, returned shipments should include: • the Product; • original packaging; • accessories; • chargers; • adapters; • cables; • batteries supplied with the Product; • manuals; • warranty cards; • complimentary items; and • any other components originally supplied. If the original packaging is unavailable, Customers should use suitable protective packaging that provides equivalent protection during transit.

E. Responsibility During Return Transit
Once the Product has been handed over to an authorised Logistics Partner arranged by the Company or the applicable Seller, responsibility for transportation shall ordinarily rest with the relevant Logistics Partner, subject to applicable law. Where the Customer independently arranges return shipping without prior approval or contrary to the Company's instructions, the Customer may remain responsible for the Product until it is successfully delivered to the designated return address.

F. Return Shipping Charges
Unless otherwise stated on the Product page or required by applicable law: • return shipping charges shall generally be borne by the Company or the applicable Seller where the return is approved due to: o delivery of an incorrect Product; o verified manufacturing defects; o transit damage; o incomplete delivery; or o other errors attributable to the Company, Seller, Supplier, or Logistics Partner. Return shipping charges may be the responsibility of the Customer where: • the return request is based on reasons not attributable to the Company or the applicable Seller; • self-shipping has been chosen without prior approval where pickup was available; or • the Product is found, after inspection, to be ineligible for return under this Policy. Any applicable charges shall, where practicable, be communicated to the Customer before they are incurred.

G. Lost or Damaged Return Shipments
If a returned Product is lost or damaged while in transit: • during transportation arranged by the Company or the applicable Seller, the Company shall reasonably investigate the matter with the relevant Logistics Partner; or • during transportation independently arranged by the Customer, the Customer may be required to pursue the matter with the selected courier service, subject to applicable law. Customers should promptly notify the Company if they believe a returned shipment has been lost or materially delayed.

H. Delays in Return Transportation
Return transportation may occasionally be delayed due to circumstances including: • adverse weather conditions; • natural disasters; • strikes or labour disruptions; • transportation restrictions; • public emergencies; • government orders; • customs or regulatory inspections; • courier operational issues; or • other events beyond the reasonable control of the Company. The Company shall endeavour to keep Customers informed of material delays where reasonably practicable.

I. International Returns
Where the Company accepts international consumer orders, return shipping may be subject to additional requirements, including: • customs documentation; • import or export regulations; • duties or taxes; • courier restrictions; and • country-specific legal requirements. Any additional instructions shall be communicated to the Customer during the return process.

J. Failure to Deliver the Returned Product
If a returned Product cannot be delivered to the designated return address due to incorrect shipping information provided by the Customer or failure to comply with the Company's return instructions, the Company may request the Customer to arrange reshipment or provide corrected information. Any resulting delay may affect the processing of the return request.

K. Communication
Customers may track the status of approved return shipments through the Platform, the applicable courier service, or by contacting the Company's customer support, where such tracking services are available. The Company may also provide updates regarding return shipment status through email, SMS, mobile application notifications, or the Customer's account dashboard.

L. Statutory Rights
Nothing contained in this Section shall exclude, restrict, or limit any mandatory rights available to Customers under applicable consumer protection laws. Where any provision of this Section conflicts with applicable law, such law shall prevail to the extent of the inconsistency.`
    },
    {
      title: "9. Refund Policy",
      content: `The Company is committed to processing eligible refunds in a fair, transparent, and timely manner. Refunds shall be issued only where a Customer's request has been approved in accordance with this Policy, the applicable Product listing, and applicable law. Approval of a return request does not automatically entitle the Customer to a refund. Refunds shall be processed only after successful verification of the returned Product or, where applicable, after confirmation that a refund is otherwise appropriate.

A. Refund Eligibility
Subject to this Policy, a Customer may be eligible for a refund where: • an Order is validly cancelled before dispatch or shipment; • a returned Product successfully passes inspection; • a Product is delivered in a damaged condition; • a Product is confirmed to be defective upon inspection; • an incorrect Product has been delivered; • the Product materially differs from its description on the Platform; • the Company is unable to fulfil the Order; • the Product is lost during shipment before successful delivery; • duplicate payment has been successfully verified; or • a refund is otherwise required under applicable law. Each refund request shall be assessed individually based on the circumstances of the transaction.

B. Circumstances Where Refunds May Not Be Available
A refund request may be declined where: • the Product is not eligible for return under this Policy; • inspection determines that the reported issue cannot be verified; • the Product has been intentionally damaged after delivery; • the Product has been altered, modified, repaired, or tampered with without authorisation; • the Product returned is different from the Product originally supplied; • essential accessories or components are missing without reasonable explanation; • false, misleading, or fraudulent information has been provided; • the Customer fails to comply with the applicable return requirements; or • the refund is otherwise prohibited by this Policy or applicable law. Where a refund request is declined, the Customer shall, where reasonably practicable, be informed of the reasons for such decision.

C. Refund Following Return Approval
Where a returned Product has been inspected and approved, the Company or the applicable Seller may process: • a full refund; • a partial refund, where appropriate; • a replacement; • an exchange; • a repair under the applicable warranty; or • any other remedy available under applicable law. The remedy provided shall depend upon: • the nature of the issue; • inspection findings; • Product category; • availability of replacement stock; • applicable Manufacturer requirements; and • relevant legal obligations.

D. Partial Refunds
In limited circumstances, a partial refund may be issued where permitted by applicable law and where appropriate, including where: • only part of an Order qualifies for refund; • only certain Products within a multi-item Order are returned; • the Customer elects to retain part of an Order under an agreed resolution; or • another mutually agreed settlement is reached. The Company shall communicate the basis of any partial refund to the Customer.

E. Refunds for Cancelled Orders
Where an Order is cancelled in accordance with this Policy: • before dispatch, the Customer shall ordinarily receive a full refund of the amount paid for the cancelled Product, subject to any applicable deductions permitted by law; and • after dispatch, refund eligibility shall depend upon successful return of the Product where required. If the Company cancels an Order due to reasons attributable to the Company, any eligible refund shall ordinarily include the amount paid by the Customer for the affected Product.

F. Delivery Charges
Delivery or shipping charges may be refunded where: • the Company cancels the Order; • an incorrect Product is delivered; • the Product is delivered damaged; • the Product is confirmed to be defective; • delivery cannot be completed due to reasons attributable to the Company; or • refund of such charges is otherwise required by applicable law. Where only part of an Order is returned, shipping charges may be refunded only to the extent applicable to the returned Product.

G. Promotional Discounts and Offers
Where an Order has been purchased using promotional discounts, coupons, vouchers, cashback offers, or other promotional benefits: • the refund amount may be adjusted to reflect the actual amount paid by the Customer; • promotional benefits may be cancelled, reversed, or forfeited in accordance with the applicable promotional terms; and • promotional codes used in the original transaction may not be reissued unless expressly stated otherwise.

H. Duplicate or Incorrect Payments
Where the Company verifies that: • duplicate payment has been received; • payment has been processed multiple times for the same Order; or • an incorrect amount has been collected due to a verified system error, the excess amount shall ordinarily be refunded through the original payment method or another appropriate method.

I. Failed Deliveries
Where an Order cannot be delivered due to reasons attributable to the Company, the applicable Seller, Supplier, or Logistics Partner, the Customer may be entitled to: • re-delivery; • replacement; or • refund, depending upon the circumstances and Product availability. If delivery fails because the Customer provided an incorrect address, incorrect contact information, repeatedly refused delivery without valid reason, or was unavailable despite reasonable delivery attempts, the Company may deduct reasonable shipping or handling charges where permitted by applicable law before processing any refund.

J. Fraud Prevention
The Company reserves the right to delay, withhold, or decline any refund where it reasonably suspects: • fraudulent transactions; • payment fraud; • identity fraud; • abuse of the refund process; • misuse of promotional offers; • chargeback abuse; • submission of false claims; or • any unlawful or deceptive activity. Where necessary, additional verification may be requested before processing the refund.

K. Communication
Customers shall be notified of the status of their refund request through the Company's official communication channels, including: • email; • SMS; • mobile application notifications; • the Customer account dashboard; or • any other authorised communication method. Customers may also contact Customer Support for assistance regarding refund status.

L. Statutory Rights
Nothing contained in this Section shall exclude, restrict, or limit any mandatory rights or remedies available to Customers under applicable consumer protection laws. Where any provision of this Refund Policy conflicts with applicable law, the provisions of applicable law shall prevail to the extent of the inconsistency.`
    },
    {
      title: "10. Refund Methods",
      content: `The Company shall endeavour to issue approved refunds using the original payment method wherever reasonably practicable. The refund method may vary depending on the payment instrument used, the nature of the transaction, applicable banking procedures, operational requirements, and legal or regulatory obligations. Refunds shall only be processed after successful verification of the Customer's eligibility under this Policy.

A. Original Payment Method
Unless otherwise required by applicable law or operational necessity, approved refunds shall ordinarily be credited to the same payment method used to complete the original Order. Depending upon the original payment method, refunds may be processed through: • Credit Cards; • Debit Cards; • UPI; • Net Banking; • Mobile Wallets; • EMI transactions; • Gift Cards (where applicable); • other electronic payment methods supported by the Platform; or • any other payment mechanism approved by the Company.

B. Alternative Refund Methods
Where refunding the original payment method is not reasonably possible, including due to payment system limitations, account closure, failed refund transactions, or other operational reasons, the Company may, subject to applicable law, process the refund through an alternative method, including: • bank account transfer; • UPI transfer; • another verified payment instrument belonging to the Customer; or • any other lawful method determined by the Company. Before using an alternative refund method, the Company may request reasonable verification of the Customer's identity and payment details.

C. Refund to Bank Account
Where a refund is processed directly to a bank account, the Customer may be required to provide accurate details, including: • account holder's name; • bank name; • account number; • IFSC code; • branch details, where applicable; and • any other information reasonably necessary to complete the transaction. The Company shall not be responsible for delays or failed transfers resulting from incorrect or incomplete banking information provided by the Customer.

D. EMI Transactions
Where a Product has been purchased using an Equated Monthly Instalment (EMI) facility: • approved refunds shall ordinarily be processed through the original financing institution or payment partner; • the reversal of EMI instalments, finance charges, or interest shall be governed by the policies of the relevant bank, card issuer, lender, or payment service provider; and • the Company shall not be responsible for charges imposed by third-party financial institutions unless required by applicable law. Customers are encouraged to contact their bank or financing provider regarding the status of EMI reversals.

E. Wallets, Cashback and Promotional Credits
Where payment has been made using a digital wallet, promotional credit, cashback, reward points, vouchers, coupons, or similar benefits: • the refundable amount shall generally be limited to the amount actually paid by the Customer; • cashback, reward points, promotional credits, or coupons may be reinstated, forfeited, or adjusted in accordance with the applicable promotional terms; • promotional benefits have no cash value unless expressly stated otherwise; and • promotional offers shall remain subject to their respective terms and conditions.

F. Split Payments
Where an Order has been paid using multiple payment methods, the Company may process refunds proportionately through the respective payment methods used for the original transaction, wherever reasonably practicable. If this is not operationally feasible,`
    }
  ];

  const handleDownload = () => {
    const title = isB2BUser ? "PLE B2B Return Policy" : "PLE Return, Refund & Cancellation Policy (B2C)";
    const date = "Last updated: July 2026";
    let text = `${title}\n${date}\n\n`;
    
    sections.forEach(s => {
      text += `${s.title}\n${s.content}\n\n`;
    });
    
    text += "If you have questions about our Return Policy, please reach out to our customer service desk at support@ple.com.";
    
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isB2BUser ? "B2B_Return_Policy.txt" : "Return_Refund_Cancellation_Policy.txt";
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
                <FiRefreshCw className="text-[#7B0A0A]" /> {isB2BUser ? "Return Policy" : "Return, Refund & Cancellation Policy"}
              </h1>
              <p className="text-xs text-gray-500 font-medium">Last updated: July 2026</p>
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
                {isB2BUser ? "Download B2B Return Policy" : "Download Policy"}
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-semibold">
              {isB2BUser 
                ? "We want you to be completely satisfied with your purchase. This Return Policy outlines our guidelines for returns, refunds, and product replacements."
                : "This Return, Refund & Cancellation Policy explains the circumstances under which Customers may request the return, replacement, exchange, refund, or cancellation of Products purchased through the Platform."
              }
            </p>

            <div className="border-t border-gray-100 pt-6 space-y-6">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-gray-800">{section.title}</h3>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</div>
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
