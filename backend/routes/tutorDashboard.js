const express = require('express');
const router = express.Router();
const TutorDataModel = require('../models/TutorData');

router.get('/courses/:id', async (req, res) => {
    try {
        const tutor = await TutorDataModel.findById(req.params.id);
        const courses = await CourseModel.find({ tutor: req.params.id });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/students/:id', async (req, res) => {
    try {
        const enrolledStudents = await EnrollmentModel.find({ 
            tutor: req.params.id 
        }).populate('student');
        res.json(enrolledStudents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;