const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getStudents, addStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { validateInput } = require('../middleware/validationMiddleware');

// Get all students (paginated)
router.get('/', protect, getStudents);

// Add student
router.post(
    '/',
    protect,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('course', 'Course is required').not().isEmpty()
    ],
    validateInput,
    addStudent
);

// Update student
router.put('/:id', protect, updateStudent);

// Delete student
router.delete('/:id', protect, deleteStudent);

module.exports = router;
