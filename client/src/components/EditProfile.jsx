import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from './images/avatar.png';
import { converToBase64 } from '../base64/Base64';
import './css/editProfileStyle.css';


const EditProfile = () => {
    const navigate = useNavigate();
    const [pass, setPass] = useState();
    const [userData, setUserData] = useState({});

    let errMsg = document.querySelector('#errMsg');

    const AvatarClick = () => {
        const ProfilePic = document.querySelector('#profileImage');
        ProfilePic.click();
    }


    const verify = document.querySelector('#verify');
    const editProfile = document.querySelector('#editProfile');
    const wrongPass = document.querySelector('#wrongPass');

    let name, value;
    // let userInfo = { name: '', email: '', phone: '' };
    const handlePassChange = (event) => {
        value = event.target.value;
        setPass(value);
    }
    const handleChange = (event) => {
        name = event.target.name;
        value = event.target.value;
        setUserData({ ...userData, [name]: value });
    }

    const handleProfilePic = async (event) => {
        name = event.target.name;
        const file = event.target.files[0];
        console.log(file.size)
        if (file.size > 500000) {
            alert('image should be less than or equal to 500kb');
        }
        else {
            const base64 = await converToBase64(file);
            setUserData({ ...userData, [name]: base64 });
        }
    } 
    

    const sendPass = (event) => {
        document.querySelector('#verifybtn').innerHTML = 'Verifying...';
        event.preventDefault();
        fetch('/verify', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pass }),
            credentials: 'include'
        }).then((res) => {
            if (res.status === 200) {
                console.log('verified');
                res.json().then((data) => {
                    setUserData(data);
                })
                verify.style.display = 'none';
                editProfile.classList.remove('hide');
            }
            if (res.status === 500) {
                document.querySelector('#verifybtn').innerHTML = 'Verify';
                console.log('not verified');
                wrongPass.classList.remove('hide');

            }
        }).catch(err => {
            console.error(err);
        });
    }


    const sendData = (event) => {
        document.querySelector('#donebtn').innerHTML = 'Updating...';
        errMsg.classList.add('hide');
        event.preventDefault();
        console.log('new data');
        const { _id, name, email, phone, profileImage } = userData;
        fetch('/editprofile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id, name, email, phone, profileImage })
        }).then((response) => {
            if (response.status === 201) {
                navigate('/');
            }
            if (response.status === 501) {
                document.querySelector('#donebtn').innerHTML = 'Done';
                errMsg.classList.remove('hide');
                errMsg.innerHTML='Phone no. already exists';
            }
        })
    }



    return (
        <div id="profile">
            <div id="verify" className=''>
                <input
                    type='password'
                    placeholder='Password'
                    onChange={handlePassChange}
                ></input>
                <div className='hide' id='wrongPass'>Wrong Password</div>
                <button
                    id='verifybtn'
                    type='submit'
                    className='btn btn-primary'
                    onClick={sendPass}
                >Verify</button>
                <p>Enter your Password to confirm your Identity</p>
            </div>
            <div id='editProfile' className='hide'>

                <div className='edit form-input'>
                    <span className="input-group">
                        <i class="fa-solid fa-user"></i>
                    </span>
                    <input type='text' className='editInfo' placeholder='Name'
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className='edit form-input'>
                    <span className="input-group">
                        <i class="fa-solid fa-envelope" />
                    </span>
                    <input type='email' className='editInfo' placeholder='example@email.com'
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className='edit form-input'>
                    <span className="input-group">
                        <i class="fa-solid fa-phone"></i>
                    </span>
                    <input type='number' className='editInfo' placeholder='97XX89XX96'
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                    />
                </div>
                <img src={userData.profileImage || avatar}
                    height='130px'
                    width='130px' alt='Upload'
                    id='profilePhoto'
                    onClick={AvatarClick}></img>
                <input
                    type='file'
                    name='profileImage'
                    id='profileImage'
                    accept='.jpeg, .jpg, .png'
                    onChange={handleProfilePic}
                />
                <div className="hide" id="errMsg"></div>
                <button
                    id='donebtn'
                    type='submit'
                    className='btn btn-primary'
                    onClick={sendData}
                >Done</button>
            </div>
        </div>
    )
}

export default EditProfile;