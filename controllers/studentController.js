const Student = require('../models/Student');

// GET ALL STUDENTS (with pagination)
const getStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };

        const total = await Student.countDocuments(filter);
        const students = await Student.find(filter).skip(skip).limit(limit).sort({ _id: -1 });

        res.json({
            success: true,
            count: students.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: students
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ADD STUDENT
const addStudent = async (req, res) => {
    try {
        req.body.userId = req.user.id;
        const student = await Student.create(req.body);
        res.status(201).json({ success: true, message: 'Student Added', data: student });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// UPDATE STUDENT
const updateStudent = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        if (student.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this student' });
        }

        student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, message: 'Student Updated', data: student });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// DELETE STUDENT
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        if (student.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this student' });
        }

        await Student.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Student Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

module.exports = {
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent
};
