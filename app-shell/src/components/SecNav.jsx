/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Footer from './Footer';

export default function SecNav() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const dropdownRef = useRef(null);
  const moreButtonRef = useRef(null);
  const activeStyle = ({ isActive }) => ({
    backgroundColor: isActive ? 'blue' : '',
    color: isActive ? 'white' : '',
  });

  const dropdownData = {
    books: ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Biography'],
    toys: ['Action Figures', 'Board Games', 'Educational', 'Outdoor Toys', 'Puzzles'],
    automotive: ['Electric', 'SUV', 'Vans', 'Sedans', 'Trucks', 'Parts & Accessories'],
    grocery: ['Fresh Produce', 'Dairy', 'Meat', 'Beverages', 'Snacks', 'Frozen Foods'],
    appliances: ['Small Appliances', 'Refrigeration', 'Air Conditioning', 'Laundry'],
    'pet-supplies': ['Dog Supplies', 'Cat Supplies', 'Fish & Aquatic', 'Birds', 'Small Animals', 'Reptiles'],
    'baby-products': ['Feeding', 'Diapers', 'Toys', 'Clothing', 'Safety', 'Strollers'],
    pets: ['Dog Supplies', 'Cat Supplies', 'Birds', 'Fish & Aquatic', 'Small Animals'],
    garden: ['Gardening Tools', 'Outdoor Furniture', 'Grilling', 'Lawn Care'],
    baby: ['Diapers', 'Feeding', 'Toys', 'Clothing', 'Strollers'],
    furniture: ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor', 'Storage'],
    'garden-outdoor': ['Gardening Tools', 'Plants', 'Outdoor Furniture', 'Grilling', 'Lawn Care', 'Patio'],
    music: ['Instruments', 'Vinyl Records', 'CDs', 'Music Accessories', 'Audio Equipment'],
    electronics: ['HeadPhones & Ear buds', 'Mobile Phones', 'Laptops', 'Tablets', 'Cameras', 'Wearables', 'Audio & Video'],
    sports: ['Fitness Equipment', 'Team Sports', 'Camping & Hiking', 'Cycling'],
    office: ['Stationery', 'Printers', 'Office Furniture', 'School Supplies'],
    games: ['Playstation', 'Xbox', 'PC', 'Handhelds', 'Video Games', 'Accessories'],
  };

  const handleDropdownToggle = (category, event) => {
    event.preventDefault();
    setOpenDropdown(openDropdown === category ? null : category);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const handleSubItemClick = () => {
    closeDropdown();
  };

  const toggleFooter = (event) => {
    event.preventDefault();
    setIsFooterVisible(!isFooterVisible);
  };

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Close dropdown if clicking outside
      if (openDropdown) {
        closeDropdown();
      }
      // Close footer if clicking outside AND footer is visible
      // BUT NOT if clicking on the footer itself or the More button
      if (isFooterVisible && 
          !event.target.closest('.more-button') && 
          !event.target.closest('.footer-container')) {
        setIsFooterVisible(false);
      }
    }
  };
   
  document.addEventListener('mousedown', handleClickOutside);
   
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [openDropdown, isFooterVisible]);
  const navItems = [ 
    { to: '/electronics', label: 'Electronics', key: 'electronics' },
    { to: '/books', label: 'Books', key: 'books' },
    { to: '/toys', label: 'Toys', key: 'toys' },
    { to: '/grocery', label: 'Grocery', key: 'grocery' },
    { to: '/furniture', label: 'Furniture', key: 'furniture' },
    { to: '/appliances', label: 'Appliances', key: 'appliances' },
    { to: '/automotive', label: 'Automotive', key: 'automotive' },
    { to: '/baby', label: 'Baby', key: 'baby' },
    { to: '/pets', label: 'Pet Supplies', key: 'pets' },
    { to: '/garden', label: 'Garden & Outdoor', key: 'garden' },
    { to: '/sports', label: 'Sports & Outdoors', key: 'sports' },
    { to: '/office', label: 'Office & School Supplies', key: 'office' },
    { to: '/music', label: 'Music', key: 'music' },
    { to: '/games', label: 'Video Games', key: 'games' },
  ];

  return (
    <>
      <nav style={{
        background: "linear-gradient(135deg, rgb(99, 116, 196) 0%, rgb(99, 116, 196) 100%)"
      }} className="navbar secnav" ref={dropdownRef}>
        <ul className="navlinks secnavlinks">
          {navItems.map((item) => (
            <li key={item.key} className="nav-item">
              <NavLink
                className={`nav-link ${openDropdown === item.key ? 'active-dropdown' : ''}`}
                style={activeStyle}
                to={item.to}
                onClick={(e) => handleDropdownToggle(item.key, e)}
              >
                {item.label}
                <span className="dropdown-arrow">▼</span>
              </NavLink>
              
              {openDropdown === item.key && (
                <div className="dropdown-menu">
                  {dropdownData[item.key]?.map((subItem, index) => (
                    <NavLink
                      key={index}
                      className="dropdown-item"
                      to={`${item.to}/${subItem.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                      onClick={handleSubItemClick}
                    >
                      {subItem}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          ))}
          <NavLink onClick={toggleFooter} className="nav-link more-button">
  More {isFooterVisible ? '▲' : '▼'}
</NavLink> 
        </ul>  
        
      </nav>  
      
 
      
      {isFooterVisible && (
        <div className="footer-container">
          <Footer />
        </div>
      )}
    </>
  );
}
