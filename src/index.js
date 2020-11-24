const express = require('express');
require('./db/mongoose');
const Admin = require('./models/admin');
const Student = require('./models/student');
const Teacher = require('./models/teacher');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


//*************************Admin***************** */
app.post('/admin', (req, res) => {
    
    const admin = new Admin(req.body)

    admin.save().then(() =>{
        res.status(201).send(admin)
    }).catch((e) =>{
        res.status(400).send(e);
    })
});

app.get('/admin', (req, res) => {
    Admin.find({}).then((admin) => {
        res.send(admin);
    }).catch((e) => {
        res.status(500).send();
    })
});

//*************************STUDENT******************************** */
app.post('/student', (req, res) => {
    
    const student = new Student(req.body)

    student.save().then(() =>{
        res.status(201).send(student)
    }).catch((e) =>{
        res.status(400).send(e);
    })
});

app.get('/students', (req, res) => {
    Student.find({}).then((student) => {
        res.send(student);
    }).catch((e) => {
        res.status(500).send();
    })
});

app.get('/students/:id', (req, res) => {

    const _id= req.params.id;
    
    Student.findById(_id).then((student) => {
        if (!student) {
            return res.status(404).send();
        }
        res.send(student);
    }).catch((e) => {
        res.status(500).send();
    })
});

 // ***************TEACHER ************************/
app.post('/teacher', (req, res) => {
    
    const teacher = new Teacher(req.body)

    teacher.save().then(() =>{
        res.status(201).send(teacher)
    }).catch((e) =>{
        res.status(400).send(e);
    })
});

app.get('/teachers', (req, res) => {
    Teacher.find({}).then((teacher) => {
        res.send(teacher);
    }).catch((e) => {
        res.status(500).send();
    })
});


app.listen(port, () => {
    console.log('server is up on port:' + port);
});
