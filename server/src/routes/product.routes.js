import express from 'express';
import { getProducts, getProductById } from '../controllers/product.controller.js';

const router = express.Router();

// GET /api/v1/products - Összes termék listázása és keresése
router.get('/', getProducts);

// GET /api/v1/products/:id - Egy adott termék részleteinek lekérése
// Fontos: Ezt mindig a gyökér útvonal ('/') alá tegyük!
router.get('/:id', getProductById);

export default router;