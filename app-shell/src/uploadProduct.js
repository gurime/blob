// uploadProduct.js
import dotenv from 'dotenv';
dotenv.config();

import { doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./db/firebase.js";

const fullProduct = {
  brand: "Apple",
  model: "iPad 11th Generation",
  category: "Tablets",
  SourceCategory: "Electronics",
  weight: "1.2 lbs",
  dimensions: "10 x 7 x 0.3 inches",
  origin: "USA",
  product_name: "Apple iPad 11-inch: A16 chip, 11-inch Model, Liquid Retina Display",
  price: 299,
  rating: 4,
  screen_size: "11 Inches",
  seller: "Gulime",
  stock: "In Stock",
  gpremium: "gulimepremium.png",
  imgUrl: "ipad.png",
  imgUrl1: "ipad_thumb1.png",
  imgUrl2: "ipad_thumb2.png",
  imgUrl3: "ipad_thumb3.png",
  imgUrl4: "ipad_thumb4.png",
  imgUrl5: "ipad_thumb5.png",
  description: "All-screen design iPad with the superfast A16 chip and stunning 11-inch Liquid Retina display. Perfect for getting things done, expressing yourself, and staying immersed in your favorite activities.",
  description1: "Experience the perfect blend of innovation and performance with this premium Apple iPad 11-inch (A16, 2025)...",
  description2: "This product offers exceptional performance...",
  description3: "The Apple iPad 11-inch (A16, 2025) represents the pinnacle of tablet technology...",
  descritpion5: "Built with advanced features including support for Apple Pencil (2nd generation)...",
  cameraDetails: "12MP Wide camera, 12MP Ultra Wide front camera with Center Stage",
  chipDetails: "A16 Bionic chip with 6-core CPU, 5-core GPU, and 16-core Neural Engine",
  connectivityDetails: "Wi-Fi 6E, Bluetooth 5.3, USB-C with support for Thunderbolt / USB 4",
  displayDetails: "11-inch Liquid Retina display with 2388×1668 resolution at 264 pixels per inch",
  display_resolution: "2360-by-1640-pixel resolution at 264 (ppi) Pixels",
  storageDetails: "Available in 128GB, 256GB, 512GB, and 1TB configurations",
  useCase1: "Creative professionals and digital artists",
  useCase2: "Students and educators",
  useCase3: "Business professionals and remote workers",
  useCase4: "Entertainment and media consumption",
  useCase5: "Gaming and interactive experiences",
  totalReviews: 1,
  boxItem1: "iPad 11-inch (A16, 2025)",
  boxItem2: "USB-C Charge Cable (1 meter)",
  boxItem3: "20W USB-C Power Adapter",
  boxItem4: "Documentation and Quick Start Guide",
  availableColors: {
    colors: [
      {
        name: "Blue",
        code: "blue",
        hex: "#0000FF",
        available: true
      },
      {
        name: "Silver",
        code: "silver",
        hex: "#C0C0C0",
        available: true
      },
      {
        name: "Pink",
        code: "pink",
        hex: "#FFC0CB",
        available: true
      },
      {
        name: "Yellow",
        code: "yellow",
        hex: "#FFFF00",
        available: true
      }
    ]
  },
  storageOptions: {
    storage: [
      {
        available: true,
        size: 128,
        price: 0,
        popular: false,
        displayStorageName: "Apple iPad 11-inch: A16 chip, 11-inch Model, Liquid Retina Display, 128GB"
      },
      {
        available: true,
        size: "256",
        price: 100,
        popular: true,
        displayStorageName: "Apple iPad 11-inch: A16 chip, 11-inch Model, Liquid Retina Display, 256GB"
      },
      {
        available: true,
        size: 512,
        price: 200,
        popular: true,
        displayStorageName: "Apple iPad 11-inch: A16 chip, 11-inch Model, Liquid Retina Display, 512GB"
      }
    ]
  },
  
  // Technical Specifications
  specifications: {
    display: {
      type: "Liquid Retina display",
      technology: "LED backlit Multi-Touch display with IPS technology",
      resolution: "2360-by-1640-pixel resolution at 264 ppi",
      features: [
        "True Tone",
        "500 nits brightness",
        "Fingerprint-resistant oleophobic coating"
      ],
      pencilSupport: [
        "Supports Apple Pencil (USB-C)",
        "Supports Apple Pencil (1st generation)"
      ]
    },
    
    chip: {
      model: "A16 chip",
      cpu: "5-core CPU",
      gpu: "4-core GPU",
      neuralEngine: "16-core Neural Engine"
    },
    
    camera: {
      main: {
        megapixels: "12MP Wide camera",
        aperture: "ƒ/1.8 aperture",
        zoom: "Digital zoom up to 5x",
        lens: "Five-element lens",
        features: [
          "Autofocus with Focus Pixels",
          "Panorama (up to 63MP)",
          "Smart HDR 4",
          "Photo geotagging",
          "Auto image stabilization",
          "Burst mode"
        ],
        formats: "HEIF and JPEG"
      },
      front: {
        type: "Landscape 12MP Center Stage camera",
        aperture: "ƒ/2.4 aperture",
        features: [
          "Smart HDR 4",
          "Lens correction",
          "Retina Flash",
          "Auto image stabilization",
          "Burst mode"
        ]
      }
    },
    
    videoRecording: {
      main: {
        formats: "HEVC and H.264",
        capabilities: [
          "4K video recording at 24 fps, 25 fps, 30 fps, or 60 fps",
          "1080p HD video recording at 25 fps, 30 fps, or 60 fps",
          "720p HD video recording at 30 fps or 60 fps",
          "Slo-mo video support for 1080p at 120 fps or 240 fps",
          "Time-lapse video with stabilization",
          "Extended dynamic range for video up to 30 fps",
          "Video image stabilization",
          "Cinematic video stabilization (1080p and 720p)",
          "Continuous autofocus video",
          "Playback zoom"
        ]
      },
      front: {
        capabilities: [
          "1080p HD video recording at 25 fps, 30 fps, or 60 fps",
          "Time-lapse video with stabilization",
          "Extended dynamic range for video up to 30 fps",
          "Cinematic video stabilization (1080p and 720p)"
        ]
      }
    },
    
    communications: {
      videoCalling: [
        "FaceTime video",
        "Center Stage",
        "iPad to any FaceTime-enabled device over Wi-Fi or cellular"
      ],
      audioCalling: [
        "FaceTime audio",
        "iPad to any FaceTime-enabled device over Wi-Fi or cellular"
      ]
    },
    
    audio: {
      speakers: "Landscape stereo speakers",
      microphones: "Dual microphones for calls, video recording, and audio recording"
    },
    
    connectivity: {
      allModels: [
        "Wi-Fi 6 (802.11ax) with 2x2 MIMO",
        "Simultaneous dual band",
        "Bluetooth 5.3"
      ],
      cellularModels: [
        "5G (sub-6 GHz) with 4x4 MIMO",
        "Gigabit LTE with 4x4 MIMO"
      ]
    },
    
    sensors: [
      "Touch ID",
      "Three-axis gyro",
      "Accelerometer",
      "Barometer",
      "Ambient light sensor"
    ],
    
    touchId: {
      capabilities: [
        "Unlock iPad",
        "Secure personal data within apps",
        "Make purchases from the iTunes Store, App Store, and Apple Books"
      ]
    },
    
    charging: {
      port: "USB-C port",
      supports: [
        "Charging",
        "DisplayPort",
        "USB 2.0 (up to 480 Mb/s)"
      ]
    },
    
    displaySupport: {
      internal: "Supports full native resolution on the built-in display at millions of colors",
      external: "Supports one external display with up to 4K resolution at 60Hz",
      outputs: [
        "Digital video output",
        "Native DisplayPort output over USB-C",
        "VGA, HDMI, and DVI output supported using adapters (sold separately)"
      ],
      airplay: [
        "Video mirroring",
        "Up to 4K AirPlay for mirroring, photos, and video out to Apple TV (2nd generation or later) or AirPlay-enabled smart TV",
        "Video mirroring and video out support through USB-C Digital AV Multiport Adapter and USB-C VGA Multiport Adapter (adapters sold separately)"
      ]
    }
  }
};

async function uploadProduct() {
  try {
    // Sign in with email and password
    // Add these to your .env file
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    
    if (!email || !password) {
      throw new Error("Admin credentials not found in environment variables");
    }
    
    console.log("🔐 Authenticating...");
    await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Authentication successful");
    
    // Upload the product
    const productRef = doc(db, "products", "ipad-11-2025-a16");
    await setDoc(productRef, fullProduct);
    console.log("✅ Product uploaded successfully.");
    
    // Sign out after upload
    await auth.signOut();
    console.log("🔓 Signed out successfully");
    
  } catch (err) {
    console.error("❌ Upload error:", err);
  }
}

uploadProduct();