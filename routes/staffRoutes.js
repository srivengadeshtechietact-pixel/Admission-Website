const express = require('express');
const router = express.Router();

const {
    getStaff,
    getStaffById,
    addStaff,
    updateStaff,
    deleteStaff
} = require('../controllers/staffController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getStaff)
    .post(protect, addStaff);

router.route('/:id')
    .get(protect, getStaffById)
    .put(protect, updateStaff)
    .delete(protect, admin, deleteStaff);

module.exports = router;
