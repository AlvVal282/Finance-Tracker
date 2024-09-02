import express from 'express';
import cors from 'cors';

import{
    getUsers,
    getUser,
    createUser
} from './database.js';

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON body parsing

// test route
app.get("/api", async (req, res) => {
    console.log("/api route hit");
    res.json({message: "API is working"});
});
/**
 * Register a new user
 */
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, hashed_password } = req.body;
        const user = await createUser(username, email, hashed_password);
        res.status(201).json({ message: "User registered successfully", user_id: result.insertId });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user." });
    }
});
/*
    * Get all users
*/
app.get("/users", async (req, res) => {
    const users = await getUsers();
    res.send(users);
});
app.post("/users", async (req, res) => {
    const { username, email, hashed_password } = req.body;
    const user = await createUser(username, email, hashed_password);
    res.status(201).send(user);
});

// Return the count of users who have the requested username or email
app.get("/api/username-email-taken", async (req, res) => {
    try {
        const username = req.query.username
        const email = req.query.email
        const taken = await db.usernameEmailTaken(username, email)
        res.json({taken})
    } catch (error) {
        res.status(500).json({message: "Error checking username/email"})
    }
})
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(5001, () => {
    console.log("Server started on port 5001");
});
