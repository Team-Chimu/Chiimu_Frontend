import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {

    // hook to redirect
    let navigate = useNavigate();

    // contains user information
    const [userInfo, setUserInfo] = useState({})

    // calls /api/users/self endpoint
    // to get and set user information
    // navigates to / if user is not authenticated
    function getUserInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`http://localhost:3001/api/users/self`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setUserInfo({
                        email: data.email,
                        displayName: data.displayName,
                        admin: data.admin,
                        orgs: data.orgs,
                        id : data._id
                    })
                    console.log('loaded user information'); 
                } else {
                    console.log(data.error);
                    navigate('/');
                }
            })
    }

    function signOut() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        fetch(`http://localhost:3001/login/signout`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('successfully signed out');
                    navigate('/');
                } else {
                    console.log('unable to sign out');
                }
            })
    }

    // load user info when page is loaded
    useEffect(() => {
        getUserInfo();
    }, [])

    return (
        <div>
            <h1>Home</h1>
            <h2>Hello, {userInfo.displayName}</h2>
            <button onClick={signOut}>sign out</button>
        </div>
    )
}

export default Home