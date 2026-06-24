import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, getStatusColor } from '../../utils/adminHelpers';
import Badge from '../../../../shared/components/Badge';
import Pagination from '../Pagination';

const TopProducts = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Top Selling Products</h3>
      {products && products.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedProducts.map((product, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              // Support both real API shape and mock data shape
              const salesCount = product.totalSold ?? product.sales ?? 0;
              return (
                <motion.div
                  key={product._id || product.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                      {globalIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">
                          {salesCount} sold
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-bold text-gray-800">{formatCurrency(product.revenue || 0)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={products.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              className="mt-4"
            />
          )}
        </>
      ) : (
        <div className="h-[200px] flex flex-col items-center justify-center text-gray-400">
          <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p className="font-semibold text-sm">No products sold yet</p>
          <p className="text-xs">Top selling products will appear here once orders are placed.</p>
        </div>
      )}
    </div>
  );
};

export default TopProducts;

