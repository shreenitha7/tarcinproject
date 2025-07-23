const express = require('express');
const router = express.Router();
const FormDataModel = require('../models/FormData');
const TutorDataModel = require('../models/TutorData');

// Student Dashboard Routes
router.get('/student/performance/:id', async (req, res) => {
    try {
        const student = await FormDataModel.findById(req.params.id);
        // Add your performance calculation logic here
        const performance = {
            coursesEnrolled: 0,
            completedCourses: 0,
            averageScore: 0
        };
        res.json(performance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Tutor Dashboard Routes
router.get('/tutor/courses/:id', async (req, res) => {
    try {
        const tutor = await TutorDataModel.findById(req.params.id);
        // Add your courses fetching logic here
        const courses = [];
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/tutor/students/:id', async (req, res) => {
    try {
        // Add your enrolled students fetching logic here
        const students = [];
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;