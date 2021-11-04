require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const fs = require('fs');
const multer = require('multer');
const File = require('../newmodels/Files');
const path = require('path');
const md5 = require('md5');


// local upload
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// use this if do not want to store locally
// const memstorage = multer.memoryStorage()
// const memupload = multer({ storage: memstorage })


const upload = multer({ storage });


// Uploading image to mongoDB Atlas
router.post('/uf', upload.any('files'), async function (req, res, next) {

    const { postId } = req.body;
    if (!postId) {
        res.status(404).send('Cannot find the post')
        return;
    }
    const isdocresult = await File.findOne({ postId: postId });

    // create  an array of sub documents contains the files
    const uploadfiles = new Array();
    [...req.files].forEach((file, index) => {
        const f = {
            filename: file.originalname,
            file: {
                data: fs.readFileSync(req.files[index].path),
                // use this to read from memoryStorage buffer
                // data: req.file.buffer || req.file.buffer.data ?

                contentType: req.files[index].mimetype
            }
        }
        uploadfiles.push(f);
    })

    // check document existence
    if (!isdocresult) {
        // create new
        const newfiles = new File({
            postId: postId,
            files: [...uploadfiles]
        })

        try {
            newfiles.save();
            res.status(200).send('create new doc with new files')
        } catch (error) {
            res.status(201).send(error)
        }

    }
    else {
        // update into exist doc
        try {
            isdocresult.files.push(...uploadfiles);
            isdocresult.save();
            res.status(200).send('update doc with new files')
        } catch (error) {
            res.status(201).send(error)
        }
    }
});


router.post('/gul', async (req, res) => {
    const { postId } = req.body;
    if (!postId) {
        res.status(404).send('No Post found to retrieve')
        return;
    }
    const result = await File.findOne({ postId: postId }).sort({ createdAt: 'desc' });
    res.status(200).send(result)
})


module.exports = router
