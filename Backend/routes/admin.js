import express from 'express';
import User from '../models/User.js';
import Event from '../models/Event.js';
import VendorService from '../models/VendorService.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get platform statistics
router.get('/stats', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      totalVendors,
      activeEvents,
      completedEvents,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      User.countDocuments({ role: 'vendor' }),
      Event.countDocuments({ status: 'published' }),
      Event.countDocuments({ status: 'completed' }),
      Event.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ])
    ]);

    res.json({
      totalUsers,
      totalEvents,
      totalVendors,
      activeEvents,
      completedEvents,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users with filtering
router.get('/users', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Manage user status
router.put('/users/:id/status', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events with filtering
router.get('/events', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    
    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Event.countDocuments(query);
    
    res.json({
      events,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Manage event status
router.put('/events/:id/status', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('organizer', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all vendor services with filtering
router.get('/services', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    
    const services = await VendorService.find(query)
      .populate('vendor', 'name email')
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await VendorService.countDocuments(query);
    
    res.json({
      services,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Manage vendor service status
router.put('/services/:id/status', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { status } = req.body;
    const service = await VendorService.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('vendor', 'name email');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 