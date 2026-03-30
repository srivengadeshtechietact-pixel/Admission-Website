const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    staffName: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, required: true, enum: ['Present', 'Absent', 'Half-Day', 'Leave'] },
    notes: { type: String, default: '' },
    addedDate: { type: String, default: () => new Date().toLocaleDateString() },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
