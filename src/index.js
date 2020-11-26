// const app = require('./app');
//******************************************** */
// const express = require('express');
// require('./db/mongoose');
// // const User = require('./models/user');
// // const Task = require('./models/task');
// const userRouter = require('./routers/user');
// const taskRouter = require('./routers/task');
//************************************************** */
// const app = express();


// const port = process.env.PORT;
// const port = 3000;


// const multer = require('multer');
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {

//         // if (!file.originalname.endsWith('.pdf')) {
//         if (!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('File must be a Word Document'));
//         }

//         cb(undefined, true);
        // cb(new Error('File must be a PDF'));
        // cb(undefined, true);
        // cb(undefined, false);

//     }
// });

// const errrorMiddleware = (req, res, next) => {
//     throw new Error('from my middleware');
// }

//upload.single('upload')

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
// });




// app.use((req, res, next) => {
//     // console.log(req.method, req.path);
//     // next();
//     if (req.method === 'GET') {
//         res.send('GET request are disabled')
//     } else {
//         next();
//     }

// })

//***********maintenance mode*********** */

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon..!');
// });

//*****************************************8 */
// app.use(express.json());
// app.use(userRouter);
// app.use(taskRouter);

// app.listen(port, () => {
//     console.log('server is up on port:' + port);
// });

//const bcrypt = require('bcryptjs');

// const jwt = require('jsonwebtoken');

// const myFunction = async () => {

//     const token = jwt.sign({ _id: 'add123' }, 'thisismynewcourse', { expiresIn: '3 second'});
//     console.log(token);

//     const data = jwt.verify(token, 'thisismynewcourse');
//     console.log(data);
    // const password = 'Red12345!';
    // const hashedPassword = await bcrypt.hash(password, 8);

    // console.log(password);
    // console.log(hashedPassword);

    // const isMatch = await bcrypt.compare('Red12345!', hashedPassword);

    // console.log(isMatch);
//}

// myFunction();

// const pet = {
//     name: 'munna'
// }

// pet.toJSON = function () {
//     // console.log(this);
//     // return this;
//     return {}
// }
// console.log(JSON.stringify(pet));

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
    // const task = await Task.findById('5fb4b50f04ea241ab42c5866');
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);

    // const user = await User.findById('5fb4b40f7814cc1a420996db');
    // await user.populate('tasks').execPopulate();
    // console.log(user.tasks);
// }


// main();

const express = require('express');
require('./db/mongoose');
const Admin = require('./models/admin');
const Student = require('./models/student');
const Teacher = require('./models/teacher');
const User = require('./models/users');
const auth = require('./middleware/auth');
const path = require('path');
const hbs = require('hbs');
const bodyparser = require('body-parser');



const app = express();
const port = process.env.PORT || 3000;

// console.log(__dirname);
// console.log(path.join(__dirname, '../public'));


const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname,'../views/views');
const partialsPath = path.join(__dirname,'../views/partials')

// const viewsPath = path.join(__dirname,'../views');
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath));

app.use(express.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

// app.set('views', viewsPath);

app.get('/', async (req, res) => {
    res.render('index',{
        title : 'Login Page',
        name : 'Sujith S'
    });
 
})

app.get('/test', async (req, res) => {

    
    res.render('test',{
        title : 'Login Page',
        name : 'Sujith S'
    });
 
})

// app.get('/test2', async (req, res) => {
//     res.render('test2',{
//         title : 'Login Page',
//         body : 'Sujith S'
//     });
 
// })



app.get('/about', (req, res) => {
    res.render('about',{
        title : 'About Me',
        name : 'Sujith S'
    });
})

// app.post('/test', async (req, res) => {

//     const email = await req.body;

//     console.log(email);
//   res.send('success')
// })

//************************Login*****************88*8 */
app.get('/login', (req, res) => {

    res.render('loginandregister')
})


app.post('/login', async (req, res) => {
    // try {
    //     // const email = req.body.email;
    //     // console.log(email)
    //     const admin = await Admin.findOne({email: req.body.email, password: req.body.password});
    //     if (admin) {
           
    //         return res.send('welcome admin');
    //     }
        
    //     const user = await User.findOne({email: req.body.email, password: req.body.password});
    //     // const token = await user.generateAuToken();
    //     if (!user) {
    //         return  res.send({
    //             error : 'worng credentials'
    //         })
    //     } else {
    //         // res.send(user);
    //         res.redirect('/users');

    //     }
        
    // } catch (e) {
    //     res.status(400).send();
    // }
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
         }
         console.log(user)
        //  res.send({ user, token });
    //     Us.find({}, {}, function(e, docs) {

    //         res.render('user-list', {'userlist' : docs});

    //   });
        res.render('test2',{
            title : 'student Page',
            // body : user.name,
            user
            
        });
        //res.send(user.roll);
        // res.redirect('/user')
        }
    } catch (e) {
        res.status(400).send();
    }
    
});
//************************signup****************** */

app.post('/signup', (req,res) => {

    
        const user = new User(req.body)

        user.save().then(() =>{
            // res.status(201).send(user);
            res.redirect('/');
        }).catch((e) =>{
            res.status(400).send(e);
        });
})
//***********logout all**************** */

app.post('/users/logout', auth, async (req, res) => {
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


app.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

//************************user not assigned Page********* */

// app.get('/user', (req, res) => {
//     // const name = new User.findOne({email: req.body.email})
//     // console.log(res.send(req.user));
//     res.render('/notAssigned',{
//         title : 'Home Page',
//         user: 'user',
//         message : 'Pls wait for Admin to assigned'
//      });

// })



app.get('/user/me', auth, async (req, res) => {
    console.log('inside /users')
    res.send(req.user);
});


//*************************Admin***************** */
app.get('/admin/dashboard', async (req, res) => {

    const user = await User.find({});
    res.render('adminDashboard',{
        admin: 'Admin',
        user
})
});


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
/**************************8User**************8 */

app.post('/users', (req, res) => {
    
    const user = new User(req.body)

    user.save().then(() =>{
        // res.status(201).send(user)
        res.redirect('/admin/dashboard')
    }).catch((e) =>{
        res.status(400).send(e);
    })
});

app.get('/users', (req, res) => {
    res.render('newUser')
})

app.get('/user/delete/:id', async (req, res) => {

    const _id = req.params.id;
    console.log(_id)

    try {
        // const user = await User.findByIdAndDelete(req.user._id);
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

app.get('/user/edit/:id', async (req, res) => {
    // console.log(req.params.id)
    const _id = req.params.id;
    const user = await User.findById(_id);

    res.render('editUser',{
        user
    })
})

// router.patch('/users/:id', async (req, res) => {

    // router.patch('/users/me', auth, async (req, res) => {
app.post('/user/edit/:id', async (req, res) => {
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
        //    const user = await User.findOneAndUpdate(email, req.body, { new : true, runValidators: true});
         const user = await User.findOneAndUpdate({ _id }, req.body, { new: true })
        //    const user = await User.findById(_id);
        // console.log(user)
           
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

    // app.get('/users', (req, res) => {   
//     User.find({}).then((user) => {
//         res.send(user);
//     }).catch((e) => {
//         res.status(500).send(e);
//     })
// });

//***********************HELP******************** */
app.get('/help', (req, res) =>{
    res.render('help',{
        helptetx : 'Help Page',
        title : 'help',
        name : 'Sujith S'
    });
});
//*************************error Page************** */



app.get('*', (req, res) =>{
    // res.send('My 404 ERROR PAGE');
    res.render('404',{
     title : '404',
     name : 'Sujith S',
     errorMessage : 'Page Not Found'
 });
});






app.listen(port, () => {
    console.log('server is up on port:' + port);
});