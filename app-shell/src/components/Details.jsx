import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ClipLoader from "react-spinners/ClipLoader";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../db/firebase";


export default function Details() {   
  const { id, collection: collectionParam } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Define all possible collections
                const collections = ['products', 'featuredProducts', 'Technology', 'featuredTechnology'];
                let productData = null;
                let foundCollection = null;

                // If collection is specified in URL, try that first
                if (collectionParam && collections.includes(collectionParam)) {
                    const docRef = doc(db, collectionParam, id);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        productData = { 
                            id: docSnap.id, 
                            ...docSnap.data()
                        };
                        foundCollection = collectionParam;
                    }
                }

                // If not found in specified collection, try all collections
                if (!productData) {
                    for (const collection of collections) {
                        const docRef = doc(db, collection, id);
                        const docSnap = await getDoc(docRef);
                        
                        if (docSnap.exists()) {
                            productData = { 
                                id: docSnap.id, 
                                ...docSnap.data()
                            };
                            foundCollection = collection;
                            break;
                        }
                    }
                }

                if (productData) {
                    // Add collection info without overwriting URL param
                    productData.sourceCollection = foundCollection;
                    setProduct(productData);
                } else {
                    setError('Product not found in any collection');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(`Error fetching product: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        } else {
            setError('No product ID provided');
            setLoading(false);
        }
    }, [id, collectionParam]);
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
                {/* Debug info - remove in production */}
                <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666' }}>
                    <p>Product ID: {id}</p>
                    <p>Collection: {collectionParam || 'auto-detected'}</p>
                    <p>Source Collection: {product.sourceCollection}</p>
                </div>
            </div>
            <Footer />
    </>
  );
}
