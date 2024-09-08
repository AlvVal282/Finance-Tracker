import express from 'express';
import {
    getUsers,
    createUser,
    getUser,
} from './database.js';

const app = express();
app.use(express.json());
app.get("/Users", async (req, res) => {
    const users = await getUsers();
    res.send(users);
});
app.post("/Users", async (req, res) => {
    const user = await createUser(req.body.username, req.body.email, req.body.password);
    res.status(201).send(user);
});
app.get("/Users/:id", async (req, res) => {
    const user = await getUser(req.params.id);
    res.send(user);
});

app.get('/api', (req, res) => {
  res.json({"users" : ["User 1", "User 2", "User 3"]});
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
