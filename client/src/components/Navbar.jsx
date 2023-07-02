import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './css/navStyle.css';
import { userContext } from '../App';

const Navbar = () => {

  const { state, dispatch } = useContext(userContext);

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

      await res.json();
      if (res.status === 200) {
        dispatch({ type: 'Log', payload: true });
      }

      if (res.status === 401) {
        throw new Error(res.data);
      }
    }
    catch (error) {
      dispatch({ type: 'Log', payload: false });
    }
  }

  const NavMenu = () => {
    if (state) {
      return (
        <>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" className="active" aria-current="page" to="/">Home</NavLink>
            </li>

          
            <li className="nav-item dropdown mx-1 px-2">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Exchange
              </a>
              <ul className="dropdown-menu">
              <li><NavLink className="dropdown-item" to="/donate">Donate</NavLink></li>
              <li><NavLink className="dropdown-item" to="/receive">Receive</NavLink></li>
              </ul>
            </li>

            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" to="/profile">Profile</NavLink>
            </li>

            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" to="/logout">Logout</NavLink>
            </li>
            
            <li className="nav-item dropdown mx-1 px-2 history-btn">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                History
              </a>
              <ul className="dropdown-menu">
              <li><NavLink className="dropdown-item" to="/mydonation">My Donations</NavLink></li>
              {/* <li><NavLink className="dropdown-item" to="/receiving">My Receivings</NavLink></li> */}
              </ul>
            </li>
          </ul>
        </>
      )
    }
    else {
      return (
        <>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" className="active" aria-current="page" to="/">Home</NavLink>
            </li>

            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" to="/login">Login</NavLink>
            </li>

            <li className="nav-item mx-1 px-2">
              <NavLink id="nav-link" to="/register">Register</NavLink>
            </li>
          </ul>
        </>
      )
    }
  }

  useEffect(() => {
    callAbout();
  },[])

  return (
    <div>
      <nav className="navbar navbar-expand-lg text-bg-secondary bg-opacity-25">
        <div className="container-fluid">
          <a className="navbar-brand ms-2" href="/">
            <b>Exchange</b>Store</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <NavMenu />
            <form className="d-flex" role="search">
            </form>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;