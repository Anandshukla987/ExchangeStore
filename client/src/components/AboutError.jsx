import React from 'react';
import Login from './Login';
const AboutError = ()=>{
    return (
        <div  id="aboutErr">
            <h5>You have to login first to view Profile</h5>
            <Login/>
        </div>
    )
}

export default AboutError;