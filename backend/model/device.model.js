const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    name: String,
    macAddress: String,
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

DeviceSchema.pre('save', function(next) {
    var now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports = mongoose.model('Device', DeviceSchema);
