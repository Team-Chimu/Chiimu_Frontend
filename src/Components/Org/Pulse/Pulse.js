import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './Pulse.css'


function Pulse() {

    let { id } = useParams();
    let navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({})
    const weeks = [1, 2, 3, 4]

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

    useEffect(() => {
        getUserInfo();
    }, [])

    return (
        <div>
            <h1>Pulse</h1>
            {
                weeks.map((e) => {
                    return(
                        <React.Fragment key={e}>
                            <button onClick={() => navigate(`${e}`)}>Week {e} Pulse</button>
                            <br />
                        </React.Fragment>
                        
                    )
                })
            }
        </div>
    )
}

export default Pulse