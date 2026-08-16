/**
 * SHAGUN STORE - Real-Time 3-Way WhatsApp Notification Engine
 * Automatically Formats and Dispatches Live WhatsApp Messages to:
 * 1. Store Owner / Admin: +91 77955 65216
 * 2. Store Packing Staff: Active Staff on Duty
 * 3. Customer: Customer Mobile Number (Order confirmation + Digital Tax Invoice)
 */

export const ADMIN_PHONE = "7795565216"; // Master Owner WhatsApp Number

export class WhatsAppNotificationEngine {
  constructor(config = {}) {
    this.adminPhone = config.phone ? config.phone.replace(/[^0-9]/g, '').slice(-10) : ADMIN_PHONE;
    this.storeName = config.name || "SHAGUN STORE";
    this.storeAddress = config.address || "P.H. Road, Near Chamundi Textiles, Bettadapura - 571102";
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

  // 1. Message for Admin / Store Owner (+91 77955 65216)
  formatAdminNewOrderMessage(order) {
    const itemsList = order.items.map((i, idx) => `  ${idx + 1}. ${i.qty}x ${i.name} (${i.variantName}) - ₹${i.price * i.qty}`).join('\n');
    const paymentBadge = order.paymentVerified ? '🟢 UPI AUTO-VERIFIED & PAID' : (order.paymentMethod === 'counter' ? '💵 CASH AT PICKUP' : '⏳ PENDING PAYMENT');
    const timeStr = new Date(order.createdAt || Date.now()).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: 'short' });

    return `🚨 *${this.storeName} - NEW ORDER ALERT!*
---------------------------------------
📦 *Token*: #${order.token}
⏰ *Time*: ${timeStr}
👤 *Customer*: ${order.customerName}
📞 *Phone*: ${order.phone}
📍 *Pickup Location*: ${order.location || 'Counter'}
💰 *Total Amount*: ₹${order.totalAmount}
💳 *Payment*: ${paymentBadge}
${order.transactionId ? `🏛️ *Bank Ref (UTR)*: ${order.transactionId}\n` : ''}
📋 *ITEMS ORDERED*:
${itemsList}

${order.packingNote ? `📝 *Packing Note*: "${order.packingNote}"\n` : ''}
🔗 *Admin Master Control*:
https://shagunstore66-sys.github.io/shagun/?view=admin`;
  }

  // 2. Message for Store Packing Staff
  formatStaffPackingTicketMessage(order) {
    const checklist = order.items.map((i, idx) => `  [ ] ${idx + 1}. ${i.qty}x ${i.name} (${i.variantName})`).join('\n');
    return `👨‍🍳 *${this.storeName} - PACKING TICKET*
---------------------------------------
📦 *Token*: #${order.token}
👤 *Customer*: ${order.customerName}
📍 *Collect at*: ${order.location || 'Counter'}
${order.packingNote ? `📝 *Note*: ${order.packingNote}\n` : ''}
📋 *ITEMS TO PACK*:
${checklist}

🔗 *Staff Terminal*:
https://shagunstore66-sys.github.io/shagun/?view=staff`;
  }

  // 3. Message for Customer: Order Confirmation & Live Tracking
  formatCustomerConfirmationMessage(order) {
    return `🛍️ *${this.storeName}, Bettadapura*
---------------------------------------
Namaste *${order.customerName}*!
Aapka order successfully place ho gaya hai.

📦 *Token Number*: *#${order.token}*
💰 *Bill Amount*: ₹${order.totalAmount} (${order.paymentVerified ? 'Paid Online' : 'Pay at Counter'})
⏱️ *Current Status*: 🟡 Packing in Progress
📍 *Collection Counter*: ${this.storeAddress}

🔗 *Live Order Tracker & Bill*:
https://shagunstore66-sys.github.io/shagun/?token=${order.token}&orderId=${order.id}

Store Helpline: +91 77955 65216
🙏 Dhanyawad / ಧನ್ಯವಾದಗಳು!`;
  }

  // 4. Message for Customer: Complete Itemized Digital Tax Invoice (Sent when Order is Ready/Completed)
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
*Location*: ${order.location || 'Counter'}
------------------------------------------
*PARTICULARS / ITEMS*:
${itemsTable}
------------------------------------------
Subtotal: ₹${order.subtotal}
GST (5% Tax): ₹${order.tax || 0}
Express Packing Fee: FREE (₹0)
------------------------------------------
*TOTAL AMOUNT PAID*: *₹${order.totalAmount}*
Payment Mode: ${order.paymentMethod === 'upi' ? '📱 UPI Auto-Verified' : '💵 Cash at Counter'}
${order.transactionId ? `Bank UTR / Ref: ${order.transactionId}\n` : ''}*Status*: ✅ FULFILLED & HANDED OVER
------------------------------------------
🙏 Thank you for choosing SHAGUN STORE!
Visit again: https://shagunstore66-sys.github.io/shagun/`;
  }

  // 5. Message for Staff Access Request to Admin (+91 77955 65216)
  formatStaffApprovalRequestMessage(staff) {
    return `🔐 *${this.storeName} - STAFF ACCESS REQUEST*
------------------------------------------
👨‍🍳 *Staff Name*: ${staff.name}
📞 *Mobile*: +91 ${this.cleanPhone(staff.phone)}
🏷️ *Assigned Role*: ${staff.role || 'Packing Specialist'}
🔑 *Requested PIN*: ${staff.pin}

Owner Action:
To approve or manage staff permissions, open Admin Panel:
🔗 https://shagunstore66-sys.github.io/shagun/?view=admin`;
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

    // 2. Prepare Direct Click-to-WhatsApp links
    const adminLink = this.getWhatsAppDeepLink(this.adminPhone, this.formatAdminNewOrderMessage(order));
    const customerLink = this.getWhatsAppDeepLink(order.phone, this.formatCustomerConfirmationMessage(order));
    
    return {
      adminLink,
      customerLink,
      adminMessage: this.formatAdminNewOrderMessage(order),
      customerMessage: this.formatCustomerConfirmationMessage(order),
      staffMessage: this.formatStaffPackingTicketMessage(order),
      invoiceMessage: this.formatCustomerInvoiceMessage(order)
    };
  }
}

export const whatsAppEngine = new WhatsAppNotificationEngine();
