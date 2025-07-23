const express = require('express');
const router = express.Router();
const FormDataModel = require('../models/FormData');
const CourseModel = require('../models/Course');
const EnrollmentModel = require('../models/Enrollment');

router.get('/performance/:id', async (req, res) => {
    try {
        const student = await FormDataModel.findById(req.params.id);
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

// Get all available courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await CourseModel.find({ isActive: true })
            .populate('tutor', 'name email')
            .select('-__v');
        res.json(courses);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
    }
});

// Enroll in a course
router.post('/enroll', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        // Validate input
        if (!studentId || !courseId) {
            return res.status(400).json({ error: 'Student ID and Course ID are required' });
        }

        // Check if student exists
        const student = await FormDataModel.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if course exists and is active
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        if (!course.isActive) {
            return res.status(400).json({ error: 'This course is not available for enrollment' });
        }

        // Check if already enrolled
        const existingEnrollment = await EnrollmentModel.findOne({
            studentId,
            subject: course.subject,
            tutorId: course.tutor
        });

        if (existingEnrollment) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }

        // Create new enrollment
        const enrollment = new EnrollmentModel({
            studentId,
            subject: course.subject,
            tutorId: course.tutor
        });

        await enrollment.save();

        res.status(201).json({
            message: 'Successfully enrolled in the course',
            enrollment
        });

    } catch (err) {
        console.error('Enrollment error:', err);
        res.status(500).json({ 
            error: 'Failed to enroll in course',
            details: err.message 
        });
    }
});

// Get enrolled courses for a student
router.get('/enrollments/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const enrollments = await EnrollmentModel.find({ studentId })
            .populate('tutorId', 'name email')
            .select('-__v');
            
        res.json(enrollments);
    } catch (err) {
        console.error('Error fetching enrollments:', err);
        res.status(500).json({ 
            error: 'Failed to fetch enrollments',
            details: err.message 
        });
    }
});

module.exports = router;