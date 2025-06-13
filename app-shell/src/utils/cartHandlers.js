import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../db/firebase';
import { auth } from '../db/firebase';

// Cart and purchase handlers
export const cartHandlers = {
    handleAddToCart: async (product, quantity = 1, showToast) => {
        try {
            // Check if user is authenticated
            const user = auth.currentUser;
            if (!user) {
                alert('Please log in to add items to cart');
                return { success: false, message: 'User not authenticated' };
            }

            // Calculate total price
            const totalPrice = product.price * quantity;

            // Create cart item object - match the structure expected by Cart component
            const cartItem = {
                productId: product._id || product.id,
                productName: product.product_name || product.name, // Match Cart component's expectation
                price: product.price,
                quantity: quantity,
                totalPrice: totalPrice, // Add this field that Cart component expects
                category: product.category || 'General',
                imgUrl: product.imgUrl || 'default-product.jpg',
                brand: product.brand || 'Unknown',
                color: product.selectedColor || product.color || null,
                size: product.selectedSize || product.size || null,
                storage: product.selectedStorage || product.storage || null,
                stock: product.stock || 'In Stock', // Match Cart component's expectation
                hasPrime: product.gpremium || false,
                seller: product.seller || 'Gulime',
                inStock: product.inStock !== undefined ? product.inStock : true,
                warranty: product.warranty || '1 Year',
                addedAt: new Date().toISOString() // Match Cart component's expectation
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
                
                // Check if product already exists in cart
                const existingItemIndex = existingItems.findIndex(
                    item => item.productId === (product.id || product._id)
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
                showToast(`Added ${quantity} ${product.product_name || product.name} to cart!`, 'success');
            }
            
            console.log(`Added ${quantity} ${product.product_name || product.name} to cart`);
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