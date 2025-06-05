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


function App() {

  return (
<>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/product/:id" element={<Details />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/faq" element={<Faq />} /> 
<Route path="/help" element={<Help />} />
<Route path="/terms" element={<Terms />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/cookie" element={<Cookie />} />
<Route path="*" element={<NoPage />} />
</Routes>
</>
)
}

export default App
