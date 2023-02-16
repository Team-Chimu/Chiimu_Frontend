import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './CreateProfile.css'

function CreateProfile() {

    let { id } = useParams();


    return (
        <div>CreateProfile id: {id}</div>
    )
}

export default CreateProfile