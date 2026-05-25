import React from 'react';
import { useBusinessBuyer } from '../../hooks/useBusinessBuyer';
import { useCartStore } from '../../../../shared/store/useStore';
import { formatPrice } from '../../../../shared/utils/helpers';
import { FiBriefcase, FiRefreshCw, FiDownload, FiCheck, FiInbox, FiTrendingUp, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const B2BBusinessDashboard = () => {
  const { isBusiness, businessProfile, quotations, getWholesaleSpecs } = useBusinessBuyer();
  const addItem = useCartStore((state) => state.addItem);

  if (!isBusiness) return null;

  const creditAvailable = businessProfile.creditLimit - businessProfile.creditUsed;
  const creditUsagePercentage = (businessProfile.creditUsed / businessProfile.creditLimit) * 100;

  const handleRepeatOrder = () => {
    toast.loading('Importing items from last wholesale order...', { id: 'repeat' });
    setTimeout(() => {
      // Add first product to cart at wholesale price
      addItem({
        id: 1,
        name: 'Classic White T-Shirt',
        price: 19.99,
        quantity: 25,
        stockQuantity: 45,
        vendorId: 1,
        vendorName: 'Fashion Hub',
      });
      toast.success('Successfully added repeat order to cart (25 x Classic White T-Shirts)!', { id: 'repeat' });
    }, 1000);
  };

  const handleDownloadInvoice = (rfqId) => {
    toast.success(`Downloading GST Tax Invoice for RFQ ${rfqId || 'APEX-8932'}...`);
  };

  const handleAddQuotationToCart = (quote) => {
    const specs = getWholesaleSpecs(quote.productId, quote.quotedPrice || quote.targetPrice);
    addItem({
      id: quote.productId,
      name: quote.productName,
      price: quote.quotedPrice || quote.targetPrice,
      quantity: quote.quantity,
      unit: quote.unit,
      stockQuantity: specs.unitsPerCarton * 10,
      vendorId: 1,
      vendorName: 'Fashion Hub',
    });
    toast.success(`Success! Added RFQ ${quote.id} to cart at quoted price of ₹${quote.quotedPrice || quote.targetPrice}/unit!`);
  };

  return (
    <div className="space-y-6">
      {/* Business Details & Credit Panel */}
      <div className="glass-card rounded-2xl p-5 shadow-sm border border-gray-100 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <FiBriefcase className="text-primary-600 text-xl" />
          <h3 className="font-extrabold text-gray-800 text-base">Apex Business Profile</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4 text-xs">
          <div>
            <span className="text-gray-400 block font-medium">Company Name</span>
            <span className="font-bold text-gray-800">{businessProfile.companyName}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">GSTIN Registered</span>
            <span className="font-bold text-primary-600 font-mono text-[11px]">
              {businessProfile.gstNumber}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Procurement Contact</span>
            <span className="font-bold text-gray-800">{businessProfile.businessEmail}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Billing Terms</span>
            <span className="font-bold text-gray-800">{businessProfile.creditTerms}</span>
          </div>
        </div>

        {/* Credit Facilities */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-semibold flex items-center gap-1">
              <FiCreditCard />
              <span>Available Credit Facility</span>
            </span>
            <span className="font-bold text-primary-600">
              {formatPrice(creditAvailable)} / {formatPrice(businessProfile.creditLimit)}
            </span>
          </div>
          
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${creditUsagePercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span>Used: {formatPrice(businessProfile.creditUsed)}</span>
            <span>Terms: NET 30 Days invoicing allowed</span>
          </div>
        </div>

        {/* Quick actions buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-gray-50">
          <button
            type="button"
            onClick={handleRepeatOrder}
            className="py-2.5 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-primary-100/50"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Repeat Last Order</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownloadInvoice()}
            className="py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-gray-200"
          >
            <FiDownload className="w-3.5 h-3.5" />
            <span>Download Invoices</span>
          </button>
        </div>
      </div>

      {/* RFQ & Quote Quotation Panel */}
      <div className="glass-card rounded-2xl p-5 shadow-sm border border-gray-100 bg-white">
        <div className="flex items-center gap-2 mb-4 justify-between">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-primary-600 text-xl" />
            <h3 className="font-extrabold text-gray-800 text-base">Active RFQs & Quotes</h3>
          </div>
          <span className="text-[10px] text-gray-400 font-bold">
            Total: {quotations.length}
          </span>
        </div>

        {quotations.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center text-gray-400">
            <FiInbox className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-xs">No wholesale quotations requested yet.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {quotations.map((quote) => (
              <div 
                key={quote.id} 
                className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:shadow-sm transition-all text-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-gray-800">{quote.id}</span>
                  <span 
                    className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                      quote.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-gray-900 line-clamp-1">{quote.productName}</p>
                  <p className="text-gray-500 text-[10px]">
                    Qty: {quote.quantity} {quote.unit}s | Target: ₹{quote.targetPrice}/unit
                  </p>
                </div>

                {quote.status === 'Approved' ? (
                  <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2 mt-1">
                    <div>
                      <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wide block">
                        Approved Price
                      </span>
                      <span className="text-sm font-black text-emerald-600">
                        ₹{quote.quotedPrice}
                      </span>
                      <span className="text-[9px] text-gray-400"> / unit</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddQuotationToCart(quote)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 transition-all shadow-sm"
                    >
                      <FiCheck className="w-3 h-3" />
                      <span>Order Now</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-dashed border-gray-100 pt-2 text-[10px] text-gray-400 italic">
                    RFQ pending vendor approval review. Standard response time: &lt;2 hours.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default B2BBusinessDashboard;
