import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import {
  FiUploadCloud,
  FiPlus,
  FiTrash2,
  FiCopy,
  FiCheckCircle,
  FiAlertCircle,
  FiDownload,
  FiGrid,
  FiRefreshCw,
  FiArrowRight,
  FiBox,
  FiImage,
} from "react-icons/fi";
import api from "../../../../shared/utils/api";
import { createBulkProducts, uploadVendorImage } from "../../services/vendorService";
import { useVendorAuthStore } from "../../store/vendorAuthStore";
import { useCategoryStore } from "../../../../shared/store/categoryStore";
import { useBrandStore } from "../../../../shared/store/brandStore";

const SAMPLE_PRODUCT_DATA = [
  {
    "Product Name": "Premium Cotton T-Shirt",
    "Category Name": "Apparel",
    "Subcategory Name": "Men T-Shirts",
    "Brand Name": "Puma",
    "Product Image URL": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
    "Selling Price (₹)": 499,
    "Original MRP (₹)": 999,
    "Stock Quantity": 50,
    "Unit": "Piece",
    "HSN Code": "610910",
    "Min Order Qty": 1,
    "Max Allowed Qty": 100,
    "Warranty Period": "6 Months",
    "Guarantee Period": "",
    "Sales Channel (B2C/B2B/BOTH)": "BOTH",
    "B2B Wholesale Price (₹)": 350,
    "B2B Min Order Qty": 5,
    "B2B Units Per Carton": 24,
    "B2B GST Rate (%)": 18,
    "B2B Lead Time (Days)": 3,
    "Condition (brand_new/open_box/refurbished)": "brand_new",
    "Refurbished Grade (A/B/C)": "",
    "COD Allowed (Yes/No)": "Yes",
    "Returnable (Yes/No)": "Yes",
    "Cancelable (Yes/No)": "Yes",
    "Tax Included (Yes/No)": "No",
    "Description": "High quality 100% cotton breathable fabric.",
  },
  {
    "Product Name": "Wireless Headphones (Refurbished Grade A)",
    "Category Name": "Electronics",
    "Subcategory Name": "Audio",
    "Brand Name": "Sony",
    "Product Image URL": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    "Selling Price (₹)": 2999,
    "Original MRP (₹)": 4999,
    "Stock Quantity": 15,
    "Unit": "Piece",
    "HSN Code": "851830",
    "Min Order Qty": 1,
    "Max Allowed Qty": 10,
    "Warranty Period": "1 Year",
    "Guarantee Period": "1 Year",
    "Sales Channel (B2C/B2B/BOTH)": "B2C",
    "B2B Wholesale Price (₹)": "",
    "B2B Min Order Qty": 1,
    "B2B Units Per Carton": "",
    "B2B GST Rate (%)": 18,
    "B2B Lead Time (Days)": "",
    "Condition (brand_new/open_box/refurbished)": "refurbished",
    "Refurbished Grade (A/B/C)": "A",
    "COD Allowed (Yes/No)": "Yes",
    "Returnable (Yes/No)": "Yes",
    "Cancelable (Yes/No)": "Yes",
    "Tax Included (Yes/No)": "Yes",
    "Description": "Certified refurbished noise cancelling headphones with 1 year seller warranty.",
  },
];

const DEFAULT_PRODUCT_ROW = {
  name: "",
  image: "",
  categoryName: "",
  subcategoryName: "",
  brandName: "",
  price: "",
  originalPrice: "",
  stockQuantity: 10,
  unit: "Piece",
  hsnCode: "",
  minimumOrderQuantity: 1,
  totalAllowedQuantity: "",
  warrantyPeriod: "",
  guaranteePeriod: "",
  salesChannel: "B2C",
  b2bWholesalePrice: "",
  b2bMinOrderQty: 1,
  b2bUnitsPerCarton: "",
  b2bGstRate: "18",
  b2bLeadTimeDays: "",
  condition: "brand_new",
  refurbishedGrade: "",
  codAllowed: true,
  returnable: true,
  cancelable: true,
  taxIncluded: false,
  gstMode: "category",
  gstRate: 18,
  description: "",
};

export default function BulkProducts() {
  const navigate = useNavigate();
  const { vendor, refreshProfile } = useVendorAuthStore();
  const isManagedVendor = vendor?.role === "managed_vendor";
  const [activeTab, setActiveTab] = useState("grid"); // 'grid' | 'file'
  const [submitting, setSubmitting] = useState(false);

  const { categories, initialize: initCategories } = useCategoryStore();
  const { brands, initialize: initBrands } = useBrandStore();

  // Manual Grid state
  const [gridRows, setGridRows] = useState([
    { ...DEFAULT_PRODUCT_ROW, id: Date.now() },
  ]);

  // File Upload state
  const [parsedRows, setParsedRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Submission Results Modal state
  const [resultModal, setResultModal] = useState(null);

  useEffect(() => {
    initCategories();
    initBrands();
    if (refreshProfile) {
      refreshProfile();
    }
  }, [initCategories, initBrands]);

  // ----------------------------------------------------
  // MANUAL GRID HANDLERS
  // ----------------------------------------------------
  const handleGridChange = (id, field, value) => {
    setGridRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleRowImageUpload = async (rowId, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    try {
      const res = await uploadVendorImage(file, "vendors/products");
      const uploadedUrl = res.data?.url || res.url || res.data;
      if (uploadedUrl) {
        handleGridChange(rowId, "image", uploadedUrl);
      }
    } catch (err) {
      console.error("Grid row image upload error", err);
      alert("Failed to upload image.");
    }
  };

  const addGridRow = () => {
    setGridRows((prev) => [
      ...prev,
      { ...DEFAULT_PRODUCT_ROW, id: Date.now() + Math.random() },
    ]);
  };

  const cloneGridRow = (row) => {
    setGridRows((prev) => [
      ...prev,
      { ...row, id: Date.now() + Math.random() },
    ]);
  };

  const removeGridRow = (id) => {
    if (gridRows.length === 1) {
      alert("At least one row is required.");
      return;
    }
    setGridRows((prev) => prev.filter((r) => r.id !== id));
  };

  const clearGridRows = () => {
    setGridRows([{ ...DEFAULT_PRODUCT_ROW, id: Date.now() }]);
  };

  const validateGridRows = () => {
    const validProducts = [];
    const validationErrors = [];

    gridRows.forEach((row, idx) => {
      const rowNum = idx + 1;
      const errors = [];

      if (!row.name.trim()) errors.push("Missing Product Name");
      if (row.price === "" || isNaN(row.price) || Number(row.price) < 0) {
        errors.push("Invalid Price");
      }
      if (Number(row.stockQuantity) < 0) errors.push("Invalid Stock Quantity");

      const isB2BApproved = isManagedVendor || vendor?.b2bSellingStatus === 'approved';
      const channel = isManagedVendor ? "B2C" : (row.salesChannel || "B2C");
      if (!isB2BApproved && (channel === "B2B" || channel === "BOTH")) {
        errors.push("B2B selling is locked. GST verification & Admin approval required.");
      }
      if (!isManagedVendor && (channel === "B2B" || channel === "BOTH") && (row.b2bWholesalePrice === "" || isNaN(row.b2bWholesalePrice) || Number(row.b2bWholesalePrice) <= 0)) {
        errors.push(`Missing B2B Wholesale Price for ${channel} product`);
      }

      if (errors.length > 0) {
        validationErrors.push({ row: rowNum, errors });
      } else {
        validProducts.push({
          name: row.name.trim(),
          image: row.image ? row.image.trim() : "",
          categoryName: row.categoryName.trim(),
          subcategoryName: row.subcategoryName ? row.subcategoryName.trim() : "",
          brandName: row.brandName ? row.brandName.trim() : "",
          price: Number(row.price),
          originalPrice: Number(row.originalPrice || row.price),
          stockQuantity: Number(row.stockQuantity || 0),
          unit: row.unit || "Piece",
          hsnCode: row.hsnCode || "",
          minimumOrderQuantity: Number(row.minimumOrderQuantity || 1),
          totalAllowedQuantity: row.totalAllowedQuantity ? Number(row.totalAllowedQuantity) : undefined,
          warrantyPeriod: row.warrantyPeriod || "",
          guaranteePeriod: row.guaranteePeriod || "",
          salesChannel: isManagedVendor ? "B2C" : (row.salesChannel || "B2C"),
          b2bWholesalePrice: !isManagedVendor && row.b2bWholesalePrice ? Number(row.b2bWholesalePrice) : undefined,
          b2bMinOrderQty: !isManagedVendor && row.b2bMinOrderQty ? Number(row.b2bMinOrderQty) : 1,
          b2bUnitsPerCarton: row.b2bUnitsPerCarton ? Number(row.b2bUnitsPerCarton) : undefined,
          b2bGstRate: row.b2bGstRate || "18",
          b2bLeadTimeDays: row.b2bLeadTimeDays ? Number(row.b2bLeadTimeDays) : undefined,
          condition: row.condition || "brand_new",
          refurbishedGrade: row.refurbishedGrade || "",
          codAllowed: Boolean(row.codAllowed),
          returnable: Boolean(row.returnable),
          cancelable: Boolean(row.cancelable),
          taxIncluded: Boolean(row.taxIncluded),
          description: row.description || "",
        });
      }
    });

    return { validProducts, validationErrors };
  };

  const submitGridProducts = async () => {
    const { validProducts, validationErrors } = validateGridRows();

    if (validationErrors.length > 0) {
      alert(
        `Please fix errors in the following rows:\n` +
          validationErrors
            .map((e) => `Row #${e.row}: ${e.errors.join(", ")}`)
            .join("\n")
      );
      return;
    }

    if (validProducts.length === 0) {
      alert("No valid products to submit.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBulkProducts(validProducts);
      setResultModal(res.data?.data || res.data);
    } catch (err) {
      console.error("Bulk upload products failed", err);
      alert(err.response?.data?.message || "Failed to upload products.");
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // EXCEL / CSV FILE UPLOAD HANDLERS
  // ----------------------------------------------------
  const downloadSampleTemplate = (format = "xlsx") => {
    const wsData = SAMPLE_PRODUCT_DATA;
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bulk_Products_Template");

    if (format === "csv") {
      XLSX.writeFile(wb, "Sample_Bulk_Products.csv", { bookType: "csv" });
    } else {
      XLSX.writeFile(wb, "Sample_Bulk_Products.xlsx");
    }
  };

  const parseBoolVal = (val, defaultVal = true) => {
    if (val === undefined || val === null || val === "") return defaultVal;
    if (typeof val === "boolean") return val;
    const str = String(val).trim().toLowerCase();
    if (["yes", "true", "1"].includes(str)) return true;
    if (["no", "false", "0"].includes(str)) return false;
    return defaultVal;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const bstr = event.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawJson = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (!rawJson || rawJson.length === 0) {
          alert("The uploaded file is empty or formatted incorrectly.");
          return;
        }

        const parsed = rawJson.map((row, index) => {
          const name = String(
            row["Product Name"] || row["Name"] || row["Title"] || ""
          ).trim();
          const categoryName = String(
            row["Category Name"] || row["Category"] || ""
          ).trim();
          const subcategoryName = String(
            row["Subcategory Name"] || row["Subcategory"] || ""
          ).trim();
          const brandName = String(
            row["Brand Name"] || row["Brand"] || ""
          ).trim();

          const price = Number(row["Selling Price (₹)"] || row["Price (₹)"] || row["Price"] || 0);
          const originalPrice = Number(
            row["Original MRP (₹)"] || row["Original Price (₹)"] || row["Original Price"] || price
          );
          const stockQuantity = Math.max(
            0,
            Number(row["Stock Quantity"] || row["Stock"] || row["Qty"] || 0)
          );
          const unit = String(row["Unit"] || "Piece").trim();
          const hsnCode = String(row["HSN Code"] || row["HSN"] || "").trim();
          const minimumOrderQuantity = Number(row["Min Order Qty"] || row["Minimum Order Quantity"] || 1);
          const totalAllowedQuantity = row["Max Allowed Qty"] || row["Total Allowed Quantity"] ? Number(row["Max Allowed Qty"] || row["Total Allowed Quantity"]) : "";
          const warrantyPeriod = String(row["Warranty Period"] || row["Warranty"] || "").trim();
          const guaranteePeriod = String(row["Guarantee Period"] || row["Guarantee"] || "").trim();

          const salesChannelRaw = String(row["Sales Channel (B2C/B2B/BOTH)"] || row["Sales Channel"] || "B2C").toUpperCase();
          const salesChannel = ["B2C", "B2B", "BOTH"].includes(salesChannelRaw) ? salesChannelRaw : "B2C";
          
          const b2bWholesalePrice = row["B2B Wholesale Price (₹)"] || row["B2B Price"] ? Number(row["B2B Wholesale Price (₹)"] || row["B2B Price"]) : "";
          const b2bMinOrderQty = Number(row["B2B Min Order Qty"] || row["B2B Min Qty"] || 1);
          const b2bUnitsPerCarton = row["B2B Units Per Carton"] || row["Units Per Carton"] ? Number(row["B2B Units Per Carton"] || row["Units Per Carton"]) : "";
          const b2bGstRate = String(row["B2B GST Rate (%)"] || row["GST Rate"] || "18").trim();
          const b2bLeadTimeDays = row["B2B Lead Time (Days)"] || row["Lead Time"] ? Number(row["B2B Lead Time (Days)"] || row["Lead Time"]) : "";

          const conditionRaw = String(row["Condition (brand_new/open_box/refurbished)"] || row["Condition"] || "brand_new").toLowerCase();
          const condition = ["brand_new", "open_box", "refurbished", "renewed"].includes(conditionRaw) ? conditionRaw : "brand_new";
          const refurbishedGrade = String(row["Refurbished Grade (A/B/C)"] || row["Refurbished Grade"] || "").trim().toUpperCase();

          const codAllowed = parseBoolVal(row["COD Allowed (Yes/No)"] ?? row["COD Allowed"], true);
          const returnable = parseBoolVal(row["Returnable (Yes/No)"] ?? row["Returnable"], true);
          const cancelable = parseBoolVal(row["Cancelable (Yes/No)"] ?? row["Cancelable"], true);
          const taxIncluded = parseBoolVal(row["Tax Included (Yes/No)"] ?? row["Tax Included"], false);

          const gstModeRaw = String(row["GST Mode (category/custom)"] || row["GST Mode"] || "category").toLowerCase();
          const gstMode = ["category", "custom"].includes(gstModeRaw) ? gstModeRaw : "category";
          const gstRate = Number(row["GST Rate (%)"] || row["GST Rate"] || row["Tax Rate"] || 18);

          const description = String(row["Description"] || "").trim();

          const image = String(
            row["Product Image URL"] || row["Image URL"] || row["Image"] || row["Primary Image"] || ""
          ).trim();

          const errors = [];
          if (!name) errors.push("Missing Product Name");
          if (isNaN(price) || price <= 0) errors.push("Invalid Price");
          const isB2BApproved = isManagedVendor || vendor?.b2bSellingStatus === 'approved';
          if (!isB2BApproved && (salesChannel === "B2B" || salesChannel === "BOTH")) {
            errors.push(`B2B selling is locked for your account (Row #${index + 1})`);
          }
          if (!isManagedVendor && (salesChannel === "B2B" || salesChannel === "BOTH") && (!b2bWholesalePrice || isNaN(b2bWholesalePrice) || Number(b2bWholesalePrice) <= 0)) {
            errors.push(`B2B Wholesale Price required for ${salesChannel} channel`);
          }

          return {
            id: index + 1,
            name,
            image,
            categoryName,
            subcategoryName,
            brandName,
            price,
            originalPrice,
            stockQuantity,
            unit,
            hsnCode,
            minimumOrderQuantity,
            totalAllowedQuantity,
            warrantyPeriod,
            guaranteePeriod,
            salesChannel: isManagedVendor ? "B2C" : salesChannel,
            b2bWholesalePrice: isManagedVendor ? "" : b2bWholesalePrice,
            b2bMinOrderQty,
            b2bUnitsPerCarton,
            b2bGstRate,
            b2bLeadTimeDays,
            condition,
            refurbishedGrade,
            codAllowed,
            returnable,
            cancelable,
            taxIncluded,
            gstMode,
            gstRate,
            description,
            isValid: errors.length === 0,
            errors,
          };
        });

        setParsedRows(parsed);
      } catch (err) {
        console.error("File parse error", err);
        alert("Failed to parse file. Please check file format.");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleParsedRowChange = (id, field, value) => {
    setParsedRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [field]: value };

        const errors = [];
        if (!updated.name.trim()) errors.push("Missing Product Name");
        if (isNaN(updated.price) || Number(updated.price) <= 0) {
          errors.push("Invalid Price");
        }
        if (!isManagedVendor && (updated.salesChannel === "B2B" || updated.salesChannel === "BOTH") && (!updated.b2bWholesalePrice || isNaN(updated.b2bWholesalePrice) || Number(updated.b2bWholesalePrice) <= 0)) {
          errors.push(`B2B Wholesale Price required for ${updated.salesChannel} channel`);
        }

        updated.isValid = errors.length === 0;
        updated.errors = errors;
        return updated;
      })
    );
  };

  const submitParsedProducts = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert("There are no valid product rows to upload.");
      return;
    }

    const payload = validRows.map((row) => ({
      name: row.name,
      image: row.image || undefined,
      categoryName: row.categoryName,
      subcategoryName: row.subcategoryName,
      brandName: row.brandName,
      price: Number(row.price),
      originalPrice: Number(row.originalPrice || row.price),
      stockQuantity: Number(row.stockQuantity),
      unit: row.unit,
      hsnCode: row.hsnCode,
      minimumOrderQuantity: Number(row.minimumOrderQuantity || 1),
      totalAllowedQuantity: row.totalAllowedQuantity ? Number(row.totalAllowedQuantity) : undefined,
      warrantyPeriod: row.warrantyPeriod,
      guaranteePeriod: row.guaranteePeriod,
      salesChannel: isManagedVendor ? "B2C" : row.salesChannel,
      b2bWholesalePrice: !isManagedVendor && row.b2bWholesalePrice ? Number(row.b2bWholesalePrice) : undefined,
      b2bMinOrderQty: !isManagedVendor && row.b2bMinOrderQty ? Number(row.b2bMinOrderQty) : 1,
      b2bUnitsPerCarton: row.b2bUnitsPerCarton ? Number(row.b2bUnitsPerCarton) : undefined,
      b2bGstRate: row.b2bGstRate,
      b2bLeadTimeDays: row.b2bLeadTimeDays ? Number(row.b2bLeadTimeDays) : undefined,
      condition: row.condition,
      refurbishedGrade: row.refurbishedGrade,
      codAllowed: row.codAllowed,
      returnable: row.returnable,
      cancelable: row.cancelable,
      taxIncluded: row.taxIncluded,
      description: row.description,
    }));

    setSubmitting(true);
    try {
      const res = await createBulkProducts(payload);
      setResultModal(res.data?.data || res.data);
    } catch (err) {
      console.error("File product upload failed", err);
      alert(err.response?.data?.message || "Failed to submit bulk products.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredParsedRows = parsedRows.filter((r) => {
    if (filterType === "valid") return r.isValid;
    if (filterType === "errors") return !r.isValid;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION - LIGHT THEME */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-sm min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 sm:p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 shadow-sm flex-shrink-0">
            <FiBox className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
              Bulk Product Upload
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
              Add multiple catalog products simultaneously via interactive grid or Excel file.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => downloadSampleTemplate("xlsx")}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-xl border border-gray-300 transition shadow-sm"
          >
            <FiDownload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>Sample Excel</span>
          </button>
          <button
            onClick={() => downloadSampleTemplate("csv")}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-xl border border-gray-300 transition shadow-sm"
          >
            <FiDownload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
            <span>Sample CSV</span>
          </button>
        </div>
      </div>

      {/* TAB SWITCHER - LIGHT THEME */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 rounded-xl border border-gray-200 w-full sm:w-fit">
        <button
          onClick={() => setActiveTab("grid")}
          className={`flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex-1 sm:flex-initial ${
            activeTab === "grid"
              ? "bg-white text-gray-900 shadow-sm border border-gray-200 font-semibold"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FiGrid className="w-4 h-4 text-amber-600" />
          <span>Manual Grid</span>
          <span className="ml-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
            {gridRows.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("file")}
          className={`flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex-1 sm:flex-initial ${
            activeTab === "file"
              ? "bg-white text-gray-900 shadow-sm border border-gray-200 font-semibold"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FiUploadCloud className="w-4 h-4 text-indigo-600" />
          <span>Sheet Upload</span>
          {parsedRows.length > 0 && (
            <span className="ml-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
              {parsedRows.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: MANUAL GRID ENTRY - LIGHT THEME */}
      {activeTab === "grid" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              Total Products to Create: <strong className="text-gray-900 text-base">{gridRows.length}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={addGridRow}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 transition shadow-sm"
              >
                <FiPlus className="w-4 h-4 text-amber-600" /> Add Row
              </button>
              <button
                onClick={clearGridRows}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-lg border border-gray-200 transition"
              >
                <FiRefreshCw className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse min-w-[2200px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
                  <th className="p-3 font-semibold w-10 sticky left-0 bg-gray-100 z-10 shadow-sm">#</th>
                  <th className="p-3 font-semibold min-w-[180px]">Product Name *</th>
                  <th className="p-3 font-semibold min-w-[210px]">Product Image</th>
                  <th className="p-3 font-semibold min-w-[140px]">Category</th>
                  <th className="p-3 font-semibold min-w-[140px]">Subcategory</th>
                  <th className="p-3 font-semibold min-w-[140px]">Brand</th>
                  <th className="p-3 font-semibold min-w-[100px]">Selling Price (₹) *</th>
                  <th className="p-3 font-semibold min-w-[100px]">MRP (₹)</th>
                  <th className="p-3 font-semibold min-w-[90px]">Stock Qty</th>
                  <th className="p-3 font-semibold min-w-[80px]">Unit</th>
                  <th className="p-3 font-semibold min-w-[100px]">HSN Code</th>
                  <th className="p-3 font-semibold min-w-[80px]">Min Qty</th>
                  <th className="p-3 font-semibold min-w-[80px]">Max Qty</th>
                  <th className="p-3 font-semibold min-w-[110px]">Warranty</th>
                  <th className="p-3 font-semibold min-w-[110px]">Guarantee</th>
                  <th className="p-3 font-semibold min-w-[120px]">Sales Channel</th>
                  <th className="p-3 font-semibold min-w-[110px]">B2B Price (₹)</th>
                  <th className="p-3 font-semibold min-w-[90px]">B2B Min Qty</th>
                  <th className="p-3 font-semibold min-w-[100px]">Units/Carton</th>
                  <th className="p-3 font-semibold min-w-[90px]">GST Rate (%)</th>
                  <th className="p-3 font-semibold min-w-[100px]">Lead Time (Days)</th>
                  <th className="p-3 font-semibold min-w-[120px]">Condition</th>
                  <th className="p-3 font-semibold min-w-[90px]">Refurb Grade</th>
                  <th className="p-3 font-semibold min-w-[80px]">COD?</th>
                  <th className="p-3 font-semibold min-w-[80px]">Returnable?</th>
                  <th className="p-3 font-semibold min-w-[80px]">Cancelable?</th>
                  <th className="p-3 font-semibold min-w-[90px]">Tax Included?</th>
                  <th className="p-3 font-semibold min-w-[200px]">Description</th>
                  <th className="p-3 font-semibold text-center w-20 sticky right-0 bg-gray-100 z-10 shadow-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gridRows.map((row, index) => {
                  const isB2C = row.salesChannel === "B2C";
                  return (
                    <tr key={row.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-3 text-gray-400 font-medium sticky left-0 bg-white z-10 shadow-sm">{index + 1}</td>

                    {/* Product Name */}
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Product Name *"
                        value={row.name}
                        onChange={(e) =>
                          handleGridChange(row.id, "name", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none font-medium"
                      />
                    </td>

                    {/* Product Image */}
                    <td className="p-2">
                      <div className="flex items-center gap-1.5">
                        {row.image ? (
                          <img
                            src={row.image}
                            alt="Preview"
                            className="w-7 h-7 object-cover rounded border border-gray-300 shrink-0 shadow-xs"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
                            <FiImage className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <input
                          type="text"
                          placeholder="Image URL..."
                          value={row.image || ""}
                          onChange={(e) =>
                            handleGridChange(row.id, "image", e.target.value)
                          }
                          className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1 text-gray-900 text-xs outline-none"
                        />
                        <label
                          title="Upload Image File"
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg border border-amber-200 cursor-pointer shrink-0 transition"
                        >
                          <FiUploadCloud className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleRowImageUpload(row.id, file);
                            }}
                          />
                        </label>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-2">
                      <select
                        value={row.categoryName}
                        onChange={(e) => {
                          handleGridChange(row.id, "categoryName", e.target.value);
                          handleGridChange(row.id, "subcategoryName", "");
                        }}
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none font-medium"
                      >
                        <option value="">-- Main Category --</option>
                        {categories
                          .filter((c) => !c.parentId)
                          .map((c) => (
                            <option key={c._id || c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </td>

                    {/* Subcategory */}
                    <td className="p-2">
                      {(() => {
                        const selectedParent = categories.find(
                          (c) => c.name?.toLowerCase() === row.categoryName?.toLowerCase()
                        );
                        const availableSubcats = categories.filter((c) => {
                          if (!c.parentId) return false;
                          if (!selectedParent) return true;
                          return (
                            String(c.parentId) === String(selectedParent._id || selectedParent.id)
                          );
                        });

                        return (
                          <select
                            value={row.subcategoryName}
                            onChange={(e) =>
                              handleGridChange(row.id, "subcategoryName", e.target.value)
                            }
                            disabled={availableSubcats.length === 0 && Boolean(row.categoryName)}
                            className={`w-full border rounded-lg px-2 py-1.5 text-xs outline-none ${
                              availableSubcats.length === 0 && Boolean(row.categoryName)
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white border-gray-300 focus:border-amber-500 text-gray-900"
                            }`}
                          >
                            <option value="">-- Subcategory --</option>
                            {availableSubcats.map((sc) => (
                              <option key={sc._id || sc.id} value={sc.name}>
                                {sc.name}
                              </option>
                            ))}
                          </select>
                        );
                      })()}
                    </td>

                    {/* Brand */}
                    <td className="p-2">
                      <select
                        value={row.brandName}
                        onChange={(e) =>
                          handleGridChange(row.id, "brandName", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none"
                      >
                        <option value="">-- Brand --</option>
                        {brands.map((b) => (
                          <option key={b._id || b.id} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Price */}
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Price *"
                        value={row.price}
                        onChange={(e) =>
                          handleGridChange(row.id, "price", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none font-semibold"
                      />
                    </td>

                    {/* Original Price */}
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="MRP"
                        value={row.originalPrice}
                        onChange={(e) =>
                          handleGridChange(row.id, "originalPrice", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none"
                      />
                    </td>

                    {/* Stock Quantity */}
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        value={row.stockQuantity}
                        onChange={(e) =>
                          handleGridChange(row.id, "stockQuantity", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs text-center outline-none"
                      />
                    </td>

                    {/* Unit */}
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Piece/Kg"
                        value={row.unit}
                        onChange={(e) =>
                          handleGridChange(row.id, "unit", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none"
                      />
                    </td>

                    {/* HSN Code */}
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="HSN Code"
                        value={row.hsnCode}
                        onChange={(e) =>
                          handleGridChange(row.id, "hsnCode", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none"
                      />
                    </td>

                    {/* Min Qty */}
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        value={row.minimumOrderQuantity}
                        onChange={(e) =>
                          handleGridChange(row.id, "minimumOrderQuantity", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs text-center outline-none"
                      />
                    </td>

                    {/* Max Qty */}
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Unlimited"
                        value={row.totalAllowedQuantity}
                        onChange={(e) =>
                          handleGridChange(row.id, "totalAllowedQuantity", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs text-center outline-none"
                      />
                    </td>

                    {/* Warranty */}
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="e.g. 1 Year"
                        value={row.warrantyPeriod}
                        onChange={(e) =>
                          handleGridChange(row.id, "warrantyPeriod", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none"
                      />
                    </td>

                    {/* Guarantee */}
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="e.g. 6 Months"
                        value={row.guaranteePeriod}
                        onChange={(e) =>
                          handleGridChange(row.id, "guaranteePeriod", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none"
                      />
                    </td>

                    {/* Sales Channel */}
                    <td className="p-2">
                      <select
                        value={row.salesChannel}
                        onChange={(e) => {
                          const isB2BApproved = isManagedVendor || vendor?.b2bSellingStatus?.toLowerCase() === 'approved';
                          if (!isB2BApproved && e.target.value !== "B2C") {
                            toast.error("B2B selling requires GST verification & Admin approval.");
                            return;
                          }
                          handleGridChange(row.id, "salesChannel", e.target.value);
                        }}
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none"
                      >
                        <option value="B2C">B2C</option>
                        <option value="B2B" disabled={!isManagedVendor && vendor?.b2bSellingStatus?.toLowerCase() !== 'approved'}>
                          {(!isManagedVendor && vendor?.b2bSellingStatus?.toLowerCase() !== 'approved') ? "🔒 B2B (Locked)" : "B2B Only"}
                        </option>
                        <option value="BOTH" disabled={!isManagedVendor && vendor?.b2bSellingStatus?.toLowerCase() !== 'approved'}>
                          {(!isManagedVendor && vendor?.b2bSellingStatus?.toLowerCase() !== 'approved') ? "🔒 BOTH (Locked)" : "BOTH (B2C & B2B)"}
                        </option>
                      </select>
                    </td>

                    {/* B2B Price */}
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        disabled={isB2C}
                        placeholder={isB2C ? "N/A (B2C Only)" : "B2B Price *"}
                        value={isB2C ? "" : row.b2bWholesalePrice}
                        onChange={(e) =>
                          handleGridChange(row.id, "b2bWholesalePrice", e.target.value)
                        }
                        className={`w-full border rounded-lg px-2 py-1.5 text-xs outline-none ${
                          isB2C
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white border-amber-300 focus:border-amber-500 font-semibold text-gray-900"
                        }`}
                      />
                    </td>

                    {/* B2B Min Qty */}
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        disabled={isB2C}
                        placeholder={isB2C ? "N/A" : "Min Qty"}
                        value={isB2C ? "" : row.b2bMinOrderQty}
                        onChange={(e) =>
                          handleGridChange(row.id, "b2bMinOrderQty", e.target.value)
                        }
                        className={`w-full border rounded-lg px-2 py-1.5 text-xs text-center outline-none ${
                          isB2C
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white border-gray-300 focus:border-amber-500 text-gray-900"
                        }`}
                      />
                    </td>

                    {/* B2B Units Per Carton */}
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        disabled={isB2C}
                        placeholder={isB2C ? "N/A" : "Carton Qty"}
                        value={isB2C ? "" : row.b2bUnitsPerCarton}
                        onChange={(e) =>
                          handleGridChange(row.id, "b2bUnitsPerCarton", e.target.value)
                        }
                        className={`w-full border rounded-lg px-2 py-1.5 text-xs text-center outline-none ${
                          isB2C
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white border-gray-300 focus:border-amber-500 text-gray-900"
                        }`}
                      />
                    </td>

                    {/* GST Rate */}
                    <td className="p-2">
                      <select
                        disabled={isB2C}
                        value={isB2C ? "18" : row.b2bGstRate}
                        onChange={(e) =>
                          handleGridChange(row.id, "b2bGstRate", e.target.value)
                        }
                        className={`w-full border rounded-lg px-2 py-1.5 text-xs outline-none text-center ${
                          isB2C
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white border-gray-300 focus:border-amber-500 text-gray-900"
                        }`}
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </td>

                    {/* Lead Time Days */}
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        disabled={isB2C}
                        placeholder={isB2C ? "N/A" : "Days"}
                        value={isB2C ? "" : row.b2bLeadTimeDays}
                        onChange={(e) =>
                          handleGridChange(row.id, "b2bLeadTimeDays", e.target.value)
                        }
                        className={`w-full border rounded-lg px-2 py-1.5 text-xs text-center outline-none ${
                          isB2C
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white border-gray-300 focus:border-amber-500 text-gray-900"
                        }`}
                      />
                    </td>

                    {/* Condition */}
                    <td className="p-2">
                      <select
                        value={row.condition}
                        onChange={(e) =>
                          handleGridChange(row.id, "condition", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none"
                      >
                        <option value="brand_new">Brand New</option>
                        <option value="open_box">Open Box</option>
                        <option value="refurbished">Refurbished</option>
                        <option value="renewed">Renewed</option>
                      </select>
                    </td>

                    {/* Refurb Grade */}
                    <td className="p-2">
                      <select
                        value={row.refurbishedGrade}
                        onChange={(e) =>
                          handleGridChange(row.id, "refurbishedGrade", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2 py-1.5 text-gray-900 text-xs outline-none"
                      >
                        <option value="">N/A</option>
                        <option value="A">Grade A</option>
                        <option value="B">Grade B</option>
                        <option value="C">Grade C</option>
                      </select>
                    </td>

                    {/* COD Allowed */}
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.codAllowed}
                        onChange={(e) =>
                          handleGridChange(row.id, "codAllowed", e.target.checked)
                        }
                        className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                      />
                    </td>

                    {/* Returnable */}
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.returnable}
                        onChange={(e) =>
                          handleGridChange(row.id, "returnable", e.target.checked)
                        }
                        className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                      />
                    </td>

                    {/* Cancelable */}
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.cancelable}
                        onChange={(e) =>
                          handleGridChange(row.id, "cancelable", e.target.checked)
                        }
                        className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                      />
                    </td>

                    {/* Tax Included */}
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.taxIncluded}
                        onChange={(e) =>
                          handleGridChange(row.id, "taxIncluded", e.target.checked)
                        }
                        className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                      />
                    </td>

                    {/* Description */}
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Description..."
                        value={row.description}
                        onChange={(e) =>
                          handleGridChange(row.id, "description", e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-gray-900 text-xs outline-none"
                      />
                    </td>

                    {/* Actions */}
                    <td className="p-2 text-center sticky right-0 bg-white z-10 shadow-sm">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          title="Clone Row"
                          onClick={() => cloneGridRow(row)}
                          className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-md transition"
                        >
                          <FiCopy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete Row"
                          onClick={() => removeGridRow(row.id)}
                          className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-md transition"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between gap-4">
            <button
              onClick={addGridRow}
              className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-semibold transition"
            >
              <FiPlus className="w-4 h-4" /> Add Another Product Row
            </button>

            <button
              disabled={submitting}
              onClick={submitGridProducts}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-amber-600/20 disabled:opacity-50 transition flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                  <span>Uploading Products...</span>
                </>
              ) : (
                <>
                  <span>Create {gridRows.length} Products</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: EXCEL / CSV UPLOAD - LIGHT THEME */}
      {activeTab === "file" && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-2xl p-8 text-center transition group shadow-sm">
            <input
              type="file"
              id="productFileInput"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="productFileInput" className="cursor-pointer space-y-3 block">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto transition border border-amber-100">
                <FiUploadCloud className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {fileName ? (
                    <span className="text-amber-600">{fileName}</span>
                  ) : (
                    "Click to upload or drag & drop Product Excel / CSV file"
                  )}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Upload product catalog spreadsheet containing full product details (Pricing, B2B, Refurbished, Policies).
                </p>
              </div>
            </label>
          </div>

          {parsedRows.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      filterType === "all"
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All ({parsedRows.length})
                  </button>
                  <button
                    onClick={() => setFilterType("valid")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      filterType === "valid"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Valid ({parsedRows.filter((r) => r.isValid).length})
                  </button>
                  <button
                    onClick={() => setFilterType("errors")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      filterType === "errors"
                        ? "bg-red-50 text-red-700 border border-red-200 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Errors ({parsedRows.filter((r) => !r.isValid).length})
                  </button>
                </div>

                <button
                  disabled={submitting || parsedRows.filter((r) => r.isValid).length === 0}
                  onClick={submitParsedProducts}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-4 h-4" />
                      <span>
                        Import {parsedRows.filter((r) => r.isValid).length} Valid Products
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Product Name</th>
                      <th className="p-3 font-semibold min-w-[180px]">Product Image URL</th>
                      <th className="p-3 font-semibold">Category</th>
                      <th className="p-3 font-semibold">Brand</th>
                      <th className="p-3 font-semibold">Price (₹)</th>
                      <th className="p-3 font-semibold">MRP (₹)</th>
                      <th className="p-3 font-semibold">Stock Qty</th>
                      <th className="p-3 font-semibold">Unit</th>
                      <th className="p-3 font-semibold">Sales Channel</th>
                      <th className="p-3 font-semibold">Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredParsedRows.map((row) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          !row.isValid ? "bg-red-50/50" : ""
                        }`}
                      >
                        <td className="p-3">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <FiCheckCircle className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span
                              title={row.errors.join(", ")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 border border-red-200 cursor-help"
                            >
                              <FiAlertCircle className="w-3 h-3" /> Error
                            </span>
                          )}
                        </td>

                        <td className="p-2">
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) =>
                              handleParsedRowChange(row.id, "name", e.target.value)
                            }
                            className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 text-xs w-full"
                          />
                        </td>

                        <td className="p-2">
                          <div className="flex items-center gap-1.5">
                            {row.image ? (
                              <img
                                src={row.image}
                                alt="Preview"
                                className="w-7 h-7 object-cover rounded border border-gray-300 shrink-0 shadow-xs"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
                                <FiImage className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <input
                              type="text"
                              placeholder="Product Image URL..."
                              value={row.image || ""}
                              onChange={(e) =>
                                handleParsedRowChange(row.id, "image", e.target.value)
                              }
                              className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 text-xs w-full"
                            />
                          </div>
                        </td>

                        <td className="p-2">
                          <input
                            type="text"
                            value={row.categoryName}
                            onChange={(e) =>
                              handleParsedRowChange(
                                row.id,
                                "categoryName",
                                e.target.value
                              )
                            }
                            className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 text-xs w-full"
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="text"
                            value={row.brandName}
                            onChange={(e) =>
                              handleParsedRowChange(row.id, "brandName", e.target.value)
                            }
                            className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 text-xs w-full"
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="number"
                            value={row.price}
                            onChange={(e) =>
                              handleParsedRowChange(row.id, "price", e.target.value)
                            }
                            className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 text-xs w-24"
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="number"
                            value={row.originalPrice}
                            onChange={(e) =>
                              handleParsedRowChange(
                                row.id,
                                "originalPrice",
                                e.target.value
                              )
                            }
                            className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 text-xs w-24"
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="number"
                            value={row.stockQuantity}
                            onChange={(e) =>
                              handleParsedRowChange(
                                row.id,
                                "stockQuantity",
                                e.target.value
                              )
                            }
                            className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 text-xs w-20 text-center"
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="text"
                            value={row.unit}
                            onChange={(e) =>
                              handleParsedRowChange(row.id, "unit", e.target.value)
                            }
                            className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 text-xs w-20"
                          />
                        </td>

                        <td className="p-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                            {row.salesChannel}
                          </span>
                        </td>

                        <td className="p-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            {row.condition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RESULTS MODAL - LIGHT THEME */}
      <AnimatePresence>
        {resultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200">
                  <FiCheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Bulk Product Creation Complete
                  </h3>
                  <p className="text-xs text-gray-500">
                    Products have been processed and added to catalog.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                <div>
                  <span className="text-xs text-gray-500">Products Created</span>
                  <p className="text-2xl font-bold text-emerald-600">
                    {resultModal.successCount || 0}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Failed / Skipped</span>
                  <p className="text-2xl font-bold text-red-600">
                    {resultModal.failedCount || 0}
                  </p>
                </div>
              </div>

              {resultModal.errors && resultModal.errors.length > 0 && (
                <div className="max-h-36 overflow-y-auto bg-red-50 border border-red-200 p-3 rounded-xl space-y-1 text-xs text-red-800">
                  <span className="font-semibold block mb-1">Errors encountered:</span>
                  {resultModal.errors.map((e, idx) => (
                    <div key={idx}>
                      • Row #{e.row}: {e.message}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setResultModal(null);
                    clearGridRows();
                    setParsedRows([]);
                    setFileName("");
                  }}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
                >
                  Create More Products
                </button>
                <button
                  onClick={() => navigate("/vendor/products/manage-products")}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-amber-600/20 transition"
                >
                  Manage Products
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
