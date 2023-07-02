import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Receiver = () => {
    const navigate = useNavigate();
    const dispatchRedux = useDispatch();
    const AdvID = useSelector(state => state.AdvID);

    const [container, setContainer] = useState([]);
    const [pass, setPass] = useState('');


    const getAdv = async () => {

        const Loading = document.querySelector('.loading');
        const error = document.querySelector('.error');
        Loading.style.display = 'flex';

        const res = await fetch('/getadv', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const data = await res.json()

        if (res.status === 200) {
            setContainer(data);
            Loading.style.display = 'none';

        }
        if (res.status === 500) {
            Loading.style.display = 'none';
            error.classList.remove('hide');
        }
    }

    useEffect(() => {
        const verify = document.querySelector('#verify');
        verify.style.display = 'none';
        document.querySelector('#middle').style.display='none';
        getAdv();
    }, [])

    const editadv = (e) => {
        e.preventDefault();
        let advid = e.target.value;
        dispatchRedux({ type: 'setAdvID', payload: advid });
        navigate('/editadv');
    }

    const wrongPass = document.querySelector('#wrongPass');
    const verifybtn = document.querySelector('#verifybtn');
    const verify = document.querySelector('#verify');
    const alert = document.querySelector('#middle');
    const receive = document.querySelector('#receive-box');

    const deleteadv = (e) => {
        e.preventDefault();
        verify.style.display = 'flex';
        receive.style.display = 'none';
        let advid = e.target.value;
        dispatchRedux({ type: 'setAdvID', payload: advid });
    }

    //password input to delete post
    const handlePassChange = (event) => {
        setPass(event.target.value);
        console.log(pass);
    }

    const deletePost = async (event) => {
        event.preventDefault();
        verifybtn.innerHTML = 'Verifying';
        const res = await fetch('/deletepost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pass, AdvID })
        })
        await res.json();
        if (res.status === 200) {
            verify.style.display = 'none';
            alert.style.display='flex';
            setTimeout(() => {
                alert.style.display='none';
                receive.style.display='block';
                navigate('/');
            },3000)
        }
        if (res.status === 500) {
            verifybtn.innerHTML = 'Delete Post';
            wrongPass.classList.remove('hide');
        }
    }


    return (
        <>
            <div id="verify">
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
                    onClick={deletePost}
                >Delete Post</button>
                <p>Enter your Password to confirm your Identity</p>
            </div>

            <div id='middle'>
                <svg xmlns="http://www.w3.org/2000/svg" id='svg-success'>
                    <symbol id="check-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
                    </symbol>
                </svg>

                <div className="alert alert-success d-flex align-items-center" role="alert">
                    <svg className="bi flex-shrink-0 me-2" role="img" aria-label="Success:"><use xlinkHref="#check-circle-fill"></use></svg>
                    <div>
                        Post Deleted
                    </div>
                </div>
            </div>

            <div id='receive-box'>
                <div className='error hide'>No posts available</div>
                <div className='loading'>
                    <div className="loader"></div>
                    <p>Loading...</p>
                </div>

                {container.map((item) => {
                    return (
                        <div className="card">
                            <div id='cardimg'>
                                <img src={item.AdvPhoto} alt='img' max-height="100%" max-width="100%"></img>
                            </div>

                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-title"><span><b>Category: </b></span>{item.category}</p>
                                <p className="card-title"><span><b>City: </b></span>{item.city}</p>
                                <p className="card-text"><span><b>Description: </b></span>{item.description}</p>
                                <span>
                                    <button className="btn btn-primary seepost" onClick={editadv} value={item._id}>Edit</button>
                                    <button className="btn btn-primary seepost" onClick={deleteadv} value={item._id} id='deleteadv'>Delete</button>
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Receiver;