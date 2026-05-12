import nodemailer from 'nodemailer';

export async function sendOrderEmail(customerName: string, orderData: any) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn("Email notification skipped: Missing EMAIL_USER or EMAIL_PASS");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });

  const itemsList = orderData.items && orderData.items.length > 0
    ? orderData.items.map((item: any) => `<li>${item.name || 'Product'} (x${item.quantity || 1}) - ₹${item.price}</li>`).join('')
    : '<li>Single Item Order</li>';

  const mailOptions = {
    from: `"RS Fancy Coverings" <${user}>`,
    to: process.env.EMAIL_TO || user, // Can be a comma-separated list
    subject: `New Order Received from ${customerName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 20px;">
        <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">New Order Details</h2>
        
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Phone:</strong> ${orderData.phone}</p>
        <p><strong>Address:</strong> ${orderData.address}, ${orderData.pincode}</p>
        <p><strong>Landmark:</strong> ${orderData.landmark || 'N/A'}</p>
        <p><strong>Order Type:</strong> ${orderData.orderType}</p>
        
        <h3 style="margin-top: 20px;">Items Ordered:</h3>
        <ul>
          ${itemsList}
        </ul>
        
        <p style="font-size: 1.2em; font-weight: bold; margin-top: 20px; color: #d4af37;">
          Total Price: ₹${orderData.totalPrice}
        </p>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #6b7280;">This is an automated notification from your RS Fancy Coverings website.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order notification email sent successfully.");
  } catch (error) {
    console.error("Failed to send order email:", error);
  }
}
