const express = require('express');
const router = express.Router();
// Import the Student Profile model
const StudentProfile = require('../models/studentProfile');

// GET all student profiles (admin access only in future)
router.get('/student-profiles', async (req, res) => {
  try {
    // Get profiles from database
    const profiles = await StudentProfile.find().sort({ createdAt: -1 });
    
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profiles', error: error.message });
  }
});

// POST create new student profile
router.post('/student-profile', async (req, res) => {
  try {
    // Create and save profile to database
    const newProfile = new StudentProfile(req.body);
    await newProfile.save();
    
    console.log('Received and saved profile data:', req.body);
    
    res.status(201).json({ 
      message: 'Profile saved successfully',
      profile: req.body
    });
  } catch (error) {
    res.status(400).json({ message: 'Error saving profile', error: error.message });
  }
});

// GET a single profile by ID (for future edit functionality)
router.get('/student-profile/:id', async (req, res) => {
  try {
    // Get profile by ID from database
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

module.exports = router; 