const mongoose = require('mongoose');

// const adminSchema = new mongoose.Schema({
const Admin = mongoose.model('Admin', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    }
});

// const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;