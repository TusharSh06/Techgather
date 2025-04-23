import express from 'express';
import VendorService from '../models/VendorService.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get all vendor services (public)
router.get('/services', async (req, res) => {
  try {
    const services = await VendorService.find({ status: 'active' })
      .populate('vendor', 'name email')
      .sort({ rating: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendor service by ID (public)
router.get('/services/:id', async (req, res) => {
  try {
    const service = await VendorService.findById(req.params.id)
      .populate('vendor', 'name email')
      .populate('reviews.user', 'name');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create vendor service (vendor only)
router.post('/services', [auth, checkRole(['vendor'])], async (req, res) => {
  try {
    const service = new VendorService({
      ...req.body,
      vendor: req.user._id
    });
    
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vendor service (vendor only)
router.put('/services/:id', [auth, checkRole(['vendor'])], async (req, res) => {
  try {
    const service = await VendorService.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found or unauthorized' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete vendor service (vendor only)
router.delete('/services/:id', [auth, checkRole(['vendor'])], async (req, res) => {
  try {
    const service = await VendorService.findOneAndDelete({
      _id: req.params.id,
      vendor: req.user._id
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found or unauthorized' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review to service (attendee only)
router.post('/services/:id/reviews', [auth, checkRole(['attendee'])], async (req, res) => {
  try {
    const service = await VendorService.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if user has already reviewed
    const alreadyReviewed = service.reviews.some(
      review => review.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Already reviewed this service' });
    }
    
    service.reviews.push({
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    });
    
    // Update average rating
    service.rating = service.calculateAverageRating();
    
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendor's bookings (vendor only)
router.get('/bookings', [auth, checkRole(['vendor'])], async (req, res) => {
  try {
    const services = await VendorService.find({ vendor: req.user._id })
      .populate('bookings.event', 'title date location')
      .select('name bookings');
    
    const bookings = services.flatMap(service => 
      service.bookings.map(booking => ({
        ...booking.toObject(),
        serviceName: service.name
      }))
    );
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (vendor only)
router.put('/bookings/:id', [auth, checkRole(['vendor'])], async (req, res) => {
  try {
    const { status } = req.body;
    const service = await VendorService.findOne({
      'bookings._id': req.params.id,
      vendor: req.user._id
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }
    
    const booking = service.bookings.id(req.params.id);
    booking.status = status;
    
    await service.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 