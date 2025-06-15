// uploadProduct.js
import dotenv from 'dotenv';
dotenv.config();

import { doc, setDoc } from "firebase/firestore";
import { db } from "./db/firebase.js";

const sharedOptions = {
  colors: [
    { name: 'Pearl White Multi-Coat', code: 'pearl-white', price: 0, hex: '#FFFFFF' },
    { name: 'Solid Black', code: 'solid-black', price: 1000, hex: '#000000' },
    { name: 'Midnight Silver Metallic', code: 'midnight-silver', price: 1000, hex: '#5C5C5C' },
    { name: 'Deep Blue Metallic', code: 'deep-blue', price: 1000, hex: '#1E3A8A' },
    { name: 'Red Multi-Coat', code: 'red-multi', price: 2000, hex: '#DC2626' }
  ],
  wheels: [
    { name: '19" Tempest Wheels', code: '19-tempest', price: 0 },
    { name: '21" Arachnid Wheels', code: '21-arachnid', price: 4500 }
  ],
  interiors: [
    { name: 'All Black', code: 'black', price: 0 },
    { name: 'Black and White', code: 'black-white', price: 1000 },
    { name: 'Cream', code: 'cream', price: 1000 }
  ],
  autopilot: [
    {
      name: 'Basic Autopilot',
      code: 'basic',
      price: 0,
      features: ['Traffic-Aware Cruise Control', 'Autosteer']
    },
    {
      name: 'Enhanced Autopilot',
      code: 'enhanced',
      price: 6000,
      features: ['Navigate on Autopilot', 'Auto Lane Change', 'Autopark', 'Summon']
    },
    {
      name: 'Full Self-Driving',
      code: 'fsd',
      price: 12000,
      features: ['All Enhanced Autopilot features', 'Traffic Light Recognition', 'Stop Sign Recognition']
    }
  ],
  extras: [
    {
      name: 'Premium Connectivity',
      price: 99,
      description: 'Streaming media & live traffic visualization'
    },
    {
      name: 'Extended Service Agreement',
      price: 5000,
      description: '4 years or 50,000 miles coverage'
    }
  ]
};

const teslaProducts = {
  model_s: {
    brand: "Tesla",
    product_name: "Model S",
    model: "Model S",
    category: "Automobiles",
    SourceCategory: "Electric Vehicles",
    origin: "USA",
    seller: "Gulime",
    stock: "In Stock",
    imgUrl: "model_s.png",
    description: "Tesla Model S – luxury electric sedan with unmatched performance and technology.",
    price: 74990,
    range: '405 mi',
    acceleration: '3.1s',
    topSpeed: '149 mph',
    ...sharedOptions
  },
  model_3: {
    brand: "Tesla",
    product_name:"Model 3",
    model: "Model 3",
    category: "Automobiles",
    SourceCategory: "Electric Vehicles",
    origin: "USA",
    seller: "Gulime",
    stock: "In Stock",
    imgUrl: "model_3.png",
    description: "Tesla Model 3 – affordable and efficient, setting the standard for electric sedans.",
    price: 39990,
    range: '358 mi',
    acceleration: '5.8s',
    topSpeed: '140 mph',
    ...sharedOptions
  },
  model_x: {
    brand: "Tesla",
    product_name:'Model X',
    model: "Model X",
    category: "Automobiles",
    SourceCategory: "Electric Vehicles",
    origin: "USA",
    seller: "Gulime",
    stock: "In Stock",
    imgUrl: "model_x.png",
    description: "Tesla Model X – premium electric SUV with Falcon Wing doors and AWD.",
    price: 89990,
    range: '348 mi',
    acceleration: '2.5s',
    topSpeed: '155 mph',
    ...sharedOptions
  },
  model_y: {
    brand: "Tesla",
    product_name:"ModelY",
    model: "Model Y",
    category: "Automobiles",
    SourceCategory: "Electric Vehicles",
    origin: "USA",
    seller: "Gulime",
    stock: "In Stock",
    imgUrl: "model_y.png",
    description: "Tesla Model Y – a versatile electric SUV with great range and storage.",
    price: 47990,
    range: '330 mi',
    acceleration: '4.8s',
    topSpeed: '135 mph',
    ...sharedOptions
  }
};

async function uploadProducts() {
  try {
   




    for (const [id, product] of Object.entries(teslaProducts)) {
      const productRef = doc(db, "featuredProducts", id);
      await setDoc(productRef, product);
      console.log(`✅ Uploaded: ${product.model}`);
    }

  

  } catch (err) {
    console.error("❌ Upload error:", err);
  }
}

uploadProducts();
