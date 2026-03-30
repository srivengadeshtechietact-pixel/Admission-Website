const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Helper to send email (Configure your real SMTP credentials here)
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_EMAIL || "test@test.com",
            pass: process.env.SMTP_PASSWORD || "12345"
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Failure Consultancy'} <${process.env.FROM_EMAIL || 'noreply@failureconsultancy.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    try {
        await transporter.sendMail(message);
    } catch(err) {
        console.log("Email could not be sent. Real credentials not set. Here is the message instead:");
        console.log("-------------------");
        console.log(options.message);
        console.log("-------------------");
    }
};

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '1d'
    });
};

// Login user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check for user email (we use username)
        let user = await User.findOne({ username });

        // Temporary: Seed admin user if it doesn't exist to allow initial login
        if (!user && username === 'failureconsultant' && password === 'srifailure') {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('srifailure', salt);
            user = await User.create({
                username: 'failureconsultant',
                email: 'admin@company.com',
                password: hashedPassword,
                role: 'admin'
            });
        }

        // Upgrade legacy admin user if role is missing/incorrect
        if (user && user.username === 'failureconsultant' && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                success: true,
                _id: user.id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (user && (await bcrypt.compare(currentPassword, user.password))) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();
            res.json({ success: true, message: 'Password updated successfully' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid current password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ success: false, message: 'There is no user with that email' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const resetUrl = `http://localhost:5000/?resetToken=${resetToken}`;
        const message = `You are receiving this email because a password reset was requested. Please go to this link to reset your password: \n\n ${resetUrl}`;

        await sendEmail({ email: user.email, subject: 'Password Reset Token', message });

        res.status(200).json({ success: true, message: 'Reset email sent (check console if SMTP unset)' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ success: false, message: 'Invalid token' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
};

// Register
const register = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });
        
        userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ success: false, message: 'Username already taken' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'staff'
        });

        res.status(201).json({
            success: true,
            _id: user.id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { login, changePassword, forgotPassword, resetPassword, register };
