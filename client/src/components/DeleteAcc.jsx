import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {userContext} from '../App';
import './css/deleteStyle.css';

const DeleteAcc = () => {
    const navigate = useNavigate();
    const [pass, setPass] = useState();
    const {dispatch} = useContext(userContext);
    let value;
    const handlePassChange = (event) => {
        value = event.target.value;
        setPass(value);
    }

    const wrongPass = document.querySelector('#wrongPass');
    const verifybtn = document.querySelector('#verifybtn');

    const sendPass = (event) => {
        verifybtn.innerHTML='Verifying...'
        event.preventDefault();
        fetch('/delete', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pass }),
            credentials: 'include'
        }).then((res) => {
            if (res.status === 200) {
                dispatch({type:'Log', payload:false});
                navigate('/login');
            }
            if (res.status === 500) {
                verifybtn.innerHTML = 'Delete Account';
                console.log('not verified');
                wrongPass.classList.remove('hide');
            }
        })
    }

    const callAbout = async () => {
        try {
            const res = await fetch('/getData', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (res.status === 401) {
                throw new Error(res.data);
            }
        }
        catch (error) {
            navigate('/abouterr');
        }
    }

    useEffect(() => {
        callAbout();
    });



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
                    type='submit'
                    className='btn btn-primary'
                    id='verifybtn'
                    onClick={sendPass}
                >Delete Account</button>
                <p>Enter your Password to confirm your Identity</p>
            </div>

            {/* <svg xmlns="http://www.w3.org/2000/svg" id='successSVG'>
                <symbol id="check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
                </symbol>
            </svg>

            <div className="alert alert-success d-flex align-items-center" role="alert" id='deleteAlert'>
                <svg className="bi flex-shrink-0 me-2" role="img" aria-label="Success:" id='successSymbol'><use xlinkHref="#check-circle-fill"></use></svg>
                <div>
                    Account Deleted
                </div>
            </div> */}
        </div>

    )
}

export default DeleteAcc;