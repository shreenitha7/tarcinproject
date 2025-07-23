const mongoose = require('mongoose');

const TutorDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    gender: String,
    location: String,
    preferredSubjects: [String],
    degree: String,
    proof: String, // store filename or URL
    experience: Number,
    standards: [String]
});

const TutorDataModel = mongoose.model('tutor_data', TutorDataSchema);

module.exports = TutorDataModel;