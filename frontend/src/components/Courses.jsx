import React, { useState } from 'react';
import axios from 'axios';
import '../styles/courses.css';

const STANDARD_SUBJECTS = {
  '1st': ['Maths', 'English', 'EVS', 'Hindi'],
  '2nd': ['Maths', 'English', 'EVS', 'Hindi'],
  '3rd': ['Maths', 'English', 'EVS', 'Hindi', 'Science'],
  '4th': ['Maths', 'English', 'EVS', 'Hindi', 'Science'],
  '5th': ['Maths', 'English', 'EVS', 'Hindi', 'Science', 'Social Science'],
  '6th': ['Maths', 'English', 'Hindi', 'Science', 'Social Science', 'Sanskrit'],
  '7th': ['Maths', 'English', 'Hindi', 'Science', 'Social Science', 'Sanskrit'],
  '8th': ['Maths', 'English', 'Hindi', 'Science', 'Social Science', 'Sanskrit'],
  '9th': ['Maths', 'English', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'Computer'],
  '10th': ['Maths', 'English', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'Computer'],
  '11th': ['Maths', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Accountancy', 'Business Studies'],
  '12th': ['Maths', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Accountancy', 'Business Studies'],
};

const standards = Object.keys(STANDARD_SUBJECTS);

const Courses = () => {
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [tutors, setTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(false);
  const [enrollResult, setEnrollResult] = useState(null);
  const [enrollError, setEnrollError] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  const handleStandardClick = (standard) => {
    setSelectedStandard(standard);
    setSelectedSubject('');
    setTutors([]);
    setEnrollResult(null);
    setEnrollError('');
  };

  const handleSubjectClick = async (subject) => {
    setSelectedSubject(subject);
    setTutors([]);
    setEnrollResult(null);
    setEnrollError('');
    setLoadingTutors(true);
    try {
      const params = new URLSearchParams();
      params.append('subject', subject);
      const response = await axios.get(`http://localhost:3001/api/tutors?${params}`);
      setTutors(response.data);
    } catch (error) {
      setTutors([]);
    } finally {
      setLoadingTutors(false);
    }
  };

  const handleAttend = async (subject) => {
    setEnrollResult(null);
    setEnrollError('');
    setEnrolling(true);
    const studentId = localStorage.getItem('studentId');
    const studentName = localStorage.getItem('studentName');
    const studentEmail = localStorage.getItem('studentEmail');
    
    if (!studentId || !studentName || !studentEmail) {
      setEnrollError('You must be logged in as a student to attend a course.');
      setEnrolling(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get existing data from localStorage
      const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      const allocations = JSON.parse(localStorage.getItem('allocations') || '[]');
      
      // Add student to students list if not exists
      const studentExists = students.some(s => s.id === studentId);
      if (!studentExists) {
        students.push({
          id: studentId,
          name: studentName,
          email: studentEmail,
          enrolledSubjects: [subject]
        });
      } else {
        // Update student's enrolled subjects if already exists
        const student = students.find(s => s.id === studentId);
        if (!student.enrolledSubjects) student.enrolledSubjects = [];
        if (!student.enrolledSubjects.includes(subject)) {
          student.enrolledSubjects.push(subject);
        }
      }

      // Create enrollment
      const tutorId = tutors[0]?.id; // Get first available tutor for demo
      if (tutorId) {
        enrollments.push({
          id: `enroll_${Date.now()}`,
          studentId,
          tutorId,
          subject,
          date: new Date().toISOString()
        });

        // Update allocations for admin dashboard
        allocations.push({
          id: `alloc_${Date.now()}`,
          studentId,
          studentName,
          studentEmail,
          tutorId,
          tutorName: tutors[0]?.name || 'Tutor',
          subject,
          date: new Date().toISOString()
        });
      }

      // Save to localStorage
      localStorage.setItem('enrollments', JSON.stringify(enrollments));
      localStorage.setItem('students', JSON.stringify(students));
      localStorage.setItem('allocations', JSON.stringify(allocations));
      
      // Update state with mock response
      setEnrollResult({
        success: true,
        message: 'Successfully enrolled in the course',
        enrollment: {
          studentId,
          tutorId: tutorId || 'tutor1',
          subject,
          date: new Date().toISOString()
        },
        tutor: tutors[0] || {
          id: 'tutor1',
          name: 'Demo Tutor',
          email: 'tutor@example.com',
          qualifications: 'MSc in Subject',
          experience: '5',
          subjects: [subject]
        }
      });

      // Trigger a custom event to notify other components
      window.dispatchEvent(new Event('enrollmentUpdated'));
      
    } catch (error) {
      console.error('Enrollment error:', error);
      setEnrollError('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="courses-flex-layout">
      <aside className="standards-sidebar">
        <div className="sidebar-title">Standards</div>
        <ul className="standards-list">
          {standards.map((standard, idx) => (
            <li
              key={idx}
              className={`standard-sidebar-item${selectedStandard === standard ? ' selected' : ''}`}
              onClick={() => handleStandardClick(standard)}
            >
              {standard}
            </li>
          ))}
        </ul>
      </aside>
      <main className="courses-main-content">
        <div className="courses-header">
          <h1>Courses & Tutors</h1>
          <p>Select a standard from the left, then a subject, then see tutors</p>
        </div>

        {selectedStandard && (
          <div className="subjects-section">
            <h2 style={{marginTop: '2rem'}}>Subjects for <span style={{color: 'var(--accent-color)'}}>{selectedStandard}</span></h2>
            <div className="subjects-grid">
              {STANDARD_SUBJECTS[selectedStandard].map((subject, idx) => (
                <button
                  key={idx}
                  className={`subject-card-btn${selectedSubject === subject ? ' selected' : ''}`}
                  onClick={() => handleSubjectClick(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSubject && (
          <div className="tutors-section">
            <h2 style={{marginTop: '2rem'}}>Tutors for <span style={{color: 'var(--accent-color)'}}>{selectedSubject}</span></h2>
            {loadingTutors ? (
              <div className="loading">Loading tutors...</div>
            ) : tutors.length === 0 ? (
              <div className="no-results">
                <h3>No tutors found for this subject</h3>
              </div>
            ) : (
              <div className="tutors-grid">
                {tutors.map((tutor) => (
                  <div key={tutor._id} className="tutor-card">
                    <div className="tutor-header">
                      <h3>{tutor.name}</h3>
                      <span className="experience-badge">
                        {tutor.experience} {tutor.experience === 1 ? 'year' : 'years'} exp
                      </span>
                    </div>
                    <div className="tutor-details">
                      <p className="qualifications">
                        <strong>Qualifications:</strong> {tutor.qualifications}
                      </p>
                      <div className="subjects">
                        <strong>Subjects:</strong>
                        <div className="subject-tags">
                          {tutor.preferredSubjects.map((subj, index) => (
                            <span key={index} className="subject-tag">
                              {subj}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="tutor-actions">
                      <button className="contact-btn">Contact Tutor</button>
                      <button className="view-profile-btn">View Profile</button>
                      <button
                        className="attend-btn"
                        onClick={() => handleAttend(selectedSubject)}
                        disabled={enrolling}
                      >
                        {enrolling ? 'Attending...' : 'Attend'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {enrollError && <div style={{ color: 'red', margin: '1rem 0' }}>{enrollError}</div>}
            {enrollResult && (
              <div className="enroll-result">
                <h3>Enrollment Successful!</h3>
                <p><strong>Subject:</strong> {enrollResult.enrollment.subject}</p>
                <h4>Allocated Tutor:</h4>
                <ul>
                  <li><strong>Name:</strong> {enrollResult.tutor.name}</li>
                  <li><strong>Email:</strong> {enrollResult.tutor.email}</li>
                  <li><strong>Qualifications:</strong> {enrollResult.tutor.qualifications}</li>
                  <li><strong>Experience:</strong> {enrollResult.tutor.experience} years</li>
                  <li><strong>Subjects:</strong> {enrollResult.tutor.subjects.join(', ')}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses; 