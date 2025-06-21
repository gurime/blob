import { Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import About from "./components/About"
import Contact from "./components/Contact"
import NoPage from "./components/NoPage"
import Faq from "./components/FAQ"
import Help from "./components/Help"
import Terms from "./components/Terms"
import Privacy from "./components/Privacy"
import Cookie from "./components/Cookie"
import Details from "./components/Details"
import CategoryPage from "./components/CategoryPage"
import Signup from "./auth/Signup"
import Login from "./auth/Login"
import Profile from "./auth/Profile"
import Cart from "./components/Cart"
import ShippingInfo from "./components/ShippingInfo"
import Returns from "./components/Returns"
import Careers from "./components/Careers"
import Press from "./components/Press"
import Investor from "./components/Investor"
import Sustainablility from "./components/Sustainablility"
import NewsLetter from "./components/NewsLetter"
import BlogDetails from "./components/BlogDetails"
import Blogdmin from "./Admin/Blogdmin"
import CheckOut from "./components/CheckOut"

function App() {
return (
<>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/product/:id" element={<Details />} />
<Route path="/blog/:id" element={<BlogDetails />} />
<Route path='/checkout/:id' element={<CheckOut />} />
{/* Specific category routes - these need to come BEFORE generic routes */}
<Route path="/electronics" element={<CategoryPage />} />
<Route path="/electronics/:subcategory" element={<CategoryPage />} />
<Route path="/electronics/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/books" element={<CategoryPage />} />
<Route path="/books/:subcategory" element={<CategoryPage />} />
<Route path="/books/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/automotive" element={<CategoryPage />} />
<Route path="/automotive/:subcategory" element={<CategoryPage />} />
<Route path="/automotive/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/toys" element={<CategoryPage />} />
<Route path="/toys/:subcategory" element={<CategoryPage />} />
<Route path="/toys/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/appliances" element={<CategoryPage />} />
<Route path="/appliances/:subcategory" element={<CategoryPage />} />
<Route path="/appliances/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/home" element={<CategoryPage />} />
<Route path="/home/:subcategory" element={<CategoryPage />} />
<Route path="/home/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/office" element={<CategoryPage />} />
<Route path="/office/:subcategory" element={<CategoryPage />} />
<Route path="/office/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/health" element={<CategoryPage />} />
<Route path="/health/:subcategory" element={<CategoryPage />} />
<Route path="/health/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/grocery" element={<CategoryPage />} />
<Route path="/grocery/:subcategory" element={<CategoryPage />} />
<Route path="/grocery/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/pets" element={<CategoryPage />} />
<Route path="/pets/:subcategory" element={<CategoryPage />} />
<Route path="/pets/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/baby" element={<CategoryPage />} />
<Route path="/baby/:subcategory" element={<CategoryPage />} />
<Route path="/baby/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/furniture" element={<CategoryPage />} />
<Route path="/furniture/:subcategory" element={<CategoryPage />} />
<Route path="/furniture/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/garden" element={<CategoryPage />} />
<Route path="/garden/:subcategory" element={<CategoryPage />} />
<Route path="/garden/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/sports" element={<CategoryPage />} />
<Route path="/sports/:subcategory" element={<CategoryPage />} />
<Route path="/sports/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/fashion" element={<CategoryPage />} />
<Route path="/fashion/:subcategory" element={<CategoryPage />} />
<Route path="/fashion/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/music" element={<CategoryPage />} />
<Route path="/music/:subcategory" element={<CategoryPage />} />
<Route path="/music/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/games" element={<CategoryPage />} />
<Route path="/games/:subcategory" element={<CategoryPage />} />
<Route path="/games/:subcategory/:subsubcategory" element={<CategoryPage />} />

<Route path="/category/:category" element={<CategoryPage />} />
<Route path="/category/:category/:subcategory" element={<CategoryPage />} />
<Route path="/category/:category/:subcategory/:subsubcategory" element={<CategoryPage />} />



{/* Other routes */}
<Route path="/newsletter" element={<NewsLetter/>}/>
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/faq" element={<Faq />} />
<Route path="/shippinginfo" element={<ShippingInfo/>}/>
<Route path="/returns" element={<Returns/>}/>
<Route path="/help" element={<Help />} />
<Route path="/terms" element={<Terms />} />
<Route path="/careers" element={<Careers/>}/>
<Route path="/investors" element={<Investor/>}/>
<Route path="/sustainability" element={<Sustainablility/>}/>
<Route path="/press" element={<Press/>}/>
<Route path="/privacy" element={<Privacy />} />
<Route path="/cookie" element={<Cookie />} />
<Route path="/signup" element={<Signup />} />
<Route path="/login" element={<Login />} />
<Route path="/profile" element={<Profile />} />
<Route path="/BlogAdmin" element={<Blogdmin/>}/>
<Route path="/cart" element={<Cart />} />

{/* Catch all route */}
<Route path="*" element={<NoPage />} />
</Routes>
</>
)
}

export default App