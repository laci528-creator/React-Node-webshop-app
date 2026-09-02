import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { email, password, full_name } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedFullName = full_name.trim();

    if (!normalizedEmail || !password || !trimmedFullName) {
      return res.status(400).json({ message: 'Alle Felder sind erforderlich!' });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Das Passwort muss mindestens 8 Zeichen lang sein.",
      });
    }

    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Diese E-Mail-Adresse ist bereits registriert!' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, 'customer')
       RETURNING id, email, full_name, role`,
      [normalizedEmail, passwordHash, trimmedFullName]
    );

    const user = newUser.rows[0];

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(201).json({
      message: 'Registrierung erfolgreich!',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Log in a user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich!' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: "E-Mail und Passwort sind erforderlich!",
      });
    }

    const result = await db.query(
        `SELECT id, email, password_hash, full_name, role
        FROM users
        WHERE email = $1`,
        [normalizedEmail]
      );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Ungültige E-Mail-Adresse oder Passwort!' });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Ungültige E-Mail-Adresse oder Passwort!' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    delete user.password_hash;

    res.status(200).json({
      message: 'Erfolgreich angemeldet!',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Get the currently logged-in user's information
export const getMe = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, email, full_name, role FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    next(error);
  }
};