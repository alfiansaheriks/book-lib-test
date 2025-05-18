const mongoose = require('mongoose');

const rTokenSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d' 
    }
})

rTokenSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('RefreshToken', rTokenSchema);