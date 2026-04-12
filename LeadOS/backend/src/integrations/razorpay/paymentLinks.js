const Razorpay = require('razorpay');
const PDFDocument = require('pdfkit');
const supabase = require('../../config/supabase');

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};

const createPaymentLink = async ({ leadId, amount, description }) => {
  const rzp = getRazorpay();
  let paymentUrl = "https://mock.razorpay.com/pay/123";
  let orderId = "order_mock123";

  if (rzp) {
    try {
      const link = await rzp.paymentLink.create({
        amount: amount * 100, // in paise
        currency: "INR",
        accept_partial: false,
        description,
        customer: { name: `Lead ${leadId}`, email: `lead${leadId}@example.com`, contact: "+910000000000" },
        notify: { sms: true, email: true },
        reminder_enable: true
      });
      paymentUrl = link.short_url;
      orderId = link.id;
    } catch(err) {
      console.warn('Razorpay API failed:', err.message);
    }
  } else {
    console.warn('[MOCK RAZORPAY] Generated mock payment link');
  }

  try {
    // Only update if lead table configured
    await supabase.from('leads').update({ payment_link_url: paymentUrl }).eq('id', leadId);
  } catch(e) {}
  
  return { paymentUrl, orderId };
};

const generateInvoice = async (leadId) => {
  const doc = new PDFDocument();
  doc.text(`Invoice for Lead ${leadId}`);
  doc.end();
  
  const downloadUrl = `https://leados.com/invoices/${leadId}.pdf`;
  return downloadUrl;
};

module.exports = { createPaymentLink, generateInvoice };
