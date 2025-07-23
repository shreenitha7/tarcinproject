const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'form_data',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutor_data',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    }
});

const EnrollmentModel = mongoose.model('enrollment', EnrollmentSchema);

module.exports = EnrollmentModel; 