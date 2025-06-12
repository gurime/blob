import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../db/firebase';

export const wishlistHandlers = {
  // Add product to wishlist
  addToWishlist: async (userId, product) => {
    try {
      if (!userId) {
        throw new Error('User must be logged in to add to wishlist');
      }

      // Create a document with userId_productId as the document ID for easy querying
      const wishlistItemId = `${userId}_${product.id || product._id}`;
      const wishlistRef = doc(db, 'wishlist', wishlistItemId);
      
      const wishlistItem = {
        userId: userId,
        productId: product.id || product._id,
        productName: product.product_name,
        productPrice: product.price,
        productImage: product.imgUrl,
        productCategory: product.category,
        addedAt: new Date().toISOString(),
        // Store the full product data for easy access
        productData: product
      };

      await setDoc(wishlistRef, wishlistItem);
      return { success: true, message: 'Product added to wishlist!' };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: error.message };
    }
  },

  // Remove product from wishlist
  removeFromWishlist: async (userId, productId) => {
    try {
      if (!userId) {
        throw new Error('User must be logged in');
      }

      const wishlistItemId = `${userId}_${productId}`;
      const wishlistRef = doc(db, 'wishlist', wishlistItemId);
      
      await deleteDoc(wishlistRef);
      return { success: true, message: 'Product removed from wishlist!' };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, message: error.message };
    }
  },

  // Check if product is in wishlist
  isInWishlist: async (userId, productId) => {
    try {
      if (!userId) return false;

      const wishlistItemId = `${userId}_${productId}`;
      const wishlistRef = doc(db, 'wishlist', wishlistItemId);
      const docSnap = await getDoc(wishlistRef);
      
      return docSnap.exists();
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  },

  // Get user's complete wishlist
  getUserWishlist: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User must be logged in');
      }

      const wishlistCollection = collection(db, 'wishlist');
      const querySnapshot = await getDocs(wishlistCollection);
      
      const userWishlist = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === userId) {
          userWishlist.push({ id: doc.id, ...data });
        }
      });

      return { success: true, wishlist: userWishlist };
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return { success: false, message: error.message, wishlist: [] };
    }
  },

  // Toggle wishlist status (add if not present, remove if present)
  toggleWishlist: async (userId, product) => {
    try {
      const productId = product.id || product._id;
      const isWishlisted = await wishlistHandlers.isInWishlist(userId, productId);
      
      if (isWishlisted) {
        return await wishlistHandlers.removeFromWishlist(userId, productId);
      } else {
        return await wishlistHandlers.addToWishlist(userId, product);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return { success: false, message: error.message };
    }
  }
};
