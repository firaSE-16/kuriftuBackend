// routes/employeeRoutes.js
import express from 'express';

import {addEmployee, getBranchEmployees} from "../controllers/subAdmin.controller.js"

const router = express.Router();

// Add a new employee
router.post('/employee', addEmployee);
router.get("/employee",getBranchEmployees);



export default router;
