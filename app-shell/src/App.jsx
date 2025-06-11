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
        
        {/* Specific category routes - these need to come BEFORE generic routes */}
        <Route path="/books" element={<CategoryPage />} />
        <Route path="/books/:subcategory" element={<CategoryPage />} />
        <Route path="/books/:subcategory/:subsubcategory" element={<CategoryPage />} />
        
        <Route path="/automotive" element={<CategoryPage />} />
        <Route path="/automotive/:subcategory" element={<CategoryPage />} />
        <Route path="/automotive/:subcategory/:subsubcategory" element={<CategoryPage />} />
        
        <Route path="/toys" element={<CategoryPage />} />
        <Route path="/toys/:subcategory" element={<CategoryPage />} />
        <Route path="/toys/:subcategory/:subsubcategory" element={<CategoryPage />} />
        
        <Route path="/home-appliances" element={<CategoryPage />} />
        <Route path="/home-appliances/:subcategory" element={<CategoryPage />} />
        <Route path="/home-appliances/:subcategory/:subsubcategory" element={<CategoryPage />} />
        
        <Route path="/health-beauty" element={<CategoryPage />} />
        <Route path="/health-beauty/:subcategory" element={<CategoryPage />} />
        <Route path="/health-beauty/:subcategory/:subsubcategory" element={<CategoryPage />} />
        
        <Route path="/grocery" element={<CategoryPage />} />
        <Route path="/grocery/:subcategory" element={<CategoryPage />} />
        <Route path="/grocery/:subcategory/:subsubcategory" element={<CategoryPage />} />
        
        <Route path="/pet-supplies" element={<CategoryPage />} />
        <Route path="/pet-supplies/:subcategory" element={<CategoryPage />} />
        <Route path="/pet-supplies/:subcategory/:subsubcategory" element={<CategoryPage />} />
        
        <Route path="/baby-products" element={<CategoryPage />} />
        <Route path="/baby-products/:subcategory" element={<CategoryPage />} />
        <Route path="/baby-products/:subcategory/:subsubcategory" element={<CategoryPage />} />
        
        <Route path="/furniture" element={<CategoryPage />} />
        <Route path="/furniture/:subcategory" element={<CategoryPage />} />
        <Route path="/furniture/:subcategory/:subsubcategory" element={<CategoryPage />} />
        
        <Route path="/garden-outdoor" element={<CategoryPage />} />
        <Route path="/garden-outdoor/:subcategory" element={<CategoryPage />} />
        <Route path="/garden-outdoor/:subcategory/:subsubcategory" element={<CategoryPage />} />
        
        {/* Generic category routes - these come AFTER specific routes */}
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
        <Route path="/category/:category/:subcategory/:subsubcategory" element={<CategoryPage />} />
        
        {/* Other routes */}
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
        
        {/* Catch all route */}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </>
  )
}

export default App