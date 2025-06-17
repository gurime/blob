  // Helper function to get features by category name
function getFeatures(categoryName, highlightsObj, defaultHighlights) {
  // Normalize the category name by removing spaces and converting to lowercase
  const normalized = categoryName.toLowerCase().replace(/\s+/g, '').replace(/&/g, '');
  // Direct match first
  if (highlightsObj[categoryName]) return highlightsObj[categoryName];
  // Try normalized version
  const normalizedKey = Object.keys(highlightsObj).find(key =>
    key.toLowerCase().replace(/\s+/g, '').replace(/&/g, '') === normalized
  );
  return normalizedKey ? highlightsObj[normalizedKey] : defaultHighlights;
}

const getProductHighlights = (product12) => {
  const category = product12.category?.toLowerCase() || '';
  
  // Category-specific highlights
  const categoryHighlights = {
    // Electronics & Tech
    electronics: [
      { icon: '⚡', title: 'High Performance', desc: 'Optimized for speed and efficiency in demanding tasks' },
      { icon: '🔋', title: 'Long Battery Life', desc: 'Extended usage time with efficient power management' },
      { icon: '📱', title: 'Smart Features', desc: 'Advanced technology with intuitive controls' },
      { icon: '🛡️', title: 'Reliable & Secure', desc: 'Built-in security features and robust construction' }
    ],

    televisions: [
  { icon: '📺', title: 'Stunning Display', desc: 'Crystal-clear resolution and vibrant colors for immersive viewing' },
  { icon: '🎮', title: 'Entertainment Ready', desc: 'Perfect for streaming, gaming, and smart connectivity' },
  { icon: '🔊', title: 'Cinematic Sound', desc: 'Built-in audio enhancements for a theater-like experience' },
  { icon: '🧠', title: 'Smart TV Features', desc: 'Voice control, apps, and AI-powered recommendations' }
],


    'headphones & earbuds': [
      { icon: '🎵', title: 'Premium Sound', desc: 'Crystal-clear audio with rich bass and crisp highs' },
      { icon: '🔇', title: 'Noise Cancellation', desc: 'Advanced noise-canceling technology for immersive listening' },
      { icon: '🔋', title: 'Long Battery Life', desc: 'Extended playtime with quick charging capabilities' },
      { icon: '💧', title: 'Sweat Resistant', desc: 'Durable design perfect for workouts and daily use' }
    ],

    tablets: [
      { icon: '📱', title: 'Portable Design', desc: 'Lightweight and easy to carry anywhere' },
      { icon: '🎨', title: 'Creative Tools', desc: 'Perfect for drawing, note-taking, and creative work' },
      { icon: '⚡', title: 'Fast Performance', desc: 'Smooth multitasking and responsive touch experience' },
      { icon: '📺', title: 'Entertainment Ready', desc: 'Stunning display for movies, games, and reading' }
    ],

    // Books
    books: [
      { icon: '📚', title: 'Engaging Content', desc: 'Captivating stories and valuable knowledge' },
      { icon: '🧠', title: 'Mind Expanding', desc: 'Broaden perspectives and gain new insights' },
      { icon: '✨', title: 'Quality Writing', desc: 'Expert authors and professional editing' },
      { icon: '🎯', title: 'Perfect Selection', desc: 'Curated collection for every interest and reading level' }
    ],

    // Fashion
    fashion: [
      { icon: '👕', title: 'Premium Materials', desc: 'High-quality fabrics for comfort and durability' },
      { icon: '✨', title: 'Stylish Design', desc: 'Modern styling that fits any occasion' },
      { icon: '🧵', title: 'Quality Construction', desc: 'Expert craftsmanship in every detail' },
      { icon: '💫', title: 'Versatile Style', desc: 'Easy to mix and match with your wardrobe' }
    ],

    clothing: [
      { icon: '👕', title: 'Premium Materials', desc: 'High-quality fabrics for comfort and durability' },
      { icon: '✨', title: 'Stylish Design', desc: 'Modern styling that fits any occasion' },
      { icon: '🧵', title: 'Quality Construction', desc: 'Expert craftsmanship in every detail' },
      { icon: '💫', title: 'Versatile Style', desc: 'Easy to mix and match with your wardrobe' }
    ],

    shoes: [
      { icon: '👟', title: 'All-Day Comfort', desc: 'Cushioned support for extended wear' },
      { icon: '🏃', title: 'Superior Grip', desc: 'Advanced sole design for any surface' },
      { icon: '💨', title: 'Breathable Design', desc: 'Moisture-wicking materials keep feet dry' },
      { icon: '💎', title: 'Durable Build', desc: 'Long-lasting construction for daily use' }
    ],

    // Health & Beauty
    health: [
      { icon: '💊', title: 'Proven Effective', desc: 'Clinically tested formulas for reliable results' },
      { icon: '🌿', title: 'Natural Ingredients', desc: 'Safe, gentle formulations with natural components' },
      { icon: '🔬', title: 'Science-Backed', desc: 'Research-driven solutions for optimal health' },
      { icon: '✅', title: 'Quality Assured', desc: 'Rigorous testing and quality control standards' }
    ],

    beauty: [
      { icon: '✨', title: 'Professional Results', desc: 'Salon-quality results at home' },
      { icon: '🌿', title: 'Gentle Formula', desc: 'Safe for sensitive skin with natural ingredients' },
      { icon: '⏰', title: 'Quick & Easy', desc: 'Fast application with lasting results' },
      { icon: '💎', title: 'Premium Quality', desc: 'Luxurious experience with high-end ingredients' }
    ],

    // Toys
    toys: [
      { icon: '🎮', title: 'Educational Fun', desc: 'Learning through play with engaging activities' },
      { icon: '🛡️', title: 'Safe Materials', desc: 'Non-toxic, child-safe construction and materials' },
      { icon: '🧠', title: 'Skill Development', desc: 'Promotes creativity, problem-solving, and motor skills' },
      { icon: '👨‍👩‍👧‍👦', title: 'Family Bonding', desc: 'Perfect for shared playtime and creating memories' }
    ],

    // Automotive
    automotive: [
      { icon: '🚗', title: 'Reliable Performance', desc: 'Dependable transportation for daily needs' },
      { icon: '🛡️', title: 'Safety First', desc: 'Advanced safety features and crash protection' },
      { icon: '⚡', title: 'Fuel Efficient', desc: 'Excellent fuel economy and eco-friendly options' },
      { icon: '🔧', title: 'Low Maintenance', desc: 'Designed for minimal upkeep and long-term reliability' }
    ],

    // Grocery
    grocery: [
      { icon: '🥬', title: 'Fresh Quality', desc: 'Premium freshness and quality ingredients' },
      { icon: '🌱', title: 'Nutritious Choice', desc: 'Healthy options for balanced nutrition' },
      { icon: '📦', title: 'Convenient Shopping', desc: 'Easy ordering with fast, reliable delivery' },
      { icon: '💰', title: 'Great Value', desc: 'Competitive prices on everyday essentials' }
    ],

    // Appliances
    appliances: [
      { icon: '⚡', title: 'Energy Efficient', desc: 'Reduces utility costs with smart energy usage' },
      { icon: '🏠', title: 'Space Saving', desc: 'Compact design maximizes kitchen and home space' },
      { icon: '🔧', title: 'Easy Operation', desc: 'Intuitive controls and user-friendly features' },
      { icon: '💪', title: 'Durable Build', desc: 'Long-lasting construction for years of reliable use' }
    ],

    // Pet Supplies
    'pet-supplies': [
      { icon: '🐕', title: 'Pet-Safe Materials', desc: 'Non-toxic, pet-friendly construction and ingredients' },
      { icon: '❤️', title: 'Health Focused', desc: 'Promotes pet health and wellbeing' },
      { icon: '🎾', title: 'Engaging Design', desc: 'Keeps pets active, entertained, and mentally stimulated' },
      { icon: '🏠', title: 'Home Friendly', desc: 'Easy to clean and maintain in your living space' }
    ],

    pets: [
      { icon: '🐕', title: 'Pet-Safe Materials', desc: 'Non-toxic, pet-friendly construction and ingredients' },
      { icon: '❤️', title: 'Health Focused', desc: 'Promotes pet health and wellbeing' },
      { icon: '🎾', title: 'Engaging Design', desc: 'Keeps pets active, entertained, and mentally stimulated' },
      { icon: '🏠', title: 'Home Friendly', desc: 'Easy to clean and maintain in your living space' }
    ],

    // Baby Products
    'baby-products': [
      { icon: '👶', title: 'Baby Safe', desc: 'Gentle, non-toxic materials safe for infants' },
      { icon: '🛡️', title: 'Tested Quality', desc: 'Rigorous safety testing and quality standards' },
      { icon: '💤', title: 'Comfort First', desc: 'Designed for baby comfort and peaceful sleep' },
      { icon: '👨‍👩‍👧', title: 'Parent Approved', desc: 'Trusted by parents and recommended by experts' }
    ],

    baby: [
      { icon: '👶', title: 'Baby Safe', desc: 'Gentle, non-toxic materials safe for infants' },
      { icon: '🛡️', title: 'Tested Quality', desc: 'Rigorous safety testing and quality standards' },
      { icon: '💤', title: 'Comfort First', desc: 'Designed for baby comfort and peaceful sleep' },
      { icon: '👨‍👩‍👧', title: 'Parent Approved', desc: 'Trusted by parents and recommended by experts' }
    ],

    // Garden & Outdoor
    garden: [
      { icon: '🌱', title: 'Garden Ready', desc: 'Professional-grade tools for beautiful gardens' },
      { icon: '☀️', title: 'Weather Resistant', desc: 'Durable construction for all weather conditions' },
      { icon: '🌿', title: 'Eco-Friendly', desc: 'Sustainable materials and environmentally conscious design' },
      { icon: '⏰', title: 'Time Saving', desc: 'Efficient tools that make gardening easier and faster' }
    ],

    'garden-outdoor': [
      { icon: '🌱', title: 'Garden Ready', desc: 'Professional-grade tools for beautiful gardens' },
      { icon: '☀️', title: 'Weather Resistant', desc: 'Durable construction for all weather conditions' },
      { icon: '🌿', title: 'Eco-Friendly', desc: 'Sustainable materials and environmentally conscious design' },
      { icon: '⏰', title: 'Time Saving', desc: 'Efficient tools that make gardening easier and faster' }
    ],

    // Home
    home: [
      { icon: '🏠', title: 'Home Enhancement', desc: 'Beautiful additions that improve your living space' },
      { icon: '✨', title: 'Style & Function', desc: 'Perfect blend of aesthetic appeal and practical use' },
      { icon: '🔧', title: 'Easy Setup', desc: 'Simple installation and user-friendly design' },
      { icon: '💰', title: 'Value Addition', desc: 'Increases home comfort and property value' }
    ],

    furniture: [
      { icon: '🪑', title: 'Ergonomic Design', desc: 'Comfortable support for daily use' },
      { icon: '🏠', title: 'Space Efficient', desc: 'Smart design maximizes your living space' },
      { icon: '🌳', title: 'Quality Materials', desc: 'Durable construction from premium materials' },
      { icon: '🎨', title: 'Stylish Appeal', desc: 'Beautiful design complements any decor' }
    ],

    // Kitchen
    kitchen: [
      { icon: '🍳', title: 'Even Cooking', desc: 'Consistent heat distribution for perfect results' },
      { icon: '🧽', title: 'Easy Cleanup', desc: 'Non-stick surfaces and dishwasher-safe parts' },
      { icon: '⏱️', title: 'Time Efficient', desc: 'Faster cooking with professional-grade performance' },
      { icon: '🔥', title: 'Versatile Cooking', desc: 'Multiple functions in one convenient appliance' }
    ],

    // Music
    music: [
      { icon: '🎵', title: 'Superior Sound', desc: 'High-quality audio for the ultimate listening experience' },
      { icon: '🎤', title: 'Professional Grade', desc: 'Studio-quality equipment for musicians and audiophiles' },
      { icon: '📻', title: 'Wide Compatibility', desc: 'Works with all your favorite devices and platforms' },
      { icon: '🎯', title: 'Precision Crafted', desc: 'Expertly designed for optimal acoustic performance' }
    ],

    // Sports
    sports: [
      { icon: '🏃', title: 'Peak Performance', desc: 'Engineered for competitive advantage' },
      { icon: '💪', title: 'Durable Build', desc: 'Withstands intense training and competition' },
      { icon: '🎯', title: 'Precision Engineering', desc: 'Every detail optimized for performance' },
      { icon: '🏆', title: 'Professional Quality', desc: 'Trusted by athletes and professionals' }
    ],

    // Office
    office: [
      { icon: '📊', title: 'Productivity Boost', desc: 'Tools designed to enhance work efficiency' },
      { icon: '🖥️', title: 'Professional Quality', desc: 'Business-grade reliability and performance' },
      { icon: '📋', title: 'Organization Made Easy', desc: 'Keep your workspace neat and efficient' },
      { icon: '⚡', title: 'Fast & Reliable', desc: 'Dependable performance for daily business needs' }
    ],

    // Games
    games: [
      { icon: '🎮', title: 'Immersive Gaming', desc: 'Cutting-edge graphics and engaging gameplay' },
      { icon: '🏆', title: 'Competitive Edge', desc: 'High-performance equipment for serious gamers' },
      { icon: '👥', title: 'Multiplayer Ready', desc: 'Perfect for solo play or gaming with friends' },
      { icon: '⚡', title: 'Lightning Fast', desc: 'Smooth performance with minimal lag and loading times' }
    ],

    // Tools & Home Improvement
    tools: [
      { icon: '💪', title: 'Professional Grade', desc: 'Built to withstand heavy-duty professional use' },
      { icon: '🎯', title: 'Precision Control', desc: 'Accurate results with ergonomic design' },
      { icon: '🔧', title: 'Versatile Use', desc: 'Multiple applications for various projects' },
      { icon: '⚡', title: 'Efficient Power', desc: 'Maximum performance with optimal energy use' }
    ],

    // Lawn Mowers
    'lawn mowers': [
      { icon: '🌱', title: 'Perfect Cut', desc: 'Precision cutting for a beautiful, healthy lawn' },
      { icon: '💪', title: 'Powerful Engine', desc: 'Reliable performance for any lawn size' },
      { icon: '🔧', title: 'Easy Maintenance', desc: 'Simple upkeep with accessible parts and filters' },
      { icon: '⏰', title: 'Time Saving', desc: 'Efficient cutting patterns reduce mowing time' }
    ]
  };

  // Default/Generic highlights for unknown categories
  const defaultHighlights = [
    { icon: '⭐', title: 'Premium Quality', desc: 'Built with high-grade materials for durability and performance' },
    { icon: '🛡️', title: 'Reliable & Trusted', desc: 'Backed by excellent customer service and warranty' },
    { icon: '🎯', title: 'User-Friendly', desc: 'Intuitive design that\'s easy to set up and use' },
    { icon: '📞', title: 'Support Included', desc: 'Comprehensive customer support and documentation' }
  ];

  // Now call getFeatures with all required parameters
  return getFeatures(category, categoryHighlights, defaultHighlights);
};
export  {getFeatures,getProductHighlights}