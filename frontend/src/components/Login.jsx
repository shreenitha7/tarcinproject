import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/student/dashboard');
            } else {
                setError(result.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                            Email Id
                            </label>
                            <input 
                                type="email" 
                                placeholder="Enter Email"
                                className="form-control" 
                                id="exampleInputEmail1" 
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            /> 
                        </div>
                    <div className="form-group">
                            <label htmlFor="exampleInputPassword1" className="form-label">
                            Password
                            </label>
                            <input 
                                type="password" 
                                placeholder="Enter Password"
                                className="form-control" 
                                id="exampleInputPassword1" 
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>
                    <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <div className="error-message">{error}</div>}
                    </form>
                <p className="auth-footer">Don&apos;t have an account?</p>
                <Link to='/register' className="btn-secondary">Register</Link>
            </div>
        </div>
    )
}

export default Login