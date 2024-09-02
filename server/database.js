import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();

export async function getUsers() {
  try {
    const [rows] = await pool.query("SELECT * FROM Users");
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Rethrow error to be handled by the caller
  }
}

export async function getUser(user_id) {
  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE user_id = ?", [user_id]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error; // Rethrow error to be handled by the caller
  }
}
/**
 * Check if a username or email is already taken
 */
export async function usernameEmailTaken(username, email) {
  try {
      const [[rows]] = await pool.query(`
          SELECT COUNT(*) as count
          FROM users 
          WHERE username = ? 
          OR email = ?`, [username, email])
      return rows.count > 0
  } catch (error) {
      console.error('Error checking username/email:', error)
      throw error
  }
}

/**
 * Add a new user to the database
 */
export async function createUser(username, email, hashed_password) {
  try {
    // Check for existing user
    const [existingUsers] = await pool.query('SELECT * FROM Users WHERE username = ? OR email = ?', [username, email]);
    if (existingUsers.length > 0) {
        throw new Error('Username or email already exists');
    }
    //create new user
    const hashedPassword = await bcrypt.hash(hashed_password, 10);
    const [result] = await pool.query("INSERT INTO Users (username, email, hashed_password) VALUES (?, ?, ?)",
       [username, email, hashed_password]);

    return result;
  } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Rethrow error to be handled by the caller
  }
}
/**
 * Check if username exists, then check that password matches
 */
export async function authenticateUser(username, password) {
  try {
      const [[rows]] = await pool.query(`
          SELECT *
          FROM Users
          WHERE username = ?
      `, username)

      if (rows.length === 0) {
          return null
      }

      const passwordMatches = await bcrypt.compare(password, rows.password)

      if (passwordMatches) {
          return rows
      } else {
          return null
      }
  } catch (error) {
      console.error('Error authenticating user:', error)
      throw error
  }
}
(async () => {

})();