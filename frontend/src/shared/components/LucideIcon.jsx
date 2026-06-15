import React from 'react';
import * as Lucide from 'lucide-react';

const LucideIcon = ({ name, ...props }) => {
  // Fallback if name is empty or not found in Lucide
  const IconComponent = (name && Lucide[name]) || Lucide.Package;
  return <IconComponent {...props} />;
};

export default LucideIcon;
