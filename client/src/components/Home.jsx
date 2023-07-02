import React, {useEffect, useState} from 'react';
import charity from './images/charity.svg';
import donate from './images/donate.svg';
import carbon from './images/carbon.svg';
import rrr from './images/rrr.svg';
import './css/homeStyle.css';
import { useDispatch, useSelector } from 'react-redux';


const Home = () => {
    const dispatchRedux=useDispatch();
    const user = useSelector((state) => state.User);
    const [show, setShow]= useState(false);

    const callAbout = async ()=>{
        try{
            const res = await fetch('/getData', {
                method: 'GET',
                headers: {
                    Accept:'application/json',
                    'Content-Type':'application/json'
                },
                credentials:'include'
            });
    
            const data=await res.json(); 
            setShow(true);
            
            dispatchRedux({type:'setUser', payload: data});
            console.log(data);
    
            if(res.status===401){
                throw new Error(res.data);
            }
        }
        catch(error){
            setShow(false);
        }
    }

    useEffect(()=>{
        callAbout();
      },[])

    return (
        <>
            <div id='corousel'>
                <div id='corousel-body'>
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="true">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={rrr} className="d-block w-100" alt="..."
                            loading="lazy"/>
                        </div>
                        <div className="carousel-item">
                            <img src={carbon} className="d-block w-100" alt="..."
                            loading="lazy"/>
                            <div className="carousel-caption d-none d-md-block">
                                <p>Reduce Your Carbon Footprint by Re-using products <br></br> instead of buying new ones</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src={donate} className="d-block w-100" alt="..."
                            loading="lazy"/>
                        </div>
                        <div className="carousel-item">
                            <img src={charity} className="d-block w-100" alt="..."
                            loading="lazy"/>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
                </div>
                <div id='welcome'>
                <h4>{ show ? 'Welcome Back':'Adopt habit of Re-using instead of buying new products'}</h4>
                <h1 id='#name' >{user?<b>{user.name}</b>:<></>}</h1>
            </div>
            </div>
            <p id='homeInfo'>With the rise in Industrialisation, the rise in manufacturing of goods per day can be seen. The problem arises when these goods can not make their way back to industires which causes <b>rise in waste products</b>. The improper handling of this waste is killing our planet slowly. Where as on other hand there are many people who lacks these goods/products, what we can do is <b>donate</b> the goods which are not in use by us anymore. This will promote the <b>Re-Cycle, Reuse & Reduce</b> and helps some needy people out their. We came up with an idea to simplify this process by creating <b>ExThings</b>. On this platform you can make posts about goods/products you want to donate, at the same time you can take products you need from others too.</p>
        </>
    )
}

export default Home;