import express from 'express';
import { Router } from 'express';
import { createOrder } from '../controllers/order.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import pool from '../config/db.js';
const router = Router();

// A rendelés leadásához kötelező bejelentkezve lenni (authenticateToken)
router.post('/', authenticateToken, createOrder);

router.get('/my-orders', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  
  try {
    const result = await pool.query(
      'SELECT id, total_price, status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellungen:', error);
    res.status(500).json({ message: 'Serverfehler beim Laden der Bestellungen.' });
  }
});

export default router;