import express from 'express';
import { getProducts, getProductById, createProduct } from '../controllers/product.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/v1/products - All products
router.get('/', getProducts);
// Get /api/v1/products/:id - one product by id
router.get('/:id', getProductById);


router.post('/', authenticateToken, isAdmin, createProduct);

export default router;