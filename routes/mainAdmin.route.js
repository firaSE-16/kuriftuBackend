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
  getServiceCustomerSatisfaction,
  addFood,
  getAllFood,
  getSingleFood,
  updateFood,
  addSpa,
  updateSpa,
  deleteSpa
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

// food routes
router.post("/food",addFood)
router.get("/food",getAllFood)
router.get("/food/:id",getSingleFood)
router.put("/food/:id",updateFood)



// spa routes

router.post("/spa",addSpa)
router.put("/spa/:id",updateSpa)
router.delete("/spa/:id",deleteSpa)
// router.get("/spa",)
// router.get("/spa",)
export default router;