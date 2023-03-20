import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
    // hook to redirect
    let navigate = useNavigate();

    // variables for email, password, and name
    // values are update when text fields change
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    // calls /login/signin endpoint
    // if information is correct, signs user in
    // and calls checkAuth()
    function signIn() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password })
        }
        fetch(`http://localhost:3001/login/signin`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    checkAuth();
                } else {
                    console.log(data.error);
                }
            })
    }

    // calls /api/users/self endpoint
    // navigates to /home if user is authenticated
    function checkAuth() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`http://localhost:3001/api/users/self`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('already logged in');
                    navigate('/home');
                } else {
                    console.log(data.error)
                }
            })
    }

    useEffect(() => {
        checkAuth();
    }, [])

    return (
        <div className='signin'>
            <div className='signin-text'>
                <h2>Welcome Back!</h2>
                <h2>Please sign in to continue.</h2>
            </div>
            <div className='signin-inputs'>
                <input type='text' placeholder='email' onChange={e => setEmail(e.target.value)} />
                <input type='text' placeholder='password' onChange={e => setPassword(e.target.value)} />
            </div>
            <button onClick={signIn}>Sign in</button>
        </div>
    )
}

export default SignIn