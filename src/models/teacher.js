const mongoose = require('mongoose');


// const teacherSchema = new mongoose.Schema({
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

// const Teacher = mongoose.model('Student', teacherSchema);

module.exports = Teacher;