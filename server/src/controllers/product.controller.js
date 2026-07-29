import pool from '../config/db.js';

// Összes termék lekérése, kereséssel és szűréssel
export const getProducts = async (req, res) => {
  try {
    // Kinyerjük a lekérdezési paramétereket az URL-ből (pl. ?search=Laptop&category=Elektronik)
    const { search, category, min_price, max_price } = req.query;

    // Alap SQL lekérdezés, a '1=1' egy trükk, hogy könnyen fűzhessünk hozzá 'AND' feltételeket
    let query = 'SELECT * FROM products WHERE 1=1';
    const values = [];
    let valueIndex = 1;

    // Keresés név vagy leírás alapján (case-insensitive = ILIKE)
    if (search) {
      query += ` AND (name ILIKE $${valueIndex} OR description ILIKE $${valueIndex})`;
      values.push(`%${search}%`); // % a wildcard, így bárhol szerepelhet a szó
      valueIndex++;
    }

    // Szűrés kategória alapján
    if (category) {
      query += ` AND category = $${valueIndex}`;
      values.push(category);
      valueIndex++;
    }

    // Szűrés minimum ár alapján
    if (min_price) {
      query += ` AND price >= $${valueIndex}`;
      values.push(min_price);
      valueIndex++;
    }

    // Szűrés maximum ár alapján
    if (max_price) {
      query += ` AND price <= $${valueIndex}`;
      values.push(max_price);
      valueIndex++;
    }

    // Rendezés létrehozás dátuma szerint csökkenő sorrendben
    query += ' ORDER BY created_at DESC';

    // SQL lekérdezés futtatása a felépített paraméterekkel
    const result = await pool.query(query, values);

    // Ha nincs találat, küldünk egy megfelelő üzenetet
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Keine Produkte gefunden, die den Kriterien entsprechen.' });
    }

    // Sikeres válasz visszaküldése a terméklistával
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Hiba a termékek lekérésekor:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Produkte!' });
  }
};

// Egyetlen termék lekérése ID alapján
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Kinyerjük az ID-t az URL-ből (pl. /api/v1/products/2)

    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    // Ha a termék nem létezik (az array hossza 0)
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produkt nicht gefunden!' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Hiba a termék lekérésekor:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen des Produkts!' });
  }
};