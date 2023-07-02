import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { converToBase64 } from '../base64/Base64';
import { useNavigate } from 'react-router-dom';

const EditAdv = () => {
    const navigate = useNavigate();
    const AdvID = useSelector((state) => state.AdvID);
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [adv, setAdv] = useState();


    let name, value;
    //trigger file input field
    const advPicClick = () => {
        document.querySelector('#AdvImage').click();
    }

    //take image from user and convert it to base64
    const handleAdvPic = async (event) => {
        if (error) { setError(false) }
        const advphoto = document.querySelector('#advphoto');
        advphoto.style.display = 'block';
        name = event.target.name;
        const file = event.target.files[0];
        if (file.size > 2000000) {
            alert('Image size should be less than 2MB')
        }
        else {
            const base64 = await converToBase64(file);
            setAdv({ ...adv, [name]: base64 });
            console.log(adv[name]);
        }
    }

    //take input for details about advertise
    const handleChange = (e) => {
        if (error) { setError(false) }
        name = e.target.name;
        value = e.target.value;
        setAdv({ ...adv, [name]: value });
    }

    //takes pin code
    const handlePin = (e) => {
        setAdv({ ...adv, [e.target.name]: '' });
        setPin(e.target.value);
    }
    const sendPin = async (e) => {
        e.preventDefault();
        console.log(e.target.name);
        if (pin.length === 6) {
            const res = await fetch(`https://thezipcodes.com/api/v1/search?zipCode=${pin}&countryCode=IN&apiKey=${process.env.REACT_APP_ZIP_API}`);
            const data = await res.json();
            setAdv({ ...adv, [e.target.name]: data.location[0].county || data.location[0].city });
        }
    }



    const addPost = (e) => {
        e.preventDefault();
        document.querySelector('#post').innerHTML = 'Updating';
        console.log(adv);
        fetch('/updatepost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adv)
        }).then((res) => {
            if (res.status === 201) {
                headline.classList.add('hide');
                donateBox.style.visibility = 'hidden';
                donateBox.style.display = 'none';
                success.classList.remove('hide');
                setTimeout(() => {
                    navigate('/mydonation');
                },3000)
            }
            if (res.status === 422) {
                setError(true);
                document.querySelector('#post').innerHTML = 'Update';
            }
        }).catch((err) => { console.log(err) })

    }



    const getAdvData = async () => {
        const res = await fetch('/getadvid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AdvID })
        })

        const data = await res.json();

        if (res.status === 200) {
            setAdv(data);
        }
    }

    useEffect(() => {
        getAdvData();
    }, [])



    const success = document.querySelector('.success');
    const donateBox = document.querySelector('#donateBox');
    const headline = document.querySelector('.headline');



    return (
        <>{adv ?
            <>
                <div className="headline">Create a post so that your donations reach to some needy individual efficientyly</div>
                <div id='donateBox'>
                    <div>
                        <div id='advPic' onClick={advPicClick}>
                            <img src={adv.AdvPhoto} alt='productPhoto'
                                id='advphoto'
                                style={{display:'block'}}
                                ></img>
                            {/* <i className="fa-solid fa-camera fa-3x" id='advIco'></i> */}
                            <input
                                type='file'
                                name='AdvPhoto'
                                id='AdvImage'
                                accept='.jpeg, .jpg, .png'
                                onChange={handleAdvPic}
                            />
                        </div>
                    </div>
                    <div id='advInfo'>
                        <form method='POST'>
                            <input type='text'
                                name='title'
                                id='title'
                                className='advInfo'
                                placeholder="TITLE"
                                onChange={handleChange}
                                value={adv.title}
                            ></input>
                            <input type='number'
                                id='city'
                                name='city'
                                className='advInfo'
                                placeholder="PinCode"
                                onChange={handlePin}
                            ></input>
                            <input
                                type='text'
                                placeholder='City'
                                value={adv.city}
                                disabled
                                id='city'
                                className='advInfo'
                            ></input>

                            <button id='checkpin' className="btn btn-outline-success"
                                name='city'
                                onClick={sendPin}>Check Pin</button>

                            <select id='category' className='advInfo'
                                name='category'
                                onChange={handleChange}
                                value={adv.category}>
                                <option value='' disabled hidden selected id='catplace'>Category</option>
                                <option value='Books'>BOOKS</option>
                                <option value='Clothes'>CLOTHES</option>
                                <option value='Utensil'>UTENSILS</option>
                                <option value='Other'>OTHER</option>
                            </select>



                            <textarea name='description'
                                id='description'
                                className='advInfo'
                                placeholder="Describe your donation"
                                onChange={handleChange}
                                value={adv.description}
                            ></textarea>
                            {error ? <div id="errpost">Fill all details !</div> : <></>}
                            <button type='submit' className='btn btn-primary' id='post' name='register'
                                value='register' onClick={addPost}
                            >Update</button>
                        </form>
                    </div>
                </div>
                <div className='success hide'>
                    <svg xmlns="http://www.w3.org/2000/svg" id='svg-success'>
                        <symbol id="check-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
                        </symbol>
                    </svg>

                    <div className="alert alert-success d-flex align-items-center" role="alert">
                        <svg className="bi flex-shrink-0 me-2" role="img" aria-label="Success:"><use xlinkHref="#check-circle-fill"></use></svg>
                        <div>
                            Post Updated Succesfully
                        </div>
                    </div>
                </div>
            </> :
            <div className='loading'>
                <div className="loader"></div>
                <p>Loading...</p>
            </div>
        }
        </>
    )
}
export default EditAdv
