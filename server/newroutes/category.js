require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')

const SeasonTopic = require('../models/SeasonTopic')
const Category = require('../newmodels/Category')
const { isAuth, isAdmin } = require('../middleware/utils')

//route api/category/add_category
//Add new category using  Model
router.post('/add_category', isAuth, isAdmin, async (req, res) => {
    const { name, description, startdate, enddate } = req.body
    //if ok
    const starteddate = moment(startdate, 'DD-MM-YY').add(1,'d')
    const endeddate = moment(enddate, 'DD-MM-YY').add(1,'d')
    const closeddate = moment(enddate, 'DD-MM-YY').add(8,'d')
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
                EndDate: newSeason.enddate}
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
router.put('/edit/:id', async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Empty data sent. Request denied!"
        });
    }

    const id = req.params.id;

    Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

module.exports = router