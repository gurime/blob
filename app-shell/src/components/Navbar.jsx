import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
    const activeStyle = ({ isActive }) => ({
        backgroundColor: isActive ? 'blue' : '',
        color: isActive ? 'white' : '',
        padding: '1rem',
        textDecoration: 'none'
      })
  return (
    <>
   <nav className='navbar'>
      <div className='logo'>
        <NavLink to='/' >
          Logo
        </NavLink>
      </div>
      <ul className='navlinks'>
        <NavLink to='/' style={activeStyle}>
          Home
        </NavLink>
        <NavLink to='/about' style={activeStyle}>
          About
        </NavLink>
        <NavLink to='/contact' style={activeStyle}>
          Contact
        </NavLink>
      </ul>
    </nav>

    </>
  )
}
