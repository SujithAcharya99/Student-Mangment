const mongoose = require('mongoose');

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

module.exports = Admin;
