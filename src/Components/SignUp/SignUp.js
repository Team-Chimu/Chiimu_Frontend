import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {

    // hook to redirect
    let navigate = useNavigate();

    // variables for email, password, and name
    // values are update when text fields change
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // calls /login/signup endpoint
    // if there are no conflicts, signs up user,
    // logs user in, and redirects to home page
    function signUp() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password, name: name })
        }
        fetch(`http://localhost:3001/login/signup`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('successfully signed up and signed in')
                    navigate('/home');
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
        <div>
            <h1>SignUp</h1>
            <input type='text' placeholder='email' onChange={e => setEmail(e.target.value)} />
            <input type='text' placeholder='password' onChange={e => setPassword(e.target.value)} />
            <input type='text' placeholder='name' onChange={e => setName(e.target.value)} />
            <button onClick={signUp}>sign up</button>
        </div>
    )
}

export default SignUp