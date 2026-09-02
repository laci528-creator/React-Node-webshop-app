import pool from '../config/db.js';


// get all products with search and filtering
export const getProducts = async (req, res) => {
  try {
    // extract query parameters from the URL (e.g., ?search=Laptop&category=Elektronik)
    const { search, sort } = req.query;

    // basic SQL query to select all products tricked with a WHERE clause that always evaluates to true (1=1)
    let query = 'SELECT * FROM products WHERE 1=1';
    const values = [];
    let valueIndex = 1;

    // Search by name or description (case-insensitive = ILIKE)
    if (search) {
      query += ` AND (name ILIKE $${valueIndex} OR description ILIKE $${valueIndex})`;
      values.push(`%${search}%`);
      valueIndex++;
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC'; // price ascending
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC'; // price descending
    } else {
      query += ' ORDER BY created_at DESC'; // default (newest first)
    }

    // SQL query execution with the constructed parameters
    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    next(error); // pass the error to the error handling middleware 
  }
};

// one product by id
export const getProductById = async (req, res) => {
  try {
    const productId = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        message: "Ungültige Produkt-ID!",
      });
    }

    const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

    // if no product is found, return a 404 error
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produkt nicht gefunden!' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};


// new product creation
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, image_url } = req.body;

    const trimmedName = name?.trim();
    const trimmedDescription = description?.trim() || null;
    const trimmedCategory = category?.trim();
    const trimmedImageUrl = image_url?.trim();

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    // basic validation
      if (
        !trimmedName ||
        !trimmedCategory ||
        !trimmedImageUrl ||
        price == null ||
        String(price).trim() === "" ||
        stock == null ||
        String(stock).trim() === "" ||
        !Number.isFinite(numericPrice) ||
        numericPrice <= 0 ||
        !Number.isInteger(numericStock) ||
        numericStock < 0
      ) {
        return res.status(400).json({
          message: 'Ungültige oder fehlende Produktdaten!'
        });
      }

    // database query to insert the new product into the products table
    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, stock, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [  
        trimmedName,
        trimmedDescription,
        numericPrice,
        trimmedCategory,
        numericStock,
        trimmedImageUrl]
    );

    // successful response with the newly created product
    res.status(201).json({
      message: 'Produkt erfolgreich hinzugefügt!',
      product: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};