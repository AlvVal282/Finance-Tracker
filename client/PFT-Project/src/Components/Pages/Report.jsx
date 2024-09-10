import React from 'react';

const Report = () => {
  // Dummy data for demonstration
  const balance = 1200;
  const totalIncome = 2500;
  const totalExpenses = 1300;
  const recentTransactions = [
    { date: '2024-09-01', description: 'Salary', amount: 2000 },
    { date: '2024-09-05', description: 'Groceries', amount: -100 },
    { date: '2024-09-10', description: 'Rent', amount: -1200 },
  ];

  return (
    <>
      <div className="dashboard-container">
        <div className="overview">
          <h2>Overview</h2>
          <div className="card">
            <h3>Total Balance</h3>
            <p>${balance.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Total Income</h3>
            <p>${totalIncome.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Total Expenses</h3>
            <p>${totalExpenses.toFixed(2)}</p>
          </div>
        </div>
        <div className="recent-transactions">
          <h2>Recent Transactions</h2>
          <ul>
            {recentTransactions.map((transaction, index) => (
              <li key={index}>
                <span>{transaction.date}</span>
                <span>{transaction.description}</span>
                <span>${transaction.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <button>Add Transaction</button>
          <button>Set Budget</button>
          <button>View Reports</button>
        </div>
      </div>
    </>
  );
};

export default Report;
