import React, { useEffect, useContext } from 'react';
import { userContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Logout = () => {
    const navigate = useNavigate();
    const dispatchRedux = useDispatch();
    const {dispatch } = useContext(userContext);
    const logOut = () => {
        fetch('/logout', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            credentials: 'include'
        }).then((res) => {
            if (res.status === 200) {
                dispatch({ type: 'Log', payload: false });
                dispatchRedux({type:'remUser', payload:{}});
                setTimeout(() =>{
                    navigate('/login', { replace: true });
                },1500)
            }
        })
    }

    useEffect(() => {
        logOut();
    },[])
    
    return (
        <div id='middle'>
            <svg xmlns="http://www.w3.org/2000/svg" id='svg-success'>
                <symbol id="check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
                </symbol>
            </svg>

            <div className="alert alert-success d-flex align-items-center" role="alert">
                <svg className="bi flex-shrink-0 me-2" role="img" aria-label="Success:"><use xlinkHref="#check-circle-fill"></use></svg>
                <div>
                    Logged Out
                </div>
            </div>
        </div>
    );
}

export default Logout;