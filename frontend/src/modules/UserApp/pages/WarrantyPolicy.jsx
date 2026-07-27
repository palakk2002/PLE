import { FiFileText, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const WarrantyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Introduction",
      content: `This Warranty Policy ("Policy") governs warranties applicable to Products purchased through the platforms, websites, mobile applications, marketplaces, and other digital services (collectively, the "Platform") operated by Peoples League Of Electronics Private Limited ("PLE", "Company", "we", "our", or "us"). The Platform facilitates the sale of Products offered by the Company, authorized suppliers, manufacturers, distributors, and independent third-party sellers.

This Policy explains:
• the warranties that may apply to Products;
• the responsibilities of manufacturers, suppliers, sellers, Customers, and the Company;
• the process for submitting warranty claims; and
• the limitations and exclusions applicable to warranty services.

This Policy should be read together with the Company's:
• Terms & Conditions;
• User Agreement;
• Privacy Policy;
• Shipping & Delivery Policy; and
• Return, Refund & Cancellation Policy.

In the event of any inconsistency between this Policy and applicable law, applicable law shall prevail to the extent of such inconsistency.`
    },
    {
      title: "2. Definitions",
      content: `Unless the context otherwise requires, the following terms shall have the meanings assigned below:

"Company", "PLE", "we", "our", or "us" means Peoples League Of Electronics Private Limited, including its successors and permitted assigns.

"Platform" means the websites, mobile applications, software, digital marketplaces, and related services operated by the Company.

"Customer" means any individual, business entity, organization, or other person purchasing or using Products through the Platform.

"Product" means any goods, equipment, accessories, software, digital device, or other item offered for sale through the Platform.

"Manufacturer" means the original producer, brand owner, or authorized manufacturer of a Product.

"Supplier" means an authorized distributor, wholesaler, importer, reseller, or supply partner fulfilling Products through the Platform.

"Seller" means an independent third-party seller offering Products through the Platform.

"Warranty" means a written assurance provided by the Manufacturer, Seller, Supplier, or, where expressly stated, the Company, regarding the quality, performance, repair, replacement, or service of a Product for a specified period and subject to applicable terms and conditions.

"Warranty Period" means the duration during which a Warranty remains valid, commencing on the date specified in the applicable warranty documentation unless otherwise required by law.

"Authorized Service Centre" means a service facility designated or approved by the Manufacturer, Seller, Supplier, or the Company to inspect, repair, replace, or service Products covered under an applicable Warranty.`
    },
    {
      title: "3. Scope of Warranty",
      content: `This Warranty Policy applies to Products purchased through the Platform where a valid warranty is expressly provided by the applicable Manufacturer, Supplier, Seller, or, where expressly stated, the Company. Warranty coverage shall be subject to the terms of the applicable warranty documentation, this Policy, the Company's Terms & Conditions, and applicable law. The existence, duration, and extent of any Warranty may vary depending upon the Product, brand, Manufacturer, Supplier, Seller, Product category, or applicable commercial arrangement.

A. Products Covered
Subject to the applicable warranty terms, this Policy may apply to Products including, but not limited to:
• Consumer electronics;
• Computers, laptops, tablets, and related accessories;
• Mobile phones and communication devices;
• Networking and information technology equipment;
• Office equipment;
• Home appliances;
• Security and surveillance products;
• Electrical and electronic accessories;
• Enterprise and commercial technology solutions; and
• Other eligible Products designated on the Platform.
Warranty availability for a particular Product shall be indicated on the applicable Product page, invoice, warranty documentation, or other accompanying materials.

B. Products Not Covered
Unless expressly stated otherwise, this Policy does not apply to:
• Products sold without any applicable warranty;
• Consumable items subject to normal depletion through use;
• Products expressly identified as non-warranty, clearance, liquidation, refurbished, open-box, or "as-is," except where a limited warranty is expressly provided;
• Products whose warranty period has expired;
• Services provided independently of the sale of a Product;
• Software, digital subscriptions, licences, or downloadable content, except where expressly covered by the applicable licensor or provider; or
• Any Product excluded under the applicable Manufacturer's, Seller's, Supplier's, or Company's warranty terms.

C. Applicable Warranty Provider
Depending upon the Product, warranty coverage may be provided by:
• The original Manufacturer;
• An authorized Supplier or distributor;
• An independent Seller;
• The Company, where expressly stated; or
• Any combination of the above, as specified in the applicable warranty documentation.
Customers acknowledge that warranty obligations shall be determined by the applicable warranty provider and the terms governing the specific Product.

D. Territorial Scope
Warranty coverage may be limited to specific countries, regions, or jurisdictions as determined by the applicable warranty provider. Certain warranties may require Products to be serviced only through designated Authorized Service Centres or within specified geographical territories. Customers are responsible for reviewing any territorial limitations communicated with the Product or by the applicable warranty provider.

E. Commencement of Warranty
Unless otherwise specified by the applicable warranty provider or required by law, the Warranty Period shall commence on:
• The date of delivery of the Product;
• The date of installation, where installation forms part of the applicable warranty terms; or
• Such other date as specified in the applicable warranty documentation.
Proof of purchase may be required to determine the commencement and validity of the Warranty Period.

F. Interpretation
Nothing in this section shall:
• Create a warranty where none has been expressly provided;
• Extend the duration or scope of any applicable warranty;
• Modify the terms of a Manufacturer's, Supplier's, Seller's, or Company's warranty unless expressly stated in writing; or
• Limit any statutory warranty or legal guarantee that cannot be excluded or restricted under applicable law.`
    },
    {
      title: "4. Types of Products Covered",
      content: `The Platform offers a wide range of Products sourced from Manufacturers, authorized Suppliers, distributors, and independent Sellers. The warranty applicable to a Product shall depend upon the Product category, the applicable warranty provider, and the terms accompanying the Product. Unless expressly stated otherwise, warranty coverage shall not be presumed solely because a Product is available for purchase through the Platform.

A. Manufacturer-Branded Products
Products manufactured by recognized brands may be accompanied by the original Manufacturer's warranty. Such warranty shall be governed exclusively by the terms, conditions, limitations, and service procedures established by the respective Manufacturer. Examples may include, but are not limited to:
• Computers and laptops;
• Mobile phones and tablets;
• Televisions and displays;
• Printers and scanners;
• Networking equipment;
• Home appliances;
• Security and surveillance systems;
• Storage devices;
• Computer peripherals; and
• Other branded electronic products.
The availability and duration of the Manufacturer's warranty shall be specified by the respective Manufacturer.

B. Supplier-Fulfilled Products
Products fulfilled through authorized Suppliers or distributors may include warranty support provided by the Manufacturer, the Supplier, or both, depending upon the applicable commercial arrangement. Where Supplier-supported warranty services are available, the applicable warranty documentation shall specify:
• The warranty provider;
• The duration of coverage;
• Available repair or replacement services; and
• Applicable claim procedures.

C. Marketplace Seller Products
Products sold by independent third-party Sellers may carry:
• The original Manufacturer's warranty;
• A warranty provided directly by the Seller;
• Both Manufacturer and Seller warranties; or
• No warranty, where expressly disclosed and permitted by applicable law.
Customers are encouraged to review the Product listing and accompanying warranty information before completing a purchase.

D. Company-Supported Warranty Products
From time to time, the Company may expressly offer Products accompanied by a warranty provided directly by PLE. Where the Company is the warranty provider, the applicable Product listing, invoice, warranty card, or accompanying documentation shall clearly specify:
• The scope of coverage;
• The Warranty Period;
• Claim procedures;
• Repair or replacement terms; and
• Any applicable exclusions or limitations.
No Company-backed warranty shall be deemed to exist unless expressly stated in writing.

E. Refurbished, Open-Box and Clearance Products
Refurbished, open-box, demonstration, clearance, or similar Products may be accompanied by:
• A limited Manufacturer's warranty;
• A Seller warranty;
• A Company-backed limited warranty; or
• No warranty, as expressly disclosed before purchase.
The applicable warranty terms for such Products shall prevail over the general provisions of this Policy.

F. Software and Digital Products
Software, firmware, operating systems, digital licences, subscriptions, downloadable content, and cloud-based services are generally governed by the licence agreements or warranty terms issued by the respective software publisher, developer, or service provider. Unless expressly stated otherwise, the Company does not provide separate warranty coverage for such Products.

G. Future Product Categories
The Company may introduce new Product categories, brands, or service offerings from time to time. The applicable warranty coverage for such Products shall be communicated through:
• The Product listing;
• Warranty documentation;
• The applicable invoice;
• Product packaging; or
• Other official communications issued by the Company.

H. Interpretation
Nothing in this section shall:
• Require every Product listed on the Platform to carry a warranty;
• Create a Company-backed warranty where none has been expressly provided;
• Modify the warranty terms established by the applicable Manufacturer, Supplier, or Seller; or
• Limit any statutory rights or legal guarantees available to Customers under applicable law.`
    },
    {
      title: "5. Manufacturer Warranty",
      content: `Many Products available through the Platform are manufactured by independent third-party manufacturers and may be accompanied by the original Manufacturer's warranty. Where a Manufacturer's warranty applies, such warranty shall be governed exclusively by the terms, conditions, duration, limitations, and service procedures established by the respective Manufacturer. The Company does not modify, extend, replace, or assume responsibility for a Manufacturer's warranty unless expressly stated in writing.

A. Warranty Coverage
Manufacturer warranties may include, subject to the applicable warranty documentation:
• Repair of manufacturing defects;
• Replacement of defective components;
• Replacement of the Product where repair is not reasonably practicable;
• Technical support;
• Firmware or software updates, where provided by the Manufacturer;
• Authorized servicing; and
• Other warranty services determined by the Manufacturer.
The scope of coverage varies between Manufacturers and Product categories.

B. Warranty Period
The duration of a Manufacturer's warranty shall be determined solely by the respective Manufacturer. Unless otherwise specified:
• the Warranty Period shall commence from the date specified in the applicable warranty documentation or proof of purchase; and
• any extension of warranty coverage shall be governed exclusively by the Manufacturer's policies.
The Company does not guarantee any minimum warranty period unless expressly stated on the Platform.

C. Authorized Service Centres
Manufacturer warranty services are ordinarily performed through the Manufacturer's Authorized Service Centres or other service providers designated by the Manufacturer. Customers may be required to:
• Contact the Manufacturer directly;
• Visit an Authorized Service Centre;
• Register the Product with the Manufacturer, where applicable;
• Submit proof of purchase;
• Provide the Product's serial number or other identifying information; and
• Comply with the Manufacturer's warranty procedures.
The Company may, where reasonably practicable, assist Customers in identifying the appropriate Authorized Service Centre or warranty contact.

D. Proof of Purchase
To obtain warranty service, Customers may be required to provide one or more of the following:
• Original invoice;
• Tax invoice;
• Order confirmation;
• Warranty card, where applicable;
• Product serial number;
• IMEI number, where applicable;
• Service tag or asset identifier, where applicable; or
• Any other documentation reasonably required by the Manufacturer.
Failure to provide the required documentation may result in refusal of warranty service by the Manufacturer.

E. Manufacturer Decisions
Determinations relating to Manufacturer warranty claims, including:
• eligibility;
• inspection;
• diagnosis;
• repair;
• replacement;
• rejection of claims; and
• availability of spare parts,
shall ordinarily be made by the Manufacturer or its Authorized Service Centre in accordance with the applicable warranty terms. The Company shall not be responsible for decisions made independently by the Manufacturer unless otherwise required by applicable law.

F. Company's Assistance
Where reasonably practicable, the Company may assist Customers by:
• Providing warranty-related information;
• Helping identify the applicable Manufacturer or Authorized Service Centre;
• Facilitating communication between the Customer and the Manufacturer;
• Assisting with documentation requirements; or
• Coordinating warranty support where operationally feasible.
Such assistance is provided as a customer support service and shall not be interpreted as the Company assuming the Manufacturer's warranty obligations.

G. Spare Parts and Repairs
Availability of spare parts, repair facilities, replacement units, technical expertise, and repair timelines shall be determined by the Manufacturer or its Authorized Service Centre. The Company does not guarantee:
• availability of replacement parts;
• completion of repairs within any specific timeframe;
• availability of replacement Products; or
• continuation of Manufacturer support for discontinued Products.

H. Interpretation
Nothing in this section shall:
• Create a Manufacturer warranty where none exists;
• Extend or modify the terms of a Manufacturer's warranty;
• Require the Company to perform repairs that are the responsibility of the Manufacturer;
• Limit any statutory rights available to Customers under applicable law; or
• Prevent the Company from voluntarily assisting Customers in obtaining warranty services.`
    },
    {
      title: "7. PLE's Role",
      content: `PLE operates the Platform as a technology-enabled marketplace and commerce facilitator connecting Customers with Manufacturers, authorized Suppliers, distributors, and independent Sellers. Unless expressly stated in writing for a particular Product, PLE is not the manufacturer of Products offered through the Platform and does not automatically provide or assume warranty obligations that belong to the applicable Manufacturer, Supplier, or Seller. Where reasonably practicable, PLE may assist Customers in obtaining warranty services in accordance with this Policy.

A. Warranty Facilitation
To improve the customer experience, the Company may facilitate warranty-related services by:
• Receiving warranty-related requests submitted through the Platform;
• Verifying purchase records and warranty eligibility information;
• Coordinating communication between Customers, Manufacturers, Suppliers, Sellers, Authorized Service Centres, and logistics providers;
• Providing information regarding applicable warranty procedures;
• Assisting Customers in identifying the appropriate warranty provider;
• Facilitating the collection or submission of documents required for warranty processing;
• Tracking the status of warranty requests where operationally feasible; and
• Providing reasonable customer support throughout the warranty process.
Such assistance is provided on a commercially reasonable efforts basis and does not constitute an assumption of the underlying warranty obligations.

B. Products Covered by Company Warranty
Where PLE expressly offers a Company-backed warranty for a Product, the applicable Product listing, invoice, warranty card, or accompanying documentation shall clearly specify:
• That PLE is the warranty provider;
• The scope of warranty coverage;
• The Warranty Period;
• Applicable exclusions and limitations;
• The warranty claim procedure; and
• Available remedies.
No Company-backed warranty shall be implied unless expressly communicated in writing.

C. Coordination with Warranty Providers
Where the applicable warranty is provided by a Manufacturer, Supplier, or Seller, PLE may coordinate with the relevant party to facilitate the warranty process. Such coordination may include:
• Forwarding warranty claims;
• Communicating inspection results;
• Arranging collection or return logistics where operationally feasible;
• Sharing documentation with the applicable warranty provider;
• Providing updates regarding claim status; and
• Assisting in the implementation of the final warranty decision.
The final determination regarding warranty eligibility, repair, replacement, or rejection shall ordinarily be made by the applicable warranty provider, subject to applicable law.

D. Service Centres and Third Parties
Warranty inspections, repairs, diagnostics, replacements, and servicing may be performed by:
• Authorized Manufacturers;
• Authorized Service Centres;
• Authorized Suppliers;
• Independent Sellers;
• Third-party repair facilities approved by the warranty provider; or
• Other entities authorized to provide warranty services.
PLE does not independently certify or guarantee the performance of such service providers unless expressly stated otherwise.

E. No Assumption of Manufacturer or Seller Obligations
Except where expressly assumed by the Company or required under applicable law, PLE shall not be deemed to:
• Be the Manufacturer of the Product;
• Be the authorized warranty provider for every Product sold through the Platform;
• Guarantee approval of warranty claims;
• Guarantee repair or replacement outcomes;
• Extend the Warranty Period;
• Modify Manufacturer or Seller warranty terms; or
• Accept liability for acts or omissions solely attributable to independent Manufacturers, Suppliers, Sellers, Authorized Service Centres, or other third parties.

F. Customer Support
The Company is committed to providing commercially reasonable customer support throughout the warranty process. Where reasonably practicable, the Company may:
• Respond to customer enquiries;
• Assist in resolving warranty-related concerns;
• Escalate unresolved matters to the applicable warranty provider;
• Facilitate communication between the relevant parties; and
• Take reasonable operational measures to promote timely handling of warranty requests.
The Company does not guarantee that every warranty claim will be approved or resolved in a particular manner.

G. Reservation of Rights
The Company reserves the right to:
• Request additional information or documentation necessary to process warranty-related requests;
• Verify the authenticity of Products and proof of purchase;
• Decline to process requests that are fraudulent, abusive, or outside the scope of the applicable warranty;
• Modify internal warranty support procedures to improve operational efficiency; and
• Take any other action reasonably necessary to protect the integrity of the Platform and the legitimate interests of Customers, Sellers, Suppliers, and the Company.

H. Interpretation
Nothing in this section shall:
• Create a Company-backed warranty where none has been expressly provided;
• Limit any statutory warranty, legal guarantee, or consumer right available under applicable law;
• Prevent Customers from pursuing warranty claims directly with the applicable Manufacturer, Supplier, Seller, or Authorized Service Centre; or
• Prevent the Company from voluntarily providing additional customer support beyond the requirements of this Policy.`
    },
    {
      title: "8. Warranty Claim Procedure",
      content: `Customers seeking warranty service for a Product purchased through the Platform shall follow the procedures set out in this Policy and any additional requirements communicated by the applicable Manufacturer, Supplier, Seller, Authorized Service Centre, or the Company. Submission of a warranty claim does not constitute acceptance of the claim. All warranty requests are subject to verification, inspection, and determination under the applicable warranty terms.

A. Initiating a Warranty Claim
A Customer may initiate a warranty claim by:
• Submitting a request through the Platform, where such functionality is available;
• Contacting the Company's customer support;
• Contacting the applicable Manufacturer, Supplier, Seller, or Authorized Service Centre directly, where appropriate; or
• Using any other warranty support channel communicated by the applicable warranty provider.
Customers are encouraged to initiate warranty claims as soon as reasonably practicable after discovering the alleged defect.

B. Information Required
To facilitate the processing of a warranty claim, the Customer may be required to provide:
• Order number or invoice number;
• Proof of purchase;
• Customer identification details reasonably necessary to verify the purchase;
• Product name and model number;
• Serial number, IMEI number, service tag, or other Product identifier, where applicable;
• Description of the alleged defect or malfunction;
• Photographs or videos demonstrating the issue, where reasonably requested;
• Date on which the issue was first observed; and
• Any additional information reasonably required to evaluate the warranty claim.
Failure to provide reasonably requested information may delay the processing of the warranty claim.

C. Preliminary Verification
Upon receipt of a warranty request, the Company or the applicable warranty provider may conduct a preliminary verification to determine:
• Whether the Product was purchased through the Platform;
• Whether the Warranty Period remains valid;
• Whether the Product appears eligible for warranty service;
• Whether sufficient information has been provided; and
• Whether the request should be referred to the applicable Manufacturer, Supplier, Seller, or Authorized Service Centre.
Preliminary verification does not constitute approval of the warranty claim.

D. Inspection of the Product
Where necessary, the Product may be required to undergo inspection, testing, diagnostics, or technical evaluation by:
• The Manufacturer;
• An Authorized Service Centre;
• The Supplier;
• The Seller;
• The Company, where applicable; or
• Another entity authorized by the applicable warranty provider.
The purpose of such inspection is to determine:
• The nature of the reported defect;
• Whether the issue is covered under the applicable warranty;
• Whether exclusions apply; and
• The appropriate remedy.

E. Collection and Transportation
Where inspection or servicing requires physical possession of the Product, the Customer may be requested to:
• Deliver the Product to an Authorized Service Centre;
• Make the Product available for collection, where collection services are offered;
• Package the Product securely for transportation; and
• Remove personal belongings, confidential information, removable storage media, SIM cards, memory cards, passwords, or other sensitive data before surrendering the Product.
The applicable warranty provider may specify additional shipping or packaging requirements.

F. Determination of the Claim
Following inspection, the applicable warranty provider shall determine whether the Product qualifies for warranty service. The determination may result in:
• Approval of repair;
• Replacement of the Product or defective components;
• Provision of another remedy permitted under the applicable warranty;
• Rejection of the warranty claim where the defect is not covered; or
• Any other outcome consistent with the applicable warranty terms and applicable law.
Unless otherwise required by law, the determination of the applicable warranty provider shall govern the warranty claim.

G. Customer Communication
Where reasonably practicable, the Company or the applicable warranty provider may keep the Customer informed regarding:
• Receipt of the warranty request;
• Status of verification;
• Inspection updates;
• Approval or rejection of the claim;
• Repair or replacement progress; and
• Completion of the warranty process.
Estimated timelines are indicative only and may vary depending upon Product type, availability of spare parts, technical complexity, logistics, and other operational factors.

H. Reservation of Rights
The Company reserves the right to:
• Request additional documentation or information necessary to process a warranty claim;
• Verify ownership and authenticity of the Product;
• Reject incomplete, fraudulent, or abusive warranty requests;
• Suspend processing pending receipt of required information; and
• Refer warranty claims to the applicable Manufacturer, Supplier, Seller, or Authorized Service Centre.`
    },
    {
      title: "9. Customer Responsibilities",
      content: `Customers seeking warranty services are responsible for complying with the requirements of this Policy, the applicable warranty documentation, and any reasonable instructions issued by the applicable Manufacturer, Supplier, Seller, Authorized Service Centre, or the Company. Failure to comply with these responsibilities may result in delays, suspension, or rejection of warranty claims to the extent permitted by applicable law.

A. Proper Use of the Product
Customers shall use Products in accordance with:
• The Manufacturer's instructions;
• User manuals and operating guides;
• Installation requirements;
• Safety instructions;
• Applicable laws and regulations; and
• Any other usage conditions communicated with the Product.
Improper operation, misuse, or unauthorized use may affect warranty eligibility where provided under the applicable warranty terms.

B. Product Care and Maintenance
Customers are responsible for exercising reasonable care in maintaining the Product. Where applicable, Customers should:
• Perform routine maintenance recommended by the Manufacturer;
• Keep the Product reasonably clean and protected from avoidable damage;
• Use compatible accessories and components;
• Operate the Product within recommended environmental conditions; and
• Follow maintenance schedules specified by the Manufacturer.
Failure to perform required maintenance may affect warranty coverage where expressly provided in the applicable warranty documentation.

C. Preservation of Documentation
Customers are encouraged to retain:
• Original invoices;
• Proof of purchase;
• Warranty cards;
• Product packaging where reasonably practicable;
• Serial numbers, IMEI numbers, service tags, or other Product identifiers; and
• Any service records relating to the Product.
Such documentation may be required for verification of warranty eligibility.

D. Accurate Information
Customers shall provide complete, accurate, and truthful information when submitting warranty requests. This includes, where applicable:
• Product identification details;
• Purchase information;
• Description of the reported issue;
• Supporting photographs or videos;
• Contact information; and
• Any additional information reasonably requested during the warranty process.
Providing false, misleading, or incomplete information may result in delays or rejection of the warranty claim, subject to applicable law.

E. Data Backup and Personal Information
Before submitting a Product for inspection, repair, replacement, or servicing, Customers are responsible for:
• Backing up all personal, business, or confidential data;
• Removing passwords, security locks, biometric authentication, or activation locks where required for servicing;
• Removing SIM cards, memory cards, storage devices, accessories, or other removable media unless specifically requested; and
• Deleting or otherwise protecting sensitive personal information where appropriate.
The Company, Manufacturer, Supplier, Seller, Authorized Service Centre, and their respective service providers shall not be responsible for loss, corruption, disclosure, or recovery of data stored on a Product, except where liability cannot be excluded under applicable law.

F. Availability for Inspection
Where reasonably required, Customers shall make the Product available for:
• Inspection;
• Diagnostic testing;
• Collection;
• Repair;
• Replacement; or
• Other warranty-related procedures.
Customers shall cooperate in scheduling collection or service appointments where such services are offered.

G. Timely Reporting
Customers should report suspected defects within the applicable Warranty Period and as soon as reasonably practicable after discovering the issue. Delays in reporting may affect the availability of certain remedies where permitted under the applicable warranty terms and applicable law.

H. Compliance with Warranty Procedures
Customers shall comply with reasonable warranty procedures established by the applicable warranty provider, including:
• Visiting an Authorized Service Centre where required;
• Completing applicable claim forms;
• Providing requested documentation;
• Following shipping or packaging instructions;
• Cooperating with inspection processes; and
• Complying with any other reasonable procedural requirements.

I. Reservation of Rights
Nothing in this section shall:
• Reduce or exclude any statutory rights available to Customers under applicable law;
• Require Customers to comply with unreasonable or unlawful conditions;
• Prevent the Company from providing additional assistance beyond the requirements of this Policy; or
• Limit the Company's ability to waive procedural requirements where it considers such waiver appropriate.`
    },
    {
      title: "10. Exclusions from Warranty",
      content: `Unless otherwise required by applicable law or expressly provided under the applicable warranty documentation, warranties do not cover defects, damage, failures, or loss arising from circumstances outside the intended scope of the applicable warranty. The exclusions set out in this section are intended to clarify the circumstances in which warranty service may be unavailable and shall be interpreted consistently with applicable consumer protection laws.

A. Normal Wear and Tear
Warranty coverage does not extend to deterioration resulting from the ordinary and intended use of a Product, including but not limited to:
• Cosmetic wear;
• Minor scratches, dents, or discoloration;
• Gradual reduction in performance due to normal usage;
• Consumable components subject to ordinary depletion; and
• Other forms of normal aging consistent with the Product's intended use.

B. Accidental Damage
Unless expressly covered by the applicable warranty, damage resulting from accidents shall not be covered, including:
• Drops or impacts;
• Liquid or moisture damage;
• Fire or smoke damage;
• Flooding or water ingress;
• Lightning;
• Power surges or electrical fluctuations;
• Natural disasters; or
• Other accidental external causes.

C. Misuse or Improper Use
Warranty coverage shall not apply where damage or failure results from:
• Misuse or abuse of the Product;
• Negligence;
• Improper handling;
• Improper storage;
• Operation contrary to the Manufacturer's instructions;
• Use for purposes other than those for which the Product was designed; or
• Failure to follow recommended installation or operating procedures.

D. Unauthorized Repairs or Modifications
Warranty coverage may be denied where the Product has been:
• Repaired by unauthorized persons;
• Modified without authorization;
• Altered or customized;
• Disassembled beyond ordinary user maintenance;
• Fitted with unauthorized components or accessories; or
• Subjected to unauthorized software, firmware, or hardware modifications.
This exclusion shall not apply where such modification is unrelated to the defect giving rise to the warranty claim, if otherwise required by applicable law.

E. Consumables
Unless expressly stated otherwise, warranty coverage does not extend to consumable items or components that are expected to require periodic replacement through normal use, including but not limited to:
• Batteries with normal capacity degradation;
• Ink cartridges;
• Toner cartridges;
• Printer drums;
• Filters;
• Lamps;
• Fuses;
• Cables subject to ordinary wear; or
• Other consumable components identified by the applicable warranty provider.

F. Software and Data
Unless expressly covered by the applicable warranty provider, warranty coverage does not extend to:
• Software defects;
• Operating system issues;
• Third-party applications;
• Malware or viruses;
• Data corruption;
• Data loss;
• Configuration errors;
• Compatibility issues caused by third-party software; or
• Loss of digital content stored on the Product.
Customers remain responsible for maintaining backups of their data.

G. External Causes
Warranty coverage does not extend to damage arising from:
• Improper installation performed by unauthorized persons;
• Incompatible accessories or peripherals;
• Improper electrical supply;
• Environmental conditions outside recommended operating specifications;
• Chemical exposure;
• Corrosion caused by external factors;
• Pest or insect infestation; or
• Other external causes beyond ordinary product defects.

H. Removal or Alteration of Identification
Warranty service may be refused where:
• Product serial numbers;
• IMEI numbers;
• Service tags;
• Warranty labels;
• Security seals; or
• Other identifying marks
have been removed, altered, defaced, or rendered illegible in a manner that prevents verification of the Product, unless otherwise required by applicable law.

I. Expired Warranty Period
Warranty coverage shall not apply after expiration of the applicable Warranty Period, except where:
• Extended warranty coverage has been validly purchased;
• The applicable warranty provider expressly extends coverage; or
• Applicable law provides otherwise.

J. Fraudulent or Abusive Claims
Warranty coverage shall not apply where the Company or the applicable warranty provider reasonably determines that:
• False information has been submitted;
• Supporting documents have been falsified or altered;
• The Product has been intentionally damaged;
• The warranty process has been abused;
• The Product was obtained through fraudulent or unlawful means; or
• Any other fraudulent activity relating to the warranty claim has occurred.
The Company reserves the right to take appropriate legal or administrative action in such circumstances.

K. Interpretation
Nothing in this section shall:
• Exclude or limit any statutory warranty, legal guarantee, or consumer right that cannot lawfully be excluded or restricted;
• Prevent the applicable warranty provider from offering broader warranty coverage;
• Limit the Company's ability to provide goodwill assistance or voluntary support beyond the requirements of the applicable warranty; or
• Affect any rights or remedies available under applicable law.`
    },
    {
      title: "11. Repair, Replacement & Resolution",
      content: `Where a warranty claim is approved in accordance with the applicable warranty terms, the applicable Manufacturer, Supplier, Seller, or, where expressly stated, the Company, shall determine the appropriate remedy based upon the nature of the defect, availability of replacement parts or Products, technical feasibility, and applicable law. Approval of a warranty claim does not automatically entitle the Customer to a particular remedy.

A. Available Remedies
Subject to the applicable warranty and applicable law, an approved warranty claim may be resolved through one or more of the following:
• Inspection of the Product;
• Repair of the Product;
• Replacement of defective components;
• Replacement of the Product with the same or an equivalent Product;
• Provision of refurbished replacement units where permitted by the applicable warranty;
• Refund, where expressly required by the applicable warranty or applicable law; or
• Any other remedy considered appropriate by the applicable warranty provider.
The remedy selected shall depend upon the circumstances of the claim and the applicable warranty terms.

B. Repair Services
Where repair is determined to be the appropriate remedy:
• Repairs may be performed by the Manufacturer, an Authorized Service Centre, Supplier, Seller, the Company (where applicable), or another authorized repair facility.
• Only components or replacement parts approved by the applicable warranty provider may be used.
• Repair timelines are estimates only and may vary depending upon the complexity of the issue, availability of spare parts, logistics, and operational requirements.
The Company does not guarantee completion of repairs within any specific period unless expressly required by applicable law.

C. Replacement of Products
Where replacement is approved:
• The replacement Product may be new, refurbished, reconditioned, or functionally equivalent, where permitted under the applicable warranty and applicable law.
• Replacement Products may differ in serial number, cosmetic appearance, packaging, or manufacturing batch while maintaining substantially equivalent functionality and specifications.
• Availability of identical replacement Products is not guaranteed.
Where an identical Product is unavailable, the applicable warranty provider may offer a Product of substantially similar specifications or another appropriate remedy.

D. Refunds Under Warranty
Refunds under a warranty shall only be provided where:
• Expressly required by the applicable warranty;
• Repair or replacement is not reasonably practicable;
• Required under applicable law; or
• Otherwise approved by the applicable warranty provider.
Any refund shall be processed in accordance with the Company's Return, Refund & Cancellation Policy, the applicable warranty terms, and applicable law.

E. Collection and Return of Products
Where repair or replacement requires return of the Product:
• The Customer shall cooperate in making the Product available for collection or delivery to the designated service location.
• The applicable warranty provider may specify packaging, shipping, or handling requirements.
• The Company may coordinate logistics where operationally feasible.
Risk associated with transportation during warranty servicing shall be determined by the applicable shipping arrangements and applicable law.

F. Non-Repairable Products
Where a Product cannot reasonably be repaired due to technical, economic, safety, or operational considerations, the applicable warranty provider may:
• Replace the Product;
• Provide another appropriate remedy under the applicable warranty; or
• Resolve the claim in another manner permitted by applicable law.

G. Completion of Warranty Service
Warranty service shall ordinarily be considered complete upon:
• Return of the repaired Product to the Customer;
• Delivery of a replacement Product;
• Completion of another approved remedy;
• Communication of the final determination where no warranty coverage exists; or
• Any other resolution permitted under the applicable warranty.
Customers should inspect repaired or replacement Products promptly upon receipt and notify the Company or the applicable warranty provider of any issues as soon as reasonably practicable.

H. Company's Role
Where the Company is not the applicable warranty provider, PLE may facilitate communication and coordination between the Customer and the relevant Manufacturer, Supplier, Seller, Authorized Service Centre, or logistics provider. Except where expressly assumed by the Company or required by applicable law, PLE does not guarantee:
• Approval of warranty claims;
• Availability of repairs or replacement Products;
• Repair timelines;
• Availability of spare parts; or
• Any specific warranty outcome.

I. Reservation of Rights
The applicable warranty provider reserves the right to:
• Determine the appropriate remedy for an approved claim;
• Verify the authenticity and eligibility of the Product;
• Require inspection before approving any remedy;
• Decline remedies outside the scope of the applicable warranty; and
• Take reasonable measures to prevent fraud or abuse of the warranty process.

J. Interpretation
Nothing in this section shall:
• Create a right to a specific remedy where the applicable warranty provides otherwise;
• Limit any statutory rights or remedies available to Customers under applicable law;
• Prevent the Company from voluntarily providing goodwill assistance beyond the applicable warranty; or
• Affect obligations imposed upon the applicable warranty provider under law.`
    },
    {
      title: "12. Warranty for Replacement Products",
      content: `Where a Product or any of its components is repaired or replaced pursuant to an approved warranty claim, the warranty applicable to the repaired or replacement Product shall be governed by the terms of the applicable warranty provider and this Policy. Unless otherwise required by applicable law or expressly stated by the applicable warranty provider, replacement or repaired Products do not automatically receive a new Warranty Period.

A. Continuation of Warranty
Unless expressly stated otherwise:
• A repaired Product shall continue to be covered only for the unexpired balance of the original Warranty Period; and
• A replacement Product shall ordinarily inherit the remaining portion of the original Warranty Period.
The applicable warranty provider may, at its discretion, offer additional warranty coverage where expressly communicated in writing.

B. Replacement Components
Where only specific components of a Product are replaced under warranty:
• The remaining portions of the Product shall continue to be governed by the original Warranty Period; and
• The replacement component shall be covered in accordance with the applicable warranty terms, unless otherwise specified by the warranty provider.
No separate Warranty Period shall be created solely because an individual component has been replaced, unless expressly stated.

C. Refurbished or Equivalent Replacement Products
Where permitted under the applicable warranty and applicable law, a replacement Product may be:
• New;
• Refurbished;
• Reconditioned;
• Manufacturer-certified refurbished; or
• Functionally equivalent to the original Product.
Such replacement Products shall be deemed to satisfy the applicable warranty obligations, provided they are substantially equivalent in functionality and performance.

D. Availability
Replacement Products are subject to availability. Where an identical Product is unavailable, the applicable warranty provider may provide:
• A substantially equivalent Product;
• A newer model with comparable or improved specifications;
• Another remedy permitted under the applicable warranty; or
• Any other resolution required by applicable law.
The Company does not guarantee the availability of identical replacement Products.

E. Ownership of Replaced Products
Unless otherwise required by applicable law or expressly agreed otherwise:
• Products or components replaced under warranty shall become the property of the applicable warranty provider upon replacement; and
• Customers shall cooperate in returning replaced Products or components where reasonably requested.
Failure to return Products where required may affect eligibility for replacement under the applicable warranty.

F. Cosmetic Differences
Replacement Products may differ from the original Product with respect to:
• Serial numbers;
• Manufacturing batch;
• Packaging;
• Cosmetic appearance;
• Colour variations;
• Firmware version; or
• Other non-material characteristics,
provided that the replacement Product is substantially equivalent in functionality and performance.

G. Company's Role
Where PLE is not the applicable warranty provider, the Company may facilitate coordination of replacement requests between the Customer and the relevant Manufacturer, Supplier, Seller, Authorized Service Centre, or logistics provider. Except where expressly assumed by the Company or required by applicable law, PLE does not guarantee:
• Availability of replacement Products;
• Approval of replacement requests;
• Delivery timelines for replacement Products; or
• Extension of warranty coverage.

H. Interpretation
Nothing in this section shall:
• Extend the Warranty Period beyond that provided by the applicable warranty provider unless expressly stated;
• Create a new Company-backed warranty where none exists;
• Limit any statutory rights or legal guarantees available to Customers under applicable law; or
• Prevent the applicable warranty provider from voluntarily offering broader warranty coverage.`
    },
    {
      title: "13. Limitation of Liability",
      content: `To the maximum extent permitted by applicable law, the Company's obligations under this Warranty Policy are limited to facilitating warranty support and, where expressly applicable, providing warranty services in accordance with the applicable warranty terms. Nothing in this Policy shall exclude or limit any liability that cannot lawfully be excluded or restricted under applicable law.

A. Scope of Liability
Except where the Company is the applicable warranty provider or where liability arises under applicable law, PLE shall not be responsible for:
• Manufacturing defects attributable solely to the Manufacturer;
• Defects arising from the acts or omissions of Suppliers or independent Sellers;
• Decisions made by Manufacturers, Sellers, Suppliers, or Authorized Service Centres regarding warranty eligibility;
• Delays caused by Manufacturers, Sellers, Suppliers, logistics providers, customs authorities, or other third parties;
• Availability of spare parts, replacement units, or repair facilities;
• Product loss, loss of use, data loss, business interruption, or loss of profits; or
• Any other indirect, incidental, consequential, special, exemplary, or punitive damages.`
    },
    {
      title: "14. Contact Information",
      content: `For any queries, clarifications, or assistance regarding this Warranty Policy or warranty claims, please contact our support team at support@ple.com.`
    }
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
                <FiFileText className="text-[#7B0A0A]" /> Warranty Policy
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
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              This Warranty Policy outlines the terms, scopes, procedures, and responsibilities governing product warranties on the PLE Platform.
            </p>

            <div className="border-t border-gray-100 pt-6 space-y-6">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-gray-800">{section.title}</h3>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-xs text-gray-500">
                If you have questions about this Policy, please reach out to our legal desk at legal@ple.com.
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default WarrantyPolicy;
