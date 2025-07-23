import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    navigate(`/courses?search=${searchQuery}`)
  }

  return (
    <div className="landing-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Tutor</h1>
          <p>Connect with expert tutors for personalized learning experiences</p>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="What would you like to learn?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search Tutors
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Expert Tutors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Subjects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Happy Students</span>
            </div>
          </div>
        </div>
      </section>

      <section className="subjects-section">
        <h2>Popular Subjects</h2>
        <div className="subjects-grid">
          {['Mathematics', 'Science', 'English', 'Programming', 'Music', 'Languages'].map((subject) => (
            <div key={subject} className="subject-card">
              <h3>{subject}</h3>
              <Link to="/tutors" className="explore-link">Explore →</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2>How TutorConnect Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-icon">1</div>
            <h3>Search</h3>
            <p>Find the perfect tutor based on your needs</p>
          </div>
          // Update the Connect step card to include a button
          <div className="step-card">
            <div className="step-icon">2</div>
            <h3>Connect</h3>
            <p>Schedule a session with your chosen tutor</p>
            <button 
              className="connect-action-btn"
              onClick={() => navigate('/connect')}
            >
              Connect Now
            </button>
          </div>
          <div className="step-card">
            <div className="step-icon">3</div>
            <h3>Learn</h3>
            <p>Enjoy personalized learning experience</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage