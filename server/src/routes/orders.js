import express from 'express';
import { pool } from '../config/db.js'; 
import { authenticateToken } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

// Rendelés leadása (POST /api/v1/orders)
router.post('/', authenticateToken, async (req, res) => {
  const { cart, totalPrice } = req.body;
  const userId = req.user.id;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'Der Warenkorb ist leer.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id',
      [userId, totalPrice]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of cart) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Bestellung erfolgreich abgeschlossen!',
      orderId: orderId
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Fehler beim Erstellen der Bestellung:', error);
    res.status(500).json({ message: 'Serverfehler beim Verarbeiten der Bestellung.' });
  } finally {
    client.release();
  }
});

export default router;