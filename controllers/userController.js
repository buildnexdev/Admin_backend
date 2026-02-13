const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
    console.log('Login Request Body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).json({
                status: false,
                message: "Phone number and password are required",
            });
        }

        const user = await User.findOne({
            where: {
                phoneNumber: phone,
            },
        });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        if (password !== user.password) {
            return res.status(401).json({
                status: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user.userId,
            },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "7d" }
        );

        res.status(200).json({
            status: true,
            message: "Login successful",
            token,
            data: user,
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({
            status: false,
            message: "Failed to login",
            error: error.message,
        });
    }
};
