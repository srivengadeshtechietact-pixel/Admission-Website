const Attendance = require('../models/Attendance');

// GET ATTENDANCE (Filter by date optionally, default to all)
const getAttendance = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };
        const attendance = await Attendance.find(filter).sort({ _id: -1 });
        res.json({ success: true, count: attendance.length, data: attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// MARK ATTENDANCE
const markAttendance = async (req, res) => {
    try {
        req.body.userId = req.user.id;
        const attendance = await Attendance.create(req.body);
        res.status(201).json({ success: true, message: 'Attendance Marked', data: attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// UPDATE ATTENDANCE
const updateAttendance = async (req, res) => {
    try {
        let attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return res.status(404).json({ success: false, message: 'Attendance record not found' });
        }
        if (attendance.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        
        attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, message: 'Attendance Updated', data: attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// DELETE ATTENDANCE
const deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return res.status(404).json({ success: false, message: 'Attendance record not found' });
        }
        if (attendance.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await Attendance.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Attendance Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

module.exports = { getAttendance, markAttendance, updateAttendance, deleteAttendance };
