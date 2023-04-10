import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { domain } from '../../../domain.js';
import placeholderImg from '../../../images/placeholder-pic.png';
import './OrgProfile.css'

function OrgProfile() {

    const [userInfo, setUserInfo] = useState({})
    const [teamInfo, setTeamInfo] = useState([])
    const [orgInfo, setOrgInfo] = useState({})

    const navigate = useNavigate();
    const location = useLocation();
    let { id } = useParams();


    function getUserInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/users/self`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setUserInfo({
                        email: data.email,
                        displayName: data.displayName,
                        userType: data.userType,
                        admin: data.admin,
                        orgs: data.orgs,
                        id : data._id,
                        standing : data.standing,
                        major : data.major,
                        MBTI : data.MBTI,
                        phone : data.phone,
                        workstyle : data.workstyle
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
                fetch(`${domain}/api/users/${member._id}`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    fetch(`${domain}/api/userprofile/${id}/${member._id}`, requestOptions)
                    .then(res2 => res2.json())
                    .then(data2 => {
                        console.log('----------')
                        console.log(data)
                        console.log(data2)
                        setTeamInfo(teamInfo => [...teamInfo, {
                            _id: data._id,
                            displayName: data.displayName,
                            iceBreakerQuestions: data2.questions,
                            iceBreakerAnswers: data2.answers,
                            standing : data.standing,
                            major : data.major,
                            MBTI : data.MBTI,
                            phone : data.phone,
                            workstyle : data.workstyle
                            // add more stuff here as needed
                        }])
                    })
                })
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
                    console.log('successfully got org info');
                    console.log(data)
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

    function iceBreakers(a, b) {
        let content = []
        for (let i = 0; i < 3; i++) {
            content.push([a[i], b[i]])
        }
        return content
    }

    function viewedTeam() {
        if (orgInfo.viewed.includes(userInfo.id)) {
            navigate(`/org/${id}`)
            return;
        }
        
        const requestOptions = {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: userInfo.id })
        }
        fetch(`${domain}/api/org/${id}/viewed`, requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            navigate(`/org/${id}`)
        })
    }

    function displayProfiles() {
        try {
            return(
                teamInfo?.map((member) => {
                    if (member._id !== userInfo.id) {
                        return (
                            <div key={member._id}>
                                <div className='orgprofile-bio'>  
                                    <img src={placeholderImg}/>
                                    <div>
                                        <h3>Name: {member.displayName}</h3>
                                        <h3>Standing: {member.standing}</h3>
                                        <h3>Major: {member.major}</h3>
                                        <h3>MBTI: {member.MBTI}</h3>
                                        <h3>Work Type: {member.workstyle}</h3>
                                    </div>
                                </div>
                                <div className='orgprofile-contact'>
                                    <h4>Preferred Contact:</h4>
                                    <h4>placeholder</h4>
                                    <h4>Emergency Contact:</h4>
                                    <h4>placeholder</h4>
                                </div>
                                <div className='orgprofile-questions'>
                                    <h5>Icebreakers Questions and Answers</h5>
                                    {iceBreakers(member.iceBreakerQuestions, member.iceBreakerAnswers).map((item, i) => (
                                        <React.Fragment key={i}>
                                            <h5>Q{i + 1}: {item[0]}</h5>
                                            <h5>A: {item[1]}</h5>
                                        </React.Fragment>
                                    ))}
                                </div>
                                {/* make some sort of carousel with this button */}
                                <button onClick={() => console.log()}>next</button>
                            </div>
                        )
                    }
                })
            )
        } catch(e) {
            return (
                <h1>no information available</h1>
            )
        }
    }

    useEffect(() => {
        getUserInfo();
        getTeammateInfo();
        getOrgInfo();
    }, [])

    return (
        <div className='orgprofile'>
            <h1>OrgProfile</h1>
            {displayProfiles()}
            <button onClick={viewedTeam}>I SPIED ON MY TEAM MATES</button>
        </div>
    )
}

export default OrgProfile