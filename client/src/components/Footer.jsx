import React from 'react';
import './css/footerStyle.css';

const Footer = () => {
    return (
        <div id="footer">
            <div id='contact'>
                <div>
                    <div className='footItem'>
                        <a href='tel:+918707095822' className='socialLink'>
                            <i className="fa-solid fa-phone"></i>
                            8707095822
                        </a>
                    </div>
                    <div className='footItem'>
                        <a href='mailto:anandshukla2001@gmail.com' className='socialLink'>
                            <i className="fa-solid fa-envelope" />
                            anandshukla2001@gmail.com</a></div>
                </div>
                <div>
                    <div className='footItem'>
                        <a href='https://www.instagram.com/___anand__shukla___' className='socialLink' target='_blank'
                            rel='noreferrer'>
                            <i className="fa-brands fa-instagram" />
                            Anand Shukla
                        </a>
                    </div>
                    <div className='footItem'>
                        <a href='https://www.linkedin.com/in/anand-shukla2001/' className='socialLink' target='_blank'
                            rel='noreferrer'>
                            <i className="fa-brands fa-linkedin" />
                            Anand Shukla
                        </a>
                    </div>
                </div>
            </div>
            <div id='copyright'><p id='copyPara'>Copyright reserved by</p><br></br><b>Exchange</b>Store</div>
        </div>

    )
}

export default Footer;