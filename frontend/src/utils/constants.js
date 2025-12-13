export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  FINANCE: 'finance',
  ADMIN: 'admin'
};

export const EXPENSE_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REIMBURSED: 'reimbursed'
};

export const EXPENSE_CATEGORIES = [
  'Travel',
  'Food',
  'Accommodation',
  'Office Supplies',
  'Equipment',
  'Software',
  'Training',
  'Other'
];

export const STATUS_COLORS = {
  draft: '#6c757d',
  submitted: '#ffc107',
  approved: '#28a745',
  rejected: '#dc3545',
  reimbursed: '#17a2b8'
};

export const STATUS_LABELS = {
  draft: 'Draft',
  submitted: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  reimbursed: 'Paid'
};
