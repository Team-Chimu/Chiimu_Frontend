import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../../../domain.js';
import './PulseResponse.css'
import Pie from "./PieChart";
import {ProgressBar} from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';

function PulseResponse() {

    let { id } = useParams();
    let { week } = useParams();
    let navigate = useNavigate();
    
    const [userInfo, setUserInfo] = useState({})
    const [pulseInfo, setPulseInfo] = useState({})
    const [pulseStatus, setPulseStatus] = useState()
    const [questions, setQuestions] = useState(['Team Goals', 'Regular Meeting Times', 'Communication Channels'])
    const [answers, setAnswers] = useState([])

    let collaboration = 0;
    let projectProgress = 0;

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

    function getPulseInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/pulse/${id}/${week}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setPulseInfo(data)
                    console.log(data)
                } else {
                    console.log(data.error);
                }
            })
    }

    function createPulse() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ questions: questions, answers: answers, week: week })
        }
        fetch(`${domain}/api/pulse/create/${id}/${userInfo._id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.location.reload(false)
                } else {
                    console.log(data.error);
                }
            })
    }

    function handleSubmit() {
        let content = []
        for (let i = 0; i < questions.length; i++) {
            for (let j = 0; j < 5; j++) {
                let buttonthingy = document.getElementById('pulseresponse-input-' + j + '-' + i);
                if (buttonthingy.checked) {
                    content.push(buttonthingy.value)
                }
            }
        }
        setAnswers(content)
    }

    function displayQuestions() {
        return(
            questions?.map((q, i) => {
                return(
                    <React.Fragment key={i}>
                        <h2>{q}</h2>
                        <input type='radio' id={'pulseresponse-input-0-' + i} value={1} name={'thingies' + i} />
                        <input type='radio' id={'pulseresponse-input-1-' + i} value={2} name={'thingies' + i} />
                        <input type='radio' id={'pulseresponse-input-2-' + i} value={3} name={'thingies' + i} />
                        <input type='radio' id={'pulseresponse-input-3-' + i} value={4} name={'thingies' + i} />
                        <input type='radio' id={'pulseresponse-input-4-' + i} value={5} name={'thingies' + i} />
                    </React.Fragment>
                    
                )
            })
        )
    }

    function calculatePulseResults() {
        let answers = []
        pulseInfo.pulseResult?.forEach((e) => {
            answers.push(e.answers)
        })
        let averages = []
        let curr = 0
        for (let i = 0; i < questions.length; i++) {
            for (let j = 0; j < answers.length; j++) {
                curr += parseInt(answers[j][i]) 
            }
            averages.push(curr / pulseInfo.pulseResult?.length)
            curr = 0
        } 
        return averages

    }

    useEffect(() => {
        getUserInfo();
        getPulseInfo();
    }, [])

    useEffect(() => {
        if (answers.length != 0) {
            createPulse()
        }
    }, [answers])

    useEffect(() => {
        let info = pulseInfo.pulseResult
        if (info?.length == 3) {
            setPulseStatus(0)
            return
        }
        if (info?.length == 0) {
            setPulseStatus(2)
        }

        info?.forEach(e => {
            if (e.userid == userInfo?._id) {
                setPulseStatus(1)
                return
            } else {
                setPulseStatus(2)
            }
        });
    }, [userInfo])

    // make 3 if else to check for 
    if (pulseStatus == 0) {
        return (
            <div>
                <h1>PulseResponse</h1>
                <h2>Here are the results</h2>
                {
                    calculatePulseResults().map((e, i) => {
                        return(
                            <React.Fragment key={i}>
                                <h3>{questions[i]}: {e}</h3>
                                <ProgressBar className="progressBar" now={e*100/5}/>               
                            </React.Fragment>                     
                        )
                    })
                }
                <div className="piechart">
                    <Pie
                    data={[
                            { label: 'Poor', value: 50 },
                            { label: 'Good', value: 30 }
                        ]}
                    />
                </div>
                <div className="piechart">
                    <Pie
                    data={[
                            { label: 'Poor', value: 20 },
                            { label: 'Good', value: 50 }
                        ]}
                    />
                </div>
            </div>
        )
    } else if (pulseStatus == 1) {
        return (
            <div>
                <h1>PulseResponse</h1>
                <h2>Waiting for everyone to answer</h2>
            </div>
        )
    } else if (pulseStatus == 2) {
        return (
            <div>
                <h1>PulseResponse</h1>
                {displayQuestions()}
                <br />
                <button onClick={handleSubmit}>submit</button>
            </div>
        )
    } else {
        return (
            <div>
                <h1>PulseResponse</h1>
                <h2>Loading</h2>
            </div>
        )
    }
    
}

export default PulseResponse