import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiEye, FiUserX, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import DataTable from "../../components/DataTable";
import ConfirmModal from "../../components/ConfirmModal";
import { useB2BUserStore } from "../../store/b2bUserStore";
import toast from "react-hot-toast";

const ManageB2BUsers = () => {
  const navigate = useNavigate();
  const { b2bUsers, updateB2BUserStatus, deleteB2BUser, initialize } = useB2BUserStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: null,
    userId: null,
    companyName: null,
  });
  const [reason, setReason] = useState("");

  const filteredUsers = useMemo(() => {
    let filtered = b2bUsers.filter(u => u.verificationStatus !== "Pending Verification");

    if (filterStatus !== "all") {
      const mappedFilter = filterStatus === 'approved' ? 'Approved' : 'Rejected';
      filtered = filtered.filter((u) => u.verificationStatus === mappedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.businessEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.gstNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [b2bUsers, searchQuery, filterStatus]);

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
      key: "verificationStatus",
      label: "Status",
      sortable: true,
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value === "Approved"
              ? "bg-green-100 text-green-700"
              : value === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}>
          {value}
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
          
          {row.verificationStatus === "Approved" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActionModal({
                  isOpen: true,
                  type: "suspend",
                  userId: row.id || row._id,
                  companyName: row.companyName,
                });
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Suspend User">
              <FiUserX />
            </button>
          ) : row.verificationStatus === "Rejected" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActionModal({
                  isOpen: true,
                  type: "delete",
                  userId: row.id || row._id,
                  companyName: row.companyName,
                });
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete User Permanently">
              <FiTrash2 />
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  const handleAction = async () => {
    if (actionModal.type === "delete") {
      const success = await deleteB2BUser(actionModal.userId);
      if (success) {
        toast.success(`B2B User permanently deleted`);
      } else {
        toast.error(`Failed to delete user`);
      }
    } else {
      const status = actionModal.type === "approve" ? "approved" : "rejected"; // We map suspend to rejected or a new status
      const success = await updateB2BUserStatus(actionModal.userId, status, reason.trim());
      if (success) {
        toast.success(`B2B User ${status} successfully`);
      } else {
        toast.error(`Failed to update user`);
      }
    }

    setActionModal({
      isOpen: false,
      type: null,
      userId: null,
      companyName: null,
    });
    setReason("");
  };

  const getModalContent = () => {
    if (actionModal.type === "approve") {
      return {
        title: "Approve B2B User?",
        message: `Are you sure you want to approve "${actionModal.companyName}"?`,
        confirmText: "Approve",
        onConfirm: handleAction,
        type: "success",
      };
    } else if (actionModal.type === "suspend") {
        return {
          title: "Suspend / Reject User?",
          message: `Are you sure you want to suspend/reject "${actionModal.companyName}"?`,
          confirmText: "Suspend",
          onConfirm: handleAction,
          type: "danger",
          customContent: (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide a reason..."
              />
            </div>
          ),
        };
    } else if (actionModal.type === "delete") {
        return {
          title: "Delete User Permanently?",
          message: `Are you sure you want to permanently delete "${actionModal.companyName}"? This action cannot be undone.`,
          confirmText: "Delete",
          onConfirm: handleAction,
          type: "danger",
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
            Manage B2B Users
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View and manage all approved B2B users
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, email, or GST..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 min-w-[150px]">
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected / Suspended</option>
          </select>
        </div>

        {filteredUsers.length > 0 ? (
          <DataTable
            data={filteredUsers}
            columns={columns}
            pagination={true}
            itemsPerPage={10}
            onRowClick={(row) => {}}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            No B2B users found matching your criteria.
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
            setReason("");
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

export default ManageB2BUsers;
