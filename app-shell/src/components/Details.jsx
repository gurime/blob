import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ClipLoader from "react-spinners/ClipLoader";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../db/firebase";


export default function Details() {   
    const { id, collection: collectionName } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Determine which collection to query based on the URL parameter
                const collections = ['products', 'featuredProducts', 'Technology', 'featuredTechnology'];
                let productData = null;

                // Try each collection until we find the document
                for (const collection of collections) {
                    const docRef = doc(db, collection, id);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        productData = { 
                            id: docSnap.id, 
                            ...docSnap.data(),
                            collection // Save which collection it came from
                        };
                        break;
                    }
                }

                if (productData) {
                    setProduct(productData);
                } else {
                    setError('Product not found in any collection');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, collectionName]);
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
        <div className="error-message ">Error: {error}</div>
        <Footer />
      </>
    );
  }


    return (
    <>
          <Navbar />
            <div className="product-details">
                <h1>{product.product_name}</h1>
                {product.imgUrl && (
                    <img 
                        src={`/assets/images/${product.imgUrl}`} 
                        alt={product.product_name} 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/images/placeholder.png';
                        }}
                    />
                )}
                <p>{product.description}</p>
                <p>${product.price}</p>
<button>Add to Cart</button>
            </div>
            <Footer />
    </>
  );
}