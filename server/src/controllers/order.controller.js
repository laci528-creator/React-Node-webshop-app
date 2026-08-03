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