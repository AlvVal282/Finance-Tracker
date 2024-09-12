import express from 'express';
import cors from 'cors';
import { 
    isUsernameEmailTaken,
    registerUser,
    validateUser,
    obtainIDByUsername,
    getUserTransactions,
    getDepositsByUserId 
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

app.get('/api/transactions/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10); // Use URL parameter to fetch userId
    console.log('Fetching transactions for user ID:', userId);
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

app.get('/api/deposits/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10); // Use URL parameter to fetch userId
    console.log('Fetching deposits for user ID:', userId);
    try {
        const deposits = await getDepositsByUserId(userId);
        if (deposits.length === 0) {
            res.status(404).json({ error: 'No deposits found.' });
        } else {
            res.json(deposits);
        }
    } catch (error) {
        console.error('Error fetching deposits:', error);
        res.status(500).json({ error: 'An error occurred while fetching deposits.' });
    }
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});