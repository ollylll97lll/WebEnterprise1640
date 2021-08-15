require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')

const Session = require('../models/Session')
const verifyAdminToken = require('../middleware/adminToken')

//route api/session/add_session
//Add new session in to Session Model
router.post('/add_session', verifyAdminToken, async (req, res) => {
    const {session, startedDate, endedDate, topic} = req.body

    //Check if Admin
    if(req.role !== 'admin')
    return res.json({success: false, message: 'User do not have enough authority for this action'})

    //if ok
    try {
        const newSession = new Session({
            session,
            startedDate: moment(startedDate).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
            endedDate: moment(endedDate).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
            topic,
        })

        newSession.save()

        res.json({success: true, message: 'Successfully Created New Session'})
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Something wrongs' })
    }
})

//route api/session/getAll_session
// get all Session in Database
router.get('/getAll_session', async (req, res) => {
    Session.find()
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

//route api/session/edit/:id
//Edit Session
router.put('/edit/:id', async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Session.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update session information with id=${id}. Maybe session was not found!`
                });
            } else res.send({ message: "Session information was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating session information with id=" + id
            });
        });
})

module.exports = router