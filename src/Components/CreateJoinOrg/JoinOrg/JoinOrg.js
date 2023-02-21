import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinOrg.css'


function JoinOrg() {

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

  const [orgId, setOrgId] = useState('');
  const [accessCode, setAccessCode] = useState('');

  function joinOrgHandler() {
    const requestOptions = {
      credentials: 'include',
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessCode: accessCode })
    }
    fetch(`http://localhost:3001/api/org/${orgId}/join`, requestOptions)
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('successfully joined org')
            navigate('/home')
            window.location.reload(false)
        } else {
            console.log('unable to join org');
        }
    })
  }

  useEffect(() => {
      getUserInfo();
  }, [])


  return (
    <div>
      <h1>Join Org</h1>
      <input type='text' placeholder='org id' onChange={e => setOrgId(e.target.value)} />
      <input type='text' placeholder='access code' onChange={e => setAccessCode(e.target.value)} />
      <button onClick={joinOrgHandler}>submit</button>
    </div>
  )
}

export default JoinOrg