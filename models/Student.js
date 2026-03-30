const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    parent: String,
    address: String,
    notes: String,
    course: { type: String, required: true },
    photo: String,
    payment: { type: String, default: 'Pending' },
    addedDate: { type: String, default: () => new Date().toLocaleDateString() },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Student', studentSchema);
