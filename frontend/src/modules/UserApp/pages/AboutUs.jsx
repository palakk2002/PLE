import { FiUsers, FiTarget, FiHeart, FiAward, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const AboutUs = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <FiHeart className="text-2xl text-[#7B0A0A] dark:text-red-400" />,
      title: "Customer First",
      description: "Everything we do is designed to create a seamless, satisfying shopping experience for our customers.",
    },
    {
      icon: <FiAward className="text-2xl text-[#7B0A0A] dark:text-red-400" />,
      title: "Premium Quality",
      description: "We partner exclusively with verified suppliers and top brands to ensure only authentic products reach you.",
    },
    {
      icon: <FiTarget className="text-2xl text-[#7B0A0A] dark:text-red-400" />,
      title: "Innovation",
      description: "We constantly evolve our technology platform to offer state-of-the-art features and personalization.",
    },
    {
      icon: <FiUsers className="text-2xl text-[#7B0A0A] dark:text-red-400" />,
      title: "Community & Trust",
      description: "We build secure relationships with our sellers, buyers, and delivery team to foster community trust.",
    },
  ];

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24 min-h-screen">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors bg-white dark:bg-neutral-900 shadow-sm border border-gray-200 dark:border-neutral-800"
            >
              <FiArrowLeft className="text-xl text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FiUsers className="text-[#7B0A0A] dark:text-red-400" /> About Us
              </h1>
              <p className="text-xs text-gray-500 font-medium">Discover who we are and what we stand for</p>
            </div>
          </div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden bg-gradient-to-r from-red-50 to-white dark:from-neutral-900 dark:to-black border border-red-100/60 dark:border-0 text-gray-800 dark:text-white rounded-3xl p-8 md:p-12 mb-12 shadow-sm"
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-10" />
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7B0A0A] dark:text-red-400">Our Mission</span>
              <h2 className="text-2xl md:text-4xl font-extrabold mt-2 mb-4 leading-tight text-[#7B0A0A] dark:text-white">
                Redefining the Future of Smart Commerce.
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                At PLE, we connect global and local brands directly with consumers, providing an elegant and high-speed shopping experience built on trust, transparency, and top-tier customer service.
              </p>
            </div>
          </motion.div>

          {/* Story Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Our Story</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Founded with the vision to bridge the gap between premium lifestyle products and accessibility, PLE started as a boutique hub. Today, we have expanded to serve millions of customers, delivering authentic fashion, electronics, daily essentials, and unique refurbished collections.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                We believe in sustainability and value. Through our refurbished and marketplace initiatives, we give high-quality items a second life, promoting a greener circular economy.
              </p>
            </div>
            <div className="bg-red-50/25 dark:bg-neutral-900 border border-red-100/50 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-center">
              <h4 className="text-3xl font-extrabold text-[#7B0A0A] dark:text-red-400 mb-1">5M+</h4>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Happy Customers Globally</p>
              <h4 className="text-3xl font-extrabold text-[#7B0A0A] dark:text-red-400 mb-1">99.8%</h4>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Verified Safe Deliveries</p>
              <h4 className="text-3xl font-extrabold text-[#7B0A0A] dark:text-red-400 mb-1">200+</h4>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Premium Curated Partners</p>
            </div>
          </div>

          {/* Values Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 text-center mb-2">Our Core Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-neutral-950 border border-red-50 dark:border-neutral-900 rounded-2xl p-6 shadow-sm flex gap-4"
                >
                  <div className="flex-shrink-0 p-3 bg-red-50 dark:bg-neutral-900 rounded-xl h-fit">
                    {val.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">{val.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{val.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default AboutUs;
