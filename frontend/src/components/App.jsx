import Home from './Home';
import Login from './Login';
import Register from './Register';
import LandingPage from './LandingPage';
import Navbar from './navbar';
import TutorLogin from './tutorlogin';
import TutorRegister from './tutoregister';

import {BrowserRouter, Routes, Route} from "react-router-dom";

// Add these imports
import StudentDashboard from './StudentDashboard';
import TutorDashboard from './TutorDashboard';
import Courses from './Courses';
import AboutUs from './AboutUs';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <div style={{marginTop : '-3.5rem'}} >
        <BrowserRouter >
          <Navbar/>
          <Routes>
          <Route path="/" element ={<LandingPage/>} />
            <Route path="/courses" element ={<Courses/>} />
            <Route path="/about" element ={<AboutUs/>} />
          <Route path="/register" element ={<Register/>} />
          <Route path="/register/tutor" element ={<TutorRegister/>} />
          <Route path="/login" element ={<Login/>} />
          <Route path="/login/tutor" element ={<TutorLogin/>} />
            <Route path="/admin/login" element ={<AdminLogin/>} />
            <Route path="/admin/dashboard" element ={<AdminDashboard/>} />
          <Route path="/home" element ={<Home/>} />
          <Route path="/student/dashboard" element={<StudentDashboard/>} />
          <Route path="/tutor/dashboard" element={<TutorDashboard/>} />
            <Route path="/land" element ={<LandingPage/>} />
          </Routes>
        </BrowserRouter>
      </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
