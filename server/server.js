import express from 'express';
import cors from 'cors';
import { isUsernameEmailTaken, registerUser, validateUser } from './database.js';

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
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});