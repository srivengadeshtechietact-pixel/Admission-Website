const express = require('express');
const router = express.Router();
const { getUsers, addUser, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getUsers);
router.post('/', protect, admin, addUser);

router.route('/:id')
    .put(protect, admin, updateUserRole)
    .delete(protect, admin, deleteUser);

module.exports = router;
