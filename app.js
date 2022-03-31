const express = require('express')
const session = require('express-session')
const async = require('hbs/lib/async')
const { getRole,getDB } = require('./databaseHandler')
const { ObjectId} = require('mongodb')


const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.set('view engine', 'hbs')

io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('user-comment',async data=>{
        const db = await getDB();
    
        const a = await db.collection('Ideas').updateOne({ _id: ObjectId(data.id)},{
            $push:{
                'comment':data.msg
            }
        })
        console.log(a)
        
        console.log(data.msg)
        console.log(data.id)
        io.emit('server-response',data)
    })
});
// io.on('connection', (socket) => {
//     console.log('user connected')
//     socket.on('user-comment',data=>{
//         io.emit('server-response',data)
//     })
// });


app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    key: 'user_id' ,
    secret: '124447yd@@$%%#', 
    cookie: { maxAge: 900000 }, 
    saveUninitialized: false, 
    resave: false }))

app.get('/index', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/', (req, res) => {
    res.render('login')
})

app.post('/login', async(req, res) => {
    const name = req.body.Username
    const pass = req.body.Password
    const role = await getRole(name, pass)
    if (role == -1) {
        res.render('login')
    } else if (role == "Admin") {
        req.session["Admin"] = {
            name: name,
            role: role
        }
        res.redirect('/admin')

    } else if (role == "Staff") {
        req.session["Staff"] = {
            name: name,
            role: role
        }
        res.redirect('/staff/staffIndex')

    } else if (role == "Coordinator") {
        req.session["Coordinator"] = {
            name: name,
            role: role
        }
        res.redirect('/coordinator')
    } else if (role == "Manager") {
        req.session["Manager"] = {
            name: name,
            role: role
        }
        res.redirect('/manager')
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('login')
})

const adminController = require('./controllers/admin')
app.use('/admin', adminController)

const staffController = require('./controllers/staff')
app.use('/staff', staffController)

const managerController = require('./controllers/manager')
app.use('/manager', managerController)

const coordinatorController = require('./controllers/coordinator')
app.use('/coordinator', coordinatorController)


const PORT = process.env.PORT || 5123
http.listen(PORT)
console.log("Server is running! " + PORT)