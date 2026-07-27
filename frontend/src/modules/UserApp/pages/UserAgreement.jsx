import { FiUsers, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const UserAgreement = () => {
  const navigate = useNavigate();

  const sections = [
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
            <p className="text-sm text-gray-600 leading-relaxed font-semibold">
              This Agreement details the B2C user rights, guidelines, and obligations for using our customer portal, apps, and services.
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
