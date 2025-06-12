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
    toys: ['Action Figures', 'Board Games', 'Educational', 'Outdoor Toys', 'Puzzles', 'Electronic Toys'],
    'home-appliances': ['Kitchen', 'Laundry', 'Cleaning', 'Small Appliances', 'Refrigeration', 'Air Conditioning'],
    'health-beauty': ['Skincare', 'Makeup', 'Hair Care', 'Personal Care', 'Vitamins', 'Fitness', 'Fragrances', 'Oral Care', 'Grooming', 'Men\'s Grooming', 'Women\'s Grooming', 'Health Supplements', 'Medical Supplies','womens clothing', 'mens clothing'],
    automotive: ['Electric', 'SUV', 'Vans', 'Sedans', 'Trucks', 'Parts & Accessories'],
    grocery: ['Fresh Produce', 'Dairy', 'Meat', 'Beverages', 'Snacks', 'Frozen Foods'],
    'pet-supplies': ['Dog Supplies', 'Cat Supplies', 'Fish & Aquatic', 'Birds', 'Small Animals', 'Reptiles'],
    'baby-products': ['Feeding', 'Diapers', 'Toys', 'Clothing', 'Safety', 'Strollers'],
    furniture: ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor', 'Storage'],
    'garden-outdoor': ['Gardening Tools', 'Plants', 'Outdoor Furniture', 'Grilling', 'Lawn Care', 'Patio'],
    music:['Instruments', 'Vinyl Records', 'CDs', 'Music Accessories', 'Sheet Music', 'Audio Equipment'],
    electronics: ['Mobile Phones', 'Laptops', 'Tablets', 'Cameras', 'Audio & Video', 'Wearables'],
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
    { to: '/books', label: 'Books', key: 'books' },
    { to: '/toys', label: 'Toys', key: 'toys' },
    { to: '/home-appliances', label: 'Home Appliances', key: 'home-appliances' },
    { to: '/health-beauty', label: 'Health & Beauty', key: 'health-beauty' },
    { to: '/automotive', label: 'Automotive', key: 'automotive' },
    { to: '/grocery', label: 'Grocery', key: 'grocery' },
    { to: '/pet-supplies', label: 'Pet Supplies', key: 'pet-supplies' },
    { to: '/baby-products', label: 'Baby Products', key: 'baby-products' },
    { to: '/furniture', label: 'Furniture', key: 'furniture' },
    { to: '/garden-outdoor', label: 'Garden & Outdoor', key: 'garden-outdoor' },
    { to: '/music', label: 'Music', key: 'music' },
    { to: '/electronics', label: 'Electronics', key: 'electronics' },
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