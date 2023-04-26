import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { domain } from '../../../domain.js'
import './StagingJoiner.css'

function StagingJoiner() {
    let navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({})
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

    useEffect(() => {
        getUserInfo()
    }, [])

    return (
        <div>
            <h1>StagingJoiner</h1>
        </div>
    )
}

export default StagingJoiner