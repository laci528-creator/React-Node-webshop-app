import pool from '../config/db.js';

export const createOrder = async (req, res, next) => {
  const userId = req.user.userId; 
  const { cartItems } = req.body; 

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        message: "Der Warenkorb ist leer.",
      });
    }

    for (const item of cartItems) {
        if (
          !item ||
          !Number.isInteger(item.productId) ||
          item.productId <= 0 ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
          ) {
            return res.status(400).json({
              message: "Ungültige Bestelldaten.",
            });
        }
      }

    const productIds = cartItems.map((item) => item.productId);

    if (new Set(productIds).size !== productIds.length) {
      return res.status(400).json({
        message: "Doppelte Produkte im Warenkorb sind nicht erlaubt.",
      });
    }

  // pool.connect() is used to get a client from the connection pool. This allows us to perform multiple queries in a single transaction.
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // start a transaction

    let calculatedTotal = 0;
    const itemsToInsert = [];

    // 1. price calculation and stock validation from the database
    for (const item of cartItems) {

      const productResult = await client.query(
        'SELECT price, stock, name FROM products WHERE id = $1 FOR UPDATE',
        [item.productId]
        );

        if (productResult.rows.length === 0) {
          const error = new Error(
            `Produkt mit ID ${item.productId} nicht gefunden.`
          );
          error.status = 404;
          throw error;
        }

      const product = productResult.rows[0];

        if (product.stock < item.quantity) {
          const error = new Error(
            `Nicht genügend Lagerbestand für Produkt "${product.name}". Verfügbar: ${product.stock}, angefordert: ${item.quantity}.`
          );
          error.status = 409;
          throw error;
        }

      const actualPrice = Number(product.price);
      calculatedTotal += actualPrice * item.quantity;

      // save the item data later for insertion into order_items table
      itemsToInsert.push({
        productId: item.productId,
        quantity: item.quantity,
        price: actualPrice
      });
    }

    calculatedTotal = Number(calculatedTotal.toFixed(2));

    // 2. main order insertion into the orders table
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id',
      [userId, calculatedTotal]
    );
    const orderId = orderResult.rows[0].id;

    // 3. order items (order_items) insertion
    for (const item of itemsToInsert) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.productId, item.quantity, item.price]
      );

    await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: "Bestellung erfolgreich abgeschlossen!",
      orderId,
      totalPrice: calculatedTotal,
    });

  } catch (error) {
      await client.query("ROLLBACK");

        if (error.status) {
          return res.status(error.status).json({
            message: error.message,
          });
        }

        next(error);
  } finally {
    client.release();
  }
};

export const getMyOrders = async (req, res, next) => {
  const userId = req.user.userId; 

  try {
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
              'image', p.image_url,
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
    next(error); // pass the error to the error handling middleware
  }
};