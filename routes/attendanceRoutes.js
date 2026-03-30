const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getAttendance, markAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { validateInput } = require('../middleware/validationMiddleware');

router.get('/', protect, getAttendance);

router.post(
    '/',
    protect,
    [
        check('staffName', 'Staff Name is required').not().isEmpty(),
        check('status', 'Status is required').not().isEmpty(),
        check('date', 'Date is required').not().isEmpty()
    ],
    validateInput,
    markAttendance
);

router.put('/:id', protect, updateAttendance);

router.delete('/:id', protect, deleteAttendance);

module.exports = router;
