const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function test() {
    await mongoose.connect("mongodb://127.0.0.1:27017/failureConsultancy");
    console.log("Connected to DB");
    let user = await User.findOne({ username: 'failureconsultant' });
    console.log("User:", user);
    if (user) {
        let match = await bcrypt.compare('srifailure', user.password);
        console.log("Password Match:", match);
    }
    process.exit(0);
}
test();
