import React, { useState } from 'react';
import axios from 'axios';
import '../styles/auth.css';

const standardsOptions = [
  { label: '1-5', value: '1-5' },
  { label: '6-9', value: '6-9' },
  { label: '10-12', value: '10-12' }
];

const subjectsList = [
  'Maths', 'English', 'EVS', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'Computer',
  'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Accountancy', 'Business Studies'
];

const TutorRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    location: '',
    preferredSubjects: [],
    degree: '',
    proof: null,
    experience: '',
    standards: [],
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else if (name === 'standards') {
      const val = value;
      setForm((prev) => ({
        ...prev,
        standards: prev.standards.includes(val)
          ? prev.standards.filter(s => s !== val)
          : [...prev.standards, val]
      }));
    } else if (name === 'preferredSubjects') {
      const val = value;
      setForm((prev) => ({
        ...prev,
        preferredSubjects: prev.preferredSubjects.includes(val)
          ? prev.preferredSubjects.filter(s => s !== val)
          : [...prev.preferredSubjects, val]
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/tutor/register', {
        ...form,
        proof: form.proof ? form.proof.name : '',
      });
      setMessage('Registration successful!');
      setForm({
        name: '', email: '', password: '', phone: '', gender: '', location: '', preferredSubjects: [], degree: '', proof: null, experience: '', standards: []
      });
    } catch (err) {
      setMessage('Registration failed!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Tutor Registration</h2>
        <form onSubmit={handleSubmit} className="auth-form" encType="multipart/form-data">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" name="phone" className="form-control" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select name="gender" className="form-control" value={form.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" name="location" className="form-control" value={form.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Subjects</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {subjectsList.map(subj => (
                <label key={subj} style={{ fontWeight: 400 }}>
                  <input
                    type="checkbox"
                    name="preferredSubjects"
                    value={subj}
                    checked={form.preferredSubjects.includes(subj)}
                    onChange={handleChange}
                  /> {subj}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Degree</label>
            <input type="text" name="degree" className="form-control" value={form.degree} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Any Proof (Certificate, Degree, Aadhar, etc.)</label>
            <input type="file" name="proof" className="form-control" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
            {form.proof && <span style={{ fontSize: '0.9em' }}>{form.proof.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Experience (years)</label>
            <input type="number" name="experience" className="form-control" value={form.experience} onChange={handleChange} min="0" required />
          </div>
          <div className="form-group">
            <label className="form-label">Which Standards</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {standardsOptions.map(opt => (
                <label key={opt.value} style={{ fontWeight: 400 }}>
                  <input
                    type="checkbox"
                    name="standards"
                    value={opt.value}
                    checked={form.standards.includes(opt.value)}
                    onChange={handleChange}
                  /> {opt.label}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary">Register</button>
          {message && <div style={{ color: 'green', marginTop: '1rem' }}>{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default TutorRegister;