import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiEye, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import DataTable from "../../components/DataTable";
import ConfirmModal from "../../components/ConfirmModal";
import { useB2BUserStore } from "../../store/b2bUserStore";
import toast from "react-hot-toast";

const PendingB2BApprovals = () => {
  const navigate = useNavigate();
  const { b2bUsers, updateB2BUserStatus, initialize } = useB2BUserStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const [searchQuery, setSearchQuery] = useState("");
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: null, // 'approve', 'reject'
    userId: null,
    companyName: null,
  });
  const [rejectReason, setRejectReason] = useState("");

  const pendingUsers = useMemo(() => {
    let filtered = b2bUsers.filter((u) => u.verificationStatus === "Pending Verification");

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.businessEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.gstNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [b2bUsers, searchQuery]);

  const columns = [
    {
      key: "companyName",
      label: "Company Name",
      sortable: true,
      render: (value, row) => (
        <div>
          <span className="font-medium text-gray-800">{value}</span>
          <p className="text-xs text-gray-500">{row.companyType}</p>
        </div>
      ),
    },
    {
      key: "businessEmail",
      label: "Business Email",
      sortable: true,
      render: (value) => <span className="text-sm text-gray-700">{value}</span>,
    },
    {
      key: "adminInfo",
      label: "Admin Details",
      sortable: false,
      render: (_, row) => (
        <div>
          <span className="font-medium text-gray-800">{row.admin?.adminName || "N/A"}</span>
          <p className="text-xs text-gray-500">{row.admin?.adminEmail}</p>
          <p className="text-xs text-gray-500">{row.admin?.adminPhone}</p>
        </div>
      ),
    },
    {
      key: "employeeCount",
      label: "Employees",
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-800 bg-blue-100 rounded-full">{value || 0}</span>
      ),
    },
    {
      key: "gstNumber",
      label: "GST Number",
      sortable: true,
      render: (value) => <span className="text-sm text-gray-700 uppercase">{value}</span>,
    },
    {
      key: "createdAt",
      label: "Registration Date",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Navigate to details if created later: navigate(`/admin/b2b-users/${row.id}`)
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details">
            <FiEye />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActionModal({
                isOpen: true,
                type: "approve",
                userId: row.id || row._id,
                companyName: row.companyName,
              });
            }}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Approve User">
            <FiCheckCircle />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActionModal({
                isOpen: true,
                type: "reject",
                userId: row.id || row._id,
                companyName: row.companyName,
              });
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Reject User">
            <FiXCircle />
          </button>
        </div>
      ),
    },
  ];

  const handleApprove = async () => {
    const success = await updateB2BUserStatus(actionModal.userId, "approved");
    if (success) {
      toast.success("B2B User approved successfully");
      setActionModal({
        isOpen: false,
        type: null,
        userId: null,
        companyName: null,
      });
    } else {
      toast.error("Failed to approve user");
    }
  };

  const handleReject = async () => {
    const success = await updateB2BUserStatus(
      actionModal.userId,
      "rejected",
      rejectReason.trim()
    );
    if (success) {
      toast.success("B2B User registration rejected");
      setActionModal({
        isOpen: false,
        type: null,
        userId: null,
        companyName: null,
      });
      setRejectReason("");
    } else {
      toast.error("Failed to reject user");
    }
  };

  const getModalContent = () => {
    if (actionModal.type === "approve") {
      return {
        title: "Approve B2B User?",
        message: `Are you sure you want to approve "${actionModal.companyName}"? They will receive an email and be able to log in.`,
        confirmText: "Approve",
        onConfirm: handleApprove,
        type: "success",
      };
    } else if (actionModal.type === "reject") {
        return {
          title: "Reject Registration?",
          message: `Are you sure you want to reject "${actionModal.companyName}"?`,
          confirmText: "Reject",
          onConfirm: handleReject,
          type: "danger",
          customContent: (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rejection Reason (optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Provide a reason for rejection..."
              />
            </div>
          ),
        };
    }
    return null;
  };

  const modalContent = getModalContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Pending B2B Approvals
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Review and approve pending B2B user registrations
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pending users by company, email, or GST..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
        </div>

        {pendingUsers.length > 0 ? (
          <DataTable
            data={pendingUsers}
            columns={columns}
            pagination={true}
            itemsPerPage={10}
            onRowClick={(row) => {}}
          />
        ) : (
          <div className="text-center py-12">
            <FiCheckCircle className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No pending approvals</p>
            <p className="text-sm text-gray-400">
              All B2B user registrations have been reviewed
            </p>
          </div>
        )}
      </div>

      {modalContent && (
        <ConfirmModal
          isOpen={actionModal.isOpen}
          onClose={() => {
            setActionModal({
              isOpen: false,
              type: null,
              userId: null,
              companyName: null,
            });
            setRejectReason("");
          }}
          onConfirm={modalContent.onConfirm}
          title={modalContent.title}
          message={modalContent.message}
          confirmText={modalContent.confirmText}
          cancelText="Cancel"
          type={modalContent.type}
          customContent={modalContent.customContent}
        />
      )}
    </motion.div>
  );
};

export default PendingB2BApprovals;
