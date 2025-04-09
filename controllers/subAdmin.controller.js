import Employee from "../models/Employee.model.js";
import User from "../models/User.model.js";
import Branch from "../models/Branch.model.js";


const addEmployee = async (req, res) => {
    try {
      const subAdmin = req.user;
  
      const {
        employeeId,
        firstName,       // Changed from 'name'
        lastName,        // Added
        email,
        password,
        phone,
        workingHours,
        accountNumber,
        rating = 5   ,
        employeeType ="cheff"  
      } = req.body;
  
      // Required fields check
      if (!employeeId || !firstName || !lastName || !email || !password) {
        return res.status(400).json({ 
          message: "Missing required fields",
          required: ["employeeId", "firstName", "lastName", "email", "password"]
        });
      }
  
    //   Check if employee exists
      const exists = await Employee.findOne({ email });
      if (exists) {
        return res.status(409).json({ message: "Employee already exists" });
      }
  
      // Create new employee
      const newEmployee = await Employee.create({
        employeeId,
        firstName,
        lastName,
        email,
        role: "Employee",
        password,
        phone,
        branch: "507f1f77bcf86cd799439011",
        workingHours,
        accountNumber,
        rating , 
        employeeType       // Added
      });
  
      res.status(201).json({
        message: "Employee added successfully",
        data: {
          id: newEmployee._id,
          employeeId: newEmployee.employeeId,
          employeeType:newEmployee.employeeType,
          name: `${newEmployee.firstName} ${newEmployee.lastName}`,
          email: newEmployee.email,
          branch: newEmployee.branch,
          status: newEmployee.status
        }
      });
  
    } catch (error) {
      console.error("Employee creation error:", error);
      res.status(500).json({ 
        message: "Server Error",
        error: error.message 
      });
    }
  };
const getBranchEmployees = async (req, res) => {
  try {
    const subAdmin = req.user;

    // if (subAdmin.role !== 'subadmin') {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const employees = await Employee.find({ branch:"507f1f77bcf86cd799439011"});

    res.status(200).json({
      message: "Employees fetched successfully",
      data: employees
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
  try {
    const subAdmin = req.user; // Logged in SubAdmin

    // if (subAdmin.role !== 'subadmin') {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const { employeeId } = req.params;

    // Find the employee to be deleted
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if the subAdmin is trying to delete an employee not in their branch
    // if (employee.branch.toString() !== subAdmin.branch.toString()) {
    //   return res.status(403).json({ message: "Unauthorized to delete this employee" });
    // }

    // Delete the employee
    await Employee.deleteOne({ employeeId });

    res.status(200).json({
      message: "Employee deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export {
    sayhi,
  addEmployee,
  getBranchEmployees,
  deleteEmployee,
};
