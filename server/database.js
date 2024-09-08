import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_ROOT,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getUsers() {
    const [result] = await pool.query('SELECT * FROM Users');
    return result;
}
export async function getUser(id) {
    const result = await pool.query('SELECT * FROM Users WHERE user_id = ?', [id]);
    return result[0];
}
export async function createUser(user_name, user_email, user_password) {
    const [result] = await pool.query('INSERT INTO Users (username, email, hashed_password) VALUES (?, ?, ?)', [user_name, user_email, user_password]);
    return getUser(result.insertId);
}