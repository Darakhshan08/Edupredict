const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  role: {
    type: String,
    enum: ['Admin', 'Teacher', 'Student'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  from: {
    type: String,
    required: true,
    trim: true
  },
  received: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  }, {
  timestamps: true
});

module.exports = mongoose.model("Feedback", feedbackSchema);