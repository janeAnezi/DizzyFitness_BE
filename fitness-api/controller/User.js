const User = require('../models/User.js');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        console.log(newUser);
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not Found" });
        }
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        return res.status(200).json({
            message: "Login successful",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { signUp, Login };
