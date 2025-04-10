import express from 'express';
// import { restrictTo } from '../middleware/authMiddleware.js';
import {
  getKitchenOrders,
  claimOrder,
  markOrderReady
} from '../controllers/chef.controller.js';

const router = express.Router();

// Protect all routes for authenticated chefs
// router.use(protect);
// router.use(restrictTo('chef'));

router.get('/orders', getKitchenOrders);
router.put('/orders/:id/claim', claimOrder);
router.put('/orders/:id/ready', markOrderReady);

export default router;
