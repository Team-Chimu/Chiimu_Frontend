import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../../domain.js';
import check from '../../../images/check.png';
import './Pulse.css'


function Pulse() {

    let { id } = useParams();
    let navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({})
    const [orgInfo, setOrgInfo] = useState({})
    const weeks = [1]

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
                    console.log('loaded user information');
                    console.log(data)
                } else {
                    console.log(data.error);
                    navigate('/');
                }
            })
    }
    
    function getOrgInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/org/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    // console.log('successfully got org info');
                    console.log(data)
                    setOrgInfo(data)
                } else {
                    console.log(data.error)
                }
            })
    }

    useEffect(() => {
        getUserInfo();
        getOrgInfo();
    }, [])

    return (
        <div className='pulse'>
            <div className='pulse-header'>
                <h1>Pulse</h1>
            </div>
            {
                weeks.map((e) => {
                    return(
                        <div className='pulse-weeks' key={e} onClick={() => navigate(`${e}`)}>
                            <p>Week {e}</p>
                            <img src={check}/>
                        </div>
                        
                    )
                })
            }
        </div>
    )
}

export default Pulse