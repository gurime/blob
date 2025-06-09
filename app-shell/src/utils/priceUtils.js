// Price calculation utilities
export const priceUtils = {
  formatPrice: (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) return '0.00';
    return numPrice.toFixed(2);
  },

  // Generate original price for display (25% markup)
  generateOriginalPrice: (currentPrice) => {
    const num = parseFloat(currentPrice);
    if (isNaN(num)) return '0.00';
    return (num * 1.25).toFixed(2);
  },

  // Calculate savings amount and percentage
  calculateSavings: (current, original) => {
    const currentNum = parseFloat(current);
    const originalNum = parseFloat(original);
    if (isNaN(currentNum) || isNaN(originalNum)) return { amount: '0.00', percentage: 0 };
    
    const savings = originalNum - currentNum;
    const percentage = Math.round((savings / originalNum) * 100);
    return { amount: savings.toFixed(2), percentage };
  }
};