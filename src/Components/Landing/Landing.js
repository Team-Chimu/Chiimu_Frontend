import React from 'react'
import './Landing.css';

function signin() {
  const requestOptions = {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email: 'nosajn123@gmail.com', password: '123'})
  }

  fetch(`http://localhost:3001/login/signin`, requestOptions)
  .then(res => res.json())
  .then(data => console.log(data))
}

function checkAuth() {
  const requestOptions = {
    credentials: 'include',
    method: 'GET'
  }
  fetch(`http://localhost:3001/api/users/self`, requestOptions)
  .then(res => res.json())
  .then(data => console.log(data))
}

function Landing() {
  return (
    <div>
      <h1>Landing</h1>
      <button onClick={signin}>signin</button>
      <button onClick={checkAuth}>check if authenticated</button>
    </div>
  )
}

export default Landing