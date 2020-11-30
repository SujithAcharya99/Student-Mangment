const express = require('express');
const Admin = require('../models/admin');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const User = require('../models/users');
const auth = require('../middleware/auth');
const path = require('path');
// const hbs = require('hbs');
const bodyparser = require('body-parser');
const { title } = require('process');
const router = new express.Router();

router.use(bodyparser.urlencoded({
    extended: true
}));


router.get('/', async (req, res) => {
    res.render('index',{
        title : 'Login Page',
        name : 'Sujith S'
    });
 
})

router.get('/test', async (req, res) => {

    
    res.render('test',{
        title : 'Login Page',
        name : 'Sujith S'
    });
 
})

router.get('/about', (req, res) => {
    res.render('about',{
        title : 'About Me',
        name : 'Sujith S'
    });
})

//************************Login*****************88*8 */
router.get('/login', (req, res) => {

    res.render('loginandregister');
})



 router.post('/login', async (req, res) => {
    try {
        
        const admin = await Admin.findOne({email: req.body.email, password: req.body.password});
        if (admin) {
           
            return res.redirect('/admin/dashboard');
        } else {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuToken();
        console.log(user.roll)
         if (user.roll === 'not assigned') {
           
            res.render('notAssigned',{
                title : 'Home Page',
                user,
                message : ' Pls wait for Admin to assigned',
                name: 'Sujith S'
             });
         } else if( user.roll === 'student'){

            res.render('test2',{
                title : 'student Page',
                user
                
            });
         } else {
             
            res.render('teacherDashboard',{
                title : 'Teacher Page',
                // body : user.name,
                student,
                teacher
                
            });
         }
    
        }
    } catch (e) {
        res.status(400).send();
    }
    
});

router.get('/teacher/dashboard', async (req, res) => {
    console.log('hello')
    res.send('hello')
})
//************************signup****************** */

router.post('/signup', (req,res) => {

    
        const user = new User(req.body)

        user.save().then(() =>{
            // res.status(201).send(user);
            res.redirect('/');
        }).catch((e) =>{
            res.status(400).send(e);
        });
})
//***********logout all**************** */

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});


router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/user/me', auth, async (req, res) => {
    console.log('inside /users')
    res.send(req.user);
});


//*************************Admin***************** */
router.get('/admin/dashboard', async (req, res) => {

    const student = await User.find({roll: 'student'});
    const userTeacher = await User.find({roll: 'teacher'});
     const teacher = await Teacher.find({});
    const user = await User.find({roll: 'not assigned'});

console.log(userTeacher[0])

    res.render('adminDashboard',{
        admin: 'Admin',
        user,
        student,
        teacher
})
});

router.post('/admin', (req, res) => {
    
  const admin = new Admin(req.body)


    admin.save().then(() =>{
        res.status(201).send(admin)
    }).catch((e) =>{
        res.status(400).send(e);
    })
});

router.get('/admin', (req, res) => {
    Admin.find({}).then((admin) => {
        res.send(admin);
    }).catch((e) => {
        res.status(500).send();
    })
});

//*************************STUDENT******************************** */
router.get('/newStudent', (req, res) => {
    res.render('newStudent')
})
router.post('/student', (req, res) => {
    
    const student = new Student(req.body)

    student.save().then(() =>{
        res.status(201).send(student)
    }).catch((e) =>{
        res.status(400).send(e);
    })
});

router.get('/students', (req, res) => {
    Student.find({}).then((student) => {
        res.send(student);
    }).catch((e) => {
        res.status(500).send();
    })
});

router.get('/students/:id', (req, res) => {

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
 router.get('/newTeacher', (req, res) => {
    res.render('newTeacher')
})

 router.post('/teacher', (req, res) => {
    
    const teacher = new Teacher(req.body)
    console.log(req.body)

    teacher.save().then(() =>{
        // res.status(201).send(teacher)
        res.redirect('/admin/dashboard');
    }).catch((e) =>{
        res.status(400).send(e);
    })
});

router.get('/teachers', (req, res) => {
    Teacher.find({}).then((teacher) => {
        res.send(teacher);
    }).catch((e) => {
        res.status(500).send();
    })
});
router.get('/teacher/userEdit/:id', async (req, res) => {
    const _id = req.params.id;
    const user = await User.findById(_id);
    res.render('teacherEdit',{
    title : 'Teacher Page',
    user
})
    
});

router.get('/teacherUserList', async (req, res) => {
    await User.find({roll:'not assigned'}).then((user) => {
        if (!user) {
            return res.student(400).send() 
        } else if (user.length === 0) {
            
            return res.status(404).send({ error : 'no data found'}) 
        }
         else {
        res.render('teacherUserList', {
            user,
            name:'Sujith S'
        })}
    }).catch((e) => {
        res.status(400).send()
    })
})
router.post('/teacher/userEdit/:id', async (req, res) => {
    // console.log(req.body);
    const _id = req.params.id;
    // console.log(req.params.id)
    const updates = Object.keys(req.body);
    // console.log(updates)
    const allowedUpdates = ['name', 'email', 'roll', 'age'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));



    if (!isValidUpdate) {
        return res.status(404).send({ error : 'Invalid Update...!'})
    }
// console.log('validation oki')
    try {
     const user = await User.findOneAndUpdate({ _id }, req.body, { new: true })     
       updates.forEach((update) => user[update] = req.body[update])
        if (!user) {
            return res.status(404).send();
        }

        res.redirect('/teacherUserList');

    } catch (e) {
        res.status(400).send();
    }
})


/**************************8User**************8 */

router.post('/users', (req, res) => {
    
    const user = new User(req.body)

    user.save().then(() =>{
        // res.status(201).send(user)
        res.redirect('/admin/dashboard')
    }).catch((e) =>{
        res.status(400).send(e);
    })
});



router.get('/user/delete/:id', async (req, res) => {

    const _id = req.params.id;
    console.log(_id)

    try {
        const user = await User.findById(_id);
        console.log(user)
        if (!user) {
            return res.status(404).send();
        }

        await user.remove();
        // res.status(200).send(user);
        res.redirect('/admin/dashboard');

    } catch (e) {
        res.status(500).send();
    }


});

router.get('/user/edit/:id', async (req, res) => {
    // console.log(req.params.id)
    const _id = req.params.id;
    const user = await User.findById(_id);

    res.render('editUser',{
        user
    })
})
router.post('/user/edit/:id', async (req, res) => {
        // console.log(req.body);
        const _id = req.params.id;
        // console.log(req.params.id)
        const updates = Object.keys(req.body);
        // console.log(updates)
        const allowedUpdates = ['name', 'email', 'roll', 'age'];
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
    

    
        if (!isValidUpdate) {
            return res.status(404).send({ error : 'Invalid Update...!'})
        }
        try {
         const user = await User.findOneAndUpdate({ _id }, req.body, { new: true })
           
           updates.forEach((update) => user[update] = req.body[update])
    
        //    await req.user.save();
    
            if (!user) {
                return res.status(404).send();
            }
    
            res.redirect('/admin/dashboard');
    
        } catch (e) {
            res.status(400).send();
        }
    })


//***********************HELP******************** */
router.get('/help', (req, res) =>{
    res.render('help',{
        helptetx : 'Help Page',
        title : 'help',
        name : 'Sujith S'
    });
});

//*************************error Page************** */

router.get('*', (req, res) =>{
    // res.send('My 404 ERROR PAGE');
    res.render('404',{
     title : '404',
     name : 'Sujith S',
     errorMessage : 'Page Not Found'
 });
});

module.exports = router;
