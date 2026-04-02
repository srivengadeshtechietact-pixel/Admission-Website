const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars if any
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connection
const mongoUri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/failureConsultancy";
mongoose.connect(mongoUri)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const userRoutes = require('./routes/userRoutes');
const staffRoutes = require('./routes/staffRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/staff', staffRoutes);

// Serve Frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Serve Admin Default (Optional: can be removed in production)
app.get("/seed-admin", async (req, res) => {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    try {
        const user = await User.findOne({ username: 'failureconsultant' });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('srifailure', salt);
            await User.create({ username: 'failureconsultant', email: 'admin@company.com', password: hashedPassword });
            res.send('Admin user created (failureconsultant / srifailure)');
        } else {
            res.send('Admin user already exists');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// START SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
