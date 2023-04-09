import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../../domain.js';
import './TeamAgreement.css'

function TeamAgreement() {
    let { id } = useParams();
    let navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({})
    const [teamAgreementInfo, setTeamAgreementInfo] = useState({})

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

    const [teamGoals, setTeamGoals] = useState([])
    const [meetingTimes, setMeetingTimes] = useState([])
    const [communicationChannels, setCommunicationChannels] = useState([])
    const [pulse, setPulse] = useState([]);

    let weekTable = {
        '1' : 'Monday',
        '2' : 'Tuesday',
        '3' : 'Wednesday',
        '4' : 'Thursday' ,
        '5' : 'Friday',
        '6' : 'Saturday',
        '7' : 'Sunday'
    }

    function updateTeamAgreement() {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orgid: id, teamGoals: teamGoals, meetingTimes: meetingTimes, communicationChannels: communicationChannels, pulse: pulse })
        }
        fetch(`${domain}/api/teamAgreement/create`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    navigate(`/org/${id}`)
                } else {
                    console.log(data.error);
                }
            })
    }

    function getTeamAgreement() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`${domain}/api/teamAgreement/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setTeamAgreementInfo(data)
                    console.log('loaded team agreement information');
                    console.log(data)
                }
            })
    }

    function handleMeetingTimes() {
        let content = []
        for (let i = 0; i < 5; i++) {
            content.push(document.getElementById(`teamagreement-meeting-${i}`).value)
        }
        setMeetingTimes(arr => [...arr, content])
    }

    function displayMeetingTimes() {
        let arrOfArr = teamAgreementInfo.meetingTimes
        return(
            arrOfArr?.map(({ weekday, startHour, startMinute, endHour, endMinute }, i) => {
                if (startMinute < 10) startMinute = 0 + startMinute
                if (endMinute < 10) endMinute = 0 + endMinute
                return(
                    <p key={i}>{weekTable[weekday]} {startHour}:{startMinute} - {endHour}:{endMinute}</p>
                )
            })
        )

        
    }



    function handlePulse() {
        let content = []
        for (let i = 0; i < 3; i++) {
            content.push(document.getElementById(`teamagreement-pulse-${i}`).value)
        }
        setPulse(content)
    }

    function displayPulse() {
        let arr = teamAgreementInfo.pulse
        let day = weekTable[arr?.weekday]
        let hour = arr?.hour
        let minute = arr?.minute
        if (minute < 10) minute = 0 + minute
        return(
            <p>{day} {hour}:{minute}</p>
        )
    }

    useEffect(() => {
        getUserInfo();
        getTeamAgreement();
    }, [])


    return (
        <div>
            <h1>Team Agreement</h1>
            <h2>Team Goals</h2>
            {
                teamAgreementInfo.teamGoals?.map((a, i) => (
                    <p key={i}>{a}</p>
                ))
            }

            <h2>Regular Meeting Times</h2>
            {displayMeetingTimes()}

            <h2>Communication Channels</h2>
            {
                teamAgreementInfo.communicationChannels?.map((a, i) => (
                    <p key={i}>{a}</p>
                ))
            }

            <h2>Pulse</h2>
            {displayPulse()}

            <h3>Team Goals</h3>
            <input type='text' placeholder='input' id='teamagreement-teamgoals'/>
            <button onClick={() => setTeamGoals(arr => [...arr, document.getElementById('teamagreement-teamgoals').value])}>add</button>
            <div>
                {
                    teamGoals.map((item, i) => {
                        return(
                            <p key={i}>{item}</p>
                        )
                    })
                }
            </div>
            <br />

            <h3>Regular Meeting Times</h3>
            <input type='text' placeholder='day' id='teamagreement-meeting-0'/>
            <input type='text' placeholder='start hour' id='teamagreement-meeting-1'/>
            <input type='text' placeholder='start minute' id='teamagreement-meeting-2'/>
            <input type='text' placeholder='end hour' id='teamagreement-meeting-3'/>
            <input type='text' placeholder='end minute' id='teamagreement-meeting-4'/>
            <button onClick={handleMeetingTimes}>add</button>
            <div>
                {
                    meetingTimes.map((item, i) => {
                        return(
                            <p key={i}>{item}</p>
                        )
                    })
                }
            </div>
            <br />

            <h3>Communication Channels</h3>
            <input type='text' placeholder='input' id='teamagreement-communicationchannels'/>
            <button onClick={() => setCommunicationChannels(arr => [...arr, document.getElementById('teamagreement-communicationchannels').value])}>add</button>
            <div>
                {
                    communicationChannels.map((item, i) => {
                        return(
                            <p key={i}>{item}</p>
                        )
                    })
                }
            </div>
            <br />

            <h3>Pulse</h3>
            <input type='text' placeholder='day' id='teamagreement-pulse-0'/>
            <input type='text' placeholder='hour' id='teamagreement-pulse-1'/>
            <input type='text' placeholder='minute' id='teamagreement-pulse-2'/>
            <button onClick={handlePulse}>set</button>
            <div>
                {pulse}
            </div>
            <br />

            <button onClick={updateTeamAgreement}>submit</button>
            <button onClick={() => navigate(`/org/${id}`)}>go home</button>
        </div>
    )
}

export default TeamAgreement