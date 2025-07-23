import React from 'react';
import '../styles/about.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About TutorConnect</h1>
        <p>Connecting students with expert tutors for personalized learning experiences</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At TutorConnect, we believe that every student deserves access to quality education 
            and personalized learning support. Our platform connects students with experienced 
            tutors who are passionate about teaching and helping students achieve their academic goals.
          </p>
        </div>

        <div className="about-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Expert Tutors</h3>
              <p>Our tutors are qualified professionals with years of teaching experience in their respective subjects.</p>
            </div>
            <div className="feature-card">
              <h3>Wide Range of Subjects</h3>
              <p>From Mathematics and Science to Languages and Arts, we cover a comprehensive range of subjects.</p>
            </div>
            <div className="feature-card">
              <h3>Flexible Learning</h3>
              <p>Choose from various tutors and learning schedules that fit your needs and preferences.</p>
            </div>
            <div className="feature-card">
              <h3>Quality Assurance</h3>
              <p>All our tutors are verified and rated by students to ensure the highest quality of education.</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Browse Tutors</h3>
              <p>Search through our database of qualified tutors by subject, experience, and qualifications.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Choose Your Tutor</h3>
              <p>Review tutor profiles, read reviews, and select the tutor that best matches your learning needs.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Start Learning</h3>
              <p>Connect with your chosen tutor and begin your personalized learning journey.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 