import User from "../models/User.model.js";
import Employee from "../models/Employee.model.js";
import Guest from "../models/Guest.model.js";
import Branch from "../models/Branch.model.js";
import Feedback from "../models/Feedback.model.js";
import Service from "../models/Service.models.js";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
const { hash, compare } = bcrypt;



const addEmployee = async (req, res) => {
    try {
      const subAdmin = req.user;

      const {password,...data}=req.body
      const email=data.email
      
      //   Check if employee exists
      const exists = await Employee.findOne({email});
      if (exists) {
        return res.status(409).json({ message: "Employee already exists" });
      }
      const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
        
            const newEmployee = new Employee({
              ...data,
              password: hashedPassword,
            });
  
      // Create new employee
   
  
      res.status(201).json({
        message: "Employee added successfully",
        data: {
          data
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


    const employees = await Employee.find({ branch:"67f68711026dd9445a0d0bc7"});  // branch:subAdmin.branch

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

// const addService = async (req, res) => {
//   try {
//     const subAdmin = req.user; // Assuming subadmin is authenticated
//     const { name, description, price, images, video } = req.body;
    

//     // Validate required fields
//     if (!name || !price || !Array.isArray(price) || price.length === 0) {
//         return res.status(400).json({
//           message: "Name and at least one price entry are required",
//           required: ["name", "price"],
//           priceFormat: [{ cost: "number", ref: "branchId" }]
//         });
//       }
  
//       // Validate price structure
//       const invalidPrices = price.filter(p => 
//         typeof p.cost !== 'number' || !mongoose.Types.ObjectId.isValid(p.ref)
//       );
      
//       if (invalidPrices.length > 0) {
//         return res.status(400).json({
//           message: "Invalid price structure",
//           example: [{ cost: 100, ref: "507f1f77bcf86cd799439011" }]
//         });
//       }
  
//       // Check if service with same name already exists in this branch
//       const existingService = await Service.findOne({
//         name,
//         "price.ref": subAdmin.branch // Check if this branch already has this service
//       });
  
//       if (existingService) {
//         return res.status(409).json({
//           message: "Service with this name already exists in your branch",
//           existingServiceId: existingService._id
//         });
//       }
  
//       // Create new service
//       const newService = await Service.create({
//         name,
//         description,
//         price: price.map(p => ({
//           cost: p.cost,
//           ref: p.ref
//         })),
//         images: images || [],
//         video: video || [],
//         branch: subAdmin.branch, // Associate with subadmin's branch
//         rating: {
//           average: 0,
//           count: 0
//         },
//         isActive: true
//       });
  
//       // Update branch's services array (assuming Branch model has services array)
//       await Branch.findByIdAndUpdate(
//         subAdmin.branch,
//         { $addToSet: { services: newService._id } },
//         { new: true }
//       );
  
//       // Prepare response data
//       const responseData = {
//         id: newService._id,
//         name: newService.name,
//         description: newService.description,
//         prices: newService.price.filter(p => p.ref.equals(subAdmin.branch)),
//         images: newService.images,
//         video: newService.video,
//         rating: newService.rating,
//         isActive: newService.isActive,
//         createdAt: newService.createdAt
//       };
  
//       res.status(201).json({
//         message: "Service added successfully",
//         data: responseData
//       });
  
//     } catch (error) {
//       console.error("Service creation error:", error);
//       res.status(500).json({ 
//         message: "Server Error",
//         error: error.message 
//       });
//     }
//   };
  
  const getServiceTypeFeedbacks = async (req, res) => {
    try {
      const subAdmin = req.user; // Authenticated subadmin
      const { serviceType } = req.params;
      const { rating, dateFrom, dateTo, sortBy = '-createdAt', page = 1, limit = 10 } = req.query;
  
      // Validate serviceType (you might want to customize this based on your service types)
      const validServiceTypes = ['spa', 'food', 'room', 'activity'];
      if (!validServiceTypes.includes(serviceType.toLowerCase())) {
        return res.status(400).json({
          message: "Invalid service type",
          validServiceTypes,
          example: "/api/feedbacks/service/spa"
        });
      }
  
      // Build the query
      let query = {
        'service.serviceType': serviceType.toLowerCase(),
        'service.branch': subAdmin.branch
      };
  
      // Filter by rating if provided
      if (rating) {
        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
          return res.status(400).json({
            message: "Rating must be a number between 1 and 5"
          });
        }
        query.rating = ratingNum;
      }
  
      // Filter by date range if provided
      if (dateFrom || dateTo) {
        query.visitDate = {};
        if (dateFrom) {
          query.visitDate.$gte = new Date(dateFrom);
        }
        if (dateTo) {
          query.visitDate.$lte = new Date(dateTo);
        }
      }
  
      // Pagination options
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sortBy,
        populate: [
          { path: 'service', select: 'name description price' },
          { path: 'guest', select: 'name email' }
        ]
      };


    // Execute query with pagination
    const feedbacks = await Feedback.aggregatePaginate([
        {
          $lookup: {
            from: 'services',
            localField: 'service',
            foreignField: '_id',
            as: 'service'
          }
        },
        { $unwind: '$service' },
        {
          $match: {
            ...query,
            'service.branch': mongoose.Types.ObjectId(subAdmin.branch)
          }
        },
        {
          $project: {
            rating: 1,
            comment: 1,
            visitDate: 1,
            createdAt: 1,
            'service.name': 1,
            'service.serviceType': 1,
            'guest': 1
          }
        }
      ], options);
  
      if (!feedbacks || feedbacks.docs.length === 0) {
        return res.status(404).json({
          message: "No feedbacks found for this service type",
          serviceType,
          branch: subAdmin.branch
        });
      }
  
      // Calculate average rating for this service type
      const averageRating = await Feedback.aggregate([
        {
          $lookup: {
            from: 'services',
            localField: 'service',
            foreignField: '_id',
            as: 'service'
          }
        },
        { $unwind: '$service' },
        {
          $match: {
            'service.serviceType': serviceType.toLowerCase(),
            'service.branch': mongoose.Types.ObjectId(subAdmin.branch)
          }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalFeedbacks: { $sum: 1 }
          }
        }
      ]);
  
      res.status(200).json({
        message: "Feedbacks retrieved successfully",
        serviceType,
        averageRating: averageRating[0]?.averageRating || 0,
        totalFeedbacks: averageRating[0]?.totalFeedbacks || 0,
        currentPage: feedbacks.page,
        totalPages: feedbacks.totalPages,
        data: feedbacks.docs
      });
  
    } catch (error) {
      console.error("Error fetching service type feedbacks:", error);
      res.status(500).json({
        message: "Server Error",
        error: error.message
      });
    }
  };
  
  const getBranchUsers = async (req, res) => {
    try {
      const subAdmin = req.user; // Authenticated subadmin
      const { role, search, page = 1, limit = 10 } = req.query;
  
      // Validate the requesting user has branch access
      if (!subAdmin.branch) {
        return res.status(403).json({
          message: "Unauthorized - You are not assigned to any branch"
        });
      }
  
      // Build the base query
      const branchQuery = { branch: subAdmin.branch };
      const searchQuery = search ? { 
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      } : {};
  
      // Combine queries based on role filter
      let query = { ...branchQuery, ...searchQuery };
      if (role) {
        query.role = role.toLowerCase();
      }
  
      // Options for pagination
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 }
      };
  
      // Get users from all collections (Employees, Guests, etc.)
      const [employees, guests, otherUsers] = await Promise.all([
        Employee.paginate(query, options),
        Guest.paginate({ ...searchQuery, branch: subAdmin.branch }, options),
        User.paginate({ ...query, branch: subAdmin.branch }, options)
      ]);


    // Combine results while maintaining pagination structure
    const combinedResults = {
        docs: [
          ...employees.docs.map(doc => ({ ...doc.toObject(), userType: 'employee' })),
          ...guests.docs.map(doc => ({ ...doc.toObject(), userType: 'guest' })),
          ...otherUsers.docs.map(doc => ({ ...doc.toObject(), userType: 'user' }))
        ],
        totalDocs: employees.totalDocs + guests.totalDocs + otherUsers.totalDocs,
        limit: options.limit,
        page: options.page,
        totalPages: Math.ceil((employees.totalDocs + guests.totalDocs + otherUsers.totalDocs) / options.limit),
        pagingCounter: options.page,
        hasPrevPage: options.page > 1,
        hasNextPage: options.page < Math.ceil((employees.totalDocs + guests.totalDocs + otherUsers.totalDocs) / options.limit)
      };
  
      if (combinedResults.docs.length === 0) {
        return res.status(404).json({
          message: "No users found in this branch",
          branch: subAdmin.branch
        });
      }
  
      res.status(200).json({
        message: "Branch users retrieved successfully",
        branch: subAdmin.branch,
        currentPage: combinedResults.page,
        totalPages: combinedResults.totalPages,
        totalUsers: combinedResults.totalDocs,
        data: combinedResults.docs.map(user => ({
          id: user._id,
          userType: user.userType,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role || (user.userType === 'guest' ? 'Guest' : 'Employee'),
          createdAt: user.createdAt,
          ...(user.userType === 'employee' && { 
            employeeId: user.employeeId,
            employeeType: user.employeeType,
            workingHours: user.workingHours
          }),
          ...(user.userType === 'guest' && {
            visitCount: user.visitCount,
            lastVisit: user.lastVisit
          })
        }))
      });
  
    } catch (error) {
      console.error("Error fetching branch users:", error);
      res.status(500).json({
        message: "Server Error",
        error: error.message
      });
    }
  };
  
  
  
  
  
  
  export {
      
      getBranchUsers,
      getServiceTypeFeedbacks,
      // addService,
    addEmployee,
    getBranchEmployees,
    deleteEmployee,
  };
      
