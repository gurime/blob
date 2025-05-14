import { NavLink } from 'react-router-dom'
import navlogo from '../img/gulime.png'
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

    const activeStyle = ({ isActive }) => ({
        backgroundColor: isActive ? 'blue' : '',
        color: isActive ? 'white' : '',
        padding: '1rem',
        textDecoration: 'none'
      })

      const openSidenav = () => {
        setIsOpen(true);
      };
    
      const closeSidenav = () => {
        setIsOpen(false);
      };
  return (
    <>
     <nav className="navbar">
        <div className="logo">
          <NavLink to="/">
            <img src={navlogo} alt="Logo" />
          </NavLink>
        </div>
        <ul className="navlinks">
          <NavLink to="/" style={activeStyle}>
            Home
          </NavLink>
          <NavLink to="/about" style={activeStyle}>
            About
          </NavLink>
          <NavLink to="/contact" style={activeStyle}>
            Contact
          </NavLink>
        </ul>
        <div className="burger">
          <a href="#!" onClick={openSidenav}>
            &#9776;
          </a>
        </div>
      </nav>

      <div id="sideNav" className={`sidenav ${isOpen ? 'open' : ''}`}>
        <div className="closebtn">
          <a href="#!" onClick={closeSidenav}>
            &#10005;
          </a>
        </div>
        <NavLink to="/" className="sidenav-headline" onClick={closeSidenav}>
          <img src={navlogo} alt="logo" />
        </NavLink>
        <ul>
          <li className="sidenav-seperator">
            <NavLink to="/" onClick={closeSidenav}>
              Home
            </NavLink>
          </li>
          <li className="sidenav-seperator">
            <NavLink to="/about" onClick={closeSidenav}>
              About Us
            </NavLink>
          </li>
          <li className="sidenav-seperator">
            <NavLink to="/contact" onClick={closeSidenav}>
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  )
}
