/**
 * SHAGUN STORE (शगुन स्टोर / ಶಗುನ್ ಸ್ಟೋರ್) - Master Trilingual Grocery & Fresh Produce Database
 * Supports:
 * - 🇬🇧 English | 🇮🇳 Hindi (हिंदी) | 🟡🔴 Kannada (ಕನ್ನಡ)
 * - Complete Fresh Farm Vegetables & Daily Fresh Fruits Catalog
 * - Scaled for 2,000+ Supermarket Items
 * - Full Granular Weight Variations: 100g, 250g, 500g, 1kg, 2kg, 3kg, 5kg, 10kg
 * - Full Volume Variations: 200ml, 500ml, 1L, 2L, 5L Can, 15L Tin
 * - Store Counter Collection & Payment Methods (UPI & Cash on Counter)
 */

export const INITIAL_STORE_CONFIG = {
  name: "SHAGUN STORE",
  nameHindi: "शगुन स्टोर",
  nameKannada: "ಶಗುನ್ ಸ್ಟೋರ್",
  tagline: "P.H. Road, Near Chamundi Textiles, Bettadapura - 571102",
  taglineHindi: "पी.एच. रोड, चामुंडी टेक्सटाइल्स के पास, बेट्टदपुरा - 571102",
  taglineKannada: "ಪಿ.ಹೆಚ್. ರಸ್ತೆ, ಚಾಮುಂಡಿ ಟೆಕ್ಸ್‌ಟೈಲ್ಸ್ ಹತ್ತಿರ, ಬೆಟ್ಟದಪುರ - 571102",
  address: "P.H. Road, Near Chamundi Textiles, Bettadapura, Karnataka - 571102",
  addressHindi: "पी.एच. रोड, चामुंडी टेक्सटाइल्स के पास, बेट्टदपुरा, कर्नाटक - 571102",
  addressKannada: "ಪಿ.ಹೆಚ್. ರಸ್ತೆ, ಚಾಮುಂಡಿ ಟೆಕ್ಸ್‌ಟೈಲ್ಸ್ ಹತ್ತಿರ, ಬೆಟ್ಟದಪುರ, ಕರ್ನಾಟಕ - 571102",
  phone: "+91 77955 65216",
  ownerWhatsApp: "+91 77955 65216",
  upiId: "7795565216-1@okbizaxis",
  currency: "₹",
  taxPercent: 0,
  expressPackingFee: 0,
  mapsUrl: "https://maps.google.com/?q=Chamundi+Textiles+Bettadapura+Karnataka+571102",
  pickupLocations: [
    "Shagun Store Counter (ಪಿ.ಹೆಚ್. ರಸ್ತೆ, ಬೆಟ್ಟದಪುರ)",
    "Counter 1 (Main Cash Desk)",
    "Counter 2 (Express Pickup Spot)"
  ]
};

// Trilingual Category Taxonomy with Fresh Vegetables & Fruits at the top
export const CATEGORIES = [
  { id: "all", name: "All Items", nameHindi: "सभी सामान", nameKannada: "ಎಲ್ಲಾ ಸಾಮಗ್ರಿಗಳು", icon: "🛒" },
  { id: "vegetables", name: "Fresh Vegetables", nameHindi: "ताजी हरी सब्जियाँ", nameKannada: "ತಾಜಾ ತರಕಾರಿಗಳು", icon: "🥦" },
  { id: "fruits", name: "Fresh Fruits", nameHindi: "ताजे फल", nameKannada: "ತಾಜಾ ಹಣ್ಣುಗಳು", icon: "🍎" },
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
    storeTagline: "P.H. Road, Near Chamundi Textiles, Bettadapura - 571102",
    homeOrderBanner: "🏡 Order from Home • ⚡ Ready for Pickup in 15 Mins • 🛍️ Collect at Shagun Store Counter",
    pickupHeroTitle: "Order from Home & Collect at Store",
    pickupHeroSub: "Browse our complete fresh vegetables & daily grocery collection from home. Place your order online, we pack it ready, and you simply collect at our Bettadapura shop counter!",
    searchPlaceholder: "Search Groceries & Vegetables (Tomatoes, Onions, Sugar, Dals, Rice, Oils...)",
    cartTitle: "Your Shopping Cart",
    cartEmpty: "Your cart is empty. Add fresh vegetables or groceries to begin!",
    itemsSubtotal: "Items Subtotal",
    bagPacking: "Express Bag Packing",
    free: "FREE",
    taxes: "Taxes & GST",
    totalPayable: "Total Payable",
    selectPaymentMode: "Select Payment Mode:",
    upiPayment: "UPI Instant Payment (PhonePe, GPay, Paytm)",
    upiSub: "Pay directly via UPI QR code or any UPI app with Axis Bank verification",
    cashCounter: "Pay Cash on the Counter Table (Store Pickup)",
    cashSub: "Pay cash at Shagun Store collection counter when picking up your bag",
    cardPayment: "Card Payment / POS",
    cardSub: "Debit / Credit card at collection counter",
    custName: "Your Full Name",
    custPhone: "10-Digit Mobile Number (For Pickup Identification)",
    enterMobile: "Enter 10-digit mobile number",
    packingNote: "Special Packing Note (e.g. tight packing, fresh veggies)",
    pickupSlotTitle: "Estimated Counter Pickup Timing:",
    slotInstant: "⚡ Express Pickup (Ready in 15-20 mins)",
    slot30Min: "🕐 In 30 - 45 mins",
    slot1Hr: "🕑 In 1 - 2 hours",
    slotEvening: "🌆 Evening Pickup (5:00 PM - 8:30 PM)",
    payAndBook: "Pay via UPI & Place Pickup Order",
    placeOrder: "Place Pickup Order & Get Token",
    pickupToken: "SHAGUN STORE PICKUP TOKEN",
    collectionSpot: "Collection Counter:",
    storeAddressLabel: "Store Location: P.H. Road, Near Chamundi Textiles, Bettadapura - 571102",
    directionsBtn: "🗺️ Get Store Directions on Google Maps",
    callStoreBtn: "📞 Call Shagun Store (+91 77955 65216)",
    orderStatus1: "1. Order Placed from Home",
    orderStatus2: "2. Staff Packing in Bag at Store",
    orderStatus3: "3. Ready for Counter Collection",
    orderStatus4: "4. Handed Over to Customer",
    staffPacking: "Staff is currently packing your fresh items at Shagun Store...",
    orderAwaitingVerify: "Order Submitted • Awaiting Shop UPI Verification",
    orderAwaitingVerifyDesc: "Store owner is verifying payment on Axis UPI. Packing begins upon confirmation.",
    cashPendingNote: "💵 Please pay ₹{amount} in cash at Shagun Store counter upon pickup.",
    reopenUpi: "Re-open UPI App",
    verifiedUpi: "🟢 UPI Payment Verified by Store Owner",
    verifiedUpiDesc: "Bank receipt confirmed. Staff is packing your groceries!",
    bagReadyTitle: "🎉 Your Grocery Bag is Packed & Ready for Pickup!",
    bagReadyDesc: "Please visit Shagun Store (P.H. Road, Bettadapura) and show your Token to collect your bag.",
    itemsInOrder: "Items in this Order",
    billSummary: "Bill Summary",
    grandTotal: "Grand Total",
    addMoreItems: "➕ Add More Items to Active Order",
    orderMoreItems: "🛒 Order More Items / New Bag",
    showTokenStaff: "Show this Token / QR to SHAGUN STORE Counter Staff",
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
    confirmCashReceived: "💵 Mark Cash Paid at Counter",
    awaitingBankReceipt: "⚠️ UPI Payment (Check Soundbox / Bank SMS)",
    loadMore: "Load More Items (+36)",
    outOfStock: "Out of Stock",
    addBtn: "+ Add",
    otpTitle: "Mobile Verification (OTP)",
    otpSubtitle: "Enter the 4-digit verification code sent to",
    otpSentBanner: "✨ SHAGUN Verification Code is:",
    verifyOtpBtn: "Verify OTP & Confirm Order ➔",
    resendOtp: "Resend Code",
    resendIn: "Resend in",
    invalidOtp: "❌ Incorrect OTP. Please check the code and try again.",
    phoneVerified: "✅ Mobile Verified",
    sendOtpBtn: "Send OTP Code",
    enterOtpPlaceholder: "Enter 4-digit code",
    whatsAppOtpBtn: "💬 Receive OTP on WhatsApp",
    shareWhatsAppBtn: "💬 Share Order to WhatsApp"
  },
  hi: {
    langName: "हिंदी",
    storeTagline: "पी.एच. रोड, चामुंडी टेक्सटाइल्स के पास, बेट्टदपुरा - 571102",
    homeOrderBanner: "🏡 घर बैठे ऑर्डर करें • ⚡ 15 मिनट में तैयार • 🛍️ शगुन स्टोर काउंटर से प्राप्त करें",
    pickupHeroTitle: "घर बैठे ऑर्डर करें और दुकान से लें",
    pickupHeroSub: "घर बैठे अपनी पसंद की ताजी सब्जियाँ और किराना सामान ऑर्डर करें। हम आपका सामान पैक करके तैयार रखेंगे, और आप शगुन स्टोर काउंटर पर आकर सीधे अपना बैग ले सकते हैं!",
    searchPlaceholder: "किराना व ताजी सब्जियाँ खोजें (टमाटर, प्याज, चीनी, दाल, तेल...)",
    cartTitle: "आपकी शॉपिंग कार्ट",
    cartEmpty: "आपकी कार्ट खाली है। खरीदारी शुरू करने के लिए सब्जियाँ या किराना जोड़ें!",
    itemsSubtotal: "सामान का कुल मूल्य",
    bagPacking: "एक्सप्रेस बैग पैकिंग",
    free: "मुफ़्त",
    taxes: "टैक्स व जीएसटी",
    totalPayable: "कुल देय राशि",
    selectPaymentMode: "भुगतान का तरीका चुनें:",
    upiPayment: "UPI पेमेंट (PhonePe, GPay, Paytm)",
    upiSub: "Axis Bank UPI QR कोड या किसी भी UPI ऐप से सीधे ऑनलाइन भुगतान करें",
    cashCounter: "काउंटर टेबल पर नकद (Cash) भुगतान करें",
    cashSub: "दुकान पर अपना पैक किया हुआ बैग लेते समय काउंटर पर नकद भुगतान करें",
    cardPayment: "कार्ड पेमेंट / POS",
    cardSub: "काउंटर पर डेबिट/क्रेडिट कार्ड से भुगतान करें",
    custName: "आपका नाम",
    custPhone: "10 अंकों का मोबाइल नंबर (टोकन पहचान के लिए)",
    enterMobile: "10 अंकों का मोबाइल नंबर दर्ज करें",
    packingNote: "पैकिंग निर्देश (जैसे: ताजी हरी मिर्च, मजबूत बैग)",
    pickupSlotTitle: "दुकान से लेने का अनुमानित समय:",
    slotInstant: "⚡ एक्सप्रेस पिकअप (15-20 मिनट में तैयार)",
    slot30Min: "🕐 30 - 45 मिनट में",
    slot1Hr: "🕑 1 - 2 घंटे में",
    slotEvening: "🌆 शाम का समय (5:00 PM - 8:30 PM)",
    payAndBook: "UPI से भुगतान करें व पिकअप बुक करें",
    placeOrder: "ऑर्डर बुक करें व टोकन प्राप्त करें",
    pickupToken: "शगुन स्टोर पिकअप टोकन",
    collectionSpot: "प्राप्ति काउंटर:",
    storeAddressLabel: "दुकान का पता: पी.एच. रोड, चामुंडी टेक्सटाइल्स के पास, बेट्टदपुरा - 571102",
    directionsBtn: "🗺️ Google Maps पर दुकान का रास्ता देखें",
    callStoreBtn: "📞 शगुन स्टोर पर कॉल करें (+91 77955 65216)",
    orderStatus1: "1. घर से ऑर्डर दर्ज हुआ",
    orderStatus2: "2. दुकान पर बैग में सामान पैक हो रहा है",
    orderStatus3: "3. काउंटर पर लेने हेतु तैयार है",
    orderStatus4: "4. ग्राहक को सौंप दिया गया",
    staffPacking: "दुकान कर्मचारी अलमारियों से आपका सामान पैक कर रहे हैं...",
    orderAwaitingVerify: "ऑर्डर दर्ज • दुकानदार UPI सत्यापन की प्रतीक्षा",
    orderAwaitingVerifyDesc: "दुकानदार UPI ID पर भुगतान की पुष्टि कर रहे हैं। पुष्टि होते ही पैकिंग शुरू हो जाएगी।",
    cashPendingNote: "💵 कृपया दुकान काउंटर पर बैग लेते समय ₹{amount} नकद भुगतान करें।",
    reopenUpi: "UPI ऐप दोबारा खोलें",
    verifiedUpi: "🟢 दुकानदार द्वारा UPI भुगतान सत्यापित",
    verifiedUpiDesc: "बैंक में राशि प्राप्त हो चुकी है। कर्मचारी आपका सामान पैक कर रहे हैं!",
    bagReadyTitle: "🎉 आपका किराना बैग पैक होकर काउंटर पर तैयार है!",
    bagReadyDesc: "कृपया शगुन स्टोर (पी.एच. रोड, बेट्टदपुरा) आएं और अपना टोकन दिखाकर बैग प्राप्त करें।",
    itemsInOrder: "इस ऑर्डर में सामान",
    billSummary: "बिल का विवरण",
    grandTotal: "कुल राशि",
    addMoreItems: "➕ इसी चालू ऑर्डर में और सामान जोड़ें",
    orderMoreItems: "🛒 और सामान खरीदें / नया बैग",
    showTokenStaff: "यह टोकन / QR शगुन स्टोर स्टाफ को दिखाएं",
    staffDashboardTitle: "👨‍🍳 स्टाफ पैकिंग टर्मिनल",
    staffDashboardSub: "लाइव ऑर्डर्स • सामान पैक करते हुए टिक करें",
    newOrders: "🔴 नए ऑर्डर्स",
    packingOrders: "🔵 पैकिंग जारी",
    readyOrders: "🟢 काउंटर पर तैयार",
    completedOrders: "✓ पूर्ण हुए ऑर्डर्स",
    checkAll: "✓ सभी चुनें",
    startPacking: "📦 पैकिंग शुरू करें",
    markReady: "🔔 तैयार मार्क करें व ग्राहक को अलर्ट दें",
    handOver: "✓ ग्राहक को बैग दे दिया",
    undoStatus: "↩ स्थिति वापस बदलें",
    confirmBankReceived: "🟢 बैंक/साउंडबॉक्स में राशि प्राप्त हुई",
    confirmCashReceived: "💵 काउंटर पर नकद प्राप्त हुआ",
    awaitingBankReceipt: "⚠️ UPI पेमेंट (साउंडबॉक्स/बैंक SMS जांचें)",
    loadMore: "और सामान देखें (+36)",
    outOfStock: "स्टॉक समाप्त",
    addBtn: "+ जोड़ें",
    otpTitle: "मोबाइल नंबर सत्यापन (OTP)",
    otpSubtitle: "इस नंबर पर भेजा गया 4 अंकों का OTP कोड दर्ज करें:",
    otpSentBanner: "✨ शगुन स्टोर सत्यापन OTP कोड है:",
    verifyOtpBtn: "OTP सत्यापित करें व ऑर्डर पक्का करें ➔",
    resendOtp: "पुनः OTP भेजें",
    resendIn: "पुनः भेजें",
    invalidOtp: "❌ गलत OTP! कृपया सही 4 अंकों का कोड दर्ज करें।",
    phoneVerified: "✅ मोबाइल नंबर सत्यापित",
    sendOtpBtn: "OTP कोड भेजें",
    enterOtpPlaceholder: "4-अंकों का OTP दर्ज करें",
    whatsAppOtpBtn: "💬 WhatsApp पर OTP प्राप्त करें",
    shareWhatsAppBtn: "💬 WhatsApp पर ऑर्डर शेयर करें"
  },
  kn: {
    langName: "ಕನ್ನಡ",
    storeTagline: "ಪಿ.ಹೆಚ್. ರಸ್ತೆ, ಚಾಮುಂಡಿ ಟೆಕ್ಸ್‌ಟೈಲ್ಸ್ ಹತ್ತಿರ, ಬೆಟ್ಟದಪುರ - 571102",
    homeOrderBanner: "🏡 ಮನೆಯಲ್ಲೇ ಕುಳಿತು ಆರ್ಡರ್ ಮಾಡಿ • ⚡ 15 ನಿಮಿಷದಲ್ಲಿ ಪ್ಯಾಕ್ • 🛍️ ಶಗುನ್ ಸ್ಟೋರ್ ಕೌಂಟರ್‌ನಲ್ಲಿ ಪಡೆಯಿರಿ",
    pickupHeroTitle: "ಮನೆಯಲ್ಲೇ ಕುಳಿತು ಆರ್ಡರ್ ಮಾಡಿ - ಅಂಗಡಿಯಲ್ಲಿ ಬ್ಯಾಗ್ ಪಡೆಯಿರಿ",
    pickupHeroSub: "ತಾಜಾ ತರಕಾರಿಗಳು ಮತ್ತು ದಿನಸಿ ಸಾಮಗ್ರಿಗಳನ್ನು ಮನೆಯಲ್ಲೇ ಆಯ್ಕೆ ಮಾಡಿ ಆರ್ಡರ್ ಮಾಡಿ. ನಾವು ಸಾಮಗ್ರಿಗಳನ್ನು ಪ್ಯಾಕ್ ಮಾಡಿ ಸಿದ್ಧವಾಗಿಡುತ್ತೇವೆ, ನೀವು ಬೆಟ್ಟದಪುರದ ಶಗುನ್ ಸ್ಟೋರ್ ಕೌಂಟರ್‌ನಲ್ಲಿ ಬಂದು ಸುಲಭವಾಗಿ ಪಡೆದುಕೊಳ್ಳಿ!",
    searchPlaceholder: "ದಿನಸಿ ಮತ್ತು ತಾಜಾ ತರಕಾರಿಗಳನ್ನು ಹುಡುಕಿ (ಟೊಮೇಟೊ, ಈರುಳ್ಳಿ, ಸಕ್ಕರೆ, ಬೇಳೆ, ಎಣ್ಣೆ...)",
    cartTitle: "ನಿಮ್ಮ ಶಾಪಿಂಗ್ ಕಾರ್ಟ್",
    cartEmpty: "ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ. ತಾಜಾ ತರಕಾರಿ ಅಥವಾ ದಿನಸಿ ಸಾಮಗ್ರಿಗಳನ್ನು ಸೇರಿಸಿ!",
    itemsSubtotal: "ಒಟ್ಟು ಸಾಮಗ್ರಿಗಳ ಮೊತ್ತ",
    bagPacking: "ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಬ್ಯಾಗ್ ಪ್ಯಾಕಿಂಗ್",
    free: "ಉಚಿತ",
    taxes: "ತೆರಿಗೆ ಮತ್ತು ಜಿಎಸ್‌ಟಿ",
    totalPayable: "ಪಾವತಿಸಬೇಕಾದ ಒಟ್ಟು ಮೊತ್ತ",
    selectPaymentMode: "ಪಾವತಿ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
    upiPayment: "ಯುಪಿಐ (UPI) ಆನ್‌ಲೈನ್ ಪಾವತಿ (PhonePe, GPay, Paytm)",
    upiSub: "Axis Bank ಯುಪಿಐ ಕ್ಯೂಆರ್ ಕೋಡ್ ಅಥವಾ ಯಾವುದೇ ಯುಪಿಐ ಆಪ್ ಮೂಲಕ ನೇರ ಪಾವತಿ",
    cashCounter: "ಕೌಂಟರ್‌ನಲ್ಲಿ ನಗದು ಪಾವತಿ (Cash on Counter Table)",
    cashSub: "ಅಂಗಡಿಯಲ್ಲಿ ಪ್ಯಾಕ್ ಮಾಡಿದ ದಿನಸಿ ಬ್ಯಾಗ್ ಪಡೆಯುವಾಗ ಕೌಂಟರ್‌ನಲ್ಲಿ ನಗದು ಹಣ ನೀಡಿ",
    cardPayment: "ಕಾರ್ಡ್ ಪಾವತಿ / ಪಿಒಎಸ್ (POS)",
    cardSub: "ಕೌಂಟರ್‌ನಲ್ಲಿ ಡೆಬಿಟ್/ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಬಳಸಿ ಪಾವತಿಸಿ",
    custName: "ನಿಮ್ಮ ಹೆಸರು",
    custPhone: "10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಟೋಕನ್ ಗುರುತಿಗೆ)",
    enterMobile: "10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
    packingNote: "ವಿಶೇಷ ಸೂಚನೆ (ಉದಾಹರಣೆಗೆ: ಗಟ್ಟಿ ಪ್ಯಾಕಿಂಗ್, ತಾಜಾ ಮೆಣಸಿನಕಾಯಿ)",
    pickupSlotTitle: "ಅಂಗಡಿಯಲ್ಲಿ ಪಡೆಯುವ ಅಂದಾಜು ಸಮಯ:",
    slotInstant: "⚡ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಪಿಕಪ್ (15-20 ನಿಮಿಷಗಳಲ್ಲಿ ಸಿದ್ಧ)",
    slot30Min: "🕐 30 - 45 ನಿಮಿಷಗಳಲ್ಲಿ",
    slot1Hr: "🕑 1 - 2 ಗಂಟೆಗಳಲ್ಲಿ",
    slotEvening: "🌆 ಸಂಜೆಯ ಸಮಯ (5:00 PM - 8:30 PM)",
    payAndBook: "ಯುಪಿಐ ಪಾವತಿಸಿ ಪಿಕಪ್ ಬುಕ್ ಮಾಡಿ",
    placeOrder: "ಆರ್ಡರ್ ಮಾಡಿ ಟೋಕನ್ ಪಡೆಯಿರಿ",
    pickupToken: "ಶಗುನ್ ಸ್ಟೋರ್ ಪಿಕಪ್ ಟೋಕನ್",
    collectionSpot: "ಪಡೆಯುವ ಸ್ಥಳ:",
    storeAddressLabel: "ಅಂಗಡಿ ವಿಳಾಸ: ಪಿ.ಹೆಚ್. ರಸ್ತೆ, ಚಾಮುಂಡಿ ಟೆಕ್ಸ್‌ಟೈಲ್ಸ್ ಹತ್ತಿರ, ಬೆಟ್ಟದಪುರ - 571102",
    directionsBtn: "🗺️ ಗೂಗಲ್ ಮ್ಯಾಪ್‌ನಲ್ಲಿ ದಾರಿ ನೋಡಿ (Google Maps)",
    callStoreBtn: "📞 ಶಗುನ್ ಸ್ಟೋರ್‌ಗೆ ಕರೆ ಮಾಡಿ (+91 77955 65216)",
    orderStatus1: "1. ಮನೆಯಿಂದ ಆರ್ಡರ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    orderStatus2: "2. ಅಂಗಡಿಯಲ್ಲಿ ಸಾಮಗ್ರಿಗಳನ್ನು ಪ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ",
    orderStatus3: "3. ಕೌಂಟರ್‌ನಲ್ಲಿ ಪಡೆಯಲು ಸಿದ್ಧವಾಗಿದೆ",
    orderStatus4: "4. ಗ್ರಾಹಕರಿಗೆ ಹಸ್ತಾಂತರಿಸಲಾಗಿದೆ",
    staffPacking: "ಸಿಬ್ಬಂದಿ ನಿಮ್ಮ ಸಾಮಗ್ರಿಗಳನ್ನು ಪ್ಯಾಕ್ ಮಾಡುತ್ತಿದ್ದಾರೆ...",
    orderAwaitingVerify: "ಆರ್ಡರ್ ಸಲ್ಲಿಸಲಾಗಿದೆ • ಅಂಗಡಿ ಮಾಲೀಕರ ಯುಪಿಐ ದೃಢೀಕರಣದ ನಿರೀಕ್ಷೆ",
    orderAwaitingVerifyDesc: "ಅಂಗಡಿ ಮಾಲೀಕರು ಯುಪಿಐ ಪಾವತಿ ಪರಿಶೀಲಿಸುತ್ತಿದ್ದಾರೆ. ದೃಢಪಟ್ಟ ತಕ್ಷಣ ಪ್ಯಾಕಿಂಗ್ ಆರಂಭವಾಗುತ್ತದೆ.",
    cashPendingNote: "💵 ದಯವಿಟ್ಟು ಅಂಗಡಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಬ್ಯಾಗ್ ಪಡೆಯುವಾಗ ₹{amount} ನಗದು ಹಣ ನೀಡಿ.",
    reopenUpi: "ಯುಪಿಐ ಆಪ್ ಮತ್ತೆ ತೆರೆಯಿರಿ",
    verifiedUpi: "🟢 ಅಂಗಡಿ ಮಾಲೀಕರಿಂದ ಯುಪಿಐ ಪಾವತಿ ದೃಢಪಟ್ಟಿದೆ",
    verifiedUpiDesc: "ಬ್ಯಾಂಕ್‌ಗೆ ಹಣ ಸಂದಾಯವಾಗಿದೆ. ಸಿಬ್ಬಂದಿ ನಿಮ್ಮ ಸಾಮಗ್ರಿಗಳನ್ನು ಪ್ಯಾಕ್ ಮಾಡುತ್ತಿದ್ದಾರೆ!",
    bagReadyTitle: "🎉 ನಿಮ್ಮ ದಿನಸಿ ಬ್ಯಾಗ್ ಸಿದ್ಧವಾಗಿದೆ!",
    bagReadyDesc: "ದಯವಿಟ್ಟು ಬೆಟ್ಟದಪುರದ ಶಗುನ್ ಸ್ಟೋರ್ ಕೌಂಟರ್‌ಗೆ ಬಂದು ನಿಮ್ಮ ಟೋಕನ್ ತೋರಿಸಿ ಬ್ಯಾಗ್ ಪಡೆದುಕೊಳ್ಳಿ.",
    itemsInOrder: "ಈ ಆರ್ಡರ್‌ನಲ್ಲಿರುವ ಸಾಮಗ್ರಿಗಳು",
    billSummary: "ಬಿಲ್ ವಿವರ",
    grandTotal: "ಒಟ್ಟು ಮೊತ್ತ",
    addMoreItems: "➕ ಈ ಆರ್ಡರ್‌ಗೆ ಇನ್ನಷ್ಟು ಸಾಮಗ್ರಿ ಸೇರಿಸಿ",
    orderMoreItems: "🛒 ಇನ್ನಷ್ಟು ಸಾಮಗ್ರಿ ಖರೀದಿಸಿ / ಹೊಸ ಬ್ಯಾಗ್",
    showTokenStaff: "ಈ ಟೋಕನ್ / ಕ್ಯೂಆರ್ ಅನ್ನು ಅಂಗಡಿ ಸಿಬ್ಬಂದಿಗೆ ತೋರಿಸಿ",
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
    confirmCashReceived: "💵 ಕೌಂಟರ್‌ನಲ್ಲಿ ನಗದು ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    awaitingBankReceipt: "⚠️ ಯುಪಿಐ ಪಾವತಿ (ಸೌಂಡ್‌ಬಾಕ್ಸ್ / SMS ಪರಿಶೀಲಿಸಿ)",
    loadMore: "ಇನ್ನಷ್ಟು ಸಾಮಗ್ರಿ ವೀಕ್ಷಿಸಿ (+36)",
    outOfStock: "ಖಾಲಿಯಾಗಿದೆ",
    addBtn: "+ ಸೇರಿಸಿ",
    otpTitle: "ಮೊಬೈಲ್ ಪರಿಶೀಲನೆ (ಒಟಿಪಿ)",
    otpSubtitle: "ಈ ಸಂಖ್ಯೆಗೆ ಕಳುಹಿಸಲಾದ 4-ಅಂಕಿಯ ಒಟಿಪಿ ಕೋಡ್ ನಮೂದಿಸಿ:",
    otpSentBanner: "✨ ಶಗುನ್ ಸ್ಟೋರ್ ಪರಿಶೀಲನಾ ಒಟಿಪಿ ಕೋಡ್:",
    verifyOtpBtn: "ಒಟಿಪಿ ದೃಢೀಕರಿಸಿ ಮತ್ತು ಆರ್ಡರ್ ಮಾಡಿ ➔",
    resendOtp: "ಮತ್ತೆ ಒಟಿಪಿ ಕಳುಹಿಸಿ",
    resendIn: "ಮರುಕಳುಹಿಸಲು",
    invalidOtp: "❌ ತಪ್ಪಾದ ಒಟಿಪಿ! ದಯವಿಟ್ಟು ಸರಿಯಾದ 4-ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ.",
    phoneVerified: "✅ ಮೊಬೈಲ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    sendOtpBtn: "ಒಟಿಪಿ ಕಳುಹಿಸಿ",
    enterOtpPlaceholder: "4-ಅಂಕಿಯ ಒಟಿಪಿ ನಮೂದಿಸಿ",
    whatsAppOtpBtn: "💬 WhatsApp ನಲ್ಲಿ ಒಟಿಪಿ ಪಡೆಯಿರಿ",
    shareWhatsAppBtn: "💬 WhatsApp ನಲ್ಲಿ ಆರ್ಡರ್ ಹಂಚಿಕೊಳ್ಳಿ"
  }
};

// Core Fresh Produce & Staple Grocery Products with Granular Multi-Variants
const CORE_GROCERY_ITEMS = [
  // ==========================================
  // 1. FRESH FARM VEGETABLES (ताजी हरी सब्जियाँ / ತಾಜಾ ತರಕಾರಿಗಳು)
  // ==========================================
  {
    id: "veg-01",
    name: "Farm Fresh Red Onions (ताजा लाल प्याज / ತಾಜಾ ಈರುಳ್ಳಿ)",
    category: "vegetables",
    price: 38,
    unit: "1 kg",
    variants: [
      { name: "500g Pack", price: 20 },
      { name: "1 kg Pack", price: 38 },
      { name: "2 kg Value Bag", price: 74 },
      { name: "5 kg Family Sack", price: 175 }
    ],
    inStock: true,
    badge: "Daily Essential",
    description: "Crisp, pungent, farm-fresh Indian red onions essential for curries, salads, and tadka.",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "veg-02",
    name: "Fresh Hybrid Country Tomatoes (ताजा देसी टमाटर / ತಾಜಾ ನಾಟಿ ಟೊಮೇಟೊ)",
    category: "vegetables",
    price: 32,
    unit: "1 kg",
    variants: [
      { name: "500g Pack", price: 17 },
      { name: "1 kg Pack", price: 32 },
      { name: "2 kg Value Bag", price: 60 },
      { name: "3 kg Saver Box", price: 88 }
    ],
    inStock: true,
    badge: "Farm Fresh",
    description: "Plump, ripe, juicy red tomatoes hand-picked for rich gravies, sambhar, and rasam.",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "veg-03",
    name: "Mountain Jyoti Potatoes / Aloo (पहाड़ी आलू / ಆಲೂಗಡ್ಡೆ)",
    category: "vegetables",
    price: 35,
    unit: "1 kg",
    variants: [
      { name: "500g Pack", price: 18 },
      { name: "1 kg Pack", price: 35 },
      { name: "2 kg Value Bag", price: 68 },
      { name: "5 kg Family Sack", price: 160 }
    ],
    inStock: true,
    badge: "Bestseller",
    description: "Firm, clean, golden potatoes perfect for aloo parathas, curries, vadas, and fries.",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "veg-04",
    name: "Fresh Green Chillies (तीखी हरी मिर्च / ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ)",
    category: "vegetables",
    price: 18,
    unit: "250g",
    variants: [
      { name: "100g Pack", price: 8 },
      { name: "250g Pack", price: 18 },
      { name: "500g Value Pack", price: 34 }
    ],
    inStock: true,
    badge: "Spicy & Fresh",
    description: "Crispy, spicy green chillies to add punch to your chutneys, dals, and curries.",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "veg-05",
    name: "Farm Fresh Ginger / Adrak (ताजा अदरक / ಶುಂಠಿ)",
    category: "vegetables",
    price: 32,
    unit: "250g",
    variants: [
      { name: "100g Pack", price: 14 },
      { name: "250g Pack", price: 32 },
      { name: "500g Value Pack", price: 60 }
    ],
    inStock: true,
    badge: "Aromatic",
    description: "Aromatic spicy fresh ginger root for daily morning tea, gravies, and herbal remedies.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "veg-06",
    name: "Desi Whole Garlic / Lasan (देसी लहसुन / ನಾಟಿ ಬೆಳ್ಳುಳ್ಳಿ)",
    category: "vegetables",
    price: 45,
    unit: "250g",
    variants: [
      { name: "100g Pack", price: 20 },
      { name: "250g Pack", price: 45 },
      { name: "500g Pack", price: 88 },
      { name: "1 kg Pack", price: 170 }
    ],
    inStock: true,
    badge: "Rich Flavour",
    description: "Pungent, strong-flavoured whole garlic bulbs for tadka, rasam, and marinades.",
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "veg-07",
    name: "Fresh Green Coriander Bunch (धनिया पत्ती / ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪು)",
    category: "vegetables",
    price: 15,
    unit: "1 Bunch",
    variants: [
      { name: "1 Big Bunch", price: 15 },
      { name: "2 Bunches", price: 28 },
      { name: "5 Bunches Saver", price: 65 }
    ],
    inStock: true,
    badge: "Daily Fresh",
    description: "Clean, aromatic green coriander leaves for garnishing dals, curries, and making chutneys.",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "veg-08",
    name: "Fresh Green Ladyfinger / Bhindi (ताजी भिंडी / ಬೆಂಡೆಕಾಯಿ)",
    category: "vegetables",
    price: 28,
    unit: "500g",
    variants: [
      { name: "250g Pack", price: 15 },
      { name: "500g Pack", price: 28 },
      { name: "1 kg Pack", price: 54 }
    ],
    inStock: true,
    badge: "Tender & Crisp",
    description: "Tender, slender green bhindi ideal for crispy fry, sambhar, and masala bhindi.",
    image: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "veg-09",
    name: "Fresh Cauliflower Head (ताजा फूलगोभी / ಹೂಕೋಸು)",
    category: "vegetables",
    price: 35,
    unit: "1 pc (~500g)",
    variants: [
      { name: "1 Medium Head", price: 35 },
      { name: "2 Heads Value Pack", price: 65 }
    ],
    inStock: true,
    badge: "Snow White",
    description: "Tightly packed fresh cauliflower for Aloo Gobi, pakodas, and mixed vegetable kurma.",
    image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "veg-10",
    name: "Fresh Ooty Carrots (ऊटी गाजर / ಕ್ಯಾರೆಟ್)",
    category: "vegetables",
    price: 34,
    unit: "500g",
    variants: [
      { name: "250g Pack", price: 18 },
      { name: "500g Pack", price: 34 },
      { name: "1 kg Pack", price: 65 }
    ],
    inStock: true,
    badge: "Sweet & Crunchy",
    description: "Sweet, crunchy Ooty carrots for salads, sambhar, vegetable pulao, and carrot halwa.",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "veg-11",
    name: "Fresh Juicy Lemons (ताजा रसीला नींबू / ನಿಂಬೆಹಣ್ಣು)",
    category: "vegetables",
    price: 20,
    unit: "4 pcs",
    variants: [
      { name: "4 pcs Pack", price: 20 },
      { name: "10 pcs Value Pack", price: 45 },
      { name: "25 pcs Bulk Bag", price: 100 }
    ],
    inStock: true,
    badge: "High Vitamin C",
    description: "Thin-skinned juicy yellow lemons for lemon rice, refreshing shikanji, and salad dressing.",
    image: "https://images.unsplash.com/photo-1533082603883-3be203578899?w=500&auto=format&fit=crop&q=80"
  },

  // ==========================================
  // 2. FRESH FRUITS (ताजे फल / ತಾಜಾ ಹಣ್ಣುಗಳು)
  // ==========================================
  {
    id: "frt-01",
    name: "Karnataka Yelakki Bananas (ಏಲಕ್ಕಿ ಬಾಳೆಹಣ್ಣು / एलक्की केला)",
    category: "fruits",
    price: 45,
    unit: "500g (~6 pcs)",
    variants: [
      { name: "500g (~6 pcs)", price: 45 },
      { name: "1 kg (~12 pcs)", price: 85 },
      { name: "2 kg Family Pack", price: 160 }
    ],
    inStock: true,
    badge: "Naturally Sweet",
    description: "Small, fragrant, extremely sweet Yelakki bananas rich in instant energy and potassium.",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "frt-02",
    name: "Royal Gala Crisp Red Apples (सेब / ಸೇಬು)",
    category: "fruits",
    price: 110,
    unit: "500g (~3 pcs)",
    variants: [
      { name: "500g (~3 pcs)", price: 110 },
      { name: "1 kg (~6 pcs)", price: 210 },
      { name: "2 kg Royal Box", price: 400 }
    ],
    inStock: true,
    badge: "Crisp & Juicy",
    description: "Crispy sweet red apples imported and fresh-stored for premium crunch and natural health.",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "frt-03",
    name: "Fresh Mature Coconut with Water (ತಾಜಾ ತೆಂಗಿನಕಾಯಿ / नारियल)",
    category: "fruits",
    price: 35,
    unit: "1 pc",
    variants: [
      { name: "1 pc with Sweet Water", price: 35 },
      { name: "2 pcs Value Pack", price: 68 },
      { name: "5 pcs Puja Pack", price: 165 }
    ],
    inStock: true,
    badge: "Puja & Cooking",
    description: "Fresh Karnataka coconut with rich meat and sweet water for chutneys, gravies, and puja.",
    image: "https://images.unsplash.com/photo-1544378730-8b5104b18790?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "frt-04",
    name: "Sweet Ruby Pomegranates / Anar (अनार / ದಾಳಿಂಬೆ)",
    category: "fruits",
    price: 130,
    unit: "1 kg",
    variants: [
      { name: "500g Pack", price: 70 },
      { name: "1 kg Pack", price: 130 },
      { name: "2 kg Box", price: 250 }
    ],
    inStock: true,
    badge: "Rich in Iron",
    description: "Deep red juicy pomegranate pearls rich in antioxidants and refreshing sweet flavour.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80"
  },

  // ==========================================
  // 3. SUGAR & SWEETENERS (चीनी, रवा व गुड़ / ಸಕ್ಕರೆ, ರವೆ ಮತ್ತು ಬೆಲ್ಲ)
  // ==========================================
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

  // ==========================================
  // 4. DALS & PULSES (दालें और दलहन / ಬೇಳೆಕಾಳುಗಳು)
  // ==========================================
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

  // ==========================================
  // 5. ATTA, RICE & GRAINS (आटा, चावल व अनाज / ಹಿಟ್ಟು, ಅಕ್ಕಿ)
  // ==========================================
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

  // ==========================================
  // 6. COOKING OILS & DESI GHEE (तेल और शुद्ध घी / ಎಣ್ಣೆ ಮತ್ತು ತುಪ್ಪ)
  // ==========================================
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

  // ==========================================
  // 7. SPICES, MASALAS & SALT (मसाले व नमक / ಮಸಾಲೆ ಪದಾರ್ಥಗಳು)
  // ==========================================
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

  // ==========================================
  // 8. TEA & BEVERAGES (चाय, कॉफ़ी व पेय / ಟೀ, ಕಾಫಿ)
  // ==========================================
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

// Scale to 2,050 full supermarket items with realistic multi-variants and farm fresh produce
function generateFullStoreInventory(targetCount = 2050) {
  const inventory = [...CORE_GROCERY_ITEMS];
  
  const brandsByCategory = {
    "vegetables": ["Farm Fresh Shagun", "Bettadapura Green Farms", "Local Mandi Fresh", "Organic Karnataka"],
    "fruits": ["Farm Fresh Shagun", "Bettadapura Orchards", "Kashmir Valley", "Ooty Fresh"],
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
    { cat: "vegetables", name: "Farm Fresh Onions (लाल प्याज / ಈರುಳ್ಳಿ)", price: 38, unit: "1 kg", v: ["500g", "1 kg", "2 kg", "5 kg"] },
    { cat: "vegetables", name: "Fresh Hybrid Tomatoes (टमाटर / ಟೊಮೇಟೊ)", price: 32, unit: "1 kg", v: ["500g", "1 kg", "2 kg", "3 kg"] },
    { cat: "vegetables", name: "Fresh Jyoti Potatoes (आलू / ಆಲೂಗಡ್ಡೆ)", price: 35, unit: "1 kg", v: ["500g", "1 kg", "2 kg", "5 kg"] },
    { cat: "vegetables", name: "Spicy Green Chillies (हरी मिर्च / ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ)", price: 18, unit: "250g", v: ["100g", "250g", "500g"] },
    { cat: "vegetables", name: "Fresh Ginger Root (अदरक / ಶುಂಠಿ)", price: 32, unit: "250g", v: ["100g", "250g", "500g"] },
    { cat: "vegetables", name: "Desi Garlic Bulbs (लहसुन / ಬೆಳ್ಳುಳ್ಳಿ)", price: 45, unit: "250g", v: ["100g", "250g", "500g", "1 kg"] },
    { cat: "vegetables", name: "Tender Green Ladyfinger (भिंडी / ಬೆಂಡೆಕಾಯಿ)", price: 28, unit: "500g", v: ["250g", "500g", "1 kg"] },
    { cat: "vegetables", name: "Fresh Cabbage (पत्तागोभी / ಎಲೆಕೋಸು)", price: 30, unit: "1 pc", v: ["1 pc", "2 pcs"] },
    { cat: "fruits", name: "Yelakki Bananas (ಏಲಕ್ಕಿ ಬಾಳೆಹಣ್ಣು / केला)", price: 45, unit: "500g", v: ["500g", "1 kg", "2 kg"] },
    { cat: "fruits", name: "Royal Gala Crisp Apples (सेब / ಸೇಬು)", price: 110, unit: "500g", v: ["500g", "1 kg", "2 kg"] },
    { cat: "fruits", name: "Fresh Coconut with Water (ತೆಂಗಿನಕಾಯಿ / नारियल)", price: 35, unit: "1 pc", v: ["1 pc", "2 pcs", "5 pcs"] },
    { cat: "fruits", name: "Ruby Sweet Pomegranates (अनार / ದಾಳಿಂಬೆ)", price: 130, unit: "1 kg", v: ["500g", "1 kg", "2 kg"] },
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

      const brandList = brandsByCategory[t.cat] || ["Shagun Farm Fresh", "Gold Harvest", "Bettadapura Fresh"];
      const brand = brandList[Math.floor(Math.random() * brandList.length)];
      const variationNum = Math.floor(inventory.length / itemTemplates.length) + 1;
      
      const multiplier = (0.92 + Math.random() * 0.2);
      const basePrice = Math.round(t.price * multiplier);

      const variants = [];
      if (t.v && t.v.length > 0) {
        t.v.forEach(vName => {
          let factor = 1.0;
          if (vName.includes("100g")) factor = 0.16;
          else if (vName.includes("250g") || vName.includes("200g")) factor = 0.28;
          else if (vName.includes("500g") || vName.includes("500 ml")) factor = 0.52;
          else if (vName.includes("2 kg") || vName.includes("2 Litre") || vName.includes("2 pcs")) factor = 1.95;
          else if (vName.includes("3 kg")) factor = 2.9;
          else if (vName.includes("5 kg") || vName.includes("5 Litre") || vName.includes("5 pcs")) factor = 4.8;
          else if (vName.includes("10 kg")) factor = 9.3;
          else if (vName.includes("15 Litre") || vName.includes("25 kg")) factor = 14.2;
          
          variants.push({ name: `${vName} Pack`, price: Math.max(10, Math.round(basePrice * factor)) });
        });
      } else {
        variants.push({ name: t.unit, price: basePrice });
      }

      const isVegOrFruit = t.cat === "vegetables" || t.cat === "fruits";
      const defaultImg = isVegOrFruit 
        ? "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80";

      inventory.push({
        id: `shagun_${t.cat}_${currentId++}`,
        name: `${brand} ${t.name} (Batch #${variationNum})`,
        category: t.cat,
        price: variants[0] ? variants[0].price : basePrice,
        unit: t.unit,
        variants,
        inStock: true,
        badge: variationNum === 1 ? (isVegOrFruit ? "Farm Fresh" : "Popular") : (Math.random() > 0.75 ? "Value Deal" : null),
        description: `High purity hygienic fresh item packaged with store warranty at SHAGUN STORE, Bettadapura.`,
        image: defaultImg
      });
    }
  }

  return inventory;
}

export const INITIAL_PRODUCTS = generateFullStoreInventory(2050);
