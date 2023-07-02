import React, { useContext } from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import './css/loginStyle.css';





const Login = () => {

    const { dispatch } = useContext(userContext);

    const navigate = useNavigate();

    const [user, setUser] = useState({
        phone: '', password: ''
    })
    let name, value;
    const handleChange = (event) => {
        name = event.target.name;
        value = event.target.value;
        setUser({ ...user, [name]: value })
    }

    const sendData = async (event) => {
        document.querySelector('#loginbtn').innerHTML = 'Logging...';
        event.preventDefault();
        const { phone, password } = user;
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone, password
            })
        });
        // const data = await res.json();
        // alert(data.message);
        let p1 = document.querySelector('#password');
        let p2 = document.querySelector('#phone');
        let wp = document.querySelector('#wrongPass');
        let wu = document.querySelector('#wrongPhone');
        let ep = document.querySelector('#emptyPass');
        let ep1 = document.querySelector('#emptyPhone');

        if (res.status === 201) {
            dispatch({ type: 'Log', payload: true });
            navigate('/');
        }
        if (res.status === 500) {
            document.querySelector('#loginbtn').innerHTML = 'Login';
            ep1.classList.add('hide');
            wu.classList.add('hide');
            ep.classList.add('hide');
            p2.style = 'border-bottom:1px solid blueviolet;';
            p1.style = 'border-bottom:1px solid red;';
            wp.classList.remove('hide');

        }
        if (res.status === 422) {
            document.querySelector('#loginbtn').innerHTML = 'Login';
            ep1.classList.add('hide');
            ep.classList.add('hide');
            p1.style = 'border-bottom:1px solid blueviolet;';
            wp.classList.add('hide');
            p2.style = 'border-bottom:1px solid red;';
            wu.classList.remove('hide');
        }
        if (res.status === 423) {
            document.querySelector('#loginbtn').innerHTML = 'Login';
            ep1.classList.add('hide');
            p2.style = 'border-bottom:1px solid blueviolet;';
            wp.classList.add('hide');
            p1.style = 'border-bottom:1px solid red;';
            ep.classList.remove('hide');
        }
        if (res.status === 424) {
            document.querySelector('#loginbtn').innerHTML = 'Login';
            p1.style = 'border-bottom:1px solid blueviolet;';
            wp.classList.add('hide');
            p2.style = 'border-bottom:1px solid red;';
            ep.classList.add('hide');
            ep1.classList.remove('hide');
        }
    }

    return (
        <div className="box">
            <div id="register">
                {/* <div id="logImage"></div> */}
                <div id="form">
                    <h4>Welcome</h4>
                    <p><b>Log in</b> to your account to get started</p>
                    <form>

                        <div className='inEmail form-input'>
                            <span className="input-group">
                                <i className="fa-solid fa-user"></i>
                            </span>
                            <input type='number' className='form-control loginput' id='phone' name='phone' placeholder='97XXXXXX99'
                                value={user.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='hide' id='wrongPhone'>Not Registered</div>
                        <div className='hide' id='emptyPhone'>Enter Phone Number</div>

                        <div className='inPass form-input'>
                            <span className="input-group">
                                <i className="fa-solid fa-lock"></i>
                            </span>
                            <input type='password' className='form-control loginput' id='password' name='password' placeholder='**************'
                                value={user.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='hide' id='wrongPass'>Wrong Password</div>
                        <div className='hide' id='emptyPass'>Enter Password</div>

                        {/* <div className='remember'>
                    <input type="checkbox" className='form-control-check' id='remember'/>
                    <label htmlFor='remember'>Stay Logged In</label>
                </div> */}

                        <button type='submit' className='btn btn-primary'
                            name='login'
                            value='login'
                            id='loginbtn'
                            onClick={sendData}
                        >Login</button>
                    </form>
                    <div className='register'>New Here?<br></br>Click here to&nbsp;
                        <NavLink to="/register">Register</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;