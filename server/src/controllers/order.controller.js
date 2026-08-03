import pool from '../config/db.js';

export const createOrder = async (req, res, next) => {
  // A bejelentkezett felhasználó ID-ját az authenticateToken middleware biztosítja!
  const userId = req.user.userId; 
  const { cartItems } = req.body; 

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Der Warenkorb ist leer." });
  }

  // Pool helyett most egy dedikált 'client'-et kérünk, hogy használhassunk tranzakciókat
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Tranzakció indítása

    let calculatedTotal = 0;
    const itemsToInsert = [];

    // 1. Árak lekérése az adatbázisból és végösszeg hiteles számolása
    for (const item of cartItems) {
      const productResult = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.productId]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Produkt mit ID ${item.productId} nicht gefunden.`); // Ez bedobja a catch ágba
      }

      const actualPrice = productResult.rows[0].price;
      calculatedTotal += actualPrice * item.quantity;
      
      // Eltesszük az adatokat memóriába, hogy később elmentsük őket
      itemsToInsert.push({
        productId: item.productId,
        quantity: item.quantity,
        price: actualPrice
      });
    }

    // 2. Fő rendelés (order) létrehozása
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id',
      [userId, calculatedTotal]
    );
    const orderId = orderResult.rows[0].id;

    // 3. Rendelés tételek (order_items) mentése egyenként
    for (const item of itemsToInsert) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await client.query('COMMIT'); // Minden sikeres! Ekkor íródik be ténylegesen az adatbázisba.

    res.status(201).json({
      message: 'Bestellung erfolgreich abgeschlossen!',
      orderId: orderId,
      totalPrice: calculatedTotal
    });

  } catch (error) {
    await client.query('ROLLBACK'); // Hiba történt! Visszavonunk mindent, hogy ne legyen hibás rendelés.
    console.error("Order error:", error.message);
    res.status(400).json({ message: error.message || "Fehler bei der Bestellung." });
  } finally {
    client.release(); // Visszaadjuk a kapcsolatot
  }
};


// Részlet a server/src/controllers/order.controller.js fájlból
export const getMyOrders = async (req, res, next) => {
  const userId = req.user.userId || req.user.id; 

  try {
    // Kibővített lekérdezés, ami a tételeket is lekéri képekkel együtt
    const result = await pool.query(
      `SELECT 
        o.id, 
        o.total_price, 
        o.status, 
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'productId', p.id,
              'name', p.name,
              'image', p.image_url, -- Vagy ahogy az adatbázisodban hívják a kép oszlopot
              'price', oi.price,
              'quantity', oi.quantity
            )
          ) FILTER (WHERE p.id IS NOT NULL), '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellungen:', error);
    res.status(500).json({ message: 'Serverfehler beim Laden der Bestellungen.' });
  }
};