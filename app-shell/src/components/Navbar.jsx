/* eslint-disable no-unused-vars */
import { Link, NavLink, useNavigate } from 'react-router-dom'
import navlogo from '../img/gulime.png'
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, CircleUserRound, Settings, ShoppingBag, ShoppingCart } from 'lucide-react';
import { auth } from '../db/firebase';
// Add these imports for Firestore
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import gpremium from '../img/gulimepremium2.png';
import { db } from '../db/firebase'; // Make sure db is exported from your firebase config

export default function Navbar() {

const [isOpen, setIsOpen] = useState(false);
const [isSignedIn, setIsSignedIn] = useState(false);
const [names, setNames] = useState('');
const [cartCount, setCartCount] = useState(0);

// Add search state variables
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [showSearchResults, setShowSearchResults] = useState(false);
const searchRef = useRef(null);

useEffect(() => {
  let unsubscribe;

  if (isSignedIn) {
    const user = auth.currentUser;

    if (user) {
      const cartDocRef = doc(db, 'carts', user.uid);

      unsubscribe = onSnapshot(cartDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const items = data.items || [];
          setCartCount(items.length);
        } else {
          setCartCount(0);
        }
      }, (error) => {
        console.error("Error fetching cart in Navbar:", error);
        setCartCount(0);
      });
    }
  }

  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [isSignedIn]);

const navRef = useRef(null);
const navigate = useNavigate();

useEffect(() => {
  // Focus on mount
  if (navRef.current) {
    navRef.current.focus();
  }
}, []);

// Close search results when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchResults(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
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
          const fullName = `${userData.fname || ''} `.trim();
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

const handleSearch = async (e) => {
  e.preventDefault();
  if (!searchTerm.trim()) return;
  await performSearch(searchTerm);
};

const handleSearchInputChange = async (e) => {
  const value = e.target.value;
  setSearchTerm(value);

  if (value.trim().length > 2) {
    await performSearch(value);
  } else {
    setSearchResults([]);
    setShowSearchResults(false);
  }
};

const performSearch = async (searchQuery) => {
  if (!searchQuery.trim()) return;

  try {
    const searchLower = searchQuery.toLowerCase();
    const collections = ['products', 'categories','automotive']; // Add your collection names
    
    const searchPromises = collections.map(async (collectionName) => {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        collection: collectionName,
        ...doc.data()
      })).filter(item => {
        const searchFields = [
          item.product_name || item.name || '',
          item.brand || '',
          item.category || '',
          item.description || ''
        ];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchLower)
        );
      });
    });

    const allResults = await Promise.all(searchPromises);
    const filteredResults = allResults.flat();
    
    setSearchResults(filteredResults);
    setShowSearchResults(true);
  } catch (error) {
    console.error("Search error:", error);
  }
};

const handleProductClick = (productId) => {
  setShowSearchResults(false);
  setSearchTerm('');
  navigate(`/product/${productId}`);
};

const openSidenav = () => {setIsOpen(true);};
const closeSidenav = () => {setIsOpen(false);};

return (
<>
{/* navbar starts here */}
<nav ref={navRef} tabIndex={-1} className="navbar" id="top-navbar">
<div className="logo">
<Link to="/">
{isSignedIn ? (  
<img src={gpremium} alt="" />
) : (
<img src={navlogo} alt="Logo"/>  
)}
</Link>
</div>

<div className="search-container" ref={searchRef}>
  <form className="nav-search-form" onSubmit={handleSearch}>
    <input
      className="nav-search"
      placeholder="Search Gulime"
      type="text"
      value={searchTerm}
      onChange={handleSearchInputChange}
      onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
    />
    <input className="nav-search-btn" type="submit" value="Search" />
  </form>

  {/* Search Results Dropdown */}
  {showSearchResults && searchResults.length > 0 && (
    <div className="search-dropdown">
      {searchResults.slice(0, 8).map((product) => (
        <div 
          key={product.id} 
          className="search-result-item"
          onClick={() => handleProductClick(product.id)}
        >
          <div className="search-result-image">
            {product.imgUrl && (
              <img  src={`/assets/images/${product.imgUrl}`}  alt={product.product_name} />
            )}
          </div>
          <div className="search-result-info">
            <div className="search-result-name">
              {product.product_name || 'Unnamed Product'}
            </div>
            <div className="search-result-price">
              ${product.price ? Number(product.price).toLocaleString(2) : 'N/A'}
            </div>
            {product.brand && (
              <div className="search-result-brand">{product.brand}</div>
            )}
          </div>
        </div>
      ))}
      {searchResults.length > 8 && (
        <div className="search-result-more">
          View all {searchResults.length} results
        </div>
      )}
    </div>
  )}

  {/* No Results Message */}
  {showSearchResults && searchResults.length === 0 && searchTerm.length > 2 && (
    <div className="search-dropdown">
      <div className="search-no-results">
        No products found for &quot;{searchTerm}&quot;
      </div>
    </div>
  )}
</div>

<ul className="navlinks">
  {isSignedIn ? (
    <>
<li className="account-lists">
  <div className="profile-wrapper">
    <span className="profile-top">Hello, {names}</span>
    <span className="profile-bottom">
      Account & Lists <ChevronDown size={12} style={{ marginLeft: 4 }} />
    </span>

    {/* Dropdown */}
    <div className="account-dropdown">
<Link style={{color:'#000'}} to="/profile?tab=account"className="dropdown-link">
<div style={{display:'flex',alignItems:'center'}}><CircleUserRound style={{padding: '0 5px 0px 0'}}/>Your Account</div>
</Link>

<div style={{display:'flex',alignItems:'center'}}>  
<Link style={{color:'#000'}} to="/profile?tab=orders" className="dropdown-link">  <ShoppingBag style={{padding: '0 5px 0px 0'}}/>
Your Orders</Link>
</div>
   
<div style={{display:'flex',alignItems:'center'}}>  
<Link style={{color:'#000'}} to="/profile?tab=cookies" className="dropdown-link">  <Settings style={{padding: '0 5px 0px 0'}}/>
Cookie Settings</Link>
</div>
   
      <button onClick={handleLogout} className="dropdown-link logout-btn">Logout</button>
    </div>
  </div>
</li>

  <li>
    <Link to="/cart" className="cart-link">
      <ShoppingCart color="#fff" size={30} />
      {cartCount > 0 && (
        <span className="cart-badge">{cartCount}</span>
      )}
    </Link>
  </li>
    
    </>
  ) : (
    <>
      <li>
        <Link className="profilecss" to="/login">
          Login
        </Link>
      </li>
      <li>
        <Link className="profilecss" to="/signup">
          Sign Up
        </Link>
      </li>
    </>
  )}
</ul>

{/* <div className="burger">
<a href="#!" onClick={openSidenav}>&#9776;</a>
</div> */}
</nav>
{/* navbar stops here */}

{/* sidenav starts here */}
<div id="sideNav" className={`sidenav ${isOpen ? 'open' : ''}`}>
<div className="closebtn">
<a href="#!" onClick={closeSidenav}>&#10005;</a>
</div>

<Link to="/" className="sidenav-headline" onClick={closeSidenav}>
<img src={navlogo} alt="logo" />
</Link>

<div style={{display:'flex',justifyContent:'center',alignItems:'center'}} className='sidenav-seperator'>
{isSignedIn ? (
<>
<Link to="/profile">{names || 'Profile'}</Link>
<button className='signout' onClick={handleLogout}>Logout</button>
</>
) : (
<Link to="/login">Login</Link>
)}
{!isSignedIn && (
<Link to="/signup">Sign Up</Link>
)}
<Link to='/cart' className='cart-link'>
<ShoppingCart color='#fff' size={30} />
{cartCount > 0 && (
<span className='cart-badge'>
{cartCount}
</span>
)}
</Link>
</div>

</div>
{/* sidenav stops here */}
</>
  )
}