// import React from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center vh-100" style={{background: "var(--accent-gradient)"}}>
        <h1 style={{color: "var(--text-primary)"}}>Login Success Page</h1>
        <Link to='/login' className="btn btn-light my-5">Logout</Link>
    </div>
  )
}

export default Home