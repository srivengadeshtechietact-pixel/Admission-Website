const Staff = require('../models/Staff');

// @desc    Get all staff members (with optional name search)
// @route   GET /api/staff
// @access  Private
const getStaff = async (req, res) => {
    try {
        const query = {};
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }
        
        const staff = await Staff.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: staff.length, data: staff });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// @desc    Get single staff member
// @route   GET /api/staff/:id
// @access  Private
const getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }
        res.status(200).json({ success: true, data: staff });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// @desc    Add new staff member
// @route   POST /api/staff
// @access  Private
const addStaff = async (req, res) => {
    try {
        const { name, email, address, aadhaarNumber, phone, workExperience, certificates, role } = req.body;

        const staffFields = {
            name, email, address, aadhaarNumber, phone, workExperience, certificates
        };

        // Only allow admin to set roles other than 'staff'
        if (role) {
            if (req.user.role === 'admin') {
                staffFields.role = role;
            } else {
                staffFields.role = 'staff';
            }
        }

        // Add creator
        staffFields.user = req.user.id;

        const staff = await Staff.create(staffFields);
        res.status(201).json({ success: true, data: staff });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Duplicate field value entered (Email or Aadhaar)' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private
const updateStaff = async (req, res) => {
    try {
        let staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }

        const updateFields = { ...req.body };

        // Ensure only admin can update the role
        if (updateFields.role && req.user.role !== 'admin') {
            delete updateFields.role;
        }

        staff = await Staff.findByIdAndUpdate(req.params.id, updateFields, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: staff });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Duplicate field value entered (Email or Aadhaar)' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private (Admin only)
const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }

        await Staff.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

module.exports = {
    getStaff,
    getStaffById,
    addStaff,
    updateStaff,
    deleteStaff
};
