import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import settingsCog from '../../images/settings-cog.png';
import addTeam from '../../images/add-team.png';
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

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [accessCode, setAccessCode] = useState('');

    function addOrgHandler() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, description: description, accessCode: accessCode })
        }
        fetch(`http://localhost:3001/api/org/create`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('successfully created org');
                    console.log(data);
                    fetch(`http://localhost:3001/api/org/${data.orgid}/join`, requestOptions)
                        .then(res2 => res2.json())
                        .then(data2 => {
                            if (data2.status === 'success') {
                                console.log('successfully joined my own org')
                            } else {
                                console.log('unable to join org');
                            }
                    })
                    window.location.reload(false);
                } else {
                    console.log('unable to create org');
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
                    <h1>Hello, {userInfo.displayName} ({userInfo.userType})</h1>
                    <img src={settingsCog}></img>
                </div>
                
                <div className='home-teamcards'>
                    {
                        userInfo.orgs.map((item) => (
                            <div className='home-teamcard' key={item._id._id} onClick={() => loadOrgPageHandler(item._id._id)} >
                                {item._id.name}
                            </div>
                        ))
                    }
                    <div className='home-teamcard' onClick={addOrgHandler}>
                        <img src={addTeam}></img>
                    </div>
                </div>

                <button onClick={signOut}>sign out</button>
                <input type='text' placeholder='name' onChange={e => setName(e.target.value)} />
                <input type='text' placeholder='description' onChange={e => setDescription(e.target.value)} />
                <input type='text' placeholder='accessCode' onChange={e => setAccessCode(e.target.value)} />
            </div>
        )
    } else {
        <div>
            <h1>ayo something ain't right</h1>
        </div>
    }
    
}

export default Home