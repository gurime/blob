import { Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import About from "./components/About"
import Contact from "./components/Contact"
import NoPage from "./components/NoPage"
import PostDetail from "./Details/PostDetails"
import CreatePost from "./components/CreatePost"


function App() {

  return (
    <>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/post/:postId" element={<PostDetail />} /> 
        <Route path="/create-post" element={<CreatePost />} /> 
        <Route path="*" element={<NoPage />} />

      </Routes>
    

    </>
  )
}

export default App
