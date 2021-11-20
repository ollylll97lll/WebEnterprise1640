require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const Category = require('../newmodels/Category')
const { isAuth, isAdmin, isManager } = require('../middleware/utils')
const Post = require('../newmodels/Post')
const { route } = require('./uploading')

//route api/category/add_category
//Add new category using  Model
router.post('/add_category', isAuth, isManager, async (req, res) => {
    const { name, description, startdate, enddate } = req.body
    //if ok
    const starteddate = new Date(startdate).setDate(new Date(startdate).getDate() + 1)
    // moment(startdate, 'DD-MM-YY').add(1, 'd')
    // close post
    const endeddate = new Date(enddate).setDate(new Date(enddate).getDate() + 1)
    // moment(enddate, 'DD-MM-YY').add(1, 'd')
    // close update && comment
    const closeddate = new Date(enddate).setDate(new Date(enddate).getDate() + 8)
    // moment(enddate, 'DD-MM-YY').add(8, 'd')
    try {
        const newSeason = new Category({
            name: name,
            description: description,
            startdate: starteddate,
            enddate: endeddate,
            closuredate: closeddate
        })

        newSeason.save()

        res.json({
            success: true,
            message:
            {
                ClosureDate: newSeason.closuredate,
                StartDate: newSeason.startdate,
                EndDate: newSeason.enddate
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Something wrongs' })
    }
})

//route api/category/getall
// get all Category in Database
router.get('/getall', async (req, res) => {
    Category.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving article."
            });
        });
})

//route api/category/edit/:id
//Edit Category
router.patch('/edit/:id', isAuth, isManager, async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Empty data sent. Request denied!"
        });
    }

    const id = req.params.id;

    await Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot find Category with id ${id}!`
                });
            } else res.send({ message: "Category information was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Category information"
            });
        });
})

//route api/category/deleteCategory
// Delete Category
router.delete('/deleteCategory', isAuth, isManager, async (req, res) => {
    const { CategoryId } = req.body;
    if (!CategoryId) {
        return res.status(400).json({ success: false, message: 'No data sent' })
    }

    const result = await Post.find({ categoryId: CategoryId });
    if (result.length !== 0) {
        return res.status(200).json({ success: false, message: 'There are Posts under this Tag. Abort Delete request' })
    }

    await Category.findByIdAndDelete(CategoryId).then(data => {
        if (!data) {
            return res.status(400).json({ success: false, message: 'No Category Found' })
        }
        else return res.status(200).json({ success: true, message: 'Deleted Successfully' });
    }).catch(err => {
        res.status(500).json({ success: false, message: 'Catched Error', err })
    })
})

// route api/category/getuserpostcategory
// group all user post by their categories 
// and returns only the categories which post is still ongoing
router.get('/getuserpostcategory', isAuth, async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(401).send('No userId');
    }

    const groupbyCategories = {
        $group: {
            _id: '$categoryId'
        }
    }
    const lookupcategories = {
        $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category_info'
        }
    }
    await Post.aggregate([groupbyCategories, lookupcategories]).then(data => {
        // res.send(data);
        const resdata = []
        data.map(category => {
            const closuredate = category.category_info[0].closuredate;
            // if (moment(closuredate).isBefore(new Date())) {
            if (moment(new Date()).isSameOrBefore(closuredate)) {
                resdata.push(category.category_info[0])
            }
        })
        res.send(resdata)
    })
})

module.exports = router