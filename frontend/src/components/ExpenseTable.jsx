// src/components/ExpenseTable.jsx

export default function ExpenseTable({ expenses, isManager = false, onStatusUpdate }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const handleStatusChange = async (id, status, comments) => {
    await onStatusUpdate(id, { status, managerComments: comments });
  };

  return (
    <div className="card">
      <h2>{isManager ? 'All Expense Claims' : 'My Expense History'}</h2>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              {isManager && <th>Employee</th>}
              {isManager && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id}>
                <td data-label="Date">{formatDate(exp.expenseDate)}</td>
                <td data-label="Amount">₹{exp.amount.toFixed(2)}</td>
                <td data-label="Category">{exp.category}</td>
                <td data-label="Description">{exp.description || '-'}</td>
                <td data-label="Status">
                  <span className={`status status-${exp.status.toLowerCase()}`}>
                    {exp.status}
                  </span>
                </td>
                {isManager && <td data-label="Employee">{exp.userName}</td>}
                {isManager && exp.status === 'Pending' && (
                  <td data-label="Actions">
                    <div className="flex gap-16 justify-center">
                      <button
                        onClick={() => {
                          const comments = prompt('Comments (optional):');
                          handleStatusChange(exp._id, 'Approved', comments || 'Approved');
                        }}
                        className="btn-success"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          const comments = prompt('Reason for rejection:');
                          if (comments !== null) {
                            handleStatusChange(exp._id, 'Rejected', comments || 'Rejected');
                          }
                        }}
                        className="btn-danger"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                )}
                {isManager && exp.status !== 'Pending' && <td>-</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}