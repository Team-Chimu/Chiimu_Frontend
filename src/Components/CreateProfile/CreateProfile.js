import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './CreateProfile.css'

function CreateProfile() {

    let { id } = useParams();

    let navigate = useNavigate();

    // contains user information
    const [userInfo, setUserInfo] = useState({})

    // calls /api/users/self endpoint
    // to get and set user information
    // navigates to / if user is not authenticated
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

    useEffect(() => {
        getUserInfo();
    }, [])


    const {questions, setQuestions} = useState(['qOne', 'qTwo']);
    const {answers, setAnswers} = useState(['aOne', 'aTwo']);


    function createProfile() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            //body: JSON.stringify({ orgid: id, userid: userInfo.id, questions: questions, answers: answers})
            body: JSON.stringify({ orgid: id, userid: userInfo.id, questions: ['qOne'], answers: ['aOne']})
        }
        fetch(`http://localhost:3001/api/userprofile/create`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('successfully created user profile')
                    navigate(`/org/${id}`);
                } else {
                    console.log(data.error);
                }
            })
    }

    return (
        <div>
            <h1>Create Profile</h1>
            <button onClick={createProfile}>create profile</button>
        </div>
    )
}

export default CreateProfile