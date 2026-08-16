/**
 * SHAGUN STORE - 0-Latency Real-Time Cross-Device Cloud Sync Engine
 * Uses Server-Sent Events (SSE) & WebSocket Cloud Pub/Sub Broker (ntfy.sh)
 * Connects Customer Phones, Staff Phones (iOS & Android), and Owner Admin with 0ms Latency.
 */

const CLOUD_SYNC_TOPIC = 'shagun_store_orders_bettadapura_live_v1';
const CLOUD_PUBLISH_URL = `https://ntfy.sh/${CLOUD_SYNC_TOPIC}`;
const CLOUD_SSE_URL = `https://ntfy.sh/${CLOUD_SYNC_TOPIC}/sse`;

export class RealtimeCloudSync {
  constructor(appInstance) {
    this.app = appInstance;
    this.eventSource = null;
    this.connected = false;
    this.reconnectTimer = null;
  }

  // Start real-time listener for incoming orders and status updates
  startListening() {
    if (this.eventSource) {
      try { this.eventSource.close(); } catch (e) {}
    }

    try {
      this.eventSource = new EventSource(CLOUD_SSE_URL);

      this.eventSource.onopen = () => {
        this.connected = true;
        console.log("⚡ [Cloud Sync] Connected to Real-Time Cloud Orders Broker");
      };

      this.eventSource.onmessage = (event) => {
        try {
          const rawData = JSON.parse(event.data);
          if (rawData && rawData.message) {
            const payload = typeof rawData.message === 'string' ? JSON.parse(rawData.message) : rawData.message;
            this.handleIncomingCloudMessage(payload);
          }
        } catch (err) {
          // Non-JSON or keep-alive message
        }
      };

      this.eventSource.onerror = () => {
        this.connected = false;
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // Auto reconnect after 3 seconds
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => this.startListening(), 3000);
      };
    } catch (e) {
      console.warn("SSE connection error:", e);
    }
  }

  // Handle incoming message from Cloud
  handleIncomingCloudMessage(data) {
    if (!data || !data.type) return;

    // 1. NEW ORDER CREATED ON ANY CUSTOMER PHONE
    if (data.type === 'NEW_ORDER' && data.order) {
      const order = data.order;
      const exists = this.app.orders.some(o => o.id === order.id);

      if (!exists) {
        this.app.orders.unshift(order);
        this.app.lastKnownOrderIds.add(order.id);
        this.app.saveOrders();

        // 🔔 Pop up Flashing Order Alert Modal & Ring Continuous Alarm on Staff / Admin Phones
        if (this.app.currentView === 'staff' || this.app.currentView === 'admin' || this.app.currentView === 'split') {
          if (typeof this.app.openIncomingOrderModal === 'function') {
            this.app.openIncomingOrderModal(order);
          } else if (typeof sounds !== 'undefined' && sounds) {
            sounds.startOrderAlarmLoop();
          }
        }

        // Show Instant Toast Banner
        this.app.showToastNotification(`🚨 NEW ORDER #${order.token} received! (${this.app.config.currency}${order.totalAmount})`);
        this.app.render();
      }
    }

    // 2. ORDER STATUS UPDATED (e.g. PACKING, READY, COMPLETED)
    else if (data.type === 'ORDER_UPDATED' && data.order) {
      const updatedOrder = data.order;
      const idx = this.app.orders.findIndex(o => o.id === updatedOrder.id);

      if (idx !== -1) {
        const prevStatus = this.app.orders[idx].status;
        this.app.orders[idx] = updatedOrder;
        this.app.saveOrders();

        // If Customer is watching this order and it becomes READY:
        if (this.app.currentCustomerOrderId === updatedOrder.id) {
          if (prevStatus !== 'READY' && updatedOrder.status === 'READY') {
            if (typeof sounds !== 'undefined' && sounds) {
              sounds.playOrderReadyFanfare();
            }
            if (navigator.vibrate) {
              navigator.vibrate([300, 100, 300, 100, 500]);
            }
            this.app.showToastNotification(`🎉 Your order #${updatedOrder.token} is Packed & Ready for Pickup!`);
          }
        }

        this.app.render();
      }
    }

    // 3. PAYMENT CONFIRMED / VERIFIED
    else if (data.type === 'PAYMENT_VERIFIED' && data.orderId) {
      const ord = this.app.orders.find(o => o.id === data.orderId);
      if (ord) {
        ord.paymentVerified = true;
        ord.paymentStatus = '🟢 Verified & Paid Online';
        ord.transactionId = data.transactionId || ord.transactionId;
        this.app.saveOrders();

        if (this.app.currentView === 'staff' || this.app.currentView === 'admin') {
          if (typeof sounds !== 'undefined' && sounds) {
            sounds.playPaymentSuccessSoundbox(ord.totalAmount, this.app.currentLang);
          }
        }
        this.app.render();
      }
    }
  }

  // Broadcast a New Order to all Staff and Admin Phones instantly
  async broadcastNewOrder(order) {
    try {
      const payload = {
        type: 'NEW_ORDER',
        order: order,
        timestamp: Date.now()
      };

      await fetch(CLOUD_PUBLISH_URL, {
        method: 'POST',
        headers: {
          'Title': `🚨 SHAGUN STORE: New Order #${order.token} (₹${order.totalAmount})`,
          'Priority': 'urgent',
          'Tags': 'bell,package,shopping_trolley'
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("Cloud broadcast error:", e);
    }
  }

  // Broadcast Order Status Update across all devices
  async broadcastOrderUpdate(order) {
    try {
      const payload = {
        type: 'ORDER_UPDATED',
        order: order,
        timestamp: Date.now()
      };

      await fetch(CLOUD_PUBLISH_URL, {
        method: 'POST',
        headers: {
          'Title': `📦 Order #${order.token} Status: ${order.status}`,
          'Priority': 'high',
          'Tags': 'package'
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {}
  }

  // Broadcast Payment Verification across devices
  async broadcastPaymentVerified(orderId, transactionId) {
    try {
      const payload = {
        type: 'PAYMENT_VERIFIED',
        orderId: orderId,
        transactionId: transactionId,
        timestamp: Date.now()
      };

      await fetch(CLOUD_PUBLISH_URL, {
        method: 'POST',
        headers: {
          'Title': `💳 Payment Verified for Order`,
          'Priority': 'high',
          'Tags': 'moneybag,white_check_mark'
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {}
  }
}
