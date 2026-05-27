export const CONDITIONS = {
  brand_new: {
    value: 'brand_new',
    label: 'Brand New',
    description: 'Fresh out of the factory, original sealed packaging.',
    badgeClass: 'bg-primary-50 text-primary-700 border-primary-100',
    variant: 'info'
  },
  refurbished: {
    value: 'refurbished',
    label: 'Refurbished',
    description: 'Professionally restored, fully tested, and certified.',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    variant: 'refurbished'
  },
  renewed: {
    value: 'renewed',
    label: 'Renewed',
    description: 'Inspected and tested to look and work like new.',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    variant: 'renewed'
  },
  open_box: {
    value: 'open_box',
    label: 'Open Box',
    description: 'Unused product in an opened or damaged original retail box.',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
    variant: 'open-box'
  }
};

export const GRADES = {
  A: {
    value: 'A',
    label: 'Grade A (Excellent)',
    description: 'Like new condition. Zero cosmetic scratches, scuffs, or dents. Fully functional.',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  B: {
    value: 'B',
    label: 'Grade B (Good)',
    description: 'Good condition. Minor cosmetic scratches or scuffs, but no dents. Fully functional.',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  C: {
    value: 'C',
    label: 'Grade C (Fair)',
    description: 'Fair condition. Visible scratches, minor dents, or scuffs. Fully functional.',
    badgeColor: 'bg-amber-100 text-amber-800'
  }
};

export const WARRANTY_OPTIONS = [
  { value: 'none', label: 'No Warranty' },
  { value: '3_months', label: '3 Months Warranty' },
  { value: '6_months', label: '6 Months Warranty' },
  { value: '1_year', label: '1 Year Warranty' },
  { value: '2_years', label: '2 Years Warranty' }
];

export const COSMETIC_CONDITIONS = [
  { value: 'excellent', label: 'Excellent (No visible wear)' },
  { value: 'good', label: 'Good (Light scratches/scuffs)' },
  { value: 'fair', label: 'Fair (Medium scratches/minor dents)' },
  { value: 'poor', label: 'Poor (Heavy scratches/scuffs)' }
];

export const FUNCTIONAL_CONDITIONS = [
  { value: 'fully_working', label: 'Fully Working (Passed 30+ point tests)' },
  { value: 'partial_issues', label: 'Partial Issues (Minor bugs, fully disclosed)' },
  { value: 'not_working', label: 'Not Working (For parts / repair)' }
];

export const APPROVAL_STATUSES = {
  pending: {
    label: 'Pending Approval',
    bgClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500'
  },
  approved: {
    label: 'Approved',
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500'
  },
  rejected: {
    label: 'Rejected',
    bgClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500'
  }
};

export const DEFAULT_REFURBISHED_STATE = {
  condition: 'brand_new',
  refurbishedGrade: '',
  refurbishedWarrantyDuration: 'none',
  deviceHealthBattery: 100,
  deviceHealthCosmetic: 'excellent',
  deviceHealthFunctional: 'fully_working',
  isTested: false,
  isFullyFunctional: false,
  isCertified: false,
  refurbishedOriginalMrp: '',
  refurbishedSellingPrice: '',
  accessoryCharger: false,
  accessoryBox: false,
  accessoryOthers: false,
  cosmeticDamageNotes: '',
  productAgeMonths: '',
  purchaseYear: '',
  repairHistory: '',
  refurbishedApprovalStatus: 'approved' // Mock default to approved to display on lists immediately
};
