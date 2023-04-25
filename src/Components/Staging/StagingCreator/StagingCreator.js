import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { domain } from '../../../domain.js'
import './StagingCreator.css'

function StagingCreator() {

    let navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState({})
    const [accessCode, setAccessCode] = useState()

    const name = location.state.name;
    const description = location.state.description;

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
                    deleteAccessCodeAndMakeNewAccessCode()
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

    function newAccessCode() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ })
        }
        fetch(`${domain}/api/org/accesscode`, requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setAccessCode(data.accessCode)
        })
    }

    function deleteAccessCodeAndMakeNewAccessCode() {
        const requestOptions = {
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ })
        }
        fetch(`${domain}/api/org/accesscode`, requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            newAccessCode()
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