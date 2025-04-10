import mongoose from 'mongoose';
import Order from '../models/Order.model.js';

// ✅ Utility: Convert string to ObjectId safely
const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    return null;
  }
};

// @desc    Get all orders for chef's branch
// @route   GET /api/chef/orders
// @access  Private (Chef only)
export const getKitchenOrders = async (req, res, next) => {
  try {
    const branchId = req.user?.branch || '663d13f2f789eeb859d14a4a'; // Replace with real branchId in test

    const objectId = toObjectId(branchId);
    if (!objectId) {
      return res.status(400).json({ message: 'Invalid branch ID' });
    }

    const orders = await Order.find({
      branch: objectId,
      status: { $in: ['received', 'preparing'] }
    })
      .populate('guest', 'name roomNumber')
      .populate('items.menuItem', 'name category')
      .sort({ createdAt: 1 });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};


// @desc    Claim an order for preparation
// @route   PUT /api/chef/orders/:id/claim
// @access  Private (Chef only)
export const claimOrder = async (req, res, next) => {
  try {
    // Optional test setup (REMOVE in production)
    req.user = {
      branch: new mongoose.Types.ObjectId('663d13f2f789eeb859d14a4a'), // Replace with real branchId
      _id: new mongoose.Types.ObjectId() // Replace with real userId
    };

    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        branch: req.user.branch,
        status: 'received'
      },
      {
        $set: {
          status: 'preparing',
          preparedBy: req.user._id,
          preparationStart: new Date()
        }
      },
      { new: true }
    ).populate('items.menuItem', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not available or already claimed' });
    }

    res.json({
      message: 'Order claimed for preparation',
      order
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Mark order as ready
// @route   PUT /api/chef/orders/:id/ready
// @access  Private (Chef only)
export const markOrderReady = async (req, res, next) => {
  try {
    // Optional test setup (REMOVE in production)
    req.user = {
      branch: new mongoose.Types.ObjectId('663d13f2f789eeb859d14a4a'), // Replace with real branchId
      _id: new mongoose.Types.ObjectId() // Replace with real userId
    };

    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        branch: req.user.branch,
        preparedBy: req.user._id,
        status: 'preparing'
      },
      {
        $set: {
          status: 'ready',
          preparationEnd: new Date()
        }
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found or not in preparing state' });
    }

    res.json({
      message: 'Order marked as ready',
      order
    });
  } catch (err) {
    next(err);
  }
};
