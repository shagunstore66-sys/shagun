// ==============================================================================
// SHAGUN STORE - Live In-Browser DevTools & Interactive Test Suite
// Provides real-time user-simulation and developer telemetry right in the browser
// ==============================================================================

(function() {
  // STRICT PRIVACY: Only activate if explicitly in dev/test mode via URL param (?dev=true or ?test=true)
  const isDevMode = window.location.search.includes('dev=true') || window.location.search.includes('test=true') || window.location.hash.includes('dev');
  if (!isDevMode) {
    return; // Complete exit - zero UI elements injected for normal customers
  }

  const logs = [];
  const networkLogs = [];

  // Capture console logs
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = function(...args) {
    originalLog.apply(console, args);
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    logs.unshift({ type: 'log', time: new Date().toLocaleTimeString(), text: msg });
    if (logs.length > 50) logs.pop();
    updateDevConsoleUI();
  };

  console.warn = function(...args) {
    originalWarn.apply(console, args);
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    logs.unshift({ type: 'warn', time: new Date().toLocaleTimeString(), text: msg });
    if (logs.length > 50) logs.pop();
    updateDevConsoleUI();
  };

  console.error = function(...args) {
    originalError.apply(console, args);
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    logs.unshift({ type: 'error', time: new Date().toLocaleTimeString(), text: msg });
    if (logs.length > 50) logs.pop();
    updateDevConsoleUI();
  };

  // Intercept Fetch for Live Network Monitor
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const url = typeof args[0] === 'string' ? args[0] : args[0].url;
    const method = (args[1] && args[1].method) ? args[1].method : 'GET';
    const startTime = performance.now();
    try {
      const response = await originalFetch.apply(this, args);
      const duration = Math.round(performance.now() - startTime);
      networkLogs.unshift({
        url,
        method,
        status: response.status,
        duration: `${duration}ms`,
        time: new Date().toLocaleTimeString()
      });
      if (networkLogs.length > 30) networkLogs.pop();
      updateDevConsoleUI();
      return response;
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      networkLogs.unshift({
        url,
        method,
        status: 'FAILED',
        duration: `${duration}ms`,
        time: new Date().toLocaleTimeString()
      });
      updateDevConsoleUI();
      throw err;
    }
  };

  let activeTab = 'user'; // 'user' or 'dev'
  let isOpen = false;

  function createDevTestWidget() {
    const existing = document.getElementById('shagunDevTestContainer');
    if (existing) return;

    const container = document.createElement('div');
    container.id = 'shagunDevTestContainer';
    container.innerHTML = `
      <style>
        #shagunDevToggleBtn {
          position: fixed;
          bottom: 85px;
          right: 14px;
          z-index: 999999;
          background: linear-gradient(135deg, #1e3a8a, #0f172a);
          color: #ffffff;
          border: 1.5px solid #93c5fd;
          border-radius: 99px;
          padding: 8px 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.76rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        #shagunDevToggleBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(30,58,138,0.5);
        }
        #shagunDevPanel {
          display: none;
          position: fixed;
          bottom: 130px;
          right: 14px;
          width: 380px;
          max-width: calc(100vw - 28px);
          max-height: 520px;
          background: #0f172a;
          color: #f8fafc;
          border: 1.5px solid #334155;
          border-radius: 16px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.6);
          z-index: 999999;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.74rem;
          overflow: hidden;
          flex-direction: column;
        }
        .dev-header {
          background: #1e293b;
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #334155;
        }
        .dev-tabs {
          display: flex;
          background: #0f172a;
          border-bottom: 1px solid #334155;
        }
        .dev-tab-btn {
          flex: 1;
          padding: 8px;
          text-align: center;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-weight: 800;
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dev-tab-btn.active {
          color: #38bdf8;
          border-bottom: 2px solid #38bdf8;
          background: rgba(56, 189, 248, 0.08);
        }
        .dev-body {
          padding: 12px;
          overflow-y: auto;
          flex: 1;
          max-height: 420px;
        }
        .dev-btn {
          width: 100%;
          padding: 8px 10px;
          background: #1e3a8a;
          color: #ffffff;
          border: 1px solid #3b82f6;
          border-radius: 6px;
          font-weight: 800;
          font-size: 0.72rem;
          cursor: pointer;
          margin-bottom: 6px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s;
        }
        .dev-btn:hover {
          background: #2563eb;
        }
        .dev-badge {
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 900;
        }
        .badge-pass { background: #166534; color: #86efac; }
        .badge-info { background: #1e3a8a; color: #93c5fd; }
        .log-entry {
          padding: 4px 6px;
          border-bottom: 1px solid #1e293b;
          font-size: 0.68rem;
          word-break: break-all;
        }
        .log-time { color: #64748b; margin-right: 4px; }
        .log-type-log { color: #cbd5e1; }
        .log-type-warn { color: #fbbf24; }
        .log-type-error { color: #f87171; }
      </style>

      <button id="shagunDevToggleBtn">
        <span>🧪</span>
        <span>DevTools & Live Test</span>
      </button>

      <div id="shagunDevPanel">
        <div class="dev-header">
          <span style="font-weight: 800; color: #38bdf8;">🛠️ Live DevTools Inspector</span>
          <button id="btnDevClose" style="background:transparent; border:none; color:#94a3b8; font-size:1rem; cursor:pointer;">✕</button>
        </div>

        <div class="dev-tabs">
          <button class="dev-tab-btn active" id="tabUserBtn">👤 User Simulation</button>
          <button class="dev-tab-btn" id="tabDevBtn">💻 Dev Telemetry</button>
        </div>

        <div class="dev-body" id="devBodyContent">
          <!-- Dynamic Content -->
        </div>
      </div>
    `;

    document.body.appendChild(container);

    const toggleBtn = document.getElementById('shagunDevToggleBtn');
    const panel = document.getElementById('shagunDevPanel');
    const closeBtn = document.getElementById('btnDevClose');
    const tabUser = document.getElementById('tabUserBtn');
    const tabDev = document.getElementById('tabDevBtn');

    toggleBtn.onclick = () => {
      isOpen = !isOpen;
      panel.style.display = isOpen ? 'flex' : 'none';
      if (isOpen) updateDevConsoleUI();
    };

    closeBtn.onclick = () => {
      isOpen = false;
      panel.style.display = 'none';
    };

    tabUser.onclick = () => {
      activeTab = 'user';
      tabUser.classList.add('active');
      tabDev.classList.remove('active');
      updateDevConsoleUI();
    };

    tabDev.onclick = () => {
      activeTab = 'dev';
      tabDev.classList.add('active');
      tabUser.classList.remove('active');
      updateDevConsoleUI();
    };
  }

  function updateDevConsoleUI() {
    const content = document.getElementById('devBodyContent');
    if (!content || !isOpen) return;

    const app = window.shagunApp;

    if (activeTab === 'user') {
      const cartCount = app ? app.cart.reduce((s, i) => s + i.qty, 0) : 0;
      const cartTotal = app ? app.getCartTotals().finalTotal : 0;

      content.innerHTML = `
        <div style="margin-bottom: 10px; background: #1e293b; padding: 8px; border-radius: 8px;">
          <div style="color: #94a3b8; font-size: 0.68rem;">LIVE STATE PREVIEW:</div>
          <div style="display: flex; justify-content: space-between; margin-top: 4px;">
            <span>🛍️ Bag: <strong>${cartCount} items (₹${cartTotal})</strong></span>
            <span>📍 Role: <strong>${app ? app.currentView.toUpperCase() : 'N/A'}</strong></span>
          </div>
        </div>

        <div style="color: #38bdf8; font-weight: 800; margin: 8px 0 6px 0;">⚡ 1-TAP LIVE ACTIONS:</div>
        
        <button class="dev-btn" id="simAddSugar">
          <span>➕</span> Add Sugar 5kg (₹235) to Bag
        </button>

        <button class="dev-btn" id="simAddOil">
          <span>🌻</span> Add Sunflower Oil 1L (₹145) to Bag
        </button>

        <button class="dev-btn" id="simOpenCart">
          <span>🛒</span> Open Review & Checkout Drawer
        </button>

        <button class="dev-btn" id="simTriggerBankGateway" style="background:#15803d; border-color:#22c55e;">
          <span>⚡</span> Live Blinkit UPI Bank Verification
        </button>

        <div style="color: #38bdf8; font-weight: 800; margin: 12px 0 6px 0;">🔀 SWITCH ROLES & VIEWS:</div>

        <button class="dev-btn" id="simSwitchStaff" style="background:#4338ca; border-color:#6366f1;">
          <span>👨‍🍳</span> Switch to Staff Packing Terminal
        </button>

        <button class="dev-btn" id="simSwitchAdmin" style="background:#991b1b; border-color:#ef4444;">
          <span>👑</span> Switch to Master Admin & Ledger
        </button>

        <button class="dev-btn" id="simSwitchCustomer" style="background:#0f766e; border-color:#14b8a6;">
          <span>🛍️</span> Switch to Customer Catalog
        </button>
      `;

      // Attach button events
      const btnSugar = document.getElementById('simAddSugar');
      if (btnSugar) btnSugar.onclick = () => {
        if (!app) return;
        const prod = app.products.find(p => p.id === 'prod_1' || p.category === 'grains') || app.products[0];
        if (prod) {
          app.addToCart(prod, 1); // 1kg or available variant
          console.log(`[USER SIMULATION] Added ${prod.name} to Cart`);
        }
      };

      const btnOil = document.getElementById('simAddOil');
      if (btnOil) btnOil.onclick = () => {
        if (!app) return;
        const prod = app.products.find(p => p.id === 'prod_10' || p.category === 'oils') || app.products[1];
        if (prod) {
          app.addToCart(prod, 0);
          console.log(`[USER SIMULATION] Added ${prod.name} to Cart`);
        }
      };

      const btnCart = document.getElementById('simOpenCart');
      if (btnCart) btnCart.onclick = () => {
        if (app) app.openCartModal();
      };

      const btnBank = document.getElementById('simTriggerBankGateway');
      if (btnBank) btnBank.onclick = () => {
        if (!app) return;
        if (app.cart.length === 0) {
          app.addToCart(app.products[0], 0);
        }
        app.selectedPaymentMethod = 'upi';
        app.executeOrderPlacement();
      };

      const btnStaff = document.getElementById('simSwitchStaff');
      if (btnStaff) btnStaff.onclick = () => {
        if (app) {
          app.currentView = 'staff';
          app.staffAuthenticated = true;
          app.render();
          console.log('[USER SIMULATION] Switched to Staff Terminal');
        }
      };

      const btnAdmin = document.getElementById('simSwitchAdmin');
      if (btnAdmin) btnAdmin.onclick = () => {
        if (app) {
          app.currentView = 'admin';
          app.adminAuthenticated = true;
          app.render();
          console.log('[USER SIMULATION] Switched to Admin Dashboard');
        }
      };

      const btnCust = document.getElementById('simSwitchCustomer');
      if (btnCust) btnCust.onclick = () => {
        if (app) {
          app.currentView = 'customer';
          app.currentCustomerOrderId = null;
          app.render();
          console.log('[USER SIMULATION] Switched to Customer Catalog');
        }
      };
    } else {
      // Dev Telemetry Tab
      content.innerHTML = `
        <div style="color: #38bdf8; font-weight: 800; margin-bottom: 6px;">📡 LIVE NETWORK TRAFFIC (${networkLogs.length}):</div>
        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 6px; max-height: 120px; overflow-y: auto; margin-bottom: 10px;">
          ${networkLogs.length === 0 ? '<div style="color:#64748b;">No network requests recorded yet</div>' : networkLogs.map(n => `
            <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-size:0.68rem;">
              <span><strong style="color:${n.status === 200 || n.status === 'SUCCESS' ? '#4ade80' : '#f87171'}">${n.method}</strong> ${n.url.split('/').slice(-2).join('/')}</span>
              <span style="color:#94a3b8;">${n.status} (${n.duration})</span>
            </div>
          `).join('')}
        </div>

        <div style="color: #38bdf8; font-weight: 800; margin-bottom: 6px;">📜 LIVE CONSOLE STREAM:</div>
        <div style="background: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 6px; max-height: 160px; overflow-y: auto;">
          ${logs.length === 0 ? '<div style="color:#64748b;">Console is clear</div>' : logs.map(l => `
            <div class="log-entry">
              <span class="log-time">${l.time}</span>
              <span class="log-type-${l.type}">${l.text}</span>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDevTestWidget);
  } else {
    createDevTestWidget();
  }
})();
