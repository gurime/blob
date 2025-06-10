import { NavLink } from "react-router-dom";

export default function SecNav() {
    const activeStyle = ({ isActive }) => ({
backgroundColor: isActive ? 'blue' : '',
color: isActive ? 'white' : '',
padding: '1rem',
textDecoration: 'none'
})
    return (
<>
<nav  className="navbar secnav">
<ul className="navlinks secnavlinks">
<NavLink  style={activeStyle} to="/books">
Books
</NavLink>
<NavLink  style={activeStyle} to="/toys" >
Toys
</NavLink>
<NavLink  style={activeStyle} to="/home-appliances" >
Home Appliances
</NavLink>
<NavLink  style={activeStyle} to="/health-beauty">
Health & Beauty
</NavLink>
<NavLink  style={activeStyle} to="/automotive">
Automotive
</NavLink>
<NavLink  style={activeStyle} to="/grocery">
Grocery
</NavLink>
<NavLink  style={activeStyle} to="/pet-supplies">
Pet Supplies
</NavLink>
<NavLink  style={activeStyle} to="/baby-products">
Baby Products
</NavLink>
<NavLink  style={activeStyle} to="/furniture" >
Furniture
</NavLink>
<NavLink  style={activeStyle} to="/garden-outdoor">
Garden & Outdoor
</NavLink>
</ul>
</nav>
</>  
    );
}