const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000; // Set the server port

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For parsing JSON data

// GET route for testing server
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Validation function for form data
function validateInput(email, phone, employeeId) {
    // Email validation using a regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Invalid email format.';
    }

    // Phone number validation (for example: 10-digit numbers)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        return 'Invalid phone number. It should be 10 digits long.';
    }

    // Employee ID validation (you can customize this pattern)
    const employeeIdRegex = /^[A-Za-z0-9]+$/; // Only alphanumeric characters allowed
    if (!employeeIdRegex.test(employeeId)) {
        return 'Invalid Employee ID format.';
    }

    // If all validations pass
    return null;
}

// Route to handle forgot password form submission
app.post('/forgot-password', (req, res) => {
    const { email, phone, employeeId } = req.body;

    // Validate inputs
    const validationError = validateInput(email, phone, employeeId);
    if (validationError) {
        return res.status(400).send(validationError); // Return validation error if any
    }

    // If validation is successful, redirect to the reset password page
    res.redirect(`/reset-password?email=${email}`);
});

// Serve the reset password page
app.get('/reset-password', (req, res) => {
    // You can send an HTML page for resetting the password
    const email = req.query.email;
    res.send(`
        <h1>Reset Password</h1>
        <form action="/reset-password" method="POST">
            <input type="hidden" name="email" value="${email}">
            <div>
                <label for="password">New Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div>
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required>
            </div>
            <button type="submit">Reset Password</button>
        </form>
    `);
});

// Route to handle password reset form submission
app.post('/reset-password', (req, res) => {
    const { email, password, confirmPassword } = req.body;

    // Basic password match check
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match.');
    }

    // TODO: Save the new password to the database (This is where you would hash and store the password securely)

    res.send('Password successfully reset!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
