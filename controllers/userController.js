const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET ALL USERS (Admin Only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ _id: -1 });
        res.json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ADD USER (Admin Only)
const addUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }
        
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with that email' });
        }
        
        userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Username already taken' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({ success: true, data: { _id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// UPDATE USER ROLE (Admin Only)
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({ success: false, message: 'Please provide a role' });
        }
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ success: true, data: { _id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// DELETE USER (Admin Only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.username === 'failureconsultant') {
            return res.status(400).json({ success: false, message: 'Cannot delete the main admin account' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

module.exports = { getUsers, addUser, updateUserRole, deleteUser };
