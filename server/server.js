import express from 'express';
import cors from 'cors';
import { 
    isUsernameEmailTaken,
    registerUser,
    validateUser,
    obtainIDByUsername,
    getUserTransactions,
    getUserAccounts,
    getUserGoals,
    getUserBudgets,
    getCategories,
    validateAccount,
    addTransaction,
    updateAccountBalance
} from './database.js';
import { parse } from 'dotenv';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

app.post('/api/check-username-email', async (req, res) => {
    const { username, email } = req.body;
    try {
        const taken = await isUsernameEmailTaken(username, email);
        res.json({ taken });
    } catch (error) {
        console.error('Error checking username/email:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const success = await registerUser(username, email, password);
        if (success) {
            res.status(201).json({ message: 'User registered successfully' });
        } else {
            res.status(400).json({ error: 'User registration failed' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const isValid = await validateUser(username, password);
        if (isValid) {
            const user_id = await obtainIDByUsername(username);
            res.status(200).json({ message: 'Login successful', id: user_id});
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/transactions', async (req, res) => {
    const { user_id, account_id, category_id, amount, description } = req.body;
    console.log('Received transaction data:', req.body);
    try {
        const isValid = await validateAccount(account_id, user_id);

        if (isValid < 1) {
            return res.status(400).json({ error: 'Invalid account for this user.' });
        }
        console.log('row count:', isValid);
        const transaction = await addTransaction(account_id, category_id, amount, description);
        const updatedAccount = await updateAccountBalance(account_id, amount);
        res.status(201).json({ message: 'Transaction added successfully' });
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ error: 'An error occurred while adding transaction.' });
    }
});

app.get('/api/transactions/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10); // Use URL parameter to fetch userId
    try {
        const transactions = await getUserTransactions(userId);
        if (transactions.length === 0) {
            res.status(404).json({ error: 'No transactions found.' });
        } else {
            res.json(transactions);
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'An error occurred while fetching transactions.' });
    }
});
app.get('/api/accounts/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10); // Use URL parameter to fetch userId
    try {
        const accounts = await getUserAccounts(userId);
        if (accounts.length === 0) {
            res.status(404).json({ error: 'No accounts found.' });
        } else {
            res.json(accounts);
        }
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'An error occurred while fetching accounts.' });
    }
});

app.get('/api/goals/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10); // Use URL parameter to fetch userId
    try {
        const goals = await getUserGoals(userId);
        if (goals.length === 0) {
            res.status(404).json({ error: 'No goals found.' });
        } else {
            res.json(goals);
        }
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ error: 'An error occurred while fetching goals.' });
    }
});

app.get('/api/budget/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10); // Use URL parameter to fetch userId
    try {
        const budget = await getUserBudgets(userId);
        if (budget.length === 0) {
            res.status(404).json({ error: 'No budget found.' });
        } else {
            res.json(budget);
        }
    } catch (error) {
        console.error('Error fetching budget:', error);
        res.status(500).json({ error: 'An error occurred while fetching budget.' });
    }
});   

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await getCategories();
        if (categories.length === 0) {
            res.status(404).json({ error: 'No categories found.' });
        } else {
            res.json(categories);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'An error occurred while fetching categories.' });
    }
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});