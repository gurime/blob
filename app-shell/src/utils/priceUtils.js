// Price calculation utilities
export const priceUtils = {
  formatPrice: (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) return '0.00';
    // Fix: toLocaleString() should not have a parameter of 2
    // Use options object to specify decimal places
    return numPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  // Generate original price for display (25% markup)
  generateOriginalPrice: (currentPrice) => {
    const num = parseFloat(currentPrice);
    if (isNaN(num)) return '0.00';
    const originalPrice = num * 1.25;
    return originalPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  // Calculate savings amount and percentage
  calculateSavings: (current, original) => {
    const currentNum = parseFloat(current);
    const originalNum = parseFloat(original);
    if (isNaN(currentNum) || isNaN(originalNum)) return { amount: '0.00', percentage: 0 };
    
    const savings = originalNum - currentNum;
    const percentage = Math.round((savings / originalNum) * 100);
    
    return { 
      amount: savings.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }), 
      percentage 
    };
  }
};