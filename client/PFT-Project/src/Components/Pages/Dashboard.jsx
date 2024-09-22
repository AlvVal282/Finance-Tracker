import React, { useState, useEffect } from 'react';
import '../Styles/Dashboard.css';
import { Bar, Pie } from 'react-chartjs-2';
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
  ArcElement
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
  LineElement,
  ArcElement
);

const Dashboard = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState(0);
  const [selectedChart, setSelectedChart] = useState('YearToDate');

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

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:5001/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    // Calculate total monthly budget
    const calculateTotalMonthlyBudget = () => {
      let total = 0;
      budget.forEach(budgetItem => {
        const months = budgetItem.duration_weeks / 4;
        const monthlyBudgetAmount = budgetItem.budget_amount / months;
        total += monthlyBudgetAmount;
      });
      setTotalMonthlyBudget(total);
    };

    calculateTotalMonthlyBudget();
  }, [budget]);

  const filterTransactionsByDate = (transactions, startDate) => {
      return transactions.filter(transaction => new Date(transaction.transaction_date) >= new Date(startDate));
    };
  
    const calculateTotals = (transactions) => {
      return transactions.reduce((totals, transaction) => {
        const amount = transaction.amount;
        if (amount > 0) {
          totals.earnings += amount;
        } else {
          totals.spending += Math.abs(amount);
        }
        return totals;
      }, { earnings: 0, spending: 0 });
    };

  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);    
  const startOfWeek = new Date(new Date().setDate(new Date().getDate() - new Date().getDay())); // Adjust as needed
  
  const yearToDateTransactions = filterTransactionsByDate(transactions, startOfYear);
  const monthToDateTransactions = filterTransactionsByDate(transactions, startOfMonth);
  const weekToDateTransactions = filterTransactionsByDate(transactions, startOfWeek);
  
  const yearToDateTotals = calculateTotals(yearToDateTransactions);
  const monthToDateTotals = calculateTotals(monthToDateTransactions);
  const weekToDateTotals = calculateTotals(weekToDateTransactions);

  const pieChartDataYearToDate = {
    labels: ['Earnings', 'Spending'],
    datasets: [
      {
        label: 'Year-to-Date',
        data: [yearToDateTotals.earnings, yearToDateTotals.spending],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)'
        ],
        hoverBackgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
      },
    ],
  };

  const pieChartDataMonth = {
    labels: ['Earnings', 'Spending'],
    datasets: [
      {
        label: 'This Month',
        data: [monthToDateTotals.earnings, monthToDateTotals.spending],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)'
        ],
        hoverBackgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
      },
    ],
  };

  const pieChartDataWeek = {
    labels: ['Earnings', 'Spending'],
    datasets: [
      {
        label: 'This Week',
        data: [weekToDateTotals.earnings, weekToDateTotals.spending],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)'
        ],
        hoverBackgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
      },
    ],
  };  
  const getData = (goal) => ({
    labels: [goal.goal_name],
    datasets: [
      {
        label: 'Current Amount',
        data: [goal.current_amount],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Goal Amount',
        data: [goal.goal_amount],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  });
  

  const options = {
    indexAxis: 'y', // This makes the bars horizontal
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  // Map category names to budgets
  const budgetCategories = budget.map(item => {
    const category = categories.find(cat => cat.category_id === item.category_id);
    return category ? category.category_name : `Category ${item.category_id}`;
  });
  
  const budgetAmounts = budget.map(item => item.budget_amount);
  
  const pieChartData = {
    labels: budgetCategories,
    datasets: [
      {
        label: 'Budget Amounts',
        data: budgetAmounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(199, 199, 199, 0.2)',
          'rgba(83, 102, 255, 0.2)',
          'rgba(99, 255, 172, 0.2)',
          'rgba(132, 235, 204, 0.2)',
        ],
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(199, 199, 199, 0.5)',
          'rgba(83, 102, 255, 0.5)',
          'rgba(99, 255, 172, 0.5)',
          'rgba(132, 235, 204, 0.5)',
        ],
      },
    ],
  };

  return (
    <>
      <div className="box-container">
        {/* Transaction section */}
        <div className="box">
          <h2 className='header'>Account Activity</h2>
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
          <select value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
            <option value="YearToDate">Year-to-Date</option>
            <option value="MonthToDate">This Month</option>
            <option value="WeekToDate">This Week</option>
          </select>
          <Pie data={selectedChart === 'YearToDate' ? pieChartDataYearToDate : selectedChart === 'MonthToDate' ? pieChartDataMonth : pieChartDataWeek} />
        </div>

        {/* Accounts section */}
        <div className="box">
          <h2 className='header'>Accounts</h2>
          {accounts.map((account) => (
            <div className="account-item" key={account.account_id}>
              <p className="account-name">{account.account_name}</p>
              <p className="account-balance">${account.balance}</p>
            </div>
          ))}
        </div>

        {/* Budgets section */}
        <div className="box">
          <h2 className='header'>Budgets</h2>
          {budget.map((budgetItem) => (
            <div className="budget-item" key={budgetItem.budget_id}>
              <p className="budget-category">Category: {categories.find(cat => cat.category_id === budgetItem.category_id)?.category_name || 'Unknown'}</p>
              <p className="budget-amount">Budget Amount: ${budgetItem.budget_amount}</p>
              <p className='duration-time'>Pay Period: {budgetItem.duration_weeks} weeks</p>
            </div>
          ))}
          <Pie data={pieChartData} />
          <h1>Total Budget Amount Every 4 Weeks: ${totalMonthlyBudget.toFixed(2)}</h1>
        </div>

        {/* Goals section */}
        <div className="box">
          <h2 className='header'>Goals</h2>
          {goals.map((goal) => (
            <div className="goal-item" key={goal.goal_id}>
              <p className="goal-name">{goal.goal_name}</p>
              <div>
                <p className="current-amount">Current Amount: ${goal.current_amount}</p>
                <p className="goal-amount">Goal Amount: ${goal.goal_amount}</p>
                <Bar data={getData(goal)} options={options} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
