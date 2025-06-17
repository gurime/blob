// uploadProduct.js
import dotenv from 'dotenv';
dotenv.config();

import { doc, setDoc } from "firebase/firestore";
import { db } from "./db/firebase.js";

// const sharedOptions = {
//   colors: [
//     { name: 'Pearl White Multi-Coat', code: 'pearl-white', price: 0, hex: '#FFFFFF' },
//     { name: 'Solid Black', code: 'solid-black', price: 1000, hex: '#000000' },
//     { name: 'Midnight Silver Metallic', code: 'midnight-silver', price: 1000, hex: '#5C5C5C' },
//     { name: 'Deep Blue Metallic', code: 'deep-blue', price: 1000, hex: '#1E3A8A' },
//     { name: 'Red Multi-Coat', code: 'red-multi', price: 2000, hex: '#DC2626' }
//   ],
//   wheels: [
//     { name: '19" Tempest Wheels', code: '19-tempest', price: 0 },
//     { name: '21" Arachnid Wheels', code: '21-arachnid', price: 4500 }
//   ],
//   interiors: [
//     { name: 'All Black', code: 'black', price: 0 },
//     { name: 'Black and White', code: 'black-white', price: 1000 },
//     { name: 'Cream', code: 'cream', price: 1000 }
//   ],
//   autopilot: [
//     {
//       name: 'Basic Autopilot',
//       code: 'basic',
//       price: 0,
//       features: ['Traffic-Aware Cruise Control', 'Autosteer']
//     },
//     {
//       name: 'Enhanced Autopilot',
//       code: 'enhanced',
//       price: 6000,
//       features: ['Navigate on Autopilot', 'Auto Lane Change', 'Autopark', 'Summon']
//     },
//     {
//       name: 'Full Self-Driving',
//       code: 'fsd',
//       price: 12000,
//       features: ['All Enhanced Autopilot features', 'Traffic Light Recognition', 'Stop Sign Recognition']
//     }
//   ],
//   extras: [
//     {
//       name: 'Premium Connectivity',
//       price: 99,
//       description: 'Streaming media & live traffic visualization'
//     },
//     {
//       name: 'Extended Service Agreement',
//       price: 5000,
//       description: '4 years or 50,000 miles coverage'
//     }
//   ]
// };
const teslaProducts = {
  model_3: {
    brand: "Tesla",
    product_name: "Model 3",
    model: "Model 3",
    category: "automotive",
    SourceCategory: "Electric",
    origin: "USA",
    seller: "Gulime",
    stock: "In Stock",
    imgUrl: "model_3.png",
    description: "Tesla Model 3 – the affordable electric sedan with long range and great performance.",
    price: 42990,
    range: "363 mi",
    acceleration: "4.9 sec",
    topSpeed: "125 mph",
    colors: [
      { name: "Stealth Grey Paint", code: "stealth-grey", hex: "#4B4B4B", price: 0 }
    ],
    wheels: [
      { name: '18" Photon Wheels', code: "18-photon", price: 0 }
    ],
    interiors: [
      { name: "Black Premium Interior", code: "black", price: 0 }
    ],
    autopilot: [
      {
        name: "Standard",
        code: "nofsd",
        features: [
          "Traffic-Aware Cruise Control",
          "Autosteer on highways (lane centering)"
        ],
        price: 0
      },
      {
        name: "Full Self-Driving (Supervised)",
        code: "fsd",
        features: [
          "Navigate on Autopilot",
          "Autosteer on City Streets",
          "Traffic Light and Stop Sign Control"
        ],
        price: 8000
      }
    ],
    extras: [
      {
        name: "Extended Service Agreement",
        price: 5000,
        description: "4 years / 50,000 total miles"
      }
    ]
  }
};


async function uploadProducts() {
  try {
   




    for (const [id, product] of Object.entries(teslaProducts)) {
      const productRef = doc(db, "automotive", id);
      await setDoc(productRef, product);
      console.log(`✅ Uploaded: ${product.model}`);
    }

  

  } catch (err) {
    console.error("❌ Upload error:", err);
  }
}

uploadProducts();
