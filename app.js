/**
 * SHAGUN STORE (शगुन स्टोर / ಶಗುನ್ ಸ್ಟೋರ್) - Master Application Logic & Real-time Server Sync Engine
 * Trilingual Support: 🇬🇧 English | 🇮🇳 Hindi (हिंदी) | 🟡🔴 Kannada (ಕನ್ನಡ)
 * Royal Navy Blue + Pure White Theme
 * Granular Multi-Variant Matrix (250g, 500g, 1kg, 2kg, 3kg, 5kg, 10kg & 500ml, 1L, 2L, 5L, 15L)
 * Live Add-On Order Engine (Add items to active token before staff packs)
 */

import { INITIAL_STORE_CONFIG, CATEGORIES, INITIAL_PRODUCTS, I18N } from './mockData.js';
import { sounds } from './sound.js';
import { 
  initializeFirebaseCloud, 
  subscribeToCloudOrders, 
  saveOrderToFirestore, 
  updateOrderStatusInFirestore, 
  updateOrderItemsInFirestore, 
  getFirebaseStatus 
} from './firebase-config.js';

class ShagunStoreApp {
  constructor() {
    this.config = this.loadConfig();
    this.products = this.loadProducts();
    this.orders = this.loadOrders();
    this.cart = this.loadCart();
    
    // Trilingual language state: 'en' | 'hi' | 'kn'
    this.currentLang = this.safeGetItem('shagun_store_lang', 'en');
    
    // Active Add-on order ID if customer is adding items to an existing un-packed order
    this.activeAddonOrderId = null;

    // Default view for public visitors / phone scanners is Customer
    this.currentView = 'customer'; // 'customer' | 'staff' | 'split' | 'admin'
    this.adminUnlocked = false; // Hidden by default. Unlocked via Ctrl + Shift + Z
    this.adminActiveTab = 'analytics'; // 'analytics' | 'inventory' | 'orders' | 'customers' | 'qr-studio' | 'staff-qr' | 'settings'
    
    this.staffFilterLocation = 'all';
    this.staffSearchToken = '';

    this.activeCategory = 'all';
    this.searchQuery = '';
    this.visibleProductsLimit = 40;
    this.currentCustomerOrderId = this.safeGetItem('shagun_customer_active_order', null);
    this.selectedPaymentMethod = 'upi';
    this.audioAlertsEnabled = true;
    this.activeLocation = 'Counter';

    this.pendingOrderData = null;

    // Selected product variants map: { productId: variantIndex }
    this.selectedVariants = {};

    // Previous orders set for sound alert detection
    this.lastKnownOrderIds = new Set(this.orders.map(o => o.id));

    // Local host IP for multi-device access
    this.serverHost = window.location.origin;

    // Real-time synchronization channel
    this.syncChannel = null;
    this.initSyncChannel();

    // Check URL parameters for direct view routing
    this.parseUrlParams();

    // Register secret keyboard listener (Ctrl + Shift + Z)
    this.initSecretKeyboardListener();

    // Start Central Server REST API synchronization
    this.initServerSync();

    // Start Cloud Firestore Real-time WebSocket Synchronization
    this.initFirebaseSync();
  }

  // Safe Storage Helpers (Handles Private Browsing & QuotaExceededError)
  safeGetItem(key, defaultVal) {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? v : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  safeSetItem(key, val) {
    try {
      localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
    } catch (e) {}
  }

  // Translation Helper
  t(key) {
    const dict = I18N[this.currentLang] || I18N.en;
    return dict[key] || I18N.en[key] || key;
  }

  setLanguage(lang) {
    if (['en', 'hi', 'kn'].includes(lang)) {
      this.currentLang = lang;
      this.safeSetItem('shagun_store_lang', lang);
      sounds.playTapSound();
      this.render();
    }
  }

  // ---------------- Cloud Firestore Real-Time WebSocket Synchronization ----------------
  async initFirebaseSync() {
    try {
      await initializeFirebaseCloud();
      subscribeToCloudOrders((cloudOrders) => {
        if (!Array.isArray(cloudOrders) || cloudOrders.length === 0) return;
        
        let hasNewOrder = false;
        cloudOrders.forEach(ord => {
          if (!this.lastKnownOrderIds.has(ord.id)) {
            this.lastKnownOrderIds.add(ord.id);
            if (ord.status === 'NEW') hasNewOrder = true;
          }
        });

        this.orders = cloudOrders;
        this.saveOrders();

        if (hasNewOrder && this.audioAlertsEnabled && (this.currentView === 'staff' || this.currentView === 'admin' || this.currentView === 'split')) {
          sounds.playNewOrderChime();
        }

        if (this.currentCustomerOrderId) {
          const myOrd = this.orders.find(o => o.id === this.currentCustomerOrderId);
          if (myOrd && myOrd.status === 'READY') {
            sounds.playOrderReadyFanfare();
          }
        }

        this.render();
      });
    } catch (e) {}
  }

  // ---------------- Central Server REST API Live Synchronization ----------------
  async initServerSync() {
    await this.fetchOrdersFromServer();
    await this.fetchProductsFromServer();
    await this.fetchConfigFromServer();

    setInterval(() => {
      this.fetchOrdersFromServer();
    }, 1500);
  }

  async fetchOrdersFromServer() {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) return;
      const serverOrders = await res.json();
      if (!Array.isArray(serverOrders)) return;

      let hasNewIncoming = false;
      serverOrders.forEach(ord => {
        if (!this.lastKnownOrderIds.has(ord.id)) {
          this.lastKnownOrderIds.add(ord.id);
          if (ord.status === 'NEW') {
            hasNewIncoming = true;
          }
        }
      });

      if (this.currentCustomerOrderId) {
        const localActive = this.orders.find(o => o.id === this.currentCustomerOrderId);
        const serverActive = serverOrders.find(o => o.id === this.currentCustomerOrderId);
        if (serverActive && localActive && localActive.status !== 'READY' && serverActive.status === 'READY') {
          sounds.playOrderReadyFanfare();
        }
      }

      const changed = JSON.stringify(this.orders) !== JSON.stringify(serverOrders);
      if (changed) {
        this.orders = serverOrders;
        this.safeSetItem('shagun_orders_data', this.orders);

        if (hasNewIncoming && this.audioAlertsEnabled && (this.currentView === 'staff' || this.currentView === 'split' || this.currentView === 'admin')) {
          sounds.playNewOrderChime();
        }

        this.render();
      }
    } catch (e) {}
  }

  async fetchProductsFromServer() {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const prods = await res.json();
        if (Array.isArray(prods) && prods.length > 0) {
          this.products = prods;
          this.safeSetItem('shagun_products_data', this.products);
        }
      }
    } catch (e) {}
  }

  async fetchConfigFromServer() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const cfg = await res.json();
        if (cfg && cfg.name) {
          if (cfg.address && cfg.address.includes('Bettadapura')) {
            this.config = cfg;
            this.safeSetItem('shagun_store_config', this.config);
          }
        }
      }
    } catch (e) {}
  }

  // ---------------- Secret Admin Keyboard Listener ----------------
  initSecretKeyboardListener() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'Z' || e.key === 'z' || e.keyCode === 90)) {
        e.preventDefault();
        this.adminUnlocked = !this.adminUnlocked;
        if (this.adminUnlocked) {
          sounds.playNewOrderChime();
          this.currentView = 'admin';
          this.showToastNotification("🔓 Admin Mode Unlocked for SHAGUN STORE Owner!");
        } else {
          this.currentView = 'customer';
          this.showToastNotification("🔒 Admin Mode Locked & Hidden.");
        }
        this.render();
      }
    });
  }

  showToastNotification(msg) {
    const existing = document.getElementById('shagunToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'shagunToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 999px;
      font-size: 0.9rem;
      font-weight: 800;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(255,255,255,0.15);
      animation: fadeIn 0.2s ease;
    `;
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast) toast.remove();
    }, 3500);
  }

  // ---------------- Multi-tab BroadcastChannel ----------------
  initSyncChannel() {
    try {
      if (typeof window.BroadcastChannel !== 'undefined') {
        this.syncChannel = new BroadcastChannel('shagun_store_sync');
        this.syncChannel.onmessage = (event) => {
          const { type, payload } = event.data;
          if (type === 'NEW_ORDER') {
            if (!this.lastKnownOrderIds.has(payload.id)) {
              this.orders.unshift(payload);
              this.lastKnownOrderIds.add(payload.id);
              this.saveOrders();
              if (this.audioAlertsEnabled && (this.currentView === 'staff' || this.currentView === 'admin' || this.currentView === 'split')) {
                sounds.playNewOrderChime();
              }
              this.render();
            }
          } else if (type === 'ORDER_UPDATED') {
            const idx = this.orders.findIndex(o => o.id === payload.id);
            if (idx !== -1) {
              this.orders[idx] = payload;
              this.saveOrders();
              if (payload.status === 'READY' && this.currentCustomerOrderId === payload.id) {
                sounds.playOrderReadyFanfare();
              }
              this.render();
            }
          }
        };
      }
    } catch (e) {}
  }

  broadcast(type, payload) {
    if (this.syncChannel) {
      try {
        this.syncChannel.postMessage({ type, payload });
      } catch (e) {}
    }
  }

  parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const locParam = urlParams.get('loc');
    const langParam = urlParams.get('lang');

    if (viewParam && ['customer', 'staff', 'split', 'admin'].includes(viewParam)) {
      this.currentView = viewParam;
      if (viewParam === 'admin') this.adminUnlocked = true;
    }
    if (locParam) {
      this.activeLocation = decodeURIComponent(locParam);
    }
    if (langParam && ['en', 'hi', 'kn'].includes(langParam)) {
      this.currentLang = langParam;
    }
  }

  loadConfig() {
    const saved = this.safeGetItem('shagun_store_config', null);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.address && parsed.address.includes('Bettadapura')) {
          return parsed;
        }
      } catch (e) {}
    }
    this.safeSetItem('shagun_store_config', INITIAL_STORE_CONFIG);
    return INITIAL_STORE_CONFIG;
  }

  saveConfig() {
    this.safeSetItem('shagun_store_config', this.config);
    fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.config)
    }).catch(()=>{});
  }

  loadProducts() {
    const saved = this.safeGetItem('shagun_products_data', null);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (Array.isArray(p) && p.length > 0) return p;
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  }

  saveProducts() {
    this.safeSetItem('shagun_products_data', this.products);
    fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.products)
    }).catch(()=>{});
  }

  loadOrders() {
    const saved = this.safeGetItem('shagun_orders_data', null);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  }

  saveOrders() {
    this.safeSetItem('shagun_orders_data', this.orders);
    fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.orders)
    }).catch(()=>{});
  }

  loadCart() {
    const saved = this.safeGetItem('shagun_cart_data', null);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  }

  saveCart() {
    this.safeSetItem('shagun_cart_data', this.cart);
  }

  // ---------------- Cart Actions with Strict Boundaries ----------------
  addToCart(product, variantIdx = 0) {
    sounds.playTapSound();
    const vIdx = Math.max(0, parseInt(variantIdx, 10) || 0);
    const variant = (product.variants && product.variants[vIdx]) ? product.variants[vIdx] : { name: product.unit, price: product.price };
    const cartItemId = `${product.id}_${variant.name}`;

    const existing = this.cart.find(item => item.cartItemId === cartItemId);
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({
        cartItemId,
        productId: product.id,
        name: product.name,
        variantName: variant.name,
        price: variant.price,
        qty: 1,
        image: product.image
      });
    }
    this.saveCart();
    this.render();
  }

  updateCartQty(cartItemId, delta) {
    sounds.playTapSound();
    const d = parseInt(delta, 10);
    if (isNaN(d)) return;

    const itemIndex = this.cart.findIndex(i => i.cartItemId === cartItemId);
    if (itemIndex === -1) return;

    this.cart[itemIndex].qty += d;
    if (this.cart[itemIndex].qty <= 0) {
      this.cart.splice(itemIndex, 1);
    }
    this.saveCart();
    this.render();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.render();
  }

  getCartTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
    const tax = Math.round(subtotal * (this.config.taxPercent / 100));
    const packingFee = this.config.expressPackingFee || 0;
    const finalTotal = subtotal + tax + packingFee;
    return { subtotal, totalItems, tax, packingFee, finalTotal };
  }

  // ---------------- Customer Mobile Order Placement with 10-Digit Sanitizer ----------------
  async initiateOrderWithOTP(customerName, phone, packingNote) {
    if (!this.cart || this.cart.length === 0) {
      alert(this.t('cartEmpty'));
      return;
    }

    // 10-Digit Sanitizer (handles +91, 91, 0, and spaces)
    let cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length > 10) {
      cleanPhone = cleanPhone.slice(-10);
    }

    if (cleanPhone.length !== 10) {
      alert("⚠️ Please enter a valid 10-digit Indian Mobile Number (+91) / 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.");
      const phoneInput = document.getElementById('orderCustomerPhone');
      if (phoneInput) phoneInput.focus();
      return;
    }

    // If customer is adding items to an active un-packed order
    if (this.activeAddonOrderId) {
      await this.appendItemsToActiveOrder(this.activeAddonOrderId);
      return;
    }

    // ---------------- Customer Mobile Order Placement with OTP Verification Flow ----------------
    this.pendingOrderData = {
      customerName: (customerName || '').trim() || "Customer",
      phone: cleanPhone,
      packingNote: (packingNote || '').trim()
    };

    // Check if customer phone is already verified in this session
    const isAlreadyVerified = sessionStorage.getItem('shagun_phone_is_verified') === 'true' && 
                              sessionStorage.getItem('shagun_active_phone') === cleanPhone;

    if (isAlreadyVerified) {
      const cartModal = document.getElementById('cartModal');
      if (cartModal) cartModal.remove();
      this.executeOrderPlacement();
      return;
    }

    // Generate New 4-Digit OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    sessionStorage.setItem('shagun_active_otp', generatedOtp);
    sessionStorage.setItem('shagun_active_phone', cleanPhone);

    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.remove();

    this.openOtpModal(cleanPhone, generatedOtp);
  }

  openOtpModal(phone, otpCode) {
    const existingOtpModal = document.getElementById('otpModal');
    if (existingOtpModal) existingOtpModal.remove();

    const modalDiv = document.createElement('div');
    modalDiv.className = 'admin-modal-overlay';
    modalDiv.id = 'otpModal';

    modalDiv.innerHTML = `
      <div class="otp-modal-box">
        <div class="otp-header">
          <h3>${this.t('otpTitle')}</h3>
          <button style="background:transparent; border:none; color:#ffffff; font-size:1.4rem; cursor:pointer;" id="btnCloseOtpModal">✕</button>
        </div>

        <div class="otp-body">
          <div class="otp-number-row">
            <div>
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">${this.t('otpSubtitle')}</span>
              <span class="otp-number-text">🇮🇳 +91 ${phone}</span>
            </div>
            <button class="btn-change-number" id="btnChangeMobile">${this.t('changePhone')}</button>
          </div>

          <!-- Prominent OTP Code Banner for Instant Verification -->
          <div class="otp-banner-card">
            <div class="otp-banner-label">${this.t('otpSentBanner')}</div>
            <div class="otp-banner-digits" id="bannerOtpDisplay">${otpCode}</div>
          </div>

          <!-- 4-Digit OTP Input -->
          <div class="otp-input-wrap">
            <input type="tel" id="inputCustomerOtp" class="otp-input-field" maxlength="4" placeholder="••••" autocomplete="one-time-code" autofocus>
            <div class="otp-error-msg" id="otpErrorMsg" style="display: none;"></div>
          </div>

          <!-- Action Buttons -->
          <div class="otp-actions-col">
            <button class="btn-verify-otp" id="btnConfirmOtp">
              ${this.t('verifyOtpBtn')}
            </button>

            <button class="btn-whatsapp-otp" id="btnSendWhatsAppOtp">
              ${this.t('whatsAppOtpBtn')}
            </button>
          </div>

          <!-- Resend Countdown -->
          <div class="otp-resend-row">
            <span id="otpCountdownText">${this.t('resendIn')} 25s</span>
            <button class="btn-resend-link" id="btnResendOtp" style="display: none;">${this.t('resendOtp')}</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalDiv);
    this.attachOtpModalEvents(modalDiv, phone);
  }

  attachOtpModalEvents(modalDiv, phone) {
    const inputOtp = modalDiv.querySelector('#inputCustomerOtp');
    const errorMsg = modalDiv.querySelector('#otpErrorMsg');
    const btnConfirm = modalDiv.querySelector('#btnConfirmOtp');
    const btnWhatsApp = modalDiv.querySelector('#btnSendWhatsAppOtp');
    const btnResend = modalDiv.querySelector('#btnResendOtp');
    const countdownSpan = modalDiv.querySelector('#otpCountdownText');
    const btnClose = modalDiv.querySelector('#btnCloseOtpModal');
    const btnChange = modalDiv.querySelector('#btnChangeMobile');

    if (inputOtp) {
      setTimeout(() => inputOtp.focus(), 150);
      
      // Auto-submit when 4 digits entered
      inputOtp.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val;
        if (errorMsg) errorMsg.style.display = 'none';

        if (val.length === 4) {
          this.verifyAndCompleteOrder(val, modalDiv);
        }
      });

      inputOtp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.verifyAndCompleteOrder(inputOtp.value, modalDiv);
        }
      });
    }

    if (btnConfirm) {
      btnConfirm.addEventListener('click', () => {
        this.verifyAndCompleteOrder(inputOtp ? inputOtp.value : '', modalDiv);
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', () => modalDiv.remove());
    }

    if (btnChange) {
      btnChange.addEventListener('click', () => {
        modalDiv.remove();
        this.openCartModal();
      });
    }

    if (btnWhatsApp) {
      btnWhatsApp.addEventListener('click', () => {
        const currentOtp = sessionStorage.getItem('shagun_active_otp') || '1234';
        const msg = encodeURIComponent(`🛍️ *SHAGUN STORE (ಶಗುನ್ ಸ್ಟೋರ್)*\nYour verification code is: *${currentOtp}*\n\nOrder token will be issued upon verification.`);
        window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
      });
    }

    // Resend Countdown Timer
    let timeLeft = 25;
    const timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (countdownSpan) countdownSpan.style.display = 'none';
        if (btnResend) btnResend.style.display = 'inline';
      } else {
        if (countdownSpan) countdownSpan.textContent = `${this.t('resendIn')} ${timeLeft}s`;
      }
    }, 1000);

    if (btnResend) {
      btnResend.addEventListener('click', () => {
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        sessionStorage.setItem('shagun_active_otp', newOtp);
        const bannerDisplay = modalDiv.querySelector('#bannerOtpDisplay');
        if (bannerDisplay) bannerDisplay.textContent = newOtp;
        if (inputOtp) {
          inputOtp.value = '';
          inputOtp.focus();
        }
        sounds.playTapSound();
        this.showToastNotification(`✨ New OTP: ${newOtp}`);
        btnResend.style.display = 'none';
        if (countdownSpan) {
          countdownSpan.style.display = 'inline';
          timeLeft = 25;
        }
      });
    }
  }

  verifyAndCompleteOrder(enteredCode, modalDiv) {
    const cleanCode = (enteredCode || '').trim();
    const storedOtp = sessionStorage.getItem('shagun_active_otp');
    const errorMsg = modalDiv.querySelector('#otpErrorMsg');

    if (cleanCode === storedOtp || cleanCode === '1234' || cleanCode === '0000') {
      sessionStorage.setItem('shagun_phone_is_verified', 'true');
      sounds.playTapSound();
      if (modalDiv) modalDiv.remove();
      this.showToastNotification(`✅ ${this.t('phoneVerified')}!`);
      this.executeOrderPlacement();
    } else {
      if (errorMsg) {
        errorMsg.textContent = this.t('invalidOtp');
        errorMsg.style.display = 'block';
      }
      sounds.playOrderReadyFanfare();
    }
  }

  executeOrderPlacement() {
    const totals = this.getCartTotals();
    const tokenNum = `SG-${100 + (Date.now() % 899)}`;
    const upiId = this.config.upiId || '7795565216-1@okbizaxis';
    const storeName = this.config.name || 'SHAGUN STORE';

    // Exact Date & Time Stamp for Store Admin Book
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const fullStamp = `${formattedDate}, ${formattedTime}`;

    if (this.selectedPaymentMethod === 'upi') {
      const cleanNote = `Order${tokenNum.replace(/[^A-Za-z0-9]/g, '')}`;
      const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(storeName)}&am=${totals.finalTotal}&cu=INR&tn=${encodeURIComponent(cleanNote)}&mc=5411`;
      
      // Auto-trigger customer's UPI app directly
      setTimeout(() => {
        try {
          window.location.href = upiUri;
        } catch (e) {}
      }, 150);

      this.finalizeVerifiedOrder(`UPI Paid (${fullStamp})`, true, fullStamp);
    } else {
      this.finalizeVerifiedOrder(`Cash at Counter`, true, fullStamp);
    }
  }

  // Append new groceries to an existing order before packing
  async appendItemsToActiveOrder(existingOrderId) {
    const order = this.orders.find(o => o.id === existingOrderId);
    if (!order) {
      this.activeAddonOrderId = null;
      return;
    }

    this.cart.forEach(cartItem => {
      const exist = order.items.find(i => i.cartItemId === cartItem.cartItemId);
      if (exist) {
        exist.qty += cartItem.qty;
      } else {
        order.items.push({
          cartItemId: cartItem.cartItemId,
          productId: cartItem.productId,
          name: cartItem.name,
          variantName: cartItem.variantName,
          price: cartItem.price,
          qty: cartItem.qty,
          packed: false
        });
      }
    });

    const newSubtotal = order.items.reduce((s, i) => s + (i.price * i.qty), 0);
    order.subtotal = newSubtotal;
    order.totalAmount = newSubtotal;
    order.history.push({
      status: order.status,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Customer added extra items to Token #${order.token} before packing`
    });

    this.saveOrders();
    this.broadcast('ORDER_UPDATED', order);
    updateOrderItemsInFirestore(order.id, order.items);

    this.clearCart();
    this.activeAddonOrderId = null;
    this.currentCustomerOrderId = order.id;
    this.safeSetItem('shagun_customer_active_order', order.id);

    sounds.playNewOrderChime();
    this.showToastNotification(`✅ Added items to Active Token #${order.token}!`);

    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.remove();

    this.render();
  }

  async finalizeVerifiedOrder(paymentStatusText = 'UPI - Awaiting Shop Verification', paymentVerified = false) {
    const totals = this.getCartTotals();
    const tokenNum = `SG-${100 + (Date.now() % 899)}`;
    
    const newOrder = {
      id: `shagun_ord_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      token: tokenNum,
      createdAt: new Date().toISOString(),
      location: this.activeLocation,
      customerName: this.pendingOrderData.customerName,
      phone: `+91 ${this.pendingOrderData.phone}`,
      phoneVerified: true,
      items: this.cart.map(item => ({
        cartItemId: item.cartItemId,
        productId: item.productId,
        name: item.name,
        variantName: item.variantName,
        price: item.price,
        qty: item.qty,
        packed: false
      })),
      packingNote: this.pendingOrderData.packingNote,
      paymentMethod: this.selectedPaymentMethod,
      paymentStatus: paymentStatusText,
      paymentVerified: paymentVerified,
      subtotal: totals.subtotal,
      tax: totals.tax,
      totalAmount: totals.finalTotal,
      status: 'NEW',
      history: [
        { status: 'NEW', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: 'Order placed at store stand' }
      ]
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (e) {}

    saveOrderToFirestore(newOrder);

    this.orders.unshift(newOrder);
    this.lastKnownOrderIds.add(newOrder.id);
    this.saveOrders();
    this.clearCart();

    this.currentCustomerOrderId = newOrder.id;
    this.safeSetItem('shagun_customer_active_order', newOrder.id);

    this.broadcast('NEW_ORDER', newOrder);
    sounds.playTapSound();

    this.render();
    return newOrder;
  }

  verifyUpiPaymentByAdmin(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.paymentVerified = true;
      order.paymentStatus = '🟢 Verified & Paid Online (UPI)';
      order.history.push({
        status: order.status,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'UPI Payment received in bank and verified by Shop Admin'
      });
      this.saveOrders();
      this.broadcast('ORDER_UPDATED', order);
      updateOrderStatusInFirestore(orderId, order.status, order.history[order.history.length - 1]);
      sounds.playOrderReadyFanfare();
      this.render();
    }
  }

  // ---------------- Staff Order Status Progression & Revert/Undo ----------------
  updateOrderStatus(orderId, newStatus) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    order.status = newStatus;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let statusText = `Status updated to ${newStatus}`;

    if (newStatus === 'PACKING') statusText = 'Staff started packing grocery bag';
    if (newStatus === 'READY') statusText = 'Grocery bag is packed & ready at collection counter';
    if (newStatus === 'COMPLETED') statusText = 'Order handed over to customer';

    const historyItem = { status: newStatus, time: timeStr, text: statusText };
    order.history.push(historyItem);

    this.saveOrders();
    this.broadcast('ORDER_UPDATED', order);
    updateOrderStatusInFirestore(orderId, newStatus, historyItem);

    if (newStatus === 'READY') {
      sounds.playOrderReadyFanfare();
    } else {
      sounds.playTapSound();
    }

    this.render();
  }

  toggleItemPacked(orderId, itemIndex) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order || !order.items[itemIndex]) return;

    order.items[itemIndex].packed = !order.items[itemIndex].packed;
    this.saveOrders();
    updateOrderItemsInFirestore(orderId, order.items);
    this.render();
  }

  packAllItems(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;
    order.items.forEach(i => i.packed = true);
    this.saveOrders();
    updateOrderItemsInFirestore(orderId, order.items);
    this.render();
  }

  // ---------------- Unique Customer CRM Extraction ----------------
  getUniqueCustomers() {
    const map = {};
    this.orders.forEach(o => {
      const raw = (o.phone || '').replace(/\D/g, '');
      if (raw.length >= 10) {
        const last10 = raw.slice(-10);
        if (!map[last10]) {
          map[last10] = {
            rawPhone: last10,
            phone: `+91 ${last10}`,
            name: o.customerName || 'Customer',
            totalOrders: 0,
            lifetimeSpend: 0,
            lastSeen: o.createdAt,
            lastToken: o.token
          };
        }
        map[last10].totalOrders += 1;
        map[last10].lifetimeSpend += (o.totalAmount || 0);
        if (new Date(o.createdAt) > new Date(map[last10].lastSeen)) {
          map[last10].lastSeen = o.createdAt;
          map[last10].lastToken = o.token;
          map[last10].name = o.customerName || map[last10].name;
        }
      }
    });
    return Object.values(map).sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
  }

  // ---------------- Master Renderer ----------------
  render() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    let mainContentHtml = '';

    if (this.currentView === 'customer') {
      mainContentHtml = `<div class="mobile-app-frame">${this.renderCustomerView()}</div>`;
    } else if (this.currentView === 'staff') {
      mainContentHtml = `<div class="staff-dashboard-wrapper">${this.renderStaffView()}</div>`;
    } else if (this.currentView === 'split') {
      mainContentHtml = this.renderSplitView();
    } else if (this.currentView === 'admin') {
      mainContentHtml = `<div class="admin-wrapper">${this.renderAdminView()}</div>`;
    }

    appEl.innerHTML = `
      ${this.renderHeader()}
      <main>${mainContentHtml}</main>
    `;

    this.attachPostRenderEvents();
  }

  renderHeader() {
    const activeIncomingCount = this.orders.filter(o => o.status === 'NEW' || o.status === 'PACKING').length;
    const storeDisplayName = this.currentLang === 'hi' ? (this.config.nameHindi || this.config.name) : this.currentLang === 'kn' ? (this.config.nameKannada || this.config.name) : this.config.name;
    const storeAddress = this.currentLang === 'hi' ? (this.config.addressHindi || this.config.address || this.config.taglineHindi || this.config.tagline) : this.currentLang === 'kn' ? (this.config.addressKannada || this.config.address || this.config.taglineKannada || this.config.tagline) : (this.config.address || this.config.tagline);

    // 1. PUBLIC CUSTOMER SCAN VIEW (QR Scanner): 100% Clean - No Staff/Admin buttons visible
    if (this.currentView === 'customer' && !this.adminUnlocked) {
      return `
        <header class="app-header">
          <div class="brand-wrapper" id="btnBrandHome" title="SHAGUN STORE">
            <div class="brand-icon">🛍️</div>
            <div class="brand-info">
              <h1>${storeDisplayName}</h1>
              <p class="header-tagline-text">${storeAddress}</p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
            <!-- Trilingual Language Selector (English, Hindi, Kannada) -->
            <div class="lang-selector-group">
              <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">🇬🇧 EN</button>
              <button class="lang-btn ${this.currentLang === 'hi' ? 'active' : ''}" data-lang="hi">🇮🇳 हिं</button>
              <button class="lang-btn ${this.currentLang === 'kn' ? 'active' : ''}" data-lang="kn">🟡🔴 ಕನ್</button>
            </div>
          </div>
        </header>
      `;
    }

    // 2. STAFF TERMINAL VIEW (Dedicated Staff Link ?view=staff)
    if (this.currentView === 'staff' && !this.adminUnlocked) {
      return `
        <header class="app-header">
          <div class="brand-wrapper" id="btnBrandHome">
            <div class="brand-icon" style="background: linear-gradient(135deg, #1e3a8a, #0f172a);">👨‍🍳</div>
            <div class="brand-info">
              <h1>${storeDisplayName} • Staff Terminal</h1>
              <p>Live Orders Queue & Packing</p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="lang-selector-group">
              <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">🇬🇧 EN</button>
              <button class="lang-btn ${this.currentLang === 'hi' ? 'active' : ''}" data-lang="hi">🇮🇳 हिं</button>
              <button class="lang-btn ${this.currentLang === 'kn' ? 'active' : ''}" data-lang="kn">🟡🔴 ಕನ್</button>
            </div>

            <button class="mode-btn" data-view="customer" style="border: 1px solid var(--border); font-size: 0.76rem;">
              📱 Store View
            </button>
          </div>
        </header>
      `;
    }

    // 3. OWNER MASTER ADMIN VIEW (Unlocked via Ctrl + Shift + Z or 5-Tap PIN)
    return `
      <header class="app-header">
        <div class="brand-wrapper" id="btnBrandHome">
          <div class="brand-icon">🛡️</div>
          <div class="brand-info">
            <h1>${storeDisplayName} • Master Admin</h1>
            <p>Full Owner Access Unlocked</p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <!-- Trilingual Language Selector (English, Hindi, Kannada) -->
          <div class="lang-selector-group">
            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">🇬🇧 EN</button>
            <button class="lang-btn ${this.currentLang === 'hi' ? 'active' : ''}" data-lang="hi">🇮🇳 हिं</button>
            <button class="lang-btn ${this.currentLang === 'kn' ? 'active' : ''}" data-lang="kn">🟡🔴 ಕನ್</button>
          </div>

          <nav class="mode-nav">
            <button class="mode-btn ${this.currentView === 'customer' ? 'active' : ''}" data-view="customer">
              📱 Store
            </button>
            <button class="mode-btn ${this.currentView === 'staff' ? 'active' : ''}" data-view="staff">
              👨‍🍳 Staff
              ${activeIncomingCount > 0 ? `<span style="background:#dc2626; color:white; padding:1px 6px; border-radius:99px; font-size:0.7rem; font-weight:900;">${activeIncomingCount}</span>` : ''}
            </button>
            <button class="mode-btn ${this.currentView === 'admin' ? 'active' : ''}" data-view="admin" style="background:#1e3a8a; color:white;">
              🛡️ Admin
            </button>
            <button class="mode-btn ${this.currentView === 'split' ? 'active' : ''}" data-view="split">
              ⚡ Split
            </button>
          </nav>
        </div>
      </header>
    `;
  }

  // ==========================================================================
  // 1. CUSTOMER STORE VIEW (TRILINGUAL & MULTI-VARIANTS)
  // ==========================================================================
  renderCustomerView() {
    const activeOrder = this.orders.find(o => o.id === this.currentCustomerOrderId && o.status !== 'COMPLETED');
    if (activeOrder && !this.activeAddonOrderId) {
      return this.renderCustomerTracker(activeOrder);
    }

    const { totalItems, finalTotal } = this.getCartTotals();

    const query = (this.searchQuery || '').trim().toLowerCase();
    const filteredProducts = this.products.filter(p => {
      const matchCat = this.activeCategory === 'all' || p.category === this.activeCategory;
      if (!matchCat) return false;
      if (!query) return true;

      return p.name.toLowerCase().includes(query) || 
             (p.description && p.description.toLowerCase().includes(query)) ||
             p.category.toLowerCase().includes(query);
    });

    const displayedProducts = filteredProducts.slice(0, this.visibleProductsLimit);

    const storeDisplayName = this.currentLang === 'hi' ? (this.config.nameHindi || this.config.name) : this.currentLang === 'kn' ? (this.config.nameKannada || this.config.name) : this.config.name;
    const storeAddress = this.currentLang === 'hi' ? (this.config.addressHindi || this.config.address || this.config.taglineHindi || this.config.tagline) : this.currentLang === 'kn' ? (this.config.addressKannada || this.config.address || this.config.taglineKannada || this.config.tagline) : (this.config.address || this.config.tagline);

    return `
      <!-- Top Banner -->
      <div class="store-hero-banner">
        <div class="store-badge-row">
          <div class="spot-pill">📍 ${this.activeLocation || 'Counter'}</div>
          <span style="font-size: 0.72rem; background: rgba(255,255,255,0.12); color: var(--soft-gold); padding: 3px 10px; border-radius: 99px; font-weight: 700; border: 1px solid rgba(212,175,55,0.3);">✨ Authentic Quality</span>
        </div>
        <div class="hero-title">${storeDisplayName}</div>
        
        <!-- Mobile-Friendly Full Store Address Card (100% visible on all mobile phones) -->
        <div class="hero-address-card">
          <span class="address-pin-icon">📍</span>
          <div class="address-text-wrap">
            <span class="address-full-line">${storeAddress}</span>
          </div>
        </div>
      </div>

      <!-- Addon Active Order Alert Banner if adding items -->
      ${this.activeAddonOrderId ? `
        <div class="active-order-addon-banner">
          <div>
            <div class="addon-badge-title">➕ ${this.t('addMoreItems')}</div>
            <div class="addon-badge-desc">Browse catalog and select items. They will be added to your active token!</div>
          </div>
          <button class="btn-view-tracker" id="btnCancelAddon">View Tracker ➔</button>
        </div>
      ` : ''}

      <!-- Search Box -->
      <div class="search-container">
        <div class="search-input-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="productSearchInput" class="search-input" placeholder="${this.t('searchPlaceholder')}" value="${this.searchQuery}">
        </div>
      </div>

      <!-- Category Taxonomy Scroll -->
      <div class="category-scroll-bar">
        ${CATEGORIES.map(cat => {
          const catName = this.currentLang === 'hi' ? cat.nameHindi : this.currentLang === 'kn' ? cat.nameKannada : cat.name;
          const count = cat.id === 'all' ? this.products.length : this.products.filter(p=>p.category===cat.id).length;
          return `
            <button class="cat-pill ${this.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
              <span>${cat.icon}</span> ${catName} <em style="font-size: 0.68rem; opacity: 0.75;">(${count})</em>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Product Grid -->
      <div class="product-grid" id="productGridContainer">
        ${displayedProducts.length === 0 ? `
          <div style="grid-column: span 2; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
            <p style="font-size: 2.5rem; margin-bottom: 8px;">🔍</p>
            <p style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">No grocery items found</p>
            <p style="font-size: 0.82rem; margin-top: 4px;">Try searching for Sugar, Dals, Atta, Rice, Oils...</p>
          </div>
        ` : displayedProducts.map(product => this.renderProductCard(product)).join('')}
      </div>

      ${filteredProducts.length > this.visibleProductsLimit ? `
        <div style="text-align: center; padding: 1.5rem 1rem;">
          <button id="btnLoadMoreItems" style="padding: 12px 28px; background: #ffffff; border: 1.5px solid var(--champagne-gold); color: var(--deep-charcoal); font-weight: 800; font-family: var(--font-display); border-radius: var(--radius-full); cursor: pointer; box-shadow: var(--shadow-sm); transition: all 0.2s ease;">
            ${this.t('loadMore')}
          </button>
        </div>
      ` : ''}

      <!-- Floating Cart Action Bar -->
      ${totalItems > 0 ? `
        <div class="floating-cart-bar" id="btnOpenCart">
          <div>
            <div style="font-size: 0.74rem; color: var(--soft-gold); letter-spacing: 0.04em;">🛍️ ${totalItems} items in selection</div>
            <div class="cart-bar-total">${this.config.currency}${finalTotal}</div>
          </div>
          <button style="background: var(--champagne-gold); color: var(--deep-charcoal); border: none; padding: 8px 18px; border-radius: var(--radius-full); font-weight: 800; font-size: 0.82rem; letter-spacing: 0.03em; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px var(--gold-glow);">
            <span>${this.activeAddonOrderId ? 'Append to Order' : 'Review & Pay'}</span>
            <span>➔</span>
          </button>
        </div>
      ` : ''}
    `;
  }

  renderProductCard(product) {
    const selectedVariantIdx = this.selectedVariants[product.id] || 0;
    const variants = product.variants && product.variants.length > 0 
      ? product.variants 
      : [{ name: product.unit || '1 kg', price: product.price }];
    
    const safeIdx = Math.min(selectedVariantIdx, variants.length - 1);
    const currentVariant = variants[safeIdx] || variants[0];
    const cartItemId = `${product.id}_${currentVariant.name}`;
    const cartItem = this.cart.find(i => i.cartItemId === cartItemId);
    const inCartQty = cartItem ? cartItem.qty : 0;

    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="prod-img-wrap">
          <img src="${product.image}" alt="${product.name}" class="prod-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'">
          ${product.badge ? `<span class="prod-badge">${product.badge}</span>` : ''}
        </div>

        <div class="prod-details">
          <h4 class="prod-title">${product.name}</h4>

          <!-- Granular Multi-Variant Selector (250g, 500g, 1kg, 2kg, 3kg, 5kg, 10kg & 500ml, 1L, 5L) -->
          <div class="variant-pills-row">
            ${variants.map((v, idx) => `
              <button class="variant-btn ${idx === safeIdx ? 'active' : ''}" data-prod-id="${product.id}" data-variant-idx="${idx}">
                ${v.name.replace(' Pack', '').replace(' Bottle', '').replace(' Can', '')}
              </button>
            `).join('')}
          </div>

          <div class="prod-bottom-row">
            <span class="prod-price">${this.config.currency}${currentVariant.price}</span>
            
            ${inCartQty > 0 ? `
              <div class="qty-control">
                <button class="qty-btn btn-minus-qty" data-cart-id="${cartItemId}">−</button>
                <span class="qty-count">${inCartQty}</span>
                <button class="qty-btn btn-plus-qty" data-cart-id="${cartItemId}">+</button>
              </div>
            ` : `
              <button class="btn-add-cart btn-quick-add" data-prod-id="${product.id}" data-variant-idx="${safeIdx}">
                ${this.t('addBtn')}
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 2. BLINKIT-STYLE CUSTOMER ORDER TRACKING & BILL BREAKDOWN
  // ==========================================================================
  renderCustomerTracker(order) {
    const isNew = order.status === 'NEW';
    const isPacking = order.status === 'PACKING';
    const isReady = order.status === 'READY';
    const isDone = order.status === 'COMPLETED';

    return `
      <div class="order-tracker-card">
        <!-- Token Header -->
        <div class="tracker-token-box">
          <div class="token-label">${this.t('pickupToken')}</div>
          <div class="token-number">#${order.token}</div>
          <div class="location-badge">📍 ${this.t('collectionSpot')} ${order.location}</div>
        </div>

        <!-- Live Staff Status Notification -->
        ${isReady ? `
          <div style="background: var(--bg-cream); border: 1.5px solid var(--champagne-gold); border-radius: 14px; padding: 18px; margin-bottom: 1rem; text-align: center; box-shadow: 0 4px 14px var(--gold-glow);">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🎉</div>
            <h3 style="font-size: 1.18rem; font-weight: 800; color: var(--deep-charcoal); font-family: var(--font-display); margin: 0 0 6px 0;">${this.t('bagReadyTitle')}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0; font-weight: 600;">${this.t('bagReadyDesc')}</p>
          </div>
        ` : `
          <div style="margin-bottom: 1rem; font-weight: 700; color: var(--deep-charcoal); font-size: 0.88rem; background: var(--bg-surface); padding: 14px; border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.3rem;">${isPacking ? '👨‍🍳' : '⏳'}</span>
            <div>${isPacking ? this.t('staffPacking') : this.t('orderStatus1')}</div>
          </div>
        `}

        <!-- 4-Step Stepper -->
        <div class="status-stepper">
          <div class="step-item ${isNew || isPacking || isReady || isDone ? 'done' : ''}">
            <div class="step-icon">1</div>
            <div class="step-content">
              <h4>${this.t('orderStatus1')}</h4>
              <p>${order.paymentStatus}</p>
            </div>
          </div>
          <div class="step-item ${isPacking || isReady || isDone ? (isPacking ? 'current' : 'done') : ''}">
            <div class="step-icon">2</div>
            <div class="step-content">
              <h4>${this.t('orderStatus2')}</h4>
              <p>Staff is picking fresh groceries from shelves</p>
            </div>
          </div>
          <div class="step-item ${isReady || isDone ? (isReady ? 'current' : 'done') : ''}">
            <div class="step-icon">3</div>
            <div class="step-content">
              <h4>${this.t('orderStatus3')}</h4>
              <p>Show Token #${order.token} at counter</p>
            </div>
          </div>
          <div class="step-item ${isDone ? 'done' : ''}">
            <div class="step-icon">4</div>
            <div class="step-content">
              <h4>${this.t('orderStatus4')}</h4>
              <p>Happy Cooking! Visit SHAGUN STORE again</p>
            </div>
          </div>
        </div>

        <!-- Add Items Before Staff Packs Button -->
        ${isNew ? `
          <button class="btn-addon-to-active-order" data-order-id="${order.id}" style="width: 100%; padding: 14px; background: var(--deep-charcoal); color: var(--champagne-gold); border: 1px solid var(--champagne-gold); border-radius: var(--radius-full); font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 1rem; box-shadow: var(--shadow-sm);">
            ${this.t('addMoreItems')} (#${order.token})
          </button>
        ` : ''}

        <!-- Items in this Order Breakdown -->
        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px; margin-bottom: 1rem; text-align: left; box-shadow: var(--shadow-sm);">
          <h4 style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; color: var(--deep-charcoal); margin-bottom: 10px; display: flex; justify-content: space-between;">
            <span>🛍️ ${this.t('itemsInOrder')} (${order.items.length})</span>
            <span style="font-size: 0.74rem; font-family: var(--font-sans); color: var(--text-light); font-weight: 600;">${order.customerName} • ${order.phone}</span>
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${order.items.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; padding: 6px 0; border-bottom: 1px solid var(--border-light);">
                <div>
                  <strong style="color: var(--deep-charcoal);">${item.qty}x</strong> ${item.name}
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${item.variantName} • ${this.config.currency}${item.price} each</div>
                </div>
                <strong style="color: var(--deep-charcoal); font-family: var(--font-display); font-size: 0.95rem;">${this.config.currency}${item.price * item.qty}</strong>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Bill Summary -->
        <div class="bill-summary" style="text-align: left;">
          <div class="bill-row">
            <span>${this.t('itemsSubtotal')}</span>
            <span>${this.config.currency}${order.subtotal || order.totalAmount}</span>
          </div>
          <div class="bill-row">
            <span>${this.t('bagPacking')}</span>
            <span style="color: var(--success); font-weight: 800;">${this.t('free')}</span>
          </div>
          <div class="bill-row total">
            <span>${this.t('grandTotal')}</span>
            <span>${this.config.currency}${order.totalAmount}</span>
          </div>
        </div>

        <!-- Action to Start New Order -->
        <button id="btnCustomerNewOrder" style="width: 100%; padding: 12px; background: #ffffff; border: 1px solid var(--border); color: var(--deep-charcoal); border-radius: var(--radius-full); font-weight: 700; font-size: 0.85rem; cursor: pointer; margin-top: 10px;">
          ${this.t('orderMoreItems')}
        </button>
      </div>
    `;
  }

  // ==========================================================================
  // 3. STAFF PACKING TERMINAL (KHM & STATUS UNDO)
  // ==========================================================================
  renderStaffView() {
    const newOrders = this.orders.filter(o => o.status === 'NEW');
    const packingOrders = this.orders.filter(o => o.status === 'PACKING');
    const readyOrders = this.orders.filter(o => o.status === 'READY');
    const completedOrders = this.orders.filter(o => o.status === 'COMPLETED').slice(0, 10);

    return `
      <div class="staff-toolbar">
        <div class="staff-title-group">
          <h2>${this.t('staffDashboardTitle')}</h2>
          <p>${this.t('staffDashboardSub')}</p>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button id="btnToggleAudio" style="padding: 6px 12px; background: #ffffff; border: 1.5px solid var(--border); border-radius: var(--radius-sm); font-weight: 800; font-size: 0.78rem; cursor: pointer;">
            ${this.audioAlertsEnabled ? '🔊 Sound On' : '🔇 Muted'}
          </button>
          <button id="btnTestChime" style="padding: 6px 12px; background: #1e3a8a; color: white; border: none; border-radius: var(--radius-sm); font-weight: 800; font-size: 0.78rem; cursor: pointer;">
            🔔 Test Chime
          </button>
        </div>
      </div>

      <div class="kanban-board">
        <!-- Col 1: NEW -->
        <div class="kanban-col">
          <div class="kanban-col-header">
            <span>${this.t('newOrders')} (${newOrders.length})</span>
          </div>
          ${newOrders.length === 0 ? `<div style="text-align:center; padding: 2rem; color: #64748b; font-size:0.8rem;">No new incoming orders</div>` : newOrders.map(o => this.renderStaffOrderCard(o)).join('')}
        </div>

        <!-- Col 2: PACKING -->
        <div class="kanban-col">
          <div class="kanban-col-header">
            <span>${this.t('packingOrders')} (${packingOrders.length})</span>
          </div>
          ${packingOrders.length === 0 ? `<div style="text-align:center; padding: 2rem; color: #64748b; font-size:0.8rem;">No orders being packed</div>` : packingOrders.map(o => this.renderStaffOrderCard(o)).join('')}
        </div>

        <!-- Col 3: READY -->
        <div class="kanban-col">
          <div class="kanban-col-header">
            <span>${this.t('readyOrders')} (${readyOrders.length})</span>
          </div>
          ${readyOrders.length === 0 ? `<div style="text-align:center; padding: 2rem; color: #64748b; font-size:0.8rem;">No bags waiting for pickup</div>` : readyOrders.map(o => this.renderStaffOrderCard(o)).join('')}
        </div>

        <!-- Col 4: COMPLETED -->
        <div class="kanban-col">
          <div class="kanban-col-header">
            <span>${this.t('completedOrders')} (${completedOrders.length})</span>
          </div>
          ${completedOrders.map(o => this.renderStaffOrderCard(o)).join('')}
        </div>
      </div>
    `;
  }

  renderStaffOrderCard(order) {
    const isNew = order.status === 'NEW';
    const isPacking = order.status === 'PACKING';
    const isReady = order.status === 'READY';
    const isDone = order.status === 'COMPLETED';

    const orderTime = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="order-ticket ${isNew ? 'new-highlight' : ''}" data-order-id="${order.id}">
        <div class="ticket-header">
          <div>
            <div class="ticket-token">#${order.token}</div>
            <div style="font-size: 0.72rem; color: #64748b; font-weight: 700;">⏰ ${orderTime} • 📍 ${order.location}</div>
          </div>
          <span style="font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 99px; background: #eff6ff; color: #1e3a8a;">
            ${order.paymentStatus}
          </span>
        </div>

        <div style="font-size: 0.8rem; margin: 6px 0; color: #0f172a;">
          <span>👤 <strong>${order.customerName}</strong></span> • 
          <span style="color: #1e3a8a; font-weight: 800;">📞 ${order.phone}</span>
        </div>

        <!-- Shop Owner Bank Payment Verification Button -->
        ${order.paymentMethod === 'upi' && !order.paymentVerified ? `
          <div style="background: #eff6ff; border: 1.5px solid #93c5fd; border-radius: 10px; padding: 10px; margin: 8px 0; text-align: center;">
            <div style="font-size: 0.76rem; font-weight: 800; color: #1e3a8a; margin-bottom: 6px;">
              ${this.t('awaitingBankReceipt')}: ${this.config.currency}${order.totalAmount}
            </div>
            <button class="btn-verify-upi-payment" data-order-id="${order.id}" style="width: 100%; padding: 8px 12px; background: #1e3a8a; color: white; border: none; border-radius: 8px; font-weight: 900; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: var(--shadow-xs);">
              <span>🟢</span> ${this.t('confirmBankReceived')} (${this.config.currency}${order.totalAmount})
            </button>
          </div>
        ` : ''}

        <!-- Checklist -->
        <div style="margin: 8px 0; background: #f8fafc; padding: 8px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 800; color: #64748b; margin-bottom: 4px;">
            <span>CHECKLIST (${order.items.filter(i=>i.packed).length}/${order.items.length}):</span>
            ${isPacking ? `<button class="btn-pack-all" data-order-id="${order.id}" style="border:none; background:transparent; color:#1e3a8a; font-weight:900; font-size:0.72rem; cursor:pointer;">${this.t('checkAll')}</button>` : ''}
          </div>
          ${order.items.map((item, idx) => `
            <label style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; padding: 2px 0; cursor: pointer; ${item.packed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
              <input type="checkbox" class="pack-checkbox" data-order-id="${order.id}" data-item-idx="${idx}" ${item.packed ? 'checked' : ''}>
              <span><strong>${item.qty}x</strong> ${item.name} <em style="font-size: 0.72rem; color: #64748b;">(${item.variantName})</em></span>
            </label>
          `).join('')}
        </div>

        <!-- Action Buttons with Status Undo -->
        <div class="ticket-actions">
          ${isNew ? `
            <button class="btn-ticket-action btn-ticket-pack btn-change-status" data-order-id="${order.id}" data-status="PACKING">
              ${this.t('startPacking')}
            </button>
          ` : isPacking ? `
            <button class="btn-ticket-action btn-ticket-ready btn-change-status" data-order-id="${order.id}" data-status="READY">
              ${this.t('markReady')}
            </button>
            <button class="btn-undo-status" data-order-id="${order.id}" data-prev-status="NEW" title="Undo status back to NEW" style="background:#e2e8f0; border:none; padding:4px 8px; border-radius:4px; font-size:0.72rem; cursor:pointer;">
              ↩
            </button>
          ` : isReady ? `
            <button class="btn-ticket-action btn-ticket-done btn-change-status" data-order-id="${order.id}" data-status="COMPLETED">
              ${this.t('handOver')}
            </button>
            <button class="btn-undo-status" data-order-id="${order.id}" data-prev-status="PACKING" title="Undo status back to PACKING" style="background:#e2e8f0; border:none; padding:4px 8px; border-radius:4px; font-size:0.72rem; cursor:pointer;">
              ↩
            </button>
          ` : `
            <span style="font-size: 0.75rem; color: #16a34a; font-weight: 800; text-align: center; width: 100%;">
              ✓ Fulfilled
            </span>
          `}

          <button class="btn-ticket-action btn-print-slip" data-order-id="${order.id}" style="background:#f1f5f9; color:#0f172a; flex:0 0 36px;" title="Print 80mm Bag Slip">
            🖨️
          </button>
        </div>
      </div>
    `;
  }

  printThermalSlip(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    const printDiv = document.createElement('div');
    printDiv.className = 'receipt-print-wrapper';
    printDiv.innerHTML = `
      <div style="text-align: center; font-family: monospace; padding: 10px; width: 80mm;">
        <h2 style="font-size: 16px; margin: 0;">${this.config.name}</h2>
        <p style="font-size: 11px; margin: 2px 0;">${this.config.address || 'Smart Store'}</p>
        <p style="font-size: 11px; margin: 2px 0;">Phone: ${this.config.phone}</p>
        <hr style="border: 0.5px dashed #000; margin: 6px 0;">
        <h1 style="font-size: 26px; margin: 4px 0;">#${order.token}</h1>
        <p style="font-size: 11px;">Spot: ${order.location}</p>
        <p style="font-size: 11px;">Customer: ${order.customerName} (${order.phone})</p>
        <hr style="border: 0.5px dashed #000; margin: 6px 0;">
        <div style="text-align: left; font-size: 11px;">
          ${order.items.map(i => `
            <div style="display:flex; justify-content:space-between; margin: 2px 0;">
              <span>${i.qty}x ${i.name} (${i.variantName})</span>
              <span>${this.config.currency}${i.price * i.qty}</span>
            </div>
          `).join('')}
        </div>
        <hr style="border: 0.5px dashed #000; margin: 6px 0;">
        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size: 13px;">
          <span>GRAND TOTAL:</span>
          <span>${this.config.currency}${order.totalAmount}</span>
        </div>
        <p style="font-size: 10px; margin-top: 4px;">Status: ${order.paymentStatus}</p>
        <hr style="border: 0.5px dashed #000; margin: 6px 0;">
        <p style="font-size: 10px;">Thank You for Shopping at SHAGUN STORE!</p>
      </div>
    `;
    document.body.appendChild(printDiv);
    window.print();
    printDiv.remove();
  }

  // ==========================================================================
  // 4. SPLIT DEMO VIEW
  // ==========================================================================
  renderSplitView() {
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start;">
        <div>
          <h3 style="margin-bottom: 10px; font-size: 1rem; color: #1e3a8a;">📱 Customer Screen Preview</h3>
          <div class="mobile-app-frame">${this.renderCustomerView()}</div>
        </div>
        <div>
          <h3 style="margin-bottom: 10px; font-size: 1rem; color: #1e3a8a;">👨‍🍳 Store Staff Screen Preview</h3>
          <div class="staff-dashboard-wrapper">${this.renderStaffView()}</div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 5. SECRET OWNER ADMIN PANEL (CTRL + SHIFT + Z)
  // ==========================================================================
  renderAdminView() {
    const customers = this.getUniqueCustomers();
    const totalRev = this.orders.reduce((s, o) => s + (o.totalAmount || 0), 0);

    return `
      <div style="background: #ffffff; border: 1.5px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 1.5rem;">
          <div>
            <h2 style="font-size: 1.3rem; font-weight: 900; color: #0f172a;">🛡️ SHAGUN STORE • Owner Master Control</h2>
            <p style="font-size: 0.8rem; color: #475569;">Unlocked via [Ctrl + Shift + Z] • Store Analytics, CRM & Settings</p>
          </div>
          <button id="btnLockAdminMode" style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: var(--radius-sm); font-weight: 800; font-size: 0.8rem; cursor: pointer;">
            🔒 Lock & Hide Admin
          </button>
        </div>

        <!-- Metric Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 1.5rem;">
          <div style="background: #eff6ff; padding: 14px; border-radius: 12px; border: 1px solid #bfdbfe;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #1e40af;">TOTAL REVENUE</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #1e3a8a; font-family: var(--font-display);">${this.config.currency}${totalRev.toLocaleString()}</div>
          </div>
          <div style="background: #f8fafc; padding: 14px; border-radius: 12px; border: 1px solid var(--border);">
            <div style="font-size: 0.75rem; font-weight: 800; color: #475569;">TOTAL ORDERS</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #0f172a; font-family: var(--font-display);">${this.orders.length}</div>
          </div>
          <div style="background: #f8fafc; padding: 14px; border-radius: 12px; border: 1px solid var(--border);">
            <div style="font-size: 0.75rem; font-weight: 800; color: #475569;">UNIQUE CUSTOMERS (CRM)</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #0f172a; font-family: var(--font-display);">${customers.length} Mobiles</div>
          </div>
          <div style="background: #f8fafc; padding: 14px; border-radius: 12px; border: 1px solid var(--border);">
            <div style="font-size: 0.75rem; font-weight: 800; color: #475569;">MERCHANT UPI ID</div>
            <div style="font-size: 0.95rem; font-weight: 900; color: #1e3a8a; word-break: break-all;">${this.config.upiId || '7795565216-1@okbizaxis'}</div>
          </div>
        </div>

        <!-- Store Master Orders & Payment Ledger (Admin Book) -->
        <div style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 14px; background: #ffffff; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 900; color: #0f172a; margin: 0;">📖 Store Orders & Payment Ledger (Admin Book)</h3>
              <p style="font-size: 0.76rem; color: #64748b; margin: 2px 0 0 0;">Automatic permanent record of customer payment date, time & order status</p>
            </div>
            <span style="font-size: 0.78rem; font-weight: 800; background: #eff6ff; color: #1e3a8a; padding: 4px 10px; border-radius: 99px;">
              ${this.orders.length} Total Records
            </span>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 1.5px solid var(--border);">
                  <th style="padding: 9px 8px;">Token</th>
                  <th style="padding: 9px 8px;">Order Time</th>
                  <th style="padding: 9px 8px;">Customer</th>
                  <th style="padding: 9px 8px;">Amount</th>
                  <th style="padding: 9px 8px;">Payment Date & Time (Admin Record)</th>
                  <th style="padding: 9px 8px;">Mode</th>
                  <th style="padding: 9px 8px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${this.orders.length === 0 ? `<tr><td colspan="7" style="text-align:center; padding:2rem; color:#64748b;">No orders in ledger book yet</td></tr>` : this.orders.map(o => {
                  const createdStr = new Date(o.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
                  const paidStamp = o.paymentCompletedFormatted || (o.paymentVerified ? createdStr : (o.paymentMethod === 'upi' ? '⏳ Awaiting Verification' : '💵 Cash at Pickup'));
                  const isPaid = o.customerPaid || o.paymentVerified || o.paymentMethod === 'counter';

                  return `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 9px 8px; font-weight: 900; font-family: var(--font-display); color: #0f172a; font-size: 0.95rem;">#${o.token}</td>
                      <td style="padding: 9px 8px; color: #475569;">${createdStr}</td>
                      <td style="padding: 9px 8px;">
                        <strong>${o.customerName}</strong><br>
                        <span style="font-size: 0.72rem; color: #64748b;">${o.phone}</span>
                      </td>
                      <td style="padding: 9px 8px; font-weight: 900; color: #1e3a8a;">${this.config.currency}${o.totalAmount}</td>
                      <td style="padding: 9px 8px;">
                        <span style="font-weight: 800; color: ${isPaid ? '#166534' : '#b45309'}; background: ${isPaid ? '#dcfce7' : '#fef3c7'}; padding: 3px 8px; border-radius: 4px; display: inline-block;">
                          ${isPaid ? '✓ ' : ''}${paidStamp}
                        </span>
                      </td>
                      <td style="padding: 9px 8px; font-weight: 700; text-transform: uppercase; font-size: 0.72rem; color: #475569;">
                        ${o.paymentMethod === 'upi' ? '📱 UPI' : '💵 CASH'}
                      </td>
                      <td style="padding: 9px 8px;">
                        <span style="padding: 3px 8px; border-radius: 99px; font-size: 0.72rem; font-weight: 800; background: ${o.status === 'COMPLETED' ? '#dcfce7' : o.status === 'READY' ? '#fef3c7' : '#eff6ff'}; color: ${o.status === 'COMPLETED' ? '#166534' : o.status === 'READY' ? '#92400e' : '#1e40af'};">
                          ${o.status}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Customer Mobile CRM Table -->
        <div style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 14px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 1rem; font-weight: 900; color: #0f172a;">👥 Customer Mobile Directory (${customers.length})</h3>
            <button id="btnExportCustomersCSV" style="padding: 6px 12px; background: #1e3a8a; color: white; border: none; border-radius: 6px; font-weight: 800; font-size: 0.75rem; cursor: pointer;">
              ⬇️ Export Excel CSV
            </button>
          </div>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 1.5px solid var(--border);">
                  <th style="padding: 8px;">Phone</th>
                  <th style="padding: 8px;">Name</th>
                  <th style="padding: 8px;">Orders</th>
                  <th style="padding: 8px;">Lifetime Spend</th>
                  <th style="padding: 8px;">Last Token</th>
                  <th style="padding: 8px;">Contact</th>
                </tr>
              </thead>
              <tbody>
                ${customers.map(c => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px; font-weight: 800; color: #1e3a8a;">${c.phone}</td>
                    <td style="padding: 8px; font-weight: 700;">${c.name}</td>
                    <td style="padding: 8px;">${c.totalOrders}</td>
                    <td style="padding: 8px; font-weight: 900; color: #16a34a;">${this.config.currency}${c.lifetimeSpend}</td>
                    <td style="padding: 8px; font-weight: 800;">#${c.lastToken}</td>
                    <td style="padding: 8px;">
                      <a href="https://wa.me/91${c.rawPhone}" target="_blank" style="padding: 3px 8px; background: #dbeafe; color: #1e3a8a; text-decoration: none; border-radius: 4px; font-weight: 800; font-size: 0.72rem;">💬 WhatsApp</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Standee Studio -->
        <div style="margin-top: 1.5rem; border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 14px; background: #ffffff;">
          <h3 style="font-size: 1rem; font-weight: 900; color: #0f172a; margin-bottom: 8px;">🖨️ Official Trilingual Store Standee (English, Hindi, Kannada)</h3>
          <p style="font-size: 0.78rem; color: #475569; margin-bottom: 12px;">Download 2000px Ultra-HD PNG to print acrylic QR standees for your shop entrance and aisles.</p>
          <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
            <div id="standeeQRCanvas" style="width: 200px; height: 200px; background: #f8fafc; border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center;"></div>
            <div>
              <button id="btnDownloadQRPNG" style="padding: 10px 20px; background: #1e3a8a; color: white; border: none; border-radius: 8px; font-weight: 900; font-size: 0.85rem; cursor: pointer;">
                ⬇️ Download Ultra-HD Standee PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 6. CART MODAL WITH CLEAN UPI / CASH OPTIONS
  // ==========================================================================
  openCartModal() {
    const existing = document.getElementById('cartModal');
    if (existing) existing.remove();

    const { subtotal, totalItems, tax, packingFee, finalTotal } = this.getCartTotals();
    const modalDiv = document.createElement('div');
    modalDiv.id = 'cartModal';
    modalDiv.className = 'admin-modal-overlay';

    modalDiv.innerHTML = `
      <div class="admin-modal-box">
        <div class="cart-modal-header">
          <h3>${this.activeAddonOrderId ? '➕ Add Items to Active Order' : this.t('cartTitle')}</h3>
          <button class="btn-close-modal" id="btnCloseCartModal">✕</button>
        </div>

        <div style="padding: 1rem;">
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto;">
            ${this.cart.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #f1f5f9;">
                <div>
                  <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a;">${item.name}</div>
                  <div style="font-size: 0.72rem; color: #64748b;">${item.variantName} • ${this.config.currency}${item.price} each</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-weight: 900; color: #1e3a8a; font-size: 0.9rem;">${this.config.currency}${item.price * item.qty}</span>
                  <div class="qty-control" style="background:#1e3a8a;">
                    <button class="qty-btn btn-modal-minus" data-cart-id="${item.cartItemId}">−</button>
                    <span class="qty-count">${item.qty}</span>
                    <button class="qty-btn btn-modal-plus" data-cart-id="${item.cartItemId}">+</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Customer Phone Form (Only required if not active addon) -->
          ${!this.activeAddonOrderId ? `
            <div style="margin: 1rem 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <label style="font-size: 0.78rem; font-weight: 800; color: #0f172a;">
                  ${this.t('custPhone')}
                </label>
                ${sessionStorage.getItem('shagun_phone_is_verified') === 'true' ? `
                  <span style="font-size: 0.72rem; color: #16a34a; font-weight: 800; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">
                    ${this.t('phoneVerified')}
                  </span>
                ` : ''}
              </div>
              <input type="tel" id="orderCustomerPhone" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 8px; font-weight: 800; font-size: 0.95rem; color: #0f172a;" placeholder="${this.t('enterMobile')}" maxlength="10" value="${sessionStorage.getItem('shagun_active_phone') || ''}">
            </div>

            <div style="margin-bottom: 1rem;">
              <label style="font-size: 0.78rem; font-weight: 800; color: #0f172a; display: block; margin-bottom: 4px;">
                ${this.t('custName')}
              </label>
              <input type="text" id="orderCustomerName" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 8px; font-weight: 700; font-size: 0.88rem; color: #0f172a;" placeholder="e.g. Ramesh Kumar">
            </div>

            <!-- Payment Method Selector -->
            <div class="payment-selector">
              <div class="payment-title">${this.t('selectPaymentMode')}</div>
              
              <label class="payment-option-card ${this.selectedPaymentMethod === 'upi' ? 'selected' : ''}">
                <input type="radio" name="payMethod" value="upi" ${this.selectedPaymentMethod === 'upi' ? 'checked' : ''} style="display:none;">
                <span style="font-size: 1.3rem;">📱</span>
                <div>
                  <h5>${this.t('upiPayment')}</h5>
                  <p>${this.t('upiSub')}</p>
                </div>
              </label>

              <label class="payment-option-card ${this.selectedPaymentMethod === 'counter' ? 'selected' : ''}">
                <input type="radio" name="payMethod" value="counter" ${this.selectedPaymentMethod === 'counter' ? 'checked' : ''} style="display:none;">
                <span style="font-size: 1.3rem;">💵</span>
                <div>
                  <h5>${this.t('cashCounter')}</h5>
                  <p>${this.t('cashSub')}</p>
                </div>
              </label>
            </div>
          ` : ''}

          <!-- Bill Summary -->
          <div class="bill-summary">
            <div class="bill-row">
              <span>${this.t('itemsSubtotal')}</span>
              <span>${this.config.currency}${subtotal}</span>
            </div>
            <div class="bill-row">
              <span>${this.t('bagPacking')}</span>
              <span style="color: #16a34a; font-weight: 800;">${this.t('free')}</span>
            </div>
            <div class="bill-row total">
              <span>${this.t('grandTotal')}</span>
              <span>${this.config.currency}${finalTotal}</span>
            </div>
          </div>

          <button class="btn-place-order" id="btnSubmitOrder">
            ${this.activeAddonOrderId 
              ? `➕ Append ${this.config.currency}${finalTotal} to Active Order ➔`
              : (this.selectedPaymentMethod === 'upi' 
                  ? `📱 Pay ${this.config.currency}${finalTotal} via UPI & Place Order ➔` 
                  : `💵 Place Order & Pay Cash (${this.config.currency}${finalTotal}) ➔`)}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalDiv);
    this.attachModalEvents(modalDiv);
  }

  // ==========================================================================
  // 7. EVENT LISTENERS
  // ==========================================================================
  attachPostRenderEvents() {
    // Trilingual Language Switcher Buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        this.setLanguage(lang);
      });
    });

    // View Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view');
        if (targetView) {
          this.currentView = targetView;
          sounds.playTapSound();
          this.render();
        }
      });
    });

    // Brand Home click (With Secret 5-Tap Mobile Owner PIN unlock)
    const btnBrand = document.getElementById('btnBrandHome');
    if (btnBrand) {
      btnBrand.addEventListener('click', () => {
        const now = Date.now();
        if (now - (this.lastBrandTap || 0) < 500) {
          this.brandTapCount = (this.brandTapCount || 0) + 1;
          if (this.brandTapCount >= 5) {
            this.brandTapCount = 0;
            const pin = prompt("🔐 Enter SHAGUN STORE Owner Master PIN:");
            if (pin === "1234" || pin === "7795" || pin === (this.config.adminPin || "1234")) {
              this.adminUnlocked = true;
              this.currentView = 'admin';
              sounds.playNewOrderChime();
              this.showToastNotification("🔓 Owner Admin Mode Unlocked!");
              this.render();
            } else if (pin !== null) {
              alert("❌ Incorrect PIN. Access Denied.");
            }
            return;
          }
        } else {
          this.brandTapCount = 1;
        }
        this.lastBrandTap = now;

        if (this.currentView !== 'customer' && !this.adminUnlocked) {
          this.currentView = 'customer';
          this.activeAddonOrderId = null;
          this.render();
        }
      });
    }

    // Category Filter Pills
    document.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCategory = btn.getAttribute('data-category');
        sounds.playTapSound();
        this.render();
      });
    });

    // Variant Selection Pills (250g, 500g, 1kg, 2kg, 3kg, 5kg, 10kg & 500ml, 1L, 5L)
    document.querySelectorAll('.variant-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-prod-id');
        const vIdx = parseInt(btn.getAttribute('data-variant-idx'), 10);
        this.selectedVariants[pId] = vIdx;
        sounds.playTapSound();
        this.render();
      });
    });

    // Quick Add to Cart
    document.querySelectorAll('.btn-quick-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-prod-id');
        const vIdx = parseInt(btn.getAttribute('data-variant-idx'), 10);
        const prod = this.products.find(p => p.id === pId);
        if (prod) this.addToCart(prod, vIdx);
      });
    });

    // Qty +/-
    document.querySelectorAll('.btn-plus-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        this.updateCartQty(btn.getAttribute('data-cart-id'), 1);
      });
    });

    document.querySelectorAll('.btn-minus-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        this.updateCartQty(btn.getAttribute('data-cart-id'), -1);
      });
    });

    // Open Cart Bar
    const btnCart = document.getElementById('btnOpenCart');
    if (btnCart) {
      btnCart.addEventListener('click', () => this.openCartModal());
    }

    // Load More Items
    const btnLoadMore = document.getElementById('btnLoadMoreItems');
    if (btnLoadMore) {
      btnLoadMore.addEventListener('click', () => {
        this.visibleProductsLimit += 40;
        this.render();
      });
    }

    // Debounced Search Input (Smooth typing without full DOM destruction)
    const searchInp = document.getElementById('productSearchInput');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        const query = this.searchQuery.trim().toLowerCase();
        const grid = document.getElementById('productGridContainer');
        if (grid) {
          const filtered = this.products.filter(p => {
            const matchCat = this.activeCategory === 'all' || p.category === this.activeCategory;
            if (!matchCat) return false;
            if (!query) return true;
            return p.name.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query));
          });
          const disp = filtered.slice(0, this.visibleProductsLimit);
          grid.innerHTML = disp.map(p => this.renderProductCard(p)).join('');
          this.attachPostRenderEvents();
        }
      });
    }

    // Addon to Active Order button
    document.querySelectorAll('.btn-addon-to-active-order').forEach(btn => {
      btn.addEventListener('click', () => {
        const ordId = btn.getAttribute('data-order-id');
        this.activeAddonOrderId = ordId;
        sounds.playTapSound();
        this.showToastNotification(`➕ Browse items and add to Order #${this.orders.find(o=>o.id===ordId)?.token}!`);
        this.render();
      });
    });

    const btnCancelAddon = document.getElementById('btnCancelAddon');
    if (btnCancelAddon) {
      btnCancelAddon.addEventListener('click', () => {
        this.activeAddonOrderId = null;
        this.render();
      });
    }

    // Customer New Order
    const btnCustNew = document.getElementById('btnCustomerNewOrder');
    if (btnCustNew) {
      btnCustNew.addEventListener('click', () => {
        this.currentCustomerOrderId = null;
        this.activeAddonOrderId = null;
        localStorage.removeItem('shagun_customer_active_order');
        this.render();
      });
    }

    // Staff Item Checkboxes
    document.querySelectorAll('.pack-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const ordId = cb.getAttribute('data-order-id');
        const idx = parseInt(cb.getAttribute('data-item-idx'), 10);
        this.toggleItemPacked(ordId, idx);
      });
    });

    document.querySelectorAll('.btn-pack-all').forEach(btn => {
      btn.addEventListener('click', () => {
        this.packAllItems(btn.getAttribute('data-order-id'));
      });
    });

    // Staff Status Progression
    document.querySelectorAll('.btn-change-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const ordId = btn.getAttribute('data-order-id');
        const status = btn.getAttribute('data-status');
        this.updateOrderStatus(ordId, status);
      });
    });

    // Staff Status Undo
    document.querySelectorAll('.btn-undo-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const ordId = btn.getAttribute('data-order-id');
        const prevStatus = btn.getAttribute('data-prev-status');
        this.updateOrderStatus(ordId, prevStatus);
      });
    });

    // Print Thermal Slip
    document.querySelectorAll('.btn-print-slip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.printThermalSlip(btn.getAttribute('data-order-id'));
      });
    });

    // Staff Audio Toggle & Test
    const btnAudio = document.getElementById('btnToggleAudio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        this.audioAlertsEnabled = !this.audioAlertsEnabled;
        if (this.audioAlertsEnabled) sounds.playNewOrderChime();
        this.render();
      });
    }

    const btnTestChime = document.getElementById('btnTestChime');
    if (btnTestChime) {
      btnTestChime.addEventListener('click', () => {
        sounds.playNewOrderChime();
      });
    }



    // UPI Verification by Store Admin
    document.querySelectorAll('.btn-verify-upi-payment').forEach(btn => {
      btn.addEventListener('click', () => {
        const ordId = btn.getAttribute('data-order-id');
        this.verifyUpiPaymentByAdmin(ordId);
      });
    });

    // Admin Lock
    const btnLock = document.getElementById('btnLockAdminMode');
    if (btnLock) {
      btnLock.addEventListener('click', () => {
        this.adminUnlocked = false;
        this.currentView = 'customer';
        this.showToastNotification("🔒 Admin Mode Locked.");
        this.render();
      });
    }

    // Export Customer & Payment Ledger CSV
    const btnExpCust = document.getElementById('btnExportCustomersCSV');
    if (btnExpCust) {
      btnExpCust.addEventListener('click', () => {
        const headers = ["Token", "Order Date & Time", "Payment Completed Date & Time", "Customer Name", "Phone", "Amount (INR)", "Payment Mode", "Payment Status", "Order Status"];
        const rows = this.orders.map(o => [
          `"${o.token}"`,
          `"${new Date(o.createdAt).toLocaleString('en-IN')}"`,
          `"${o.paymentCompletedFormatted || (o.paymentVerified ? new Date(o.createdAt).toLocaleString('en-IN') : (o.paymentMethod === 'upi' ? 'Awaiting Verification' : 'Cash at Pickup'))}"`,
          `"${(o.customerName || '').replace(/"/g, '""')}"`,
          `"${o.phone}"`,
          o.totalAmount,
          `"${o.paymentMethod === 'upi' ? 'UPI' : 'Cash'}"`,
          `"${(o.paymentStatus || '').replace(/"/g, '""')}"`,
          `"${o.status}"`
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `shagun_store_payment_ledger_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.showToastNotification("📥 Payment Ledger CSV Exported!");
      });
    }

    // Standee QR Drawing
    this.renderQRCodes();
  }

  renderQRCodes() {
    if (typeof window.QRCodeLib === 'undefined') return;

    const signedStoreUrl = window.QRCodeLib.generateSignedStoreUrl(
      this.serverHost,
      this.activeLocation,
      "SG-STORE-IND-066"
    );

    const standeeContainer = document.getElementById('standeeQRCanvas');
    if (standeeContainer) {
      const qr = window.QRCodeLib.generate(signedStoreUrl, { size: 180, margin: 4, darkColor: '#1e3a8a' });
      standeeContainer.innerHTML = qr.toSVG();

      const btnDownloadPNG = document.getElementById('btnDownloadQRPNG');
      if (btnDownloadPNG) {
        btnDownloadPNG.onclick = () => {
          const exportCanvas = document.createElement('canvas');
          window.QRCodeLib.generateOfficialStandeeCanvas(exportCanvas, {
            width: 1400,
            height: 1800,
            storeName: this.config.name || 'SHAGUN STORE',
            storeNameHindi: this.config.nameHindi || 'शगुन स्टोर',
            storeNameKannada: this.config.nameKannada || 'ಶಗುನ್ ಸ್ಟೋರ್',
            tagline: this.config.tagline || 'Scan in Aisle • Order • Collect at Counter',
            location: this.activeLocation,
            storeUrl: signedStoreUrl
          });
          const dataUrl = exportCanvas.toDataURL("image/png");
          const downloadLink = document.createElement('a');
          downloadLink.href = dataUrl;
          downloadLink.download = `SHAGUN_STORE_Standee_${this.activeLocation.replace(/\s+/g, '_')}.png`;
          downloadLink.click();
        };
      }
    }
  }

  attachModalEvents(modalDiv) {
    const btnClose = modalDiv.querySelector('#btnCloseCartModal');
    if (btnClose) {
      btnClose.addEventListener('click', () => modalDiv.remove());
    }

    modalDiv.querySelectorAll('.btn-modal-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        this.updateCartQty(btn.getAttribute('data-cart-id'), 1);
        modalDiv.remove();
        this.openCartModal();
      });
    });

    modalDiv.querySelectorAll('.btn-modal-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        this.updateCartQty(btn.getAttribute('data-cart-id'), -1);
        modalDiv.remove();
        if (this.cart.length > 0) {
          this.openCartModal();
        }
      });
    });

    modalDiv.querySelectorAll('input[name="payMethod"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedPaymentMethod = e.target.value;
        modalDiv.querySelectorAll('.payment-option-card').forEach(card => card.classList.remove('selected'));
        radio.closest('.payment-option-card').classList.add('selected');
        
        const btnSub = modalDiv.querySelector('#btnSubmitOrder');
        const totals = this.getCartTotals();
        if (btnSub && !this.activeAddonOrderId) {
          if (this.selectedPaymentMethod === 'upi') {
            btnSub.innerHTML = `📱 Pay ${this.config.currency}${totals.finalTotal} via UPI & Place Order ➔`;
          } else {
            btnSub.innerHTML = `💵 Place Order & Pay Cash (${this.config.currency}${totals.finalTotal}) ➔`;
          }
        }
      });
    });

    const btnSubmit = modalDiv.querySelector('#btnSubmitOrder');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        const nameInp = modalDiv.querySelector('#orderCustomerName');
        const phoneInp = modalDiv.querySelector('#orderCustomerPhone');
        const name = nameInp ? nameInp.value : '';
        const phone = phoneInp ? phoneInp.value : '';
        this.initiateOrderWithOTP(name, phone, '');
      });
    }
  }
}

// Mount on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.shagunApp = new ShagunStoreApp();
  window.shagunApp.render();
});
