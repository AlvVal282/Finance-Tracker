import React, { useState, useEffect } from 'react';
import '../Styles/Dashboard.css';
// Import Chart.js as needed if you're still using charts elsewhere in the component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';

// Register necessary chart types
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Dashboard = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user.id; // Use user_id to fetch transactions and deposits

        // Fetch transactions
        const transactionsResponse = await fetch(`http://localhost:5001/api/transactions/${userId}`);
        if (!transactionsResponse.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const transactions = await transactionsResponse.json();

        // Set the transactions for list display
        setTransactions(transactions);

        const accountsResponse = await fetch(`http://localhost:5001/api/accounts/${userId}`);
        if (!accountsResponse.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const accounts = await accountsResponse.json();
        setAccounts(accounts);

        const goalsResponse = await fetch(`http://localhost:5001/api/goals/${userId}`);
        if (!goalsResponse.ok) {
          throw new Error('Failed to fetch goals');
        }
        const goals = await goalsResponse.json();
        setGoals(goals);

        const budgetResponse = await fetch(`http://localhost:5001/api/budget/${userId}`);
        if (!budgetResponse.ok) {
          throw new Error('Failed to fetch budget');
        }
        const budget = await budgetResponse.json();
        setBudget(budget);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user]);

  return (
    <>
      <div className="box-container">
        <div className="Transaction">
          <h2 className='header'>Acount Activity</h2>
          {transactions.map((transaction) => (
          <div className="transaction-item" key={transaction.transaction_id}>
            <div className="transaction-info">
              <p className="transaction-date">{new Date(transaction.transaction_date).toLocaleDateString()}</p>
              <p className="transaction-description">{transaction.description}</p>
            </div>
            <div className="transaction-details">
              <p className={`transaction-amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                {transaction.amount < 0 ? `- $${Math.abs(transaction.amount)}` : `+ $${transaction.amount}`}
              </p>
              <p>{transaction.account}</p>
              {transaction.category_name && <p>{transaction.category_name}</p>}
            </div>
          </div>
          ))}
        </div>
        <div className="Accounts">
          <h2 className='header'>Accounts</h2>
          {accounts.map((account) => (
            <div className="account-item" key={account.account_id}>
              <p className="account-name">{account.account_name}</p>
              <p className="account-balance">${account.balance}</p>
            </div>
          ))}
        </div>
        <div className="Budgets">
          <h2 className='header'>Budgets</h2>
          {budget.map((budgetItem) => (
            <div className="budget-item" key={budgetItem.budget_id}>
              <p className="budget-category">Category: {budgetItem.category_id}</p>
              <p className="budget-amount">Budget Amount: ${budgetItem.budget_amount}</p>
              <p className='starting-amount'>Starting Amount: ${budgetItem.starting_amount}</p>
              <p className='start-date'>Start Date: {new Date(budgetItem.start_date).toLocaleDateString()}</p>
              <p className='end-date'>End Date: {new Date(budgetItem.end_date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
        <div className="Goals">
        <h2 className='header'>Goals</h2>
          {goals.map((goal) => (
            <div className="goal-item" key={goal.goal_id}>
              <p className="goal-name">{goal.goal_name}</p>
              <div>
                <p className="current-amount">Current Amount: ${goal.current_amount}</p>
                <p className="goal-amount">Goal Amount: ${goal.goal_amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
