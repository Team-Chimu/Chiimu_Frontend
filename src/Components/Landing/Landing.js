import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {

    // hook to redirect
    let navigate = useNavigate();

    // variables for email and password
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
                    console.log('successfully logged in');
                    navigate('/home');
                } else {
                    console.log(data.error)
                }
            })
    }

    // calls checkAuth() on load to navigate to /home
    useEffect(() => {
        checkAuth();
    }, [])

    return (
        <div>
            <h1>Landing</h1>
            <input type='text' placeholder='email' onChange={e => setEmail(e.target.value)} />
            <input type='text' placeholder='password' onChange={e => setPassword(e.target.value)} />
            <button onClick={signIn}>sign in</button>
            <button onClick={() => navigate('/signup')}>sign up</button>
        </div>
    )
}

export default Landing