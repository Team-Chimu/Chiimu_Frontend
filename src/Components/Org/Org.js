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
                        id : data._id
                    })
                    fetch(`http://localhost:3001/api/userprofile/${id}/${data._id}`, requestOptions)
                        .then(res => res.json())
                        .then(data => {
                            if (data.status === 'success') {
                                console.log('GOT THE PROFILE');
                                console.log(data)
                                
                            } else if (data.error === 'profile not created') {
                                navigate(`/createprofile/${id}`)
                            } else {
                                console.log(data.error)
                                navigate('/home');
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

    useEffect(() => {
        getUserInfo();
        getOrgInfo();
    }, [])

    return (
        <div>
            <h1>{orgInfo.name}</h1>
            <h2>members</h2>
            {
                orgInfo.members.map((member) => (
                    <p key={member._id} onClick={() => console.log(member._id)}>{member.displayName}</p>
                ))
            }
            <button onClick={() => navigate('/home')}>go home</button>
        </div>
    )
}

export default Org