import nodemailer from 'nodemailer';

async function sendEmail(to, subject, content) {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let info = await transporter.sendMail({
        from: '"AIRED" <noreply@AIRED.com>',
        to: to,
        subject: subject,
        html: content,
    });

    console.log("Message sent: %s", info.messageId);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    const htmlContent = `
      <h2>New message from AIRED Connect</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    try {
      await sendEmail(
        "Shashanksharma.1214@gmail.com",
        "Connect from AIRED",
        htmlContent
      );

      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}