import { Link, NavLink, useNavigate } from 'react-router-dom';
import navlogo from '../img/gulime.png';
import navlogos from '../img/gulime_g.png'
export default function Footer() {
   const navigate = useNavigate();

const scrollToTopNav = () => {
const nav = document.getElementById('top-navbar');
if (nav) nav.scrollIntoView({ behavior: 'smooth' });
};

const activeStyle = ({ isActive }) => ({
backgroundColor: isActive ? 'blue' : '',
color: isActive ? 'white' : '',
textDecoration: 'none'
})
return (
<>
<footer className="footer">


<div className="flex-footer">
<div className="footer-tablebox"> 
<div className="footer-headline">Make Money With Us</div>
<ul className="footer-navlink">
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text </Link></li>
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text</Link></li>
</ul>
</div>
{/*first tablebox stops here*/}
<div className="footer-tablebox"> 
<div className="footer-headline">text</div>
<ul className="footer-navlink">
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text </Link></li>
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text</Link></li>
</ul>
</div>
{/*seconds tablebox stops here*/}
<div className="footer-tablebox"> 
<div className="footer-headline">text</div>
<ul className="footer-navlink">
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text </Link></li>
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text</Link></li>
</ul>
</div>
{/*third tablebox stops here*/}
<div className="footer-tablebox" style={{borderRight:'none' ,borderBottom:'none'}}> 
<div className="footer-headline">text</div>
<ul className="footer-navlink">
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text </Link></li>
<li><Link to="#!">text</Link></li>
<li><Link to="#!">text</Link></li>
</ul>
</div>
{/*fourth tablebox stops here*/}


</div>
<hr style={{color:'#fff',border:'solid 1px'}}/>

<div  className="nav logo-footer">
<img  title='Home Page' style={{marginRight:'auto '}} onClick={() => navigate('/')} src={navlogo}  alt='...'  />






<div className="navlinks sm-navlink" >
<NavLink to='/contact' style={activeStyle} > Contact Us</NavLink>
<NavLink to='/about' style={activeStyle}>About Us</NavLink>
<NavLink to='/help' style={activeStyle}>Help</NavLink>
<NavLink to='/faq' style={activeStyle}>FAQ</NavLink> 
<NavLink  to='/terms' style={activeStyle}> Terms of Use</NavLink> 
<NavLink  to='/privacy' style={activeStyle}>Privacy Policies</NavLink>

<NavLink style={activeStyle}  to='/cookie'>Cookie Policies</NavLink>


</div>
</div>
<hr />
<div style={{
color:'#fff',
padding:'1rem 0',
textAlign:'center'
}}>
   &#169;2030 Gulime, LLC All Rights Reserved <br />

</div>
<hr />

<div style={{
color:'#fff',
padding:'1rem 0',
textAlign:'center'
}}>
   <br />
    This material may not be published, broadcast, rewritten, or redistributed. 
</div>


<div className="footer-logo-box">

<img title='To Top'  onClick={scrollToTopNav}  src={navlogos} alt="..."     />

</div>
</footer>



</>
)
}
