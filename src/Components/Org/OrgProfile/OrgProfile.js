import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './OrgProfile.css'

function OrgProfile() {

    const navigate = useNavigate();
    const location = useLocation();

    let { id } = useParams();
    let { profileId } = useParams();

    return (
        <div>
            <h1>OrgProfile</h1>
            <button onClick={() => console.log(location)}>testing</button>
        </div>
    )
}

export default OrgProfile