// models/Order.js
import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema({
  menuItem: {
    type: Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  specialInstructions: String,
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'canceled'],
    default: 'pending'
  },
  preparedBy: {  // Chef who accepted the dish
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  startedAt: Date,  // When chef began preparation
  completedAt: Date  // When dish was marked ready
});

const orderSchema = new Schema({
  // Order Identification
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },

  // Stakeholders
  guest: {  // Who placed the order
    type: Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },
  waiter: {  // Who took the order
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },

  // Order Details
  items: [orderItemSchema],
  tableNumber: String,
  roomNumber: String,  // For room service

  // Status Tracking
  status: {
    type: String,
    enum: ['draft', 'placed', 'preparing', 'ready', 'delivered', 'paid', 'canceled'],
    default: 'draft'
  },
  statusHistory: [{
    status: String,
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Timing
  placedAt: Date,
  estimatedReadyTime: Date,
  deliveredAt: Date,

  // Payment
  totalAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  }

}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
  }
  next();
});

// Indexes for performance
orderSchema.index({ status: 1 });
orderSchema.index({ guest: 1 });
orderSchema.index({ waiter: 1 });
orderSchema.index({ branch: 1, createdAt: -1 });

export default model('Order', orderSchema);
