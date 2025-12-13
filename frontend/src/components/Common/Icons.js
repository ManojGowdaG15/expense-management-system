import React from 'react';
import { 
  FiDollarSign, 
  FiPlus, 
  FiClock, 
  FiUsers, 
  FiCheck, 
  FiX, 
  FiFileText,
  FiBarChart2,
  FiUser,
  FiCalendar,
  FiPieChart,
  FiCreditCard
} from 'react-icons/fi';
import { 
  MdDashboard,
  MdPendingActions
} from 'react-icons/md';
import { 
  FaRegMoneyBillAlt,
  FaHistory
} from 'react-icons/fa';

export const DashboardIcon = ({ size = 20, color = '#4F46E5' }) => (
  <MdDashboard size={size} color={color} />
);

export const ExpensesIcon = ({ size = 20, color = '#10B981' }) => (
  <FiDollarSign size={size} color={color} />
);

export const AddExpenseIcon = ({ size = 20, color = '#3B82F6' }) => (
  <FiPlus size={size} color={color} />
);

export const PendingIcon = ({ size = 20, color = '#F59E0B' }) => (
  <MdPendingActions size={size} color={color} />
);

export const TeamIcon = ({ size = 20, color = '#8B5CF6' }) => (
  <FiUsers size={size} color={color} />
);

export const ReimbursementsIcon = ({ size = 20, color = '#EC4899' }) => (
  <FiCreditCard size={size} color={color} />
);

export const ReportsIcon = ({ size = 20, color = '#6366F1' }) => (
  <FiBarChart2 size={size} color={color} />
);

export const CheckIcon = ({ size = 20, color = '#10B981' }) => (
  <FiCheck size={size} color={color} />
);

export const CrossIcon = ({ size = 20, color = '#EF4444' }) => (
  <FiX size={size} color={color} />
);

export const ClockIcon = ({ size = 20, color = '#F59E0B' }) => (
  <FiClock size={size} color={color} />
);

export const UserIcon = ({ size = 20, color = '#8B5CF6' }) => (
  <FiUser size={size} color={color} />
);

export const CalendarIcon = ({ size = 20, color = '#3B82F6' }) => (
  <FiCalendar size={size} color={color} />
);

export const ChartIcon = ({ size = 20, color = '#10B981' }) => (
  <FiPieChart size={size} color={color} />
);

export const MoneyIcon = ({ size = 20, color = '#10B981' }) => (
  <FaRegMoneyBillAlt size={size} color={color} />
);

export const FileIcon = ({ size = 20, color = '#6B7280' }) => (
  <FiFileText size={size} color={color} />
);

export const HistoryIcon = ({ size = 20, color = '#6B7280' }) => (
  <FaHistory size={size} color={color} />
);