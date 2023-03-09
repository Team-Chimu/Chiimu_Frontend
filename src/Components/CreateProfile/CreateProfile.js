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

    useEffect(() => {
        getUserInfo();
    }, [])

    // these questions can be made somewhere else later
    const questions = ['question one', 'question two', 'question three'];
    const [answers, setAnswers] = useState([]);


    function createProfile() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orgid: id, userid: userInfo.id, questions: questions, answers: answers})
        }
        fetch(`http://localhost:3001/api/userprofile/create`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('successfully created user profile')
                    if (userInfo.standing == undefined) updateProfile()
                    navigate(`/org/${id}`);
                } else {
                    console.log(data.error);
                }
            })
    }

    function updateProfile() {
        const requestOptions = {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ standing: standing, major: major, MBTI: mbti, phone: phone, workstyle: workstyle })
        }
        fetch(`http://localhost:3001/api/users/information/${userInfo.id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('successfully updated profile')
                } else {
                    console.log(data.error);
                }
            })
    }

    /*
        standing : self.standing,
        major : self.major,
        MBTI : self.MBTI,
        phone : self.phone,
        workstyle : self.workstyle
    */

    const [standing, setStanding] = useState('')
    const [major, setMajor] = useState('')
    const [mbti, setMbti] = useState('')
    const [phone, setPhone] = useState('')
    const [workstyle, setWorkstyle] = useState('')

    function accountQuestions() {
        if (userInfo.standing == undefined) {
            return(
                <>
                    <h1>What is your Standing</h1>
                    <input type='text' placeholder='answer' id='createprofile-standing'/>
                    <button onClick={() => setStanding(document.getElementById('createprofile-standing').value)}>next</button>

                    <h1>What is your major</h1>
                    <input type='text' placeholder='answer' id='createprofile-major'/>
                    <button onClick={() => setMajor(document.getElementById('createprofile-major').value)}>next</button>

                    <h1>What is your MBTI</h1>
                    <input type='text' placeholder='answer' id='createprofile-MBTI'/>
                    <button onClick={() => setMbti(document.getElementById('createprofile-MBTI').value)}>next</button>

                    <h1>What is your phone number</h1>
                    <input type='text' placeholder='answer' id='createprofile-phone'/>
                    <button onClick={() => setPhone(document.getElementById('createprofile-phone').value)}>next</button>

                    <h1>What is your workstyle</h1>
                    <input type='text' placeholder='answer' id='createprofile-workstyle'/>
                    <button onClick={() => setWorkstyle(document.getElementById('createprofile-workstyle').value)}>next</button>
                </>
            )
        }
    }

    return (
        <div>
            <h1>Create Profile</h1>
            {
                questions.map((q, i) => (
                    <React.Fragment key={i}>
                        <h1>{q}</h1>
                        <input type='text' placeholder='answer' id={'createprofile-' + i}/>
                        <button onClick={() => setAnswers(arr => [...arr, document.getElementById('createprofile-' + i).value])}>next</button>
                    </React.Fragment>
                ))
            }
            {accountQuestions()}
            <br />
            <button onClick={() => console.log(answers)}>print answers</button>
            <button onClick={createProfile}>create profile</button>
            <button onClick={() => navigate('/home')}>go home</button>
        </div>
    )
}

export default CreateProfile