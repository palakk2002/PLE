import { FiHelpCircle, FiMessageSquare, FiUpload, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSupportStore } from "../../../shared/store/supportStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const HelpSupport = () => {
  const navigate = useNavigate();
  const createTicket = useSupportStore((state) => state.createTicket);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      subject: "",
      category: "Order Issue",
      description: "",
      priority: "medium",
      screenshot: ""
    }
  });

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
        setValue("screenshot", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const result = await createTicket({
        subject: data.subject,
        category: data.category,
        description: data.description,
        priority: data.priority,
        screenshot: data.screenshot || null
      });

      if (result) {
        toast.success("Support ticket created successfully!");
        reset();
        setScreenshotPreview(null);
        navigate("/support-tickets");
      }
    } catch (e) {
      toast.error("Failed to create ticket. Please try again.");
    }
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="max-w-2xl mx-auto p-4 pb-24">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="text-xl text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FiHelpCircle className="text-[#7B0A0A]" /> Help & Support
            </h1>
          </div>

          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm mb-6">
            <p className="text-gray-600 mb-6">
              Have an issue with an order, payment, refund, or need technical help? Create a support ticket below, and our support team will assist you immediately.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject *</label>
                <input
                  type="text"
                  {...register("subject", { required: "Subject is required" })}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    errors.subject ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Summarize your issue..."
                  disabled={isSubmitting}
                />
                {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Issue Category *</label>
                  <select
                    {...register("category", { required: "Category is required" })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    disabled={isSubmitting}
                  >
                    <option value="Order Issue">Order Issue</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Refund Issue">Refund Issue</option>
                    <option value="Return Issue">Return Issue</option>
                    <option value="Delivery Issue">Delivery Issue</option>
                    <option value="Account Issue">Account Issue</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Urgency *</label>
                  <select
                    {...register("priority")}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    disabled={isSubmitting}
                  >
                    <option value="low">Low - General Question</option>
                    <option value="medium">Medium - Needs Attention</option>
                    <option value="high">High - Urgent Issue</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  {...register("description", { required: "Description cannot be empty" })}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    errors.description ? "border-red-500" : "border-gray-200"
                  }`}
                  rows={5}
                  placeholder="Provide all relevant details (order numbers, dates, error details) to help us resolve this quickly..."
                  disabled={isSubmitting}
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Screenshot / Attachment (Optional)</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-150 text-gray-700 hover:bg-gray-200 transition-colors rounded-xl cursor-pointer border border-gray-250 font-semibold text-sm">
                    <FiUpload />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>
                  {screenshotPreview && (
                    <div className="relative w-16 h-16 border rounded-lg overflow-hidden bg-gray-50">
                      <img src={screenshotPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setScreenshotPreview(null);
                          setValue("screenshot", "");
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => navigate("/support-tickets")}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all font-bold text-center"
                >
                  View My Tickets
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#7B0A0A] text-white py-3 rounded-xl hover:bg-[#AE020B] transition-all font-bold disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default HelpSupport;
