import { motion } from 'framer-motion';
import PortfolioCMS from './cms/PortfolioCMS.jsx';

const Content = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Portfolio Content</h1>
          <p className="text-gray-600">Manage your portfolio pages</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <PortfolioCMS />
        </div>
      </div>
    </motion.div>
  );
};

export default Content;
