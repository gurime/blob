import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc,
  getDoc, // Added for efficient approach
  increment,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../db/firebase"; // Adjust the import path as necessary

const ProductRating = ({
  rating = 0,
  totalReviews = 0,
  showLink = true,
  isInteractive = false,
  onRatingChange = null,
  productId = null,
  userId = null // You'll need to pass the current user's ID
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentRating, setCurrentRating] = useState(rating);
  const [currentTotalReviews, setCurrentTotalReviews] = useState(totalReviews);

  // Check if user has already rated this product
  useEffect(() => {
    if (isInteractive && userId && productId) {
      checkExistingRating();
    }
  }, [isInteractive, userId, productId]);

  // Check if user has already rated this product
  const checkExistingRating = async () => {
    try {
      const ratingsRef = collection(db, "ratings");
      const q = query(
        ratingsRef, 
        where("productId", "==", productId),
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const existingRating = querySnapshot.docs[0].data();
        setUserRating(existingRating.rating);
        setHasRated(true);
      }
    } catch (error) {
      console.error("Error checking existing rating:", error);
    }
  };

  // Handle star click
  const handleStarClick = (starValue) => {
    if (!isInteractive || isSubmitting || !userId) return;
    
    setUserRating(starValue);
    submitRating(starValue);
  };

  // Handle star hover
  const handleStarHover = (starValue) => {
    if (!isInteractive || isSubmitting) return;
    setHoverRating(starValue);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (!isInteractive || isSubmitting) return;
    setHoverRating(0);
  };

  // Submit rating to Firebase
  const submitRating = async (ratingValue) => {
    if (!productId || !userId) {
      console.error("Product ID and User ID are required for rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const ratingsRef = collection(db, "ratings");
      
      // Check if user has already rated this product
      const existingRatingQuery = query(
        ratingsRef,
        where("productId", "==", productId),
        where("userId", "==", userId)
      );
      
      const existingRatingSnapshot = await getDocs(existingRatingQuery);
      
      if (!existingRatingSnapshot.empty) {
        // Update existing rating
        const existingRatingDoc = existingRatingSnapshot.docs[0];
        const oldRating = existingRatingDoc.data().rating;
        
        await updateDoc(existingRatingDoc.ref, {
          rating: ratingValue,
          updatedAt: serverTimestamp()
        });

        // Update product's average rating and total reviews in products collection
        await updateProductRating(productId, ratingValue, oldRating, false);
        
        console.log("Rating updated successfully");
      } else {
        // Add new rating
        await addDoc(ratingsRef, {
          productId: productId,
          userId: userId,
          rating: ratingValue,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Update product's average rating and total reviews
        await updateProductRating(productId, ratingValue, 0, true);
        
        console.log("Rating submitted successfully");
      }

      setHasRated(true);
      
      // Call parent callback if provided
      if (onRatingChange) {
        onRatingChange(ratingValue, productId);
      }

      // Refresh the rating display
      await fetchUpdatedRating();

    } catch (error) {
      console.error("Error submitting rating:", error);
      // Optionally show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find which collections contain the product (efficient approach)
  const findProductInCollections = async (productId) => {
    const collectionsToCheck = [
      "products",
      "featuredProducts", 
      "bestSellers",
      "newArrivals",
      "saleProducts",
      "hotDeals",
      "recommendedProducts",
      "categoryProducts",
      // Add more collections as needed
    ];

    const foundCollections = [];

    const checkPromises = collectionsToCheck.map(async (collectionName) => {
      try {
        const productRef = doc(db, collectionName, productId);
        const productDoc = await getDoc(productRef);
        
        if (productDoc.exists()) {
          foundCollections.push(collectionName);
        }
      } catch (error) {
        console.warn(`Error checking ${collectionName}:`, error.message);
      }
    });

    await Promise.allSettled(checkPromises);
    return foundCollections;
  };

  // Update the product's overall rating and total reviews across multiple collections
  const updateProductRating = async (productId, newRating, oldRating, isNewRating) => {
    try {
      // Get all ratings for this product to calculate new average
      const ratingsRef = collection(db, "ratings");
      const productRatingsQuery = query(ratingsRef, where("productId", "==", productId));
      const ratingsSnapshot = await getDocs(productRatingsQuery);
      
      let totalRating = 0;
      let totalCount = ratingsSnapshot.size;
      
      ratingsSnapshot.forEach((doc) => {
        const ratingData = doc.data();
        if (ratingData.userId === userId) {
          // Use the new rating for this user
          totalRating += newRating;
        } else {
          totalRating += ratingData.rating;
        }
      });

      const averageRating = totalCount > 0 ? (totalRating / totalCount) : 0;
      const updateData = {
        rating: Number(averageRating.toFixed(1)),
        totalReviews: totalCount
      };

      // Find which collections contain this product
      const collectionsWithProduct = await findProductInCollections(productId);

      if (collectionsWithProduct.length === 0) {
        console.warn(`Product ${productId} not found in any collection`);
        return;
      }

      // Update only the collections that contain the product
      const updatePromises = collectionsWithProduct.map(async (collectionName) => {
        try {
          const productRef = doc(db, collectionName, productId);
          await updateDoc(productRef, updateData);
          console.log(`Updated product rating in ${collectionName} collection`);
        } catch (error) {
          console.error(`Error updating product in ${collectionName}:`, error);
        }
      });

      await Promise.allSettled(updatePromises);

      console.log(`Product rating updated in ${collectionsWithProduct.length} collections:`, collectionsWithProduct);

    } catch (error) {
      console.error("Error updating product rating:", error);
    }
  };

  // Fetch updated rating after submission
  const fetchUpdatedRating = async () => {
    try {
      const ratingsRef = collection(db, "ratings");
      const productRatingsQuery = query(ratingsRef, where("productId", "==", productId));
      const ratingsSnapshot = await getDocs(productRatingsQuery);
      
      if (ratingsSnapshot.size > 0) {
        let totalRating = 0;
        ratingsSnapshot.forEach((doc) => {
          totalRating += doc.data().rating;
        });
        
        const averageRating = totalRating / ratingsSnapshot.size;
        setCurrentRating(Number(averageRating.toFixed(1)));
        setCurrentTotalReviews(ratingsSnapshot.size);
      }
    } catch (error) {
      console.error("Error fetching updated rating:", error);
    }
  };

  // Generate interactive stars
  const generateInteractiveStars = () => {
    const stars = [];
    const displayRating = hoverRating || userRating || currentRating;
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= displayRating;
      const isHovered = i <= hoverRating;
      
      stars.push(
        <span
          key={i}
          className={`star ${isFilled ? 'filled' : 'empty'} ${isHovered ? 'hovered' : ''} ${isInteractive ? 'interactive' : ''} ${isSubmitting ? 'submitting' : ''}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleMouseLeave}
          title={`Rate ${i} star${i > 1 ? 's' : ''}`}
        >
          {isFilled ? '★' : '☆'}
        </span>
      );
    }
    
    return stars;
  };

  // Generate display-only stars (for showing existing ratings)
  const generateDisplayStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    let stars = '';

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars += '⭐'; // Half star
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars += '☆';
    }
    
    return stars;
  };

  // Format review count with commas
  const formatReviewCount = (count) => {
    if (!count || count === 0) return "No ratings yet";
    return count.toLocaleString();
  };

  // Handle empty/zero ratings
  const displayRating = currentRating || 0;
  const displayReviews = currentTotalReviews || 0;

  return (
    <div className="rating-section">
      {isInteractive ? (
        <div className="interactive-stars" onMouseLeave={handleMouseLeave}>
          {generateInteractiveStars()}
          {hasRated && !isSubmitting && (
            <span className="rating-success">
              {userRating > 0 ? "Thanks for rating!" : "Rating updated!"}
            </span>
          )}
          {isSubmitting && (
            <span className="rating-submitting">Submitting...</span>
          )}
        </div>
      ) : (
        <span className="stars display-stars">
          {displayRating > 0 ? generateDisplayStars(displayRating) : '☆☆☆☆☆'}
        </span>
      )}
      
      {showLink && displayRating > 0 ? (
        <Link to="#reviews" className="rating-text">
          {displayRating} out of 5 stars
        </Link>
      ) : (
        <span className="rating-text">
          {displayRating > 0 ? `${displayRating} out of 5 stars` : 'No ratings yet'}
        </span>
      )}
      
      <span className="rating-text">
        {formatReviewCount(displayReviews)} {displayReviews === 1 ? 'rating' : ''}
      </span>
      
      {isInteractive && !hasRated && !isSubmitting && userId && (
        <div className="rating-prompt">
          <span>Rate this product:</span>
        </div>
      )}
      
      {isInteractive && !userId && (
        <div className="rating-prompt">
          <Link to="/login" className="login-to-rate">Login to rate this product</Link>
        </div>
      )}
    </div>
  );
};

export default ProductRating;