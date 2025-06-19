import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import ClipLoader from "react-spinners/ClipLoader";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import {  doc, getDoc } from "firebase/firestore";
import { db } from "../db/firebase";
import SecNav from "./SecNav";

export default function BlogDetails() {
 const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [blog,setBlog] = useState(null);
const navigate = useNavigate();
 let { id } = useParams();
 useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Fetch specific document by ID
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBlog({
            _id: docSnap.id,
            ...docSnap.data()
          });
        } else {
          setError("Blog not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    } else {
      setError("No blog ID provided");
      setLoading(false);
    }
  }, [id]); // Add id as dependency

if (loading) {
return (
<>
<Navbar />
<div className="loading"> 
<ClipLoader size={50} color="#2637be"/>
</div>
<Footer />
</>
);
}

if (error) {
return (
<>
<Navbar />
<div className="error-message">
<h2>Blog Not Found</h2>
<p>{error || "The requested blog could not be found."}</p>
<button onClick={() => navigate(-1)} className="no-page-button">← Go Back</button>
</div>
<Footer />
</>
);
}
  return (
    <>
<Navbar/>
<SecNav/>

  <div className="blog-details">
        <h1>{blog.title}</h1>
        <div className="blog-meta">
          {blog.date && <time className="blog-date">{blog.date}</time>}
          {blog.category && <span className="blog-category">{blog.category}</span>}
        </div>
        <div className="blog-content">
          {blog.excerpt && <p className="blog-excerpt">{blog.excerpt}</p>}
          {blog.content && <div className="blog-body">{blog.content}</div>}
        </div>
      </div>
<Footer/>
</>
)
}
