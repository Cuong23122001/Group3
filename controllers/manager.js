const express = require('express')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
const { getDB, insertObject, deleteCategory } = require('../databaseHandler')
const { requireManager } = require('../projectLibrary')

const router = express.Router()

router.use(express.static('public'))



router.get('/', async(req, res) => {

    const dbo = await getDB();
    const allCategory = await dbo.collection("Category").find({}).toArray();
    res.render('manager/category', { data: allCategory })
})

router.get('/addCategory', async(req, res) => {
    res.render("manager/addCategory")
})

router.post('/addCategory', async(req, res) => {
    const name = req.body.txtName;
    const description = req.body.txtDescription;
    const objectToCategory = {
        name: name,
        description: description
    }
    insertObject("Category", objectToCategory)
    res.redirect("/manager/")
})

router.get('/editCategory', async(req, res) => {
    const id = req.query.id

    const dbo = await getDB();
    const allCategory = await dbo.collection("Category").findOne({ _id: ObjectId(id) })
    res.render("manager/editCategory", { data: allCategory })
})

router.post('/updateCategory', async(req, res) => {
    const name = req.body.txtName;
    const description = req.body.txtDescription;
    const id = req.body.ID;

    const objectToObject = {
        $set: {
            name: name,
            description: description
        }
    }

    const filter = { _id: ObjectId(id) }
    const dbo = await getDB()
    await dbo.collection("Category").updateOne(filter, objectToObject)

    res.redirect('/manager/')
})

router.get('/deleteCategory', async(req, res) => {
    const id = req.query.id;
    await deleteCategory(id);
    res.redirect("/manager/")
})

//Terms and Conditions:

// router.get('/TaC', async(req, res) => {
//     res.render("staff/TaC")
// })

//Ideas
router.get('/allIdeas', requireManager, async(req, res) => {
    const dbo = await getDB()
    const ideas = await dbo.collection("Ideas").find({}).toArray()
    res.render("manager/ideas", { i: ideas })
})

// Dashboard
router.get('/dashboard', async(req, res) => {
    res.render("manager/dashboard")
})

//Most like, dislike, view

router.get('/mostView', async(req, res) => {

    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ view: -1 }).toArray()
    res.render("manager/ideas", { i: allIdeas })
})

router.get('/mostLike', async(req, res) => {
    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ like: -1 }).toArray()
    res.render("manager/ideas", { i: allIdeas })
})
router.get('/mostDislike', async(req, res) => {
    const dbo = await getDB();
    const allIdeas = await dbo.collection("Ideas").find().sort({ dislike: -1 }).toArray()
    res.render("manager/ideas", { i: allIdeas })
})
module.exports = router;