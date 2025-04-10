// routes/employeeRoutes.js
import express from 'express';

import {addEmployee, deleteEmployee, getBranchEmployees, getBranchUsers} from "../controllers/subAdmin.controller.js"

const router = express.Router();

// Add a new employee
router.post('/employee', addEmployee);
router.get("/employee",getBranchEmployees);
router.delete("/employee",deleteEmployee)
router.get("/user",getBranchUsers)




export default router;
