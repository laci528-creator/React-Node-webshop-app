import { Router } from 'express';
import { createOrder,getMyOrders } from '../controllers/order.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// A rendelés leadásához kötelező bejelentkezve lenni (authenticateToken)
router.post('/', authenticateToken, createOrder);

router.get('/my-orders', authenticateToken, getMyOrders);

export default router;