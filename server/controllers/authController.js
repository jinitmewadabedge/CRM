const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { error } = require('console');
const { permission } = require('process');

let resetToken = {};

exports.login = async (req, res) => {
    try {

        console.log("Login request body:", req.body);

        const { email, role, password } = req.body;
        console.log("Email:", email, "Role:", role, "Password:", password);

        if (!email || !role || !password) {
            return res.status(400).json({ message: 'Please enter all fields' })
        }

        const user = await User.findOne({ email, isActive: true }).select('+password').populate('role');

        console.log("Login request in DB:", email, role, password);
        console.log("User found in DB:", user);

        if (!user) {
            return res.status(401).json({ message: "Invalid User Credentials" });
        }

        if (role && user.role.name !== role) {
            return res.status(401).json({ message: "Invalid Role" });
        }

        if (user.role.name !== role) {
            return res.status(401).json({ message: "Invalid Role" });
        }

        const enteredPassword = req.body.password.trim();

        console.log("Entered Password:", password);
        console.log("Stored Hash:", user.password);

        const isMatch = await bcrypt.compare(enteredPassword, user.password);
        console.log("Compare result:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role.name },
            process.env.JWT_SECRET || 'bedge',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login Successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role.name,
                permission: user.role.permissions
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ message: "Internal Server Error", err: err.message });
    }
};

exports.forgotpassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = crypto.randomBytes(32).toString('hex');
        resetToken[token] = { userId: user._id, expires: Date.now() + 3600000 };

        const resetLink = `http://localhost:5173/resetpassword/${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Reset link sent to your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetpassword = async (req, res) => {

    const { token, password } = req.body;

    try {
        const tokenData = resetToken[token];

        if (!tokenData || tokenData.expires < Date.now()) {
            return res.status(400).json({ message: "Invalid or Expired Token" });
        }

        const user = await User.findById(tokenData.userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = password;
        user.plainPassword = password;

        await user.save();

        delete resetToken[token];

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in resetting password' });
    }
}

exports.activeUserCount = async (req, res) => {
    try {

        const activeUserCount = await User.countDocuments({ isActive: true });
        res.json({ count: activeUserCount });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

exports.users = async (req, res) => {
    try {
        const users = await User.find().select("+plainPassword").populate("role");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.addUser = async (req, res) => {
    try {
        console.log("AddUser req.body:", req.body);

        let { name, email, role, password } = req.body;

        // if (!password && plainPassword) {
        //     password = plainPassword;
        // }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        console.log("Hashing this password string:", password);

        // const roleDoc = await Role.findOne({ name: req.body.role });
        // if (!roleDoc) return res.status(400).json({ message: "Role is not found" })

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            role,
            password,
            plainPassword: password
        });

        const savedUser = await newUser.save();
        await savedUser.populate("role");
        res.status(201).json(savedUser);

    } catch (error) {
        console.error("AddUser Error:", error.message);
        res.status(400).json({ message: error.message });
    }
};


exports.updateUser = async (req, res) => {

    try {

        console.log("Incoming update body:", req.body);


        if (req.body.plainPassword) {
            req.body.password = await bcrypt.hash(req.body.plainPassword, 10);
        }
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updated);

    } catch (error) {
        console.error("Update Error:", error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// exports.bulkImportUsers = async (req, res) => {

//     try {
//         const users = req.body.users;

//         if (!Array.isArray(users) || users.length === 0) {
//             return res.status(400).json({ message: "Users must be a non-empty array" });
//         }

//         const roles = await Role.find();
//         const roleMap = {};
//         roles.forEach(r => (roleMap[r.name] = r._id.toString()));

//         const formattedUsers = users.map(u => ({
//             email: u.email,
//             plainPassword: u.plainPassword,
//             role: roleMap[u.role] || u.role
//         }));

//         const inserted = await User.insertMany(formattedUsers, { ordered: false });
//         res.status(201).json({
//             message: "Users imported successfully",
//             count: inserted.length
//         })
//     } catch (error) {
//         console.error("Bulk import error:", error);
//         res.status(500).json({ message: "Error importing users", error: err.message });
//     }
// };

exports.importUsers = async (req, res) => {
    try {

        console.log("Raw Body:", req.body);
        console.log("Users Fields:", req.body.users);

        const { users } = req.body;

        if (!users || !Array.isArray(users)) {
            console.error("Invalid format, users is:", users);
            return res.status(400).json({ message: "Invalid data format. Expected { users: [...] }", received: req.body });
        }

        const createdUsers = [];

        for (const u of users) {
            console.log("Importing User:", u);
            let role = await Role.findOne({ name: u.role });
            if (!role) {
                console.error("Role is not found:", u.role);
                return res.status(400).json({ message: `Role not found: ${u.role}` });
            }

            const hashedPassword = await bcrypt.hash(u.password, 10);

            const newUser = new User({
                email: u.email,
                password: hashedPassword,
                plainPassword: u.password,
                role: role._id
            });

            await newUser.save();
            createdUsers.push(newUser);
        }

        return res.status(201).json({
            message: "Users imported successfully",
            users: createdUsers
        });
    } catch (err) {
        console.error("Import Error:", err);
        return res.status(500).json({ message: "Server error while importing users", error: err.message });
    }
};
