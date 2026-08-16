/**
 * SHAGUN STORE - Real-Time 3-Way Notification Engine (WhatsApp & SMS)
 * Automatically Formats and Dispatches Live Alerts to:
 * 1. Store Owner / Admin: +91 77955 65216
 * 2. Store Packing Staff: Active Staff on Duty
 * 3. Customer: Live SMS & WhatsApp for:
 *    - Order Confirmation
 *    - UPI Payment Verified & Bank UTR Receipt
 *    - Status Upgradations (NEW ➔ PACKING ➔ READY FOR PICKUP ➔ COMPLETED)
 *    - Complete Digital Tax Invoice
 */

export const ADMIN_PHONE = "7795565216"; // Master Owner WhatsApp Number

export class WhatsAppNotificationEngine {
  constructor(config = {}) {
    this.adminPhone = config.phone ? config.phone.replace(/[^0-9]/g, '').slice(-10) : ADMIN_PHONE;
    this.storeName = config.name || "SHAGUN STORE";
    this.storeAddress = config.address || "P.H. Road, Near Chamundi Textiles, Bettadapura, Karnataka - 571102";
    this.mapsUrl = config.mapsUrl || "https://maps.google.com/?q=Chamundi+Textiles+Bettadapura+Karnataka+571102";
  }

  // Clean phone number to 10-digit Indian standard
  cleanPhone(phone) {
    if (!phone) return '';
    const digits = phone.toString().replace(/[^0-9]/g, '');
    return digits.length > 10 ? digits.slice(-10) : digits;
  }

  // Generate URL encoded WhatsApp deep link
  getWhatsAppDeepLink(phone, message) {
    const clean = this.cleanPhone(phone);
    const text = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=91${clean}&text=${text}`;
  }

  // Generate URL encoded SMS deep link for instant native messaging
  getSmsDeepLink(phone, message) {
    const clean = this.cleanPhone(phone);
    const text = encodeURIComponent(message);
    return `sms:+91${clean}?body=${text}`;
  }

  // 1. Message for Admin / Store Owner (+91 77955 65216)
  formatAdminNewOrderMessage(order) {
    const itemsList = order.items.map((i, idx) => `  ${idx + 1}. ${i.qty}x ${i.name} (${i.variantName}) - ₹${i.price * i.qty}`).join('\n');
    const paymentBadge = order.paymentVerified 
      ? '🟢 UPI AUTO-VERIFIED & PAID' 
      : (order.paymentMethod === 'counter' ? '💵 CASH TO BE PAID AT COUNTER TABLE' : '⏳ PENDING UPI PAYMENT');
    const timeStr = new Date(order.createdAt || Date.now()).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: 'short' });

    return `🚨 *${this.storeName} - NEW STORE PICKUP ORDER RECEIVED!*
---------------------------------------
📦 *Token*: #${order.token}
⏰ *Time*: ${timeStr}
👤 *Customer*: ${order.customerName}
📞 *Phone*: ${order.phone}
📍 *Collection Desk*: ${order.location || 'Main Counter (Bettadapura)'}
⏳ *Pickup Timing*: ${order.pickupSlot || 'Express (15-20 mins)'}
💰 *Total Amount*: ₹${order.totalAmount}
💳 *Payment Mode*: ${paymentBadge}
${order.transactionId ? `🏛️ *Bank Ref (UTR)*: ${order.transactionId}\n` : ''}
📋 *ITEMS TO PACK*:
${itemsList}

${order.packingNote ? `📝 *Packing Note*: "${order.packingNote}"\n` : ''}
🔗 *Admin Dashboard*:
https://shagunstore66-sys.github.io/shagun/admin.html`;
  }

  // 2. Message for Store Packing Staff
  formatStaffPackingTicketMessage(order) {
    const checklist = order.items.map((i, idx) => `  [ ] ${idx + 1}. ${i.qty}x ${i.name} (${i.variantName})`).join('\n');
    return `👨‍🍳 *${this.storeName} - PACKING TICKET*
---------------------------------------
📦 *Token*: #${order.token}
👤 *Customer*: ${order.customerName}
📍 *Collect at*: ${order.location || 'Main Counter'}
⏳ *Pickup Timing*: ${order.pickupSlot || 'Express (15-20 mins)'}
${order.packingNote ? `📝 *Note*: ${order.packingNote}\n` : ''}
📋 *ITEMS TO PACK*:
${checklist}

🔗 *Staff Terminal*:
https://shagunstore66-sys.github.io/shagun/staff.html`;
  }

  // 3. Message for Customer: Order Confirmation & Live Tracking
  formatCustomerConfirmationMessage(order) {
    const paymentLine = order.paymentVerified
      ? '🟢 Paid via UPI'
      : (order.paymentMethod === 'counter' ? '💵 Pay ₹' + order.totalAmount + ' Cash at Counter' : '⏳ Awaiting UPI Verification');

    return `🛍️ *${this.storeName}, Bettadapura*
---------------------------------------
Namaste *${order.customerName}*!
Aapka order successfully place ho gaya hai.

📦 *Pickup Token*: *#${order.token}*
💰 *Bill Amount*: ₹${order.totalAmount} (${paymentLine})
⏱️ *Status*: 🟡 Staff Packing in Progress
📍 *Collection Point*: ${this.storeAddress}
🗺️ *Store Map*: ${this.mapsUrl}

🔗 *Live Order Tracker & Bill*:
https://shagunstore66-sys.github.io/shagun/?token=${order.token}&orderId=${order.id}

📞 Store Helpline: +91 77955 65216
🙏 Dhanyawad / ಧನ್ಯವಾದಗಳು!`;
  }

  // 4. Message for Customer: UPI Payment Success Notification & Bank UTR
  formatCustomerPaymentSuccessMessage(order, transactionId) {
    return `💳 *${this.storeName} - PAYMENT RECEIVED & CONFIRMED!*
---------------------------------------
Namaste *${order.customerName}*!
Aapka UPI payment successfully verify ho gaya hai.

🔖 *Token Number*: *#${order.token}*
💰 *Amount Paid*: ₹${order.totalAmount}
🏦 *Bank Reference (UTR)*: ${transactionId}
🟢 *Payment Status*: VERIFIED & CREDITED (Axis Bank)
📦 *Order Status*: Forwarded to Store Packing Team

📍 *Pickup Point*: ${this.storeAddress}
🔗 *Track Live Order*:
https://shagunstore66-sys.github.io/shagun/?token=${order.token}&orderId=${order.id}`;
  }

  // 5. Message for Customer: Live Order Status Upgradation (NEW -> PACKING -> READY -> COMPLETED)
  formatCustomerStatusUpgradationMessage(order, newStatus) {
    if (newStatus === 'PACKING') {
      return `📦 *${this.storeName} - ORDER PACKING IN PROGRESS*
---------------------------------------
Namaste *${order.customerName}*!
Aapka order (Token *#${order.token}*) hamare Bettadapura staff dwara pack kiya ja raha hai.

⏱️ *Pickup Slot*: ${order.pickupSlot || 'Express (15-20 mins)'}
📍 *Counter*: ${order.location || 'Main Counter (Bettadapura)'}
🔗 *Track*: https://shagunstore66-sys.github.io/shagun/?token=${order.token}&orderId=${order.id}`;
    }

    if (newStatus === 'READY') {
      return `🎉 *${this.storeName} - ORDER READY FOR PICKUP!*
---------------------------------------
Namaste *${order.customerName}*!
Aapka grocery bag (Token *#${order.token}*) ready ho chuka hai!

📍 *Collection Point*: ${this.storeAddress}
💰 *Total Amount*: ₹${order.totalAmount} (${order.paymentVerified ? '✅ Paid Online' : '💵 Pay Cash at Counter'})
${order.transactionId ? `🏛️ *Bank Ref*: ${order.transactionId}\n` : ''}
Kripya store counter par akar apna token *#${order.token}* dikhakar parcel collect karein.
🗺️ *Map*: ${this.mapsUrl}`;
    }

    if (newStatus === 'COMPLETED') {
      return this.formatCustomerInvoiceMessage(order);
    }

    return this.formatCustomerConfirmationMessage(order);
  }

  // 6. Message for Customer: Complete Itemized Digital Tax Invoice
  formatCustomerInvoiceMessage(order) {
    const timeStr = new Date(order.createdAt || Date.now()).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: 'short', year: 'numeric' });
    const itemsTable = order.items.map((i, idx) => `${idx + 1}. ${i.name} (${i.variantName})\n   Qty: ${i.qty} × ₹${i.price} = ₹${i.qty * i.price}`).join('\n');

    return `🧾 *${this.storeName} - TAX INVOICE & RECEIPT*
📍 ${this.storeAddress}
📞 Ph: +91 77955 65216 | Bettadapura - 571102
------------------------------------------
*INVOICE TOKEN*: *#${order.token}*
*Date & Time*: ${timeStr}
*Customer*: ${order.customerName} (${order.phone})
*Collection Desk*: ${order.location || 'Shagun Store Counter'}
------------------------------------------
*PARTICULARS / ITEMS*:
${itemsTable}
------------------------------------------
Subtotal: ₹${order.subtotal}
GST (5% Tax): ₹${order.tax || 0}
Express Packing Fee: FREE (₹0)
------------------------------------------
*TOTAL AMOUNT*: *₹${order.totalAmount}*
Payment Mode: ${order.paymentMethod === 'upi' ? '📱 UPI Auto-Verified' : '💵 Cash Paid on Counter Table'}
${order.transactionId ? `Bank UTR / Ref: ${order.transactionId}\n` : ''}*Status*: ✅ FULFILLED & HANDED OVER
------------------------------------------
🙏 Thank you for choosing SHAGUN STORE, Bettadapura!
Visit again: https://shagunstore66-sys.github.io/shagun/`;
  }

  // 7. Message for Staff Access Request to Admin (+91 77955 65216)
  formatStaffApprovalRequestMessage(staff) {
    return `🔐 *${this.storeName} - STAFF ACCESS REQUEST*
------------------------------------------
👨‍🍳 *Staff Name*: ${staff.name}
📞 *Mobile*: +91 ${this.cleanPhone(staff.phone)}
🏷️ *Assigned Role*: ${staff.role || 'Packing Specialist'}
🔑 *Requested PIN*: ${staff.pin}

Owner Action:
To approve or manage staff permissions, open Admin Panel:
🔗 https://shagunstore66-sys.github.io/shagun/admin.html`;
  }

  // Dispatch 3-Way Notifications
  dispatch3WayOrderAlerts(order, activeStaffList = []) {
    // 1. Direct Webhook trigger to backend server if available
    try {
      fetch('/api/notify-3way', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order,
          adminPhone: this.adminPhone,
          staffPhones: activeStaffList.map(s => s.phone).filter(Boolean)
        })
      }).catch(() => {});
    } catch (e) {}

    // 2. Prepare Direct Click-to-WhatsApp and Click-to-SMS links
    const adminLink = this.getWhatsAppDeepLink(this.adminPhone, this.formatAdminNewOrderMessage(order));
    const customerLink = this.getWhatsAppDeepLink(order.phone, this.formatCustomerConfirmationMessage(order));
    const customerSmsLink = this.getSmsDeepLink(order.phone, `SHAGUN STORE: Order #${order.token} placed for Rs.${order.totalAmount}. Track: https://shagunstore66-sys.github.io/shagun/?token=${order.token}`);
    
    return {
      adminLink,
      customerLink,
      customerSmsLink,
      adminMessage: this.formatAdminNewOrderMessage(order),
      customerMessage: this.formatCustomerConfirmationMessage(order),
      staffMessage: this.formatStaffPackingTicketMessage(order),
      invoiceMessage: this.formatCustomerInvoiceMessage(order)
    };
  }

  // Dispatch Payment Success SMS & WhatsApp
  dispatchPaymentSuccessAlerts(order, transactionId) {
    try {
      fetch('/api/notify-3way', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PAYMENT_VERIFIED',
          order,
          transactionId,
          customerPhone: order.phone
        })
      }).catch(() => {});
    } catch (e) {}

    const message = this.formatCustomerPaymentSuccessMessage(order, transactionId);
    return {
      customerLink: this.getWhatsAppDeepLink(order.phone, message),
      customerSmsLink: this.getSmsDeepLink(order.phone, `SHAGUN STORE: Payment of Rs.${order.totalAmount} verified for Order #${order.token}! Ref: ${transactionId}. Track: https://shagunstore66-sys.github.io/shagun/?token=${order.token}`)
    };
  }

  // Dispatch Status Upgradation Alerts (NEW -> PACKING -> READY -> COMPLETED)
  dispatchStatusUpgradationAlerts(order, newStatus) {
    try {
      fetch('/api/notify-3way', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'STATUS_UPDATE',
          status: newStatus,
          order,
          customerPhone: order.phone
        })
      }).catch(() => {});
    } catch (e) {}

    const message = this.formatCustomerStatusUpgradationMessage(order, newStatus);
    return {
      customerLink: this.getWhatsAppDeepLink(order.phone, message),
      customerSmsLink: this.getSmsDeepLink(order.phone, `SHAGUN STORE: Order #${order.token} is now ${newStatus}! Track: https://shagunstore66-sys.github.io/shagun/?token=${order.token}`)
    };
  }
}

export const whatsAppEngine = new WhatsAppNotificationEngine();
