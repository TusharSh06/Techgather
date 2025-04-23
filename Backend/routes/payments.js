import express from 'express';
import Payment from '../models/Payment.js';
import Event from '../models/Event.js';
import { auth } from '../middleware/auth.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { eventId, ticketType } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const ticket = event.tickets.find(t => t.type === ticketType);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket type not found' });
    }

    if (ticket.sold >= ticket.quantity) {
      return res.status(400).json({ message: 'Tickets sold out' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: ticket.price * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        eventId,
        ticketType,
        userId: req.user.id
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Process payment
router.post('/process', auth, async (req, res) => {
  try {
    const { eventId, ticketType, paymentMethodId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const ticket = event.tickets.find(t => t.type === ticketType);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket type not found' });
    }

    if (ticket.sold >= ticket.quantity) {
      return res.status(400).json({ message: 'Tickets sold out' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ticket.price * 100,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        eventId,
        ticketType,
        userId: req.user.id
      }
    });

    // Create payment record
    const payment = new Payment({
      user: req.user.id,
      event: eventId,
      ticketType,
      amount: ticket.price,
      status: 'completed',
      paymentMethod: 'credit_card',
      paymentDetails: {
        paymentIntentId: paymentIntent.id,
        paymentMethodId,
        last4: paymentIntent.payment_method_details.card.last4,
        brand: paymentIntent.payment_method_details.card.brand
      },
      metadata: {
        description: `Ticket for ${event.title}`,
        receiptEmail: req.user.email
      }
    });

    await payment.save();

    // Update event ticket count
    ticket.sold += 1;
    await event.save();

    // Add user to event attendees
    event.attendees.push({
      user: req.user.id,
      ticketType,
      status: 'registered'
    });
    await event.save();

    res.json({ payment, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's payments
router.get('/user', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('event', 'title startDate venue')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment details
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('event', 'title startDate venue')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user is authorized to view this payment
    if (payment.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Process refund
router.post('/:id/refund', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.id)
      .populate('event', 'title startDate');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user is authorized to request refund
    if (payment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if payment is eligible for refund
    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Payment is not eligible for refund' });
    }

    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.paymentDetails.paymentIntentId,
      reason: 'requested_by_customer'
    });

    // Update payment record
    payment.status = 'refunded';
    payment.refund = {
      amount: payment.amount,
      reason,
      processedAt: new Date()
    };
    await payment.save();

    // Update event ticket count
    const event = await Event.findById(payment.event);
    const ticket = event.tickets.find(t => t.type === payment.ticketType);
    if (ticket) {
      ticket.sold -= 1;
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter(
      attendee => attendee.user.toString() !== req.user.id
    );
    await event.save();

    res.json({ payment, refund });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 