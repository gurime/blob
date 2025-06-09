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


function App() {

  return (
<>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/product/:id" element={<Details />} />
<Route path="/category/:categoryName" element={<CategoryPage />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/faq" element={<Faq />} /> 
<Route path="/help" element={<Help />} />
<Route path="/terms" element={<Terms />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/cookie" element={<Cookie />} />
<Route path="/signup" element={<Signup />} />
<Route path="/login" element={<Login />} />
<Route path="/profile" element={<Profile />} />
<Route path="/cart" element={<Cart />} />
{/* <Route path="/checkout" element={<Checkout />} />
<Route path="/orders" element={<Orders />} />
<Route path="/wishlist" element={<Wishlist />} />
<Route path="/search" element={<Search />} /> */}
<Route path="*" element={<NoPage />} />
</Routes>
</>
)
}

export default App
