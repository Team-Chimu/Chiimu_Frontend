import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './Pulse.css'


function Pulse() {

    let { id } = useParams();
    let navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({})

    function getUserInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`http://localhost:3001/api/users/self`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setUserInfo(data)
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
            <h1>Pulse</h1>

        </div>
    )
}

export default Pulse