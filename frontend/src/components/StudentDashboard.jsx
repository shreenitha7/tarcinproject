import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../contexts/AuthContext';
import '../styles/studentDashboard.css';

function StudentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // State management
    const [showCourses, setShowCourses] = useState(true);
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState(new Set());
    const [loading, setLoading] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [performance, setPerformance] = useState({
        coursesEnrolled: 0,
        completedCourses: 0,
        averageScore: 0
    });
    
    // Course organization
    const [standards, setStandards] = useState([]);
    const [expandedStandard, setExpandedStandard] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [filteredCourses, setFilteredCourses] = useState([]);

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const enrollInCourse = async (courseId) => {
        setLoading(prev => ({ ...prev, [courseId]: true }));
        setMessage({ text: '', type: '' });
        
        try {
            if (!user || !user._id) {
                throw new Error('User not authenticated');
            }
            
            const response = await axios.post('http://localhost:3001/student/enroll', {
                studentId: user._id,
                courseId
            });
            
            // Update enrolled courses
            setEnrolledCourses(prev => new Set([...prev, courseId]));
            
            // Update performance
            setPerformance(prev => ({
                ...prev,
                coursesEnrolled: prev.coursesEnrolled + 1
            }));
            
            setMessage({ 
                text: 'Successfully enrolled in the course!', 
                type: 'success' 
            });
        } catch (error) {
            console.error('Enrollment error:', error);
            setMessage({ 
                text: error.response?.data?.message || 'Failed to enroll in course', 
                type: 'danger' 
            });
        } finally {
            setLoading(prev => ({ ...prev, [courseId]: false }));
        }
    };

    useEffect(() => {
        // Fetch available courses with tutors
        const fetchCourses = async () => {
            if (!user || !user._id) {
                navigate('/login');
                return;
            }

            setIsLoading(true);
            try {
                console.log('Fetching courses and performance data...');
                const [coursesRes, performanceRes] = await Promise.all([
                    axios.get('http://localhost:3001/student/courses')
                        .catch(err => {
                            console.error('Error fetching courses:', err);
                            return { data: [] }; // Return empty array if courses fail to load
                        }),
                    axios.get(`http://localhost:3001/student/performance/${user._id}`)
                        .catch(err => {
                            console.error('Error fetching performance:', err);
                            return { data: null }; // Return null if performance fails to load
                        })
                ]);
                
                console.log('Courses response:', coursesRes);
                console.log('Performance response:', performanceRes);
                
                const coursesData = Array.isArray(coursesRes?.data) ? coursesRes.data : [];
                setCourses(coursesData);
                
                // Group courses by standard and subject
                const standardsMap = coursesData.reduce((acc, course) => {
                    const std = course.standard || 'Other';
                    if (!acc[std]) {
                        acc[std] = new Set();
                    }
                    acc[std].add(course.subject);
                    return acc;
                }, {});

                setStandards(Object.entries(standardsMap).map(([standard, subjects]) => ({
                    name: standard,
                    subjects: Array.from(subjects)
                })));

                // Set first standard as expanded by default
                if (standards.length === 0 && Object.keys(standardsMap).length > 0) {
                    setExpandedStandard(Object.keys(standardsMap)[0]);
                }
                
                // Update performance data with fallback values
                if (performanceRes?.data) {
                    setPerformance({
                        coursesEnrolled: performanceRes.data.coursesEnrolled || 0,
                        completedCourses: performanceRes.data.completedCourses || 0,
                        averageScore: performanceRes.data.averageScore || 0
                    });
                    
                    // Update enrolled courses
                    if (performanceRes.data.enrolledCourses) {
                        setEnrolledCourses(new Set(performanceRes.data.enrolledCourses));
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage({ 
                    text: error.response?.data?.message || 'Failed to load data. Please try again later.', 
                    type: 'danger' 
                });
            } finally {
                setIsLoading(false);
            }
        };
        
        if (user?._id) {
            fetchCourses();
        }
    }, [user, navigate]);

    // Filter courses based on selected standard and subject
    useEffect(() => {
        if (!courses || courses.length === 0) {
            setFilteredCourses([]);
            return;
        }

        let result = [...courses];
        
        if (expandedStandard) {
            result = result.filter(course => course.standard === expandedStandard);
            
            if (selectedSubject) {
                result = result.filter(course => course.subject === selectedSubject);
            }
        }
        
        setFilteredCourses(result);
    }, [courses, expandedStandard, selectedSubject]);

    return (
        <div className="student-dashboard container mt-4">
            <div className="dashboard-header d-flex justify-content-between align-items-center mb-4">
                <h2>Welcome back, {user?.name || 'Student'}!</h2>
                <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setShowCourses(!showCourses)}
                >
                    {showCourses ? 'Hide Courses' : 'Show All Courses'}
                </button>
            </div>
            
            {/* Performance Overview */}
            <div className="performance-overview mb-4">
                <h4 className="mb-3">Your Learning Journey</h4>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center">
                                <div className="display-4 text-primary mb-2">{performance.coursesEnrolled}</div>
                                <h5 className="card-title text-muted mb-0">Enrolled Courses</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center">
                                <div className="display-4 text-success mb-2">{performance.completedCourses}</div>
                                <h5 className="card-title text-muted mb-0">Completed</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center">
                                <div className="display-4 text-info mb-2">{performance.averageScore}%</div>
                                <h5 className="card-title text-muted mb-0">Average Score</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Alert */}
            {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                    {message.text}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setMessage({ text: '', type: '' })}
                        aria-label="Close"
                    ></button>
                </div>
            )}

            {/* Courses Section */}
            {showCourses && (
                            </div>
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {filteredCourses.map(course => (
                                <div className="col" key={course._id}>
                                    <div className="card h-100 shadow-sm">
                                        <img 
                                            src={course.thumbnail} 
                                            className="card-img-top" 
                                            alt={course.name}
                                            style={{ height: '150px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title mb-1">{course.name}</h5>
                                                <span className={`badge ${getDifficultyBadgeColor(course.difficulty)}`}>
                                                    {course.difficulty}
                                                </span>
                                            </div>
                                            
                                            <p className="card-text text-muted small mb-3">
                                                {course.description || 'No description available'}
                                            </p>
                                            
                                            <div className="mt-auto">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <span className="badge bg-light text-dark">
                                                        <i className="bi bi-person me-1"></i>
                                                        {course.tutor?.name || 'Tutor'}
                                                    </span>
                                                    <small className="text-muted">
                                                        <i className="bi bi-clock me-1"></i>
                                                        {course.duration}
                                                    </small>
                                                </div>
                                                <button 
                                                    className="btn btn-primary w-100"
                                                    onClick={() => enrollInCourse(course._id)}
                                                    disabled={enrolledCourses.has(course._id) || loading[course._id]}
                                                >
                                                    {loading[course._id] ? (
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    ) : enrolledCourses.has(course._id) ? (
                                                        <>
                                                            <i className="bi bi-check-circle me-2"></i>
                                                            Enrolled
                                                        </>
                                                    ) : (
                                                        'Enroll Now'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 bg-light rounded">
                            <div className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></div>
                            <h5 className="mt-3">No courses available</h5>
                            <p className="text-muted">
                                {expandedStandard ? 
                                    `No ${selectedSubject ? `${selectedSubject} ` : ''}courses found for ${expandedStandard}` : 
                                    'Check back later for new courses!'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
);

// Helper function to get badge color based on course difficulty
function getDifficultyBadgeColor(difficulty) {
    switch (difficulty?.toLowerCase()) {
        case 'beginner':
            return 'success';
        case 'intermediate':
            return 'warning';
        case 'advanced':
            return 'danger';
        default:
            return 'secondary';
    }
}

export default StudentDashboard;