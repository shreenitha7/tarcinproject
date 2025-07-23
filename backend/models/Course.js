const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    standard: {
        type: String,
        required: true,
        trim: true,
        enum: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'College', 'Other']
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutor_data',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    thumbnail: {
        type: String,
        default: 'https://via.placeholder.com/300x200?text=Course+Thumbnail'
    },
    duration: {
        type: String,
        default: '4 weeks'
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    }
});

const CourseModel = mongoose.model('course', CourseSchema);

module.exports = CourseModel;
