import { React, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './css/registerStyle.css';
import avatar from './images/avatar.svg';
import { converToBase64 } from '../base64/Base64';


const Register = () => {

    const AvatarClick = () => {
        const ProfilePic = document.querySelector('#profileImage');
        ProfilePic.click();
    }

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: '', email: '', phone: '', password: '', cpassword: '', profileImage: ''
    })

    let name, value;

    const handleProfilePic = async (event) => {
        name = event.target.name;
        const file = event.target.files[0];
        if (file.size > 500000) {
            alert('image should be less than or equal to 500kb');
        }
        else {
            const base64 = await converToBase64(file);
            setUser({ ...user, [name]: base64 });
        }
    }

    const handleChange = (event) => {
        name = event.target.name;
        value = event.target.value;
        setUser({ ...user, [name]: value });
    }
    const sendData = async (event) => {
        event.preventDefault();
        let button = document.querySelector('.btn');
        button.innerHTML = 'Signing...';
        event.preventDefault();
        const { _id, name, email, phone, password, cpassword, profileImage } = user;
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id, name, email, phone, password, cpassword, profileImage
            })
        });
        await res.json();
        let errMsg = document.querySelector('#errMsg');
        let p1 = document.querySelector('#password');
        let wp = document.querySelector('#wrongPass');
        // alert(data.message);
        if (res.status === 201) {
            navigate('/login');
        }
        if (res.status === 422) {
            button.innerHTML = 'Register';
            wp.classList.add('hide');
            errMsg.classList.remove('hide');
            errMsg.innerHTML = 'Do not leave any field empty';
        }
        if (res.status === 423) {
            button.innerHTML = 'Register';
            wp.classList.add('hide');
            errMsg.classList.remove('hide');
            errMsg.innerHTML = 'Passwords are not matching';
        }
        if (res.status === 424) {
            button.innerHTML = 'Register';
            wp.classList.add('hide');
            errMsg.classList.remove('hide');
            errMsg.innerHTML = 'Phone number already registered';
        }
        if (res.status === 500) {
            button.innerHTML = 'Register';
            errMsg.classList.add('hide');
            p1.style = 'border-bottom:1px solid red;';
            wp.classList.remove('hide');
            // alert(data.message);
        }
    }

    return (
        <div id="regBox" className="box">
            <div id="register">
                {/* <div id="regImage">
                    <form method="POST" id='uploadImg'></form>
                </div> */}
                <div>
                    <form method='POST' id="regForm">
                    <h4 className='regDesk'>Welcome</h4>
                    <p className='regDesk'>Tell us about yourself</p>
                        <div  id='avatar' >
                            <img src={user.profileImage || avatar}
                            alt='Upload'
                            id='Avatar'
                            onClick={AvatarClick}
                            loading="lazy"/>
                        </div>
                        <input
                            type='file'
                            name='profileImage'
                            id='profileImage'
                            accept='.jpeg, .jpg, .png'
                            value={user.image}
                            onChange={handleProfilePic}
                        />
                        <div className='inName form-input'>
                            <span className="input-group">
                                <i class="fa-solid fa-user" style={{color:'white'}}></i>
                            </span>
                            <input type='text' className='form-control reg-input' id='name' placeholder='Name'
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='inEmail form-input'>
                            <span className="input-group">
                                <i class="fa-solid fa-envelope" style={{color:'white'}}/>
                            </span>
                            <input type='email' className='form-control reg-input' id='email' placeholder='example@email.com'
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='inPhone form-input'>
                            <span className="input-group">
                                <i class="fa-solid fa-phone" style={{color:'white'}}></i>
                            </span>
                            <input type='number' className='form-control reg-input' id='phone' placeholder='Phone'
                                name="phone"
                                value={user.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='inPass form-input'>
                            <span className="input-group">
                                <i class="fa-solid fa-lock" style={{color:'white'}}></i>
                            </span>
                            <input type='password' className='form-control reg-input' id='password' placeholder='Password'
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='hide' id='wrongPass'>Minimum 8 characters required</div>
                        <div className='inPass form-input'>
                            <span className="input-group">
                                <i class="fa-solid fa-lock" style={{color:'white'}}></i>
                            </span>
                            <input type='password' className='form-control reg-input' id='cpassword' placeholder='Confirm'
                                name="cpassword"
                                value={user.cpassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="hide" id="errMsg"></div>
                        <button type='submit' className='btn btn-primary' id='regbtn'
                            onClick={sendData}
                        >Register</button>
                    </form>
                    <div id='regCon'>Already Registered?<br></br> Click here to&nbsp;
                        <NavLink to="/login">Login</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
