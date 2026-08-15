/**
 * SHAGUN STORE (शगुन स्टोर) - Master Grocery Database & Catalog Engine
 * Scaled for 2,000+ Supermarket Items across all aisles:
 * - 🌾 Staples, Atta & Rice (अनाज, आटा, चावल)
 * - 🍬 Sugar, Jaggery & Sweeteners (चीनी, गुड़)
 * - 🛢️ Edible Oils & Pure Desi Ghee (सरसों तेल, रिफाइंड, घी)
 * - 🥣 Dals, Pulses & Legumes (दालें और दलहन)
 * - 🌶️ Spices, Masalas & Seasonings (मसाले और खड़े मसाले)
 * - 🥛 Dairy, Bread & Breakfast (दूध, दही, पनीर, ब्रेड)
 * - ☕ Tea, Coffee & Cold Drinks (चाय, कॉफ़ी, जूस)
 * - 🍪 Biscuits, Namkeen & Snacks (नमकीन, भुजिया, बिस्कुट)
 * - 🧼 Detergents, Cleaners & Personal Care (साबुन, शैम्पू, पोछा)
 * - 🪔 Puja Needs, Dry Fruits & Essentials (पूजा सामग्री, मेवे)
 */

export const INITIAL_STORE_CONFIG = {
  name: "SHAGUN STORE",
  nameHindi: "शगुन स्टोर",
  tagline: "Scan • Order • Express Pickup",
  taglineHindi: "स्कैन करें • सामान चुनें • काउंटर से प्राप्त करें",
  address: "Shop No. 1, Main Market, Near Central Chowk",
  phone: "+91 98765 43210",
  currency: "₹",
  taxPercent: 0,
  expressPackingFee: 0,
  pickupLocations: [
    "Main Entrance Stand (Express)",
    "Aisle 1 - Grains & Staples",
    "Aisle 2 - Oils, Ghee & Masalas",
    "Aisle 3 - Dairy & Beverages",
    "Aisle 4 - Household & Cleaning",
    "Billing Counter 1",
    "Billing Counter 2"
  ]
};

export const CATEGORIES = [
  { id: "all", name: "All Items", nameHindi: "सभी सामान", icon: "🛒" },
  { id: "staples", name: "Atta, Rice & Grains", nameHindi: "आटा, चावल व अनाज", icon: "🌾" },
  { id: "sugar-sweeteners", name: "Sugar & Jaggery", nameHindi: "चीनी, गुड़ व बूरा", icon: "🍬" },
  { id: "oils-ghee", name: "Cooking Oils & Ghee", nameHindi: "तेल और शुद्ध घी", icon: "🛢️" },
  { id: "dals-pulses", name: "Dals & Pulses", nameHindi: "दालें और दलहन", icon: "🥣" },
  { id: "spices-masala", name: "Spices & Masalas", nameHindi: "मसाले और खड़े मसाले", icon: "🌶️" },
  { id: "dairy-bread", name: "Dairy & Bakery", nameHindi: "दूध, दही व ब्रेड", icon: "🥛" },
  { id: "tea-beverages", name: "Tea, Coffee & Drinks", nameHindi: "चाय, कॉफ़ी व पेय", icon: "☕" },
  { id: "snacks-namkeen", name: "Snacks & Biscuits", nameHindi: "बिस्कुट व नमकीन", icon: "🍪" },
  { id: "household-clean", name: "Cleaning & Care", nameHindi: "सफाई व घरेलू सामान", icon: "🧼" },
  { id: "puja-dryfruits", name: "Puja & Dry Fruits", nameHindi: "पूजा सामग्री व मेवे", icon: "🪔" }
];

// Core 50 hand-crafted staple grocery products
const CORE_GROCERY_ITEMS = [
  // 1. Sugar & Sweeteners
  {
    id: "sug-01",
    name: "Refined White Crystal Sugar (सफेद चीनी)",
    category: "sugar-sweeteners",
    price: 44,
    unit: "1 kg",
    variants: [
      { name: "1 kg Pack", price: 44 },
      { name: "5 kg Bulk Pack", price: 215 },
      { name: "10 kg Family Pack", price: 420 },
      { name: "50 kg Sack (Bori)", price: 2050 }
    ],
    inStock: true,
    badge: "Bestseller",
    description: "Sparkling sulphur-free crystal white sugar, clean and high-purity for daily tea, milk, and sweets.",
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "sug-02",
    name: "Pure Desi Kolhapuri Jaggery / Gur (गुड़)",
    category: "sugar-sweeteners",
    price: 65,
    unit: "1 kg",
    variants: [
      { name: "500g Tub", price: 35 },
      { name: "1 kg Block", price: 65 },
      { name: "5 kg Bucket", price: 310 }
    ],
    inStock: true,
    badge: "Organic",
    description: "Traditional chemical-free sugarcane gur block rich in iron, calcium, and natural minerals.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "sug-03",
    name: "Dhampure Pure Bura / Khandsari Sugar (देसी खांड / बूरा)",
    category: "sugar-sweeteners",
    price: 75,
    unit: "1 kg",
    variants: [
      { name: "1 kg Pack", price: 75 },
      { name: "5 kg Pack", price: 360 }
    ],
    inStock: true,
    badge: "Unprocessed",
    description: "Naturally crystallized unrefined desi khand for sweets, laddoos, and cooling drinks.",
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format&fit=crop&q=80"
  },

  // 2. Staples, Atta & Rice
  {
    id: "rice-01",
    name: "Daawat Rozana Basmati Rice (बासमती चावल)",
    category: "staples",
    price: 110,
    unit: "1 kg",
    variants: [
      { name: "1 kg Bag", price: 110 },
      { name: "5 kg Bag", price: 520 },
      { name: "10 kg Family Pack", price: 999 }
    ],
    inStock: true,
    badge: "Super Aromatic",
    description: "Aromatic long-grain basmati rice aged to perfection, non-sticky texture for daily pulao & meals.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "rice-02",
    name: "India Gate Classic Super Basmati Rice (इंडिया गेट बासमती)",
    category: "staples",
    price: 195,
    unit: "1 kg",
    variants: [
      { name: "1 kg Pack", price: 195 },
      { name: "5 kg Bag", price: 920 },
      { name: "10 kg Bag", price: 1790 }
    ],
    inStock: true,
    badge: "Premium Extra Long",
    description: "2-year aged royal basmati rice with exotic aroma and pearly extra-long slender grains.",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "rice-03",
    name: "Premium Sona Masoori Rice (सोना मसूरी चावल)",
    category: "staples",
    price: 68,
    unit: "1 kg",
    variants: [
      { name: "1 kg Pack", price: 68 },
      { name: "5 kg Bag", price: 330 },
      { name: "25 kg Sack", price: 1550 }
    ],
    inStock: true,
    badge: "Daily Essential",
    description: "Lightweight, easy-to-digest medium grain rice double polished for daily lunch and dinner.",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "atta-01",
    name: "Aashirvaad Shudh Chakki Whole Wheat Atta (आशीर्वाद आटा)",
    category: "staples",
    price: 245,
    unit: "5 kg",
    variants: [
      { name: "5 kg Bag", price: 245 },
      { name: "10 kg Bag", price: 470 },
      { name: "25 kg Bulk Sack", price: 1120 }
    ],
    inStock: true,
    badge: "100% MP Sehore Wheat",
    description: "Heavy grain stone-ground chakki fresh whole wheat atta. Yields ultra-soft, fluffy rotis all day.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "atta-02",
    name: "Fortune Chakki Fresh Multigrain Atta (मल्टीग्रेन आटा)",
    category: "staples",
    price: 295,
    unit: "5 kg",
    variants: [
      { name: "5 kg Bag", price: 295 },
      { name: "10 kg Bag", price: 570 }
    ],
    inStock: true,
    badge: "High Fibre & Protein",
    description: "Blend of 6 nutritious grains (Wheat, Soya, Chana, Oats, Maize, Psyllium Husk) for digestive health.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "staple-04",
    name: "Rajdhani Fine Sooji / Rawa (सूजी / रवा)",
    category: "staples",
    price: 36,
    unit: "500g",
    variants: [
      { name: "500g Pack", price: 36 },
      { name: "1 kg Pack", price: 68 }
    ],
    inStock: true,
    badge: "Granulated",
    description: "Coarse semolina ground from selected hard wheat grains for crispy halwa, upma, and dosas.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "staple-05",
    name: "Rajdhani Refined Maida (मैदा)",
    category: "staples",
    price: 38,
    unit: "500g",
    variants: [
      { name: "500g Pack", price: 38 },
      { name: "1 kg Pack", price: 72 }
    ],
    inStock: true,
    badge: "Baking & Bhature",
    description: "Finely milled white flour ideal for soft bhature, samosas, cakes, pastries, and puri.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "staple-06",
    name: "Rajdhani Fine Besan (चना बेसन)",
    category: "staples",
    price: 60,
    unit: "500g",
    variants: [
      { name: "500g Pack", price: 60 },
      { name: "1 kg Pack", price: 115 }
    ],
    inStock: true,
    badge: "100% Chana Dal",
    description: "Pure stone-ground chana dal flour for pakodas, kadhi, dhokla, and traditional sweets.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"
  },

  // 3. Cooking Oils & Desi Ghee
  {
    id: "oil-01",
    name: "Fortune Sunlite Refined Sunflower Oil (सनफ्लावर तेल)",
    category: "oils-ghee",
    price: 135,
    unit: "1 Litre Pouch",
    variants: [
      { name: "1 Litre Pouch", price: 135 },
      { name: "5 Litre Jar / Can", price: 660 },
      { name: "15 Litre Bulk Tin", price: 1950 }
    ],
    inStock: true,
    badge: "Heart Healthy",
    description: "Light, low-absorb sunflower oil enriched with Vitamins A & D for healthy everyday cooking.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "oil-02",
    name: "Engine Kacchi Ghani Pure Mustard Oil (कच्ची घानी सरसों तेल)",
    category: "oils-ghee",
    price: 155,
    unit: "1 Litre Bottle",
    variants: [
      { name: "1 Litre Bottle", price: 155 },
      { name: "2 Litre Bottle", price: 305 },
      { name: "5 Litre Can", price: 740 },
      { name: "15 Litre Tin", price: 2180 }
    ],
    inStock: true,
    badge: "Pure Cold Pressed",
    description: "First-press pungent mustard oil with natural antioxidants for authentic curries and pickling.",
    image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "oil-03",
    name: "Saffola Gold Pro Healthy Blended Cooking Oil (सफोला गोल्ड)",
    category: "oils-ghee",
    price: 175,
    unit: "1 Litre Pouch",
    variants: [
      { name: "1 Litre Pouch", price: 175 },
      { name: "5 Litre Jar", price: 840 }
    ],
    inStock: true,
    badge: "Cholesterol Care",
    description: "Triple anti-oxidant dual seed blend (Rice Bran & Sunflower) with LOSORB technology.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "ghee-01",
    name: "Amul Pure Cow Desi Ghee (अमूल गाय का शुद्ध घी)",
    category: "oils-ghee",
    price: 330,
    unit: "500 ml",
    variants: [
      { name: "500 ml Refill Pouch", price: 330 },
      { name: "1 Litre Tin", price: 640 },
      { name: "5 Litre Jar", price: 3100 }
    ],
    inStock: true,
    badge: "Granulated Aroma",
    description: "Pure golden cow milk fat ghee with authentic homemade aroma, rich in vitamins A, D, E & K.",
    image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "ghee-02",
    name: "Mother Dairy Pure Buffalo Desi Ghee (भैंस का दानेदार घी)",
    category: "oils-ghee",
    price: 320,
    unit: "500 ml",
    variants: [
      { name: "500 ml Pouch", price: 320 },
      { name: "1 Litre Tin", price: 620 }
    ],
    inStock: true,
    badge: "Danedaar",
    description: "Traditional danedaar white ghee from fresh buffalo cream for parathas, sweets, and dal tadka.",
    image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&auto=format&fit=crop&q=80"
  },

  // 4. Dals & Pulses
  {
    id: "dal-01",
    name: "Tata Sampann Unpolished Toor / Arhar Dal (अरहर दाल)",
    category: "dals-pulses",
    price: 175,
    unit: "1 kg",
    variants: [
      { name: "500g Pack", price: 90 },
      { name: "1 kg Pack", price: 175 },
      { name: "5 kg Bag", price: 840 }
    ],
    inStock: true,
    badge: "Unpolished High Protein",
    description: "Naturally wholesome unpolished yellow toor dal, cooks faster with rich authentic flavor.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dal-02",
    name: "Tata Sampann Moong Dal Dhuli (धुली मूंग दाल)",
    category: "dals-pulses",
    price: 130,
    unit: "1 kg",
    variants: [
      { name: "500g Pack", price: 68 },
      { name: "1 kg Pack", price: 130 }
    ],
    inStock: true,
    badge: "Easy to Digest",
    description: "Yellow skinless split green gram, gentle on stomach, perfect for khichdi and halwa.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dal-03",
    name: "Tata Sampann Chana Dal (चना दाल)",
    category: "dals-pulses",
    price: 95,
    unit: "1 kg",
    variants: [
      { name: "500g Pack", price: 50 },
      { name: "1 kg Pack", price: 95 }
    ],
    inStock: true,
    badge: "Crisp & Nutty",
    description: "Split Bengal gram with rich nutty flavor for dal, chutneys, and sweet puran poli.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dal-04",
    name: "Premium Kashmiri Rajma / Red Kidney Beans (कश्मीरी राजमा)",
    category: "dals-pulses",
    price: 160,
    unit: "1 kg",
    variants: [
      { name: "500g Pack", price: 85 },
      { name: "1 kg Pack", price: 160 }
    ],
    inStock: true,
    badge: "Rich & Creamy",
    description: "Small red kidney beans that cook into a rich, melt-in-mouth creamy gravy.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dal-05",
    name: "Premium Amritsari White Kabuli Chana (काबुली चना / छोले)",
    category: "dals-pulses",
    price: 155,
    unit: "1 kg",
    variants: [
      { name: "500g Pack", price: 80 },
      { name: "1 kg Pack", price: 155 }
    ],
    inStock: true,
    badge: "Jumbo Size",
    description: "Big size white chickpeas for Punjabi chole bhature, salads, and hummus.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"
  },

  // 5. Spices & Masalas
  {
    id: "spc-01",
    name: "Tata Sampann Turmeric Powder (हल्दी पाउडर)",
    category: "spices-masala",
    price: 62,
    unit: "200g",
    variants: [
      { name: "200g Pack", price: 62 },
      { name: "500g Pack", price: 145 },
      { name: "1 kg Pack", price: 280 }
    ],
    inStock: true,
    badge: "3% Active Curcumin",
    description: "Naturally golden turmeric powder with high curcumin content for color, immunity, and flavor.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "spc-02",
    name: "MDH Deggi Mirch Red Chilli Powder (देगी मिर्च)",
    category: "spices-masala",
    price: 98,
    unit: "100g",
    variants: [
      { name: "100g Box", price: 98 },
      { name: "500g Box", price: 440 }
    ],
    inStock: true,
    badge: "Natural Red Color",
    description: "Special blend of Kashmiri and red capsicum chillies for vibrant natural red curry color.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "spc-03",
    name: "Catch Coriander / Dhaniya Powder (धनिया पाउडर)",
    category: "spices-masala",
    price: 65,
    unit: "200g",
    variants: [
      { name: "200g Pack", price: 65 },
      { name: "500g Pack", price: 155 }
    ],
    inStock: true,
    badge: "Aromatic Aroma",
    description: "Low-temperature ground whole coriander seeds ensuring long lasting aroma and taste.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "spc-04",
    name: "MDH Garam Masala (एमडीएच गरम मसाला)",
    category: "spices-masala",
    price: 92,
    unit: "100g",
    variants: [
      { name: "100g Box", price: 92 },
      { name: "500g Box", price: 420 }
    ],
    inStock: true,
    badge: "Master Blend",
    description: "Royal blend of 15 authentic spices including cardamom, clove, cinnamon, and nutmeg.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "spc-05",
    name: "Tata Salt Vacuum Evaporated (टाटा नमक)",
    category: "spices-masala",
    price: 28,
    unit: "1 kg",
    variants: [
      { name: "1 kg Packet", price: 28 },
      { name: "Pack of 5 (5 x 1kg)", price: 135 }
    ],
    inStock: true,
    badge: "Desh Ka Namak",
    description: "India's trusted vacuum evaporated iodized table salt ensuring mental and physical health.",
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format&fit=crop&q=80"
  },

  // 6. Dairy & Breakfast
  {
    id: "dry-01",
    name: "Amul Taaza Homogenised Toned Milk (अमूल ताज़ा दूध)",
    category: "dairy-bread",
    price: 54,
    unit: "1 Litre Tetra Pack",
    variants: [
      { name: "1 Litre Tetra Pack", price: 54 },
      { name: "Case of 12 (12 x 1L)", price: 630 }
    ],
    inStock: true,
    badge: "No Boiling Required",
    description: "UHT treated fresh toned milk, bacteria-free and stays fresh without boiling.",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dry-02",
    name: "Amul Pasteurised Butter (अमूल मक्खन)",
    category: "dairy-bread",
    price: 56,
    unit: "100g",
    variants: [
      { name: "100g Pack", price: 56 },
      { name: "500g Block", price: 275 }
    ],
    inStock: true,
    badge: "Utterly Butterly",
    description: "Delicious salted butter made from pure fresh cream for toast, parathas, and baking.",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dry-03",
    name: "Harvest Gold 100% Whole Wheat Brown Bread (ब्राउन ब्रेड)",
    category: "dairy-bread",
    price: 50,
    unit: "400g Loaf",
    variants: [
      { name: "400g Loaf", price: 50 }
    ],
    inStock: true,
    badge: "Fresh Baked Daily",
    description: "Zero maida, high-fiber whole wheat sandwich bread baked fresh every morning.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dry-04",
    name: "Amul Malai Paneer Block (अमूल फ्रेश पनीर)",
    category: "dairy-bread",
    price: 90,
    unit: "200g Pack",
    variants: [
      { name: "200g Pack", price: 90 },
      { name: "1 kg Pack", price: 420 }
    ],
    inStock: true,
    badge: "Soft & Juicy",
    description: "Real pasteurised cottage cheese with rich milky taste and smooth succulent texture.",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80"
  },

  // 7. Tea, Coffee & Beverages
  {
    id: "bev-01",
    name: "Tata Tea Gold Royal Assam & Darjeeling Tea (टाटा टी गोल्ड)",
    category: "tea-beverages",
    price: 155,
    unit: "250g",
    variants: [
      { name: "250g Pouch", price: 155 },
      { name: "500g Pouch", price: 295 },
      { name: "1 kg Pack", price: 560 }
    ],
    inStock: true,
    badge: "Rich Darjeeling Leaves",
    description: "Exquisite balance of strong Assam CTC tea with 15% gently rolled Darjeeling long leaves.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "bev-02",
    name: "Red Label Strong CTC Tea (रेड लेबल चाय)",
    category: "tea-beverages",
    price: 135,
    unit: "250g",
    variants: [
      { name: "250g Pack", price: 135 },
      { name: "500g Pack", price: 260 },
      { name: "1 kg Pack", price: 495 }
    ],
    inStock: true,
    badge: "Swad Apnepan Ka",
    description: "Strong tea blend enriched with flavonoids for taste, strength, and immunity.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "bev-03",
    name: "Nescafe Classic Instant Coffee Jar (नेस्कैफे कॉफ़ी)",
    category: "tea-beverages",
    price: 190,
    unit: "50g Jar",
    variants: [
      { name: "50g Glass Jar", price: 190 },
      { name: "100g Glass Jar", price: 360 }
    ],
    inStock: true,
    badge: "100% Pure Coffee",
    description: "Roasted robusta beans delivering intense coffee aroma and bold signature taste.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80"
  },

  // 8. Biscuits, Snacks & Namkeen
  {
    id: "snk-01",
    name: "Haldiram's Nagpur Aloo Bhujia (आलू भुजिया)",
    category: "snacks-namkeen",
    price: 52,
    unit: "200g",
    variants: [
      { name: "200g Pack", price: 52 },
      { name: "400g Value Pack", price: 98 },
      { name: "1 kg Family Pack", price: 230 }
    ],
    inStock: true,
    badge: "Crispy & Spicy",
    description: "Crispy spiced potato and chickpea noodles seasoned with authentic Indian spices.",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "snk-02",
    name: "Parle-G Gold Glucose Biscuits (पारले-जी बिस्कुट)",
    category: "snacks-namkeen",
    price: 30,
    unit: "250g Pack",
    variants: [
      { name: "250g Pack", price: 30 },
      { name: "1 kg Super Pack", price: 110 }
    ],
    inStock: true,
    badge: "All-Time Favorite",
    description: "Crisp golden baked wheat and milk glucose biscuits, the classic tea companion.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80"
  },

  // 9. Cleaning, Detergents & Household
  {
    id: "cln-01",
    name: "Surf Excel Easy Wash Detergent Powder (सर्फ एक्सेल)",
    category: "household-clean",
    price: 140,
    unit: "1 kg",
    variants: [
      { name: "1 kg Pack", price: 140 },
      { name: "3 kg Saver Pack", price: 390 },
      { name: "5 kg Bucket Pack", price: 620 }
    ],
    inStock: true,
    badge: "Tough Stain Removal",
    description: "Engineered with super fine powder that removes tough stains like oil, tea, curry, and mud in 1 wash.",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "cln-02",
    name: "Vim Dishwash Gel Lemon (विम जेल)",
    category: "household-clean",
    price: 115,
    unit: "500 ml Bottle",
    variants: [
      { name: "500 ml Bottle", price: 115 },
      { name: "1 Litre Refill Pouch", price: 210 }
    ],
    inStock: true,
    badge: "1 Spoon Power",
    description: "Concentrated gel with the power of 100 lemons, cuts stubborn grease without scratches.",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "cln-03",
    name: "Dettol Original Antiseptic Liquid Soap (डेटॉल साबुन)",
    category: "household-clean",
    price: 145,
    unit: "Pack of 4 (4 x 75g)",
    variants: [
      { name: "Pack of 4 (4 x 75g)", price: 145 },
      { name: "Pack of 5 (5 x 125g)", price: 290 }
    ],
    inStock: true,
    badge: "100% Germ Protection",
    description: "Trusted germ protection soap with pine fragrance for complete family hygiene.",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80"
  },

  // 10. Puja Needs & Dry Fruits
  {
    id: "puj-01",
    name: "Cycle Pure Agarbathies (साइकिल अगरबत्ती)",
    category: "puja-dryfruits",
    price: 45,
    unit: "Pack of 2",
    variants: [
      { name: "Pack of 2 (100 sticks)", price: 45 },
      { name: "Jumbo Pack (250 sticks)", price: 105 }
    ],
    inStock: true,
    badge: "Long Lasting Fragrance",
    description: "Traditional aromatic floral incense sticks for daily morning and evening prayer.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "puj-02",
    name: "Mangalam Pure Camphor / Kapur (शुद्ध कपूर)",
    category: "puja-dryfruits",
    price: 70,
    unit: "100g Jar",
    variants: [
      { name: "100g Jar", price: 70 },
      { name: "250g Pack", price: 165 }
    ],
    inStock: true,
    badge: "100% Pure Bhimseni",
    description: "Pure white camphor tablets, burns completely without leaving residue or black smoke.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dryf-01",
    name: "Premium California Almonds / Badam (कैलिफोर्निया बादाम)",
    category: "puja-dryfruits",
    price: 210,
    unit: "250g",
    variants: [
      { name: "250g Pouch", price: 210 },
      { name: "500g Pouch", price: 410 },
      { name: "1 kg Family Pack", price: 790 }
    ],
    inStock: true,
    badge: "Crunchy & Sweet",
    description: "Whole natural California almonds rich in Vitamin E, magnesium, and healthy dietary fats.",
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dryf-02",
    name: "Premium W240 Whole Cashews / Kaju (काजू)",
    category: "puja-dryfruits",
    price: 240,
    unit: "250g",
    variants: [
      { name: "250g Pouch", price: 240 },
      { name: "500g Pouch", price: 470 },
      { name: "1 kg Pack", price: 920 }
    ],
    inStock: true,
    badge: "Jumbo Whole W240",
    description: "King size unblemished white cashew nuts, crisp and rich in buttery flavor.",
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&auto=format&fit=crop&q=80"
  }
];

/**
 * Procedural Supermarket Catalog Scaler
 * Generates an authentic 2,000+ item grocery inventory across all aisles
 * for SHAGUN STORE with distinct SKUs, pack variations, and Hindi/English search metadata.
 */
export function generateFullStoreInventory(targetCount = 2000) {
  const inventory = [...CORE_GROCERY_ITEMS];
  
  const brandsByCategory = {
    "staples": ["Aashirvaad", "Fortune", "India Gate", "Daawat", "Rajdhani", "Patanjali", "Ganesh", "Nature Fresh"],
    "sugar-sweeteners": ["Dhampure", "Trust", "Mawana", "Madhur", "Patanjali", "Organic Tattva"],
    "oils-ghee": ["Fortune", "Engine", "Dhara", "Saffola", "Emami Healthy", "Amul", "Mother Dairy", "Patanjali"],
    "dals-pulses": ["Tata Sampann", "Rajdhani", "Organic Tattva", "Fortune", "Patanjali", "Nature Fresh"],
    "spices-masala": ["MDH", "Everest", "Catch", "Tata Sampann", "Badshah", "Goldiee", "Ramdev"],
    "dairy-bread": ["Amul", "Mother Dairy", "Harvest Gold", "English Oven", "Britannia", "Gowardhan"],
    "tea-beverages": ["Tata Tea", "Red Label", "Taj Mahal", "Wagh Bakri", "Nescafe", "Bru", "Real", "Tropicana"],
    "snacks-namkeen": ["Haldiram's", "Bikaji", "Balaji", "Parle", "Britannia", "Sunfeast", "Lays", "Kurkure"],
    "household-clean": ["Surf Excel", "Ariel", "Tide", "Vim", "Pril", "Dettol", "Lifebuoy", "Lizol", "Harpic", "Colin"],
    "puja-dryfruits": ["Cycle Pure", "Mangalam", "Moksh", "Tulsi", "Nutraj", "Happilo", "Farmley"]
  };

  const itemTemplates = [
    { cat: "staples", name: "Premium MP Lokwan Wheat Grains (गेहूं)", price: 42, unit: "1 kg", v: ["5 kg", "10 kg", "25 kg"] },
    { cat: "staples", name: "Roasted Chana with Skin (भुना चना)", price: 65, unit: "500g", v: ["500g", "1 kg"] },
    { cat: "staples", name: "Organic Poha / Flattened Rice (मोटा पोहा)", price: 45, unit: "500g", v: ["500g", "1 kg"] },
    { cat: "staples", name: "Makhana / Foxnuts Grade A (मखाना)", price: 180, unit: "250g", v: ["250g", "500g"] },
    { cat: "staples", name: "Brown Basmati Rice (ब्राउन राइस)", price: 130, unit: "1 kg", v: ["1 kg", "5 kg"] },
    { cat: "staples", name: "Jowar / Sorghum Flour (ज्वार आटा)", price: 65, unit: "1 kg", v: ["1 kg", "5 kg"] },
    { cat: "staples", name: "Bajra / Pearl Millet Flour (बाजरा आटा)", price: 55, unit: "1 kg", v: ["1 kg", "5 kg"] },
    { cat: "staples", name: "Ragi / Finger Millet Flour (रागी आटा)", price: 70, unit: "1 kg", v: ["1 kg", "2 kg"] },
    { cat: "staples", name: "Sabudana / Tapioca Sago (साबूदाना)", price: 55, unit: "500g", v: ["500g", "1 kg"] },
    { cat: "sugar-sweeteners", name: "Organic Jaggery Powder (गुड़ पाउडर)", price: 75, unit: "500g", v: ["500g", "1 kg"] },
    { cat: "sugar-sweeteners", name: "Pure Cane Sugar Cubes (चीनी क्यूब्स)", price: 60, unit: "500g", v: ["500g"] },
    { cat: "oils-ghee", name: "Cold Pressed Sesame / Til Oil (तिल का तेल)", price: 210, unit: "500 ml", v: ["500 ml", "1 L"] },
    { cat: "oils-ghee", name: "Cold Pressed Coconut Cooking Oil (नारियल तेल)", price: 190, unit: "500 ml", v: ["500 ml", "1 L"] },
    { cat: "oils-ghee", name: "Pure A2 Gir Cow Desi Ghee (A2 गिर गाय घी)", price: 690, unit: "500 ml", v: ["500 ml", "1 L"] },
    { cat: "oils-ghee", name: "Physically Refined Rice Bran Oil (राइस ब्रान तेल)", price: 145, unit: "1 Litre", v: ["1 L", "5 L"] },
    { cat: "dals-pulses", name: "Urad Dal Dhuli (धुली उड़द दाल)", price: 140, unit: "1 kg", v: ["500g", "1 kg"] },
    { cat: "dals-pulses", name: "Urad Dal Chilka (छिलका उड़द)", price: 135, unit: "1 kg", v: ["500g", "1 kg"] },
    { cat: "dals-pulses", name: "Urad Sabut Kali Dal / Dal Makhani (काली उड़द)", price: 145, unit: "1 kg", v: ["500g", "1 kg"] },
    { cat: "dals-pulses", name: "Masoor Dal Malkha / Red Lentil (लाल मसूर)", price: 110, unit: "1 kg", v: ["500g", "1 kg"] },
    { cat: "dals-pulses", name: "Whole Green Moong Sabut (साबुत हरी मूंग)", price: 125, unit: "1 kg", v: ["500g", "1 kg"] },
    { cat: "dals-pulses", name: "Kala Chana / Desi Brown Chickpeas (काला चना)", price: 90, unit: "1 kg", v: ["500g", "1 kg"] },
    { cat: "dals-pulses", name: "White Safed Vatana / Matar (सफेद मटर)", price: 80, unit: "1 kg", v: ["500g", "1 kg"] },
    { cat: "spices-masala", name: "Kashmiri Lal Mirch Whole Stemless (साबुत लाल मिर्च)", price: 120, unit: "200g", v: ["200g", "500g"] },
    { cat: "spices-masala", name: "Whole Cumin Seeds / Jeera (जीरा साबुत)", price: 115, unit: "200g", v: ["200g", "500g", "1 kg"] },
    { cat: "spices-masala", name: "Whole Black Mustard Seeds / Rai (राई)", price: 40, unit: "200g", v: ["200g", "500g"] },
    { cat: "spices-masala", name: "Fenugreek Seeds / Methi Dana (मेथी दाना)", price: 35, unit: "200g", v: ["200g", "500g"] },
    { cat: "spices-masala", name: "Ajwain / Carom Seeds (अजवाइन)", price: 50, unit: "200g", v: ["200g", "500g"] },
    { cat: "spices-masala", name: "Green Cardamom / Chhoti Elaichi (छोटी इलायची)", price: 290, unit: "50g", v: ["50g", "100g"] },
    { cat: "spices-masala", name: "Black Cardamom / Badi Moti Elaichi (बड़ी इलायची)", price: 180, unit: "50g", v: ["50g", "100g"] },
    { cat: "spices-masala", name: "Whole Cloves / Laung (लौंग)", price: 110, unit: "50g", v: ["50g", "100g"] },
    { cat: "spices-masala", name: "Cinnamon Sticks / Dalchini (दालचीनी)", price: 75, unit: "100g", v: ["100g", "250g"] },
    { cat: "spices-masala", name: "Whole Black Pepper / Kali Mirch (काली मिर्च)", price: 130, unit: "100g", v: ["100g", "250g"] },
    { cat: "spices-masala", name: "Chat Masala Sprinkler (चाट मसाला)", price: 45, unit: "100g", v: ["100g"] },
    { cat: "spices-masala", name: "Pav Bhaji Masala (पाव भाजी मसाला)", price: 55, unit: "100g", v: ["100g"] },
    { cat: "spices-masala", name: "Chole Masala (छोले मसाला)", price: 55, unit: "100g", v: ["100g"] },
    { cat: "spices-masala", name: "Kitchen King Masala (किचन किंग)", price: 65, unit: "100g", v: ["100g"] },
    { cat: "spices-masala", name: "Sambhar Masala (सांभर मसाला)", price: 55, unit: "100g", v: ["100g"] },
    { cat: "dairy-bread", name: "Amul Cheese Slices (चीज स्लाइस)", price: 140, unit: "200g (10 Slices)", v: ["200g", "400g"] },
    { cat: "dairy-bread", name: "Amul Fresh Cream (ताज़ा क्रीम)", price: 65, unit: "250 ml", v: ["250 ml", "1 L"] },
    { cat: "dairy-bread", name: "Amul Masti Dahi Pouch (ताज़ा दही)", price: 35, unit: "400g", v: ["400g", "1 kg"] },
    { cat: "dairy-bread", name: "Fresh White Farm Eggs (अंडे)", price: 85, unit: "Tray of 12", v: ["Tray of 6", "Tray of 12", "Crate of 30"] },
    { cat: "tea-beverages", name: "Taj Mahal Long Leaf CTC Tea (ताज महल चाय)", price: 195, unit: "250g", v: ["250g", "500g"] },
    { cat: "tea-beverages", name: "Wagh Bakri Premium Leaf Tea (वाघ बकरी)", price: 145, unit: "250g", v: ["250g", "500g"] },
    { cat: "tea-beverages", name: "Green Tea with Honey & Lemon (ग्रीन टी)", price: 180, unit: "Box of 25 Bags", v: ["25 Bags", "50 Bags"] },
    { cat: "tea-beverages", name: "Bru Gold Roasted Filter Coffee (ब्रू गोल्ड)", price: 175, unit: "50g Jar", v: ["50g", "100g"] },
    { cat: "snacks-namkeen", name: "Haldiram's Khatta Meetha Mixture (खट्टा मीठा)", price: 48, unit: "200g", v: ["200g", "400g", "1 kg"] },
    { cat: "snacks-namkeen", name: "Haldiram's Moong Dal Fried (मूंग दाल नमकीन)", price: 50, unit: "200g", v: ["200g", "400g"] },
    { cat: "snacks-namkeen", name: "Haldiram's Bikaneri Bhujia (बीकानेरी भुजिया)", price: 55, unit: "200g", v: ["200g", "400g", "1 kg"] },
    { cat: "snacks-namkeen", name: "Britannia Good Day Butter Cookies (गुड डे बिस्कुट)", price: 35, unit: "200g", v: ["200g", "600g"] },
    { cat: "snacks-namkeen", name: "Britannia Marie Gold Tea Biscuits (मारी गोल्ड)", price: 30, unit: "250g", v: ["250g", "1 kg"] },
    { cat: "household-clean", name: "Ariel Matic Front & Top Load Detergent (एरियल मैटिक)", price: 235, unit: "1 kg", v: ["1 kg", "2 kg", "4 kg"] },
    { cat: "household-clean", name: "Tide Plus Double Power Detergent (टाइड प्लस)", price: 125, unit: "1 kg", v: ["1 kg", "3 kg", "5 kg"] },
    { cat: "household-clean", name: "Lizol Citrus Surface & Floor Cleaner (लाइज़ोल)", price: 110, unit: "500 ml", v: ["500 ml", "1 L", "2 L"] },
    { cat: "household-clean", name: "Harpic Power Plus Toilet Cleaner (हार्पिक)", price: 95, unit: "500 ml", v: ["500 ml", "1 L"] },
    { cat: "puja-dryfruits", name: "Afghani Green Kishmish / Raisins (किशमिश)", price: 110, unit: "250g", v: ["250g", "500g", "1 kg"] },
    { cat: "puja-dryfruits", name: "Premium Irani Akhrot / Walnuts In-Shell (अखरोट)", price: 280, unit: "500g", v: ["500g", "1 kg"] },
    { cat: "puja-dryfruits", name: "Premium Salted Pista / Pistachios (पिस्ता)", price: 290, unit: "250g", v: ["250g", "500g"] }
  ];

  let currentId = inventory.length + 1;

  while (inventory.length < targetCount) {
    for (const t of itemTemplates) {
      if (inventory.length >= targetCount) break;

      const brandList = brandsByCategory[t.cat] || ["Shagun Premium", "Choice Best", "Fresh Gold"];
      const brand = brandList[Math.floor(Math.random() * brandList.length)];
      const variationNum = Math.floor(inventory.length / itemTemplates.length) + 1;
      
      const multiplier = (0.9 + Math.random() * 0.25);
      const basePrice = Math.round(t.price * multiplier);

      const variants = [
        { name: t.unit, price: basePrice }
      ];
      if (t.v && t.v.length > 0) {
        t.v.forEach(vName => {
          if (vName !== t.unit) {
            const factor = vName.includes("5 kg") ? 4.8 : vName.includes("10 kg") ? 9.2 : vName.includes("2 kg") ? 1.95 : 1.9;
            variants.push({ name: `${vName} Pack`, price: Math.round(basePrice * factor) });
          }
        });
      }

      inventory.push({
        id: `shagun_${t.cat}_${currentId++}`,
        name: `${brand} ${t.name} (Batch #${variationNum})`,
        category: t.cat,
        price: basePrice,
        unit: t.unit,
        variants,
        inStock: true,
        badge: variationNum === 1 ? "Top Pick" : (Math.random() > 0.7 ? "Value Deal" : null),
        description: `Premium quality ${t.name.split('(')[0]} packaged under hygienic store standards at SHAGUN STORE.`,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80"
      });
    }
  }

  return inventory;
}

export const INITIAL_PRODUCTS = generateFullStoreInventory(2050);
