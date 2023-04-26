import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { domain } from '../../domain.js';
import addTeam from '../../images/add-team.png';
import placeholderImg from '../../images/placeholder-pic.png';
import './Home.css';

function Home() {

    // hook to redirect
    let navigate = useNavigate();

    // contains user information
    const [userInfo, setUserInfo] = useState({})
    
    let counter = 3;
    const colors = {
        1: '#FF8139',
        2: '#FFE481',
        3: '#9EECC8',
    }

    // calls /api/users/self endpoint
    // to get and set user information
    // navigates to / if user is not authenticated
    function getUserInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/users/self`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setUserInfo(data)
                    console.log(data)
                    if (data.orgs.length == 0) {
                        navigate('/createjoinorg')
                    }
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
        fetch(`${domain}/login/signout`, requestOptions)
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

    function loadOrgPageHandler(key) {
        navigate(`/org/${key}`)
    }

    // load user info when page is loaded
    useEffect(() => {
        getUserInfo();
    }, [])

    // admin view. currently here for placeholder purposes
    if (userInfo.userType === "admin") {
        return (
            <div>
                <h1>Home</h1>
                <h2>Hello, {userInfo.displayName} ({userInfo.userType})</h2>
                <button onClick={signOut}>sign out</button>
            </div>
        )
    // normal user view
    } else if (userInfo.userType === "user") {
        return (
            <div className='home'> 
                <div className='home-header'>
                    <h2>Hello, {userInfo.displayName}</h2>
                    <img src={userInfo.profilePic == '' ? placeholderImg : userInfo.profilePic } onClick={() => navigate('/profilepic')}/>
                </div>
                
                <div className='home-teamcards'>
                    {
                        userInfo.orgs.map((item) => {        
                            return (
                                <div className='home-teamcard' key={item._id._id} onClick={() => loadOrgPageHandler(item._id._id)} style={{backgroundColor: colors[counter == 3 ? counter = 1 : ++counter]}}>
                                    <p className='home-teamcard-name'>{item._id.name}</p>
                                    <p className='home-teamcard-quarteroffered'>{item._id.quarterOffered}</p>
                                </div>
                            )
                        })
                    }
                    <div className='home-teamcard' onClick={() => navigate('/createjoinorg')} style={{backgroundColor: colors[counter == 3 ? counter = 1 : ++counter]}} >
                        <img src={addTeam}></img>
                    </div>
                </div>
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