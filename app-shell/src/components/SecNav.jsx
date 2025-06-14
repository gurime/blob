/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function SecNav() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const activeStyle = ({ isActive }) => ({
    backgroundColor: isActive ? 'blue' : '',
    color: isActive ? 'white' : '',
  });

  const dropdownData = {
    books: ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Biography'],
      fashion: ['Women\'s Clothing', 'Men\'s Clothing', 'Shoes', 'Watches', 'Accessories'],
        health: ['Skincare', 'Makeup', 'Hair Care', 'Vitamins', 'Personal Care', 'Medical Supplies'],
    toys: ['Action Figures', 'Board Games', 'Educational', 'Outdoor Toys', 'Puzzles'],
    automotive: ['Electric', 'SUV', 'Vans', 'Sedans', 'Trucks', 'Parts & Accessories'],
    grocery: ['Fresh Produce', 'Dairy', 'Meat', 'Beverages', 'Snacks', 'Frozen Foods'],
      appliances: ['Small Appliances', 'Refrigeration', 'Air Conditioning', 'Laundry'],
    'pet-supplies': ['Dog Supplies', 'Cat Supplies', 'Fish & Aquatic', 'Birds', 'Small Animals', 'Reptiles'],
    'baby-products': ['Feeding', 'Diapers', 'Toys', 'Clothing', 'Safety', 'Strollers'],
      pets: ['Dog Supplies', 'Cat Supplies', 'Birds', 'Fish & Aquatic', 'Small Animals'],
        garden: ['Gardening Tools', 'Outdoor Furniture', 'Grilling', 'Lawn Care'],
          baby: ['Diapers', 'Feeding', 'Toys', 'Clothing', 'Strollers'],
            home: ['Kitchen Essentials', 'Bedding & Bath', 'Lighting', 'Storage & Organization', 'Decor'],
    furniture: ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor', 'Storage'],
    'garden-outdoor': ['Gardening Tools', 'Plants', 'Outdoor Furniture', 'Grilling', 'Lawn Care', 'Patio'],
    music:['Instruments', 'Vinyl Records', 'CDs', 'Music Accessories', 'Audio Equipment'],
  electronics: ['Mobile Phones', 'Laptops', 'Tablets', 'Cameras', 'Wearables', 'Audio & Video'],
       sports: ['Fitness Equipment', 'Team Sports', 'Camping & Hiking', 'Cycling'],
  office: ['Stationery', 'Printers', 'Office Furniture', 'School Supplies'],
      games: ['Playstation','Xbox','PC','Handhelds', 'Video Games', 'Accessories'],
    
  };

  const handleDropdownToggle = (category, event) => {
    event.preventDefault();
    setOpenDropdown(openDropdown === category ? null : category);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const handleSubItemClick = (mainCategory, subItem) => {
    // Navigation will be handled by NavLink
    closeDropdown();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

const navItems = [ 
  { to: '/electronics', label: 'Electronics', key: 'electronics' },
  { to: '/fashion', label: 'Fashion', key: 'fashion' },
  { to: '/books', label: 'Books', key: 'books' },
  { to: '/toys', label: 'Toys', key: 'toys' },
  { to: '/grocery', label: 'Grocery', key: 'grocery' },
  { to: '/health', label: 'Health & Personal Care', key: 'health' },
  { to: '/home', label: 'Home & Living', key: 'home' },
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
    <nav className="navbar secnav" ref={dropdownRef}>
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
                    onClick={() => handleSubItemClick(item.to, subItem)}
                  >
                    {subItem}
                  </NavLink>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}