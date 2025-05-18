const User = require('../models/user.model')
const RefreshToken = require('../models/rToken.model');
const BlacklistToken = require('../models/blacklistToken.model');
const jwtUtils = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = new User({ email, password });
        await user.save();
        const { accessToken, refreshToken: rToken } = jwtUtils.generateToken(user);
        const refreshToken = new RefreshToken({
            userId: user._id,
            refreshToken: rToken,
        });
        await refreshToken.save();

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                },
                token: {
                    accessToken,
                    refreshToken: rToken
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server error', error: error.message });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const oldToken = await RefreshToken.findOne({ userId: user._id });
        if (oldToken) {
            await BlacklistToken.create({ userId: user._id, token: "undefined_access_token", refreshToken: oldToken.refreshToken });
            await RefreshToken.deleteOne({ userId: user._id });
        }

        const { accessToken, refreshToken: rToken } = jwtUtils.generateToken(user);
        const refreshToken = new RefreshToken({
            userId: user._id,
            refreshToken: rToken,
        });
        await refreshToken.save();

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token: {
                accessToken,
                refreshToken: rToken
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', error });
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Access token required' });
        }

        const decoded = jwt.decode(token);
        if (!decoded?.userId) {
            return res.status(403).json({ success: false, message: 'Invalid access token' });
        }

        const userId = decoded.userId;

        const storedToken = await RefreshToken.findOne({ userId });
        if (!storedToken) {
            return res.status(403).json({ success: false, message: 'No refresh token found' });
        }

        const blacklistToken = await BlacklistToken.findOne({
            token,
        });

        if (blacklistToken !== null) {
            return res.status(403).json({ success: false, message: 'Token is blacklisted' });
        } else {
            await BlacklistToken.create({ userId, token, refreshToken: storedToken.refreshToken });
        }

        jwt.verify(storedToken.refreshToken, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { userId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        storedToken.refreshToken = newRefreshToken;
        await storedToken.save();

        return res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
    }
};

module.exports = {
    register,
    login,
    refreshToken
}