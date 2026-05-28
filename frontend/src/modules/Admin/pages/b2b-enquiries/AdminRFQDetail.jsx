import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiShield,
  FiClock,
  FiFileText,
  FiFlag,
  FiInbox,
  FiTrendingUp,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheck
} from "react-icons/fi";
import { motion } from "framer-motion";
import Badge from "../../../../shared/components/Badge";
import { formatPrice } from "../../../../shared/utils/helpers";
import toast from "react-hot-toast";
import { initialB2BEnquiries } from "../../data/adminB2BEnquiryMockData";

const AdminRFQDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find corresponding enquiry
  const [enquiry, setEnquiry] = useState(() => {
    return initialB2BEnquiries.find((e) => e.id === id) || initialB2BEnquiries[0];
  });

  const [escalationReason, setEscalationReason] = useState("");
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  // If ID doesn't match any enquiry, display error
  if (!enquiry) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-gray-800">Enquiry not found</h2>
        <button
          onClick={() => navigate("/admin/b2b-enquiries/all")}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold"
        >
          Back to Enquiries
        </button>
      </div>
    );
  }

  // Update status handler
  const handleUpdateStatus = (newStatus, customComment = "") => {
    setEnquiry((prev) => {
      const defaultComment = `Status updated to ${newStatus} by Administrator.`;
      const finalComment = customComment || defaultComment;
      return {
        ...prev,
        status: newStatus,
        responseHistory: [
          ...prev.responseHistory,
          {
            stage: `Enquiry ${newStatus}`,
            user: "Admin",
            date: new Date().toISOString(),
            comment: finalComment
          }
        ]
      };
    });
    toast.success(`RFQ is now ${newStatus}`);
  };

  // Escalate enquiry
  const handleEscalate = (e) => {
    e.preventDefault();
    if (!escalationReason.trim()) {
      toast.error("Please enter a reason for escalation");
      return;
    }
    handleUpdateStatus("Under Review", `RFQ Escalated for admin action. Reason: ${escalationReason}`);
    setShowEscalateModal(false);
    setEscalationReason("");
    toast.success("Enquiry escalated to High-Tier Review");
  };

  // Flag spam
  const handleToggleSpam = () => {
    const nextFlagged = !enquiry.flagged;
    setEnquiry((prev) => ({
      ...prev,
      flagged: nextFlagged,
      flagReason: nextFlagged ? "Manually flagged for fraud assessment by Administrator." : null,
      riskScore: nextFlagged ? 92 : 0,
      responseHistory: [
        ...prev.responseHistory,
        {
          stage: nextFlagged ? "Spam Status Raised" : "Spam Flag Cleared",
          user: "Admin",
          date: new Date().toISOString(),
          comment: nextFlagged ? "Flagged for Spam verification." : "Spam flag cleared by administrator."
        }
      ]
    }));

    if (nextFlagged) {
      toast.error("Enquiry flagged as spam / fraudulent");
    } else {
      toast.success("Spam flag successfully cleared!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-[1250px] mx-auto pb-12"
    >
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={() => navigate("/admin/b2b-enquiries/all")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft strokeWidth={2.5} /> Back to B2B Enquiries
        </button>

        <div className="flex gap-2">
          <span className="text-xs text-gray-400 font-medium">RFQ Ref ID:</span>
          <span className="text-xs font-bold text-gray-800 font-mono select-all bg-gray-150 px-2 py-0.5 rounded">
            {enquiry.id}
          </span>
        </div>
      </div>

      {/* Main Header / Status Banner */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xl sm:text-2xl font-black text-gray-900 font-mono">{enquiry.enquiryNumber}</span>
            <Badge
              variant={
                enquiry.status === "Approved" || enquiry.status === "Quotation Sent"
                  ? "success"
                  : enquiry.status === "Rejected"
                  ? "danger"
                  : enquiry.status === "Pending"
                  ? "warning"
                  : "info"
              }
            >
              {enquiry.status}
            </Badge>
            <span
              className={`text-xs px-2.5 py-0.5 font-extrabold rounded-full ${
                enquiry.priority === "High"
                  ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                  : enquiry.priority === "Medium"
                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                  : "bg-blue-50 text-blue-700 border border-blue-100"
              }`}
            >
              {enquiry.priority} Priority
            </span>

            {enquiry.flagged && (
              <span className="bg-rose-100 text-rose-800 text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-rose-200">
                Spam Flagged ({enquiry.riskScore}% risk)
              </span>
            )}
          </div>
          <p className="text-sm text-gray-505 font-medium">
            Submitted on {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>

        {/* Top-Right Control Actions */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          {enquiry.status !== "Approved" && (
            <button
              onClick={() => handleUpdateStatus("Approved")}
              className="flex-1 md:flex-none py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-emerald-50"
            >
              <FiCheckCircle className="w-4 h-4" /> Approve RFQ
            </button>
          )}

          {enquiry.status !== "Rejected" && (
            <button
              onClick={() => handleUpdateStatus("Rejected")}
              className="flex-1 md:flex-none py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-red-100"
            >
              <FiXCircle className="w-4 h-4" /> Reject
            </button>
          )}

          <button
            onClick={() => setShowEscalateModal(true)}
            className="flex-1 md:flex-none py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-amber-100"
          >
            <FiShield className="w-4 h-4" /> Escalate
          </button>

          <button
            onClick={handleToggleSpam}
            className={`flex-1 md:flex-none py-2.5 px-4 text-xs font-bold rounded-xl transition-all border flex items-center justify-center gap-1.5 ${
              enquiry.flagged
                ? "bg-red-600 hover:bg-red-700 text-white border-red-650"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <FiFlag className="w-4 h-4" />
            {enquiry.flagged ? "Unflag Safe" : "Mark Spam"}
          </button>
        </div>
      </div>

      {/* Main 3-Column Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Buyer Profile */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-650 flex items-center justify-center">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Buyer Information</h3>
              <h4 className="font-extrabold text-gray-800 mt-0.5 truncate max-w-[200px]" title={enquiry.buyer.company}>
                {enquiry.buyer.company}
              </h4>
            </div>
          </div>

          <div className="space-y-3.5 text-xs text-gray-700 font-medium">
            <div className="flex gap-2">
              <FiUser className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Contact: {enquiry.buyer.name}</span>
            </div>
            <div className="flex gap-2">
              <FiMail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate select-all" title={enquiry.buyer.email}>{enquiry.buyer.email}</span>
            </div>
            <div className="flex gap-2">
              <FiPhone className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="select-all">{enquiry.buyer.phone}</span>
            </div>
            <div className="flex gap-2">
              <FiMapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="leading-relaxed text-gray-650">{enquiry.buyer.address}</span>
            </div>
            <div className="pt-2">
              <span className="text-[10px] text-gray-400 block font-bold uppercase">GSTIN INVOICE REF</span>
              <span className="font-mono text-gray-800 text-[11px] font-bold select-all bg-gray-50 px-2 py-0.5 rounded border border-gray-100 mt-1 inline-block">
                {enquiry.buyer.gstin}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Seller Profile */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <FiBriefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Seller</h3>
              <h4 className="font-extrabold text-gray-800 mt-0.5 truncate max-w-[200px]" title={enquiry.seller.storeName}>
                {enquiry.seller.storeName}
              </h4>
            </div>
          </div>

          <div className="space-y-3.5 text-xs text-gray-700 font-medium">
            <div className="flex gap-2">
              <FiUser className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Representative: {enquiry.seller.name}</span>
            </div>
            <div className="flex gap-2">
              <FiMail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate select-all" title={enquiry.seller.email}>{enquiry.seller.email}</span>
            </div>
            <div className="flex gap-2">
              <FiPhone className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="select-all">{enquiry.seller.phone}</span>
            </div>
            <div className="pt-2">
              <span className="text-[10px] text-gray-400 block font-bold uppercase">Seller System ID</span>
              <span className="font-mono text-gray-800 text-[11px] font-bold select-all bg-gray-50 px-2 py-0.5 rounded border border-gray-100 mt-1 inline-block">
                {enquiry.seller.id}
              </span>
            </div>
          </div>
        </div>

        {/* System & Metadata overview */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center">
              <FiInbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">RFQ Status Summary</h3>
              <h4 className="font-extrabold text-gray-800 mt-0.5">Fulfillment Pipeline</h4>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-700 font-medium">
            <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-gray-400">Total Est. Value</span>
              <span className="font-extrabold text-gray-900 text-sm">{formatPrice(enquiry.totalEstimatedValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-1"><FiCalendar className="w-3.5 h-3.5" /> Expiry Date</span>
              <span className="font-bold text-gray-850">
                {new Date(enquiry.expiresAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-1"><FiClock className="w-3.5 h-3.5" /> Status</span>
              <Badge variant={enquiry.status === "Approved" ? "success" : "warning"}>{enquiry.status}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-1"><FiShield className="w-3.5 h-3.5" /> Moderation</span>
              <span className="font-bold text-gray-800">
                {enquiry.flagged ? "🔴 High Risk Review" : "🟢 Clear Status"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spam Indicator Warnings (If flagged) */}
      {enquiry.flagged && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex gap-4 text-red-800 shadow-sm shadow-red-50">
          <FiAlertCircle className="w-7 h-7 shrink-0 text-red-650 mt-1" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm uppercase tracking-wide text-red-900">Security Warning: Suspicious Activity Detected</h3>
            <p className="text-xs font-semibold leading-relaxed text-red-750">
              Our automated anti-fraud scrapers have flagged this RFQ. Risk assessment score: <b>{enquiry.riskScore || 85}%</b>.
              <br />
              <b>Flag reason:</b> {enquiry.flagReason || "Suspected spam email formatting, unrealistic bulk quantities or pricing, generic copy-pasted details."}
            </p>
            <div className="pt-2 flex gap-3">
              <button
                onClick={handleToggleSpam}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-red-100"
              >
                Approve Safety (Dismiss Flag)
              </button>
              <button
                onClick={() => handleUpdateStatus("Rejected", "Auto-rejected by Administrator due to high-risk validation check.")}
                className="px-3.5 py-1.5 bg-white border border-red-200 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-all"
              >
                Reject Immediately
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Columns: Products Table & Timelines / Quotations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products & Messaging (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requested Products Table */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <FiFileText className="text-primary-650" /> Requested Line Items & Target Prices
            </h3>
            <div className="border border-gray-150 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3.5 font-bold text-gray-600">Product Name / ID</th>
                    <th className="p-3.5 font-bold text-gray-600 text-center">Quantity</th>
                    <th className="p-3.5 font-bold text-gray-600 text-right">Target Rate</th>
                    <th className="p-3.5 font-bold text-gray-600 text-right">Total Est. Value</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiry.products.map((p, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-none hover:bg-gray-50/50">
                      <td className="p-3.5">
                        <span className="font-semibold text-gray-850 block">{p.name}</span>
                        <span className="text-[10px] font-mono text-gray-400 mt-0.5">Item Ref: {p.id}</span>
                      </td>
                      <td className="p-3.5 font-extrabold text-gray-700 text-center">
                        {p.qty.toLocaleString()}
                      </td>
                      <td className="p-3.5 font-bold text-gray-900 text-right">
                        {formatPrice(p.targetPrice)}
                      </td>
                      <td className="p-3.5 font-extrabold text-gray-900 text-right">
                        {formatPrice(p.subtotal || p.targetPrice * p.qty)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-55/50 border-t border-gray-200 font-extrabold text-sm text-gray-900">
                    <td className="p-4" colSpan={2}>Grand Summary</td>
                    <td className="p-4 text-center text-gray-500 font-medium">Total Qty: {enquiry.products.reduce((acc, p) => acc + p.qty, 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-primary-600 font-black">
                      {formatPrice(enquiry.totalEstimatedValue)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Buyer message */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">
              Original Buyer Requirement Details
            </h3>
            <div className="p-4 border border-gray-150 rounded-2xl bg-gray-50 text-xs sm:text-sm leading-relaxed text-gray-700 font-medium whitespace-pre-line border-l-4 border-l-primary-500">
              "{enquiry.buyerMessage}"
            </div>
          </div>

          {/* Seller quote section (if available) */}
          {enquiry.sellerQuotation ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <FiTrendingUp className="text-emerald-600" /> Seller Official Bid Quotation
                </h3>
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  Valid Until: {new Date(enquiry.sellerQuotation.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-emerald-800">
                  <p className="text-[10px] uppercase font-bold text-emerald-600">Quoted Package Total</p>
                  <p className="font-black text-lg mt-0.5">{formatPrice(enquiry.sellerQuotation.quotedValue)}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Payment Terms</p>
                  <p className="font-bold text-gray-850 text-sm mt-0.5">{enquiry.sellerQuotation.paymentTerms}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Shipping / Freight</p>
                  <p className="font-bold text-gray-850 text-sm mt-0.5">{enquiry.sellerQuotation.shippingTerms}</p>
                </div>
              </div>

              {/* Quotation lines */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden mt-3">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-2.5 font-bold text-gray-600">Product</th>
                      <th className="p-2.5 font-bold text-gray-600 text-center">Qty</th>
                      <th className="p-2.5 font-bold text-gray-600 text-right">Quoted Rate</th>
                      <th className="p-2.5 font-bold text-gray-600 text-right">Total Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiry.sellerQuotation.items.map((it, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-none">
                        <td className="p-2.5 font-semibold text-gray-800">{it.name}</td>
                        <td className="p-2.5 font-bold text-gray-700 text-center">{it.qty.toLocaleString()}</td>
                        <td className="p-2.5 font-bold text-gray-900 text-right">{formatPrice(it.quotedPrice)}</td>
                        <td className="p-2.5 font-extrabold text-gray-900 text-right">{formatPrice(it.subtotal)}</td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-50/20 font-extrabold border-t border-gray-200">
                      <td className="p-3 text-emerald-800" colSpan={3}>Quoted Total</td>
                      <td className="p-3 text-right text-emerald-800 text-sm font-black">{formatPrice(enquiry.sellerQuotation.quotedValue)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Seller Cover Note */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs sm:text-sm font-medium leading-relaxed text-gray-700">
                <p className="text-[10px] text-gray-400 block font-bold uppercase mb-1">Seller Cover Note / Message</p>
                "{enquiry.sellerQuotation.message}"
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 text-center text-amber-800 shadow-sm space-y-2">
              <FiClock className="w-10 h-10 mx-auto text-amber-600 shrink-0" />
              <h3 className="font-extrabold text-sm uppercase tracking-wide">Waiting for Seller Response</h3>
              <p className="text-xs font-semibold leading-relaxed text-amber-700 max-w-[500px] mx-auto">
                The assigned seller ({enquiry.seller.storeName}) has not yet submitted an official quotation bid.
                Admins will be notified once they respond or if the response window expires.
              </p>
            </div>
          )}
        </div>

        {/* Timelines & Action History (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <FiClock className="text-indigo-650" /> Enquiry Timeline Logs
            </h3>

            <div className="space-y-5 text-xs">
              {enquiry.responseHistory.map((hist, i) => (
                <div key={i} className="flex gap-3 text-xs last:mb-0">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-55 flex items-center justify-center">
                      <FiCheck className="w-1.5 h-1.5 text-white" />
                    </div>
                    {i < enquiry.responseHistory.length - 1 && (
                      <div className="w-0.5 h-14 bg-gray-150 mt-1.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-gray-850 text-sm leading-none">{hist.stage}</span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(hist.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">Performed by: {hist.user}</p>
                    <p className="text-gray-650 mt-1.5 font-medium leading-relaxed bg-gray-50/50 p-2 rounded-xl border border-gray-100">{hist.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispute details if any */}
          {enquiry.disputes && enquiry.disputes.length > 0 && (
            <div className="bg-red-50/50 border border-red-200 rounded-3xl p-6 shadow-sm space-y-3 text-red-800">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-red-950">
                <FiAlertCircle className="w-4 h-4 text-red-650" /> Dispute Case Files
              </h3>
              {enquiry.disputes.map((d, index) => (
                <div key={index} className="space-y-2 text-xs border-b border-red-150 last:border-none last:pb-0 pb-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="font-bold text-red-900 font-mono text-[11px] bg-red-100 px-2 py-0.5 rounded">{d.id}</span>
                    <Badge variant={d.status === "Resolved" ? "success" : "warning"}>{d.status}</Badge>
                  </div>
                  <p className="text-red-750 font-medium leading-normal">
                    Raised by {d.raisedBy} ({d.type}):<br />
                    "{d.description}"
                  </p>
                  {d.resolutionNotes && (
                    <p className="bg-white/80 p-2 rounded-lg border border-red-100 text-red-850 font-bold mt-1 text-[11px]">
                      <b>Resolution notes:</b> {d.resolutionNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Escalate Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/55" onClick={() => setShowEscalateModal(false)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative z-10 space-y-4 border border-gray-100"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <FiShield className="text-amber-500" /> Escalate RFQ Enquiry
              </h3>
              <button onClick={() => setShowEscalateModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEscalate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Reason for Escalation</label>
                <textarea
                  required
                  rows={4}
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="Provide detailed reasons for this escalation (e.g. price discrepancy, suspected buyer harassment, seller compliance check required...)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(false)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Confirm Escalation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminRFQDetail;
