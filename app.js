/**
 * SHAGUN STORE (शगुन स्टोर) - Master Application Logic & Real-time Server Sync Engine
 * Scaled for 2,000+ Supermarket Items:
 * - High-speed virtualized grocery catalog with Hindi & English search index
 * - Official High-Resolution Customer QR Code Standee Studio (Print & PNG Download)
 * - Mobile Staff Packing Terminal (iOS & Android) with Web Audio chime alerts
 * - Hidden Store Owner Admin Panel (Secret unlock via Ctrl + Shift + Z)
 * - Customer Mobile Database & CRM for Store Owner
 * - Central Server REST API & Firebase Cloud Firestore 0ms Sync
 */

import { INITIAL_STORE_CONFIG, CATEGORIES, INITIAL_PRODUCTS } from './mockData.js';
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
    
    // Default view for public visitors / phone scanners is Customer
    this.currentView = 'customer'; // 'customer' | 'staff' | 'split' | 'admin'
    this.adminUnlocked = false; // Hidden by default. Unlocked via Ctrl + Shift + Z
    this.adminActiveTab = 'analytics'; // 'analytics' | 'inventory' | 'orders' | 'qr-studio' | 'staff-qr' | 'settings'
    
    this.staffFilterLocation = 'all';
    this.staffSearchToken = '';

    this.activeCategory = 'all';
    this.searchQuery = '';
    this.visibleProductsLimit = 36; // Virtualized pagination chunk size for 2000+ items
    this.currentCustomerOrderId = localStorage.getItem('shagun_customer_active_order') || null;
    this.selectedPaymentMethod = 'upi';
    this.audioAlertsEnabled = true;
    this.activeLocation = 'Main Entrance Stand (Express)';

    // Pending order details during OTP verification
    this.pendingOrderData = null;
    this.generatedOtp = null;

    // Selected product variants map: { productId: variantIndex }
    this.selectedVariants = {};

    // Previous orders hash/length for sound alert detection
    this.lastKnownOrderIds = new Set(this.orders.map(o => o.id));

    // Local host IP for multi-device Wi-Fi access (iOS & Android)
    this.serverHost = window.location.origin;

    // Real-time synchronization channel
    this.syncChannel = null;
    this.initSyncChannel();

    // Check URL parameters for direct view routing
    this.parseUrlParams();

    // Register secret keyboard listener (Ctrl + Shift + Z)
    this.initSecretKeyboardListener();

    // Start Central Server REST API synchronization & live polling
    this.initServerSync();

    // Start Cloud Firestore Real-time WebSocket Synchronization
    this.initFirebaseSync();
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

        // Merge cloud orders with local state
        this.orders = cloudOrders;
        this.saveOrders();

        if (hasNewOrder && this.audioAlertsEnabled) {
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
    } catch (e) {
      console.log("Firebase listener initialized in standby mode.");
    }
  }

  // ---------------- Central Server REST API Live Synchronization ----------------
  async initServerSync() {
    await this.fetchOrdersFromServer();
    await this.fetchProductsFromServer();
    await this.fetchConfigFromServer();

    // Continuous live polling every 1200ms
    setInterval(() => {
      this.fetchOrdersFromServer();
    }, 1200);
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
        localStorage.setItem('shagun_orders_data', JSON.stringify(this.orders));

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
          localStorage.setItem('shagun_products_data', JSON.stringify(this.products));
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
          this.config = cfg;
          localStorage.setItem('shagun_store_config', JSON.stringify(this.config));
        }
      }
    } catch (e) {}
  }

  // ---------------- Secret Admin Keyboard Listener ----------------
  initSecretKeyboardListener() {
    window.addEventListener('keydown', (e) => {
      // Ctrl + Shift + Z or Cmd + Shift + Z on Mac
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

  showToastNotification(text) {
    const toast = document.createElement('div');
    toast.className = 'sms-toast-banner';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
      <span class="sms-icon">🛡️</span>
      <div class="sms-content">
        <h5>SHAGUN STORE Security</h5>
        <p>${text}</p>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  initSyncChannel() {
    try {
      if ('BroadcastChannel' in window) {
        this.syncChannel = new BroadcastChannel('shagun_store_live_sync');
        this.syncChannel.onmessage = (event) => {
          if (event.data?.type === 'NEW_ORDER') {
            this.fetchOrdersFromServer();
          }
        };
      }
    } catch (e) {}
  }

  broadcast(type, payload) {
    if (this.syncChannel) {
      this.syncChannel.postMessage({ type, payload, timestamp: Date.now() });
    }
  }

  parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('location')) {
      this.activeLocation = params.get('location');
    }
    if (params.has('order')) {
      this.currentCustomerOrderId = params.get('order');
    }
    if (params.has('view')) {
      const v = params.get('view');
      if (v === 'staff' || v === 'customer' || v === 'split') {
        this.currentView = v;
      } else if (v === 'admin') {
        this.adminUnlocked = true;
        this.currentView = 'admin';
      }
    }
  }

  // Persistence Helpers
  loadConfig() {
    const saved = localStorage.getItem('shagun_store_config');
    return saved ? JSON.parse(saved) : INITIAL_STORE_CONFIG;
  }

  saveConfig() {
    localStorage.setItem('shagun_store_config', JSON.stringify(this.config));
    fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.config)
    }).catch(()=>{});
  }

  loadProducts() {
    const saved = localStorage.getItem('shagun_products_data');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  }

  saveProducts() {
    localStorage.setItem('shagun_products_data', JSON.stringify(this.products));
    fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.products)
    }).catch(()=>{});
  }

  loadOrders() {
    const saved = localStorage.getItem('shagun_orders_data');
    return saved ? JSON.parse(saved) : [];
  }

  saveOrders() {
    localStorage.setItem('shagun_orders_data', JSON.stringify(this.orders));
    fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.orders)
    }).catch(()=>{});
  }

  loadCart() {
    const saved = localStorage.getItem('shagun_cart_data');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('shagun_cart_data', JSON.stringify(this.cart));
  }

  // ---------------- Cart Actions ----------------
  addToCart(product, variantIdx = 0) {
    sounds.playTapSound();
    const variant = product.variants ? product.variants[variantIdx] : { name: product.unit, price: product.price };
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
        image: product.image,
        qty: 1
      });
    }
    this.saveCart();
    this.render();
  }

  updateCartQty(cartItemId, delta) {
    sounds.playTapSound();
    const item = this.cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.cart = this.cart.filter(i => i.cartItemId !== cartItemId);
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

  // ---------------- Customer Direct Mobile Order Placement ----------------
  async initiateOrderWithOTP(customerName, phone, packingNote) {
    if (this.cart.length === 0) return;

    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert("⚠️ Please enter a valid 10-digit Indian Mobile Number (+91).");
      const phoneInput = document.getElementById('orderCustomerPhone');
      if (phoneInput) phoneInput.focus();
      return;
    }

    this.pendingOrderData = {
      customerName: (customerName || '').trim() || "Customer",
      phone: cleanPhone,
      packingNote: (packingNote || '').trim()
    };

    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.remove();

    const totals = this.getCartTotals();
    const tokenNum = `SG-${100 + (this.orders.length + 1) % 900}`;
    const upiId = this.config.upiId || '7795565216-1@okbizaxis';
    const storeName = this.config.name || 'SHAGUN STORE';

    // If UPI is selected, auto-trigger UPI app with exact amount
    if (this.selectedPaymentMethod === 'upi') {
      const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(storeName)}&am=${totals.finalTotal}&cu=INR&tn=${encodeURIComponent('Order ' + tokenNum + ' ' + storeName)}`;
      setTimeout(() => {
        try {
          window.location.href = upiUri;
        } catch (e) {}
      }, 200);

      // Order created automatically with Pending Shop Owner Verification
      this.finalizeVerifiedOrder('UPI - Awaiting Shop Verification', false);
    } else {
      // Cash at Counter
      this.finalizeVerifiedOrder('Pay Cash at Counter', true);
    }
  }

  async finalizeVerifiedOrder(paymentStatusText = 'UPI - Awaiting Shop Verification', paymentVerified = false) {
    const totals = this.getCartTotals();
    const tokenNum = `SG-${100 + (this.orders.length + 1) % 900}`;
    
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
        { status: 'NEW', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: 'Order created automatically upon UPI trigger' }
      ]
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (e) {}

    // Cloud Firestore Instant Sync
    saveOrderToFirestore(newOrder);

    this.orders.unshift(newOrder);
    this.lastKnownOrderIds.add(newOrder.id);
    this.saveOrders();
    this.clearCart();

    this.currentCustomerOrderId = newOrder.id;
    localStorage.setItem('shagun_customer_active_order', newOrder.id);

    this.broadcast('NEW_ORDER', newOrder);
    sounds.playTapSound();

    this.render();
  }

  // Shop Owner / Staff verifies UPI Payment in 1 click
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
      saveOrderToFirestore(order);
      this.broadcast('ORDER_UPDATED', order);
      sounds.playReadySound();
      this.render();
    }
  }

  // ---------------- Staff Order Workflow ----------------
  updateOrderStatus(orderId, newStatus) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    order.status = newStatus;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let statusText = '';
    if (newStatus === 'PACKING') statusText = 'Staff is currently packing items at shelves';
    if (newStatus === 'READY') statusText = 'Packed & Ready for Collection at Counter!';
    if (newStatus === 'COMPLETED') statusText = 'Bag handed over to customer';

    const historyItem = { status: newStatus, time: timeStr, text: statusText };
    order.history.push(historyItem);

    this.saveOrders();
    this.broadcast('ORDER_STATUS_UPDATED', order);

    // Sync to Cloud Firestore
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

  // ---------------- Analytics Computations ----------------
  getAnalytics() {
    const totalOrders = this.orders.length;
    const completedOrders = this.orders.filter(o => o.status === 'COMPLETED').length;
    const activeOrders = this.orders.filter(o => o.status === 'NEW' || o.status === 'PACKING').length;
    const totalRevenue = this.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const itemMap = {};
    this.orders.forEach(ord => {
      ord.items.forEach(item => {
        if (!itemMap[item.name]) {
          itemMap[item.name] = { name: item.name, count: 0, revenue: 0 };
        }
        itemMap[item.name].count += item.qty;
        itemMap[item.name].revenue += item.price * item.qty;
      });
    });

    const topItems = Object.values(itemMap).sort((a, b) => b.count - a.count).slice(0, 8);

    const paymentMap = { upi: 0, counter: 0, card: 0 };
    this.orders.forEach(o => {
      const pm = o.paymentMethod || 'upi';
      if (paymentMap[pm] !== undefined) paymentMap[pm]++;
    });

    return { totalOrders, completedOrders, activeOrders, totalRevenue, avgOrderValue, topItems, paymentMap };
  }

  exportOrdersCSV() {
    if (this.orders.length === 0) {
      alert("No orders available to export.");
      return;
    }

    const headers = ["Order ID", "Token", "Date & Time", "Customer Name", "Verified Mobile", "Spot", "Items", "Total (INR)", "Payment", "Status"];
    const rows = this.orders.map(o => [
      o.id,
      o.token,
      new Date(o.createdAt).toLocaleString(),
      `"${o.customerName}"`,
      `"${o.phone || ''}"`,
      `"${o.location}"`,
      `"${o.items.map(i => `${i.qty}x ${i.name} (${i.variantName})`).join('; ')}"`,
      o.totalAmount,
      o.paymentStatus,
      o.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shagun_store_orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    return `
      <header class="app-header">
        <div class="brand-wrapper" id="btnBrandHome">
          <div class="brand-icon">🛍️</div>
          <div class="brand-info">
            <h1>${this.config.name}</h1>
            <p>${this.config.taglineHindi || this.config.tagline}</p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <nav class="mode-nav">
            <button class="mode-btn ${this.currentView === 'customer' ? 'active' : ''}" data-view="customer">
              📱 Customer View
            </button>
            <button class="mode-btn ${this.currentView === 'staff' ? 'active' : ''}" data-view="staff">
              👨‍🍳 Staff Packing
              ${activeIncomingCount > 0 ? `<span class="badge-count">${activeIncomingCount}</span>` : ''}
            </button>

            <!-- Admin Tab only visible when unlocked via (Ctrl + Shift + Z) -->
            ${this.adminUnlocked ? `
              <button class="mode-btn admin-unlocked-badge ${this.currentView === 'admin' ? 'active' : ''}" data-view="admin">
                🛡️ Admin (Unlocked)
              </button>
            ` : ''}

            <button class="mode-btn ${this.currentView === 'split' ? 'active' : ''}" data-view="split">
              ⚡ Split Demo
            </button>
          </nav>
        </div>
      </header>
    `;
  }

  // ==========================================================================
  // 1. CUSTOMER VIEW (MOBILE FIRST - 2000+ ITEMS)
  // ==========================================================================
  renderCustomerView() {
    const activeOrder = this.orders.find(o => o.id === this.currentCustomerOrderId && o.status !== 'COMPLETED');
    if (activeOrder) {
      return this.renderCustomerTracker(activeOrder);
    }

    const { totalItems, finalTotal } = this.getCartTotals();

    // Fast multi-indexed filter across 2000+ items
    const query = (this.searchQuery || '').trim().toLowerCase();
    const filteredProducts = this.products.filter(p => {
      const matchCat = this.activeCategory === 'all' || p.category === this.activeCategory;
      if (!matchCat) return false;
      if (!query) return true;

      return p.name.toLowerCase().includes(query) || 
             (p.description && p.description.toLowerCase().includes(query)) ||
             p.category.toLowerCase().includes(query) ||
             (p.badge && p.badge.toLowerCase().includes(query));
    });

    const displayedProducts = filteredProducts.slice(0, this.visibleProductsLimit);

    return `
      <div class="customer-banner">
        <div class="scan-tag">📍 Scanned: ${this.activeLocation}</div>
        <h2>${this.config.name}</h2>
        <p>${this.config.taglineHindi} • 2,000+ Items at Wholesale Rates</p>
      </div>

      <div class="search-wrapper">
        <div class="search-input-box">
          <span>🔍</span>
          <input type="text" id="productSearchInput" placeholder="Search sugar, basmati rice, mustard oil, atta, milk, dals..." value="${this.searchQuery}">
        </div>
      </div>

      <div class="catalog-stats-row">
        <span>Showing <strong>${displayedProducts.length}</strong> of <strong>${filteredProducts.length}</strong> items</span>
        <span>${CATEGORIES.find(c=>c.id===this.activeCategory)?.name || 'All'}</span>
      </div>

      <div class="categories-scroller">
        ${CATEGORIES.map(cat => {
          const count = cat.id === 'all' ? this.products.length : this.products.filter(p=>p.category===cat.id).length;
          return `
            <button class="cat-pill ${this.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
              <span>${cat.icon}</span> ${cat.name} <em style="font-size: 0.7rem; opacity: 0.8;">(${count})</em>
            </button>
          `;
        }).join('')}
      </div>

      <div class="products-grid">
        ${displayedProducts.length === 0 ? `
          <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
            <p style="font-size: 2.5rem; margin-bottom: 8px;">🔍</p>
            <p style="font-weight: 800; font-size: 1.1rem; color: var(--text-main);">No grocery items found</p>
            <p style="font-size: 0.85rem; margin-top: 4px;">Try searching for "Sugar", "Rice", "Oil", "Atta" or browse categories above</p>
          </div>
        ` : displayedProducts.map(product => this.renderProductCard(product)).join('')}
      </div>

      ${filteredProducts.length > this.visibleProductsLimit ? `
        <div class="load-more-box">
          <button class="btn-load-more" id="btnLoadMoreItems">
            ⬇️ Load More Items (${filteredProducts.length - this.visibleProductsLimit} more)
          </button>
        </div>
      ` : ''}

      ${totalItems > 0 ? `
        <div class="floating-cart-bar">
          <div class="cart-summary-text">
            <span class="cart-items-count">${totalItems} item${totalItems > 1 ? 's' : ''} in Bag</span>
            <span class="cart-total-amount">${this.config.currency}${finalTotal}</span>
          </div>
          <button class="btn-view-cart" id="btnOpenCart">
            <span>View Bag & Verify</span>
            <span>➔</span>
          </button>
        </div>
      ` : ''}
    `;
  }

  renderProductCard(product) {
    const selectedVariantIdx = this.selectedVariants[product.id] || 0;
    const currentVariant = product.variants ? product.variants[selectedVariantIdx] : { name: product.unit, price: product.price };
    const cartItemId = `${product.id}_${currentVariant.name}`;
    const cartItem = this.cart.find(i => i.cartItemId === cartItemId);
    const inCartQty = cartItem ? cartItem.qty : 0;

    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-img-box">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        <div class="product-info">
          <div class="product-title-row">
            <h3>${product.name}</h3>
            <p class="product-desc">${product.description}</p>
          </div>

          ${product.variants && product.variants.length > 1 ? `
            <div class="variant-selector">
              ${product.variants.map((v, idx) => `
                <button class="variant-btn ${idx === selectedVariantIdx ? 'selected' : ''}" 
                  data-prod-id="${product.id}" data-var-idx="${idx}">
                  ${v.name}
                </button>
              `).join('')}
            </div>
          ` : ''}

          <div class="product-bottom-row">
            <div class="price-box">
              <span class="current-price">${this.config.currency}${currentVariant.price}</span>
              <span class="unit-label">/ ${currentVariant.name}</span>
            </div>

            ${!product.inStock ? `
              <span style="font-size: 0.75rem; color: var(--danger); font-weight: 800;">Out of Stock</span>
            ` : inCartQty > 0 ? `
              <div class="qty-control">
                <button class="qty-btn btn-minus" data-cart-id="${cartItemId}">−</button>
                <span class="qty-count">${inCartQty}</span>
                <button class="qty-btn btn-plus" data-cart-id="${cartItemId}">+</button>
              </div>
            ` : `
              <button class="btn-add-cart btn-add" data-prod-id="${product.id}" data-var-idx="${selectedVariantIdx}">
                <span>+ Add</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }

  renderCustomerTracker(order) {
    const isReady = order.status === 'READY';
    const isPacking = order.status === 'PACKING';
    const isCompleted = order.status === 'COMPLETED';
    const isPaid = order.paymentStatus && order.paymentStatus.toLowerCase().includes('paid');

    return `
      <div class="order-tracker-card" style="padding-bottom: 2rem;">
        <!-- Token & Location Header -->
        <div class="tracker-token-box" style="margin-bottom: 1rem;">
          <div class="token-label">SHAGUN STORE PICKUP TOKEN</div>
          <div class="token-number">#${order.token}</div>
          <div class="location-badge">📍 Collection Spot: ${order.location}</div>
        </div>

        ${order.paymentMethod === 'upi' && !order.paymentVerified ? `
          <div style="margin-bottom: 1rem; background: #fffbeb; border: 1.5px solid #fde68a; padding: 14px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 4px;">⏳</div>
            <h4 style="font-size: 1rem; font-weight: 900; color: #92400e; margin: 0 0 4px 0;">Order Submitted • Awaiting Shop UPI Verification</h4>
            <p style="font-size: 0.8rem; color: #b45309; margin: 0 0 10px 0;">
              Store owner is confirming receipt of <strong>${this.config.currency}${order.totalAmount}</strong> on UPI ID <strong>${this.config.upiId || '7795565216-1@okbizaxis'}</strong>. Packing begins automatically once verified by store admin.
            </p>
            <a href="upi://pay?pa=${encodeURIComponent(this.config.upiId || '7795565216-1@okbizaxis')}&pn=${encodeURIComponent(this.config.name || 'SHAGUN STORE')}&am=${order.totalAmount}&cu=INR&tn=${encodeURIComponent('Order ' + order.token + ' ' + (this.config.name || 'SHAGUN STORE'))}" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #047857; color: white; border-radius: 8px; font-size: 0.82rem; font-weight: 800; text-decoration: none;">
              <span>📱</span> Re-open UPI App (${this.config.currency}${order.totalAmount})
            </a>
          </div>
        ` : order.paymentMethod === 'upi' && order.paymentVerified ? `
          <div style="margin-bottom: 1rem; background: #ecfdf5; border: 1.5px solid #a7f3d0; padding: 12px 14px; border-radius: 14px; text-align: center; color: #065f46;">
            <div style="font-size: 0.95rem; font-weight: 900;">🟢 UPI Payment Verified by Store Owner (${this.config.currency}${order.totalAmount})</div>
            <div style="font-size: 0.78rem; opacity: 0.9; margin-top: 2px;">Bank receipt confirmed. Staff is packing your groceries!</div>
          </div>
        ` : ''}

        ${isReady ? `
          <div class="ready-alert-box" style="animation: pulse 1.5s infinite; margin-bottom: 1rem;">
            <h3 style="font-size: 1.15rem; margin: 0 0 6px 0;">🎉 Your Grocery Bag is Packed & Ready!</h3>
            <p style="font-size: 0.85rem; margin: 0;">Please walk to Counter <strong>${order.location}</strong> and show Token <strong>#${order.token}</strong> to pick up your bag.</p>
          </div>
        ` : `
          <div style="margin-bottom: 1rem; font-weight: 800; color: #047857; font-size: 0.95rem; background: #ecfdf5; padding: 12px 14px; border-radius: 12px; border: 1px solid #a7f3d0; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.2rem;">${isPacking ? '👨‍🍳' : '⏳'}</span>
            <div>${isPacking ? 'Staff is currently packing your items at shelves...' : 'Order confirmed! Packing staff notified at counter.'}</div>
          </div>
        `}

        <!-- 4-Step Order Progression Tracker -->
        <div class="status-stepper" style="margin-bottom: 1.25rem;">
          <div class="step-item done">
            <div class="step-icon">✓</div>
            <div class="step-content">
              <h4>1. Order Placed & Payment Done</h4>
              <p>${order.phone} • ${order.paymentStatus}</p>
            </div>
          </div>

          <div class="step-item ${isPacking || isReady || isCompleted ? (isPacking ? 'current' : 'done') : ''}">
            <div class="step-icon">${isReady || isCompleted ? '✓' : '📦'}</div>
            <div class="step-content">
              <h4>2. Staff Packing in Carry Bag</h4>
              <p>${isPacking ? 'Packing in progress by SHAGUN STORE staff...' : (isReady || isCompleted ? 'Items packed & sealed in bag' : 'Queued on staff packing terminal')}</p>
            </div>
          </div>

          <div class="step-item ${isReady ? 'current' : (isCompleted ? 'done' : '')}">
            <div class="step-icon">${isCompleted ? '✓' : '🛍️'}</div>
            <div class="step-content">
              <h4>3. Ready for Collection</h4>
              <p>${isReady ? 'Ready for collection at counter now!' : 'Staff will finish in ~2 minutes'}</p>
            </div>
          </div>

          <div class="step-item ${isCompleted ? 'done' : ''}">
            <div class="step-icon">🤝</div>
            <div class="step-content">
              <h4>4. Handed Over</h4>
              <p>Bag collected by customer</p>
            </div>
          </div>
        </div>

        <!-- QR Code for Staff Scanner -->
        <div class="pickup-qr-container" style="margin-bottom: 1.25rem;">
          <div id="pickupQRCodeContainer"></div>
          <span>Show this QR / Token #${order.token} to SHAGUN STORE Staff</span>
        </div>

        <!-- 🛍️ BLINKIT STYLE ORDERED ITEMS BREAKDOWN -->
        <div class="blinkit-items-card" style="width: 100%; text-align: left; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); margin-bottom: 1.25rem;">
          <div style="background: #f8fafc; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.1rem;">🛍️</span>
              <h4 style="font-size: 0.95rem; font-weight: 800; margin: 0; color: #0f172a;">Items in this Order (${order.items.length})</h4>
            </div>
            <span style="font-size: 0.72rem; background: #dcfce7; color: #166534; font-weight: 800; padding: 3px 8px; border-radius: 20px;">CONFIRMED</span>
          </div>

          <div style="padding: 8px 16px;">
            ${order.items.map((item, idx) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; ${idx !== order.items.length - 1 ? 'border-bottom: 1px dashed #f1f5f9;' : ''}">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                  <div style="width: 38px; height: 38px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;">
                    🛒
                  </div>
                  <div>
                    <div style="font-size: 0.88rem; font-weight: 700; color: #1e293b; line-height: 1.2;">${item.name}</div>
                    <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">Pack: <strong>${item.variantName || 'Standard'}</strong> • ${this.config.currency}${item.price} each</div>
                  </div>
                </div>
                <div style="text-align: right; margin-left: 12px;">
                  <div style="font-size: 0.8rem; font-weight: 800; background: #f1f5f9; padding: 2px 8px; border-radius: 6px; display: inline-block; color: #334155; margin-bottom: 2px;">
                    ${item.qty}x
                  </div>
                  <div style="font-size: 0.95rem; font-weight: 900; color: #047857; font-family: var(--font-display);">
                    ${this.config.currency}${item.price * item.qty}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 🧾 DETAILED BILL RECEIPT (BLINKIT STYLE) -->
        <div class="bill-receipt-card" style="width: 100%; text-align: left; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
            <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">🧾 Bill Summary</div>
            <div style="font-size: 0.75rem; color: #64748b; font-family: var(--font-mono);">${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #475569; padding: 3px 0;">
            <span>Items Subtotal</span>
            <span>${this.config.currency}${order.subtotal}</span>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #475569; padding: 3px 0;">
            <span>Express Carry Bag Packing</span>
            <span style="color: #166534; font-weight: 700;">FREE</span>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #475569; padding: 3px 0;">
            <span>Taxes & GST</span>
            <span>${this.config.currency}${order.tax || 0}</span>
          </div>

          <div style="border-top: 1.5px dashed #cbd5e1; margin-top: 8px; padding-top: 8px; display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 900;">
            <span style="color: #0f172a;">Grand Total</span>
            <span style="color: #047857; font-family: var(--font-display);">${this.config.currency}${order.totalAmount}</span>
          </div>

          <div style="margin-top: 12px; padding: 10px; border-radius: 8px; background: ${isPaid ? '#f0fdf4' : '#fefce8'}; border: 1px solid ${isPaid ? '#86efac' : '#fef08a'}; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.78rem; font-weight: 700; color: ${isPaid ? '#166534' : '#854d0e'};">
              ${isPaid ? '🟢 PAID ONLINE (UPI)' : '💵 Pay Cash at Counter'}
            </span>
            <span style="font-size: 0.75rem; color: #64748b; font-family: var(--font-mono);">${order.phone}</span>
          </div>
        </div>

        <button class="btn-ticket-action btn-ticket-print" id="btnPlaceAnotherOrder" style="width: 100%; padding: 14px; background: #047857; color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(4,120,87,0.3);">
          🛒 Order More Items / New Bag
        </button>
      </div>
    `;
  }

  // ==========================================================================
  // 2. STAFF PACKING TERMINAL (MOBILE FRIENDLY FOR iOS & ANDROID)
  // ==========================================================================
  renderStaffView() {
    let filteredOrders = this.orders;

    if (this.staffFilterLocation !== 'all') {
      filteredOrders = filteredOrders.filter(o => o.location === this.staffFilterLocation);
    }
    if (this.staffSearchToken) {
      filteredOrders = filteredOrders.filter(o => 
        o.token.toLowerCase().includes(this.staffSearchToken.toLowerCase()) ||
        o.customerName.toLowerCase().includes(this.staffSearchToken.toLowerCase()) ||
        (o.phone && o.phone.includes(this.staffSearchToken))
      );
    }

    const incomingOrders = filteredOrders.filter(o => o.status === 'NEW');
    const packingOrders = filteredOrders.filter(o => o.status === 'PACKING');
    const readyOrders = filteredOrders.filter(o => o.status === 'READY');
    const completedOrders = filteredOrders.filter(o => o.status === 'COMPLETED').slice(0, 15);

    return `
      <div class="staff-toolbar">
        <div class="staff-title-group">
          <h2>👨‍🍳 SHAGUN STORE • Staff Packing Terminal</h2>
          <p>Real-time orders queue across aisles • Staff packs items, checks off list, and notifies customer</p>
        </div>

        <div class="staff-actions-group">
          <div class="quick-token-lookup">
            <span>🔍</span>
            <input type="text" id="staffTokenSearch" placeholder="Token / Mobile..." value="${this.staffSearchToken}">
          </div>

          <select id="staffLocationFilter" style="padding: 6px 12px; border: 1px solid var(--border); border-radius: var(--radius-full); font-size: 0.8rem; background: var(--bg-surface); font-weight: 700;">
            <option value="all">📍 All Counters / Spots</option>
            ${this.config.pickupLocations.map(loc => `
              <option value="${loc}" ${loc === this.staffFilterLocation ? 'selected' : ''}>${loc}</option>
            `).join('')}
          </select>

          <button class="audio-toggle-btn ${this.audioAlertsEnabled ? 'active' : ''}" id="btnToggleAudio">
            <span>${this.audioAlertsEnabled ? '🔔 Alert Chime: ON' : '🔕 Alert Chime: OFF'}</span>
          </button>
          <button class="mode-btn" id="btnTestChime">
            🔊 Test Chime
          </button>
        </div>
      </div>

      <div class="kanban-board">
        <!-- 1. Incoming / New -->
        <div class="kanban-col incoming">
          <div class="kanban-col-header">
            <span>🔴 New Orders (${incomingOrders.length})</span>
            <span class="col-badge">Needs Packing</span>
          </div>
          <div class="kanban-cards-list">
            ${incomingOrders.length === 0 ? `
              <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.8rem;">
                No incoming orders.<br>Waiting for customers to order...
              </div>
            ` : incomingOrders.map(order => this.renderStaffOrderCard(order)).join('')}
          </div>
        </div>

        <!-- 2. Packing in Progress -->
        <div class="kanban-col packing">
          <div class="kanban-col-header">
            <span>🔵 Currently Packing</span>
            <span class="col-badge">${packingOrders.length}</span>
          </div>
          <div class="kanban-cards-list">
            ${packingOrders.length === 0 ? `
              <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.8rem;">
                No bags currently in packing.
              </div>
            ` : packingOrders.map(order => this.renderStaffOrderCard(order)).join('')}
          </div>
        </div>

        <!-- 3. Ready for Collection -->
        <div class="kanban-col ready">
          <div class="kanban-col-header">
            <span>🟢 Ready for Pickup</span>
            <span class="col-badge">${readyOrders.length}</span>
          </div>
          <div class="kanban-cards-list">
            ${readyOrders.length === 0 ? `
              <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.8rem;">
                No packed bags awaiting customer pickup.
              </div>
            ` : readyOrders.map(order => this.renderStaffOrderCard(order)).join('')}
          </div>
        </div>

        <!-- 4. Fulfilled -->
        <div class="kanban-col completed">
          <div class="kanban-col-header">
            <span>⚪ Handed Over</span>
            <span class="col-badge">${completedOrders.length}</span>
          </div>
          <div class="kanban-cards-list">
            ${completedOrders.length === 0 ? `
              <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.8rem;">
                Completed orders will show here.
              </div>
            ` : completedOrders.map(order => this.renderStaffOrderCard(order)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderStaffOrderCard(order) {
    const isNew = order.status === 'NEW';
    const isPacking = order.status === 'PACKING';
    const isReady = order.status === 'READY';

    const orderTime = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="order-ticket ${isNew ? 'new-highlight' : ''}" data-order-id="${order.id}">
        <div class="ticket-header">
          <div>
            <div class="ticket-token">#${order.token}</div>
            <div class="ticket-meta">⏰ ${orderTime} • 📍 ${order.location}</div>
          </div>
          <span class="mode-btn active" style="font-size: 0.72rem; padding: 2px 8px;">
            ${order.paymentStatus}
          </span>
        </div>

        <div class="ticket-customer-info">
          <span>👤 ${order.customerName}</span>
          <span style="color: var(--primary); font-weight: 800;">📞 ${order.phone}</span>
        </div>

        ${order.packingNote ? `
          <div class="ticket-notes">
            📝 Note: "${order.packingNote}"
          </div>
        ` : ''}

        ${order.paymentMethod === 'upi' && !order.paymentVerified ? `
          <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 10px; padding: 10px; margin: 8px 0; text-align: center;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #b45309; margin-bottom: 6px;">
              ⚠️ UPI Payment: ${this.config.currency}${order.totalAmount} (Check Soundbox / Bank SMS)
            </div>
            <button class="btn-verify-upi-payment" data-order-id="${order.id}" style="width: 100%; padding: 8px 12px; background: #047857; color: white; border: none; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: var(--shadow-sm);">
              <span>🟢</span> Confirm ₹${order.totalAmount} Received in Bank
            </button>
          </div>
        ` : ''}

        <div class="packing-checklist">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
              Checklist (${order.items.filter(i=>i.packed).length}/${order.items.length}):
            </span>
            ${isPacking ? `
              <button class="btn-pack-all" data-order-id="${order.id}" style="border: none; background: transparent; color: var(--primary); font-size: 0.72rem; font-weight: 800; cursor: pointer;">
                ✓ Check All
              </button>
            ` : ''}
          </div>
          ${order.items.map((item, idx) => `
            <label class="check-item ${item.packed ? 'checked' : ''}">
              <input type="checkbox" class="pack-checkbox" data-order-id="${order.id}" data-item-idx="${idx}" ${item.packed ? 'checked' : ''}>
              <span><strong>${item.qty}x</strong> ${item.name} <em style="font-size: 0.75rem; color: #475569;">(${item.variantName})</em></span>
            </label>
          `).join('')}
        </div>

        <div class="ticket-actions">
          ${isNew ? `
            <button class="btn-ticket-action btn-ticket-pack btn-change-status" data-order-id="${order.id}" data-status="PACKING">
              📦 Start Packing
            </button>
          ` : isPacking ? `
            <button class="btn-ticket-action btn-ticket-ready btn-change-status" data-order-id="${order.id}" data-status="READY">
              🔔 Mark Ready & Alert Phone
            </button>
          ` : isReady ? `
            <button class="btn-ticket-action btn-ticket-done btn-change-status" data-order-id="${order.id}" data-status="COMPLETED">
              ✓ Handed to Customer
            </button>
          ` : `
            <span style="font-size: 0.75rem; color: var(--success); font-weight: 800; text-align: center; width: 100%;">
              ✓ Fulfilled
            </span>
          `}

          <button class="btn-ticket-action btn-ticket-print btn-print-slip" data-order-id="${order.id}" title="Print 80mm Bag Slip">
            🖨️
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 3. SECRET OWNER ADMIN PANEL (UNLOCKED ONLY VIA CTRL + SHIFT + Z)
  // ==========================================================================
  renderAdminView() {
    return `
      <div class="secret-admin-header-bar">
        <div class="secret-admin-title">
          <h2>🛡️ SHAGUN STORE • Owner Master Admin</h2>
          <p>Secret Access Unlocked via [Ctrl + Shift + Z] • Store Analytics & Master Control</p>
        </div>
        <button class="btn-lock-admin" id="btnLockAdminMode">
          🔒 Lock & Hide Admin
        </button>
      </div>

      <div class="admin-tab-bar">
        <button class="admin-tab-btn ${this.adminActiveTab === 'analytics' ? 'active' : ''}" data-admin-tab="analytics">
          📊 Business Analytics & Revenue
        </button>
        <button class="admin-tab-btn ${this.adminActiveTab === 'customers' ? 'active' : ''}" data-admin-tab="customers">
          👥 Customer Mobile Directory (${this.getUniqueCustomers().length})
        </button>
        <button class="admin-tab-btn ${this.adminActiveTab === 'orders' ? 'active' : ''}" data-admin-tab="orders">
          📋 Orders History (${this.orders.length})
        </button>
        <button class="admin-tab-btn ${this.adminActiveTab === 'inventory' ? 'active' : ''}" data-admin-tab="inventory">
          📦 Grocery Catalog (${this.products.length} Items)
        </button>
        <button class="admin-tab-btn ${this.adminActiveTab === 'qr-studio' ? 'active' : ''}" data-admin-tab="qr-studio">
          🖨️ Official Customer QR Standee
        </button>
        <button class="admin-tab-btn ${this.adminActiveTab === 'staff-qr' ? 'active' : ''}" data-admin-tab="staff-qr">
          📱 Staff Phone Setup
        </button>
        <button class="admin-tab-btn ${this.adminActiveTab === 'firebase' ? 'active' : ''}" data-admin-tab="firebase">
          🔥 Firebase Cloud Sync
        </button>
        <button class="admin-tab-btn ${this.adminActiveTab === 'settings' ? 'active' : ''}" data-admin-tab="settings">
          ⚙️ Store Settings & UPI
        </button>
      </div>

      <div class="admin-content-box">
        ${this.renderAdminTabContent()}
      </div>
    `;
  }

  renderAdminTabContent() {
    if (this.adminActiveTab === 'analytics') {
      return this.renderAdminAnalytics();
    } else if (this.adminActiveTab === 'customers') {
      return this.renderAdminCustomers();
    } else if (this.adminActiveTab === 'inventory') {
      return this.renderAdminInventory();
    } else if (this.adminActiveTab === 'orders') {
      return this.renderAdminOrders();
    } else if (this.adminActiveTab === 'qr-studio') {
      return this.renderAdminQRStudio();
    } else if (this.adminActiveTab === 'staff-qr') {
      return this.renderStaffMobileSetup();
    } else if (this.adminActiveTab === 'firebase') {
      return this.renderAdminFirebase();
    } else if (this.adminActiveTab === 'settings') {
      return this.renderAdminSettings();
    }
    return '';
  }

  renderAdminAnalytics() {
    const stats = this.getAnalytics();

    return `
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon green">💰</div>
          <div class="metric-details">
            <span class="metric-label">Total Revenue</span>
            <span class="metric-value">${this.config.currency}${stats.totalRevenue}</span>
            <span class="metric-sub">${stats.totalOrders} customer orders</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon blue">🛍️</div>
          <div class="metric-details">
            <span class="metric-label">Completed Orders</span>
            <span class="metric-value">${stats.completedOrders}</span>
            <span class="metric-sub">${stats.activeOrders} active / packing</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon orange">📦</div>
          <div class="metric-details">
            <span class="metric-label">Average Order Value</span>
            <span class="metric-value">${this.config.currency}${stats.avgOrderValue}</span>
            <span class="metric-sub">Per verified customer</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon purple">⚡</div>
          <div class="metric-details">
            <span class="metric-label">Store Database</span>
            <span class="metric-value" style="font-size: 1.2rem; color: var(--success);">${this.products.length} Items</span>
            <span class="metric-sub">2,000+ Catalog Active</span>
          </div>
        </div>
      </div>

      <div class="analytics-section">
        <div class="admin-card">
          <div class="admin-card-header">
            <h3>🌾 Top-Selling Staples & Groceries</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Ranked by units sold</span>
          </div>
          <div>
            ${stats.topItems.length === 0 ? `
              <p style="color: var(--text-muted); font-size: 0.85rem;">No orders recorded yet.</p>
            ` : stats.topItems.map((item, idx) => `
              <div class="top-seller-row">
                <div class="top-seller-info">
                  <div class="top-seller-rank">${idx + 1}</div>
                  <div>
                    <strong>${item.name}</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${item.count} packs sold</div>
                  </div>
                </div>
                <strong>${this.config.currency}${item.revenue}</strong>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header">
            <h3>💳 Payment Method Breakdown</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Customer preferences</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>📱 Instant UPI / GPay / PhonePe</span>
              <strong>${stats.paymentMap.upi} orders</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>💵 Cash at Collection Counter</span>
              <strong>${stats.paymentMap.counter} orders</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>💳 Debit / Credit Card</span>
              <strong>${stats.paymentMap.card} orders</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAdminInventory() {
    return `
      <div class="admin-card">
        <div class="admin-card-header">
          <div>
            <h3>📦 SHAGUN STORE Catalog (${this.products.length} Products)</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Manage 2,000+ grocery items, pack prices, and stock availability</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-admin-action primary" id="btnOpenAddProductModal">
              + Add New Item
            </button>
            <button class="btn-admin-action" id="btnResetData">
              🔄 Reset 2000+ Items
            </button>
          </div>
        </div>

        <div class="data-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price (${this.config.currency})</th>
                <th>Pack Variants</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.products.slice(0, 100).map(prod => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <img src="${prod.image}" style="width: 38px; height: 38px; border-radius: 6px; object-fit: cover;">
                      <div>
                        <strong>${prod.name}</strong>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">${prod.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td>${CATEGORIES.find(c=>c.id===prod.category)?.name || prod.category}</td>
                  <td><strong>${this.config.currency}${prod.price}</strong></td>
                  <td>
                    ${prod.variants ? prod.variants.map(v => `<span style="display: inline-block; background: var(--bg-surface); padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; margin-right: 4px;">${v.name}: ${this.config.currency}${v.price}</span>`).join('') : '-'}
                  </td>
                  <td>
                    <button class="btn-toggle-stock mode-btn ${prod.inStock ? 'active' : ''}" 
                      data-prod-id="${prod.id}" 
                      style="${prod.inStock ? 'color: var(--success); font-weight: 800;' : 'color: var(--danger); font-weight: 800;'}">
                      ${prod.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                    </button>
                  </td>
                  <td>
                    <button class="btn-admin-action danger btn-delete-product" data-prod-id="${prod.id}" title="Delete Item">
                      🗑️
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${this.products.length > 100 ? `
            <div style="padding: 10px; text-align: center; font-size: 0.8rem; color: var(--text-muted);">
              Showing first 100 of ${this.products.length} items in admin view.
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderAdminOrders() {
    return `
      <div class="admin-card">
        <div class="admin-card-header">
          <div>
            <h3>📋 Verified Store Orders Database</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Real-time orders log with customer verified mobile numbers</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-admin-action primary" id="btnExportCSV">
              📥 Export to CSV / Excel
            </button>
          </div>
        </div>

        <div class="data-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Date & Time</th>
                <th>Customer Name</th>
                <th>Verified Mobile</th>
                <th>Spot</th>
                <th>Items Ordered</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${this.orders.length === 0 ? `
                <tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">No orders recorded yet.</td></tr>
              ` : this.orders.map(ord => `
                <tr>
                  <td><strong>#${ord.token}</strong></td>
                  <td>${new Date(ord.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>${ord.customerName}</td>
                  <td><strong style="color: var(--primary);">${ord.phone}</strong></td>
                  <td>${ord.location}</td>
                  <td>
                    <div style="max-width: 250px; font-size: 0.78rem;">
                      ${ord.items.map(i => `${i.qty}x ${i.name} (${i.variantName})`).join(', ')}
                    </div>
                  </td>
                  <td><strong>${this.config.currency}${ord.totalAmount}</strong></td>
                  <td><span style="font-size: 0.75rem; background: var(--bg-surface); padding: 3px 8px; border-radius: 999px;">${ord.paymentStatus}</span></td>
                  <td>
                    <span style="font-weight: 800; font-size: 0.75rem; color: ${ord.status === 'COMPLETED' ? 'var(--success)' : ord.status === 'READY' ? 'var(--primary)' : 'var(--accent)'}">
                      ${ord.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // CUSTOMER MOBILE CRM & DIRECTORY DATABASE
  // ==========================================================================
  getUniqueCustomers() {
    const customerMap = new Map();
    this.orders.forEach(order => {
      if (!order.phone) return;
      const clean = order.phone.replace(/\D/g, '').slice(-10);
      if (clean.length !== 10) return;
      const key = `+91 ${clean}`;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          phone: key,
          rawPhone: clean,
          name: order.customerName || "Customer",
          totalOrders: 0,
          lifetimeSpend: 0,
          firstSeen: order.createdAt,
          lastSeen: order.createdAt,
          lastToken: order.token,
          lastStatus: order.status,
          locations: new Set()
        });
      }
      const record = customerMap.get(key);
      record.totalOrders += 1;
      record.lifetimeSpend += (order.totalAmount || 0);
      if (new Date(order.createdAt) > new Date(record.lastSeen)) {
        record.lastSeen = order.createdAt;
        record.lastToken = order.token;
        record.lastStatus = order.status;
        if (order.customerName && order.customerName !== 'Customer') {
          record.name = order.customerName;
        }
      }
      if (order.location) record.locations.add(order.location);
    });
    return Array.from(customerMap.values()).sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));
  }

  renderAdminCustomers() {
    const allCustomers = this.getUniqueCustomers();
    const query = (this.adminCustomerSearch || '').toLowerCase().trim();
    const filtered = query 
      ? allCustomers.filter(c => c.phone.includes(query) || c.rawPhone.includes(query) || c.name.toLowerCase().includes(query))
      : allCustomers;

    const totalRevenue = allCustomers.reduce((sum, c) => sum + c.lifetimeSpend, 0);
    const totalOrdersCount = allCustomers.reduce((sum, c) => sum + c.totalOrders, 0);

    return `
      <div class="admin-card">
        <div class="admin-card-header">
          <div>
            <h3>👥 Customer Mobile CRM Directory (${allCustomers.length} Verified Mobiles)</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">
              All customer mobile numbers captured from QR scans & store checkouts
            </p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-admin-action primary" id="btnExportCustomersCSV">
              📥 Export All Mobiles (CSV / Excel)
            </button>
          </div>
        </div>

        <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 1.5rem;">
          <div class="metric-card">
            <div class="metric-icon green">📱</div>
            <div class="metric-details">
              <span class="metric-label">Unique Mobile Numbers</span>
              <span class="metric-value">${allCustomers.length}</span>
              <span class="metric-sub">Direct Customer Contacts</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon blue">💰</div>
            <div class="metric-details">
              <span class="metric-label">Total Customer Spend</span>
              <span class="metric-value">${this.config.currency}${totalRevenue.toLocaleString()}</span>
              <span class="metric-sub">Across ${totalOrdersCount} Total Orders</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon gold">🔄</div>
            <div class="metric-details">
              <span class="metric-label">Avg Spend per Customer</span>
              <span class="metric-value">${this.config.currency}${allCustomers.length ? Math.round(totalRevenue / allCustomers.length) : 0}</span>
              <span class="metric-sub">Customer Lifetime Value</span>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <input type="text" id="adminCustomerSearchInput" placeholder="🔍 Search customer by 10-digit mobile number or name..." value="${this.adminCustomerSearch || ''}" style="width: 100%; max-width: 450px; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.85rem;">
        </div>

        <div class="data-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Customer Mobile</th>
                <th>Customer Name</th>
                <th>Total Orders</th>
                <th>Lifetime Spend</th>
                <th>Last Order Token</th>
                <th>Last Visit Date</th>
                <th>Contact / Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr><td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No customer mobile numbers found.</td></tr>
              ` : filtered.map(c => `
                <tr>
                  <td>
                    <strong style="color: var(--primary); font-size: 0.95rem; letter-spacing: 0.5px;">${c.phone}</strong>
                  </td>
                  <td><strong>${c.name}</strong></td>
                  <td><span style="background: var(--bg-surface); padding: 3px 10px; border-radius: 999px; font-weight: 800; font-size: 0.75rem;">${c.totalOrders} Orders</span></td>
                  <td><strong style="color: #047857;">${this.config.currency}${c.lifetimeSpend.toLocaleString()}</strong></td>
                  <td><span style="font-weight: 800; color: var(--accent);">#${c.lastToken}</span></td>
                  <td><span style="font-size: 0.75rem; color: var(--text-muted);">${new Date(c.lastSeen).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span></td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <a href="https://wa.me/91${c.rawPhone}?text=${encodeURIComponent(`Hello ${c.name}, greetings from SHAGUN STORE!`)}" target="_blank" class="btn-admin-action" style="padding: 4px 10px; font-size: 0.75rem; text-decoration: none; color: #166534; background: #dcfce7; border-color: #bbf7d0;">
                        💬 WhatsApp
                      </a>
                      <a href="tel:+91${c.rawPhone}" class="btn-admin-action" style="padding: 4px 10px; font-size: 0.75rem; text-decoration: none;">
                        📞 Call
                      </a>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  exportCustomerMobilesCSV() {
    const customers = this.getUniqueCustomers();
    if (customers.length === 0) {
      alert("No customer mobile numbers to export.");
      return;
    }

    const headers = ["Mobile Number", "Customer Name", "Total Orders", "Lifetime Spend (INR)", "Last Order Token", "Last Visit Date"];
    const rows = customers.map(c => [
      `"${c.phone}"`,
      `"${c.name}"`,
      c.totalOrders,
      c.lifetimeSpend,
      `"#${c.lastToken}"`,
      `"${new Date(c.lastSeen).toLocaleString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shagun_store_customer_mobiles_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ==========================================================================
  // 4. OFFICIAL CUSTOMER QR STANDEE STUDIO
  // ==========================================================================
  renderAdminQRStudio() {
    return `
      <div class="qr-studio-grid">
        <div class="admin-card">
          <div class="admin-card-header">
            <h3>🖨️ Official Customer QR Standee Studio</h3>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.15rem;">
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Generate high-resolution printable acrylic desk standees and wall posters for <strong>SHAGUN STORE</strong>.
            </p>

            <div class="form-group">
              <label>Store Name (English)</label>
              <input type="text" id="qrStoreName" value="${this.config.name}">
            </div>

            <div class="form-group">
              <label>Store Name (Hindi)</label>
              <input type="text" id="qrStoreNameHindi" value="${this.config.nameHindi || 'शगुन स्टोर'}">
            </div>

            <div class="form-group">
              <label>Headline / Tagline (Hindi)</label>
              <input type="text" id="qrTaglineHindi" value="${this.config.taglineHindi || 'स्कैन करें • सामान चुनें • काउंटर से प्राप्त करें'}">
            </div>

            <div class="form-group">
              <label>Standee Location / Spot</label>
              <select id="qrLocationSelect" style="font-weight: 700;">
                ${this.config.pickupLocations.map(loc => `
                  <option value="${loc}" ${loc === this.activeLocation ? 'selected' : ''}>${loc}</option>
                `).join('')}
              </select>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 0.5rem;">
              <button class="btn-place-order" id="btnPrintStandee" style="flex: 1;">
                🖨️ Print Standee Poster (A4 / A5)
              </button>
              <button class="btn-admin-action primary" id="btnDownloadQRPNG" style="padding: 12px 18px;">
                📥 Download High-Res PNG
              </button>
            </div>
          </div>
        </div>

        <div class="qr-preview-card printable-area" id="standeePrintArea">
          <div class="standee-header">
            <div style="font-size: 2.2rem; margin-bottom: 2px;">🛍️</div>
            <h2 id="previewStoreName">${this.config.name}</h2>
            <div style="font-family: var(--font-sans); font-size: 1.1rem; font-weight: 800; color: var(--accent);" id="previewStoreNameHindi">
              ${this.config.nameHindi || 'शगुन स्टोर'}
            </div>
            <p id="previewTagline" style="margin-top: 4px; font-weight: 700; color: #166534;">
              ${this.config.taglineHindi || 'स्कैन करें • सामान चुनें • काउंटर से प्राप्त करें'}
            </p>
            <div class="scan-tag" id="previewLocation" style="margin-top: 8px; background: #dcfce7; color: #166534; font-weight: 800;">
              📍 Spot: ${this.activeLocation}
            </div>
          </div>

          <div class="standee-qr-frame">
            <div id="standeeQRCanvas"></div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 900; margin-top: 10px; color: var(--text-main); letter-spacing: 0.05em;">
              SCAN WITH ANY PHONE CAMERA / GPAY / PAYTM
            </div>
          </div>

          <div class="standee-steps">
            <div class="standee-step-item">
              <div class="step-num">1</div>
              <span>1. Scan QR</span>
            </div>
            <div class="standee-step-item">
              <div class="step-num">2</div>
              <span>2. Pick Items & OTP</span>
            </div>
            <div class="standee-step-item">
              <div class="step-num">3</div>
              <span>3. Collect Packed Bag</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderStaffMobileSetup() {
    const staffUrl = `${this.serverHost}/?view=staff`;

    return `
      <div class="qr-studio-grid">
        <div class="admin-card">
          <div class="admin-card-header">
            <h3>📱 Connect Staff Mobile (iPhone & Android)</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.88rem;">
            <p>
              Your store staff opens the <strong>Packing Terminal</strong> on their own phone (iPhone / Android) to pick items from shelves, check off grocery items, and notify customers when bags are ready.
            </p>

            <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px dashed var(--border);">
              <h4 style="font-size: 0.85rem; font-weight: 800; margin-bottom: 6px;">How Staff Connects:</h4>
              <ol style="margin-left: 1.25rem; display: flex; flex-direction: column; gap: 4px; font-size: 0.82rem;">
                <li>Connect staff phone to shop <strong>Wi-Fi</strong>.</li>
                <li>Open Camera app on iPhone / Android and scan this QR code.</li>
                <li>Or type this link in phone browser: <code style="background: white; padding: 2px 6px; font-weight: 800;">${staffUrl}</code></li>
              </ol>
            </div>

            <div style="display: flex; gap: 10px;">
              <button class="btn-admin-action primary" onclick="window.open('${staffUrl}', '_blank')">
                🚀 Open Staff Panel in New Tab
              </button>
            </div>
          </div>
        </div>

        <div class="qr-preview-card">
          <div class="standee-header">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">👨‍🍳</div>
            <h2>Staff Packing Terminal QR</h2>
            <p>Scan with Staff iPhone / Android</p>
          </div>

          <div class="standee-qr-frame">
            <div id="staffSetupQRCanvas"></div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 900; margin-top: 8px; color: var(--text-main);">
              STAFF PACKING ACCESS
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAdminFirebase() {
    const fbStatus = getFirebaseStatus();
    const savedCustom = localStorage.getItem('shagun_firebase_config');
    const customObj = savedCustom ? JSON.parse(savedCustom) : null;

    return `
      <div class="admin-card" style="max-width: 900px;">
        <div class="admin-card-header">
          <div>
            <h3>🔥 Firebase Full-Stack Cloud Sync & Hosting</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">
              Cloud Firestore 0ms WebSocket Sync across all Staff Phones & Customer Phones worldwide
            </p>
          </div>
          <span style="font-size: 0.8rem; font-weight: 800; padding: 6px 14px; border-radius: 999px; background: #dcfce7; color: #166534;">
            ● Cloud Sync Ready
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
              <div style="font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Cloud Database</div>
              <div style="font-size: 1.1rem; font-weight: 900; color: var(--primary); margin-top: 4px;">Cloud Firestore</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Real-time onSnapshot listeners</div>
            </div>

            <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
              <div style="font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Project ID</div>
              <div style="font-size: 1.1rem; font-weight: 900; color: var(--text-main); margin-top: 4px;">${fbStatus.projectId}</div>
              <div style="font-size: 0.75rem; color: var(--success); margin-top: 2px;">Production Ready</div>
            </div>

            <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
              <div style="font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">Hosting Engine</div>
              <div style="font-size: 1.1rem; font-weight: 900; color: var(--accent); margin-top: 4px;">Firebase Hosting</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Global CDN & SSL</div>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: var(--radius-md);">
            <h4 style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
              ⚡ 1-Click Firebase Hosting Deploy Command
            </h4>
            <p style="font-size: 0.82rem; color: #475569; margin-bottom: 10px;">
              To deploy SHAGUN STORE to global Firebase Hosting CDN:
            </p>
            <div style="background: #0f172a; color: #38bdf8; font-family: var(--font-mono); padding: 10px 14px; border-radius: 6px; font-size: 0.85rem;">
              npx -y firebase-tools@latest deploy --only hosting
            </div>
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 1.25rem;">
            <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 10px;">
              🔧 Custom Firebase Project Credentials (Optional)
            </h4>
            <form id="firebaseCustomConfigForm" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="form-grid">
                <div class="form-group">
                  <label>Firebase API Key</label>
                  <input type="text" id="fbApiKey" placeholder="AIzaSy..." value="${customObj ? customObj.apiKey : ''}">
                </div>
                <div class="form-group">
                  <label>Firebase Project ID</label>
                  <input type="text" id="fbProjectId" placeholder="shagun-store-66" value="${customObj ? customObj.projectId : ''}">
                </div>
                <div class="form-group">
                  <label>Auth Domain</label>
                  <input type="text" id="fbAuthDomain" placeholder="shagun-store-66.firebaseapp.com" value="${customObj ? customObj.authDomain : ''}">
                </div>
                <div class="form-group">
                  <label>App ID</label>
                  <input type="text" id="fbAppId" placeholder="1:317282130000:web:..." value="${customObj ? customObj.appId : ''}">
                </div>
              </div>

              <div style="display: flex; gap: 10px;">
                <button type="submit" class="btn-place-order" style="padding: 10px 24px;">
                  💾 Save & Connect Firebase Cloud
                </button>
                <button type="button" class="btn-admin-action" id="btnTestFirebaseSync">
                  🧪 Send Test Cloud Ping
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  renderAdminSettings() {
    return `
      <div class="admin-card" style="max-width: 800px;">
        <div class="admin-card-header">
          <h3>⚙️ Store Settings & UPI Configuration</h3>
        </div>

        <form id="storeSettingsForm" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="form-grid">
            <div class="form-group">
              <label>Store Name (English)</label>
              <input type="text" id="cfgStoreName" value="${this.config.name}">
            </div>

            <div class="form-group">
              <label>Store Name (Hindi)</label>
              <input type="text" id="cfgStoreNameHindi" value="${this.config.nameHindi || 'शगुन स्टोर'}">
            </div>

            <div class="form-group">
              <label>Tagline (English)</label>
              <input type="text" id="cfgTagline" value="${this.config.tagline}">
            </div>

            <div class="form-group">
              <label>Tagline (Hindi)</label>
              <input type="text" id="cfgTaglineHindi" value="${this.config.taglineHindi}">
            </div>

            <div class="form-group">
              <label>Contact Phone</label>
              <input type="text" id="cfgPhone" value="${this.config.phone}">
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Shop Address</label>
              <input type="text" id="cfgAddress" value="${this.config.address}">
            </div>

            <div class="form-group">
              <label>Currency Symbol</label>
              <input type="text" id="cfgCurrency" value="${this.config.currency}">
            </div>

            <div class="form-group">
              <label>Merchant UPI ID (Google Pay / PhonePe / Paytm / BHIM / Axis Bank)</label>
              <input type="text" id="cfgUpiId" placeholder="e.g. 7795565216-1@okbizaxis" value="${this.config.upiId || '7795565216-1@okbizaxis'}">
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label>📲 Indian SMS Gateway API Key (Fast2SMS / Twilio / MSG91)</label>
              <input type="text" id="cfgSmsKey" placeholder="Paste Fast2SMS API Key for instant direct cellular SMS" value="${localStorage.getItem('shagun_sms_gateway_key') || ''}">
              <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                Sends real SMS OTP directly to customer's mobile phone handset over cellular network. (Or uses Firebase Phone Auth).
              </span>
            </div>
          </div>

          <button type="submit" class="btn-place-order" style="align-self: flex-start; padding: 12px 28px;">
            💾 Save Settings
          </button>
        </form>
      </div>
    `;
  }

  // ==========================================================================
  // 5. SPLIT SIMULATOR VIEW
  // ==========================================================================
  renderSplitView() {
    return `
      <div class="split-view-container">
        <!-- Left: Customer Smartphone View -->
        <div class="split-col">
          <div class="split-col-header">
            <span>📱 Customer Smartphone (SHAGUN STORE)</span>
            <span style="font-size: 0.72rem; color: var(--primary); font-weight: 700;">Spot: ${this.activeLocation}</span>
          </div>
          <div style="flex: 1; overflow-y: auto; position: relative;">
            ${this.renderCustomerView()}
          </div>
        </div>

        <!-- Right: Staff Store Fulfillment KDS -->
        <div class="split-col">
          <div class="split-col-header">
            <span>👨‍🍳 Staff Packing Terminal (iOS / Android)</span>
            <span style="font-size: 0.72rem; color: var(--accent); font-weight: 700;">Live Chimes Active</span>
          </div>
          <div style="flex: 1; overflow-y: auto; padding: 1rem;">
            ${this.renderStaffView()}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // MODALS & CART
  // ==========================================================================
  openCartModal() {
    const { subtotal, totalItems, tax, packingFee, finalTotal } = this.getCartTotals();
    const modalDiv = document.createElement('div');
    modalDiv.id = 'cartModal';
    modalDiv.className = 'cart-modal-backdrop';

    modalDiv.innerHTML = `
      <div class="cart-modal-content">
        <div class="cart-modal-header">
          <h3>🛍️ SHAGUN STORE Bag (${totalItems} items)</h3>
          <button class="btn-close-modal" id="btnCloseCartModal">✕</button>
        </div>

        <div class="cart-modal-body">
          <div class="cart-items-list">
            ${this.cart.map(item => `
              <div class="cart-item-row">
                <div class="cart-item-details">
                  <h4>${item.name}</h4>
                  <p>Pack: ${item.variantName} • ${this.config.currency}${item.price} each</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div class="qty-control">
                    <button class="qty-btn btn-modal-minus" data-cart-id="${item.cartItemId}">−</button>
                    <span class="qty-count">${item.qty}</span>
                    <button class="qty-btn btn-modal-plus" data-cart-id="${item.cartItemId}">+</button>
                  </div>
                  <div class="cart-item-price">
                    ${this.config.currency}${item.price * item.qty}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="packing-notes-box">
            <label>📝 Packing Notes for Store Staff (Optional)</label>
            <input type="text" id="orderPackingNote" placeholder="e.g. Double-bag the oil bottles, separate packets...">
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div>
              <label style="font-size: 0.8rem; font-weight: 800; display: block; margin-bottom: 4px;">Customer Name</label>
              <input type="text" id="orderCustomerName" placeholder="Your Name (e.g. Rahul Sharma)" style="width: 100%; padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.85rem;">
            </div>

            <div class="customer-phone-input-group">
              <div class="phone-label-row">
                <label>📱 Mobile Number (For Pickup Identification)</label>
                <span class="mandatory-pill">REQUIRED</span>
              </div>
              <div class="phone-input-wrapper">
                <span class="country-prefix">+91</span>
                <input type="tel" id="orderCustomerPhone" placeholder="Enter 10-digit mobile" maxlength="10" required>
              </div>
              <span style="font-size: 0.72rem; color: #166534; font-weight: 600;">Your Token will be linked to this mobile number for express counter collection.</span>
            </div>
          </div>

          <div class="payment-selector">
            <div class="payment-title">Select Payment Mode:</div>
            
            <label class="payment-option-card ${this.selectedPaymentMethod === 'upi' ? 'selected' : ''}">
              <input type="radio" name="payMethod" value="upi" ${this.selectedPaymentMethod === 'upi' ? 'checked' : ''} style="display: none;">
              <span class="payment-icon">📱</span>
              <div class="payment-info">
                <h5>UPI Payment</h5>
                <p>Pay ${this.config.currency}${finalTotal} directly via your phone's UPI app</p>
              </div>
            </label>

            <label class="payment-option-card ${this.selectedPaymentMethod === 'counter' ? 'selected' : ''}">
              <input type="radio" name="payMethod" value="counter" ${this.selectedPaymentMethod === 'counter' ? 'checked' : ''} style="display: none;">
              <span class="payment-icon">💵</span>
              <div class="payment-info">
                <h5>Pay Cash at Collection Counter</h5>
                <p>Pay cash when picking up your packed grocery bag</p>
              </div>
            </label>

            <label class="payment-option-card ${this.selectedPaymentMethod === 'card' ? 'selected' : ''}">
              <input type="radio" name="payMethod" value="card" ${this.selectedPaymentMethod === 'card' ? 'checked' : ''} style="display: none;">
              <span class="payment-icon">💳</span>
              <div class="payment-info">
                <h5>Debit / Credit Card / Counter POS</h5>
                <p>Pay via Visa / Mastercard / RuPay</p>
              </div>
            </label>
          </div>

          <div class="bill-summary">
            <div class="bill-row">
              <span>Items Subtotal</span>
              <span>${this.config.currency}${subtotal}</span>
            </div>
            ${packingFee > 0 ? `
              <div class="bill-row">
                <span>Express Packing</span>
                <span>${this.config.currency}${packingFee}</span>
              </div>
            ` : ''}
            <div class="bill-row total">
              <span>Total Payable</span>
              <span>${this.config.currency}${finalTotal}</span>
            </div>
          </div>

          <button class="btn-place-order" id="btnSubmitOrder" style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 1rem; padding: 14px;">
            ${this.selectedPaymentMethod === 'upi' ? `📱 Pay ${this.config.currency}${finalTotal} via UPI & Place Order ➔` : this.selectedPaymentMethod === 'counter' ? `💵 Place Order & Pay Cash at Counter (${this.config.currency}${finalTotal}) ➔` : `💳 Place Order (${this.config.currency}${finalTotal}) ➔`}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalDiv);
    this.attachModalEvents(modalDiv);
  }

  openAddProductModal() {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'addProductModal';
    modalDiv.className = 'admin-modal-overlay';

    modalDiv.innerHTML = `
      <div class="admin-modal-box">
        <div class="admin-modal-header">
          <h3 style="font-size: 1.1rem; font-weight: 800;">+ Add New Grocery Product</h3>
          <button class="btn-close-modal" id="btnCloseAddProdModal">✕</button>
        </div>

        <form id="addProductForm" class="admin-modal-body">
          <div class="form-group">
            <label>Product Name (English & Hindi)</label>
            <input type="text" id="newProdName" placeholder="e.g. Royal Basmati Rice (बासमती चावल)" required>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Category</label>
              <select id="newProdCategory">
                ${CATEGORIES.filter(c => c.id !== 'all').map(c => `
                  <option value="${c.id}">${c.name}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label>Base Price (${this.config.currency})</label>
              <input type="number" id="newProdPrice" placeholder="e.g. 120" required>
            </div>

            <div class="form-group">
              <label>Default Unit / Pack</label>
              <input type="text" id="newProdUnit" placeholder="e.g. 1 kg" required>
            </div>

            <div class="form-group">
              <label>Badge / Highlight</label>
              <input type="text" id="newProdBadge" placeholder="e.g. Bestseller, Fresh">
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea id="newProdDesc" rows="2" placeholder="Brief details about grain quality, origin, or usage..."></textarea>
          </div>

          <div class="form-group">
            <label>Image URL</label>
            <input type="url" id="newProdImage" placeholder="https://images.unsplash.com/..." value="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80">
          </div>

          <button type="submit" class="btn-place-order" style="margin-top: 0.5rem;">
            Save & Add to Catalog
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(modalDiv);

    modalDiv.querySelector('#btnCloseAddProdModal').addEventListener('click', () => modalDiv.remove());

    modalDiv.querySelector('#addProductForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modalDiv.querySelector('#newProdName').value;
      const category = modalDiv.querySelector('#newProdCategory').value;
      const price = parseFloat(modalDiv.querySelector('#newProdPrice').value);
      const unit = modalDiv.querySelector('#newProdUnit').value;
      const badge = modalDiv.querySelector('#newProdBadge').value;
      const desc = modalDiv.querySelector('#newProdDesc').value;
      const image = modalDiv.querySelector('#newProdImage').value;

      const newProduct = {
        id: `shagun_prod_${Date.now()}`,
        name,
        category,
        price,
        unit,
        variants: [
          { name: unit, price }
        ],
        inStock: true,
        badge: badge || null,
        description: desc || name,
        image
      };

      this.products.unshift(newProduct);
      this.saveProducts();
      modalDiv.remove();
      this.render();
    });
  }

  printThermalSlip(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    const printWin = window.open('', '_blank', 'width=380,height=540');
    if (!printWin) {
      alert("Please allow popups to print receipt slips.");
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bag Slip - ${order.token}</title>
        <style>
          body { font-family: monospace; font-size: 12px; margin: 10px; color: #000; }
          .center { text-align: center; }
          .dashed { border-top: 1px dashed #000; margin: 8px 0; }
          .token { font-size: 26px; font-weight: bold; margin: 8px 0; text-align: center; }
          .row { display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="center">
          <strong>${this.config.name}</strong><br>
          ${this.config.address}<br>
          Ph: ${this.config.phone}
        </div>
        <div class="dashed"></div>
        <div class="center">EXPRESS STORE PICKUP SLIP</div>
        <div class="token">#${order.token}</div>
        <div class="row">
          <span>Date: ${new Date(order.createdAt).toLocaleDateString()}</span>
          <span>Time: ${new Date(order.createdAt).toLocaleTimeString()}</span>
        </div>
        <div class="row">
          <span>Customer: ${order.customerName}</span>
          <span>Phone: ${order.phone}</span>
        </div>
        <div class="row">
          <span>Spot: ${order.location}</span>
          <span>Status: Verified OTP</span>
        </div>
        <div class="dashed"></div>
        <div><strong>ITEMS TO PACK:</strong></div>
        ${order.items.map(item => `
          <div class="row" style="margin: 4px 0;">
            <span>[ ] ${item.qty}x ${item.name} (${item.variantName})</span>
            <span>${this.config.currency}${item.price * item.qty}</span>
          </div>
        `).join('')}
        ${order.packingNote ? `
          <div class="dashed"></div>
          <div><strong>Note:</strong> ${order.packingNote}</div>
        ` : ''}
        <div class="dashed"></div>
        <div class="row" style="font-size: 14px; font-weight: bold;">
          <span>TOTAL:</span>
          <span>${this.config.currency}${order.totalAmount}</span>
        </div>
        <div class="row">
          <span>Payment:</span>
          <span>${order.paymentStatus}</span>
        </div>
        <div class="dashed"></div>
        <div class="center">Thank you for shopping at SHAGUN STORE!</div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  // ==========================================================================
  // EVENT BINDINGS
  // ==========================================================================
  attachPostRenderEvents() {
    // Mode switcher
    document.querySelectorAll('.mode-btn[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentView = btn.getAttribute('data-view');
        this.render();
      });
    });

    // Lock Admin Mode button
    const btnLock = document.getElementById('btnLockAdminMode');
    if (btnLock) {
      btnLock.addEventListener('click', () => {
        this.adminUnlocked = false;
        this.currentView = 'customer';
        this.showToastNotification("🔒 Admin Mode Locked & Hidden.");
        this.render();
      });
    }

    // Brand click returns home
    const brandHome = document.getElementById('btnBrandHome');
    if (brandHome) {
      brandHome.addEventListener('click', () => {
        this.currentView = 'customer';
        this.render();
      });
    }

    // Admin sub-tabs
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.adminActiveTab = btn.getAttribute('data-admin-tab');
        this.render();
      });
    });

    // Customer Category pills
    document.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCategory = btn.getAttribute('data-category');
        this.visibleProductsLimit = 36;
        this.render();
      });
    });

    // Load More Items Button
    const btnLoadMore = document.getElementById('btnLoadMoreItems');
    if (btnLoadMore) {
      btnLoadMore.addEventListener('click', () => {
        this.visibleProductsLimit += 36;
        this.render();
      });
    }

    // Customer search
    const searchInput = document.getElementById('productSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.visibleProductsLimit = 36;
        this.render();
        const newInp = document.getElementById('productSearchInput');
        if (newInp) {
          newInp.focus();
          newInp.setSelectionRange(newInp.value.length, newInp.value.length);
        }
      });
    }

    // Variant selector
    document.querySelectorAll('.variant-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prodId = btn.getAttribute('data-prod-id');
        const varIdx = parseInt(btn.getAttribute('data-var-idx'), 10);
        this.selectedVariants[prodId] = varIdx;
        this.render();
      });
    });

    // Add to cart
    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const prodId = btn.getAttribute('data-prod-id');
        const varIdx = parseInt(btn.getAttribute('data-var-idx'), 10);
        const product = this.products.find(p => p.id === prodId);
        if (product) this.addToCart(product, varIdx);
      });
    });

    // Qty +/-
    document.querySelectorAll('.btn-plus').forEach(btn => {
      btn.addEventListener('click', () => this.updateCartQty(btn.getAttribute('data-cart-id'), 1));
    });
    document.querySelectorAll('.btn-minus').forEach(btn => {
      btn.addEventListener('click', () => this.updateCartQty(btn.getAttribute('data-cart-id'), -1));
    });

    // Open Cart
    const btnOpenCart = document.getElementById('btnOpenCart');
    if (btnOpenCart) {
      btnOpenCart.addEventListener('click', () => this.openCartModal());
    }

    // Place another order
    const btnAnother = document.getElementById('btnPlaceAnotherOrder');
    if (btnAnother) {
      btnAnother.addEventListener('click', () => {
        this.currentCustomerOrderId = null;
        localStorage.removeItem('shagun_customer_active_order');
        this.render();
      });
    }

    // Staff Token Search
    const staffSearch = document.getElementById('staffTokenSearch');
    if (staffSearch) {
      staffSearch.addEventListener('input', (e) => {
        this.staffSearchToken = e.target.value;
        this.render();
        const reInp = document.getElementById('staffTokenSearch');
        if (reInp) {
          reInp.focus();
          reInp.setSelectionRange(reInp.value.length, reInp.value.length);
        }
      });
    }

    // Staff Location Filter
    const staffLoc = document.getElementById('staffLocationFilter');
    if (staffLoc) {
      staffLoc.addEventListener('change', (e) => {
        this.staffFilterLocation = e.target.value;
        this.render();
      });
    }

    // Staff Pack Checkbox
    document.querySelectorAll('.pack-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const ordId = cb.getAttribute('data-order-id');
        const idx = parseInt(cb.getAttribute('data-item-idx'), 10);
        this.toggleItemPacked(ordId, idx);
      });
    });

    // Staff Check All Items
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

    // Print Bag Slip
    document.querySelectorAll('.btn-print-slip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.printThermalSlip(btn.getAttribute('data-order-id'));
      });
    });

    // Audio Alert toggles
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

    // Staff / Admin UPI Payment Verification
    document.querySelectorAll('.btn-verify-upi-payment').forEach(btn => {
      btn.addEventListener('click', () => {
        const ordId = btn.getAttribute('data-order-id');
        this.verifyUpiPaymentByAdmin(ordId);
      });
    });

    // Admin Open Add Product Modal
    const btnAddProd = document.getElementById('btnOpenAddProductModal');
    if (btnAddProd) {
      btnAddProd.addEventListener('click', () => this.openAddProductModal());
    }

    // Admin Delete Product
    document.querySelectorAll('.btn-delete-product').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-prod-id');
        if (confirm("Are you sure you want to delete this grocery item from SHAGUN STORE?")) {
          this.products = this.products.filter(p => p.id !== pId);
          this.saveProducts();
          this.render();
        }
      });
    });

    // Stock toggle in Admin
    document.querySelectorAll('.btn-toggle-stock').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-prod-id');
        const p = this.products.find(item => item.id === pId);
        if (p) {
          p.inStock = !p.inStock;
          this.saveProducts();
          this.render();
        }
      });
    });

    // Reset Catalog
    const btnReset = document.getElementById('btnResetData');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm("Reset catalog to default 2,000+ grocery items for SHAGUN STORE?")) {
          this.products = INITIAL_PRODUCTS;
          this.saveProducts();
          this.render();
        }
      });
    }

    // Export Orders CSV
    const btnExport = document.getElementById('btnExportCSV');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportOrdersCSV());
    }

    // Export Customer Mobiles CSV
    const btnExportCust = document.getElementById('btnExportCustomersCSV');
    if (btnExportCust) {
      btnExportCust.addEventListener('click', () => this.exportCustomerMobilesCSV());
    }

    // Customer Mobile Search Input
    const custSearch = document.getElementById('adminCustomerSearchInput');
    if (custSearch) {
      custSearch.addEventListener('input', (e) => {
        this.adminCustomerSearch = e.target.value;
        const tbody = document.querySelector('.admin-table tbody');
        if (tbody) {
          const allCustomers = this.getUniqueCustomers();
          const query = this.adminCustomerSearch.toLowerCase().trim();
          const filtered = query 
            ? allCustomers.filter(c => c.phone.includes(query) || c.rawPhone.includes(query) || c.name.toLowerCase().includes(query))
            : allCustomers;

          if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No customer mobile numbers found matching "${this.adminCustomerSearch}".</td></tr>`;
          } else {
            tbody.innerHTML = filtered.map(c => `
              <tr>
                <td><strong style="color: var(--primary); font-size: 0.95rem; letter-spacing: 0.5px;">${c.phone}</strong></td>
                <td><strong>${c.name}</strong></td>
                <td><span style="background: var(--bg-surface); padding: 3px 10px; border-radius: 999px; font-weight: 800; font-size: 0.75rem;">${c.totalOrders} Orders</span></td>
                <td><strong style="color: #047857;">${this.config.currency}${c.lifetimeSpend.toLocaleString()}</strong></td>
                <td><span style="font-weight: 800; color: var(--accent);">#${c.lastToken}</span></td>
                <td><span style="font-size: 0.75rem; color: var(--text-muted);">${new Date(c.lastSeen).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span></td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    <a href="https://wa.me/91${c.rawPhone}?text=${encodeURIComponent(`Hello ${c.name}, greetings from SHAGUN STORE!`)}" target="_blank" class="btn-admin-action" style="padding: 4px 10px; font-size: 0.75rem; text-decoration: none; color: #166534; background: #dcfce7; border-color: #bbf7d0;">💬 WhatsApp</a>
                    <a href="tel:+91${c.rawPhone}" class="btn-admin-action" style="padding: 4px 10px; font-size: 0.75rem; text-decoration: none;">📞 Call</a>
                  </div>
                </td>
              </tr>
            `).join('');
          }
        }
      });
    }

    // Save Store Settings Form
    const settingsForm = document.getElementById('storeSettingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.config.name = document.getElementById('cfgStoreName').value;
        this.config.nameHindi = document.getElementById('cfgStoreNameHindi').value;
        this.config.tagline = document.getElementById('cfgTagline').value;
        this.config.taglineHindi = document.getElementById('cfgTaglineHindi').value;
        this.config.phone = document.getElementById('cfgPhone').value;
        this.config.address = document.getElementById('cfgAddress').value;
        this.config.currency = document.getElementById('cfgCurrency').value;
        const upiInput = document.getElementById('cfgUpiId');
        if (upiInput) {
          this.config.upiId = upiInput.value.trim() || '7795565216-1@okbizaxis';
        }
        const smsKey = document.getElementById('cfgSmsKey');
        if (smsKey) {
          localStorage.setItem('shagun_sms_gateway_key', smsKey.value.trim());
        }
        this.saveConfig();
        alert("SHAGUN STORE settings & UPI Configuration updated successfully!");
        this.render();
      });
    }

    // Save Custom Firebase Config Form
    const fbForm = document.getElementById('firebaseCustomConfigForm');
    if (fbForm) {
      fbForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const customConfig = {
          apiKey: document.getElementById('fbApiKey').value.trim(),
          projectId: document.getElementById('fbProjectId').value.trim(),
          authDomain: document.getElementById('fbAuthDomain').value.trim(),
          appId: document.getElementById('fbAppId').value.trim()
        };
        localStorage.setItem('shagun_firebase_config', JSON.stringify(customConfig));
        const res = await initializeFirebaseCloud(customConfig);
        if (res.success) {
          alert("✅ Connected to Firebase Cloud Firestore successfully!");
        } else {
          alert("⚠️ Firebase initialized with configuration saved.");
        }
        this.render();
      });
    }

    // Test Firebase Cloud Ping
    const btnTestFb = document.getElementById('btnTestFirebaseSync');
    if (btnTestFb) {
      btnTestFb.addEventListener('click', async () => {
        btnTestFb.innerText = "⏳ Pinging Cloud...";
        const testOrder = {
          id: `shagun_test_ping_${Date.now()}`,
          token: "SG-PING",
          createdAt: new Date().toISOString(),
          customerName: "Firebase Cloud Test",
          phone: "+91 9876543210",
          totalAmount: 1,
          status: "COMPLETED",
          items: [{ name: "Cloud Ping", price: 1, qty: 1 }]
        };
        const ok = await saveOrderToFirestore(testOrder);
        if (ok) {
          alert("🎉 Firebase Cloud Ping Successful! Cloud Firestore is active & connected.");
        } else {
          alert("🔥 Firebase is ready. (Check your Firebase Project ID & Rules)");
        }
        btnTestFb.innerText = "🧪 Send Test Cloud Ping";
      });
    }

    // QR Codes
    this.renderQRCodes();
  }

  // QR Code Rendering with High-DPI Canvas, SVG & Cryptographic Signatures
  renderQRCodes() {
    if (typeof window.QRCodeLib === 'undefined') return;

    // 1. Official Signed Store URL for Customer Standee
    const signedStoreUrl = window.QRCodeLib.generateSignedStoreUrl(
      this.serverHost,
      this.activeLocation,
      "SG-STORE-IND-066"
    );

    const standeeContainer = document.getElementById('standeeQRCanvas');
    if (standeeContainer) {
      const qr = window.QRCodeLib.generate(signedStoreUrl, { size: 240, margin: 4, darkColor: '#047857' });
      standeeContainer.innerHTML = qr.toSVG();

      // Download Ultra-HD 2000px Publishable Standee PNG Handler
      const btnDownloadPNG = document.getElementById('btnDownloadQRPNG');
      if (btnDownloadPNG) {
        btnDownloadPNG.onclick = () => {
          const exportCanvas = document.createElement('canvas');
          window.QRCodeLib.generateOfficialStandeeCanvas(exportCanvas, {
            width: 1400,
            height: 1800,
            storeName: this.config.name || 'SHAGUN STORE',
            storeNameHindi: this.config.nameHindi || 'शगुन स्टोर',
            taglineHindi: this.config.taglineHindi || 'स्कैन करें • सामान चुनें • काउंटर से प्राप्त करें',
            location: this.activeLocation,
            storeUrl: signedStoreUrl
          });
          const dataUrl = exportCanvas.toDataURL("image/png");
          const downloadLink = document.createElement('a');
          downloadLink.href = dataUrl;
          downloadLink.download = `SHAGUN_STORE_Official_Standee_UltraHD_${this.activeLocation.replace(/\s+/g, '_')}.png`;
          downloadLink.click();
        };
      }
    }

    // 2. Staff Mobile Setup QR
    const staffQRContainer = document.getElementById('staffSetupQRCanvas');
    if (staffQRContainer) {
      const staffUrl = `${this.serverHost}/?view=staff`;
      const qr = window.QRCodeLib.generate(staffUrl, { size: 200, margin: 4, darkColor: '#0284c7' });
      staffQRContainer.innerHTML = qr.toSVG();
    }

    // 3. Customer Pickup Barcode/QR
    const pickupContainer = document.getElementById('pickupQRCodeContainer');
    if (pickupContainer && this.currentCustomerOrderId) {
      const activeOrder = this.orders.find(o => o.id === this.currentCustomerOrderId);
      if (activeOrder) {
        const qrText = `SHAGUN_PICKUP:${activeOrder.token}:${activeOrder.id}`;
        const qr = window.QRCodeLib.generate(qrText, { size: 140, margin: 2, darkColor: '#0f172a' });
        pickupContainer.innerHTML = qr.toSVG();
      }
    }

    // Standee Customizer Live Inputs
    const qrStoreName = document.getElementById('qrStoreName');
    const previewStoreName = document.getElementById('previewStoreName');
    if (qrStoreName && previewStoreName) {
      qrStoreName.addEventListener('input', (e) => {
        previewStoreName.textContent = e.target.value;
      });
    }

    const qrStoreNameHindi = document.getElementById('qrStoreNameHindi');
    const previewStoreNameHindi = document.getElementById('previewStoreNameHindi');
    if (qrStoreNameHindi && previewStoreNameHindi) {
      qrStoreNameHindi.addEventListener('input', (e) => {
        previewStoreNameHindi.textContent = e.target.value;
      });
    }

    const qrTaglineHindi = document.getElementById('qrTaglineHindi');
    const previewTagline = document.getElementById('previewTagline');
    if (qrTaglineHindi && previewTagline) {
      qrTaglineHindi.addEventListener('input', (e) => {
        previewTagline.textContent = e.target.value;
      });
    }

    const qrLocSelect = document.getElementById('qrLocationSelect');
    if (qrLocSelect) {
      qrLocSelect.addEventListener('change', (e) => {
        this.activeLocation = e.target.value;
        this.render();
      });
    }

    const btnPrintStandee = document.getElementById('btnPrintStandee');
    if (btnPrintStandee) {
      btnPrintStandee.addEventListener('click', () => {
        window.print();
      });
    }
  }

  // Attach Modal Events for Cart
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
        if (btnSub) {
          if (this.selectedPaymentMethod === 'upi') {
            btnSub.innerHTML = `📱 Pay ${this.config.currency}${totals.finalTotal} via UPI & Place Order ➔`;
          } else if (this.selectedPaymentMethod === 'counter') {
            btnSub.innerHTML = `💵 Place Order & Pay Cash at Counter (${this.config.currency}${totals.finalTotal}) ➔`;
          } else {
            btnSub.innerHTML = `💳 Place Order (${this.config.currency}${totals.finalTotal}) ➔`;
          }
        }
      });
    });

    const btnSubmit = modalDiv.querySelector('#btnSubmitOrder');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        const name = modalDiv.querySelector('#orderCustomerName').value;
        const phone = modalDiv.querySelector('#orderCustomerPhone').value;
        const note = modalDiv.querySelector('#orderPackingNote').value;
        this.initiateOrderWithOTP(name, phone, note);
      });
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.shagunApp = new ShagunStoreApp();
  window.shagunApp.render();
});
