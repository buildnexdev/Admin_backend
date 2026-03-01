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

        console.log(`[LOGIN TRACE] Attempting to find user with phone: ${phone}`);
        const user = await User.findOne({
            where: {
                phoneNumber: phone,
            },
        });
        console.log(`[LOGIN TRACE] Query completed. User found: ${user ? 'Yes' : 'No'}`);
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

        // Plain object with all user fields; exclude password from response
        const plain = user.get ? user.get({ plain: true }) : user.toJSON ? user.toJSON() : user;
        const { password: _p, ...userDetails } = plain;

        console.log(`[LOGIN TRACE] Successful login for user: ${user.name}`);
        res.status(200).json({
            status: true,
            message: "Login successful",
            token,
            data: {
                userId: userDetails.userId,
                name: userDetails.name,
                phoneNumber: userDetails.phoneNumber,
                companyID: userDetails.companyID,
                location: userDetails.location,
                isActive: userDetails.isActive,
                createdOn: userDetails.createdOn,
                updatedOn: userDetails.updatedOn,
                role: userDetails.role,
                category: userDetails.category,
            },
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
