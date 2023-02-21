import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateJoinOrg.css'

function CreateJoinOrg() {


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

    useEffect(() => {
        getUserInfo();
    }, [])

    return (
        <div>
            <button onClick={() => navigate('/createorg')}>Create Group</button>
            <br />
            <button onClick={() => navigate('/joinorg')}>Join Group</button>
        </div>
    )
}

export default CreateJoinOrg