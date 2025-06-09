import { NavLink } from 'react-router-dom'
import navlogo from '../img/gulime.png'
import { useEffect, useRef, useState } from 'react';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { auth } from '../db/firebase';
export default function Navbar() {

const [isOpen, setIsOpen] = useState(false);
const [isSignedIn, setIsSignedIn] = useState(false);
const [names, setNames] = useState([]);
const navRef = useRef(null);

useEffect(() => {
// Focus on mount
if (navRef.current) {
navRef.current.focus();
}
}, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          const userData = userDocSnapshot.data();
          if (userData) {
            setNames(userData.names || []);
            setIsAdmin(userData.isAdmin || false);
          } else {
            setNames([]);
            setIsAdmin(false);
          }
          // Check if the user is signed in
  
          setIsSignedIn(true);
  
    
        } catch (error) {
          // Handle errors here
        }
      } else {
        setIsSignedIn(false);
        setNames([]);
      }
    });
    return () => unsubscribe();
  }, []);

const activeStyle = ({ isActive }) => ({
backgroundColor: isActive ? 'blue' : '',
color: isActive ? 'white' : '',
padding: '1rem',
textDecoration: 'none'
})

const openSidenav = () => {setIsOpen(true);};
const closeSidenav = () => {setIsOpen(false);};
return (
<>
{/* navbar starts here */}
<nav ref={navRef} tabIndex={-1} className="navbar" id="top-navbar">
<div className="logo">
<NavLink to="/"><img src={navlogo} alt="Logo" /></NavLink>
</div>

<form className='nav-search-form' action="">
<input className='nav-search' placeholder='Search Gulime' type="text" />
<input className='nav-search-btn' type="submit" value="Search" />
</form>

<ul className="navlinks">
<NavLink to="/" style={activeStyle}>Home</NavLink>
<NavLink to="/technology" style={activeStyle}>Electronics</NavLink>
<NavLink to="/sports" style={activeStyle}>Sports</NavLink>
<NavLink to="/music" style={activeStyle}>Music</NavLink>
<NavLink to="/fashion" style={activeStyle}>Fashion</NavLink>
<NavLink to="/movies" style={activeStyle}>Movies</NavLink>
{isSignedIn ? (
<NavLink to="/profile" style={activeStyle}>Profile</NavLink>
) : (
<NavLink to="/login" style={activeStyle}>Login</NavLink>
)}
<NavLink to="/signup" style={activeStyle}>Sign Up</NavLink>
<HiOutlineShoppingCart color='#fff' size={30}/> 
</ul>

<div className="burger">
<a href="#!" onClick={openSidenav}>&#9776;</a>
</div>
</nav>
{/* navbar stops here */}

{/* sidenav starts here */}
<div id="sideNav" className={`sidenav ${isOpen ? 'open' : ''}`}>
<div className="closebtn">
<a href="#!" onClick={closeSidenav}>&#10005;</a>
</div>

<NavLink to="/" className="sidenav-headline" onClick={closeSidenav}>
<img src={navlogo} alt="logo" />
</NavLink>

<div style={{display:'flex',justifyContent:'center',alignItems:'center'}} className='sidenav-seperator'>{isSignedIn ? (
<NavLink to="/profile" style={activeStyle}>Profile</NavLink>
) : (
<NavLink to="../auth/Login.jsx" style={activeStyle}>Login</NavLink>
)}
<NavLink to="../auth/Signup.jsx" style={activeStyle}>Sign Up</NavLink>
<HiOutlineShoppingCart  color='#fff' size={30}/> 
</div>

<ul>
<li className="sidenav-seperator">
<NavLink to="/" onClick={closeSidenav}>
Home
</NavLink>
</li>

<li className="sidenav-seperator">  
<NavLink to="/technology" onClick={closeSidenav}>
Electronics
</NavLink>
</li>
          

<li className="sidenav-seperator">
<NavLink to="/sports" onClick={closeSidenav}>
Sports
</NavLink>
</li>

<li className="sidenav-seperator">
<NavLink to="/music" onClick={closeSidenav}>
Music
</NavLink>
</li>

<li className="sidenav-seperator">
<NavLink to="/fashion" onClick={closeSidenav}>
Fashion
</NavLink>
</li>

<li className="sidenav-seperator">
<NavLink to="/movies" onClick={closeSidenav}>
Movies
</NavLink>
</li>     

  

  
</ul>
</div>
{/* sidenav stops here */}
</>
  )
}
