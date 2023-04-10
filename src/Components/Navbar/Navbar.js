import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { domain } from '../../domain.js'
import './Navbar.css'
import backArrow from '../../images/back-arrow.png'

function Navbar() {

  const navigate = useNavigate();

  const blacklistedPaths = ['/']

  if (!blacklistedPaths.includes(window.location.pathname)) {
    return (
      <div className='navbar'>
        <img src={backArrow} onClick={() => navigate('/home')} />
      </div>
    )
  }
  
}

export default Navbar