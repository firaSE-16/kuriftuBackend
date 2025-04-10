import { genSalt } from "bcrypt";
import Branch from "../models/Branch.model.js";
import Employee from "../models/Employee.model.js";
import bcrypt from 'bcryptjs';
const { hash, compare } = bcrypt;


//Branch

export const addBranch = async (req, res) => {
    try {
      const data = req.body;
      const branch = new Branch(data);
      const savedBranch = await branch.save();
  
      res.status(201).json({
        message: "Branch successfully created",
        data: savedBranch,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create branch",
        error: error.message,
      });
    }
  };
  

  export const updateBranch = async (req, res) => {
    try {
      const { id, ...data } = req.body;
  
      const updatedBranch = await Branch.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedBranch) {
        return res.status(404).json({ message: "Branch not found" });
      }
  
      res.status(200).json({
        message: "Branch successfully updated",
        data: updatedBranch,
      });
  
    } catch (error) {
      res.status(500).json({
        message: "Failed to update branch",
        error: error.message,
      });
    }
  };
  
  

  export const getAllBranch = async (req, res) => {
    try {
      const allBranch = await Branch.find();
  
      res.status(200).json({
        message: "All branches successfully fetched",
        data: allBranch,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch all branches",
        error: error.message,
      });
    }
  };
  
 export const getSingleBranch = async (req, res) => {
    try {
      const { id } = req.params;
  
      const singleBranch = await Branch.findById(id);
  
      if (!singleBranch) {
        return res.status(404).json({ message: "Branch not found" });
      }
  
      res.status(200).json({
        message: "Single branch successfully fetched",
        data: singleBranch,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch single branch",
        error: error.message,
      });
    }
  };
  

  //SubAdmin


 export  const addSubAdmin = async (req, res) => {
    try {
      const { password, ...data } = req.body;
  
      // Correct: await for salt and hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const subAdmin = new Employee({
        ...data,
        password: hashedPassword,
      });
  
      const savedSubAdmin = await subAdmin.save();
  
      res.status(201).json({
        message: "SubAdmin successfully created",
        data: savedSubAdmin,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create SubAdmin",
        error: error.message,
      });
    }
  };

  export const updateSubAdmin = async (req, res) => {
    try {
      const { id, password, ...data } = req.body;
  
      let updateData = { ...data };
  
      
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateData.password = hashedPassword;
      }
  
      const updatedSubAdmin = await Employee.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedSubAdmin) {
        return res.status(404).json({ message: "SubAdmin not found" });
      }
  
      res.status(200).json({
        message: "SubAdmin successfully updated",
        data: updatedSubAdmin,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update SubAdmin",
        error: error.message,
      });
    }
  };

  export const getAllEmployee = async (req, res) => {
    try {
      const allEmployee = await Employee.find(); 
  
      res.status(200).json({
        message: "All employees successfully fetched",
        data: allEmployee,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch all employees",
        error: error.message,
      });
    }
  };

  

  export const getCustomerSatisfaction = async (req, res) => {
    try {
      const result = await Employee.aggregate([
        {
          $group: {
            _id: null,
            totalRating: { $sum: { $multiply: ['$rating.average', '$rating.count'] } },
            totalCount: { $sum: '$rating.count' }
          }
        },
        {
          $project: {
            _id: 0,
            overallAverageRating: {
              $cond: {
                if: { $eq: ['$totalCount', 0] },
                then: 0,
                else: { $divide: ['$totalRating', '$totalCount'] }
              }
            }
          }
        }
      ]);
  
      const overallAverageRating = result.length > 0 ? result[0].overallAverageRating : 0;
  
      res.status(200).json({
        message: 'Customer satisfaction rating calculated successfully',
        overallAverageRating
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to calculate customer satisfaction rating',
        error: error.message
      });
    }
  };
  

  
  
 

  export const  getServiceCustomerSatisfaction = async (req, res) => {
    try {
      const result = await Service.aggregate([
        {
          $facet: {
            // Overall statistics across all services
            combinedStats: [
              {
                $group: {
                  _id: null,
                  totalRating: { $sum: { $multiply: ['$rating.average', '$rating.count'] } },
                  totalCount: { $sum: '$rating.count' }
                }
              },
              {
                $project: {
                  _id: 0,
                  overallAverageRating: {
                    $cond: [
                      { $eq: ['$totalCount', 0] },
                      0,
                      { $divide: ['$totalRating', '$totalCount'] }
                    ]
                  },
                  totalRatings: '$totalCount'
                }
              }
            ],
  
            // Per-service-type statistics
            byServiceType: [
              {
                $group: {
                  _id: '$serviceType',
                  totalRating: { $sum: { $multiply: ['$rating.average', '$rating.count'] } },
                  totalCount: { $sum: '$rating.count' }
                }
              },
              {
                $project: {
                  _id: 0,
                  serviceType: '$_id',
                  averageRating: {
                    $cond: [
                      { $eq: ['$totalCount', 0] },
                      0,
                      { $divide: ['$totalRating', '$totalCount'] }
                    ]
                  },
                  ratingCount: '$totalCount'
                }
              }
            ]
          }
        }
      ]);
  
      const combinedStats = result[0]?.combinedStats[0] || {
        overallAverageRating: 0,
        totalRatings: 0
      };
  
      const byServiceType = result[0]?.byServiceType || [];
  
      res.status(200).json({
        message: 'Customer satisfaction ratings calculated successfully',
        data: {
          overall: combinedStats,
          byServiceType: byServiceType
        }
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to calculate customer satisfaction ratings',
        error: error.message
      });
    }
  };

 


  