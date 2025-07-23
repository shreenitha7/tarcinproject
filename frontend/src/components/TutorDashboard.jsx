import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/admin.css';

const getEnrolledStudents = (tutorId) => {
  const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
  const students = JSON.parse(localStorage.getItem('students') || '[]'); // Simulated student DB
  // Group by subject
  const grouped = {};
  enrollments.filter(e => e.tutorId === tutorId).forEach(e => {
    if (!grouped[e.subject]) grouped[e.subject] = [];
    const student = students.find(s => s.id === e.studentId);
    if (student) grouped[e.subject].push(student);
  });
  return grouped;
};

const getTutorContent = (tutorId) => {
  return JSON.parse(localStorage.getItem('tutorContent') || '[]').filter(c => c.tutorId === tutorId);
};

const TutorDashboard = () => {
  const tutorId = localStorage.getItem('tutorId') || 'tutor1'; // fallback for demo
  const [enrollments, setEnrollments] = useState({});
  const [content, setContent] = useState([]);
  const [form, setForm] = useState({ subject: '', type: 'live', title: '', content: '' });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'content'

  const refreshData = () => {
    const tutorId = localStorage.getItem('tutorId');
    if (tutorId) {
      setEnrollments(getEnrolledStudents(tutorId));
      setContent(getTutorContent(tutorId));
    }
  };

  useEffect(() => {
    // Initial data load
    refreshData();
    
    // Listen for enrollment updates
    const handleEnrollmentUpdate = () => {
      refreshData();
    };
    
    window.addEventListener('enrollmentUpdated', handleEnrollmentUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('enrollmentUpdated', handleEnrollmentUpdate);
    };
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePostContent = (e) => {
    e.preventDefault();
    if (!form.subject || !form.type || !form.title || !form.content) {
      setMessage('All fields are required.');
      return;
    }
    const newContent = {
      tutorId,
      subject: form.subject,
      type: form.type,
      title: form.title,
      content: form.content,
      createdAt: new Date().toISOString()
    };
    const allContent = JSON.parse(localStorage.getItem('tutorContent') || '[]');
    allContent.push(newContent);
    localStorage.setItem('tutorContent', JSON.stringify(allContent));
    setContent(getTutorContent(tutorId));
    setMessage('Content posted!');
    setForm({ subject: '', type: 'live', title: '', content: '' });
  };

  const renderStudentsTab = () => (
    <div className="students-section">
      <div className="section-header">
        <h2>Enrolled Students</h2>
        <div className="total-students">
          {Object.values(enrollments).reduce((total, students) => total + students.length, 0)} Students
        </div>
      </div>
      
      {Object.keys(enrollments).length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-user-graduate"></i>
          <p>No students enrolled yet.</p>
        </div>
      ) : (
        <div className="enrollment-cards">
          {Object.entries(enrollments).map(([subject, students]) => (
            <div key={subject} className="enrollment-card">
              <div className="enrollment-header">
                <h3>{subject}</h3>
                <span className="student-count">{students.length} {students.length === 1 ? 'Student' : 'Students'}</span>
              </div>
              <div className="students-list">
                {students.map((s, index) => (
                  <div key={s.id} className="student-item">
                    <div className="student-avatar">
                      {s.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="student-info">
                      <div className="student-name">{s.name}</div>
                      <div className="student-email">{s.email}</div>
                    </div>
                    <div className="student-actions">
                      <button className="btn-icon" title="Send Message">
                        <i className="fas fa-envelope"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContentTab = () => (
    <div className="content-section">
      <h2>Post New Content</h2>
      <form onSubmit={handlePostContent} className="content-form">
        <div className="form-row">
          <input name="subject" value={form.subject} onChange={handleFormChange} placeholder="Subject" />
          <select name="type" value={form.type} onChange={handleFormChange}>
            <option value="live">Live Class</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>
        <div className="form-row">
          <input name="title" value={form.title} onChange={handleFormChange} placeholder="Title" />
          <input name="content" value={form.content} onChange={handleFormChange} placeholder="Link or message" />
          <button type="submit" className="btn-primary">Post</button>
        </div>
        {message && <div className="message">{message}</div>}
      </form>

      <h2>Posted Content</h2>
      {content.length === 0 ? (
        <p>No content posted yet.</p>
      ) : (
        <ul className="content-list">
          {content.map((c, idx) => (
            <li key={idx} className="content-item">
              <div className="content-header">
                <span className="subject">{c.subject}</span>
                <span className="type">[{c.type}]</span>
                <strong className="title">{c.title}</strong>
              </div>
              <div className="content-body">
                {c.type === 'announcement' ? (
                  c.content
                ) : (
                  <a href={c.content} target="_blank" rel="noopener noreferrer">
                    {c.content}
                  </a>
                )}
              </div>
              <div className="content-footer">
                Posted: {new Date(c.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="admin-dashboard tutor-dashboard">
      <div className="admin-header">
        <div className="admin-info">
          <h1>Tutor Dashboard</h1>
          <p>Welcome, Tutor!</p>
        </div>
      </div>
      
      <div className="tutor-tabs">
        <button 
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          My Students
        </button>
        <button 
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          My Content
        </button>
      </div>
      
      <div className="admin-content">
        <div className="main-content">
          {activeTab === 'students' && renderStudentsTab()}
          {activeTab === 'content' && renderContentTab()}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;