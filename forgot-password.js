const express = require('express');
const bodyParser = require('body-parser');
const ActiveDirectory = require('activedirectory');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

// Active Directory configuration
const config = {
    url: 'ldap://your-ad-server.com', // Replace with your AD server URL
    baseDN: 'dc=yourdomain,dc=com', // Replace with your base DN
    username: 'your-ad-username', // Replace with an AD username
    password: 'your-ad-password', // Replace with the corresponding password
};

const ad = new ActiveDirectory(config);

// Forgot Password endpoint
app.post('/forgot-password', (req, res) => {
    const { email, phone, employeeId } = req.body;

    // Assuming employeeId is the username in AD
    ad.authenticate(employeeId, req.body.password, (err, auth) => {
        if (err) {
            console.error('Authentication failed:', err);
            return res.status(401).json({ message: 'Authentication failed.' });
        }
        if (auth) {
            res.json({ message: 'User validated successfully.', redirect: '/reset-password.html' });
        } else {
            res.status(401).json({ message: 'Invalid credentials.' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
