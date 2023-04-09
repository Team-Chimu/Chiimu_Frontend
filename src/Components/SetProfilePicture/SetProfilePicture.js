import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import placeholderImg from '../../images/placeholder-pic.png';
import './SetProfilePicture.css';

function SetProfilePicture() {

    // hook to redirect
    let navigate = useNavigate();

    // contains user information
    const [userInfo, setUserInfo] = useState({})
    const [sendingImage, setSendingImage] = useState('');
    const [displayingImage, setDisplayingImage] = useState(null);

    function getUserInfo() {
        const requestOptions = {
            credentials: 'include',
            method: 'GET'
        }
        fetch(`http://localhost:3001/api/users/self`, requestOptions)
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

    function setProfilePic() {
        const requestOptions = {
            withCredentials: true,
            method: 'PUT',
            'Access-Control-Allow-Origin': '*'
        }
        try {
            axios.put('http://localhost:3001/api/users/setpic', {image: sendingImage}, requestOptions)
            .then(res => {
                console.log(res.data)
            })
        } catch(e) {
            console.log(e)
        }
        
    }

    function formatImage(myFile) {
        setDisplayingImage(URL.createObjectURL(myFile))
        let reader = new FileReader()
        reader.readAsDataURL(myFile)
        reader.addEventListener("load", () => {
            setSendingImage(reader.result)
        })
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    useEffect(() => {
        if (userInfo.profilePic !== "") {
            fetch(userInfo.profilePic)
            .then(res => res.blob())
            .then(data => {
                if (data.type == 'image/jpeg') {
                    setDisplayingImage(URL.createObjectURL(data))
                }
                
            })
        }
        
    }, [userInfo])


    return (
        <div className='setprofilepicture'>
            {displayingImage == null ? <img src={placeholderImg}/> : <img src={displayingImage}/> }
            <input type="file" name="myImage" accept='image/jpeg' onChange={e => formatImage(e.target.files[0])}/>
            <h2 onClick={() => navigate('/home')}>Skip</h2>
            <button onClick={() => console.log(displayingImage)}>print database pic</button>
            <button onClick={() => console.log(sendingImage)}>testing</button>
            <button onClick={setProfilePic}>set image</button>
        </div>
    )
}

export default SetProfilePicture