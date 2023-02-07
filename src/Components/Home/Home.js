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
                        userType: data.userType,
                        admin: data.admin,
                        orgs: data.orgs,
                        id : data._id
                    })
                    console.log('loaded user information');
                    console.log(data)
                } else {
                    console.log(data.error);
                    navigate('/');
                }
            })
    }

    // calls /login/signout endpoint
    // logs out the user and redirects back to /
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

    if (userInfo.userType === "admin") {
        return (
            <div>
                <h1>Home</h1>
                <h2>Hello, {userInfo.displayName} ({userInfo.userType})</h2>
                <button onClick={signOut}>sign out</button>
            </div>
        )
    } else if (userInfo.userType === "user") {
        return (
            <div>
                <h1>Home</h1>
                <h2>Hello, {userInfo.displayName} ({userInfo.userType})</h2>
                <button onClick={signOut}>sign out</button>
            </div>
        )
    } else {
        <div>
            <h1>ayo something ain't right</h1>
        </div>
    }
    
}

export default Home