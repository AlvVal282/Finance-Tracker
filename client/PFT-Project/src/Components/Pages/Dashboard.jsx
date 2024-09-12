import React, { useState, useEffect } from 'react';
import '../Styles/Dashboard.css';
import { Bar, Line } from 'react-chartjs-2';
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
  LineElement,
);

const Dashboard = ({ user, setUser }) => {
  const [transactionsData, setTransactionsData] = useState([]);
  const [depositsData, setDepositsData] = useState([]);

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
    
        // Process transactions data
        const transactionLabels = transactions.length > 0 ? transactions.map(t => t.transaction_date) : [];
        const transactionAmounts = transactions.length > 0 ? transactions.map(t => t.amount) : [];
    
        setTransactionsData({
          labels: transactionLabels,
          datasets: [
            {
              label: 'Total Spent',
              data: transactionAmounts,
              backgroundColor: '#FF6384',
            },
          ],
        });
    
        // Fetch deposits data
        const depositsResponse = await fetch(`http://localhost:5001/api/deposits/${userId}`);
        if (!depositsResponse.ok) {
          throw new Error('Failed to fetch deposits');
        }
        const deposits = await depositsResponse.json();
    
        // Process deposits data
        const depositLabels = deposits.length > 0 ? deposits.map(d => d.deposit_date) : [];
        const depositAmounts = deposits.length > 0 ? deposits.map(d => d.amount) : [];
    
        setDepositsData({
          labels: depositLabels,
          datasets: [
            {
              label: 'Total Deposited',
              data: depositAmounts,
              fill: false,
              borderColor: '#36A2EB',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();    
  }, [user]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <>
      <div className="box-container">
        <div className="Transactions">
          <h2>Transactions Overview</h2>
          {transactionsData.labels ? (
            <Bar data={transactionsData} options={chartOptions} />
          ) : (
            <p>Loading transactions...</p>
          )}
        </div>
        <div className="Deposits">
          <h2>Deposits Over Time</h2>
          {depositsData.labels ? (
            <Line data={depositsData} options={chartOptions} />
          ) : (
            <p>Loading deposits...</p>
          )}
        </div>
        <div className="Accounts">
          {/* Add another chart or content */}
        </div>
        <div className="Budgets">
          {/* Add another chart or content */}
        </div>
        <div className="Goals">
          {/* Add another chart or content */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
