const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Assuming you have a way to store users and their passwords
const users = {}; // This should be replaced with your actual user database

const app = express();
const PORT = 4000; // Your server port

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // To parse JSON data

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ganeshap2503@gmail.com', // Sender's email address
        pass: 'ganesh7797', // Sender's email password or app password
    },
});

// Route to handle password reset
app.post('/reset-password', (req, res) => {
    const { email, password } = req.body; // Get email and new password from the request

    // Check if the user exists
    if (!users[email]) {
        return res.status(400).send('User not found.');
    }

    // Reset the password (you should hash the password before storing it in a real application)
    users[email].password = password; // Update the password
    console.log(`Password for ${email} has been reset to: ${password}`);

    // Send a confirmation email (optional)
    const mailOptions = {
        from: 'ganeshap2503@gmail.com',
        to: email,
        subject: 'Password Reset Successful',
        text: 'Your password has been successfully reset.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending confirmation email.');
        }
        console.log('Confirmation email sent:', info.response);
        res.send('Password successfully reset.');
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
