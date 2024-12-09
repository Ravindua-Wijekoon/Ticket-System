// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup for vendors and customers
exports.signup = async (req, res) => {
    let { firstName, lastName, email, password, userType } = req.body;

    if (!['customer', 'vendor'].includes(userType)) {
        return res.status(400).json({ error: 'Invalid user type' });
    }

    try {
        // Convert email to lowercase before checking and saving
        email = email.toLowerCase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ firstName, lastName, email, password, userType });
        await user.save();
        res.status(201).json({ message: `${userType} registered successfully` });
    } catch (error) {
        console.error("Signup failed with error:", error);
        res.status(500).json({ error: 'Signup failed' });
    }
};


// Login for both vendors and customers
exports.login = async (req, res) => {
    let { email, password } = req.body;

    try {
        // Convert email to lowercase
        email = email.toLowerCase();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log("Password:", password);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, userType: user.userType, firstName: user.firstName, lastName: user.lastName },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                userType: user.userType,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login failed with error:", error);
        res.status(500).json({ error: 'Login failed' });
    }
};

