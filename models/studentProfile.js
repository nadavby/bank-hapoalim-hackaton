const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  fieldOfStudy: {
    type: String,
    required: [true, 'Field of study is required'],
    trim: true
  },
  university: {
    type: String,
    required: [true, 'University/College is required'],
    trim: true
  },
  yearOfStudy: {
    type: String,
    required: [true, 'Year of study is required'],
    enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Master\'s', 'Other']
  },
  availability: {
    type: String,
    required: [true, 'Availability for work is required'],
    trim: true
  },
  interests: {
    type: String,
    required: [true, 'Professional interests are required'],
    trim: true
  },
  workExperience: {
    type: String,
    trim: true
  },
  linkedinOrResume: {
    type: String,
    trim: true
  },
  resumeFile: {
    filename: String,
    contentType: String,
    path: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster querying
StudentProfileSchema.index({ fieldOfStudy: 1 });
StudentProfileSchema.index({ university: 1 });
StudentProfileSchema.index({ interests: 'text' });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema); 