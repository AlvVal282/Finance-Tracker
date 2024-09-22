import React, { useState, useEffect } from 'react';

const Report = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formTransaction, setFormTransaction] = useState({
    account_id: '',
    category_id: '',
    amount: '',
    description: '',
  });

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setFormTransaction({
      ...formTransaction,
      [name]: value,
    });
  };

  const handleTransactionEdit = async (e) => {
    e.preventDefault();
    try {
      const { account_id, category_id, amount, description } = formTransaction;
  
      const userData = {
        user_id: user.id,
        account_id,
        category_id,
        amount,
        description,
      };
  
      // Send transaction data
      const transactionResponse = await fetch(`http://localhost:5001/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!transactionResponse.ok) {
        throw new Error('Failed to add transaction');
      }
  
      const transactionData = await transactionResponse.json();
      console.log('Transaction added:', transactionData);
  
      // Fetch updated transactions list
      const transactionsResponse = await fetch(`http://localhost:5001/api/transactions/${user.id}`);
  
      if (!transactionsResponse.ok) {
        throw new Error('Failed to fetch transactions');
      }
  
      const updatedTransactions = await transactionsResponse.json();
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error handling transaction edit:', error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user.id;

        const transactionsResponse = await fetch(`http://localhost:5001/api/transactions/${userId}`);
        if(!transactionsResponse.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);

        const accountsResponse = await fetch(`http://localhost:5001/api/accounts/${userId}`);
        if(!accountsResponse.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const accountsData = await accountsResponse.json();
        setAccounts(accountsData);

        const goalsResponse = await fetch(`http://localhost:5001/api/goals/${userId}`);
        if(!goalsResponse.ok) {
          throw new Error('Failed to fetch goals');
        }
        const goalsData = await goalsResponse.json();
        setGoals(goalsData);

        const budgetResponse = await fetch(`http://localhost:5001/api/budget/${userId}`);
        if(!budgetResponse.ok) {
          throw new Error('Failed to fetch budget');
        }
        const budgetData = await budgetResponse.json();
        setBudget(budgetData);

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
  
  return (
    <div className="dashboard-container">
      {/* Edit Transactions */}
      <div className="box">
        <h2>Add Transactions</h2>
        <form onSubmit={handleTransactionEdit}>
          <div>
            <h3>Select Account</h3>
            <select
              name="account_id"
              value={formTransaction.account_id}
              onChange={handleTransactionChange}
              required>
                {accounts.map(account => (
                  <option key={account.account_id} value={account.account_id} required>
                    {account.account_name}
                  </option>
                ))}
                </select>

            <h3>Select Category</h3>
            <select
              name="category_id"
              value={formTransaction.category_id}
              onChange={handleTransactionChange}
              required>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id} required>
                    {category.category_name}
                  </option>
                ))}
            </select>

            <h3>Amount</h3>
              <input
                type="number"
                name="amount"
                value={formTransaction.amount}
                onChange={handleTransactionChange}
                required
                step="any"
                placeholder='$0.00'/>

            <h3>Description</h3>
              <input
                type="text"
                name="description"
                value={formTransaction.description}
                onChange={handleTransactionChange}
                placeholder='What was this for?'
                required/>
          </div>
          <br/>
          <button type="submit">Add Transaction</button>
        </form>
      </div>

      {/* Edit Accounts */}
      <div className="box">
        <h2>Edit Accounts</h2>
      </div>

      {/* Edit Budgets */}
      <div className="box">
        <h2>Edit Budgets</h2>

      </div>

      {/* Edit Goals */}
      <div className="box">
        <h2>Edit Goals</h2>

      </div>
    </div>
  );
};

export default Report;
