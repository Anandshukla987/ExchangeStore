import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import avatar from './images/avatar.png';
import './css/aboutStyle.css';

const About = () => {
    const navigate = useNavigate();
    // const [userData, setUserData] = useState({});
    const userData = useSelector((state) => state.User);


    const editProfile = () => {
        navigate('/editprofile');
    }

    const deleteAcc = () => {
        navigate('/deleteacc');
    }

    return (
        <>
            <div id='profile'>
                <div id='profileCont'>
                    <div className='entity' id='Item'>Name</div>
                    <div className='entity' id='Itemvalue'>{userData.name}</div>
                </div>
                <div id='profileCont'>
                    <div className='entity' id='Item'>Email</div>
                    <div className='entity' id='Itemvalue'>{userData.email}</div>
                </div>
                <div id='profileCont'>
                    <div className='entity' id='Item'>Phone</div>
                    <div className='entity' id='Itemvalue'>{userData.phone}</div>
                </div>
                <div id='profilePic'>
                    <img src={userData.profileImage || avatar}
                        height='120px'
                        width='120px'
                        alt='profile'
                        id='DP' />
                </div>
                <button type='submit' className='btn btn-primary' id='edit' name='register'
                    value='register' onClick={editProfile}
                >Edit</button>

                <button type='submit' className='btn btn-primary' id='delete' name='register'
                    value='delete' onClick={deleteAcc}
                >Delete Account</button>
            </div>
        </>
    )
}

export default About;