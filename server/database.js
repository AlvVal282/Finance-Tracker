import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export const isUsernameEmailTaken = async (username, email) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM Users WHERE username = ? OR email = ?",
            [username, email]
        );
        return rows.length > 0;
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
};

export const registerUser = async (username, email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO Users (username, email, hashed_password) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const findUserByUsername = async (username) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
        return rows[0]; // Return first user found, if found
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
};

export const obtainIDByUsername = async (username) => {
    try {
        const [rows] = await pool.query('SELECT user_id FROM Users WHERE username = ?', [username]);
        return rows[0].user_id;
    } catch (error) {
        console.error('Error finding user_id:', error);
        throw error;
    }
}

export const validateUser = async (username, password) => {
    try {
        const user = await findUserByUsername(username);
        if (!user) return false;

        const hashedPassword = user.hashed_password;

        console.log('Retrieved hashed password:', hashedPassword);

        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.error('Error validating user:', error);
        throw error;
    }
};