import { Link, NavLink, useNavigate } from 'react-router-dom'
import navlogo from '../img/gulime.png'
import { useEffect, useRef, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { auth } from '../db/firebase';
// Add these imports for Firestore
import { doc, getDoc } from 'firebase/firestore';
import gpremium from '../img/gulimepremium2.png';
import { db } from '../db/firebase'; // Make sure db is exported from your firebase config

export default function Navbar() {

const [isOpen, setIsOpen] = useState(false);
const [isSignedIn, setIsSignedIn] = useState(false);
const [names, setNames] = useState('');


const navRef = useRef(null);
const navigate = useNavigate();
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
          
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            // Get the full name from fname and lname
            const fullName = `${userData.fname || ''} ${userData.lname || ''}`.trim();
            setNames(fullName || userData.email || 'User');
          } else {
            setNames('User');
          }
          
          setIsSignedIn(true);
    
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsSignedIn(true); // Still signed in even if we can't fetch user data
          setNames('User');
        }
      } else {
        setIsSignedIn(false);
        setNames('');
      }
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
  try {
    await auth.signOut();
    setIsSignedIn(false);
    // setUserData(null);
    navigate('/');
  } catch (error) {
    // Optionally handle error here
    console.error("Logout error:", error);
  }
}

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
<NavLink to="/">
{isSignedIn ? (  
<img src={gpremium} alt="" />
) : (
<img src={navlogo} alt="Logo"/>  
)}
</NavLink>
</div>

<form className='nav-search-form' action="">
<input className='nav-search' placeholder='Search Gulime' type="text" />
<input className='nav-search-btn' type="submit" value="Search" />
</form>

<ul className="navlinks">
<NavLink to="/" style={activeStyle}>Home</NavLink>
<NavLink to="/technology" style={activeStyle}>Electronics</NavLink>
<NavLink to="/sports" style={activeStyle}>Sports</NavLink>
{isSignedIn ? (
<>
<NavLink to="/profile" style={activeStyle}>{names || 'Profile'}</NavLink>
<button className='signout' onClick={handleLogout}>Logout</button>
</>
) : (
<NavLink to="/login" style={activeStyle}>Login</NavLink>
)}
{!isSignedIn && (
<NavLink to="/signup" style={activeStyle}>Sign Up</NavLink>
)}
<Link to='/cart'><ShoppingCart color='#fff' size={30}/> </Link>
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

<div style={{display:'flex',justifyContent:'center',alignItems:'center'}} className='sidenav-seperator'>
{isSignedIn ? (
<>
<NavLink to="/profile" style={activeStyle}>{names || 'Profile'}</NavLink>
<button className='signout' onClick={handleLogout}>Logout</button>
</>
) : (
<NavLink to="/login" style={activeStyle}>Login</NavLink>
)}
{!isSignedIn && (
<NavLink to="/signup" style={activeStyle}>Sign Up</NavLink>
)}
<Link to='/cart'><ShoppingCart color='#fff' size={30}/> </Link>
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

</ul>
</div>
{/* sidenav stops here */}
</>
  )
}