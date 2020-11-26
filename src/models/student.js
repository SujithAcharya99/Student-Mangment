const mongoose = require('mongoose');

// const studentSchema = new mongoose.Schema({
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

// const Student = mongoose.model('Student', adminSchema);

module.exports = Student;