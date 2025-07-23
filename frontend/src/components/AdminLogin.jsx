import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (username === 'admin' && password === '123') {
            localStorage.setItem('adminId', 'admin');
            localStorage.setItem('adminUsername', 'admin');
            setError('');
            alert('Admin login successful!');
            navigate('/admin/dashboard');
        } else {
            setError('Invalid admin credentials!');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Admin Login</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="adminUsername" className="form-label">
                            Admin Username
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter Admin Username"
                            className="form-control" 
                            id="adminUsername" 
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required
                        /> 
                    </div>
                    <div className="form-group">
                        <label htmlFor="adminPassword" className="form-label">
                            Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="Enter Password"
                            className="form-control" 
                            id="adminPassword" 
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                    <button type="submit" className="btn-primary">Login as Admin</button>
                </form>
                <p className="auth-footer">Back to main site</p>
                <Link to='/' className="btn-secondary">Go Home</Link>
            </div>
        </div>
    );
};

export default AdminLogin; 