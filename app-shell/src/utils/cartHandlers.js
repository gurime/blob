import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../db/firebase";

// Add this enhanced version with debugging
export const cartHandlers = {
handleAddToCart: async (product, quantity = 1, showToast, selectedOptions, actualSelectedOptions = {}) => {
    try {
        // Check if user is authenticated
        const user = auth.currentUser;
        if (!user) {
            showToast('Please log in to add items to cart');
            return { success: false, message: 'User not authenticated' };
        }

        // Use the current price (which includes all configuration options)
        const currentPrice = selectedOptions.currentPrice || selectedOptions.configPrice || product.price;
        const totalPrice = currentPrice * quantity; // ✅ Correct calculation

        // Create cart item object
        const cartItem = {
            productId: product._id || product.id,
            productName: selectedOptions.displayName || product.product_name || product.name,
            price: currentPrice,
            quantity: quantity, // ✅ This is correct
            totalPrice: totalPrice, // ✅ Remove the duplicate and use correct calculation
            description: product.description || 'No description available',
            brandName: product.brand_name || product.brand || 'Unknown',
            accelration: product.accelration,
            range: product.range,
            model: product.model,
            topSpeed: product.topSpeed,
            category: product.category || 'General',
            imgUrl: product.imgUrl || 'default-product.jpg',
            brand: product.brand || 'Unknown',
            
            
            // Standard product options
            color: actualSelectedOptions.selectedColor || product.color || null,
            size: selectedOptions.selectedSize || product.size || null,
            storage: selectedOptions.selectedStorage || null,
            
            // Standard fields
            stock: product.stock || 'In Stock',
            hasPrime: product.gpremium || false,
            seller: product.seller || 'Gulime',
            inStock: product.inStock !== undefined ? product.inStock : true,
            warranty: product.warranty || '1 Year',
            addedAt: new Date().toISOString()
        };

        // Automotive-specific configuration - Enhanced with better validation
        if (product.category?.toLowerCase() === 'automotive') {
            
            
            // Extract configuration from carConfig if it exists
            const carConfig = selectedOptions.carConfig || {};
            const actualSelectedOptions = {
                selectedColor: selectedOptions.selectedColor || carConfig.selectedColor,
selectedWheels: selectedOptions.selectedWheels || carConfig.selectedWheels,
selectedInterior: selectedOptions.selectedInterior || carConfig.selectedInterior,
selectedAutopilot: selectedOptions.selectedAutopilot || carConfig.selectedAutopilot,
selectedExtras: selectedOptions.selectedExtras || carConfig.selectedExtras || [],
selectedTrim: selectedOptions.selectedTrim || carConfig.selectedTrim,
selectedFinancing: selectedOptions.selectedFinancing || carConfig.selectedFinancing,

            };
            
       
            if (!product.colors || !product.wheels || !product.interiors) {
                console.warn('Missing automotive configuration data in product:', {
                    hasColors: !!product.colors,
                    hasWheels: !!product.wheels,
                    hasInteriors: !!product.interiors
                });
            }

            const automotiveConfig = {
                color: actualSelectedOptions.selectedColor ? {
                    code: actualSelectedOptions.selectedColor,
                    name: product.colors?.find(c => c.code === actualSelectedOptions.selectedColor)?.name || 'Unknown',
                    hex: product.colors?.find(c => c.code === actualSelectedOptions.selectedColor)?.hex || '#000000'
                } : null,

trims: actualSelectedOptions.selectedTrim ? {
code: actualSelectedOptions.selectedTrim,
name: product.trims?.find(t => t.code === actualSelectedOptions.selectedTrim)?.name || 'Unknown',
price: product.trims?.find(t => t.code === actualSelectedOptions.selectedTrim)?.price || 0,
LeasePrice: product.trims?.find(t => t.code === actualSelectedOptions.selectedTrim)?.leasePrice || 0,
financePrice: product.trims?.find(t => t.code === actualSelectedOptions.selectedTrim)?.financePrice || 0,
accelration: product.trims?.find(t => t.code === actualSelectedOptions.selectedTrim)?.accelration || 0,
range: product.trims?.find(t => t.code === actualSelectedOptions.selectedTrim)?.range || 0,
topSpeed: product.trims?.find(t => t.code === actualSelectedOptions.selectedTrim)?.topSpeed || 0
} : null,
                
                wheels: actualSelectedOptions.selectedWheels ? {
                    code: actualSelectedOptions.selectedWheels,
                    name: product.wheels?.find(w => w.code === actualSelectedOptions.selectedWheels)?.name || 'Unknown',
                    price: product.wheels?.find(w => w.code === actualSelectedOptions.selectedWheels)?.price || 0
                } : null,
                
                interior: actualSelectedOptions.selectedInterior ? {
                    code: actualSelectedOptions.selectedInterior,
                    name: product.interiors?.find(i => i.code === actualSelectedOptions.selectedInterior)?.name || 'Unknown',
                    price: product.interiors?.find(i => i.code === actualSelectedOptions.selectedInterior)?.price || 0
                } : null,
                
                autopilot: actualSelectedOptions.selectedAutopilot ? {
                    code: actualSelectedOptions.selectedAutopilot,
                    name: product.autopilot?.find(a => a.code === actualSelectedOptions.selectedAutopilot)?.name || 'Unknown',
                    price: product.autopilot?.find(a => a.code === actualSelectedOptions.selectedAutopilot)?.price || 0,
                    features: product.autopilot?.find(a => a.code === actualSelectedOptions.selectedAutopilot)?.features || []
                } : null,
                
                extras: actualSelectedOptions.selectedExtras || [],
                
                configurationSummary: {
colorName: product.colors?.find(c => c.code === actualSelectedOptions.selectedColor)?.name || 'Not selected',
wheelsName: product.wheels?.find(w => w.code === actualSelectedOptions.selectedWheels)?.name || 'Not selected',
trims: product.trims?.find(t => t.code === actualSelectedOptions.selectedTrim)?.name || 'Not selected',
selectedTrim: actualSelectedOptions.selectedTrim || 'Not selected',
financePrice: product.financePrice || 0,
LeasePrice: product.leasePrice || 0,
autopilotPrice: product.autopilot?.find(a => a.code === actualSelectedOptions.selectedAutopilot)?.price || 0,
interiorName: product.interiors?.find(i => i.code === actualSelectedOptions.selectedInterior)?.name || 'Not selected',
autopilotName: product.autopilot?.find(a => a.code === actualSelectedOptions.selectedAutopilot)?.name || 'Not selected',
extrasNames: actualSelectedOptions.selectedExtras?.map(e => e.name).join(', ') || 'None'
                },

          
            };

            // Debug: Log the automotive config
            
            cartItem.automotiveConfig = automotiveConfig;
        }

        // Remove any undefined values to prevent Firestore errors
        Object.keys(cartItem).forEach(key => {
            if (cartItem[key] === undefined) {
                delete cartItem[key];
            }
        });

        // Debug: Log final cart item

        // Reference to user's cart document
        const cartRef = doc(db, 'carts', user.uid);
        
        // Get existing cart
        const cartDoc = await getDoc(cartRef);
        
        if (cartDoc.exists()) {
            // Cart exists, update it
            const existingCart = cartDoc.data();
            const existingItems = existingCart.items || [];
            
            // Check if product already exists in cart with same configuration
            const existingItemIndex = existingItems.findIndex(item => {
                const baseMatch = item.productId === (product.id || product._id) &&
                                item.color === cartItem.color &&
                                item.storage === cartItem.storage &&
                                item.size === cartItem.size;
                
                // For automotive products, also check configuration
                if (product.category?.toLowerCase() === 'automotive' && cartItem.automotiveConfig) {
                    const configMatch = 
                           item.automotiveConfig?.color?.code === cartItem.automotiveConfig?.color?.code &&
                           item.automotiveConfig?.wheels?.code === cartItem.automotiveConfig?.wheels?.code &&
                           item.automotiveConfig?.interior?.code === cartItem.automotiveConfig?.interior?.code &&
                           item.automotiveConfig?.autopilot?.code === cartItem.automotiveConfig?.autopilot?.code &&
                           JSON.stringify(item.automotiveConfig?.extras) === JSON.stringify(cartItem.automotiveConfig?.extras);
                    
               
                    return baseMatch && configMatch;
                }
                
                return baseMatch;
            });
            
            if (existingItemIndex >= 0) {
                // Update quantity of existing item
                existingItems[existingItemIndex].quantity += quantity;
                existingItems[existingItemIndex].totalPrice = 
                    existingItems[existingItemIndex].price * existingItems[existingItemIndex].quantity;
            } else {
                // Add new item to cart
                existingItems.push(cartItem);
            }
            
            // Calculate totals
            const totalItems = existingItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalValue = existingItems.reduce((sum, item) => sum + item.totalPrice, 0);
            
            // Update cart document
            await updateDoc(cartRef, {
                items: existingItems,
                updatedAt: new Date().toISOString(),
                totalItems: totalItems,
                totalValue: totalValue
            });
        } else {
            // Create new cart
            await setDoc(cartRef, {
                userId: user.uid,
                items: [cartItem],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                totalItems: quantity,
                totalValue: totalPrice
            });
        }
        
        // Show success toast if function is provided
        if (showToast) {
            const displayName = selectedOptions.displayName || product.product_name || product.name;
            const configText = product.category?.toLowerCase() === 'automotive' && cartItem.automotiveConfig 
                ? ` (${cartItem.automotiveConfig.configurationSummary.colorName})` 
                : '';
            showToast(`Added ${quantity} ${displayName}${configText} to cart!`, 'success');
        }
        
        return {
            success: true,
            message: `Added ${quantity} item(s) to cart!`,
            shouldNavigate: true
        };
        
    } catch (error) {
        console.error("Error adding to cart:", error);
        
        // Show error toast if function is provided
        if (showToast) {
            showToast('Failed to add item to cart. Please try again.', 'error');
        }
        
        return {
            success: false,
            message: 'Failed to add item to cart. Please try again.'
        };
    }
}
};