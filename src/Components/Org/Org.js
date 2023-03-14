import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './Org.css'

function Org() {

    let { id } = useParams();

    // hook to redirect
    let navigate = useNavigate();

    // contains user information
    const [userInfo, setUserInfo] = useState({})
    const [orgInfo, setOrgInfo] = useState({})
    // check if user is in the group
    // currently doesn't work
    function isInOrg(array) {
        if (array != undefined) {
            array.forEach(e => {
                if (e._id == id) {
                    return true;
                }
            });
        }
        return false;
    }

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
                        id : data._id,
                        viewed: data.viewed
                    })
                    fetch(`http://localhost:3001/api/userprofile/${id}/${data._id}`, requestOptions)
                        .then(res2 => res2.json())
                        .then(data2 => {
                            if (data2.status === 'success') {
                                console.log('GOT THE PROFILE');
                                console.log(data2)
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
        fetch(`http://localhost:3001/api/org/${id}`, requestOptions)
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
                    })
                } else {
                    console.log(data.error)
                }
            })
    }

    function isReady() {
        // check if the team has 5 members
        if (orgInfo.members?.length < 2) {
            console.log('not enough team mates')
            return false
        } else if (orgInfo.viewed?.length < 2) {
            console.log('not everyone has viewed profiles')
            return false
        } else {
            return true
        }
        
    }



    useEffect(() => {
        getUserInfo();
        getOrgInfo();
    }, [])

    return (
        <div>
            <h1>{orgInfo.name}</h1>
            <h2>id: {id}</h2>
            <h2>members</h2>
            {
                orgInfo.members?.map((member) => {
                    if (member._id !== userInfo.id ) {
                        return (
                            <p key={member._id} onClick={() => navigate(`/org/orgprofile/${id}`, {state: {allUsers: orgInfo.members}, replace: false})}>
                                {member.displayName}
                            </p>
                        )
                    }
                })
            }
            <button onClick={() => navigate(`/org/teamagreement/${id}`)} disabled={!isReady()}>Team Agreement</button>
            <br />
            <button>Team Norm</button>
            <br />
            <button>Weekly check-in</button>
            <br />
            <button onClick={() => navigate(`/org/pulse/${id}`)}>Pulse</button>
            <br />
            <button onClick={() => navigate('/home') }>go home</button>
        </div>
    )
}

export default Org