import { FiHelpCircle, FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const MobileHelpSupport = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Simulate sending support request (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Your support request has been submitted!");
      reset();
    } catch (e) {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <motion.div className="max-w-md mx-auto p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FiHelpCircle className="text-primary-600" /> Help & Support
          </h1>
          <p className="mb-6 text-gray-600">
            Need assistance? Fill out the form below and our support team will get back to you shortly.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`w-full px-3 py-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className={`w-full px-3 py-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                {...register("message", { required: "Message cannot be empty" })}
                className={`w-full px-3 py-2 border rounded ${errors.message ? "border-red-500" : "border-gray-300"}`}
                rows={4}
                placeholder="Describe your issue..."
                disabled={isSubmitting}
              />
              {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Submit Request"}
            </button>
          </form>
        </motion.div>
      </MobileLayout>
    </PageTransition>
  );
};

export default MobileHelpSupport;
