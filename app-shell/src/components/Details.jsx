import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ClipLoader from "react-spinners/ClipLoader";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../db/firebase";

export default function Details() {   
  const params = useParams();
  console.log('All params:', params);
  
  let { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const collections = ['products', 'featuredProducts', 'Technology', 'featuredTechnology'];
        let productData = null;
        let foundCollection = null;

      
        
        if (!id || id === 'undefined' || id === undefined) {
          setError('No valid product ID provided. Check your Link component - it\'s passing undefined.');
          setLoading(false);
          return;
        }

        // Decode the URL parameter (handles spaces and special characters)
        const decodedId = decodeURIComponent(id);

        // Search through all collections
        for (const collectionName of collections) {
          const searchResult = await searchInCollection(collectionName, decodedId);
          if (searchResult) {
            productData = searchResult;
            foundCollection = collectionName;
            break;
          }
        }

        if (productData) {
          productData.sourceCollection = foundCollection;
          setProduct(productData);
        } else {
          setError(`Product "${decodedId}" not found in any collection`);
        }
      } catch (error) {
        setError(`Error fetching product: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Function to search in a specific collection
    const searchInCollection = async (collectionName, searchTerm) => {
      try {
        const collectionRef = collection(db, collectionName);
        
        // Get all documents and search through them
        const querySnapshot = await getDocs(collectionRef);
        
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          
          // Check if any field matches the search term
          if (
            data.product_name === searchTerm ||
            data.name === searchTerm ||
            data.title === searchTerm ||
            // Check if document ID matches (for backwards compatibility)
            doc.id === searchTerm
          ) {
            return {
              id: doc.id, // This will be the actual Firestore document ID
              ...data
            };
          }
        }
        
        return null;
      } catch (error) {
        return null;
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError('No product ID provided');
      setLoading(false);
    }
  }, [id]);

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
        <div className="error-message">Error: {error}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="product-details" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>{product.product_name || product.name || 'Product Name'}</h1>
        {product.imgUrl && (
          <img 
            src={`/assets/images/${product.imgUrl}`} 
            alt={product.product_name || product.name || 'Product'} 
            style={{ maxWidth: '100%', height: 'auto' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/images/placeholder.png';
            }}
          />
        )}
        <p>{product.description}</p>
        {product.price && <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${product.price}</p>}
        <button style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: '#2637be', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add to Cart
        </button>
   
      </div>
      <Footer />
    </>
  );
}