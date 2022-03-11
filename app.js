const express = require('express')
const session = require('express-session')
const { checkUserRole } = require('./databaseHandler')
const { requiresLogin } = require('./projectLibrary')

const app = express()

app.set('view engine', 'hbs')

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 900000 }, saveUninitialized: false, resave: false }))

app.get('/manager', (req, res) => {
    res.render('manager')
})

app.get('/addCategory', (req, res) => {
    res.render('addCategory')
})

app.get('/', (req, res) => {
    res.render('login')
})

app.post('/login', async(req, res) => {
    const user = req.body.Username
    const pass = req.body.Password
    if (user == 'admin' && pass == '123') {
        res.render('index')
    } else {
        res.redirect('/')
    }
})

// app.post('/login', async(req, res) => {
//     const name = req.body.txtName
//     const pass = req.body.txtPass
//     const role = await checkUserRole(name, pass)
//     if (role == -1) {
//         res.render('login')
//     } else if (role == "Admin") {
//         req.session["Admin"] = {
//             name: name,
//             role: role
//         }
//         res.redirect('/admin')

//     } else if (role == "Staff") {
//         req.session["Staff"] = {
//             name: name,
//             role: role
//         }
//         res.redirect('/staff')

//     } else if (role == "Trainee") {
//         req.session["Trainee"] = {
//             name: name,
//             role: role
//         }
//         res.redirect('/trainee')
//     } else if (role == "Trainer") {
//         req.session["Trainer"] = {
//             name: name,
//             role: role
//         }
//         res.redirect('/trainer')
//     }
// })

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('login')
})

const adminController = require('./controllers/admin')
const async = require('hbs/lib/async')
app.use('/admin', adminController)

// const staffController = require('./controllers/staff')
// app.use('/staff', staffController)

// const managerController = require('./controllers/manager')
// app.use('/manager', managerController)

// const coordinatorController = require('./controllers/coordinator')
// app.use('/coordinator', coordinatorController)


const PORT = process.env.PORT || 5123
app.listen(PORT)
console.log("Server is running! " + PORT)