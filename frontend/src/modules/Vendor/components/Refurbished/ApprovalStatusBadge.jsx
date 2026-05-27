import React from 'react';
import { APPROVAL_STATUSES } from './refurbishedConstants';

const ApprovalStatusBadge = ({ status = 'pending', className = '' }) => {
  const config = APPROVAL_STATUSES[status] || APPROVAL_STATUSES.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.bgClass} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
};

export default ApprovalStatusBadge;
