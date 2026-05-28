import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiFileText,
  FiMapPin,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useVendorB2BStore } from "../../store/vendorB2BStore";
import { b2bEnquiryStatuses, b2bPriorities } from "../../data/b2bEnquiryMockData";
import { formatPrice } from "../../../../shared/utils/helpers";
import Badge from "../../../../shared/components/Badge";
import toast from "react-hot-toast";

const B2BEnquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enquiries, getEnquiryById, updateEnquiryStatus } = useVendorB2BStore();

  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchEnquiry = () => {
      setLoading(true);
      const data = getEnquiryById(id);
      setEnquiry(data);
      setLoading(false);

      // If status is new, automatically mark as responded on view (simulate viewing)
      if (data && data.status === "new") {
        updateEnquiryStatus(id, "responded");
        // re-fetch updated
        setTimeout(() => {
          setEnquiry(getEnquiryById(id));
        }, 50);
      }
    };

    fetchEnquiry();
  }, [id, getEnquiryById, updateEnquiryStatus, enquiries]);

  const handleStatusChange = (newStatus) => {
    if (!enquiry) return;
    updateEnquiryStatus(enquiry.id, newStatus);
    toast.success(`Enquiry status updated to ${newStatus}`);
  };

  const getStatusVariant = (status) => {
    const map = {
      new: "info",
      responded: "info",
      quoted: "warning",
      accepted: "success",
      rejected: "error",
      expired: "default",
    };
    return map[status] || "default";
  };

  const getPriorityBadgeColor = (priority) => {
    const cfg = b2bPriorities.find((p) => p.value === priority);
    return cfg ? cfg.color : "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading enquiry details...</p>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-gray-700 font-semibold">Enquiry not found</p>
        <p className="text-sm text-gray-500">
          Enquiry #{id} could not be found or may have been deleted.
        </p>
        <Link
          to="/vendor/b2b-enquiries"
          className="inline-block text-amber-800 hover:underline text-sm font-medium"
        >
          ← Back to B2B Enquiries
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/vendor/b2b-enquiries"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-800">
                Enquiry #{enquiry.enquiryNumber}
              </h1>
              <Badge variant={getStatusVariant(enquiry.status)}>
                {enquiry.status.toUpperCase()}
              </Badge>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${getPriorityBadgeColor(enquiry.priority)}`}>
                {enquiry.priority.toUpperCase()} PRIORITY
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Received on {new Date(enquiry.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {(enquiry.status === "new" || enquiry.status === "responded") && (
            <>
              <button
                onClick={() => handleStatusChange("rejected")}
                className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <FiXCircle /> Reject
              </button>
              <Link
                to={`/vendor/b2b-enquiries/${enquiry.id}/create-quote`}
                className="px-4 py-2 bg-amber-800 text-white hover:bg-amber-900 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <FiPlus /> Create Quote
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message / Enquiry Cover Note */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-base">
              <FiFileText className="text-amber-800" />
              Buyer message & requirements
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-150">
              {enquiry.message || "No buyer message provided."}
            </p>
          </div>

          {/* Requested Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                <FiFileText className="text-amber-800" />
                Requested Products
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-55 text-xs font-semibold text-gray-600 uppercase">
                    <th className="p-4">Product Name</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4 text-right">Quantity</th>
                    <th className="p-4 text-right">Target Price</th>
                    <th className="p-4 text-right">Total Est. Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {enquiry.products.map((p, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{p.name}</p>
                          {p.notes && (
                            <p className="text-xs text-amber-700 mt-1 italic">
                              Note: {p.notes}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-550 font-mono text-xs">{p.sku || "—"}</td>
                      <td className="p-4 text-right font-semibold text-gray-800">
                        {p.qty} {p.unit || "pcs"}
                      </td>
                      <td className="p-4 text-right text-gray-700">
                        {formatPrice(p.targetPrice)}
                      </td>
                      <td className="p-4 text-right font-bold text-gray-800">
                        {formatPrice(p.qty * p.targetPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Total Estimated Target Value:
              </span>
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(enquiry.totalEstimatedValue)}
              </span>
            </div>
          </div>

          {/* Quotes Section */}
          {enquiry.quotes && enquiry.quotes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                  <FiDollarSign className="text-amber-800" />
                  Your Quotes ({enquiry.quotes.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {enquiry.quotes.map((q, idx) => (
                  <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/vendor/b2b-enquiries/${enquiry.id}/quote/${q.id}`}
                          className="font-semibold text-amber-800 hover:underline"
                        >
                          Quote #{q.id}
                        </Link>
                        <Badge variant={q.status === "accepted" ? "success" : q.status === "rejected" ? "error" : "warning"}>
                          {q.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted on {new Date(q.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Validity: <span className="font-medium">{new Date(q.validUntil).toLocaleDateString()}</span>
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <p className="text-xs text-gray-500">Offered Total</p>
                      <p className="text-lg font-bold text-gray-800">
                        {formatPrice(q.totalValue)}
                      </p>
                      <Link
                        to={`/vendor/b2b-enquiries/${enquiry.id}/quote/${q.id}`}
                        className="mt-2 text-xs font-semibold text-amber-800 hover:underline flex items-center gap-0.5"
                      >
                        View Quote Detail →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Buyer Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-base">
              <FiUser className="text-amber-800" />
              Buyer Details
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Contact Person</p>
                <p className="font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5">
                  <FiUser className="text-gray-400" />
                  {enquiry.buyer.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Company</p>
                <p className="font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5">
                  <FiBriefcase className="text-gray-400" />
                  {enquiry.buyer.company}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">GSTIN</p>
                <p className="font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5">
                  <FiFileText className="text-gray-400" />
                  {enquiry.buyer.gstNumber || "N/A"}
                </p>
              </div>
              <hr className="border-gray-100" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email Address</p>
                <a
                  href={`mailto:${enquiry.buyer.email}`}
                  className="font-medium text-amber-800 hover:underline flex items-center gap-1.5 mt-0.5 break-all"
                >
                  <FiMail className="text-gray-400 flex-shrink-0" />
                  {enquiry.buyer.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Phone Number</p>
                <a
                  href={`tel:${enquiry.buyer.phone}`}
                  className="font-medium text-gray-800 hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <FiPhone className="text-gray-400" />
                  {enquiry.buyer.phone}
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Shipping Destination</p>
                <p className="text-gray-600 flex items-start gap-1.5 mt-0.5 leading-relaxed">
                  <FiMapPin className="text-gray-400 flex-shrink-0 mt-0.5" />
                  {enquiry.buyer.address}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline of Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-base">
              <FiClock className="text-amber-800" />
              Activity Timeline
            </h2>
            <div className="relative border-l border-gray-200 pl-4 ml-2 space-y-4">
              {enquiry.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Bullet */}
                  <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-800 border-2 border-white ring-4 ring-amber-50"></span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.timestamp).toLocaleString()} • By {item.by}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default B2BEnquiryDetail;
