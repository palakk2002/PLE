import React from "react";
import { FiTruck, FiArrowLeft, FiShield, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const ShippingDeliveryPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Chapter 1 – Introduction",
      content: `1.1 Purpose
This Shipping & Delivery Policy ("Policy") establishes the terms, conditions, procedures, and responsibilities governing the shipment, transportation, delivery, logistics, and fulfillment of Products and Services purchased through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The purpose of this Policy is to provide a transparent, commercially reasonable, and legally compliant framework for the movement of Products from suppliers, manufacturers, distributors, marketplace sellers, or the Company to Business Users while protecting the interests of all Parties involved. This Policy shall also define the allocation of responsibilities relating to shipping costs, delivery timelines, transfer of risk, inspection, acceptance, and related logistics activities.

1.2 Scope
This Policy applies to:
• all Products purchased through the Company's B2B Platform;
• domestic shipments;
• international shipments;
• direct supplier shipments;
• manufacturer shipments;
• marketplace seller shipments;
• Company-managed logistics;
• third-party logistics providers;
• warehouse deliveries;
• business deliveries;
• partial shipments;
• replacement shipments;
• warranty shipments;
• reverse logistics where applicable; and
• all shipping and delivery services facilitated by the Company.

This Policy applies unless otherwise expressly agreed in writing under a separate commercial agreement.

1.3 Definitions
For the purposes of this Policy, unless the context otherwise requires:
• Business User means any registered business entity, organization, institution, government body, reseller, distributor, dealer, or other commercial customer using the Company's Platform.
• Product means any goods, equipment, hardware, software, accessories, components, licenses, or other items offered through the Platform.
• Delivery means the transfer of possession of a Product to the Business User or its authorized representative.
• Shipment means the transportation of Products from the dispatch location to the designated delivery location.
• Carrier means any courier, freight operator, logistics provider, transporter, shipping company, postal service, or delivery partner engaged in transporting Products.
• Business Day means any day on which commercial banks are generally open for business in Karnataka, India, excluding public holidays.
• Incoterms® means the International Commercial Terms published by the International Chamber of Commerce, where expressly incorporated into the applicable transaction.

Capitalized terms not defined in this Policy shall have the meanings assigned to them in the Business User Agreement or the Business Terms & Conditions.

1.4 Applicability
This Policy applies to every shipment arranged:
• directly by the Company;
• through suppliers;
• through manufacturers;
• through distributors;
• through marketplace sellers;
• through logistics providers;
• through fulfillment partners; or
• through any other authorized shipping arrangement facilitated by the Company.

Certain Products may be subject to additional shipping conditions imposed by manufacturers, suppliers, regulatory authorities, or applicable law.

1.5 Relationship with Other Agreements
This Policy shall be read together with:
• the Business User Agreement;
• the Business Terms & Conditions;
• the Privacy Policy;
• the Return, Refund & Cancellation Policy;
• the Warranty Policy;
• Schedule A – Definitions;
• Schedule B – Acceptable Use Policy;
• Schedule C – Logistics & Delivery Standards;
• Schedule D – Product Acceptance Procedure;
• Schedule E – Return Merchandise Authorization (RMA) Process;
• Schedule F – Warranty Matrix;
• Schedule G – Service Level Standards;
• Schedule H – Data Processing Standards;
• Schedule I – Marketplace Seller Standards;
• Schedule J – Corporate Wallet & Fund Management Policy; and
• any applicable Purchase Order or executed commercial agreement.

In the event of any inconsistency between this Policy and an executed commercial agreement, the executed commercial agreement shall prevail solely to the extent of such inconsistency.

1.6 Commercial Nature of Transactions
All shipments facilitated under this Policy are commercial transactions conducted between business entities. Delivery schedules, logistics arrangements, transportation methods, and shipping obligations shall be interpreted in light of commercially reasonable practices, operational feasibility, inventory availability, supplier commitments, and applicable contractual obligations. Nothing in this Policy shall be interpreted as creating consumer rights beyond those required by applicable law.

1.7 Policy Updates
The Company reserves the right to amend, modify, supplement, replace, or update this Policy at any time to:
• comply with applicable law;
• improve operational efficiency;
• reflect changes in logistics operations;
• accommodate technological developments;
• incorporate regulatory requirements;
• address security concerns; or
• improve Business User experience.

Updated versions shall become effective upon publication on the Company's Platform unless otherwise specified. Continued use of the Platform after such publication constitutes acceptance of the revised Policy.

1.8 Interpretation
Unless the context otherwise requires:
• headings are for convenience only and shall not affect interpretation;
• words importing the singular include the plural and vice versa;
• references to statutes include amendments, re-enactments, and subordinate legislation;
• references to "including" shall mean "including without limitation";
• references to one gender include all genders; and
• references to a Party include its successors and permitted assigns.

If any provision of this Policy is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

1.9 Good Faith
The Company and Business Users shall perform their respective obligations under this Policy honestly, reasonably, and in good faith. Each Party shall cooperate in facilitating timely shipments, accurate deliveries, efficient communication, and the prompt resolution of logistics-related issues.

1.10 Compliance with Applicable Law
This Policy shall be interpreted and enforced in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930, where applicable;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023, where applicable;
• applicable Goods and Services Tax (GST) laws;
• applicable customs, export, import, transportation, and logistics regulations; and
• all other applicable commercial and regulatory laws of India.

Where any provision of this Policy conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 2 – Shipping Services",
      content: `2.1 Purpose
This Chapter establishes the shipping services, transportation methods, fulfillment procedures, and logistics arrangements available for Products purchased through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The objective of this Chapter is to ensure that Products are transported safely, efficiently, securely, and in accordance with commercially reasonable logistics practices while meeting applicable contractual, regulatory, and operational requirements.

2.2 Shipping Methods
The Company may offer one or more shipping methods depending upon:
• Product category;
• Product dimensions;
• Product weight;
• destination;
• delivery urgency;
• supplier capabilities;
• inventory location;
• regulatory requirements; and
• commercial feasibility.

Available shipping methods may include:
• standard shipping;
• expedited shipping;
• express shipping;
• same-day delivery, where available;
• scheduled delivery;
• freight transportation;
• dedicated logistics services;
• supplier direct shipment;
• manufacturer direct shipment; or
• any other shipping method approved by the Company.

The Company reserves the right to determine the most appropriate shipping method unless a specific method has been contractually agreed.

2.3 Shipping Partners
Shipments may be performed by:
• the Company;
• authorized logistics providers;
• courier companies;
• freight carriers;
• manufacturers;
• distributors;
• suppliers;
• marketplace sellers; or
• other third-party logistics partners approved by the Company.

Selection of shipping partners shall be based upon commercial considerations, operational efficiency, destination requirements, and service availability.

2.4 Order Processing
Orders shall enter the shipping process only after:
• successful order confirmation;
• verification of Business Account details;
• payment confirmation, where applicable;
• inventory allocation;
• supplier confirmation;
• fraud prevention verification;
• compliance verification; and
• completion of any additional requirements specified by the Company.

Order processing times may vary depending upon Product availability, supplier response times, and operational requirements.

2.5 Shipping Availability
Shipping services may be available only in locations approved by the Company. Availability may depend upon:
• geographic location;
• logistics infrastructure;
• carrier coverage;
• regulatory restrictions;
• Product classification;
• export or import controls;
• security considerations; and
• operational feasibility.

The Company reserves the right to refuse shipment to locations where delivery is impracticable, unsafe, prohibited by law, or commercially unreasonable.

2.6 Delivery Scheduling
Where available, Business Users may request scheduled delivery windows. Scheduled deliveries shall remain subject to:
• carrier availability;
• warehouse operations;
• supplier readiness;
• transportation conditions;
• weather conditions;
• regulatory inspections;
• customs clearance; and
• other operational factors beyond the Company's reasonable control.

Requested delivery schedules are subject to confirmation by the Company or the applicable logistics provider.

2.7 Multiple Shipments
Where an order contains multiple Products, the Company may, at its discretion:
• consolidate shipments;
• split shipments;
• dispatch Products separately;
• arrange direct shipment from multiple suppliers;
• combine Products from different warehouses; or
• otherwise optimize shipment based upon operational efficiency.

Partial shipment of an order shall not constitute a breach of this Policy unless otherwise expressly agreed in writing.

2.8 High-Value Shipments
For high-value, sensitive, regulated, or commercially significant Products, the Company may implement additional security measures, including:
• enhanced packaging;
• shipment insurance;
• signature upon delivery;
• identity verification;
• GPS tracking;
• secure transportation;
• restricted handling procedures; and
• additional delivery verification requirements.

The Company may decline shipment where appropriate security measures cannot reasonably be implemented.

2.9 Restricted Deliveries
The Company may refuse, delay, suspend, or cancel shipment where:
• delivery is prohibited by law;
• regulatory approvals are unavailable;
• sanctions or trade restrictions apply;
• fraud is reasonably suspected;
• security concerns exist;
• payment remains outstanding;
• required documentation has not been provided;
• the delivery location is inaccessible; or
• other circumstances make shipment commercially unreasonable.

Such actions shall not constitute a breach of this Policy where taken in good faith and in compliance with applicable law.

2.10 Shipping Confirmation
Upon dispatch of a shipment, the Company may provide one or more of the following:
• shipment confirmation;
• tracking number;
• carrier details;
• estimated delivery date;
• shipment status updates;
• dispatch documentation;
• invoice references; and
• other commercially relevant shipping information.

Estimated delivery dates are provided for informational purposes only and do not constitute guaranteed delivery commitments unless expressly agreed in writing.

2.11 Good Faith
The Company and Business Users shall cooperate honestly, reasonably, and in good faith throughout the shipping process. Business Users shall provide accurate shipping information, while the Company shall use commercially reasonable efforts to arrange timely shipment through appropriate logistics channels.

2.12 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930, where applicable;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• applicable Goods and Services Tax (GST) laws;
• applicable transportation, logistics, customs, export, and import regulations; and
• all other applicable commercial and regulatory laws of India.

Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 3 – Delivery Process",
      content: `3.1 Purpose
This Chapter establishes the procedures governing the delivery of Products purchased through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The purpose of this Chapter is to define the responsibilities of the Company, Business Users, suppliers, manufacturers, marketplace sellers, logistics providers, and authorized recipients during the delivery process while ensuring efficient, secure, and commercially reasonable fulfillment of Purchase Orders.

3.2 Delivery Locations
Products shall be delivered to the delivery address specified in the applicable Purchase Order or otherwise approved by the Company. Business Users shall ensure that:
• the delivery address is complete and accurate;
• the delivery location is accessible;
• appropriate unloading facilities are available where necessary;
• authorized personnel are available to receive the shipment; and
• any special delivery instructions are communicated before shipment.

The Company may refuse delivery to locations that are unsafe, inaccessible, prohibited by law, or otherwise unsuitable for commercial delivery.

3.3 Delivery Attempts
The number of delivery attempts may depend upon:
• the applicable carrier's policies;
• Product type;
• contractual arrangements;
• delivery location; and
• operational feasibility.

Where delivery cannot be completed after reasonable attempts, the shipment may:
• be returned to the dispatch location;
• be held at a designated logistics facility;
• require rescheduling;
• incur additional delivery charges; or
• be treated in accordance with the applicable Purchase Order or commercial agreement.

3.4 Delivery Verification
To ensure secure delivery, the Company or its logistics partners may require one or more of the following:
• signature upon delivery;
• official identification of the recipient;
• company authorization;
• delivery confirmation code;
• electronic proof of delivery;
• digital acknowledgement;
• biometric verification, where legally permitted; or
• any other commercially reasonable verification method.

Failure to satisfy delivery verification requirements may result in delayed or refused delivery.

3.5 Authorized Recipients
Products may be delivered only to:
• the Business User;
• an authorized representative;
• an employee designated by the Business User;
• an authorized procurement officer;
• a warehouse representative;
• an authorized logistics coordinator; or
• any other individual authorized by the Business User.

The Company may rely upon reasonable evidence of such authorization without further verification unless circumstances indicate otherwise.

3.6 Partial Deliveries
Where operationally necessary, the Company may deliver Products in multiple consignments. Partial deliveries may occur due to:
• inventory availability;
• supplier fulfillment schedules;
• warehouse allocation;
• transportation capacity;
• Product availability;
• customs clearance;
• regulatory requirements; or
• other commercially reasonable circumstances.

Each completed partial delivery shall constitute a separate delivery for the Products delivered, unless otherwise agreed in writing.

3.7 Delivery Delays
Delivery schedules may be affected by:
• adverse weather;
• transportation disruptions;
• carrier delays;
• supplier delays;
• customs inspections;
• regulatory requirements;
• labor disruptions;
• public holidays;
• force majeure events; or
• other circumstances beyond the Company's reasonable control.

The Company shall use commercially reasonable efforts to notify the Business User of material delivery delays where practicable. Estimated delivery dates are indicative only unless expressly guaranteed under a separate written agreement.

3.8 Delivery Refusal
A Business User may refuse delivery where:
• the shipment materially differs from the Purchase Order;
• the Product has sustained visible transit damage;
• incorrect Products have been delivered;
• required shipping documentation is materially incomplete; or
• other substantial delivery discrepancies exist.

The Business User should document the reason for refusal and notify the Company promptly. Unreasonable refusal of delivery may result in:
• additional logistics costs;
• storage charges;
• return shipping costs; or
• cancellation charges,
where permitted under this Policy or the applicable commercial agreement.

3.9 Failed Deliveries
A delivery may be deemed unsuccessful where:
• no authorized recipient is available;
• access to the premises is denied;
• the delivery address is inaccurate;
• unloading facilities are unavailable where required;
• delivery verification cannot be completed;
• safety concerns prevent delivery; or
• other circumstances prevent successful completion of delivery.

The Company may, at its discretion:
• reschedule delivery;
• return the shipment;
• hold the shipment at a logistics facility;
• cancel the order where appropriate; or
• apply additional delivery charges where contractually permitted.

3.10 Completion of Delivery
Delivery shall be deemed complete upon:
• signature by an authorized recipient;
• successful electronic proof of delivery;
• confirmation by the authorized carrier;
• delivery to the designated delivery location in accordance with agreed delivery terms; or
• any other delivery method agreed in writing.

Completion of delivery shall not constitute acceptance of the Product, which shall remain subject to the inspection and acceptance procedures set out in this Policy.

3.11 Good Faith
The Company and the Business User shall cooperate honestly, reasonably, and in good faith throughout the delivery process. The Company shall use commercially reasonable efforts to facilitate timely delivery, while the Business User shall ensure that authorized personnel, accurate delivery information, and appropriate receiving facilities are available.

3.12 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930, where applicable;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• applicable Goods and Services Tax (GST) laws;
• applicable transportation, logistics, customs, and commercial regulations; and
• all other applicable laws and regulations of India.

Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 4 – Shipping Charges",
      content: `4.1 Purpose
This Chapter establishes the terms governing shipping charges, freight costs, logistics expenses, insurance charges, taxes, duties, and other transportation-related fees applicable to Products purchased through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The purpose of this Chapter is to ensure transparency in the allocation of shipping-related costs while maintaining commercially reasonable pricing practices and compliance with applicable contractual and legal requirements.

4.2 Shipping Fees
Shipping fees may be determined based upon one or more of the following factors:
• Product dimensions;
• Product weight;
• quantity ordered;
• shipment value;
• delivery destination;
• delivery urgency;
• transportation method;
• carrier pricing;
• supplier location;
• warehouse location; and
• other commercially relevant logistics factors.

Applicable shipping charges shall be communicated before completion of the applicable Purchase Order unless otherwise agreed in writing.

4.3 Freight Charges
Freight charges may include:
• road transportation;
• air freight;
• rail transportation;
• sea freight;
• multimodal transportation;
• local delivery;
• last-mile delivery;
• intercity transportation;
• interstate transportation; and
• other logistics services required to complete delivery.

Freight charges may vary depending upon the transportation method selected or required for the shipment.

4.4 Taxes & Duties
Unless otherwise expressly stated:
• applicable Goods and Services Tax (GST);
• customs duties;
• import duties;
• export duties;
• cess;
• statutory levies;
• regulatory fees; and
• other government-imposed charges,
shall be payable in accordance with applicable law and the terms of the applicable Purchase Order or executed commercial agreement. The Company shall issue tax invoices where required under applicable law.

4.5 International Shipping Costs
For international shipments, additional charges may include:
• customs clearance fees;
• import duties;
• export documentation charges;
• destination handling charges;
• port handling fees;
• customs brokerage fees;
• regulatory inspection fees;
• international freight charges;
• foreign logistics charges; and
• other legally applicable international shipping costs.

Responsibility for such charges shall be determined by the applicable Incoterms®, Purchase Order, or executed commercial agreement.

4.6 Special Handling Charges
Additional charges may apply where shipment requires:
• oversized cargo handling;
• hazardous material handling;
• temperature-controlled transportation;
• fragile Product handling;
• secure transportation;
• specialized packaging;
• dedicated transportation;
• crane or lifting services;
• white-glove delivery services; or
• other specialized logistics services.

Such charges shall be communicated where reasonably practicable before shipment.

4.7 Insurance Charges
Where shipment insurance is requested by the Business User or required by the Company, additional insurance charges may apply. Insurance premiums may depend upon:
• Product value;
• transportation method;
• shipment destination;
• carrier requirements;
• nature of the Product;
• regulatory requirements; and
• applicable insurance provider terms.

Insurance coverage shall remain subject to the terms and conditions of the applicable insurer.

4.8 Additional Logistics Costs
Additional logistics charges may arise due to:
• repeated delivery attempts;
• incorrect delivery addresses;
• rescheduled deliveries;
• storage fees;
• demurrage charges;
• detention charges;
• unloading assistance;
• customs delays attributable to the Business User;
• return transportation; or
• other commercially reasonable logistics expenses incurred due to circumstances attributable to the Business User.

The Company shall use commercially reasonable efforts to notify the Business User before imposing such charges where practicable.

4.9 Payment of Shipping Charges
Unless otherwise agreed in writing:
• shipping charges shall be payable in accordance with the applicable Purchase Order;
• freight charges may be collected in advance or invoiced separately;
• logistics charges may be deducted from the Corporate Wallet where authorized;
• applicable taxes shall be collected in accordance with law; and
• unpaid shipping charges may result in delayed shipment, suspension of delivery, or other remedies available under the Business User Agreement or Business Terms & Conditions.

The Company reserves the right to withhold shipment until all applicable shipping-related charges have been paid where payment in advance has been agreed.

4.10 Good Faith
The Company and the Business User shall act honestly, reasonably, and in good faith regarding shipping charges and logistics costs. The Company shall use commercially reasonable efforts to ensure that shipping charges accurately reflect the logistics services provided, while the Business User shall promptly satisfy all agreed shipping-related payment obligations.

4.11 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930, where applicable;
• the Companies Act, 2013;
• the Central Goods and Services Tax Act, 2017, and applicable State Goods and Services Tax laws;
• the Customs Act, 1962, where applicable;
• the Information Technology Act, 2000;
• applicable transportation, logistics, export, and import regulations; and
• all other applicable commercial and regulatory laws of India.

Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 5 – Risk of Loss & Title",
      content: `5.1 Purpose
This Chapter establishes the allocation of risk, transfer of title, insurance responsibilities, and ownership rights relating to Products shipped through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The purpose of this Chapter is to clearly define when the risk of loss or damage and legal ownership of Products transfer between the Parties, thereby ensuring commercial certainty and minimizing disputes arising during transportation and delivery. This Chapter shall be interpreted together with the applicable Purchase Order, executed commercial agreement, and any agreed Incoterms®.

5.2 Transfer of Risk
Unless otherwise expressly agreed in writing or required by applicable law, the risk of accidental loss, theft, destruction, or damage to the Product shall transfer in accordance with:
• the applicable Purchase Order;
• the executed commercial agreement;
• the agreed Incoterms®, where applicable; or
• this Policy.

Where no alternative arrangement exists, the transfer of risk shall generally occur upon successful delivery of the Product to the Business User or its authorized representative at the agreed delivery location.

5.3 Transfer of Title
Legal title and ownership of the Product shall transfer to the Business User only upon:
• full payment of the applicable purchase price, unless otherwise agreed in writing;
• completion of delivery in accordance with the agreed delivery terms; and
• satisfaction of any additional contractual conditions expressly agreed between the Parties.

Until title passes, the Company or the applicable supplier shall retain ownership of the Product to the extent permitted by applicable law.

5.4 Incoterms®
Where the Parties expressly incorporate Incoterms® into a Purchase Order or executed commercial agreement, the applicable Incoterms® published by the International Chamber of Commerce shall govern:
• allocation of transportation responsibilities;
• transfer of risk;
• allocation of shipping costs;
• export obligations;
• import obligations;
• customs responsibilities; and
• delivery obligations.

In the event of any inconsistency between this Policy and the applicable Incoterms®, the agreed Incoterms® shall prevail to the extent of such inconsistency.

5.5 Damage During Transit
Where a Product is damaged during transportation, the Business User shall:
• inspect the shipment promptly upon delivery;
• document visible damage where reasonably practicable;
• retain all packaging materials where required for investigation;
• notify the Company without undue delay;
• cooperate with any inspection or investigation conducted by the Company, carrier, insurer, supplier, or manufacturer; and
• refrain from using materially damaged Products where such use may affect the investigation.

The Company shall use commercially reasonable efforts to facilitate the investigation and determine the appropriate resolution in accordance with this Policy.

5.6 Lost Shipments
Where a shipment is reasonably believed to be lost during transportation, the Company may:
• investigate the shipment with the carrier;
• obtain shipment tracking information;
• coordinate with suppliers or logistics providers;
• request supporting documentation from the Business User;
• initiate insurance claims where applicable; and
• determine the appropriate commercial remedy.

A shipment shall not be deemed lost solely because the estimated delivery date has passed.

5.7 Insurance
The Company may obtain shipment insurance where:
• required by applicable law;
• agreed under the Purchase Order;
• commercially appropriate;
• required by the logistics provider; or
• requested by the Business User.

Insurance coverage shall remain subject to:
• the insurer's terms and conditions;
• applicable policy limits;
• exclusions;
• deductibles;
• documentation requirements; and
• applicable law.

The existence of insurance shall not expand the Company's contractual liability under this Policy.

5.8 Business User Responsibilities
The Business User shall:
• provide an accurate delivery address;
• ensure the availability of an authorized recipient;
• inspect shipments upon delivery;
• report loss or damage promptly;
• preserve evidence relating to transit damage;
• cooperate with carriers and insurers during investigations; and
• take reasonable measures to mitigate further loss or damage.

Failure to comply with these responsibilities may affect the Company's ability to investigate or resolve shipping-related claims.

5.9 Reservation of Rights
Nothing contained in this Chapter shall:
• waive the Company's ownership rights before transfer of title;
• limit the Company's contractual remedies;
• prejudice the rights of suppliers, manufacturers, insurers, or logistics providers;
• affect statutory rights that cannot lawfully be excluded; or
• prevent the Company from exercising any other contractual or legal rights available under applicable law.

5.10 Good Faith
The Company and the Business User shall administer matters relating to ownership, transfer of risk, insurance, and transit claims honestly, reasonably, and in good faith. Each Party shall cooperate by providing accurate information, preserving relevant evidence, and taking commercially reasonable steps to facilitate the fair resolution of shipping-related issues.

5.11 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• the Central Goods and Services Tax Act, 2017, and applicable State Goods and Services Tax laws;
• the Customs Act, 1962, where applicable;
• applicable transportation, logistics, insurance, export, and import regulations; and
• all other applicable commercial and regulatory laws of India.

Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 6 – Inspection & Acceptance",
      content: `6.1 Purpose
This Chapter establishes the procedures governing the inspection, verification, acceptance, and reporting of Products delivered under the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The purpose of this Chapter is to ensure that delivered Products are promptly examined for conformity with the applicable Purchase Order, contractual specifications, and shipping documentation, thereby facilitating the timely identification and resolution of discrepancies. This Chapter shall be read together with:
• the Business User Agreement;
• the Business Terms & Conditions;
• the Return, Refund & Cancellation Policy;
• the Warranty Policy;
• Schedule D – Product Acceptance Procedure;
• the applicable Purchase Order; and
• any executed commercial agreement.

6.2 Inspection Upon Delivery
The Business User shall inspect each shipment promptly upon delivery and before the Products are put into commercial use, installed, modified, or distributed. The inspection should include verification of:
• Product quantity;
• Product description;
• Product model;
• serial numbers;
• packaging condition;
• visible transit damage;
• accessories;
• documentation;
• warranty materials; and
• any other commercially relevant characteristics.

Failure to conduct a timely inspection may affect the Company's ability to investigate delivery-related claims.

6.3 Acceptance Procedure
A Product shall be deemed accepted where:
• the Product conforms to the applicable Purchase Order;
• no material defects or discrepancies are identified during inspection;
• the applicable inspection period expires without written notice of rejection;
• the Product is installed, deployed, resold, modified, or otherwise placed into commercial use without objection; or
• acceptance is otherwise confirmed in writing by the Business User.

Acceptance shall not limit any warranty rights that remain available under the applicable warranty terms.

6.4 Reporting Damage
Where visible damage or shortages are identified, the Business User shall, without undue delay:
• notify the Company;
• record the nature of the damage;
• preserve the original packaging where reasonably practicable;
• obtain supporting photographs or videos where available;
• cooperate with the carrier, insurer, supplier, or manufacturer during any investigation; and
• refrain from further handling of materially damaged Products unless necessary to prevent additional damage.

The Company may require additional documentation before determining the appropriate remedy.

6.5 Missing Items
Where any Product, component, accessory, or documentation is missing from a shipment, the Business User shall promptly notify the Company with details including:
• Purchase Order number;
• invoice number;
• shipment reference;
• Product details;
• quantity received;
• quantity missing; and
• any other information reasonably requested.

The Company shall investigate the reported shortage and determine the appropriate commercial resolution.

6.6 Incorrect Deliveries
If the Business User receives Products that materially differ from the applicable Purchase Order, the Business User shall promptly notify the Company. The Company may, after verification:
• arrange replacement;
• arrange return shipment;
• issue a Credit Note;
• provide a refund where appropriate;
• correct the shipment; or
• implement another commercially reasonable resolution.

Incorrect delivery shall not automatically entitle the Business User to reject unaffected Products delivered under the same shipment.

6.7 Acceptance by Use
A Product may be deemed accepted where the Business User:
• installs the Product;
• integrates the Product into its operations;
• modifies the Product;
• resells the Product;
• transfers the Product to another party;
• consumes the Product; or
• otherwise places the Product into commercial use,
except where the defect could not reasonably have been identified during the initial inspection. Nothing in this clause shall limit statutory rights or applicable warranty rights.

6.8 Technical Inspection
Where necessary, the Company may conduct or arrange a technical inspection of returned or disputed Products through:
• the Company;
• manufacturers;
• suppliers;
• authorized distributors;
• authorized service centers;
• independent technical experts; or
• other qualified representatives.

Technical inspection may include:
• functional testing;
• diagnostic analysis;
• firmware verification;
• hardware inspection;
• serial number verification;
• authenticity verification; and
• other commercially reasonable technical evaluations.

The findings of such inspection shall assist in determining the appropriate resolution under the applicable policies.

6.9 Inspection Records
The Company may maintain records relating to Product inspection and acceptance, including:
• inspection reports;
• delivery confirmations;
• photographs;
• shipment documentation;
• correspondence;
• technical reports;
• serial number records;
• acceptance confirmations; and
• other operational records reasonably necessary for commercial, legal, audit, quality assurance, or regulatory purposes.

Such records shall be retained in accordance with applicable law and the Company's record retention policies.

6.10 Good Faith
The Company and the Business User shall perform inspection and acceptance procedures honestly, reasonably, and in good faith. Each Party shall provide accurate information, preserve relevant evidence, and cooperate in resolving inspection-related issues efficiently and fairly.

6.11 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023, where applicable;
• the Central Goods and Services Tax Act, 2017, and applicable State Goods and Services Tax laws;
• applicable transportation, logistics, and commercial regulations; and
• all other applicable laws and regulations of India.

Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 7 – Delivery Delays & Force Majeure",
      content: `7.1 Purpose
This Chapter establishes the policies governing delivery delays, transportation disruptions, force majeure events, and other circumstances that may affect the timely shipment or delivery of Products purchased through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The purpose of this Chapter is to allocate responsibilities fairly, establish commercially reasonable expectations, and define the rights and obligations of the Company and Business Users when delivery cannot be completed within the estimated timeframe.

7.2 Estimated Delivery Times
Any delivery dates, estimated shipping schedules, or transit times communicated by the Company are provided in good faith for planning purposes only. Estimated delivery periods may depend upon:
• Product availability;
• supplier processing times;
• warehouse operations;
• transportation capacity;
• carrier performance;
• customs clearance;
• regulatory inspections;
• destination location; and
• other operational factors.

Unless expressly agreed in writing, estimated delivery dates shall not constitute guaranteed delivery commitments.

7.3 Events Beyond the Company's Reasonable Control
Delivery delays may occur due to circumstances beyond the Company's reasonable control, including:
• adverse weather conditions;
• floods;
• earthquakes;
• storms;
• fires;
• pandemics;
• epidemics;
• labor disputes;
• transportation accidents;
• infrastructure failures;
• fuel shortages;
• government restrictions;
• border closures;
• security concerns; or
• other extraordinary events.

The occurrence of such events shall not, by itself, constitute a breach of this Policy.

7.4 Supplier Delays
The Company may rely upon manufacturers, suppliers, distributors, marketplace sellers, and fulfillment partners for the supply and dispatch of Products. Where delays arise due to:
• manufacturing schedules;
• inventory shortages;
• production interruptions;
• supplier operational issues;
• quality inspections;
• supplier compliance requirements; or
• other supplier-related circumstances,
the Company shall use commercially reasonable efforts to coordinate with the relevant supplier and provide updated shipment information to the Business User where practicable.

7.5 Customs Delays
For international shipments, delivery may be delayed due to:
• customs inspections;
• import clearance;
• export clearance;
• regulatory approvals;
• trade compliance reviews;
• quarantine procedures;
• documentation verification; or
• other governmental processes.

The Company shall not be responsible for delays arising solely from actions or decisions of customs authorities or other governmental agencies beyond its reasonable control.

7.6 Carrier Delays
The Company utilizes independent logistics providers and transportation partners. Accordingly, delivery schedules may be affected by:
• carrier operational issues;
• route disruptions;
• transportation capacity limitations;
• mechanical failures;
• workforce shortages;
• delivery network congestion;
• tracking system failures; or
• other carrier-related circumstances.

The Company shall use commercially reasonable efforts to coordinate with the applicable carrier to minimize such delays.

7.7 Business Continuity
Where commercially practicable, the Company may implement reasonable business continuity measures, including:
• alternative shipping routes;
• alternate logistics providers;
• shipment rescheduling;
• substitute warehouses;
• inventory reallocation;
• partial shipments;
• alternative fulfillment arrangements; or
• other operational measures reasonably intended to minimize delivery disruption.

Implementation of such measures shall remain subject to operational feasibility and contractual obligations.

7.8 Customer Notification
Where the Company becomes aware of a material delivery delay, it shall use commercially reasonable efforts to notify the Business User through one or more authorized communication channels. Such notification may include:
• the reason for the delay;
• revised estimated delivery timelines;
• shipment status updates;
• available alternatives; and
• any actions reasonably required from the Business User.

Failure to provide immediate notification shall not create additional liability where the delay results from circumstances beyond the Company's reasonable control.

7.9 Force Majeure
Neither the Company nor the Business User shall be liable for any delay or failure in performing obligations under this Policy where such delay or failure results directly or indirectly from a Force Majeure Event, including but not limited to:
• acts of God;
• natural disasters;
• earthquakes;
• floods;
• cyclones;
• fires;
• war;
• armed conflict;
• terrorism;
• civil unrest;
• riots;
• strikes;
• lockouts;
• governmental actions;
• changes in law;
• sanctions;
• embargoes;
• pandemics;
• epidemics;
• cyberattacks affecting critical infrastructure;
• nationwide telecommunications failures;
• widespread power outages;
• transportation network failures; or
• any other event beyond the reasonable control of the affected Party.

The affected Party shall use commercially reasonable efforts to:
• mitigate the impact of the Force Majeure Event;
• resume performance as soon as reasonably practicable; and
• notify the other Party where practicable.

Where a Force Majeure Event continues for an extended period, the Parties may mutually discuss alternative arrangements or termination of the affected Purchase Order without prejudice to accrued rights.

7.10 Good Faith
The Company and the Business User shall cooperate honestly, reasonably, and in good faith during any delivery disruption. Each Party shall make commercially reasonable efforts to minimize delays, exchange relevant information promptly, and implement practical solutions to facilitate continued business operations wherever feasible.

7.11 Compliance with Applicable Law
This Chapter shall be interpreted in accordance with:
• the Indian Contract Act, 1872;
• the Sale of Goods Act, 1930;
• the Companies Act, 2013;
• the Information Technology Act, 2000;
• the Digital Personal Data Protection Act, 2023, where applicable;
• the Central Goods and Services Tax Act, 2017, and applicable State Goods and Services Tax laws;
• applicable customs, transportation, logistics, export, and import regulations; and
• all other applicable commercial and regulatory laws of India.

Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency.`
    },
    {
      title: "Chapter 8 – International Shipping",
      content: `8.1 Purpose
This Chapter establishes the policies governing international shipments arranged through the Business-to-Business ("B2B") Platform operated by Peoples League Of Electronics Private Limited ("Company", "PLE"). The purpose of this Chapter is to define the responsibilities relating to international transportation, export and import compliance, customs procedures, regulatory requirements, documentation, duties, taxes, and cross-border logistics while ensuring compliance with applicable domestic and international trade laws. This Chapter shall be interpreted together with the applicable Purchase Order, executed commercial agreement, agreed Incoterms®, and all applicable laws governing international trade.

8.2 Export Compliance
Where Products are exported from India or another jurisdiction, the Company, supplier, manufacturer, or other responsible Party shall comply with applicable export laws and regulations. Business Users shall cooperate by providing all information reasonably required for:
• export licensing;
• end-user verification;
• export declarations;
• restricted goods verification;
• sanctions screening;
• destination verification; and
• other regulatory requirements.

The Company may refuse or suspend shipment where export authorization cannot lawfully be obtained.

8.3 Import Compliance
Business Users importing Products into another jurisdiction shall be responsible for complying with applicable import laws unless otherwise expressly agreed in writing. Import responsibilities may include:
• obtaining import licenses;
• obtaining regulatory approvals;
• satisfying local certification requirements;
• providing importer information;
• customs registration;
• product registration; and
• compliance with local commercial regulations.

Failure to satisfy import requirements may delay or prevent delivery.

8.4 Customs Clearance
International shipments may be subject to customs examination, inspection, clearance, and other governmental procedures. The Company or the designated customs broker may assist with customs documentation where commercially appropriate; however, customs clearance remains subject to:
• customs authority decisions;
• applicable law;
• documentation accuracy;
• regulatory approvals;
• payment of applicable duties and taxes; and
• compliance with import and export regulations.

The Company shall not be responsible for delays arising solely from customs authorities or governmental agencies acting within their legal authority.

8.5 Duties & Taxes
Unless otherwise agreed under the applicable Purchase Order, executed commercial agreement, or Incoterms®:
• customs duties;
• import duties;
• export duties;
• tariffs;
• value-added taxes (VAT);
• Goods and Services Tax (GST), where applicable;
• customs brokerage fees;
• regulatory levies; and
• other legally applicable international shipping costs,
shall be payable in accordance with applicable law and the terms of the transaction.`
    }
  ];

  return (
    <PageTransition>
      <MobileLayout showHeader={false} showBottomNav={false}>
        <div className="min-h-screen bg-gray-50/50 pb-12 pt-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
                <FiTruck className="text-[#7B0A0A]" /> Shipping and Delivery Policy
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
                This Shipping & Delivery Policy establishes the terms, conditions, procedures, and responsibilities governing shipment, transportation, delivery, logistics, and fulfillment on the B2B Platform operated by Peoples League Of Electronics Private Limited.
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
                For legal inquiries regarding shipping & delivery, please contact Legal@plebusiness.com.
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default ShippingDeliveryPolicy;
