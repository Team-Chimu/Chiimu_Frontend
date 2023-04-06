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

    

    const [questionNum, setQuestionNum] = useState(0)
    const [flag, setFlag] = useState(0)

    function nextQuestion(a = null) {
        setQuestionNum(questionNum + 1)
        document.querySelector('.createprofile-input').value = ''
        if (a != null) {
            setAnswers(arr => [...arr, a])
        }
        
    }

    function accountQuestions() {
        if (userInfo.standing == undefined) {
            
            if (questionNum == 0) {
                return(
                    <div className='createprofile-inputfields'>
                        <h3>What is your Standing?</h3>
                        <input type='text' placeholder='standing' onChange={e => setStanding(e.target.value)} className='createprofile-input'/>
                        <button onClick={() => nextQuestion()}>next</button>
                    </div>
                )
            } else if (questionNum == 1) {
                return(
                    <div className='createprofile-inputfields'>
                        <h3>What is your major?</h3>
                        <input type='text' placeholder='major' onChange={e => setMajor(e.target.value)} className='createprofile-input'/>
                        <button onClick={() => nextQuestion()}>next</button>
                    </div>
                )
            } else if (questionNum == 2) {
                return(
                    <div className='createprofile-inputfields'>
                        <h3>What is your MBTI?</h3>
                        <input type='text' placeholder='MBTI' onChange={e => setMbti(e.target.value)} className='createprofile-input'/>
                        <button onClick={() => nextQuestion()}>next</button>
                    </div>
                )
            } else if (questionNum == 3) {
                return(
                    <div className='createprofile-inputfields'>
                        <h3>What is your phone number?</h3>
                        <input type='text' placeholder='phone number' onChange={e => setPhone(e.target.value)} className='createprofile-input'/>
                        <button onClick={() => nextQuestion()}>next</button>
                    </div>
                )
            } else if (questionNum == 4) {
                return(
                    <div className='createprofile-inputfields'>
                        <h3>What is your workstyle?</h3>
                        <input type='text' placeholder='workstyle' onChange={e => setWorkstyle(e.target.value)} className='createprofile-input'/>
                        <button onClick={() => nextQuestion()}>next</button>
                    </div>
                )
            }
        } else {
            if (flag == 0) setFlag(1)
            return(
                <></>
            )
        }
    }

    function groupQuestions() {
        if (questionNum >= 5) {
            let i = questionNum - 5
            let isLastQuestion = i == questions.length - 1
            return (
                <div className='createprofile-inputfields'>
                    <h3>{questions[questionNum-5]}</h3>
                    <input type='text' placeholder='answer' className='createprofile-input' id={'createprofile-'+i}/>
                    <button onClick={() => isLastQuestion ? createProfile() : nextQuestion(document.getElementById('createprofile-'+i).value)}>
                        {isLastQuestion ? 'submit' : 'next'}
                    </button>
                </div>
            )
        } else {
            return(
                <></>
            )
        }
    }

    useEffect(() => {
        if (flag == 1) {
            setQuestionNum(5)
        }
        
    },[flag])

    return (
        <div className='createprofile'>
            {accountQuestions()}
            {groupQuestions()}
        </div>
    )
}

export default CreateProfile