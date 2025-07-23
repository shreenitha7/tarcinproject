import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Register = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post( 'http://localhost:3001/register', {name, email, password})
        .then(result => {
            console.log(result);
            if(result.data === "Already registered"){
                alert("E-mail already registered! Please Login to proceed.");
                navigate('/login');
            }
            else{
                alert("Registered successfully! Please Login to proceed.")
                navigate('/login');
            }
            
        })
        .catch(err => console.log(err));
    }


    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Register</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="exampleInputName" className="form-label">
                            Name
                            </label>
                            <input 
                                type="text"
                                placeholder="Enter Name"
                                className="form-control" 
                            id="exampleInputName" 
                                onChange={(event) => setName(event.target.value)}
                                required
                            /> 
                        </div>
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
                    <button type="submit" className="btn-primary">Register</button>
                    </form>
                <p className="auth-footer">Already have an account?</p>
                <Link to='/login' className="btn-secondary">Login</Link>
            </div>
        </div>
    )
}

export default Register