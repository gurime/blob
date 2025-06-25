/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../db/firebase";

export const useProductDetails = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showMore, setShowMore] = useState(false);
  
  // Regular product states
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  
  // Car-specific configuration states
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTrim, setSelectedTrim] = useState('');
  const [selectedWheels, setSelectedWheels] = useState('');
  const [selectedInterior, setSelectedInterior] = useState('');
  const [selectedAutopilot, setSelectedAutopilot] = useState('');
  const [selectedExtras, setSelectedExtras] = useState([]);

  // Memoized values for better performance
  const basePrice = useMemo(() => {
    if (!product?.price) return 0;
    const price = parseFloat(product.price);
    return isNaN(price) ? 0 : price;
  }, [product?.price]);

const isCarProduct = useMemo(() => {
  return product?.category?.toLowerCase() === 'automotive' || !!product?.colors;
}, [product]);

const getVirtualCarConfig = useMemo(() => {
  if (!product || !isCarProduct) return null;
  
  return {
    colors: product.colors || [],
    models: product.models || [],
    trims: product.trims || [],
    wheels: product.wheels || [],
    interiors: product.interiors || [],
    autopilot: product.autopilot || [],
    extras: product.extras || []
  };
}, [product, isCarProduct]);
  // Helper function to format numbers with commas
  const formatPrice = useCallback((price) => {
    if (typeof price !== 'number' || isNaN(price)) return '0';
    return price.toLocaleString('en-US');
  }, []);

  // Optimized search function with direct document lookup first
  const searchInCollection = useCallback(async (collectionName, searchTerm) => {
    try {
      // First try direct document lookup (faster)
      try {
        const docRef = doc(db, collectionName, searchTerm);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            ...docSnap.data()
          };
        }
      } catch (directError) {
        // Continue to full collection search if direct lookup fails
      }

      // Fall back to full collection search
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
      
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        
        const fieldsToCheck = [
          data.product_name,
          data.name,
          data.title,
          docSnapshot.id
        ].map(field => (field || '').toLowerCase().trim());
        
        if (fieldsToCheck.some(field => field === normalizedSearchTerm)) {
          return {
            id: docSnapshot.id,
            ...data
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Error searching in ${collectionName}:`, error);
      return null;
    }
  }, []);

  // Get filtered product images
  const getProductImages = useCallback(() => {
    if (!product) return [];
    
    const imageKeys = ['imgUrl', 'imgUrl1', 'imgUrl2', 'imgUrl3', 'imgUrl4', 'imgUrl5', 'imgUrl6', 'imgUrl7'];
    return imageKeys
      .map(key => product[key])
      .filter(img => img && img !== 'placeholder.png');
  }, [product]);

  // Get car configuration images based on selections
  const getCarConfigImages = useCallback(() => {
    if (!isCarProduct || !product?.carConfig) return getProductImages();
    
    const config = product.carConfig;
    const images = [];
    
    // Collect images from various config options
    const configSources = [
      { selected: selectedModel, options: config.models },
      { selected: selectedColor, options: config.colors, key: 'code' },
      { selected: selectedWheels, options: config.wheels }
    ];
    
    configSources.forEach(({ selected, options, key = 'name' }) => {
      if (selected && options) {
        const option = options.find(opt => opt[key] === selected);
        if (option?.images) {
          images.push(...option.images);
        }
      }
    });
    
    return images.length > 0 ? images : getProductImages();
  }, [isCarProduct, product, selectedModel, selectedColor, selectedWheels, getProductImages]);

 // Replace the configPrice useMemo in your useProductDetails hook with this fixed version:

const configPrice = useMemo(() => {
  if (!product) return basePrice;
  
  let totalPrice = basePrice;
  
  // Handle regular product storage pricing
  if (!isCarProduct && product.storageOptions?.storage && selectedStorage) {
    const storageOption = product.storageOptions.storage.find(s => s.size === selectedStorage);
    if (storageOption?.price) {
      totalPrice += storageOption.price;
    }
  }
  
  // Handle car configuration pricing
  if (isCarProduct) {
    // Handle colors from product.colors array
    if (selectedColor && product.colors) {
      const colorOption = product.colors.find(c => c.code === selectedColor);
      if (colorOption?.price && typeof colorOption.price === 'number') {
        totalPrice += colorOption.price;
      }
    }

    // Handle wheels from product.wheels array
    if (selectedWheels && product.wheels) {
      const wheelOption = product.wheels.find(w => w.code === selectedWheels);
      if (wheelOption?.price && typeof wheelOption.price === 'number') {
        totalPrice += wheelOption.price;
      }
    }

    // Handle interiors from product.interiors array
    if (selectedInterior && product.interiors) {
      const interiorOption = product.interiors.find(i => i.code === selectedInterior);
      if (interiorOption?.price && typeof interiorOption.price === 'number') {
        totalPrice += interiorOption.price;
      }
    }

    // FIXED: Handle autopilot from product.autopilot array
    if (selectedAutopilot && product.autopilot) {
      const autopilotOption = product.autopilot.find(a => a.code === selectedAutopilot);
      if (autopilotOption?.price && typeof autopilotOption.price === 'number') {
        totalPrice += autopilotOption.price;
      }
    }

    // FIXED: Handle extras from product.extras array
    if (selectedExtras.length > 0 && product.extras) {
      selectedExtras.forEach(selectedExtra => {
        // selectedExtra should be the full object, not just a reference
        if (selectedExtra?.price && typeof selectedExtra.price === 'number') {
          totalPrice += selectedExtra.price;
        }
      });
    }
  }
  
  return totalPrice;
}, [basePrice, product, isCarProduct, selectedStorage, selectedColor, selectedWheels, selectedInterior, selectedAutopilot, selectedExtras]);

  // Calculate total price with quantity
  const totalPrice = useMemo(() => {
    return configPrice * quantity;
  }, [configPrice, quantity]);

  // Display names
  const displayName = useMemo(() => {
    if (isCarProduct) {
      let name = product?.brand || 'Car';
      if (selectedModel) name += ` ${selectedModel}`;
      if (selectedTrim) name += ` ${selectedTrim}`;
      return name;
    }
    
    if (selectedStorage && product?.product_name) {
      return `${product.product_name} - ${selectedStorage}`;
    }
    
    return product?.product_name || product?.name || '';
  }, [isCarProduct, product, selectedModel, selectedTrim, selectedStorage]);

  const estimatedDelivery = useMemo(() => {
    if (!isCarProduct || !product?.carConfig?.models || !selectedModel) {
      return '2-4 weeks';
    }
    
    const modelData = product.carConfig.models.find(m => m.name === selectedModel);
    return modelData?.estimatedDelivery || '2-4 weeks';
  }, [isCarProduct, product, selectedModel]);

  // Event handlers - FIXED to match UI expectations
const handleQuantityChange = useCallback((newQuantity) => {
  setQuantity(Math.max(1, newQuantity));
}, []);

const handleStorageChange = useCallback((storageOption) => {
  setSelectedStorage(prev => prev === storageOption.size ? null : storageOption.size);
}, []);

// Car configuration handlers - FIXED with toggle functionality
const handleColorChange = useCallback((colorCode) => {
  setSelectedColor(prev => prev === colorCode ? null : colorCode);
}, []);

const handleWheelsChange = useCallback((wheelCode) => {
  setSelectedWheels(prev => prev === wheelCode ? null : wheelCode);
}, []);

const handleInteriorChange = useCallback((interiorCode) => {
  setSelectedInterior(prev => prev === interiorCode ? null : interiorCode);
}, []);

const handleAutopilotChange = useCallback((pkgCode) => {
  setSelectedAutopilot(prev => prev === pkgCode ? null : pkgCode);
}, []);

const handleExtrasChange = useCallback((extra) => {
  setSelectedExtras(prev => {
    const isCurrentlySelected = prev.some(e => e.name === extra.name);
    if (isCurrentlySelected) {
      // If clicking the same item, deselect it
      return [];
    } else {
      // Replace with new selection
      return [extra];
    }
  });
}, []);


  // Get current selections for cart
  const getCurrentSelections = useCallback(() => {
    const selections = {
      selectedColor,
      selectedStorage,
      currentPrice: configPrice,
      displayName,
      quantity,
       totalPrice: totalPrice, // ✅ Add total price
    unitPrice: configPrice  // ✅ Add unit price
    };

    if (isCarProduct) {
      selections.carConfig = {
        selectedModel,
        selectedTrim,
        selectedWheels,
        selectedInterior,
        selectedAutopilot,
        selectedExtras,
        estimatedDelivery
      };
    }

    return selections;
  }, [selectedColor, selectedStorage, configPrice, displayName, quantity, isCarProduct, 
      selectedModel, selectedTrim, selectedWheels, selectedInterior, selectedAutopilot, 
      selectedExtras, estimatedDelivery]);

  // Reset selections when product changes
  const resetSelections = useCallback(() => {
    setSelectedImage(0);
    setSelectedColor('');
    setSelectedStorage('');
    setSelectedModel('');
    setSelectedTrim('');
    setSelectedWheels('');
    setSelectedInterior('');
    setSelectedAutopilot('');
    setSelectedExtras([]);
    setQuantity(1);
  }, []);

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
        const collections = ['products', 'featuredProducts', 'automotive'];
        let productData = null;
        let foundCollection = null;

        const decodedId = decodeURIComponent(id);

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
          resetSelections();
        } else {
          setError(`Product "${decodedId}" not found`);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(`Error fetching product: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, searchInCollection, resetSelections]);

  // Set default selections when product loads - FIXED
  useEffect(() => {
    if (!product || basePrice <= 0) return;

    // Set default color for both regular and car products
    if (!selectedColor) {
      if (isCarProduct && product.colors?.length > 0) {
        setSelectedColor(product.colors[0].code);
      } else if (product.avaibleColors?.colors?.length > 0) {
        setSelectedColor(product.avaibleColors.colors[0].code);
      }
    }
    
    // Set default storage for regular products
    if (!isCarProduct && product.storageOptions?.storage?.length > 0 && !selectedStorage) {
      setSelectedStorage(product.storageOptions.storage[0].size);
    }

    // Set default car configurations
    if (isCarProduct) {
      if (product.wheels?.length > 0 && !selectedWheels) {
        setSelectedWheels(product.wheels[0].code);
      }
      
      if (product.interiors?.length > 0 && !selectedInterior) {
        setSelectedInterior(product.interiors[0].code);
      }

      if (product.autopilot?.length > 0 && !selectedAutopilot) {
        setSelectedAutopilot(product.autopilot[0].code);
      }
    }
  }, [product, basePrice, isCarProduct, selectedColor, selectedStorage, selectedWheels, selectedInterior, selectedAutopilot]);

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
    displayName,
    isCarProduct,
    
    // Car-specific state
    selectedModel,
    selectedTrim,
    selectedWheels,
    selectedInterior,
    selectedAutopilot,
    selectedExtras,
    estimatedDelivery,
    
    // Setters
    setSelectedImage,
    setShowMore,
    setSelectedColor,
    setSelectedWheels,
    
    // Handlers - FIXED
    handleStorageChange,
    handleQuantityChange,
    handleColorChange,
    handleWheelsChange,
    handleInteriorChange,
    handleAutopilotChange,
    handleExtrasChange,
    
    // Helpers
    getProductImages,
    getCarConfigImages,
    formatPrice,
    getCurrentSelections,
    resetSelections
  };
};
