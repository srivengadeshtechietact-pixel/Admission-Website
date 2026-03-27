const mongoose = require('mongoose');
const User = require('./models/User');

async function testUsers() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/failureConsultancy");
        console.log("Connected to MongoDB");

        const users = await User.find({});
        console.log("Users in DB:", users.map(u => ({ id: u._id, username: u.username, role: u.role })));

        if (users.length > 0) {
            // Find one to test update
            let testUser = users.find(u => u.username !== 'failureconsultant');
            if (testUser) {
                console.log(`Testing UPDATE on user: ${testUser.username} (${testUser._id})`);
                
                // Manually trigger the Mongoose operations we use in userController
                const newRole = testUser.role === 'staff' ? 'manager' : 'staff';
                
                // Using findByIdAndUpdate
                const updated = await User.findByIdAndUpdate(testUser._id, { role: newRole }, { new: true });
                console.log(`Updated role to: ${updated.role} (Expected: ${newRole})`);
                
                // Test delete
                console.log(`Testing DELETE on user: ${testUser.username}`);
                await User.findByIdAndDelete(testUser._id);
                
                const checkDeleted = await User.findById(testUser._id);
                console.log("Is deleted?", checkDeleted === null);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}
testUsers();
