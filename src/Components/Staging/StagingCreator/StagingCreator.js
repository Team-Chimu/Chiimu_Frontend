import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { domain } from '../../../domain.js'
import './StagingCreator.css'

function StagingCreator() {

    let navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState({})
    
    const name = location.state.name;
    const description = location.state.description;
    const accessCode = location.state.accessCode;

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
                } else {
                    console.log(data.error);
                    navigate('/');
                }
            })
    }


    function createOrg() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, description: description })
        }
        fetch(`${domain}/api/org/create`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.status === 'success') {
                    console.log('successfully created org');
                    navigate('/home')
                    window.location.reload(false)
                } else {
                    console.log('unable to create org');
                }
            })
    }



    useEffect(() => {
        getUserInfo()
    }, [])

    return (
        <div>
            <h1>StagingCreator</h1>
            {name}
            <br />
            {description}
            <br />
            {accessCode}
            <button onClick={createOrg}>create group</button>
        </div>
    )
}

export default StagingCreator