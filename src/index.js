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


app.get('/about', (req, res) => {
    res.render('about',{
        title : 'About Me',
        name : 'Sujith S'
    });
})

//************************Login*****************88*8 */
app.get('/login', (req, res) => {

    res.render('loginandregister')
})


app.post('/login', async (req, res) => {
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

        res.render('test2',{
            title : 'student Page',
            // body : user.name,
            user
            
        });

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
