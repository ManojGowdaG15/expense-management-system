// src/components/ExpenseTable.jsx - ENHANCED
import { 
  FaCheck, 
  FaTimes, 
  FaEye, 
  FaRupeeSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaPlane,
  FaUtensils,
  FaHotel,
  FaBox,
  FaPaperclip
} from 'react-icons/fa';
import { FiFileText } from 'react-icons/fi';

export default function ExpenseTable({ expenses, isManager = false, onStatusUpdate }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Travel': <FaPlane style={{ color: '#3b82f6' }} />,
      'Food': <FaUtensils style={{ color: '#ef4444' }} />,
      'Accommodation': <FaHotel style={{ color: '#10b981' }} />,
      'Office Supplies': <FaPaperclip style={{ color: '#8b5cf6' }} />,
      'Others': <FaBox style={{ color: '#64748b' }} />
    };
    return icons[category] || <FiFileText style={{ color: '#94a3b8' }} />;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': <FaClock style={{ fontSize: '0.875rem' }} />,
      'Approved': <FaCheckCircle style={{ fontSize: '0.875rem' }} />,
      'Rejected': <FaTimesCircle style={{ fontSize: '0.875rem' }} />
    };
    return icons[status] || <FaClock style={{ fontSize: '0.875rem' }} />;
  };

  const handleStatusChange = async (id, status, comments) => {
    await onStatusUpdate(id, { status, managerComments: comments });
  };

  if (expenses.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">
            <FiFileText />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>No Expenses Found</h3>
          <p style={{ color: '#94a3b8' }}>Submit your first expense claim to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.25rem'
          }}>
            <FiFileText />
          </div>
          <div>
            <h2>{isManager ? 'All Expense Claims' : 'My Expense History'}</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              {expenses.length} {expenses.length === 1 ? 'record' : 'records'} found
            </p>
          </div>
        </div>
      </div>
      
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              {isManager && <th>Employee</th>}
              {isManager && <th style={{ textAlign: 'center' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id}>
                <td>
                  <div style={{ fontWeight: '600', color: '#1e293b' }}>
                    {formatDate(exp.expenseDate)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Submitted: {new Date(exp.submittedDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#1e293b' }}>
                    <FaRupeeSign style={{ fontSize: '0.875rem', color: '#10b981' }} />
                    <span>{exp.amount.toFixed(2)}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getCategoryIcon(exp.category)}
                    <span style={{ fontWeight: '600' }}>{exp.category}</span>
                  </div>
                </td>
                <td>
                  <div style={{ color: '#475569' }}>
                    {exp.description || (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No description</span>
                    )}
                    {exp.receiptDetails && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                        <FaPaperclip style={{ fontSize: '0.7rem' }} />
                        {exp.receiptDetails}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-${exp.status.toLowerCase()}`}>
                    {getStatusIcon(exp.status)}
                    {exp.status}
                  </span>
                </td>
                {isManager && (
                  <td>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{exp.userName}</div>
                  </td>
                )}
                {isManager && (
                  <td style={{ textAlign: 'center' }}>
                    {exp.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => {
                            const comments = prompt('Comments (optional):');
                            if (comments !== null) {
                              handleStatusChange(exp._id, 'Approved', comments || 'Approved');
                            }
                          }}
                          className="btn btn-success"
                          style={{ padding: '8px 16px', fontSize: '0.75rem' }}
                        >
                          <FaCheck style={{ marginRight: '4px' }} /> Approve
                        </button>
                        <button
                          onClick={() => {
                            const comments = prompt('Reason for rejection:');
                            if (comments !== null) {
                              handleStatusChange(exp._id, 'Rejected', comments || 'Rejected');
                            }
                          }}
                          className="btn btn-danger"
                          style={{ padding: '8px 16px', fontSize: '0.75rem' }}
                        >
                          <FaTimes style={{ marginRight: '4px' }} /> Reject
                        </button>
                      </div>
                    ) : (
                      <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                        {exp.managerComments && (
                          <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <FaEye style={{ fontSize: '0.75rem', marginTop: '3px', flexShrink: 0 }} />
                            <span>{exp.managerComments}</span>
                          </div>
                        )}
                        {exp.approvedDate && (
                          <div style={{ fontSize: '0.75rem' }}>
                            {formatDate(exp.approvedDate)}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}