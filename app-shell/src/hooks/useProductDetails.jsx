import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../db/firebase";

export const useProductDetails = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [configPrice, setConfigPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');

  // Helper function to format numbers with commas
  const formatPrice = useCallback((price) => {
  if (typeof price !== 'number' || isNaN(price)) return '0';
    return price.toLocaleString('en-US');
  }, []);

  // Function to search in a specific collection
  const searchInCollection = useCallback(async (collectionName, searchTerm) => {
    try {
      const collectionRef = collection(db, collectionName);
      
      // Get all documents and search through them
      const querySnapshot = await getDocs(collectionRef);
      
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        
        // Normalize search term and data for comparison
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        
        // Check if any field matches the search term
        const productName = (data.product_name || '').toLowerCase().trim();
        const name = (data.name || '').toLowerCase().trim();
        const title = (data.title || '').toLowerCase().trim();
        const docId = doc.id.toLowerCase().trim();
        
        if (
          productName === normalizedSearchTerm ||
          name === normalizedSearchTerm ||
          title === normalizedSearchTerm ||
          docId === normalizedSearchTerm ||
          // Also try exact matches without normalization in case of special characters
          data.product_name === searchTerm ||
          data.name === searchTerm ||
          data.title === searchTerm ||
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
  }, []);

  // Helper function to update price based on storage selection
  const handleStorageChange = useCallback((storageOption) => {
    setSelectedStorage(storageOption.size);
    const newConfigPrice = basePrice + (storageOption.price || 0);
    setConfigPrice(newConfigPrice);
  }, [basePrice]);

  // Helper function to handle quantity changes
  const handleQuantityChange = useCallback((newQuantity) => {
    setQuantity(newQuantity);
  }, []);

  // Helper function to get filtered product images
  const getProductImages = useCallback(() => {
    if (!product) return [];
    
    const rawImages = [
      product.imgUrl,
      product.imgUrl1,
      product.imgUrl2,
      product.imgUrl3,
      product.imgUrl4,
      product.imgUrl5,
      product.imgUrl6,
      product.imgUrl7,
    ];
    return rawImages.filter((img) => img && img !== 'placeholder.png');
  }, [product]);

  // Fetch product data
  useEffect(() => {
    if (!id) {
      setError('No product ID provided');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const collections = ['products', 'featuredProducts'];
        let productData = null;
        let foundCollection = null;

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

    fetchProduct();
  }, [id, searchInCollection]);

  // Set initial prices when product data is loaded
  useEffect(() => {
    if (product?.price) {
      const price = parseFloat(product.price);
      if (!isNaN(price)) {
        setBasePrice(price);
        setConfigPrice(price);
      }
    }
  }, [product]);

  // Update total price when quantity or config price changes
  useEffect(() => {
    if (configPrice > 0) {
      setTotalPrice(configPrice * quantity);
    }
  }, [configPrice, quantity]);

  // Set default selections when product data is loaded
  useEffect(() => {
    if (!product || basePrice <= 0) return;

    // Set default color if available and not already selected
    if (product.avaibleColors?.colors?.length > 0 && !selectedColor) {
      setSelectedColor(product.avaibleColors.colors[0].code);
    }
    
    // Set default storage if available and update config price
    if (product.storageOptions?.storage?.length > 0 && !selectedStorage) {
      const defaultStorage = product.storageOptions.storage[0];
      setSelectedStorage(defaultStorage.size);
      const newConfigPrice = basePrice + (defaultStorage.price || 0);
      setConfigPrice(newConfigPrice);
    } else if (!product.storageOptions?.storage?.length) {
      // If no storage options, keep the base price as config price
      setConfigPrice(basePrice);
    }
  }, [product, basePrice, selectedColor, selectedStorage]);

  // Always return the same object structure
  return {
    // State
    product,
    loading,
    error,
    selectedImage,
    basePrice,
    configPrice,
    totalPrice,
    quantity,
    showMore,
    selectedColor,
    selectedStorage,
    
    // Setters
    setSelectedImage,
    setShowMore,
    setSelectedColor,
    
    // Handlers
    handleStorageChange,
    handleQuantityChange,
    
    // Helpers
    getProductImages,
    formatPrice
  };
};