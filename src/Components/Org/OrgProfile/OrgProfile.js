import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import placeholderImg from '../../../images/placeholder-pic.png';
import './OrgProfile.css'

function OrgProfile() {

    const [userInfo, setUserInfo] = useState({})
    const [teamInfo, setTeamInfo] = useState([])

    const navigate = useNavigate();
    const location = useLocation();
    let { id } = useParams();


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

    function getTeammateInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        location.state.allUsers?.forEach((member) => {
            if (member._id !== userInfo.id) {
                fetch(`http://localhost:3001/api/users/${member._id}`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    fetch(`http://localhost:3001/api/userprofile/${id}/${member._id}`, requestOptions)
                    .then(res2 => res2.json())
                    .then(data2 => {
                        console.log('----------')
                        console.log(data)
                        console.log(data2)
                        setTeamInfo(teamInfo => [...teamInfo, {
                            _id: data._id,
                            displayName: data.displayName,
                            // add more stuff here as needed
                        }])
                    })
                })
            }
            
        })
    }

    //setTeamInfo(teamInfo => [...teamInfo, data])

    useEffect(() => {
        getUserInfo();
        getTeammateInfo();
    }, [])

    return (
        <div>
            <h1>OrgProfile</h1>
            {
                teamInfo?.map((member) => {
                    if (member._id !== userInfo.id) {
                        return (
                            <div key={member._id}>
                                <div className='orgprofile_bio'>  
                                    <img src={placeholderImg}/>
                                    <div>
                                        <h3>Name: {member.displayName}</h3>
                                        <h3>Standing:</h3>
                                        <h3>Major:</h3>
                                        <h3>MBTI:</h3>
                                        <h3>Work Type:</h3>
                                    </div>
                                </div>
                                <div className='orgprofile_contact'>
                                    <h4>Preferred Contact:</h4>
                                    <h4>placeholder</h4>
                                    <h4>Emergency Contact:</h4>
                                    <h4>placeholder</h4>
                                </div>
                                <div className='orgprofile_questions'>

                                </div>
                                {/* make some sort of carousel with this button */}
                                <button>next</button>
                            </div>
                        )
                    }
                })
            }
            <button onClick={() => console.log(teamInfo)}>testing</button>
        </div>
    )
}

export default OrgProfile