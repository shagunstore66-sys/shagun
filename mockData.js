/**
 * SHAGUN STORE (शगुन स्टोर / ಶಗುನ್ ಸ್ಟೋರ್) - Master Trilingual Grocery Database & Catalog Engine
 * Supports:
 * - 🇬🇧 English | 🇮🇳 Hindi (हिंदी) | 🟡🔴 Kannada (ಕನ್ನಡ)
 * - Scaled for 2,000+ Supermarket Items
 * - Full Granular Weight Variations: 250GM, 500GM, 1KG, 2KG, 3KG, 4KG, 5KG, 10KG (Grains, Dals, Sugar, Rava, Maida)
 * - Full Volume Variations: 500ML, 1 Litre, 2 Litre, 5 Litre Can, 15 Litre Tin (Cooking Oils, Ghee)
 */

export const INITIAL_STORE_CONFIG = {
  name: "SHAGUN STORE",
  nameHindi: "शगुन स्टोर",
  nameKannada: "ಶಗುನ್ ಸ್ಟೋರ್",
  tagline: "Scan in Aisle • Order • Collect at Counter",
  taglineHindi: "स्कैन करें • सामान चुनें • काउंटर से प्राप्त करें",
  taglineKannada: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿ • ಸಾಮಗ್ರಿ ಆರಿಸಿ • ಕೌಂಟರ್‌ನಲ್ಲಿ ಪಡೆಯಿರಿ",
  address: "Shop No. 1, Main Market, Bengaluru, Karnataka",
  phone: "+91 98765 43210",
  upiId: "7795565216-1@okbizaxis",
  currency: "₹",
  taxPercent: 0,
  expressPackingFee: 0,
  pickupLocations: [
    "Main Entrance Stand (Express)",
    "Aisle 1 - Grains & Staples (ಧಾನ್ಯಗಳು)",
    "Aisle 2 - Oils, Ghee & Masalas (ಎಣ್ಣೆ, ತುಪ್ಪ)",
    "Aisle 3 - Dairy & Beverages (ಹಾಲು, ಪಾನೀಯಗಳು)",
    "Aisle 4 - Household & Cleaning (ಸ್ವಚ್ಛತೆ)",
    "Billing Counter 1",
    "Billing Counter 2"
  ]
};

// Trilingual Category Taxonomy
export const CATEGORIES = [
  { id: "all", name: "All Items", nameHindi: "सभी सामान", nameKannada: "ಎಲ್ಲಾ ಸಾಮಗ್ರಿಗಳು", icon: "🛒" },
  { id: "staples", name: "Atta, Rice & Grains", nameHindi: "आटा, चावल व अनाज", nameKannada: "ಹಿಟ್ಟು, ಅಕ್ಕಿ ಮತ್ತು ಧಾನ್ಯಗಳು", icon: "🌾" },
  { id: "sugar-sweeteners", name: "Sugar, Rava & Jaggery", nameHindi: "चीनी, रवा व गुड़", nameKannada: "ಸಕ್ಕರೆ, ರವೆ ಮತ್ತು ಬೆಲ್ಲ", icon: "🍬" },
  { id: "oils-ghee", name: "Cooking Oils & Ghee", nameHindi: "तेल और शुद्ध घी", nameKannada: "ಅಡುಗೆ ಎಣ್ಣೆ ಮತ್ತು ತುಪ್ಪ", icon: "🛢️" },
  { id: "dals-pulses", name: "Dals & Pulses", nameHindi: "दालें और दलहन", nameKannada: "ಬೇಳೆಕಾಳುಗಳು", icon: "🥣" },
  { id: "spices-masala", name: "Spices & Masalas", nameHindi: "मसाले और खड़े मसाले", nameKannada: "ಮಸಾಲೆ ಪದಾರ್ಥಗಳು", icon: "🌶️" },
  { id: "dairy-bread", name: "Dairy & Bakery", nameHindi: "दूध, दही व ब्रेड", nameKannada: "ಹಾಲು ಮತ್ತು ಬೇಕರಿ", icon: "🥛" },
  { id: "tea-beverages", name: "Tea, Coffee & Drinks", nameHindi: "चाय, कॉफ़ी व पेय", nameKannada: "ಟೀ, ಕಾಫಿ ಮತ್ತು ಪಾನೀಯಗಳು", icon: "☕" },
  { id: "snacks-namkeen", name: "Snacks & Biscuits", nameHindi: "बिस्कुट व नमकीन", nameKannada: "ತಿಂಡಿ ಮತ್ತು ಬಿಸ್ಕತ್ತು", icon: "🍪" },
  { id: "household-clean", name: "Cleaning & Care", nameHindi: "सफाई व घरेलू सामान", nameKannada: "ಸ್ವಚ್ಛತೆ ಮತ್ತು ಗೃಹೋಪಯೋಗಿ", icon: "🧼" },
  { id: "puja-dryfruits", name: "Puja & Dry Fruits", nameHindi: "पूजा सामग्री व मेवे", nameKannada: "ಪೂಜಾ ಸಾಮಗ್ರಿ ಮತ್ತು ಒಣಹಣ್ಣುಗಳು", icon: "🪔" }
];

// Comprehensive Multi-language Dictionary
export const I18N = {
  en: {
    langName: "English",
    storeTagline: "Scan in Aisle • Order • Collect at Counter",
    searchPlaceholder: "Search 2,000+ Groceries (Sugar, Dals, Rice, Oils...)",
    cartTitle: "Your Shopping Cart",
    cartEmpty: "Your cart is empty. Add grocery items to begin!",
    itemsSubtotal: "Items Subtotal",
    bagPacking: "Express Bag Packing",
    free: "FREE",
    taxes: "Taxes & GST",
    totalPayable: "Total Payable",
    selectPaymentMode: "Select Payment Mode:",
    upiPayment: "UPI Payment",
    upiSub: "Pay directly via PhonePe, GPay, Paytm or Any UPI app",
    cashCounter: "Pay Cash at Counter",
    cashSub: "Pay cash when picking up your packed bag",
    cardPayment: "Card Payment / POS",
    cardSub: "Debit / Credit card at collection counter",
    custName: "Your Full Name",
    custPhone: "10-Digit Mobile Number (For Pickup Identification)",
    enterMobile: "Enter 10-digit mobile number",
    packingNote: "Special Packing Note (Optional)",
    payAndBook: "Pay via UPI & Book Bag",
    placeOrder: "Place Order & Get Token",
    pickupToken: "SHAGUN STORE PICKUP TOKEN",
    collectionSpot: "Collection Spot:",
    orderStatus1: "1. Order Placed & Confirmed",
    orderStatus2: "2. Staff Packing in Carry Bag",
    orderStatus3: "3. Ready for Collection",
    orderStatus4: "4. Handed Over to Customer",
    staffPacking: "Staff is currently packing your items at shelves...",
    orderAwaitingVerify: "Order Submitted • Awaiting Shop UPI Verification",
    orderAwaitingVerifyDesc: "Store owner is verifying payment receipt on UPI ID. Packing begins upon confirmation.",
    reopenUpi: "Re-open UPI App",
    verifiedUpi: "🟢 UPI Payment Verified by Store Owner",
    verifiedUpiDesc: "Bank receipt confirmed. Staff is packing your groceries!",
    bagReadyTitle: "🎉 Your Grocery Bag is Packed & Ready!",
    bagReadyDesc: "Please walk to the counter and show your Token to collect your bag.",
    itemsInOrder: "Items in this Order",
    billSummary: "Bill Summary",
    grandTotal: "Grand Total",
    addMoreItems: "➕ Add More Items to Active Order",
    orderMoreItems: "🛒 Order More Items / New Bag",
    showTokenStaff: "Show this QR / Token to SHAGUN STORE Staff",
    staffDashboardTitle: "👨‍🍳 Staff Packing Terminal",
    staffDashboardSub: "Live orders queue • Check off items as you pack into carry bags",
    newOrders: "🔴 New Orders",
    packingOrders: "🔵 Currently Packing",
    readyOrders: "🟢 Ready for Collection",
    completedOrders: "✓ Fulfilled Orders",
    checkAll: "✓ Check All",
    startPacking: "📦 Start Packing",
    markReady: "🔔 Mark Ready & Alert Customer",
    handOver: "✓ Handed to Customer",
    undoStatus: "↩ Undo Status",
    confirmBankReceived: "🟢 Confirm Bank Payment Received",
    awaitingBankReceipt: "⚠️ UPI Payment (Check Soundbox / Bank SMS)",
    loadMore: "Load More Items (+36)",
    outOfStock: "Out of Stock",
    addBtn: "+ Add"
  },
  hi: {
    langName: "हिंदी",
    storeTagline: "स्कैन करें • सामान चुनें • काउंटर से प्राप्त करें",
    searchPlaceholder: "2,000+ सामान खोजें (चीनी, दाल, चावल, तेल...)",
    cartTitle: "आपकी शॉपिंग कार्ट",
    cartEmpty: "आपकी कार्ट खाली है। खरीदारी शुरू करने के लिए सामान जोड़ें!",
    itemsSubtotal: "सामान का कुल मूल्य",
    bagPacking: "एक्सप्रेस बैग पैकिंग",
    free: "मुफ़्त",
    taxes: "टैक्स व जीएसटी",
    totalPayable: "कुल देय राशि",
    selectPaymentMode: "भुगतान का तरीका चुनें:",
    upiPayment: "UPI पेमेंट",
    upiSub: "PhonePe, GPay, Paytm या किसी भी UPI ऐप से सीधे भुगतान करें",
    cashCounter: "काउंटर पर नकद (Cash) दें",
    cashSub: "सामान का बैग लेते समय काउंटर पर नकद भुगतान करें",
    cardPayment: "कार्ड पेमेंट / POS",
    cardSub: "काउंटर पर डेबिट/क्रेडिट कार्ड से भुगतान करें",
    custName: "आपका नाम",
    custPhone: "10 अंकों का मोबाइल नंबर (टोकन पहचान के लिए)",
    enterMobile: "10 अंकों का मोबाइल नंबर दर्ज करें",
    packingNote: "पैकिंग निर्देश (वैकल्पिक)",
    payAndBook: "UPI से भुगतान करें व बैग बुक करें",
    placeOrder: "ऑर्डर बुक करें व टोकन प्राप्त करें",
    pickupToken: "शगुन स्टोर पिकअप टोकन",
    collectionSpot: "प्राप्ति काउंटर:",
    orderStatus1: "1. ऑर्डर दर्ज व पुष्ट हुआ",
    orderStatus2: "2. बैग में सामान पैक हो रहा है",
    orderStatus3: "3. काउंटर पर लेने हेतु तैयार",
    orderStatus4: "4. ग्राहक को सौंप दिया गया",
    staffPacking: "दुकान कर्मचारी अलमारियों से आपका सामान पैक कर रहे हैं...",
    orderAwaitingVerify: "ऑर्डर दर्ज • दुकानदार सत्यापन की प्रतीक्षा",
    orderAwaitingVerifyDesc: "दुकानदार UPI ID पर भुगतान की पुष्टि कर रहे हैं। पुष्टि होते ही पैकिंग शुरू हो जाएगी।",
    reopenUpi: "UPI ऐप दोबारा खोलें",
    verifiedUpi: "🟢 दुकानदार द्वारा UPI भुगतान सत्यापित",
    verifiedUpiDesc: "बैंक में राशि प्राप्त हो चुकी है। कर्मचारी आपका सामान पैक कर रहे हैं!",
    bagReadyTitle: "🎉 आपका किराना बैग पैक होकर तैयार है!",
    bagReadyDesc: "कृपया काउंटर पर जाएं और अपना टोकन दिखाकर बैग प्राप्त करें।",
    itemsInOrder: "इस ऑर्डर में सामान",
    billSummary: "बिल का विवरण",
    grandTotal: "कुल राशि",
    addMoreItems: "➕ इसी चालू ऑर्डर में और सामान जोड़ें",
    orderMoreItems: "🛒 और सामान खरीदें / नया बैग",
    showTokenStaff: "यह QR / टोकन शगुन स्टोर स्टाफ को दिखाएं",
    staffDashboardTitle: "👨‍🍳 स्टाफ पैकिंग टर्मिनल",
    staffDashboardSub: "लाइव ऑर्डर्स • सामान पैक करते हुए टिक करें",
    newOrders: "🔴 नए ऑर्डर्स",
    packingOrders: "🔵 पैकिंग जारी",
    readyOrders: "🟢 काउंटर पर तैयार",
    completedOrders: "✓ पूर्ण हुए ऑर्डर्स",
    checkAll: "✓ सभी चुनें",
    startPacking: "📦 पैकिंग शुरू करें",
    markReady: "🔔 तैयार मार्क करें व फोन अलर्ट दें",
    handOver: "✓ ग्राहक को बैग दे दिया",
    undoStatus: "↩ स्थिति वापस बदलें",
    confirmBankReceived: "🟢 बैंक/साउंडबॉक्स में राशि प्राप्त हुई (पुष्टि करें)",
    awaitingBankReceipt: "⚠️ UPI पेमेंट (साउंडबॉक्स/बैंक SMS जांचें)",
    loadMore: "और सामान देखें (+36)",
    outOfStock: "स्टॉक समाप्त",
    addBtn: "+ जोड़ें"
  },
  kn: {
    langName: "ಕನ್ನಡ",
    storeTagline: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿ • ಸಾಮಗ್ರಿ ಆರಿಸಿ • ಕೌಂಟರ್‌ನಲ್ಲಿ ಪಡೆಯಿರಿ",
    searchPlaceholder: "2,000+ ದಿನಸಿ ಸಾಮಗ್ರಿ ಹುಡುಕಿ (ಸಕ್ಕರೆ, ಬೇಳೆ, ಅಕ್ಕಿ, ಎಣ್ಣೆ...)",
    cartTitle: "ನಿಮ್ಮ ಶಾಪಿಂಗ್ ಕಾರ್ಟ್",
    cartEmpty: "ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ. ಸಾಮಗ್ರಿಗಳನ್ನು ಸೇರಿಸಿ!",
    itemsSubtotal: "ಒಟ್ಟು ಸಾಮಗ್ರಿಗಳ ಮೊತ್ತ",
    bagPacking: "ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಬ್ಯಾಗ್ ಪ್ಯಾಕಿಂಗ್",
    free: "ಉಚಿತ",
    taxes: "ತೆರಿಗೆ ಮತ್ತು ಜಿಎಸ್‌ಟಿ",
    totalPayable: "ಪಾವತಿಸಬೇಕಾದ ಒಟ್ಟು ಮೊತ್ತ",
    selectPaymentMode: "ಪಾವತಿ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
    upiPayment: "ಯುಪಿಐ (UPI) ಪಾವತಿ",
    upiSub: "ಫೋನ್‌ಪೇ, ಜಿಪೇ, ಪೇಟಿಎಂ ಅಥವಾ ಯಾವುದೇ ಯುಪಿಐ ಆಪ್ ಮೂಲಕ ನೇರ ಪಾವತಿ",
    cashCounter: "ಕೌಂಟರ್‌ನಲ್ಲಿ ನಗದು ಪಾವತಿ (Cash)",
    cashSub: "ಪ್ಯಾಕ್ ಮಾಡಿದ ಬ್ಯಾಗ್ ಪಡೆಯುವಾಗ ನಗದು ಹಣ ನೀಡಿ",
    cardPayment: "ಕಾರ್ಡ್ ಪಾವತಿ / ಪಿಒಎಸ್ (POS)",
    cardSub: "ಕೌಂಟರ್‌ನಲ್ಲಿ ಡೆಬಿಟ್/ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಬಳಸಿ ಪಾವತಿಸಿ",
    custName: "ನಿಮ್ಮ ಹೆಸರು",
    custPhone: "10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಟೋಕನ್ ಗುರುತಿಗೆ)",
    enterMobile: "10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
    packingNote: "ವಿಶೇಷ ಸೂಚನೆ (ಐಚ್ಛಿಕ)",
    payAndBook: "ಯುಪಿಐ ಪಾವತಿಸಿ ಬ್ಯಾಗ್ ಬುಕ್ ಮಾಡಿ",
    placeOrder: "ಆರ್ಡರ್ ಮಾಡಿ ಟೋಕನ್ ಪಡೆಯಿರಿ",
    pickupToken: "ಶಗುನ್ ಸ್ಟೋರ್ ಪಿಕಪ್ ಟೋಕನ್",
    collectionSpot: "ಪಡೆಯುವ ಸ್ಥಳ:",
    orderStatus1: "1. ಆರ್ಡರ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ ಮತ್ತು ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    orderStatus2: "2. ಸಾಮಗ್ರಿಗಳನ್ನು ಬ್ಯಾಗ್‌ನಲ್ಲಿ ಪ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ",
    orderStatus3: "3. ಕೌಂಟರ್‌ನಲ್ಲಿ ಪಡೆಯಲು ಸಿದ್ಧವಾಗಿದೆ",
    orderStatus4: "4. ಗ್ರಾಹಕರಿಗೆ ಹಸ್ತಾಂತರಿಸಲಾಗಿದೆ",
    staffPacking: "ಸಿಬ್ಬಂದಿ ನಿಮ್ಮ ಸಾಮಗ್ರಿಗಳನ್ನು ಪ್ಯಾಕ್ ಮಾಡುತ್ತಿದ್ದಾರೆ...",
    orderAwaitingVerify: "ಆರ್ಡರ್ ಸಲ್ಲಿಸಲಾಗಿದೆ • ಅಂಗಡಿ ಮಾಲೀಕರ ದೃಢೀಕರಣದ ನಿರೀಕ್ಷೆ",
    orderAwaitingVerifyDesc: "ಅಂಗಡಿ ಮಾಲೀಕರು ಯುಪಿಐ ಪಾವತಿ ಪರಿಶೀಲಿಸುತ್ತಿದ್ದಾರೆ. ದೃಢಪಟ್ಟ ತಕ್ಷಣ ಪ್ಯಾಕಿಂಗ್ ಆರಂಭವಾಗುತ್ತದೆ.",
    reopenUpi: "ಯುಪಿಐ ಆಪ್ ಮತ್ತೆ ತೆರೆಯಿರಿ",
    verifiedUpi: "🟢 ಅಂಗಡಿ ಮಾಲೀಕರಿಂದ ಯುಪಿಐ ಪಾವತಿ ದೃಢಪಟ್ಟಿದೆ",
    verifiedUpiDesc: "ಬ್ಯಾಂಕ್‌ಗೆ ಹಣ ಸಂದಾಯವಾಗಿದೆ. ಸಿಬ್ಬಂದಿ ನಿಮ್ಮ ಸಾಮಗ್ರಿಗಳನ್ನು ಪ್ಯಾಕ್ ಮಾಡುತ್ತಿದ್ದಾರೆ!",
    bagReadyTitle: "🎉 ನಿಮ್ಮ ದಿನಸಿ ಬ್ಯಾಗ್ ಸಿದ್ಧವಾಗಿದೆ!",
    bagReadyDesc: "ದಯವಿಟ್ಟು ಕೌಂಟರ್‌ಗೆ ಹೋಗಿ ನಿಮ್ಮ ಟೋಕನ್ ತೋರಿಸಿ ಬ್ಯಾಗ್ ಪಡೆದುಕೊಳ್ಳಿ.",
    itemsInOrder: "ಈ ಆರ್ಡರ್‌ನಲ್ಲಿರುವ ಸಾಮಗ್ರಿಗಳು",
    billSummary: "ಬಿಲ್ ವಿವರ",
    grandTotal: "ಒಟ್ಟು ಮೊತ್ತ",
    addMoreItems: "➕ ಈ ಆರ್ಡರ್‌ಗೆ ಇನ್ನಷ್ಟು ಸಾಮಗ್ರಿ ಸೇರಿಸಿ",
    orderMoreItems: "🛒 ಇನ್ನಷ್ಟು ಸಾಮಗ್ರಿ ಖರೀದಿಸಿ / ಹೊಸ ಬ್ಯಾಗ್",
    showTokenStaff: "ಈ ಕ್ಯೂಆರ್ / ಟೋಕನ್ ಅನ್ನು ಅಂಗಡಿ ಸಿಬ್ಬಂದಿಗೆ ತೋರಿಸಿ",
    staffDashboardTitle: "👨‍🍳 ಸಿಬ್ಬಂದಿ ಪ್ಯಾಕಿಂಗ್ ಟರ್ಮಿನಲ್",
    staffDashboardSub: "ಲೈವ್ ಆರ್ಡರ್ ಲಿಸ್ಟ್ • ಪ್ಯಾಕ್ ಮಾಡಿದಂತೆ ಟಿಕ್ ಮಾಡಿ",
    newOrders: "🔴 ಹೊಸ ಆರ್ಡರ್‌ಗಳು",
    packingOrders: "🔵 ಪ್ಯಾಕಿಂಗ್ ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    readyOrders: "🟢 ಕೌಂಟರ್‌ನಲ್ಲಿ ಸಿದ್ಧವಾಗಿದೆ",
    completedOrders: "✓ ಪೂರ್ಣಗೊಂಡ ಆರ್ಡರ್‌ಗಳು",
    checkAll: "✓ ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ",
    startPacking: "📦 ಪ್ಯಾಕಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
    markReady: "🔔 ಸಿದ್ಧವಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    handOver: "✓ ಗ್ರಾಹಕರಿಗೆ ನೀಡಲಾಗಿದೆ",
    undoStatus: "↩ ಸ್ಥಿತಿ ಹಿಂತಿರುಗಿಸಿ",
    confirmBankReceived: "🟢 ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಹಣ ಜಮೆಯಾಗಿದೆ (ದೃಢೀಕರಿಸಿ)",
    awaitingBankReceipt: "⚠️ ಯುಪಿಐ ಪಾವತಿ (ಸೌಂಡ್‌ಬಾಕ್ಸ್ / SMS ಪರಿಶೀಲಿಸಿ)",
    loadMore: "ಇನ್ನಷ್ಟು ಸಾಮಗ್ರಿ ವೀಕ್ಷಿಸಿ (+36)",
    outOfStock: "ಖಾಲಿಯಾಗಿದೆ",
    addBtn: "+ ಸೇರಿಸಿ"
  }
};

// Core Staple Grocery Products with Granular Multi-Variants (250g, 500g, 1kg, 2kg, 3kg, 5kg, 10kg & 500ml, 1L, 2L, 5L, 15L)
const CORE_GROCERY_ITEMS = [
  // 1. Sugar & Sweeteners
  {
    id: "sug-01",
    name: "Refined Crystal Sugar (सफेद चीनी / ಸಕ್ಕರೆ)",
    category: "sugar-sweeteners",
    price: 44,
    unit: "1 kg",
    variants: [
      { name: "250g Pack", price: 12 },
      { name: "500g Pack", price: 23 },
      { name: "1 kg Pack", price: 44 },
      { name: "2 kg Pack", price: 88 },
      { name: "3 kg Pack", price: 130 },
      { name: "5 kg Family Pack", price: 215 },
      { name: "10 kg Bulk Sack", price: 420 }
    ],
    inStock: true,
    badge: "Bestseller",
    description: "Sparkling clean crystal white sugar for daily tea, coffee, sweets, and cooking.",
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "sug-02",
    name: "Pure Desi Kolhapuri Jaggery / Gur (गुड़ / ಬೆಲ್ಲ)",
    category: "sugar-sweeteners",
    price: 65,
    unit: "1 kg",
    variants: [
      { name: "250g Tub", price: 20 },
      { name: "500g Tub", price: 35 },
      { name: "1 kg Block", price: 65 },
      { name: "2 kg Pack", price: 125 },
      { name: "5 kg Bucket", price: 300 }
    ],
    inStock: true,
    badge: "Pure Organic",
    description: "Natural unrefined traditional jaggery rich in natural minerals and iron.",
    image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "sug-03",
    name: "Fine Rava / Bombay Sooji (सूजी / ರವೆ)",
    category: "sugar-sweeteners",
    price: 52,
    unit: "1 kg",
    variants: [
      { name: "250g Pack", price: 15 },
      { name: "500g Pack", price: 27 },
      { name: "1 kg Pack", price: 52 },
      { name: "2 kg Pack", price: 100 },
      { name: "5 kg Pack", price: 245 },
      { name: "10 kg Bag", price: 480 }
    ],
    inStock: true,
    badge: "Fresh Ground",
    description: "Crispy granulated wheat sooji ideal for Upma, Rava Idli, Halwa, and Kesari Bath.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "sug-04",
    name: "Premium Fine Maida / All Purpose Flour (मैदा / ಮೈದಾ)",
    category: "sugar-sweeteners",
    price: 48,
    unit: "1 kg",
    variants: [
      { name: "250g Pack", price: 14 },
      { name: "500g Pack", price: 25 },
      { name: "1 kg Pack", price: 48 },
      { name: "2 kg Pack", price: 94 },
      { name: "5 kg Pack", price: 225 },
      { name: "10 kg Sack", price: 440 }
    ],
    inStock: true,
    badge: "Super Fine",
    description: "Pure refined wheat flour for Puris, Parottas, Naan, Cakes, and festive snacks.",
    image: "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=500&auto=format&fit=crop&q=80"
  },

  // 2. Dals, Pulses & Legumes
  {
    id: "dal-01",
    name: "Premium Unpolished Toor Dal (अरहर दाल / ತೊಗರಿ ಬೇಳೆ)",
    category: "dals-pulses",
    price: 155,
    unit: "1 kg",
    variants: [
      { name: "250g Pack", price: 40 },
      { name: "500g Pack", price: 80 },
      { name: "1 kg Pack", price: 155 },
      { name: "2 kg Pack", price: 305 },
      { name: "3 kg Pack", price: 450 },
      { name: "5 kg Bulk Pack", price: 740 },
      { name: "10 kg Family Sack", price: 1450 }
    ],
    inStock: true,
    badge: "High Protein",
    description: "Farm-fresh unpolished Toor dal, quick cooking and aromatic for Sambhar, Rasam, and Tadka.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dal-02",
    name: "Yellow Moong Dal Split (धुली मूंग दाल / ಹೆಸರು ಬೇಳೆ)",
    category: "dals-pulses",
    price: 130,
    unit: "1 kg",
    variants: [
      { name: "250g Pack", price: 35 },
      { name: "500g Pack", price: 68 },
      { name: "1 kg Pack", price: 130 },
      { name: "2 kg Pack", price: 255 },
      { name: "5 kg Pack", price: 620 },
      { name: "10 kg Sack", price: 1210 }
    ],
    inStock: true,
    badge: "Easy Digest",
    description: "Light, healthy, and nutritious yellow moong dal for Pongal, Khichdi, and Soups.",
    image: "https://images.unsplash.com/photo-1585994192701-f1a505c8574a?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dal-03",
    name: "White Urad Dal Whole / Gota (उड़द गोटा / ಉದ್ದಿನ ಬೇಳೆ)",
    category: "dals-pulses",
    price: 140,
    unit: "1 kg",
    variants: [
      { name: "250g Pack", price: 38 },
      { name: "500g Pack", price: 72 },
      { name: "1 kg Pack", price: 140 },
      { name: "2 kg Pack", price: 275 },
      { name: "5 kg Pack", price: 670 },
      { name: "10 kg Sack", price: 1320 }
    ],
    inStock: true,
    badge: "Idli Special",
    description: "High batter yield whole urad gota for fluffy soft Idlis, crispy Dosas, and Vadas.",
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dal-04",
    name: "Chana Dal Bengal Gram (चना दाल / ಕಡಲೆ ಬೇಳೆ)",
    category: "dals-pulses",
    price: 95,
    unit: "1 kg",
    variants: [
      { name: "250g Pack", price: 26 },
      { name: "500g Pack", price: 50 },
      { name: "1 kg Pack", price: 95 },
      { name: "2 kg Pack", price: 185 },
      { name: "5 kg Pack", price: 455 },
      { name: "10 kg Sack", price: 890 }
    ],
    inStock: true,
    badge: "Crispy Tadka",
    description: "Golden polished chana dal for Vada, Dal Fry, Chutneys, and Puran Poli.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80"
  },

  // 3. Atta, Rice & Grains
  {
    id: "sta-01",
    name: "Aashirvaad Superior MP Sharbati Whole Wheat Atta (गेहूं आटा / ಗೋಧಿ ಹಿಟ್ಟು)",
    category: "staples",
    price: 245,
    unit: "5 kg",
    variants: [
      { name: "1 kg Trial Pack", price: 52 },
      { name: "2 kg Pack", price: 102 },
      { name: "5 kg Bag", price: 245 },
      { name: "10 kg Saver Pack", price: 470 },
      { name: "20 kg Bulk Sack", price: 920 }
    ],
    inStock: true,
    badge: "100% Sharbati",
    description: "100% whole grain wheat flour stone ground for super soft rotis and fluffy chapattis.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "sta-02",
    name: "Royal Sona Masoori Raw Rice (सोना मसूरी चावल / ಸೋನಾ ಮಸೂರಿ ಅಕ್ಕಿ)",
    category: "staples",
    price: 62,
    unit: "1 kg",
    variants: [
      { name: "1 kg Pack", price: 62 },
      { name: "2 kg Pack", price: 122 },
      { name: "5 kg Bag", price: 295 },
      { name: "10 kg Bag", price: 580 },
      { name: "25 kg Big Sack", price: 1420 }
    ],
    inStock: true,
    badge: "Aged 1 Year",
    description: "Lightweight, aromatic everyday Karnataka Sona Masoori rice, soft and non-sticky.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "sta-03",
    name: "India Gate Classic Basmati Rice (बासमती चावल / ಬಾಸುಮತಿ ಅಕ್ಕಿ)",
    category: "staples",
    price: 185,
    unit: "1 kg",
    variants: [
      { name: "1 kg Pack", price: 185 },
      { name: "2 kg Pack", price: 360 },
      { name: "5 kg Royal Box", price: 875 },
      { name: "10 kg Bag", price: 1720 }
    ],
    inStock: true,
    badge: "Extra Long Grain",
    description: "Royal aged extra long grain Basmati rice for Biryani, Pulao, and Ghee Rice.",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=80"
  },

  // 4. Cooking Oils & Desi Ghee
  {
    id: "oil-01",
    name: "Fortune Sunlite Refined Sunflower Oil (सनफ्लावर तेल / ಸೂರ್ಯಕಾಂತಿ ಎಣ್ಣೆ)",
    category: "oils-ghee",
    price: 138,
    unit: "1 Litre",
    variants: [
      { name: "500 ml Pouch", price: 72 },
      { name: "1 Litre Pouch", price: 138 },
      { name: "2 Litre Bottle", price: 270 },
      { name: "5 Litre Can", price: 660 },
      { name: "15 Litre Tin", price: 1950 }
    ],
    inStock: true,
    badge: "Heart Healthy",
    description: "Light, transparent refined sunflower oil enriched with Vitamins A & D.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "oil-02",
    name: "Amul Pure Cow Ghee / Desi Ghee (शुद्ध गाय का घी / ಹಸುವಿನ ತುಪ್ಪ)",
    category: "oils-ghee",
    price: 610,
    unit: "1 Litre",
    variants: [
      { name: "200 ml Jar", price: 135 },
      { name: "500 ml Pouch", price: 315 },
      { name: "1 Litre Tin/Jar", price: 610 },
      { name: "2 Litre Jar", price: 1200 },
      { name: "5 Litre Bucket", price: 2950 }
    ],
    inStock: true,
    badge: "100% Pure Desi",
    description: "Golden granular pure cow ghee with rich traditional aroma for sweets, dals, and rotis.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "oil-03",
    name: "Engine Cold Pressed Mustard Oil / Kachi Ghani (सरसों तेल / ಸಾಸಿವೆ ಎಣ್ಣೆ)",
    category: "oils-ghee",
    price: 155,
    unit: "1 Litre",
    variants: [
      { name: "500 ml Bottle", price: 82 },
      { name: "1 Litre Bottle", price: 155 },
      { name: "2 Litre Bottle", price: 305 },
      { name: "5 Litre Can", price: 740 },
      { name: "15 Litre Tin", price: 2180 }
    ],
    inStock: true,
    badge: "100% Pungent",
    description: "Traditional cold pressed Kachi Ghani mustard oil with natural pungency and antioxidants.",
    image: "https://images.unsplash.com/photo-1608797178974-15b35a61dd75?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "oil-04",
    name: "Pure Cold Pressed Groundnut / Peanut Oil (मूंगफली तेल / ಕಡಲೆಕಾಯಿ ಎಣ್ಣೆ)",
    category: "oils-ghee",
    price: 175,
    unit: "1 Litre",
    variants: [
      { name: "500 ml Bottle", price: 92 },
      { name: "1 Litre Bottle", price: 175 },
      { name: "2 Litre Bottle", price: 345 },
      { name: "5 Litre Can", price: 840 },
      { name: "15 Litre Tin", price: 2450 }
    ],
    inStock: true,
    badge: "Traditional Cold Pressed",
    description: "Natural aroma cold pressed groundnut oil for healthy deep frying and traditional curries.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"
  },

  // 5. Spices, Masalas & Seasonings
  {
    id: "spc-01",
    name: "Everest Turmeric Powder / Haldi (हल्दी पाउडर / ಅರಿಶಿನ ಪುಡಿ)",
    category: "spices-masala",
    price: 36,
    unit: "100g",
    variants: [
      { name: "50g Pack", price: 20 },
      { name: "100g Pack", price: 36 },
      { name: "250g Pack", price: 85 },
      { name: "500g Pack", price: 165 },
      { name: "1 kg Saver Pack", price: 310 }
    ],
    inStock: true,
    badge: "High Curcumin",
    description: "Golden yellow pure Salem turmeric powder ground from selected roots.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "spc-02",
    name: "Tata Salt Vacuum Evaporated Iodized Salt (नमक / ಉಪ್ಪು)",
    category: "spices-masala",
    price: 28,
    unit: "1 kg",
    variants: [
      { name: "1 kg Pack", price: 28 },
      { name: "2 kg Twin Pack", price: 54 },
      { name: "5 kg Bulk Pack", price: 130 }
    ],
    inStock: true,
    badge: "Desh Ka Namak",
    description: "India's most trusted vacuum evaporated iodized salt for everyday purity.",
    image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "spc-03",
    name: "MDH Kashmiri Mirch Powder (कश्मीरी लाल मिर्च / ಕಾಶ್ಮೀರಿ ಖಾರದ ಪುಡಿ)",
    category: "spices-masala",
    price: 95,
    unit: "100g",
    variants: [
      { name: "50g Pack", price: 50 },
      { name: "100g Pack", price: 95 },
      { name: "250g Pack", price: 220 },
      { name: "500g Pack", price: 420 },
      { name: "1 kg Pack", price: 810 }
    ],
    inStock: true,
    badge: "Rich Red Color",
    description: "Mild spicy Kashmiri chili powder that gives vibrant deep red colour to curries and gravies.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"
  },

  // 6. Tea & Beverages
  {
    id: "bev-01",
    name: "Tata Tea Gold Premium CTC Leaf & Long Leaves (टाटा टी गोल्ड / ಟಾಟಾ ಟೀ)",
    category: "tea-beverages",
    price: 155,
    unit: "250g",
    variants: [
      { name: "100g Trial Pack", price: 65 },
      { name: "250g Pack", price: 155 },
      { name: "500g Value Pack", price: 295 },
      { name: "1 kg Family Pack", price: 560 }
    ],
    inStock: true,
    badge: "Rich Taste & Aroma",
    description: "Exquisite blend of strong CTC tea with 15% gently rolled long leaves for rich aroma.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "bev-02",
    name: "Nescafé Classic Instant Pure Coffee (नेस्कैफे कॉफ़ी / ಕಾಫಿ ಪುಡಿ)",
    category: "tea-beverages",
    price: 185,
    unit: "50g Glass Jar",
    variants: [
      { name: "25g Pouch", price: 85 },
      { name: "50g Glass Jar", price: 185 },
      { name: "100g Glass Jar", price: 340 },
      { name: "200g Saver Jar", price: 620 }
    ],
    inStock: true,
    badge: "100% Pure Coffee",
    description: "Rich roasted aroma and signature bold taste coffee made from fine Robusta coffee beans.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80"
  }
];

// Scale to 2,050 full supermarket items with realistic multi-variants
function generateFullStoreInventory(targetCount = 2050) {
  const inventory = [...CORE_GROCERY_ITEMS];
  
  const brandsByCategory = {
    "staples": ["Aashirvaad", "Pillsbury", "Fortune", "Nature Fresh", "India Gate", "Daawat", "Royal Organic", "BB Royal"],
    "sugar-sweeteners": ["Madhur", "Trust Classic", "Patanjali", "Organic Tattva", "Dhampure", "24 Mantra"],
    "oils-ghee": ["Fortune", "Dhara", "Saffola", "Emami Healthy", "Gemini", "Amul", "Gowardhan", "Mother Dairy"],
    "dals-pulses": ["Tata Sampann", "Organic Tattva", "BB Royal", "Patanjali", "Safe Harvest", "24 Mantra"],
    "spices-masala": ["Everest", "MDH", "Catch", "MTR", "Aachi", "Badshah", "Eastern", "Ramdev"],
    "dairy-bread": ["Amul", "Nandini", "Mother Dairy", "Britannia", "Modern", "English Oven"],
    "tea-beverages": ["Tata Tea", "Red Label", "Taj Mahal", "Wagh Bakri", "Bru", "Nescafé", "Lipton"],
    "snacks-namkeen": ["Haldiram's", "Bikaji", "Balaji", "Britannia", "Parle", "Sunfeast", "Lays", "Kurkure"],
    "household-clean": ["Surf Excel", "Ariel", "Tide", "Vim", "Pril", "Lizol", "Harpic", "Dettol", "Godrej"],
    "puja-dryfruits": ["Happilo", "Nutraj", "Tulsi", "Cycle Pure", "Mangaldeep", "Zed Black"]
  };

  const itemTemplates = [
    { cat: "staples", name: "Chakki Fresh Atta (गेहूं आटा / ಗೋಧಿ ಹಿಟ್ಟು)", price: 48, unit: "1 kg", v: ["500g", "1 kg", "2 kg", "5 kg", "10 kg"] },
    { cat: "staples", name: "Premium Sona Masoori Rice (सोना मसूरी / ಅಕ್ಕಿ)", price: 58, unit: "1 kg", v: ["1 kg", "2 kg", "5 kg", "10 kg", "25 kg"] },
    { cat: "staples", name: "Thick Poha / Beaten Rice (मोटा पोहा / ಅವಲಕ್ಕಿ)", price: 45, unit: "1 kg", v: ["500g", "1 kg", "2 kg", "5 kg"] },
    { cat: "staples", name: "Fine Besan / Gram Flour (बेसन / ಕಡಲೆ ಹಿಟ್ಟು)", price: 85, unit: "1 kg", v: ["500g", "1 kg", "2 kg", "5 kg"] },
    { cat: "sugar-sweeteners", name: "Crystal White Sugar (चीनी / ಸಕ್ಕರೆ)", price: 44, unit: "1 kg", v: ["250g", "500g", "1 kg", "2 kg", "3 kg", "5 kg", "10 kg"] },
    { cat: "sugar-sweeteners", name: "Pure Organic Jaggery Powder (गुड़ पाउडर / ಬೆಲ್ಲದ ಪುಡಿ)", price: 75, unit: "1 kg", v: ["500g", "1 kg", "2 kg", "5 kg"] },
    { cat: "sugar-sweeteners", name: "Roasted Rava / Sooji (भुना रवा / ಹುರಿದ ರವೆ)", price: 55, unit: "1 kg", v: ["500g", "1 kg", "2 kg", "5 kg", "10 kg"] },
    { cat: "oils-ghee", name: "Refined Sunflower Oil (सनफ्लावर तेल / ಸೂರ್ಯಕಾಂತಿ ಎಣ್ಣೆ)", price: 138, unit: "1 Litre", v: ["500 ml", "1 Litre", "2 Litre", "5 Litre", "15 Litre"] },
    { cat: "oils-ghee", name: "Pure Desi Cow Ghee (शुद्ध गाय घी / ಹಸುವಿನ ತುಪ್ಪ)", price: 610, unit: "1 Litre", v: ["200 ml", "500 ml", "1 Litre", "2 Litre", "5 Litre"] },
    { cat: "oils-ghee", name: "Cold Pressed Gingelly / Sesame Oil (तिल का तेल / ಎಳ್ಳೆಣ್ಣೆ)", price: 260, unit: "1 Litre", v: ["500 ml", "1 Litre", "2 Litre", "5 Litre"] },
    { cat: "dals-pulses", name: "Unpolished Toor Dal (तूर दाल / ತೊಗರಿ ಬೇಳೆ)", price: 155, unit: "1 kg", v: ["250g", "500g", "1 kg", "2 kg", "3 kg", "5 kg", "10 kg"] },
    { cat: "dals-pulses", name: "Split Yellow Moong Dal (मूंग दाल / ಹೆಸರು ಬೇಳೆ)", price: 130, unit: "1 kg", v: ["250g", "500g", "1 kg", "2 kg", "3 kg", "5 kg", "10 kg"] },
    { cat: "dals-pulses", name: "White Urad Dal Whole (उड़द दाल / ಉದ್ದಿನ ಬೇಳೆ)", price: 140, unit: "1 kg", v: ["250g", "500g", "1 kg", "2 kg", "3 kg", "5 kg", "10 kg"] },
    { cat: "dals-pulses", name: "Kabuli Chana / White Chickpeas (काबुली चना / ಕಾಬೂಲಿ ಕಡಲೆ)", price: 145, unit: "1 kg", v: ["250g", "500g", "1 kg", "2 kg", "5 kg"] },
    { cat: "dals-pulses", name: "Kala Chana / Brown Gram (काला चना / ಕಪ್ಪು ಕಡಲೆ)", price: 90, unit: "1 kg", v: ["500g", "1 kg", "2 kg", "5 kg"] },
    { cat: "spices-masala", name: "Pure Turmeric Powder (हल्दी / ಅರಿಶಿನ ಪುಡಿ)", price: 36, unit: "100g", v: ["50g", "100g", "250g", "500g", "1 kg"] },
    { cat: "spices-masala", name: "Coriander Powder / Dhaniya (धनिया पाउडर / ಕೊತ್ತಂಬರಿ ಪುಡಿ)", price: 38, unit: "100g", v: ["100g", "250g", "500g", "1 kg"] },
    { cat: "spices-masala", name: "Jeera / Cumin Seeds Whole (जीरा / ಜೀರಿಗೆ)", price: 65, unit: "100g", v: ["50g", "100g", "250g", "500g", "1 kg"] },
    { cat: "tea-beverages", name: "Premium CTC Leaf Tea (कड़क चाय / ಚಹಾ ಪುಡಿ)", price: 145, unit: "250g", v: ["100g", "250g", "500g", "1 kg"] },
    { cat: "tea-beverages", name: "Filter Coffee Powder 80:20 (फ़िल्टर कॉफ़ी / ಫಿಲ್ಟರ್ ಕಾಫಿ)", price: 160, unit: "200g", v: ["100g", "200g", "500g", "1 kg"] },
    { cat: "puja-dryfruits", name: "California Whole Almonds / Badam (बादाम / ಬಾದಾಮಿ)", price: 210, unit: "250g", v: ["100g", "250g", "500g", "1 kg"] },
    { cat: "puja-dryfruits", name: "Whole Premium Cashews / Kaju (काजू / ಗೋಡಂಬಿ)", price: 240, unit: "250g", v: ["100g", "250g", "500g", "1 kg"] }
  ];

  let currentId = inventory.length + 1;

  while (inventory.length < targetCount) {
    for (const t of itemTemplates) {
      if (inventory.length >= targetCount) break;

      const brandList = brandsByCategory[t.cat] || ["Shagun Premium", "Farm Fresh", "Gold Harvest"];
      const brand = brandList[Math.floor(Math.random() * brandList.length)];
      const variationNum = Math.floor(inventory.length / itemTemplates.length) + 1;
      
      const multiplier = (0.92 + Math.random() * 0.2);
      const basePrice = Math.round(t.price * multiplier);

      const variants = [];
      if (t.v && t.v.length > 0) {
        t.v.forEach(vName => {
          let factor = 1.0;
          if (vName.includes("250g") || vName.includes("200g")) factor = 0.28;
          else if (vName.includes("500g") || vName.includes("500 ml")) factor = 0.52;
          else if (vName.includes("2 kg") || vName.includes("2 Litre")) factor = 1.95;
          else if (vName.includes("3 kg")) factor = 2.9;
          else if (vName.includes("5 kg") || vName.includes("5 Litre")) factor = 4.8;
          else if (vName.includes("10 kg")) factor = 9.3;
          else if (vName.includes("15 Litre") || vName.includes("25 kg")) factor = 14.2;
          
          variants.push({ name: `${vName} Pack`, price: Math.max(10, Math.round(basePrice * factor)) });
        });
      } else {
        variants.push({ name: t.unit, price: basePrice });
      }

      inventory.push({
        id: `shagun_${t.cat}_${currentId++}`,
        name: `${brand} ${t.name} (Batch #${variationNum})`,
        category: t.cat,
        price: variants[0] ? variants[0].price : basePrice,
        unit: t.unit,
        variants,
        inStock: true,
        badge: variationNum === 1 ? "Popular" : (Math.random() > 0.75 ? "Value Deal" : null),
        description: `High purity hygienic grocery item packaged with store warranty at SHAGUN STORE.`,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80"
      });
    }
  }

  return inventory;
}

export const INITIAL_PRODUCTS = generateFullStoreInventory(2050);
