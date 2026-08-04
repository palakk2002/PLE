<<<<<<< HEAD
import React from "react";
import { FiFileText, FiArrowLeft, FiShield } from "react-icons/fi";
=======
import { FiFileText, FiArrowLeft } from "react-icons/fi";
>>>>>>> 233065b06ba5f8d80e72b54780ca5d25e4fdaa3a
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const WarrantyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
<<<<<<< HEAD
  {
    "title": "Execution & Acknowledgement",
    "content": "Acknowledgement by the Business User that:\n• the Warranty Policy has been read and accepted;\n• it forms part of the Business User Agreement and Business Terms & Conditions;\n• it shall be read together with the Shipping & Delivery Policy, Return, Refund & Cancellation Policy, Privacy Policy, Purchase Orders, Commercial Agreements, and Schedules A–J."
  },
  {
    "title": "Document Control",
    "content": "• Document Title\n• Document Owner\n• Version\n• Effective Date\n• Approved By\n• Last Updated\n• Review Cycle\n• Governing Law  Copyright © Peoples League Of Electronics Private Limited. All Rights Reserved."
  },
  {
    "title": "Chapter 1 – Introduction",
    "content": "1.1 Purpose This Warranty Policy (\"Policy\") establishes the terms and conditions governing warranty coverage applicable to Products supplied through the Business-to-Business (\"B2B\") Platform operated by Peoples League Of Electronics Private Limited (\"Company\", \"PLE\"). The purpose of this Policy is to define the rights, obligations, and responsibilities of the Company, Business Users, manufacturers, suppliers, Marketplace Sellers, authorized service providers, and other relevant stakeholders concerning warranty coverage, warranty claims, repair services, replacement procedures, warranty exclusions, and related matters. This Policy seeks to promote transparent commercial practices while ensuring that warranty services are administered fairly, consistently, and in accordance with applicable contractual arrangements and governing law.\n\n1.2 Scope This Policy applies to:\n• all Products purchased through the Company's B2B Platform;\n• Business Users registered with the Company;\n• manufacturers;\n• original equipment manufacturers (\"OEMs\");\n• authorized distributors;\n• suppliers;\n• Marketplace Sellers;\n• logistics providers involved in warranty fulfillment;\n• authorized service centers; and\n• any other Party participating in the warranty process.  This Policy governs warranty services provided by the Company and, where applicable, manufacturer warranties passed through to Business Users.\n\n1.3 Definitions Unless the context otherwise requires, the following terms shall have the meanings assigned below: \"Business User\" means any company, partnership, proprietorship, government entity, institution, organization, or other commercial customer registered to conduct business through the Company's B2B Platform. \"Manufacturer Warranty\" means the warranty provided directly by the original manufacturer or OEM of a Product. \"PLE Limited Warranty\" means any warranty expressly provided by the Company in writing, separate from any Manufacturer Warranty. \"Warranty Period\" means the period during which warranty coverage remains valid, commencing in accordance with the applicable warranty documentation. \"Warranty Claim\" means a request submitted by a Business User seeking repair, replacement, or other warranty remedies. \"Authorized Service Center\" means a repair or service facility authorized by the Company, the manufacturer, or the OEM to perform warranty services. \"Defect\" means a material defect in workmanship, manufacturing, or materials that arises during normal intended commercial use within the applicable Warranty Period. \"RMA\" means Return Merchandise Authorization issued for warranty inspection or servicing. Capitalized terms not defined herein shall have the meanings assigned to them in the Business User Agreement or Business Terms & Conditions.\n\n1.4 Applicability This Policy applies only to commercial B2B transactions conducted through the Company's Platform. Unless expressly agreed in writing:\n• consumer protection policies applicable to retail consumers shall not apply to transactions governed by this Policy;\n• warranty rights shall be governed by the applicable commercial agreement;\n• Business Users acknowledge that they are purchasing Products for business purposes; and\n• warranty obligations may vary depending upon the manufacturer, supplier, Marketplace Seller, Product category, and applicable Purchase Order.\n\n1.5 Relationship with Other Agreements This Policy forms an integral part of the Company's enterprise legal framework and shall be read together with:\n• Business Terms & Conditions;\n• Business User Agreement;\n• Privacy Policy;\n• Shipping & Delivery Policy;\n• Return, Refund & Cancellation Policy;\n• Purchase Orders;\n• Commercial Agreements;\n• Schedule A;\n• Schedule B;\n• Schedule C;\n• Schedule D;\n• Schedule E;\n• Schedule F;\n• Schedule G;\n• Schedule H;\n• Schedule I;\n• Schedule J; and\n• any other Company policies governing commercial transactions.  In the event of any inconsistency, the executed Commercial Agreement or Purchase Order shall prevail to the extent of the inconsistency unless prohibited by applicable law.\n\n1.6 Commercial Nature of Warranty Business Users acknowledge that warranties provided under this Policy are commercial warranties intended solely for business procurement transactions. Warranty coverage is not intended to function as a product maintenance contract, insurance policy, performance guarantee, or unconditional replacement program. Except where expressly stated, the Company does not guarantee uninterrupted operation, continuous availability, or suitability of Products for every intended business application.\n\n1.7 Policy Updates The Company reserves the right to amend, modify, update, suspend, or replace this Policy at any time where reasonably necessary for:\n• compliance with applicable law;\n• regulatory changes;\n• operational improvements;\n• manufacturer requirements;\n• technological developments;\n• risk management;\n• commercial practices; or\n• other legitimate business purposes.  Updated versions shall become effective upon publication through the Company's official Platform or other authorized communication channels unless otherwise required by applicable law.\n\n1.8 Interpretation This Policy shall be interpreted:\n• fairly;\n• reasonably;\n• in accordance with accepted commercial practices;\n• consistently with the Company's governing agreements; and\n• in compliance with applicable law.  Headings are provided solely for convenience and shall not affect interpretation. Where any provision is determined to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.\n\n1.9 Good Faith The Company and every Business User shall perform their respective rights and obligations under this Policy honestly, fairly, reasonably, and in good faith. The Parties shall cooperate in the submission, investigation, processing, and resolution of warranty matters while making commercially reasonable efforts to minimize disruption to legitimate business operations.\n\n1.10 Compliance with Applicable Law This Chapter shall be interpreted in accordance with:\n• the Indian Contract Act, 1872;\n• the Sale of Goods Act, 1930;\n• the Companies Act, 2013;\n• the Information Technology Act, 2000;\n• the Digital Personal Data Protection Act, 2023, where applicable;\n• the Central Goods and Services Tax Act, 2017, and applicable State Goods and Services Tax laws;\n• applicable product safety regulations;\n• applicable commercial and contractual laws; and\n• all other applicable laws and regulations of the Republic of India.  Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency."
  },
  {
    "title": "Chapter 2 – Warranty Coverage",
    "content": "2.1 Purpose This Chapter establishes the scope of warranty coverage applicable to Products supplied through the Business-to-Business (\"B2B\") Platform operated by Peoples League Of Electronics Private Limited (\"Company\", \"PLE\"). The purpose of this Chapter is to define the nature of warranty protection, identify the warranties that may apply to Products, specify the commencement and duration of warranty coverage, and clarify the respective responsibilities of the Company, manufacturers, suppliers, Marketplace Sellers, and Business Users. Warranty coverage shall always remain subject to the applicable Purchase Order, Commercial Agreement, Manufacturer Warranty documentation, and this Policy.\n\n2.2 Standard Manufacturer Warranty Unless expressly stated otherwise, Products supplied through the Company's Platform are covered by the warranty provided by their respective manufacturer or Original Equipment Manufacturer (\"OEM\"). Manufacturer Warranty coverage shall be governed by:\n• the manufacturer's warranty documentation;\n• OEM warranty terms;\n• product-specific warranty conditions;\n• applicable service manuals;\n• warranty registration requirements;\n• applicable law; and\n• any additional documentation issued by the manufacturer.  The Company facilitates access to Manufacturer Warranty services where commercially reasonable but does not modify, expand, or replace such warranty unless expressly agreed in writing.\n\n2.3 PLE Limited Warranty Where expressly provided in writing, the Company may offer a separate PLE Limited Warranty for specific Products or services. Such warranty may apply to:\n• installation services;\n• configuration services;\n• integration services;\n• value-added services;\n• Company-performed repairs;\n• refurbished Products;\n• Company-branded Products; or\n• other services expressly identified by the Company.  A PLE Limited Warranty shall apply only where expressly stated in the applicable Purchase Order, Commercial Agreement, invoice, warranty certificate, or other written Company documentation. No employee, representative, supplier, Marketplace Seller, or third party may create or extend a Company warranty unless authorized in writing by the Company.\n\n2.4 Warranty Period The applicable Warranty Period shall commence as specified in the relevant Manufacturer Warranty, PLE Limited Warranty, Purchase Order, Commercial Agreement, or other applicable warranty documentation. Unless otherwise agreed in writing, the Warranty Period may commence upon:\n• delivery of the Product;\n• acceptance of the Product by the Business User;\n• installation by an authorized service provider;\n• activation of licensed hardware or equipment;\n• commissioning of the Product; or\n• such other event as specified by the applicable warranty documentation.  Warranty coverage automatically expires upon expiration of the applicable Warranty Period unless extended through an authorized written agreement.\n\n2.5 Covered Defects Subject to the applicable warranty terms, warranty coverage generally applies to defects arising from:\n• manufacturing defects;\n• defects in workmanship;\n• defective materials;\n• factory assembly defects;\n• failures occurring during normal intended commercial use;\n• defects covered under applicable Manufacturer Warranty programs; or\n• defects expressly covered by a PLE Limited Warranty.  Warranty coverage shall not extend beyond the scope expressly provided by the applicable warranty documentation.\n\n2.6 Warranty Commencement Warranty coverage shall become effective only after:\n• lawful completion of the sale transaction;\n• receipt or confirmation of payment, where applicable;\n• successful delivery or acceptance of the Product, where required;\n• compliance with applicable registration requirements, where required;\n• satisfaction of any activation procedures specified by the manufacturer; and\n• fulfillment of other applicable contractual conditions.  The Company reserves the right to verify the commencement date using invoices, shipment records, activation records, Purchase Orders, or other commercial documentation.\n\n2.7 Warranty Documentation Business Users shall retain appropriate records necessary to establish warranty eligibility, including:\n• tax invoices;\n• Purchase Orders;\n• delivery documentation;\n• warranty certificates;\n• serial numbers;\n• product activation records;\n• installation reports;\n• service reports;\n• acceptance certificates; and\n• any additional documentation reasonably required to verify warranty coverage.  Failure to produce reasonable evidence of warranty entitlement may delay or prevent warranty processing.\n\n2.8 Transferability of Warranty Unless expressly permitted by:\n• the applicable Manufacturer Warranty;\n• the PLE Limited Warranty;\n• the applicable Commercial Agreement; or\n• written authorization issued by the Company,  warranty coverage shall apply only to the original Business User identified in the relevant transaction records. Where transfer of warranty is permitted, the Company may require:\n• proof of lawful transfer;\n• updated ownership documentation;\n• revised registration information; and\n• any other documentation reasonably necessary to verify eligibility.  Transferability of warranty shall remain subject to applicable contractual and legal requirements.\n\n2.9 Good Faith The Company and the Business User shall exercise their respective rights and obligations relating to warranty coverage honestly, reasonably, and in good faith. The Business User shall provide accurate information concerning warranty eligibility, while the Company shall administer warranty coverage fairly, consistently, and in accordance with applicable contractual obligations.\n\n2.10 Compliance with Applicable Law This Chapter shall be interpreted in accordance with:\n• the Indian Contract Act, 1872;\n• the Sale of Goods Act, 1930;\n• the Companies Act, 2013;\n• the Information Technology Act, 2000;\n• the Digital Personal Data Protection Act, 2023, where applicable;\n• the Central Goods and Services Tax Act, 2017, and applicable State Goods and Services Tax laws;\n• applicable product safety regulations;\n• applicable manufacturer warranty requirements; and\n• all other applicable commercial and regulatory laws of the Republic of India.  Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency."
  },
  {
    "title": "Chapter 3 – Warranty Exclusions",
    "content": "3.1 Purpose This Chapter establishes the circumstances under which warranty coverage shall not apply to Products supplied through the Business-to-Business (\"B2B\") Platform operated by Peoples League Of Electronics Private Limited (\"Company\", \"PLE\"). The purpose of this Chapter is to clearly define exclusions from warranty coverage, allocate commercial risk appropriately, prevent misuse of warranty services, and ensure that warranty claims are administered fairly and consistently. Warranty exclusions contained herein shall apply unless otherwise expressly agreed in writing by the Company or required by applicable law.\n\n3.2 Improper Installation Warranty coverage shall not apply to defects, failures, or damage arising directly or indirectly from:\n• improper installation;\n• installation performed by unauthorized personnel;\n• failure to follow installation instructions;\n• incorrect electrical connections;\n• improper network configuration;\n• incompatible hardware installation;\n• failure to comply with environmental requirements; or\n• any installation contrary to manufacturer specifications.  Where installation by an authorized service provider is a condition of warranty coverage, installation performed by unauthorized persons may void the applicable warranty.\n\n3.3 Misuse & Abuse Warranty coverage shall not apply where damage results from:\n• misuse;\n• abuse;\n• negligence;\n• improper handling;\n• unauthorized modification;\n• operation beyond specified limits;\n• operation contrary to user manuals;\n• improper storage;\n• improper transportation after delivery;\n• intentional damage; or\n• use for purposes other than those intended by the manufacturer.  Business Users are responsible for ensuring that Products are operated in accordance with applicable operating instructions.\n\n3.4 Unauthorized Repairs Warranty coverage shall not apply where:\n• repairs are performed by unauthorized persons;\n• Products are disassembled without authorization;\n• unauthorized replacement parts are installed;\n• firmware is modified without authorization;\n• hardware components are altered;\n• security mechanisms are bypassed; or\n• Product integrity is otherwise compromised through unauthorized repair activities.  Routine maintenance expressly permitted by the manufacturer shall not constitute an unauthorized repair.\n\n3.5 Physical Damage Unless expressly covered under the applicable warranty documentation, warranty coverage shall not extend to physical damage resulting from:\n• accidental impact;\n• dropping;\n• crushing;\n• improper packaging;\n• liquid exposure;\n• fire damage;\n• corrosion;\n• contamination;\n• excessive vibration;\n• excessive heat;\n• excessive moisture;\n• pest infestation;\n• environmental contamination; or\n• any other external physical cause unrelated to manufacturing defects.\n\n3.6 Consumables & Wear Items Warranty coverage generally does not apply to normal wear and tear or consumable components, including:\n• batteries;\n• printer cartridges;\n• toner;\n• ink;\n• cables subject to ordinary wear;\n• filters;\n• fuses;\n• protective coverings;\n• packaging materials;\n• accessories designated as consumables; and\n• other components expected to deteriorate through ordinary commercial use.  Where manufacturers provide separate warranties for consumables, such warranties shall apply in accordance with the applicable manufacturer documentation.\n\n3.7 Software Issues Unless expressly included within the applicable warranty, warranty coverage shall not apply to:\n• software defects;\n• software configuration errors;\n• operating system corruption;\n• malware;\n• ransomware;\n• computer viruses;\n• unauthorized software installation;\n• software incompatibility;\n• data corruption;\n• loss of software licenses;\n• cybersecurity incidents; or\n• failures caused by third-party software.  Software support, updates, licensing, and maintenance shall be governed by the applicable software license agreement.\n\n3.8 Force Majeure Damage Warranty coverage shall not apply to damage resulting directly or indirectly from Force Majeure Events, including but not limited to:\n• floods;\n• earthquakes;\n• cyclones;\n• storms;\n• lightning;\n• fires;\n• war;\n• terrorism;\n• civil unrest;\n• governmental action;\n• pandemics;\n• epidemics;\n• widespread power failures;\n• transportation disasters; or\n• any other event beyond the reasonable control of the Company or manufacturer.  Nothing in this Clause shall limit any statutory rights that cannot lawfully be excluded.\n\n3.9 Third-Party Products The Company shall not provide warranty coverage for Products manufactured or supplied by third parties except:\n• as expressly provided under a PLE Limited Warranty;\n• where the Company has expressly assumed warranty obligations in writing; or\n• where applicable law imposes non-excludable obligations.  Third-party Products shall remain subject to the warranty terms issued by their respective manufacturers, OEMs, suppliers, or Marketplace Sellers. The Company may facilitate communication between the Business User and the applicable manufacturer or supplier but shall not thereby assume independent warranty obligations.\n\n3.10 Good Faith The Company and the Business User shall administer and exercise warranty rights honestly, reasonably, and in good faith. Business Users shall refrain from submitting warranty claims relating to circumstances expressly excluded under this Chapter, while the Company shall evaluate warranty exclusions fairly, consistently, and based upon objective evidence.\n\n3.11 Compliance with Applicable Law This Chapter shall be interpreted in accordance with:\n• the Indian Contract Act, 1872;\n• the Sale of Goods Act, 1930;\n• the Companies Act, 2013;\n• the Information Technology Act, 2000;\n• the Digital Personal Data Protection Act, 2023, where applicable;\n• the Central Goods and Services Tax Act, 2017, and applicable State Goods and Services Tax laws;\n• applicable product safety regulations;\n• applicable manufacturer warranty requirements; and\n• all other applicable commercial and regulatory laws of the Republic of India.  Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency."
  },
  {
    "title": "Chapter 4 – Warranty Claims",
    "content": "4.1 Purpose This Chapter establishes the procedures governing the submission, verification, evaluation, processing, and resolution of warranty claims relating to Products supplied through the Business-to-Business (\"B2B\") Platform operated by Peoples League Of Electronics Private Limited (\"Company\", \"PLE\"). The purpose of this Chapter is to ensure that warranty claims are handled efficiently, consistently, transparently, and in accordance with applicable contractual obligations, manufacturer requirements, and governing law.\n\n4.2 Eligibility A Business User may submit a warranty claim only if:\n• the Product is covered by a valid Manufacturer Warranty or PLE Limited Warranty;\n• the Warranty Period has not expired;\n• the Product has been used in accordance with the applicable operating instructions;\n• the claimed defect falls within the scope of the applicable warranty;\n• the Business User has complied with applicable warranty conditions; and\n• the claim is supported by the documentation reasonably required by the Company.  Submission of a warranty claim does not automatically entitle the Business User to repair, replacement, refund, or any other remedy.\n\n4.3 Claim Submission Warranty claims shall be submitted through one or more official communication channels designated by the Company. A warranty claim should include, where applicable:\n• Business Account identification;\n• Purchase Order number;\n• invoice number;\n• Product details;\n• serial number;\n• model number;\n• date of purchase;\n• date of delivery;\n• description of the defect;\n• photographs or videos demonstrating the reported issue, where reasonably available;\n• installation details;\n• troubleshooting steps already performed; and\n• any additional information reasonably requested by the Company.  Incomplete submissions may delay claim processing.\n\n4.4 Required Documentation The Company may require one or more of the following documents before processing a warranty claim:\n• tax invoice;\n• Purchase Order;\n• delivery acknowledgment;\n• warranty certificate;\n• installation report;\n• commissioning report;\n• proof of payment, where applicable;\n• Product registration records;\n• service history;\n• maintenance records;\n• previous repair records; and\n• any additional documentation reasonably necessary to verify warranty eligibility.  Failure to provide reasonably requested documentation may result in suspension or rejection of the warranty claim.\n\n4.5 Claim Verification Upon receipt of a warranty claim, the Company may undertake commercially reasonable verification procedures, including:\n• verification of Product serial numbers;\n• verification of purchase records;\n• confirmation of Warranty Period;\n• verification of Product authenticity;\n• review of installation records;\n• examination of service history;\n• consultation with manufacturers or suppliers;\n• technical assessment; and\n• any other reasonable verification measures.  The Company reserves the right to reject claims found to be fraudulent, inaccurate, or otherwise ineligible under this Policy.\n\n4.6 Return Merchandise Authorization (RMA) Where inspection of the Product is required, the Company may issue a Return Merchandise Authorization (\"RMA\"). An RMA may specify:\n• return authorization number;\n• shipping instructions;\n• packaging requirements;\n• designated service location;\n• documentation requirements;\n• return deadlines;\n• inspection procedures; and\n• any additional conditions applicable to the return.  Business Users shall not return Products for warranty inspection without obtaining an RMA where required by the Company or the applicable manufacturer. Issuance of an RMA does not constitute acceptance of the warranty claim.\n\n4.7 Inspection Procedure Returned Products may undergo inspection by:\n• the Company;\n• the manufacturer;\n• the Original Equipment Manufacturer (OEM);\n• an authorized service center;\n• an authorized technical representative; or\n• another qualified inspection entity designated by the Company.  Inspection may include:\n• visual examination;\n• functional testing;\n• diagnostic analysis;\n• verification of serial numbers;\n• confirmation of warranty status;\n• assessment of reported defects;\n• review for signs of misuse, unauthorized modification, or physical damage; and\n• any other commercially reasonable technical evaluation.  The inspection findings shall determine whether the warranty claim qualifies for coverage.\n\n4.8 Claim Timelines The Company shall use commercially reasonable efforts to process warranty claims within a reasonable timeframe. Processing times may vary depending upon:\n• Product type;\n• technical complexity;\n• manufacturer response times;\n• availability of replacement parts;\n• availability of replacement Products;\n• inspection requirements;\n• logistics arrangements;\n• customs procedures, where applicable;\n• supplier coordination; and\n• other operational circumstances.  Estimated processing timelines are indicative only and shall not constitute contractual guarantees unless expressly agreed in writing.\n\n4.9 Good Faith The Company and the Business User shall cooperate honestly, reasonably, and in good faith throughout the warranty claims process. Business Users shall provide accurate and complete information, preserve the condition of the Product pending inspection, and cooperate with reasonable verification procedures. The Company shall evaluate claims objectively, consistently, and without unreasonable delay, based upon the available evidence and applicable warranty terms.\n\n4.10 Compliance with Applicable Law This Chapter shall be interpreted in accordance with:\n• the Indian Contract Act, 1872;\n• the Sale of Goods Act, 1930;\n• the Companies Act, 2013;\n• the Information Technology Act, 2000;\n• the Digital Personal Data Protection Act, 2023, where applicable;\n• the Central Goods and Services Tax Act, 2017, and applicable State Goods and Services Tax laws;\n• applicable product safety regulations;\n• applicable manufacturer warranty requirements; and\n• all other applicable commercial and regulatory laws of the Republic of India.  Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency."
  },
  {
    "title": "Chapter 5 – Repair, Replacement & Remedies",
    "content": "5.1 Purpose This Chapter establishes the remedies available under applicable Manufacturer Warranties and PLE Limited Warranties for Products supplied through the Business-to-Business (\"B2B\") Platform operated by Peoples League Of Electronics Private Limited (\"Company\", \"PLE\"). The purpose of this Chapter is to define the Company's approach to repair, replacement, refurbishment, refund eligibility, and other warranty remedies while ensuring commercially reasonable, consistent, and legally compliant administration of warranty obligations. Nothing contained in this Chapter shall expand the scope of any warranty beyond that expressly provided under the applicable Manufacturer Warranty, PLE Limited Warranty, Purchase Order, or Commercial Agreement.\n\n5.2 Repair Rights Where a valid warranty claim is approved, the Company, manufacturer, Original Equipment Manufacturer (\"OEM\"), supplier, Marketplace Seller, or authorized service provider may, at its sole discretion and subject to applicable law, elect to:\n• repair the Product;\n• replace defective components;\n• install replacement parts;\n• restore Product functionality;\n• perform software or firmware updates where covered;\n• provide technical servicing; or\n• implement any other commercially reasonable corrective measure.  Repair shall ordinarily be the preferred remedy unless repair is commercially impracticable or otherwise inconsistent with the applicable warranty.\n\n5.3 Replacement Products Where repair is not reasonably possible or economically practical, the applicable warranty provider may provide a replacement Product. Replacement Products may be:\n• new Products;\n• manufacturer-certified refurbished Products;\n• equivalent Products of similar specifications;\n• successor models;\n• upgraded models, where the original model has been discontinued; or\n• other commercially equivalent Products.  The selection of the replacement Product shall remain subject to product availability and the applicable warranty terms.\n\n5.4 Refurbished Components Where permitted under the applicable Manufacturer Warranty or PLE Limited Warranty, repairs may be performed using:\n• new replacement parts;\n• refurbished components;\n• reconditioned components;\n• remanufactured components;\n• manufacturer-approved replacement assemblies; or\n• other components meeting equivalent quality and performance standards.  Use of refurbished components shall not, by itself, constitute a reduction in warranty quality where such components comply with applicable manufacturer specifications.\n\n5.5 Equivalent Products If an identical Product is unavailable due to discontinuation, supply shortages, end-of-life status, or other commercial reasons, the Company or applicable warranty provider may offer a Product that is substantially equivalent in:\n• functionality;\n• performance;\n• technical specifications;\n• compatibility;\n• intended commercial use; and\n• overall value.  The Company shall not be obligated to provide a Product with materially superior specifications unless expressly required under the applicable warranty.\n\n5.6 Refund Eligibility Refunds shall generally not be the primary warranty remedy. A refund may be considered only where:\n• repair is not reasonably possible;\n• replacement is unavailable;\n• the applicable warranty expressly permits a refund;\n• the applicable Commercial Agreement provides for a refund; or\n• applicable law requires a refund.  Where a refund is approved, the Company may determine the refund amount after considering:\n• the applicable contractual terms;\n• depreciation, where permitted by law;\n• prior warranty remedies already provided;\n• usage of the Product, where contractually relevant; and\n• any other commercially reasonable factors permitted under applicable law.\n\n5.7 Repair Timeframes The Company shall use commercially reasonable efforts to complete warranty repairs within a reasonable period. Repair timelines may depend upon:\n• Product complexity;\n• availability of replacement parts;\n• manufacturer support;\n• supplier coordination;\n• logistics arrangements;\n• customs procedures;\n• technical inspection requirements;\n• service center capacity; and\n• other operational circumstances.  Estimated repair timelines are indicative only and shall not constitute contractual guarantees unless expressly agreed in writing.\n\n5.8 Shipping Responsibilities Unless otherwise agreed in writing or required under the applicable warranty:\n• the Business User may be responsible for shipping the Product to the designated service center;\n• the Company, manufacturer, or authorized service provider may bear return shipping costs where covered under the applicable warranty;\n• international shipping costs may be allocated in accordance with the applicable Commercial Agreement or Incoterms®;\n• shipping risks shall remain subject to the Shipping & Delivery Policy; and\n• the Business User shall package Products appropriately to prevent transit damage.  The Company may refuse responsibility for damage caused by improper packaging during warranty transportation.\n\n5.9 Good Faith The Company and the Business User shall cooperate honestly, reasonably, and in good faith throughout the repair, replacement, and warranty remedy process. The Company shall make commercially reasonable efforts to provide appropriate warranty remedies consistent with the applicable warranty terms, while the Business User shall cooperate with inspection procedures, shipping requirements, and other reasonable requests necessary for the efficient resolution of warranty claims.\n\n5.10 Compliance with Applicable Law This Chapter shall be interpreted in accordance with:\n• the Indian Contract Act, 1872;\n• the Sale of Goods Act, 1930;\n• the Companies Act, 2013;\n• the Information Technology Act, 2000;\n• the Digital Personal Data Protection Act, 2023, where applicable;\n• the Central Goods and Services Tax Act, 2017, and applicable State Goods and Services Tax laws;\n• applicable product safety regulations;\n• applicable manufacturer warranty requirements; and\n• all other applicable commercial and regulatory laws of the Republic of India.  Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency."
  },
  {
    "title": "Chapter 6 – Logistics & Service Centers",
    "content": "6.1 Purpose This Chapter establishes the policies governing logistics, transportation, authorized service centers, repair facilities, warranty shipping, and service availability for Products covered under the Business-to-Business (\"B2B\") Warranty Policy of Peoples League Of Electronics Private Limited (\"Company\", \"PLE\"). The purpose of this Chapter is to define the respective responsibilities of the Company, manufacturers, Original Equipment Manufacturers (\"OEMs\"), suppliers, Marketplace Sellers, logistics providers, authorized service centers, and Business Users in connection with warranty servicing while ensuring commercially reasonable, secure, and efficient handling of Products requiring warranty support.\n\n6.2 Authorized Service Centers Warranty services shall ordinarily be performed only by:\n• the manufacturer;\n• the Original Equipment Manufacturer (OEM);\n• Company-authorized service centers;\n• manufacturer-authorized service partners;\n• authorized repair facilities;\n• designated technical support providers; or\n• other service providers expressly approved in writing by the Company or the applicable manufacturer.  Warranty coverage may be denied where repairs are performed by unauthorized service providers unless otherwise required by applicable law.\n\n6.3 On-Site Service Where expressly provided under the applicable Manufacturer Warranty, PLE Limited Warranty, Purchase Order, or Commercial Agreement, warranty service may be performed at the Business User's premises. On-site warranty service may be subject to:\n• geographical availability;\n• technical feasibility;\n• service engineer availability;\n• safety requirements;\n• business operating hours;\n• site accessibility;\n• infrastructure readiness;\n• compliance with security procedures; and\n• any additional conditions specified by the Company or the applicable manufacturer.  The Company reserves the right to determine whether a Product qualifies for on-site service.\n\n6.4 Depot Service Where on-site service is unavailable or commercially impracticable, the Business User may be required to send the Product to an authorized depot or designated repair facility. Depot service may include:\n• diagnostic evaluation;\n• technical inspection;\n• repair;\n• component replacement;\n• software restoration;\n• firmware updates, where covered;\n• quality assurance testing; and\n• final inspection before return shipment.  The Business User shall package the Product appropriately for transportation in accordance with the Company's shipping instructions.\n\n6.5 Shipping for Warranty Repairs Where shipment of a Product is necessary for warranty servicing, the Company may provide shipping instructions, including:\n• Return Merchandise Authorization (RMA) requirements;\n• designated shipping addresses;\n• approved logistics providers;\n• packaging requirements;\n• shipping documentation;\n• customs documentation, where applicable;\n• insurance recommendations; and\n• tracking requirements.  Failure to comply with reasonable shipping instructions may delay warranty processing or result in rejection of the shipment.\n\n6.6 Return Shipping Following completion of warranty service, the repaired or replacement Product may be returned to the Business User using a logistics provider selected by the Company, manufacturer, or authorized service center. Return shipment shall be subject to:\n• product availability;\n• repair completion;\n• quality assurance inspection;\n• customs clearance, where applicable;\n• transportation availability; and\n• applicable shipping arrangements.  Risk of loss during return shipment shall be governed by the applicable Shipping & Delivery Policy, Commercial Agreement, Purchase Order, or applicable law.\n\n6.7 Cross-Border Warranty Service Warranty services involving international shipments may require compliance with:\n• customs regulations;\n• import procedures;\n• export controls;\n• applicable trade laws;\n• manufacturer regional warranty policies;\n• product certification requirements;\n• taxation requirements;\n• logistics restrictions; and\n• other applicable regulatory obligations.  Certain warranties may be valid only within specified geographical regions as determined by the applicable manufacturer. The Company shall not be responsible for restrictions imposed by manufacturers regarding regional warranty eligibility.\n\n6.8 Service Availability Warranty services shall remain subject to:\n• availability of replacement parts;\n• availability of technical personnel;\n• manufacturer support;\n• Product lifecycle status;\n• end-of-life declarations;\n• regional service availability;\n• transportation infrastructure;\n• governmental restrictions;\n• Force Majeure Events; and\n• other operational factors beyond the Company's reasonable control.  The Company shall use commercially reasonable efforts to facilitate warranty service but does not guarantee uninterrupted service availability.\n\n6.9 Good Faith The Company and the Business User shall cooperate honestly, reasonably, and in good faith throughout the warranty logistics process. The Business User shall provide accurate shipping information, package Products appropriately, and comply with reasonable service instructions. The Company shall coordinate with manufacturers, service centers, logistics providers, and other relevant parties to facilitate commercially reasonable warranty servicing.\n\n6.10 Compliance with Applicable Law This Chapter shall be interpreted in accordance with:\n• the Indian Contract Act, 1872;\n• the Sale of Goods Act, 1930;\n• the Companies Act, 2013;\n• the Information Technology Act, 2000;\n• the Digital Personal Data Protection Act, 2023, where applicable;\n• the Central Goods and Services Tax Act, 2017, and applicable State Goods and Services Tax laws;\n• the Customs Act, 1962, where applicable;\n• applicable transportation, logistics, product safety, export, and import regulations; and\n• all other applicable commercial and regulatory laws of the Republic of India.  Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency."
  },
  {
    "title": "Chapter 7 – Customer Responsibilities",
    "content": "7.1 Purpose This Chapter establishes the responsibilities of Business Users relating to Products covered under the Business-to-Business (\"B2B\") Warranty Policy of Peoples League Of Electronics Private Limited (\"Company\", \"PLE\"). The purpose of this Chapter is to ensure that Business Users properly use, maintain, protect, and support Products throughout the applicable Warranty Period so that warranty claims may be evaluated fairly and efficiently. Compliance with these responsibilities forms an essential condition of warranty eligibility unless otherwise prohibited by applicable law.\n\n7.2 Product Registration Where required by the applicable Manufacturer Warranty, PLE Limited Warranty, Purchase Order, or Commercial Agreement, the Business User shall register the Product within the prescribed timeframe. Registration may require submission of:\n• Product serial numbers;\n• invoice details;\n• Purchase Order information;\n• installation date;\n• commissioning records;\n• company identification details;\n• contact information; and\n• any other information reasonably required by the Company or the manufacturer.  Failure to complete mandatory registration requirements may affect warranty eligibility where permitted under applicable law.\n\n7.3 Proper Use The Business User shall use the Product:\n• strictly in accordance with the manufacturer's operating instructions;\n• only for its intended commercial purpose;\n• within specified operating conditions;\n• using approved accessories and compatible equipment;\n• in compliance with applicable safety standards;\n• in accordance with environmental specifications; and\n• in accordance with all applicable laws and regulations.  Improper use may result in denial of warranty coverage under Chapter 3 of this Policy.\n\n7.4 Preventive Maintenance Where preventive maintenance is recommended or required by the manufacturer or the Company, the Business User shall use commercially reasonable efforts to:\n• perform scheduled maintenance;\n• replace consumable components when required;\n• install recommended software or firmware updates, where applicable;\n• maintain appropriate operating conditions;\n• conduct routine inspections;\n• follow maintenance schedules; and\n• comply with manufacturer service recommendations.  Failure to perform required maintenance may affect warranty coverage where such failure directly contributes to the reported defect.\n\n7.5 Backup of Data Before submitting any Product for warranty inspection, repair, replacement, or servicing, the Business User shall, where applicable:\n• back up all business data;\n• secure confidential information;\n• remove sensitive credentials;\n• archive software configurations;\n• retain license information; and\n• preserve any other information necessary for business continuity.  The Company, manufacturer, authorized service center, or logistics provider shall not be responsible for:\n• loss of data;\n• corruption of data;\n• loss of software;\n• loss of licenses;\n• configuration changes;\n• cybersecurity incidents; or\n• interruption of business operations resulting from failure to maintain appropriate backups,  except where liability cannot lawfully be excluded.\n\n7.6 Product Security The Business User shall take commercially reasonable measures to protect Products from:\n• theft;\n• unauthorized access;\n• misuse;\n• accidental damage;\n• environmental hazards;\n• malware;\n• unauthorized software installation;\n• unauthorized hardware modification;\n• physical tampering; and\n• other reasonably foreseeable risks.  The Company may consider evidence of inadequate security when evaluating warranty claims arising from misuse or unauthorized modification.\n\n7.7 Cooperation During Inspection The Business User shall cooperate fully with reasonable warranty inspection procedures, including:\n• providing access to the Product;\n• making available relevant documentation;\n• responding to technical inquiries;\n• permitting reasonable diagnostic testing;\n• identifying reported defects;\n• preserving the Product in its current condition where practicable; and\n• complying with reasonable instructions issued by the Company or authorized service personnel.  Failure to cooperate may delay or adversely affect warranty claim processing.\n\n7.8 Preservation of Evidence Until completion of the warranty investigation, the Business User shall make commercially reasonable efforts to preserve:\n• the Product;\n• defective components;\n• original packaging, where available;\n• serial number labels;\n• photographs of the reported defect;\n• maintenance records;\n• installation records;\n• diagnostic logs;\n• communication records; and\n• any other evidence reasonably relevant to the warranty claim.  The Company may decline claims where material evidence has been intentionally destroyed, altered, or concealed in a manner that materially prejudices the investigation.\n\n7.9 Good Faith The Company and the Business User shall perform their respective obligations under this Chapter honestly, reasonably, and in good faith. The Business User shall provide accurate information, comply with reasonable warranty procedures, and avoid actions that may prejudice the fair assessment of warranty claims. The Company shall administer customer responsibilities fairly, consistently, and without imposing unreasonable requirements beyond those necessary to verify warranty eligibility.\n\n7.10 Compliance with Applicable Law This Chapter shall be interpreted in accordance with:\n• the Indian Contract Act, 1872;\n• the Sale of Goods Act, 1930;\n• the Companies Act, 2013;\n• the Information Technology Act, 2000;\n• the Digital Personal Data Protection Act, 2023, where applicable;\n• the Central Goods and Services Tax Act, 2017, and applicable State Goods and Services Tax laws;\n• applicable product safety regulations;\n• applicable manufacturer warranty requirements; and\n• all other applicable commercial and regulatory laws of the Republic of India.  Where any provision of this Chapter conflicts with mandatory legal requirements, such legal requirements shall prevail to the extent of the inconsistency."
  },
  {
    "title": "Chapter 8 – Manufacturer Warranty",
    "content": "8.1 Purpose This Chapter establishes the framework governing Manufacturer Warranties applicable to Products supplied through the Business-to-Business (\"B2B\") Platform operated by Peoples League Of Electronics Private Limited (\"Company\", \"PLE\"). The purpose of this Chapter is to define the relationship between Manufacturer Warranties, PLE Limited Warranties, suppliers, Original Equipment Manufacturers (\"OEMs\"), Marketplace Sellers, authorized service providers, and Business Users while ensuring that warranty obligations are administered in accordance with applicable contractual arrangements and governing law. Unless expressly agreed otherwise in writing, the Company primarily facilitates access to Manufacturer Warranty services and does not independently assume obligations beyond those expressly undertaken under this Policy or applicable Commercial Agreements.\n\n8.2 Pass-Through Warranty Where a Product is covered by a Manufacturer Warranty, the Company may pass through the benefits of such warranty to the Business User to the extent permitted by:\n• the manufacturer;\n• the Original Equipment Manufacturer (OEM);\n• the supplier;\n• the authorized distributor;\n• the applicable Commercial Agreement;\n• the Purchase Order; and\n• applicable law.  The scope, duration, conditions, remedies, exclusions, and limitations of the Manufacturer Warranty shall remain governed by the manufacturer's official warranty documentation. The Company shall not be deemed to have expanded or modified any Manufacturer Warranty solely by facilitating the sale of the Product.\n\n8.3 OEM Responsibilities The Original Equipment Manufacturer (OEM), manufacturer, or other applicable warranty provider shall remain responsible for obligations expressly assumed under its warranty documentation, including, where applicable:\n• repair services;\n• replacement of defective Products;\n• replacement of defective components;\n• firmware updates;\n• technical support;\n• Product recalls;\n• warranty extensions;\n• availability of spare parts; and\n• other warranty services expressly offered by the manufacturer.  The Company shall not assume responsibilities that remain exclusively with the OEM unless expressly agreed in writing.\n\n8.4 Manufacturer Service Programs Manufacturers may offer additional service programs including:\n• advance replacement programs;\n• extended warranty programs;\n• premium support services;\n• on-site maintenance;\n• preventive maintenance contracts;\n• accidental damage protection;\n• service-level agreements (SLAs);\n• technical support subscriptions; and\n• other manufacturer-specific service offerings.  Participation in such programs shall remain subject to the manufacturer's indepe <truncated 31467 bytes>\n\nNOTE: The output was truncated because it was too long. Use a more targeted query or a smaller range to get the information you need."
  }
];

  return (
    <PageTransition>
      <MobileLayout showHeader={false} showBottomNav={false}>
        <div className="min-h-screen bg-gray-50/50 pb-12 pt-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
=======
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
>>>>>>> 233065b06ba5f8d80e72b54780ca5d25e4fdaa3a
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm border border-gray-200"
<<<<<<< HEAD
              aria-label="Go Back"
=======
>>>>>>> 233065b06ba5f8d80e72b54780ca5d25e4fdaa3a
            >
              <FiArrowLeft className="text-xl text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                <FiFileText className="text-[#7B0A0A]" /> Warranty Policy
              </h1>
<<<<<<< HEAD
              <p className="text-xs text-gray-500 font-medium">
                Peoples League Of Electronics Private Limited | B2B Commercial Legal Framework
              </p>
=======
              <p className="text-xs text-gray-500 font-medium">Last updated: June 2026</p>
>>>>>>> 233065b06ba5f8d80e72b54780ca5d25e4fdaa3a
            </div>
          </div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6"
          >
<<<<<<< HEAD
            <div className="flex items-center gap-3 p-4 bg-red-50/60 rounded-xl border border-red-100">
              <FiShield className="text-2xl text-[#7B0A0A] shrink-0" />
              <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                This B2B Warranty Policy establishes the terms, conditions, procedures, and responsibilities governing warranty coverage for products supplied through the B2B Platform operated by Peoples League Of Electronics Private Limited.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-8">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <FiFileText className="text-[#7B0A0A] text-sm" /> {section.title}
                  </h2>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line font-normal">
=======
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              This Warranty Policy outlines the terms, scopes, procedures, and responsibilities governing product warranties on the PLE Platform.
            </p>

            <div className="border-t border-gray-100 pt-6 space-y-6">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-gray-800">{section.title}</h3>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
>>>>>>> 233065b06ba5f8d80e72b54780ca5d25e4fdaa3a
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-xs text-gray-500">
<<<<<<< HEAD
                If you have questions about this B2B Policy, please reach out to our B2B legal desk at b2blegal@peoplesleagueofelectronics.com.
=======
                If you have questions about this Policy, please reach out to our legal desk at legal@ple.com.
>>>>>>> 233065b06ba5f8d80e72b54780ca5d25e4fdaa3a
              </p>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default WarrantyPolicy;
