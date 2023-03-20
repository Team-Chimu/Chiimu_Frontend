import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {

    // hook to redirect
    let navigate = useNavigate();

    // variables for email, password, and name
    // values are update when text fields change\
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('user')

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
            body: JSON.stringify({ email: email, password: password, name: name, usertype: userType })
        }
        if (password == confirmPassword) {
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
        } else {
            console.log("passwords don't match")
        }
        
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
        <div className='signup'>
            <div className='signup-text'>
                <h2>Welcome!</h2>
                <h2>Please sign up to continue.</h2>
            </div>
            <div className='signup-inputs'>
                <input type='text' placeholder='Username' onChange={e => setName(e.target.value)} />
                <input type='text' placeholder='Email' onChange={e => setEmail(e.target.value)} />
                <input type='text' placeholder='Password' onChange={e => setPassword(e.target.value)} />
                <input type='text' placeholder='Confirm Password' onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            
            {/* uncomment this if we ever decide to implement an admin
            <div>
                <p>press checkbox below to be admin!</p>
                <input type='checkbox' onChange={e => (e.target.checked) ? setUserType('admin') : setUserType('user') }/>
            </div> 
            */}
            <button onClick={signUp}>sign up</button>
        </div>
    )
}

export default SignUp