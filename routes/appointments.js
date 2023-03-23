const express = require('express');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const router = express.Router();

// Get appointments by user ID
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const { date } = req.query;
  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);
  Appointment.find({ userId, start: { $gte: start }, end: { $lt: end } }).exec((err, appointments) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json({ appointments });
  });
});

// Create appointment
router.post('/', (req, res) => {
  const { start, end, title, description, userId } = req.body;
  if (!start || !end || !title || !description || !userId) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const newAppointment = new Appointment({
    start,
    end,
    title,
    description,
    userId,
  });
  newAppointment.save((err, appointment) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(201).json({ message: 'Appointment created successfully', appointment });
  });
});

// Delete appointment
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Appointment.findByIdAndDelete(id).exec((err, appointment) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  });
});

module.exports = router;

