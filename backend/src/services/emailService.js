const { Resend } = require('resend');

let resend;
const getResendClient = () => {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

const buildOrderEmailHTML = (orderId, amount, items) => {
  const itemRows = (items || []).map(item => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${item.name || `Product #${item.product_id}`}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(item.price).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
      <div style="background: #2874f0; padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">✅ Order Confirmed!</h1>
      </div>
      <div style="background: #fff; padding: 24px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <p style="color: #333; font-size: 15px; margin-top: 0;">
          Thank you for your order! Here are your order details:
        </p>
        <table style="width: 100%; margin: 16px 0; background: #fafafa; border-radius: 6px; overflow: hidden;">
          <tr>
            <td style="padding: 10px 16px; color: #666; font-size: 13px;">Order ID</td>
            <td style="padding: 10px 16px; font-weight: 600; color: #2874f0; font-size: 14px;">${orderId}</td>
          </tr>
          <tr>
            <td style="padding: 10px 16px; color: #666; font-size: 13px;">Total Amount</td>
            <td style="padding: 10px 16px; font-weight: 600; color: #388e3c; font-size: 14px;">₹${Number(amount).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 16px; color: #666; font-size: 13px;">Status</td>
            <td style="padding: 10px 16px; font-size: 14px;">🟡 Pending</td>
          </tr>
        </table>

        ${items && items.length > 0 ? `
        <h3 style="color: #333; font-size: 15px; margin-bottom: 8px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="padding: 10px 12px; text-align: left; color: #555;">Product</th>
              <th style="padding: 10px 12px; text-align: center; color: #555;">Qty</th>
              <th style="padding: 10px 12px; text-align: right; color: #555;">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        ` : ''}

        <p style="color: #888; font-size: 13px; margin-top: 24px; margin-bottom: 0; text-align: center;">
          We will notify you once your order ships. 🚀
        </p>
      </div>
      <p style="color: #aaa; font-size: 11px; text-align: center; margin-top: 12px;">
        This is an automated email from Flipkart Clone. Please do not reply.
      </p>
    </div>
  `;
};

const sendOrderConfirmationEmail = async (email, orderId, amount, items) => {
  try {
    const { data, error } = await getResendClient().emails.send({
      from: 'Flipkart Clone <orders@mail.saranshh.me>',
      to: [email],
      subject: `Order Confirmed - ${orderId}`,
      html: buildOrderEmailHTML(orderId, amount, items),
    });

    if (error) {
      console.error('⚠️ Resend error:', error);
      return;
    }

    console.log('📧 Order confirmation email sent:', data.id);
  } catch (error) {
    // Log but NEVER throw — order must succeed even if email fails
    console.error('⚠️ Failed to send order confirmation email:', error.message);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
};
