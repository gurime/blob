import { useNavigate } from 'react-router-dom';
import navlogo from '../img/Logo.png'
export default function Footer() {
   const navigate = useNavigate();
    
      const scrollTo = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    
return (
<>
<footer className="footer">


<div className="flex-footer">
<div className="footer-tablebox"> 
<div className="footer-headline">text</div>
<div className="footer-seperator"></div>
<ul className="footer-navlink">
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
<li><a className="#!" >text</a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text </a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
</ul>
</div>
{/*first tablebox stops here*/}
<div className="footer-tablebox"> 
<div className="footer-headline">text</div>
<div className="footer-seperator"></div>
<ul className="footer-navlink">
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text </a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
</ul>
</div>
{/*seconds tablebox stops here*/}
<div className="footer-tablebox"> 
<div className="footer-headline">text</div>
<div className="footer-seperator"></div>
<ul className="footer-navlink">
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text </a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
</ul>
</div>
{/*third tablebox stops here*/}
<div className="footer-tablebox" style={{borderRight:'none' ,borderBottom:'none'}}> 
<div className="footer-headline">text</div>
<div className="footer-seperator"></div>
<ul className="footer-navlink">
<li><a href="#!" >text</a></li>
<div className="footer-seperator"></div>
<li><a href="#!" >text</a></li>
<div className="footer-seperator"></div>
<li><a href="#!" >text </a></li>
<div className="footer-seperator"></div>
<li><a href="#!">text</a></li>
<div className="footer-seperator"></div>
<li><a href="#!" >text</a></li>
<div className="footer-seperator"></div>
</ul>
</div>
{/*fourth tablebox stops here*/}


</div>
<hr style={{color:'#fff',border:'solid 1px'}}/>

<div  className="nav logo-footer">
<img  title='Home Page' style={{marginRight:'auto '}} onClick={() => navigate.push('/')} src={navlogo}  alt='...'  />






<div className="navlinks sm-navlink" style={{flexWrap:'nowrap'}}>
<a to='/contact' >Contact text</a>

<a  to='/terms' >terms of Use</a>

<a  to='/privacy' >Privacy Policies </a>

<a style={{border:'none'}}  to='/cookie'>Cookie Policies</a>


</div>
</div>
<hr />
<div style={{
color:'#fff',
padding:'1rem 0',
textAlign:'center'
}}>
   &#169;2030 text, LLC All Rights Reserved <br />

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

<img title='To Top'  onClick={scrollTo}  src={navlogo} alt="..." />

</div>
</footer>



</>
)
}
