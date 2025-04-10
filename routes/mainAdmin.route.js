import express from 'express';
import {
  addBranch,
  updateBranch,
  getAllBranch,
  getSingleBranch,
  addSubAdmin,
  updateSubAdmin,
  getAllEmployee,
  getCustomerSatisfaction,
  getServiceCustomerSatisfaction
} from '../controllers/mainAdmin.controller.js';

const router = express.Router();


router.post('/addBranch', addBranch);
router.post('/updateBranch', updateBranch);
router.get('/allBranch', getAllBranch);
router.get('/branch/:id', getSingleBranch);


router.post('/subadmin', addSubAdmin);
router.post('/updateSubadmin', updateSubAdmin);
router.get('/employees', getAllEmployee);


router.get('/customer-satisfaction', getCustomerSatisfaction);
router.get('/service-customer-satisfaction', getServiceCustomerSatisfaction);

export default router;