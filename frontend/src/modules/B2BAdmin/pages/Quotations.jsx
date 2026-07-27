import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiEye, FiTrendingUp, FiLayers, FiCalendar, FiDollarSign } from 'react-icons/fi';
import DataTable from '../../Admin/components/DataTable';
import ExportButton from '../../Admin/components/ExportButton';
import Badge from '../../../shared/components/Badge';
import { formatPrice } from '../../../shared/utils/helpers';
import api from '../../../shared/utils/api';
import toast from 'react-hot-toast';

const Quotations = () => {
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRFQs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/b2b-user/admin/rfq');
      if (res && res.data) {
        setRfqs(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load RFQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, []);

  // Extract all quotations
  const allQuotations = useMemo(() => {
    const list = [];
    rfqs.forEach((r) => {
      if (r.quotations && r.quotations.length > 0) {
        r.quotations.forEach((q) => {
          list.push({
            id: q._id,
            _id: q._id,
            rfqDbId: r._id,
            rfqId: r.rfqId,
            productName: r.productId?.name || r.customProductName || 'Custom Request',
            vendorName: q.vendorName,
            vendorId: q.vendorId,
            unitPrice: q.unitPrice,
            totalPrice: q.totalPrice,
            deliveryTime: q.deliveryTime,
            warranty: q.warranty,
            status: q.status,
            createdAt: q.createdAt
          });
        });
      }
    });
    return list;
  }, [rfqs]);

  const filteredQuotes = useMemo(() => {
    if (!searchQuery) return allQuotations;
    const q = searchQuery.toLowerCase();
    return allQuotations.filter(
      (quote) =>
        quote.rfqId.toLowerCase().includes(q) ||
        quote.vendorName.toLowerCase().includes(q) ||
        quote.productName.toLowerCase().includes(q)
    );
  }, [allQuotations, searchQuery]);

  const columns = [
    {
      key: 'rfqId',
      label: 'RFQ Reference',
      sortable: true,
      render: (value, row) => (
        <div>
          <span className="font-mono font-bold text-gray-900 block">{value}</span>
          <span className="text-[10px] text-gray-400 font-semibold">{row.productName}</span>
        </div>
      )
    },
    {
      key: 'vendorName',
      label: 'Vendor / Store',
      sortable: true,
      render: (value) => <span className="font-bold text-gray-800">{value}</span>
    },
    {
      key: 'unitPrice',
      label: 'Unit Rate',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-900">{formatPrice(value)}</span>
    },
    {
      key: 'totalPrice',
      label: 'Total Bid Value',
      sortable: true,
      render: (value) => <span className="font-extrabold text-[#C07A3D]">{formatPrice(value)}</span>
    },
    {
      key: 'deliveryTime',
      label: 'Delivery Timeline',
      sortable: true,
      render: (value) => <span className="text-xs font-semibold text-gray-600">{value}</span>
    },
    {
      key: 'warranty',
      label: 'Warranty',
      sortable: true,
      render: (value) => <span className="text-xs text-gray-500 font-medium">{value || 'Standard'}</span>
    },
    {
      key: 'status',
      label: 'Bid Status',
      sortable: true,
      render: (value) => {
        let variant = 'warning';
        if (value === 'Selected') variant = 'success';
        if (value === 'Rejected') variant = 'danger';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/b2b-dashboard/rfqs/${row.rfqDbId}?tab=quotations`)}
            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
            title="Inspect RFQ Bids"
          >
            <FiEye className="w-3.5 h-3.5" /> Inspect Bid
          </button>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-[1400px] mx-auto"
    >
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <FiTrendingUp className="text-[#C07A3D]" /> Quotations Registry
        </h1>
        <p className="text-sm text-gray-500">
          Global index of quotations submitted by platform vendors for your RFQ campaigns.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="relative flex-1 w-full sm:min-w-[240px]">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by RFQ ID, Vendor, Product..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D71920] text-sm transition-all"
            />
          </div>

          <div className="w-full sm:w-auto ml-auto">
            <ExportButton
              data={filteredQuotes}
              headers={[
                { label: 'RFQ ID', accessor: (row) => row.rfqId },
                { label: 'Product', accessor: (row) => row.productName },
                { label: 'Vendor', accessor: (row) => row.vendorName },
                { label: 'Unit Price', accessor: (row) => row.unitPrice },
                { label: 'Total Bid', accessor: (row) => row.totalPrice },
                { label: 'Delivery Time', accessor: (row) => row.deliveryTime },
                { label: 'Warranty', accessor: (row) => row.warranty },
                { label: 'Bid Status', accessor: (row) => row.status }
              ]}
              filename="b2b_quotations_list"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-bold">Loading bids data...</p>
          </div>
        ) : filteredQuotes.length > 0 ? (
          <DataTable
            data={filteredQuotes}
            columns={columns}
            pagination={true}
            itemsPerPage={10}
            onRowClick={(row) => navigate(`/b2b-dashboard/rfqs/${row.rfqDbId}`)}
          />
        ) : (
          <div className="text-center py-16 text-gray-450 border border-dashed border-gray-200 rounded-2xl">
            <FiTrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="font-extrabold text-sm text-gray-800">No Bids Received Yet</h3>
            <p className="text-xs text-gray-450 mt-1 max-w-[280px] mx-auto">
              Quotations submitted by vendors for dispatched RFQs will be compiled here.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Quotations;
