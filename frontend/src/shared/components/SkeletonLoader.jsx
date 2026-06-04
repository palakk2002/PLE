import React from "react";

// Individual Product Card Skeleton
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-100 dark:border-neutral-800 p-3 flex flex-col gap-2.5 animate-pulse shadow-sm h-full">
      {/* Product Image placeholder */}
      <div className="w-full aspect-square bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
      
      {/* Category line */}
      <div className="h-3 w-1/3 bg-gray-200 dark:bg-neutral-800 rounded"></div>
      
      {/* Title block */}
      <div className="space-y-1.5 pt-0.5">
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-neutral-800 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-neutral-800 rounded"></div>
      </div>
      
      {/* Price and actions spacing */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="h-5 w-1/4 bg-gray-200 dark:bg-neutral-800 rounded"></div>
        <div className="h-8 w-1/3 bg-gray-200 dark:bg-neutral-800 rounded-lg"></div>
      </div>
    </div>
  );
};

// Table Row Skeleton placeholder
export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-gray-100 dark:border-neutral-800 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className={`h-4 bg-gray-200 dark:bg-neutral-800 rounded ${i === 0 ? "w-1/4" : i === 1 ? "w-1/2" : "w-3/4"}`}></div>
        </td>
      ))}
    </tr>
  );
};

// Full Table Skeleton layout
export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full overflow-hidden border border-gray-100 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#1A1A1A]">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-3.5 bg-gray-200 dark:bg-neutral-800 rounded w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Dashboard Card Skeleton metrics block
export const DashboardCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-neutral-800 rounded"></div>
        <div className="w-9 h-9 bg-gray-200 dark:bg-neutral-800 rounded-full"></div>
      </div>
      <div className="space-y-1.5">
        <div className="h-7 w-1/2 bg-gray-200 dark:bg-neutral-800 rounded"></div>
        <div className="h-3 w-2/3 bg-gray-200 dark:bg-neutral-800 rounded"></div>
      </div>
    </div>
  );
};

// Export all by default as a group utility
export default {
  ProductCardSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  DashboardCardSkeleton,
};
