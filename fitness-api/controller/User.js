const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
        await newUser.save();
        
        // Create token
        const token = jwt.sign(
            { id: newUser._id }, 
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        return res.status(201).json({ 
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
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

        // Create token
        const token = jwt.sign(
            { id: existingUser._id }, 
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};
module.exports = { signUp, Login };