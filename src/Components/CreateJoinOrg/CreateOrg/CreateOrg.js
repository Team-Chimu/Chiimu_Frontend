import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateOrg.css'


function CreateOrg() {

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

    
    

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [accessCode, setAccessCode] = useState('');

    function addOrgHandler() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, description: description, accessCode: accessCode })
        }
        const requestOptions2 = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessCode: accessCode })
        }
        fetch(`http://localhost:3001/api/org/create`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('successfully created org');
                    console.log(data);
                    fetch(`http://localhost:3001/api/org/${data.orgid}/join`, requestOptions2)
                        .then(res2 => res2.json())
                        .then(data2 => {
                            if (data2.status === 'success') {
                                console.log('successfully joined my own org')
                            } else {
                                console.log('unable to join org');
                            }
                    })
                    navigate('/home')
                    window.location.reload(false)
                } else {
                    console.log('unable to create org');
                }
            })
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    const [questionNum, setQuestionNum] = useState(0)

    function inputFields() {
        if (questionNum == 0) {
            return(
                <div className='createorg-inputfields'>
                    <h3>What's your group name?</h3>
                    <input type='text' placeholder='name' onChange={e => setName(e.target.value)} className='createorg-input'/>
                    <button onClick={nextQuestion}>next</button>
                </div>
            )
        } else if (questionNum == 1) {
            return(
                <div className='createorg-inputfields'>
                    <h3>What's your group description?</h3>
                    <input type='text' placeholder='description' onChange={e => setDescription(e.target.value)} className='createorg-input' />
                    <button onClick={nextQuestion}>next</button>
                </div>
            )
        } else {
            return(
                <div className='createorg-inputfields'>
                    <h3>Create your access code</h3>
                    <input type='text' placeholder='accessCode' onChange={e => setAccessCode(e.target.value)} className='createorg-input' />
                    <button onClick={addOrgHandler}>submit</button>
                </div>
            )
        }
        
    }

    function nextQuestion() {
        setQuestionNum(questionNum + 1)
        document.querySelector('.createorg-input').value = ''
    }

    return (
        <div className='createorg'>
            {inputFields()}
        </div>
    )
}

export default CreateOrg