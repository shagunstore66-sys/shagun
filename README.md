# Shagun Daily Mart & Grocery (शगुन मार्ट) 🛍️

A complete **QR-Powered In-Store Grocery Ordering, Secret Owner Admin & Real-Time Mobile Staff Fulfillment System** built for high-speed grocery shopping in Indian Rupees (₹ - INR).

---

## 🌟 Key Features

1. **📱 Customer Self-Ordering via QR Code**:
   - Customers scan the QR code standee at the shop entrance or counter.
   - Browse daily essentials in Indian Rupees (`₹`): Sugar (चीनी), Basmati Rice (चावल), Atta, Mustard & Sunflower Cooking Oils, Dals, Spices, Dairy, and Household staples.
   - Select custom pack sizes (e.g., 1kg, 5kg, 10kg, 25kg).
   - **Mandatory 10-digit Indian Mobile Number + SMS OTP Verification** before order placement.
   - Live Token tracker (`#TK-101`) with pickup counter status.

2. **👨‍🍳 Mobile Staff Packing Terminal (iOS & Android)**:
   - Dedicated mobile web app for store packers: `/?view=staff`.
   - Real-time **"Ding-Dong!" sound alert** whenever a new order is placed.
   - Interactive grocery checklist (`[✓] 5kg Sugar`, `[✓] 10kg Basmati Rice`, `[✓] 1L Mustard Oil`).
   - One-tap **"🔔 Mark Ready & Alert Phone"** that triggers a fanfare chime on the customer's phone when their bag is ready.
   - 80mm thermal receipt bag slip printing.

3. **🔒 Secret Owner Admin Panel (`Ctrl + Shift + Z`)**:
   - **100% Invisible from normal screens**: Only accessible via the keyboard shortcut **`Ctrl + Shift + Z`** (or `Cmd + Shift + Z` on Mac).
   - Real-time sales revenue, average order value, and top-selling staple charts.
   - Complete history of verified customer orders and phone numbers with CSV/Excel export.
   - Product catalog, price editing, and stock availability toggles.
   - Customer QR Standee Studio with high-resolution printable posters.
   - Staff Mobile Onboarding QR generator.

4. **⚡ Central REST API & Real-Time Sync**:
   - Built-in multi-device HTTP server and REST API (`/api/orders`, `/api/products`, `/api/config`).
   - Fast background live-polling (1.2s) across all Wi-Fi connected devices.

---

## 🚀 Getting Started

### 1. Run the Local Server (Windows PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File .\start-server.ps1
```

### 2. Access URLs:
- **👑 Store Owner / Laptop**: `http://localhost:3000/` *(Press `Ctrl + Shift + Z` to unlock Admin)*
- **👨‍🍳 Staff Phone (iOS / Android)**: `http://<YOUR_WIFI_IP>:3000/?view=staff`
- **🛒 Customer QR Scan**: `http://<YOUR_WIFI_IP>:3000/?view=customer`

---

## 🛠️ Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+ Modules), HTML5, Modern CSS3
- **Audio Engine**: Web Audio API Procedural Synthesizer (No external audio files required)
- **QR Engine**: Pure Vector Canvas & SVG QR Generator
- **Backend & Storage**: Centralized REST API with persistent JSON datastore
