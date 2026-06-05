import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCheckCircle, FiXCircle, FiPackage, FiInfo, FiTruck, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from '../../../shared/components/PageTransition';
import { useReturnStore } from '../../../shared/store/returnStore';
import { formatPrice } from '../../../shared/utils/helpers';
import LazyImage from '../../../shared/components/LazyImage';

const ReturnDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchReturnRequestById } = useReturnStore();
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadRequest = async () => {
      setIsLoading(true);
      const data = await fetchReturnRequestById(id);
      if (active) {
        setRequest(data);
        setIsLoading(false);
      }
    };
    loadRequest();
    return () => { active = false; };
  }, [id, fetchReturnRequestById]);

  if (isLoading) {
    return (
      <PageTransition>
        <MobileLayout showBottomNav={false} showCartBar={false}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-600">Loading return details...</p>
          </div>
        </MobileLayout>
      </PageTransition>
    );
  }

  if (!request) {
    return (
      <PageTransition>
        <MobileLayout showBottomNav={false} showCartBar={false}>
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Return Request Not Found</h3>
            <button
              onClick={() => navigate('/orders')}
              className="gradient-green text-white px-6 py-2 rounded-xl font-semibold"
            >
              Go to My Orders
            </button>
          </div>
        </MobileLayout>
      </PageTransition>
    );
  }

  // Define full return tracking stages
  const stages = [
    'Request Submitted',
    'Under Review',
    'Approved', // or Rejected
    'Pickup Scheduled',
    'Picked Up',
    'Refund Initiated',
    'Refund Completed'
  ];

  // If rejected, replace approved stage
  const currentStatusIndex = stages.indexOf(request.status);
  const isRejected = request.status === 'Rejected';

  const getStageStatus = (stageName, index) => {
    if (isRejected && stageName === 'Approved') {
      return 'rejected';
    }
    if (isRejected && index > 2) {
      return 'cancelled'; // future steps are cancelled
    }
    
    const requestStatusIndex = stages.indexOf(request.status === 'Rejected' ? 'Approved' : request.status);
    if (index < requestStatusIndex) return 'completed';
    if (index === requestStatusIndex) return 'active';
    return 'upcoming';
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={false} showCartBar={false}>
        <div className="w-full pb-24">
          {/* Header */}
          <div className="px-4 py-4 bg-white border-b border-gray-200 sticky top-1 z-30 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="text-xl text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">Return Details</h1>
              <p className="text-xs text-gray-500">ID: {request.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isRejected ? 'bg-red-50 text-red-700 border border-red-200' :
              request.status === 'Refund Completed' ? 'bg-green-50 text-green-700 border border-green-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {request.status}
            </span>
          </div>

          <div className="px-4 py-4 space-y-4">
            {/* Product & Order Information */}
            <div className="glass-card rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                <span className="text-xs font-semibold text-gray-500">Order ID:</span>
                <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/orders/${request.orderId}`)}>
                  #{request.orderId}
                </span>
              </div>
              
              <h3 className="text-xs font-bold text-gray-800 mb-2">Returned Items</h3>
              <div className="space-y-3">
                {request.items && request.items.map((item, idx) => (
                  <div key={item.id || idx} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                      <LazyImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-xs truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{formatPrice(item.price)} x {item.quantity}</p>
                    </div>
                    <span className="font-bold text-xs text-gray-800">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Refund Status Page / Card */}
            <div className="glass-card rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                <FiDollarSign className="text-primary-600 text-base" />
                Refund Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-3 border border-gray-200/50 mb-3">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-semibold">Refund Amount</span>
                  <span className="text-lg font-extrabold text-primary-600">{formatPrice(request.refundAmount || 0)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-semibold">Refund Status</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md inline-block mt-1 ${
                    request.refundStatus === 'Completed' || request.refundStatus === 'processed' ? 'bg-green-100 text-green-700' :
                    request.refundStatus === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {request.refundStatus || 'Pending'}
                  </span>
                </div>
              </div>
              
              {/* Refund Timeline */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-semibold">Refund Log</span>
                <div className="flex gap-3 items-center text-xs">
                  <div className={`w-2 h-2 rounded-full ${request.refundStatus === 'Completed' || request.refundStatus === 'processed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-gray-700 font-medium">
                    {request.refundStatus === 'Completed' || request.refundStatus === 'processed' ? 'Refund Credited to original source' :
                     request.refundStatus === 'Processing' ? 'Refund is being processed by bank partners' :
                     'Awaiting product verification/approval for refund initiation'}
                  </span>
                </div>
              </div>
            </div>

            {/* Return Reason Details */}
            <div className="glass-card rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
                <FiInfo className="text-gray-500" />
                Return Details
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-500">Reason:</span>
                  <p className="font-semibold text-gray-800 mt-0.5">{request.reason}</p>
                </div>
                <div>
                  <span className="text-gray-500">Description:</span>
                  <p className="text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100 mt-1 leading-relaxed">
                    {request.description}
                  </p>
                </div>
                {request.notes && (
                  <div>
                    <span className="text-gray-500">Additional Notes:</span>
                    <p className="text-gray-700 mt-0.5">{request.notes}</p>
                  </div>
                )}
                {request.rejectionReason && (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-red-800">
                    <span className="font-bold text-xs">Rejection Reason:</span>
                    <p className="mt-1 font-medium">{request.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            {request.images && request.images.length > 0 && (
              <div className="glass-card rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
                <h3 className="text-xs font-bold text-gray-800 mb-2">Uploaded Images</h3>
                <div className="flex flex-wrap gap-2">
                  {request.images.map((img, idx) => (
                    <a key={idx} href={img} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                      <img src={img} alt="return evidence" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Return Timeline Tracking */}
            <div className="glass-card rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-1.5">
                <FiTruck className="text-primary-600 text-base" />
                Return Status Timeline
              </h3>
              
              <div className="relative border-l-2 border-gray-200 ml-3 pl-6 space-y-6 py-1">
                {stages.map((stageName, index) => {
                  const stageStatus = getStageStatus(stageName, index);
                  
                  // Custom rendering for current status details
                  let timeText = '';
                  let noteText = '';
                  if (request.timeline) {
                    const match = request.timeline.find(t => t.status === stageName || (isRejected && stageName === 'Approved' && t.status === 'Rejected'));
                    if (match) {
                      timeText = new Date(match.date).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' });
                      noteText = match.note || '';
                    }
                  }

                  let nodeColor = 'bg-gray-200 text-gray-400';
                  let icon = <FiClock className="text-xs" />;
                  
                  if (stageStatus === 'completed') {
                    nodeColor = 'bg-primary-600 text-white';
                    icon = <FiCheckCircle className="text-xs" />;
                  } else if (stageStatus === 'active') {
                    nodeColor = 'bg-blue-600 text-white ring-4 ring-blue-100';
                    icon = <FiClock className="text-xs" />;
                  } else if (stageStatus === 'rejected') {
                    nodeColor = 'bg-red-600 text-white ring-4 ring-red-100';
                    icon = <FiXCircle className="text-xs" />;
                  } else if (stageStatus === 'cancelled') {
                    nodeColor = 'bg-gray-100 text-gray-300';
                    icon = <FiXCircle className="text-xs" />;
                  }

                  return (
                    <div key={stageName} className="relative">
                      {/* Timeline Dot */}
                      <span className={`absolute -left-[31px] top-0 rounded-full w-5 h-5 flex items-center justify-center ${nodeColor}`}>
                        {icon}
                      </span>
                      
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className={`text-xs font-bold ${
                            stageStatus === 'active' ? 'text-blue-600' :
                            stageStatus === 'rejected' ? 'text-red-600' :
                            stageStatus === 'completed' ? 'text-gray-800' : 'text-gray-400'
                          }`}>
                            {isRejected && stageName === 'Approved' ? 'Rejected' : stageName}
                          </h4>
                          {noteText && <p className="text-[11px] text-gray-600 mt-1 bg-gray-50 p-2 rounded-lg border border-gray-100">{noteText}</p>}
                        </div>
                        {timeText && <span className="text-[10px] text-gray-500 whitespace-nowrap">{timeText}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default ReturnDetail;
