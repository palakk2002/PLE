import { useState, useEffect, useMemo } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiPackage,
  FiAlertCircle,
  FiExternalLink,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useBrandStore } from "../../../shared/store/brandStore";
import BrandForm from "../components/Brands/BrandForm";
import ExportButton from "../components/ExportButton";
import Pagination from "../components/Pagination";
import Badge from "../../../shared/components/Badge";
import AnimatedSelect from "../components/AnimatedSelect";
import toast from "react-hot-toast";
import Button from "../components/Button";

const Brands = () => {
  const {
    brands,
    initialize,
    reviewBrand,
    deleteBrand,
    bulkDeleteBrands,
    toggleBrandStatus,
  } = useBrandStore();

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pending' | 'approved' | 'rejected'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Rejection modal state
  const [rejectingBrand, setRejectingBrand] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const pendingCount = useMemo(() => {
    return brands.filter((b) => b.status === "pending").length;
  }, [brands]);

  // Filtered brands by tab and search
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      // Tab filter
      if (activeTab === "pending" && brand.status !== "pending") return false;
      if (
        activeTab === "approved" &&
        brand.status !== "approved" &&
        brand.status !== undefined
      )
        return false;
      if (activeTab === "rejected" && brand.status !== "rejected") return false;

      // Search filter
      const matchesSearch =
        !searchQuery ||
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (brand.description &&
          brand.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (brand.requestedBy?.storeName &&
          brand.requestedBy.storeName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      // Status dropdown filter (when on 'all' tab)
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && brand.isActive) ||
        (selectedStatus === "inactive" && !brand.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [brands, activeTab, searchQuery, selectedStatus]);

  // Pagination
  const paginatedBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBrands.slice(startIndex, endIndex);
  }, [filteredBrands, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedStatus]);

  const handleCreate = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      deleteBrand(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedBrands.length === 0) {
      toast.error("Please select brands to delete");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedBrands.length} brands?`
      )
    ) {
      bulkDeleteBrands(selectedBrands);
      setSelectedBrands([]);
    }
  };

  const handleApproveBrand = async (brand) => {
    if (
      window.confirm(
        `Approve brand "${brand.name}"? All products linked to this brand will automatically go live.`
      )
    ) {
      setIsSubmittingReview(true);
      try {
        await reviewBrand(brand.id, { status: "approved", autoActivateProducts: true });
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to approve brand");
      } finally {
        setIsSubmittingReview(false);
      }
    }
  };

  const handleOpenRejectModal = (brand) => {
    setRejectingBrand(brand);
    setRejectionReason("");
  };

  const handleConfirmReject = async () => {
    if (!rejectingBrand) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await reviewBrand(rejectingBrand.id, {
        status: "rejected",
        reason: rejectionReason.trim(),
        autoActivateProducts: false,
      });
      setRejectingBrand(null);
      setRejectionReason("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject brand");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBrand(null);
  };

  const handleFormSave = () => {
    initialize();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Brand Management & Approvals
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage official brands and review custom brand requests submitted by vendors.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          variant="primary"
          icon={FiPlus}
          className="self-start sm:self-auto shadow-sm"
        >
          <span>Add Official Brand</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "all"
              ? "border-primary-600 text-primary-700 bg-primary-50/40 rounded-t-lg"
              : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
          }`}
        >
          All Brands ({brands.length})
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "pending"
              ? "border-amber-500 text-amber-800 bg-amber-50/60 rounded-t-lg"
              : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
          }`}
        >
          <FiClock className="w-4 h-4 text-amber-500" />
          Pending Approvals
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "approved"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/40 rounded-t-lg"
              : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
          }`}
        >
          <FiCheckCircle className="w-4 h-4 text-emerald-500" />
          Approved Brands
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "rejected"
              ? "border-red-600 text-red-700 bg-red-50/40 rounded-t-lg"
              : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
          }`}
        >
          <FiXCircle className="w-4 h-4 text-red-500" />
          Rejected
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, vendor store, or description..."
              className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {activeTab === "all" && (
              <AnimatedSelect
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Active Status" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                className="min-w-[150px]"
              />
            )}

            <ExportButton
              data={filteredBrands}
              headers={[
                { label: "ID", accessor: (row) => row.id },
                { label: "Name", accessor: (row) => row.name },
                {
                  label: "Status",
                  accessor: (row) => row.status || (row.isActive ? "Approved" : "Inactive"),
                },
                {
                  label: "Requested By",
                  accessor: (row) => row.requestedBy?.storeName || "Admin",
                },
                { label: "Website", accessor: (row) => row.website || "" },
              ]}
              filename="brands-list"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBrands.length > 0 && (
          <div className="mt-3 p-3 bg-primary-50 rounded-lg flex items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-semibold text-primary-700">
              {selectedBrands.length} brand(s) selected
            </span>
            <Button onClick={handleBulkDelete} variant="danger" size="sm">
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {/* Brands Grid / Cards */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
        {filteredBrands.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <FiPackage className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-gray-700">
              No {activeTab !== "all" ? activeTab : ""} brands found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {searchQuery ? "Try adjusting your search criteria" : "New requests will appear here"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedBrands.map((brand) => {
                const isPending = brand.status === "pending";
                const isRejected = brand.status === "rejected";
                const isApproved =
                  brand.status === "approved" || (!brand.status && brand.isActive);

                return (
                  <div
                    key={brand.id}
                    className={`relative border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 ${
                      isPending
                        ? "border-amber-300 bg-amber-50/20 shadow-md ring-1 ring-amber-200"
                        : isRejected
                        ? "border-red-200 bg-red-50/10"
                        : "border-gray-200 hover:shadow-md bg-white"
                    }`}
                  >
                    <div>
                      {/* Top Row: Checkbox and Status Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands([...selectedBrands, brand.id]);
                            } else {
                              setSelectedBrands(
                                selectedBrands.filter((id) => id !== brand.id)
                              );
                            }
                          }}
                          className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                        />

                        {isPending ? (
                          <Badge variant="warning" className="animate-pulse">
                            Pending Approval
                          </Badge>
                        ) : isRejected ? (
                          <Badge variant="error">Rejected</Badge>
                        ) : (
                          <Badge variant={brand.isActive ? "success" : "neutral"}>
                            {brand.isActive ? "Active" : "Inactive"}
                          </Badge>
                        )}
                      </div>

                      {/* Brand Logo or Icon */}
                      <div className="h-16 flex items-center justify-center mb-3 bg-gray-50 rounded-xl p-2 border border-gray-100">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-xl font-bold text-gray-400 tracking-wider">
                            {brand.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Brand Name */}
                      <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
                        {brand.name}
                      </h3>

                      {brand.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {brand.description}
                        </p>
                      )}

                      {/* Vendor Info if submitted by Vendor */}
                      {brand.requestedBy && (
                        <div className="my-2.5 p-2 bg-amber-50/80 border border-amber-100 rounded-lg text-xs">
                          <div className="flex items-center gap-1.5 text-amber-900 font-semibold mb-0.5">
                            <FiUser className="w-3.5 h-3.5 text-amber-600" />
                            <span>Requested by:</span>
                          </div>
                          <p className="text-gray-800 font-medium">
                            {brand.requestedBy.storeName || "Vendor"}
                          </p>
                          {brand.requestedBy.email && (
                            <p className="text-gray-500 text-[11px] truncate">
                              {brand.requestedBy.email}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Product Count / Stats */}
                      {brand.productCount !== undefined && brand.productCount > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 my-1 font-medium">
                          <FiPackage className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {brand.productCount} product{brand.productCount > 1 ? "s" : ""} waiting
                          </span>
                        </div>
                      )}

                      {/* Rejection Reason if any */}
                      {isRejected && brand.rejectionReason && (
                        <div className="my-2 p-2 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-700">
                          <span className="font-bold">Rejection Note: </span>
                          <span>{brand.rejectionReason}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                      {isPending ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleApproveBrand(brand)}
                            disabled={isSubmittingReview}
                            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                          >
                            <FiCheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleOpenRejectModal(brand)}
                            disabled={isSubmittingReview}
                            className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all"
                          >
                            <FiXCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Button
                            onClick={() => toggleBrandStatus(brand.id)}
                            variant="icon"
                            className="flex-1 text-gray-600 hover:bg-gray-100"
                            icon={brand.isActive ? FiEyeOff : FiEye}
                            title={brand.isActive ? "Deactivate" : "Activate"}
                          />
                          <Button
                            onClick={() => handleEdit(brand)}
                            variant="iconBlue"
                            className="flex-1"
                            icon={FiEdit}
                            title="Edit Brand"
                          />
                          <Button
                            onClick={() => handleDelete(brand.id)}
                            variant="iconRed"
                            className="flex-1"
                            icon={FiTrash2}
                            title="Delete Brand"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredBrands.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          </>
        )}
      </div>

      {/* Brand Rejection Modal */}
      <AnimatePresence>
        {rejectingBrand && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-100"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Reject Brand Request
                  </h3>
                  <p className="text-xs text-gray-500">
                    Brand: <strong className="text-gray-800">{rejectingBrand.name}</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this brand request is being rejected (e.g. Unregistered trademark, duplicate brand, invalid logo)..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p className="text-[11px] text-gray-500">
                  This note will be sent directly to the vendor in their notification.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingBrand(null)}
                  disabled={isSubmittingReview}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  disabled={isSubmittingReview}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
                >
                  {isSubmittingReview ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Brand Form Modal */}
      {showForm && (
        <BrandForm
          brand={editingBrand}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </motion.div>
  );
};

export default Brands;
