const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    aadhaarNumber: {
        type: String,
        required: [true, 'Please add Aadhaar number'],
        unique: true
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    workExperience: {
        type: String,
        required: [true, 'Please add work experience']
    },
    certificates: {
        type: [String],
        default: []
    },
    role: {
        type: String,
        enum: ['staff', 'manager', 'admin'],
        default: 'staff'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Staff', staffSchema);
