import React from 'react';
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

  return (
    <>
      <div className='Transactions'>

      </div>
      <div className='Deposits'>

      </div>
      <div className='Accounts'>

      </div>
      <div className='Budgets'>

      </div>
      <div className='Goals'>
        
      </div>
    </>
  );
};

export default Dashboard;
