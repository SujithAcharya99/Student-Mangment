const mongoose = require('mongoose');

const Teacher = mongoose.model('Teacher',{
    name: {
        type: String,
        required: true,
        trim: true
    },
    subjects_taught: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = Teacher;
