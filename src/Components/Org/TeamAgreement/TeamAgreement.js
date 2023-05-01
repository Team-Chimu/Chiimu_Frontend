import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../../domain.js';
import edit from '../../../images/edit-grey.png';
import x from '../../../images/x.png';
import { AutoScaleTextArea } from '../../../Tools/AutoScaleTextInput.js';
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

    const [teamGoals, setTeamGoals] = useState('')
    const [meetingTimes, setMeetingTimes] = useState([])
    const [communicationChannels, setCommunicationChannels] = useState('')
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

    function createTeamAgreement() {
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

    function updateTeamAgreement() {
        console.log('to do')
    }

    const [hasTeamAgreementInfo, setHasTeamAgreementInfo] = useState(false)

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
                    setHasTeamAgreementInfo(true)
                    setTeamGoals(data.teamGoals)
                    setCommunicationChannels(data.communicationChannels)
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
            <ul>
                {
                    arrOfArr?.map(({ weekday, startHour, startMinute, endHour, endMinute }, i) => {
                        if (startMinute < 10) startMinute = 0 + startMinute
                        if (endMinute < 10) endMinute = 0 + endMinute
                        return(
                            <li key={i}>{weekTable[weekday]} {startHour}:{startMinute} - {endHour}:{endMinute}</li>
                        )
                    })
                } 
            </ul>
            
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

    const [isEditingTeamNorms, setIsEditingTeamNorms] = useState(false)
    function editTeamNorms() {
        function handleSave() {
            setTeamGoals(document.getElementById('teamagreement-teamnorms-input').value)
            setIsEditingTeamNorms(false)
        }
        if (isEditingTeamNorms) {
            return(
                <>
                    <textarea id='teamagreement-teamnorms-input' className='teamagreement-input-textarea' defaultValue={teamGoals} />
                    <div className='teamagreement-input-button'>
                        <button onClick={handleSave}>Save</button>
                    </div>
                </>
            )  
        }
    }

    const [isEditingCommunicationChannels, setIsEditingCommunicationChannels] = useState(false)
    function editCommunicationChannels() {
        function handleSave() {
            setCommunicationChannels(document.getElementById('teamagreement-communicationchannels-input').value)
            setIsEditingCommunicationChannels(false)
        }
        if (isEditingCommunicationChannels) {
            return(
                <>
                    <textarea id='teamagreement-communicationchannels-input' className='teamagreement-input-textarea' defaultValue={communicationChannels} />
                    <div className='teamagreement-input-button'>
                        <button onClick={handleSave}>Save</button>
                    </div>
                </>
            )  
        }
    }

    function parseStringToList(bigString) {
        if (bigString == null) return;
        let result = []
        let curr = ''
        for (let i = 0; i < bigString.length; i++) {
            curr += bigString.at(i);
            if (bigString.at(i) == '\n') {
                result.push(curr)
                curr = ''
            }
        }
        result.push(curr)
        return(
            <>
                {
                    result.map((item, i) => (
                        <p key={i}>{item}</p>
                    ))
                }
            </> 
        )
    }

    useEffect(() => {
        getUserInfo();
        getTeamAgreement();
    }, [])


    return (
        <div className='teamagreement'>
            <div>
                <div className='teamagreement-header'>
                    <h1>Team Agreement</h1>
                    {
                        !hasTeamAgreementInfo ? 
                        <p>
                        Please fill out each section to complete the team agreement.
                        Once you are done, you must enter your signature to continue.
                        </p>
                        :
                        <></>
                    }
                    
                </div>

                <div className='teamagreement-input' >
                    <div className='teamagreement-input-header'>
                        <h2>Team Norms</h2>
                        <img src={!isEditingTeamNorms ? edit : x} onClick={() => setIsEditingTeamNorms(!isEditingTeamNorms)}/>
                    </div>
                    {
                        !isEditingTeamNorms ?
                        <div className='teamagreement-input-content'>
                            {/* {hasTeamAgreementInfo ? <p>What are the norms that all members pledge to follow?</p> : <></>}  */}
                            {parseStringToList(teamGoals)}
                        </div>
                        :
                        <></>
                    }        
                    {editTeamNorms()}
                </div>
                
                <div className='teamagreement-input'>
                    <div className='teamagreement-input-header'>
                        <h2>Communication Channels</h2>
                        <img src={!isEditingCommunicationChannels ? edit : x} onClick={() => setIsEditingCommunicationChannels(!isEditingCommunicationChannels)}/>
                    </div>
                    {
                        !isEditingCommunicationChannels ?
                        <div className='teamagreement-input-content'>
                            {parseStringToList(communicationChannels)}
                        </div>
                        :
                        <></>
                    }
                    
                    {editCommunicationChannels()}
                </div>

                <div className='teamagreement-input'>
                    <div className='teamagreement-input-header'>
                        <h2>Meeting Times</h2>
                        {hasTeamAgreementInfo ? <img src={edit}/> : <></>}
                    </div>
                    
                    <div className='teamagreement-input-content'>
                        {displayMeetingTimes()}
                    </div>
                    <div className='teamagreement-input-button'>
                        <button>Save</button>
                    </div>
                </div>
            </div>
            
            {/* {displayPulse()} */}

            {/* <h3>Team Norms</h3>
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
            </div> */}
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

            {/* <h3>Communication Channels</h3>
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
            <br /> */}

            <h3>Pulse</h3>
            <input type='text' placeholder='day' id='teamagreement-pulse-0'/>
            <input type='text' placeholder='hour' id='teamagreement-pulse-1'/>
            <input type='text' placeholder='minute' id='teamagreement-pulse-2'/>
            <button onClick={handlePulse}>set</button>
            <div>
                {pulse}
            </div>
            <br />

            <button onClick={!hasTeamAgreementInfo ? createTeamAgreement : updateTeamAgreement}>submit changes</button>
            <button onClick={() => console.log(teamAgreementInfo)}>testing</button>
        </div>
    )
}

export default TeamAgreement