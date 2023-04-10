import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../domain.js';
import './Org.css'
import edit from '../../images/edit.png'
import placeholderPic from '../../images/placeholder-pic.png'
import lock from '../../images/lock.png'
import openlock from '../../images/openlock.png'

function Org() {

    let { id } = useParams();

    // hook to redirect
    let navigate = useNavigate();

    // contains user information
    const [userInfo, setUserInfo] = useState({})
    const [orgInfo, setOrgInfo] = useState({})
    const [teamInfo, setTeamInfo] = useState([])

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
                    // this is to check if the user has filled out the userprofile
                    fetch(`${domain}/api/userprofile/${id}/${data._id}`, requestOptions)
                        .then(res2 => res2.json())
                        .then(data2 => {
                            if (data2.status === 'success') {
                                navigate(`/org/${id}`)
                            } else {
                                navigate(`/createprofile/${id}`)
                            }
                        })

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
                    // console.log(data)
                    setOrgInfo({
                        accessCode: data.accessCode,
                        admin: data.admin,
                        description: data.description,
                        members: data.members,
                        name: data.name,
                        viewed: data.viewed
                    })
                } else {
                    console.log(data.error)
                }
            })
    }

    function getTeammateInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        orgInfo.members?.forEach((member) => {
            if (member._id !== userInfo.id) {
                fetch(`${domain}/api/userprofile/${id}/${member._id}`, requestOptions)
                    .then(res => res.json())
                    .then(data => {
                        // console.log('----------')
                        // console.log(data)
                        setTeamInfo(teamInfo => [...teamInfo, data])
                    })
            }
        })
    }

    const [ready1, setReady1] = useState(false)
    function isReady1() {
        // check if the team has 2 members
        // can change this in future, 2 members is only for testing
        if (orgInfo.members?.length == 3 && orgInfo.viewed?.length == 3) {
            setReady1(true)
        }
    }

    const [ready2, setReady2] = useState(false)
    function isReady2() {
        // check if there is a team agreement
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/teamAgreement/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setReady2(true)
                }
            })
    }

    function userProfilePic(i) {
        let img = teamInfo.at(i)?.profilePic
        fetch(img)
        .then(res => res.blob())
        .then(data => {
            console.log(data)
            return (
                <img src={URL.createObjectURL(data)}/>
            )   
        })
        
    }

    useEffect(() => {
        getUserInfo();
        getOrgInfo();
    }, [])

    useEffect(() => {
        getTeammateInfo();
        isReady1();
        isReady2();
    }, [orgInfo])

    return (
        <div className='org'>
            <div className='org-header'>
                {/* will change this h2 to an input field later */}
                <h2>{orgInfo.name}</h2>
                <img src={edit} />
            </div>

            <div className='org-members'>
                {
                    orgInfo.members?.map((member, i) => {   
                        if (member._id !== userInfo._id ) {
                            return (
                                <div key={member._id} onClick={() => navigate(`/org/orgprofile/${id}`, {state: {allUsers: orgInfo.members}, replace: false})}>
                                    <div>
                                        <img src={placeholderPic} />
                                    </div>
                                    {member.displayName}
                                </div>
                            )
                        }
                    })
                }
                
            </div>

            <div className='org-buttons'>
                <button onClick={() => navigate(`/org/teamagreement/${id}`)} disabled={!ready1} className='org-buttons-teamagreement'>
                    Team Agreement
                    {!ready1 ? <img src={lock}/> : <img src={openlock}/>}
                    
                </button>
                <button onClick={() => navigate(`/org/pulse/${id}`)} disabled={!ready2} className='org-buttons-pulse'>
                    Pulse
                    {!ready2 ? <img src={lock}/> : <img src={openlock}/>}
                </button>
                <button className='org-buttons-weeklyagreement'>
                    what do i put here
                    {/* {!ready1 ? <img src={lock}/> : <img src={openlock}/>} */}
                </button>
            </div>
            
        </div>
    )
}

export default Org