require('dotenv').config();
const nodemailer = require('nodemailer');

// Fetch user and pass from environment variables
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, 
    secure: false, // true for 465, false for other ports
    auth: {
        user: user,
        pass: pass
    }
});

module.exports = async function sendMail(to, subject, html) {
    try {
        await transporter.sendMail({
            from: user,
            to,
            subject,
            html
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
