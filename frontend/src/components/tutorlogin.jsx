import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post( 'http://localhost:3001/tutor/login', {email, password})
        .then(result => {
            console.log(result);
            if(result.data.status === "Success"){
                console.log("Login Success");
                localStorage.setItem('tutorId', result.data.id);
                alert('Login successful!')
                navigate('/tutor/dashboard');
            }
            else{
                alert(result.data.status || 'Login failed! Please try again.');
            }
        })
        .catch(err => {
            console.log(err);
            alert('Login failed! Please try again.');
        });
    }


    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Tutor Login</h2>
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
                    <button type="submit" className="btn-primary">Login</button>
                    </form>
                <p className="auth-footer">Don't have an account?</p>
                <Link to='/register/tutor' className="btn-secondary">Register</Link>
            </div>
        </div>
    )
}

export default Login