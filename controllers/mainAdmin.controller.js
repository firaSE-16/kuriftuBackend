import BranchModel, { findByIdAndUpdate, find, findById } from "../models/Branch.model";

//Branch

const addBranch = async (req, res) => {
    try {
      const data = req.body;
      const branch = new BranchModel(data);
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
  

  const updateBranch = async (req, res) => {
    try {
      const { id, ...data } = req.body;
  
      const updatedBranch = await findByIdAndUpdate(id, data, {
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

  const getAllBranch = async (req, res) => {
    try {
      const allBranch = await find();
  
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
  
  const getSingleBranch = async (req, res) => {
    try {
      const { id } = req.params;
  
      const singleBranch = await findById(id);
  
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

  
  