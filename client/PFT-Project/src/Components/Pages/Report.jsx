import React, { useState, useEffect } from 'react';

const Report = ({ user, setUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formTransaction, setFormTransaction] = useState({
    account_id: accounts[0]?.account_id || '',
    category_id: categories[0]?.category_id || '',
    amount: '',
    description: '',
  });
  const [formAccount, setFormAccount] = useState({
    account_type: 'Checking',
    account_name: '',
    balance: '',
  });
  const [formRemove, setFormRemove] = useState({
    account_id: accounts[0]?.account_id || '',
  });

  const handleRemoveChange = (e) => {
    const { name, value } = e.target;
    setFormRemove({
      ...formRemove,
      [name]: value,
    });
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setFormAccount({
      ...formAccount,
      [name]: value,
    });
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setFormTransaction({
      ...formTransaction,
      [name]: value,
    });
  };

  const handleRemoveEdit = async (e) => {
    e.preventDefault();
    try {
      const { account_id } = formRemove;
      const userData = {
        user_id: user.id,
        account_id,
      };

      // Send account data
      const accountResponse = await fetch(`http://localhost:5001/api/deleteAccount`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!accountResponse.ok) {
        throw new Error('Failed to remove account');
      }

      setFormRemove({
        account_id: accounts[0]?.account_id || '',
      });

      const accountsResponse = await fetch(`http://localhost:5001/api/accounts/${user.id}`);
      if(!accountsResponse.ok) {
        throw new Error('Failed to fetch accounts');
      }
      const updatedAccounts = await accountsResponse.json();
      setAccounts(updatedAccounts);

    } catch (error) {
      console.error('Error handling account edit:', error);
    }
  };

  const handleAccountEdit = async (e) => {
    e.preventDefault();
    try {
      const { account_name, balance, account_type } = formAccount;

      const userData = {
        user_id: user.id,
        account_name,
        account_type,
        balance,
      };

      // Send account data
      const accountResponse = await fetch(`http://localhost:5001/api/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if(!accountResponse.ok) {
        throw new Error('Failed to add account');
      }

      setFormAccount({
        account_type: 'Checking',
        account_name: '',
        balance: '',
      });

      const accountsResponse = await fetch(`http://localhost:5001/api/accounts/${user.id}`);
      if(!accountsResponse.ok) {
        throw new Error('Failed to fetch accounts');
      }
      const updatedAccounts = await accountsResponse.json();
      setAccounts(updatedAccounts);

    } catch (error) {
      console.error('Error handling account edit:', error);
    }
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

      setFormTransaction({
        account_id: accounts[0]?.account_id || '',
        category_id: accounts[0]?.category_id || '',
        amount: '',
        description: '',
      });
  
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
          <br/>
          <button type="submit">Add Transaction</button>
        </form>
      </div>

      {/* Edit Accounts */}
      <div className="box">
        <h2>Edit Accounts</h2>
        <div>
          <h3>Add Account</h3>
          <form onSubmit={handleAccountEdit}>
            <h4>Account Type</h4>
            <select
              name="account_type"
              value={formAccount.account_type}
              onChange={handleAccountChange}
              required>
              <option value="Checking">Checking</option>
              <option value="Savings">Savings</option>
              <option value="Credit">Credit</option>
              <option value="Investment">Investment</option>
            </select>
            <h4>Account Name</h4>
            <input
              type="text"
              name="account_name"
              value={formAccount.account_name}
              onChange={handleAccountChange}
              placeholder='Account Name'
              required/>
            <h4>Starting Balance</h4>
            <input
              type="number"
              name="balance"
              value={formAccount.balance}
              onChange={handleAccountChange}
              required
              step="any"
              placeholder='$0.00'/>
            <br/>
            <button type="submit">Add Account</button>
          </form>
        </div>
        <div>
          <h3>Remove Account</h3>
          <form onSubmit={handleRemoveEdit}>
            <h4>Account Name</h4>
            <select
              name="account_id"
              value={formRemove.account_id}
              onChange={handleRemoveChange}
              required>
                {accounts.map(account => (
                  <option key={account.account_id} value={account.account_id} required>
                    {account.account_name}
                  </option>
                ))}
            </select>
            <br/>
            <button type="submit">Remove Account</button>
          </form>
        </div>
      </div>

      {/* Edit Budgets */}
      <div className="box">
        <h2>Edit Budgets</h2>
        <div>
          <h3>Add Budget</h3>
        </div>
        <div>
          <h3>Remove Budget</h3>
        </div>
      </div>

      {/* Edit Goals */}
      <div className="box">
        <h2>Edit Goals</h2>
        <div>
          <h3>Add Goal</h3>
        </div>
        <div>
          <h3>Remove Goal</h3>
        </div>
      </div>
    </div>
  );
};

export default Report;
