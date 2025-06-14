import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../db/firebase';
import { auth } from '../db/firebase';

export const cartHandlers = {
    handleAddToCart: async (product, quantity = 1, showToast, selectedOptions = {}) => {
        try {
            // Check if user is authenticated
            const user = auth.currentUser;
            if (!user) {
                alert('Please log in to add items to cart');
                return { success: false, message: 'User not authenticated' };
            }

            // Use the current price (which includes storage price if selected)
            const currentPrice = selectedOptions.currentPrice || product.price;
            const totalPrice = currentPrice * quantity;

            // Create cart item object - match the structure expected by Cart component
            const cartItem = {
                productId: product._id || product.id,
                productName: selectedOptions.displayName || product.product_name || product.name,
                price: currentPrice, // Use the calculated price including storage
                basePrice: product.price, // Store original base price
                quantity: quantity,
                totalPrice: totalPrice,
                category: product.category || 'General',
                imgUrl: product.imgUrl || 'default-product.jpg',
                brand: product.brand || 'Unknown',
                color: selectedOptions.selectedColor || product.color || null,
                size: selectedOptions.selectedSize || product.size || null,
                storage: selectedOptions.selectedStorage || null, // Use selected storage
                stock: product.stock || 'In Stock',
                hasPrime: product.gpremium || false,
                seller: product.seller || 'Gulime',
                inStock: product.inStock !== undefined ? product.inStock : true,
                warranty: product.warranty || '1 Year',
                addedAt: new Date().toISOString()
            };

            // Remove any undefined values to prevent Firestore errors
            Object.keys(cartItem).forEach(key => {
                if (cartItem[key] === undefined) {
                    delete cartItem[key];
                }
            });

            // Reference to user's cart document
            const cartRef = doc(db, 'carts', user.uid);
            
            // Get existing cart
            const cartDoc = await getDoc(cartRef);
            
            if (cartDoc.exists()) {
                // Cart exists, update it
                const existingCart = cartDoc.data();
                const existingItems = existingCart.items || [];
                
                // Check if product already exists in cart with same configuration
                const existingItemIndex = existingItems.findIndex(
                    item => item.productId === (product.id || product._id) &&
                           item.color === cartItem.color &&
                           item.storage === cartItem.storage &&
                           item.size === cartItem.size
                );
                
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
                showToast(`Added ${quantity} ${displayName} to cart!`, 'success');
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
    },
};