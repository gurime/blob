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

      // Create cart item object
      const cartItem = {
        productId: product.id,
        productName: product.product_name,
        price: product.price,
        quantity: quantity,
        totalPrice: totalPrice,
        imgUrl: product.imgUrl,
        category: product.category,
        addedAt: new Date().toISOString()
      };

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
          item => item.productId === product.id
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
        
        // Update cart document
        await updateDoc(cartRef, {
          items: existingItems,
          updatedAt: new Date().toISOString(),
          totalItems: existingItems.reduce((sum, item) => sum + item.quantity, 0),
          totalValue: existingItems.reduce((sum, item) => sum + item.totalPrice, 0)
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
        showToast(`Added ${quantity} ${product.product_name} to cart!`, 'success');
      }

      console.log(`Added ${quantity} ${product.product_name} to cart`);
      
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

  handleBuyNow: (quantity, product, totalPrice) => {
    console.log(`Buy now: ${quantity} ${product?.product_name}`);
    alert(`Proceeding to checkout with ${quantity} item(s)`);
    // TODO: Add your buy now logic here
    // This could include:
    // - Redirecting to checkout page
    // - Opening a modal for quick checkout
    // - Calling payment processing API
  }
};