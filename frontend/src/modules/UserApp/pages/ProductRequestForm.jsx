import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiCamera, FiUploadCloud, FiTrash2, FiFileText } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import api from "../../../shared/utils/api";

const ProductRequestForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledName = searchParams.get("name") || "";
  const targetType = searchParams.get("targetType") || "";
  const targetId = searchParams.get("targetId") || "";
  const targetName = searchParams.get("targetName") || "";

  const [formData, setFormData] = useState({
    name: prefilledName,
    category: "",
    quantity: 1,
    budget: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    "Clothing & Fashion",
    "Footwear",
    "Bags & Luggage",
    "Jewelry & Watches",
    "Accessories",
    "Athletic & Activewear",
    "Electronics",
    "Home & Living",
    "Others",
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return;
    }
    if (formData.quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    if (!formData.budget || Number(formData.budget) <= 0) {
      toast.error("Expected budget must be greater than 0");
      return;
    }

    try {
      let uploadedImageUrl = null;

      if (image) {
        const uploadData = new FormData();
        uploadData.append('file', image);

        const uploadRes = await api.post('/user/rfq/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Handling response format depending on api.js interceptor
        if (uploadRes.success || uploadRes.statusCode === 200) {
           uploadedImageUrl = uploadRes.data?.url || uploadRes.url;
        } else {
           throw new Error("Failed to upload image");
        }
      }

      const payload = {
        productName: formData.name,
        category: formData.category,
        quantity: Number(formData.quantity),
        expectedBudget: Number(formData.budget),
        description: formData.description,
        image: uploadedImageUrl,
        requestType: targetId ? 'SHOP_SPECIFIC' : 'GENERAL',
        targetEntityType: targetId ? targetType : undefined,
        targetEntityId: targetId ? targetId : undefined
      };

      const res = await api.post('/user/product-requests', payload);

      if (res.success || res.statusCode === 201) {
        toast.success("Product request submitted successfully!");
        navigate("/product-requests");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit request.");
    }
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="w-full pb-24 max-w-2xl mx-auto min-h-screen bg-gray-50 px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm border border-gray-200"
            >
              <FiArrowLeft className="text-xl text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Request a Product</h1>
              <p className="text-sm text-gray-500 mt-0.5">Let us know what product you are looking for</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {targetName && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Target Store</p>
                    <p className="text-sm font-bold text-[#7B0A0A]">{targetName}</p>
                  </div>
                  <span className="text-[10px] bg-red-100 text-[#7B0A0A] px-2 py-0.5 rounded-full font-bold">
                    Direct Request
                  </span>
                </div>
              )}
              {/* Product Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter the name of the product"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors text-base"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors text-base bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors text-base"
                  />
                </div>

                {/* Expected Budget */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Expected Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="E.g. 1500"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors text-base"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe specifications like size, color, brand preferences, or model number..."
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors text-base"
                />
              </div>

              {/* Reference Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Reference Image (Optional)</label>
                
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 aspect-video bg-gray-50 flex items-center justify-center">
                    <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 right-4 p-2 bg-red-650 hover:bg-red-750 text-white rounded-full transition-colors shadow"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("img-upload").click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                      dragActive ? "border-red-500 bg-red-50/50" : "border-gray-300 hover:border-red-400"
                    }`}
                  >
                    <input
                      id="img-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <FiUploadCloud className="mx-auto text-4xl text-gray-400 mb-3" />
                    <p className="text-sm font-bold text-gray-700">Drag and drop your image here, or browse</p>
                    <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#AE020B] hover:bg-[#8d0208] text-white font-extrabold rounded-xl text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <FiFileText />
                <span>Submit Request</span>
              </button>
            </form>
          </div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default ProductRequestForm;
