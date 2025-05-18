const jwt = require('jsonwebtoken');

const jwt_secret = process.env.JWT_SECRET || null;
const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET || null;

const generateToken = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { userId: user._id},
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
}



module.exports = {generateToken};