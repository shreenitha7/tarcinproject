const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');
const TutorDataModel = require('./models/TutorData');
const AdminDataModel = require('./models/AdminData');
const EnrollmentModel = require('./models/Enrollment');
const studentDashboardRoutes = require('./routes/studentDashboard');
const tutorDashboardRoutes = require('./routes/tutorDashboard');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/practice_mern');

app.post('/register', (req, res)=>{
    const {email, password} = req.body;
    FormDataModel.findOne({email: email})
    .then(user => {
        if(user){
            res.json("Already registered")
        }
        else{
            FormDataModel.create(req.body)
            .then(log_reg_form => res.json(log_reg_form))
            .catch(err => res.json(err))
        }
    })
})

// Student login route
app.post('/login', (req, res)=>{
    const {email, password} = req.body;
    FormDataModel.findOne({email: email})
    .then(user => {
        if(user){
            if(user.password === password) {
                res.json({
                    status: "Success",
                    id: user._id,
                    name: user.name,
                    email: user.email
                });
            }
            else{
                res.json({status: "Wrong password"});
            }
        }
        else{
            res.json({status: "No records found!"});
        }
    })
})

// Tutor login route
app.post('/tutor/login', (req, res)=>{
    const {email, password} = req.body;
    TutorDataModel.findOne({email: email})
    .then(tutor => {
        if(tutor){
            if(tutor.password === password) {
                res.json({
                    status: "Success",
                    id: tutor._id
                });
            }
            else{
                res.json({status: "Wrong password"});
            }
        }
        else{
            res.json({status: "No records found!"});
        }
    })
})

// New tutor routes
app.post('/tutor/register', (req, res)=>{
    const {email, password, phone, gender, location, degree, proof, experience, preferredSubjects, standards, name} = req.body;
    TutorDataModel.findOne({email: email})
    .then(tutor => {
        if(tutor){
            res.json("Already registered")
        }
        else{
            TutorDataModel.create({
                name,
                email,
                password,
                phone,
                gender,
                location,
                degree,
                proof,
                experience: Number(experience),
                preferredSubjects: Array.isArray(preferredSubjects) ? preferredSubjects : [preferredSubjects],
                standards: Array.isArray(standards) ? standards : [standards]
            })
            .then(tutor_data => res.json(tutor_data))
            .catch(err => res.json(err))
        }
    })
})



// Get all tutors with filtering
app.get('/api/tutors', async (req, res) => {
    try {
        const { subject, minExperience, maxExperience } = req.query;
        let filter = {};

        // Filter by subject
        if (subject) {
            filter.preferredSubjects = { $regex: subject, $options: 'i' };
        }

        // Filter by experience range
        if (minExperience || maxExperience) {
            filter.experience = {};
            if (minExperience) filter.experience.$gte = Number(minExperience);
            if (maxExperience) filter.experience.$lte = Number(maxExperience);
        }

        const tutors = await TutorDataModel.find(filter).select('-password');
        res.json(tutors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tutors' });
    }
});

// Get all unique subjects
app.get('/api/subjects', async (req, res) => {
    try {
        const tutors = await TutorDataModel.find({}).select('preferredSubjects');
        const allSubjects = tutors.flatMap(tutor => tutor.preferredSubjects);
        const uniqueSubjects = [...new Set(allSubjects)].sort();
        res.json(uniqueSubjects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

// Admin login route
app.post('/admin/login', (req, res) => {
    const { username, email, password } = req.body;
    // Allow login by username or email
    const query = username ? { username } : { email };
    AdminDataModel.findOne(query)
    .then(admin => {
        if (admin) {
            if (admin.password === password) {
                res.json({
                    status: "Success",
                    id: admin._id,
                    username: admin.username
                });
            } else {
                res.json({ status: "Wrong password" });
            }
        } else {
            res.json({ status: "No admin found!" });
        }
    })
    .catch(err => res.status(500).json({ error: 'Login failed' }));
});

// Get all students (admin only)
app.get('/api/admin/students', async (req, res) => {
    try {
        const students = await FormDataModel.find({}).select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

// Get all tutors (admin only)
app.get('/api/admin/tutors', async (req, res) => {
    try {
        const tutors = await TutorDataModel.find({}).select('-password');
        res.json(tutors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tutors' });
    }
});

// Delete student (admin only)
app.delete('/api/admin/students/:id', async (req, res) => {
    try {
        const result = await FormDataModel.findByIdAndDelete(req.params.id);
        if (result) {
            res.json({ message: 'Student deleted successfully' });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete student' });
    }
});

// Delete tutor (admin only)
app.delete('/api/admin/tutors/:id', async (req, res) => {
    try {
        const result = await TutorDataModel.findByIdAndDelete(req.params.id);
        if (result) {
            res.json({ message: 'Tutor deleted successfully' });
        } else {
            res.status(404).json({ error: 'Tutor not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tutor' });
    }
});

// Create default admin account (run once)
app.post('/api/admin/create-default', async (req, res) => {
    try {
        const existingAdmin = await AdminDataModel.findOne({ username: 'admin' });
        if (existingAdmin) {
            res.json({ message: 'Default admin already exists' });
            return;
        }

        const defaultAdmin = new AdminDataModel({
            username: 'admin',
            email: 'admin@tutorconnect.com',
            password: '123',
            role: 'admin'
        });

        await defaultAdmin.save();
        res.json({ message: 'Default admin created successfully', admin: defaultAdmin });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create default admin' });
    }
});

// Student enrolls in a subject and gets a tutor allocated
app.post('/api/enroll', async (req, res) => {
    try {
        const { studentId, subject } = req.body;
        // Find a tutor who teaches this subject (pick the one with most experience)
        const tutor = await TutorDataModel.findOne({ preferredSubjects: { $regex: subject, $options: 'i' } })
            .sort({ experience: -1 });
        if (!tutor) {
            return res.status(404).json({ error: 'No tutor found for this subject' });
        }
        // Create enrollment
        const enrollment = await EnrollmentModel.create({
            studentId,
            subject,
            tutorId: tutor._id
        });
        res.json({
            message: 'Enrolled successfully',
            enrollment,
            tutor: {
                id: tutor._id,
                name: tutor.name,
                email: tutor.email,
                qualifications: tutor.qualifications,
                experience: tutor.experience,
                subjects: tutor.preferredSubjects
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to enroll' });
    }
});

app.use('/api/student', studentDashboardRoutes);
app.use('/api/tutor', tutorDashboardRoutes);

app.listen(3001, () => {
    console.log("Server listining on http://127.0.0.1:3001");
});