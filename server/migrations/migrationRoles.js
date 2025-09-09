require('dotenv').config({ path: __dirname + "/../.env" });
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        const roles = await Role.find({});
        const roleMap = {};
        roles.forEach(r => {
            roleMap[r.name] = r._id;
        });

        const users = await User.find({});
        for (let user of users) {
            if (typeof user.role === "string" && roleMap[user.role]) {
                user.role = roleMap[user.role];
                await user.save();
                console.log(`Updated user ${user.email} -> role ${user.role}`);
            }
        }

        console.log("Migration completed!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
