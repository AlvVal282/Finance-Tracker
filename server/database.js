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
        console.log('Rows:', rows);
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

        if (password === hashedPassword) {
            return true; // Return true if passwords match
        } else {
            return false; // Return false if passwords don't match
        }
    } catch (error) {
        console.error('Error validating user:', error);
        throw error;
    }
};


export const getUserTransactions = async (userId) => {
    try{
        const sql = 
        `SELECT 
                t.transaction_id,
                t.amount,
                t.transaction_date,
                t.description,
                a.account_name AS account,
                c.category_name,
                u.username
            FROM 
                Transactions t
            JOIN  
                Accounts a ON t.account_id = a.account_id
            LEFT JOIN 
                Categories c ON t.category_id = c.category_id
            JOIN 
                Users u ON a.user_id = u.user_id
            WHERE 
                u.user_id = ?;
        `;
        const [rows] = await pool.query(sql, [userId]);
        return rows;
    } catch (error) {   
        console.error('Error fetching transactions:', error);
        throw error;
    }
  };

  export const getDepositsByUserId = async (userId) => {
    try {
        const sql = 
        `SELECT 
                d.deposit_id,
                d.amount,
                d.deposit_date,
                d.description,
                a.account_name,
                u.username
            FROM 
                Deposits d
            JOIN 
                Accounts a ON d.account_id = a.account_id
            JOIN 
                Users u ON a.user_id = u.user_id
            WHERE 
                u.user_id = ?;
        `;
        const [rows] = await pool.query(sql, [userId]);
        return rows;
    } catch (error) {
        console.error('Error fetching deposits:', error);
        throw error;
    }
  };