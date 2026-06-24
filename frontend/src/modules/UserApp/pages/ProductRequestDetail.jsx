import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiInfo, FiTag, FiShoppingBag, FiTruck } from "react-icons/fi";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import api from "../../../shared/utils/api";

const ProductRequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    fetchRequestDetail();
  }, [id]);

  const fetchRequestDetail = async () => {
    try {
      const response = await api.get(`/user/product-requests/${id}`);
      if (response.success || response.statusCode === 200) {
        const reqData = response.data;
        setRequest({
          ...reqData,
          id: reqData.requestId,
          date: reqData.createdAt
        });
      }
    } catch (error) {
      console.error("Failed to fetch request detail:", error);
      // Let it remain null to show "Request not found"
    }
  };

  if (!request) {
    return (
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="w-full max-w-2xl mx-auto min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">Request not found</h2>
            <button
              onClick={() => navigate("/product-requests")}
              className="mt-4 px-6 py-2 bg-[#7B0A0A] hover:bg-[#AE020B] text-white rounded-xl font-bold text-sm transition-colors"
            >
              Back to Requests
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Predefined timeline steps to show on the stepper
  const allSteps = [
    { status: "Submitted", label: "Request Submitted" },
    { status: "Under Review", label: "Under Review" },
    { status: "Seller Responded", label: "Seller Responded" },
    { status: "Accepted", label: "Accepted" },
    { status: "Product Added", label: "Product Added" }
  ];

  // Helper to determine step status
  const getStepState = (stepName) => {
    // Current statuses order: Submitted -> Under Review -> Seller Responded -> Accepted -> Product Added
    const statusOrder = ["Submitted", "Under Review", "Seller Responded", "Accepted", "Product Added"];
    
    // If request status is Rejected, handle it specially
    if (request.status === "Rejected") {
      if (stepName === "Accepted") return "rejected";
      if (stepName === "Product Added") return "future";
      return "completed";
    }

    const currentIndex = statusOrder.indexOf(request.status);
    const stepIndex = statusOrder.indexOf(stepName);

    if (currentIndex >= stepIndex) return "completed";
    return "future";
  };

  const getStatusStyle = (status) => {
    const map = {
      Submitted: "bg-red-50 text-[#7B0A0A] border-red-200",
      "Under Review": "bg-yellow-50 text-yellow-750 border-yellow-200",
      "Seller Responded": "bg-red-50 text-[#7B0A0A] border-red-200",
      Accepted: "bg-green-50 text-green-700 border-green-200",
      Rejected: "bg-red-50 text-red-700 border-red-200",
      "Product Added": "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse",
    };
    return map[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="w-full pb-24 max-w-4xl mx-auto min-h-screen bg-gray-50 px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/product-requests")}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm border border-gray-200"
            >
              <FiArrowLeft className="text-xl text-gray-700" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">{request.id}</span>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border ${getStatusStyle(request.status)}`}>
                  {request.status}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-gray-800 truncate">{request.productName}</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Details Panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Request Details</h3>
                
                {request.image && (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 aspect-video bg-gray-50 flex items-center justify-center p-2 mb-4">
                    <img src={request.image} alt={request.productName} className="max-h-full max-w-full object-contain" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block font-medium text-xs">Category</span>
                    <span className="font-bold text-gray-850">{request.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium text-xs">Requested Quantity</span>
                    <span className="font-bold text-gray-850">{request.quantity} units</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium text-xs">Expected Budget</span>
                    <span className="font-bold text-gray-850">₹{request.expectedBudget}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium text-xs">Date Submitted</span>
                    <span className="font-bold text-gray-850">{new Date(request.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <span className="text-gray-400 block font-medium text-xs mb-1">Description</span>
                  <p className="text-gray-650 text-sm whitespace-pre-wrap">
                    {request.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Seller Responses section */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Seller Responses</h3>
                {(!request.sellerResponses || request.sellerResponses.length === 0) ? (
                  <div className="text-center py-6 text-gray-400 text-sm flex items-center justify-center gap-2">
                    <FiInfo />
                    <span>No responses from sellers yet. We are contacting suppliers.</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {request.sellerResponses.map((res, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-800 text-sm">{res.vendorName}</span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            res.responseType === "Can Supply" ? "bg-green-50 text-green-700" :
                            res.responseType === "Cannot Supply" ? "bg-red-50 text-red-700" :
                            "bg-yellow-50 text-yellow-700"
                          }`}>
                            {res.responseType}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{res.comments}</p>
                        {res.responseType === "Can Supply" && (
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-1">
                            <span>Price Offered: <strong className="text-gray-700">₹{res.offeredPrice}</strong></span>
                            <span>Delivery: <strong className="text-gray-700">{res.deliveryTimeline} days</strong></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stepper / Timeline Tracker */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Status Tracker</h3>
                
                <div className="relative pl-6 space-y-6">
                  {/* Vertical connector line */}
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />

                  {allSteps.map((step, idx) => {
                    const state = getStepState(step.status);
                    
                    return (
                      <div key={idx} className="relative flex items-start gap-4">
                        {/* Bullet circle */}
                        <div className={`absolute -left-6 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 z-10 ${
                          state === "completed" ? "bg-[#7B0A0A] border-[#7B0A0A] text-white" :
                          state === "rejected" ? "bg-red-650 border-red-650 text-white" :
                          "bg-white border-gray-300"
                        }`}>
                          {state === "completed" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          {state === "rejected" && <span className="text-[8px] font-bold">X</span>}
                        </div>

                        <div>
                          <h4 className={`text-sm font-bold ${
                            state === "completed" ? "text-gray-800" :
                            state === "rejected" ? "text-red-700" :
                            "text-gray-400"
                          }`}>
                            {step.status === "Accepted" && request.status === "Rejected" ? "Request Rejected" : step.label}
                          </h4>
                          {state === "completed" && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {request.timeline?.find((t) => t.status === step.status)?.comment || "Updated successfully."}
                            </p>
                          )}
                          {state === "rejected" && (
                            <p className="text-xs text-red-500 mt-0.5">
                              We are sorry, your request has been declined.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default ProductRequestDetail;
