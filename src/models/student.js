const mongoose = require('mongoose');

const Student = mongoose.model('Student',{
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

module.exports = Student;
