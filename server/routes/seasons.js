require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')

const SeasonTopic = require('../models/SeasonTopic')
const { isAuth, isAdmin } = require('../middleware/utils')

//route api/season/add_seasontopic
//Add new season Topic using SeasonTopic Model
router.post('/add_seasontopic',isAuth, isAdmin , async (req, res) => {
    const {season, startedDate, endedDate, topic} = req.body
    //if ok
    try {
        const newSeason = new SeasonTopic({
            season,
            startedDate: moment(startedDate).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
            endedDate: moment(endedDate).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
            topic,
        })

        newSeason.save()

        res.json({success: true, message: `Successfully Added New season's Topic`})
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Something wrongs' })
    }
})

//route api/season/getAll_season
// get all Seasons in Database
router.get('/getAll_season', async (req, res) => {
    Season.find()
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

//route api/season/edit/:id
//Edit Season
router.put('/edit/:id', async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    SeasonTopic.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update season information with id=${id}. Maybe season was not found!`
                });
            } else res.send({ message: "Season information was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating season information with id=" + id
            });
        });
})

module.exports = router