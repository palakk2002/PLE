import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCatalogBrands } from '../../data/catalogData';

const BrandLogosScroll = ({ brands = null }) => {
    const navigate = useNavigate();
    const fallbackBrands = getCatalogBrands().slice(0, 10);
    const displayBrands = Array.isArray(brands) && brands.length > 0
        ? brands.slice(0, 10)
        : fallbackBrands;

    return (
        <section className="bg-transparent w-full overflow-hidden">
            {/* Desktop Layout - White card container */}
            <div className="hidden md:block bg-white rounded-lg mb-4 p-4">
                <div className="w-full overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="flex gap-4 min-w-max pb-2">
                        {displayBrands.map((brand, index) => (
                            <motion.div
                                key={brand.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                className="flex-shrink-0 flex flex-col items-center"
                                style={{ width: '64px' }}
                            >
                                <div
                                    onClick={() => navigate(`/brand/${brand.id}`)}
                                    className="bg-gray-50 dark:bg-[#000000] dark:border-[rgba(123,10,10,0.3)] dark:hover:border-[#7B0A0A] rounded-lg p-2 shadow-sm transition-all duration-300 flex items-center justify-center w-16 h-16 group cursor-pointer border border-gray-100 mb-2 hover:shadow-md hover:border-gray-200 dark:hover:shadow-[0_0_12px_rgba(123,10,10,0.4)]">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/120x80?text=Brand';
                                        }}
                                        loading="lazy"
                                    />
                                </div>
                                <p className="text-xs font-medium text-gray-700 text-center truncate w-full">
                                    {brand.name}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Layout - Unchanged */}
            <div className="md:hidden w-full">
                <style>{`
          @media (min-width: 1024px) {
            .brand-card-desktop {
              width: 5rem !important;
              min-width: 5rem !important;
              max-width: 5rem !important;
            }
          }
          @media (min-width: 1280px) {
            .brand-card-desktop {
              width: 6rem !important;
              min-width: 6rem !important;
              max-width: 6rem !important;
            }
          }
        `}</style>
                <div className="w-full overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="flex gap-3 sm:gap-4 lg:gap-3 min-w-max px-4 pb-2">
                        {displayBrands.map((brand, index) => (
                            <motion.div
                                key={brand.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                className="flex-shrink-0 flex flex-col items-center brand-card-desktop"
                                style={{
                                    width: 'calc((100vw - 2rem - 0.75rem * 3) / 4)',
                                    minWidth: 'calc((100vw - 2rem - 0.75rem * 3) / 4)',
                                    maxWidth: 'calc((100vw - 2rem - 0.75rem * 3) / 4)',
                                }}
                            >
                                <div
                                    onClick={() => navigate(`/brand/${brand.id}`)}
                                    className="bg-white dark:bg-[#000000] dark:border dark:border-[rgba(123,10,10,0.3)] dark:hover:border-[#7B0A0A] rounded-2xl p-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_0_12px_rgba(123,10,10,0.2)] transition-all duration-300 flex items-center justify-center w-full aspect-square group cursor-pointer mb-1.5 hover:shadow-md dark:hover:shadow-[0_0_18px_rgba(123,10,10,0.4)]">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="w-[85%] h-[85%] object-contain dark:brightness-90"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/120x80?text=Brand';
                                        }}
                                        loading="lazy"
                                    />
                                </div>
                                <p className="text-[11px] font-bold text-gray-800 dark:text-white text-center transition-colors truncate w-full px-1 mt-1">
                                    {brand.name}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandLogosScroll;
