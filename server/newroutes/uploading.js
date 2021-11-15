require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const fs = require('fs');
const multer = require('multer');
const File = require('../newmodels/Files');
const path = require('path');
const md5 = require('md5');
const { isAuth } = require('../middleware/utils');
const admz = require('adm-zip')

const uploadfolderName = './uploads'


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


// NO MULTER UPLOAD

router.post('/fsupload', (req, res) => {
    const { name, currentChunkIndex, totalChunks } = req.query;
    const { userId } = req.query;
    // post folder name
    const POST_FOLDER_NAME = md5(userId + Date()); 

    // get chunk position is at first chunk ?
    const firstChunk = parseInt(currentChunkIndex) === 0;
    // get chunk position is at last chunk
    const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1;

    // get file ext name
    const ext = name.split('.').pop();
    // data e.x: [34, 24, 52] (array buffer sent into small parts) 
    const data = req.body.toString().split(',')[1];
    // convert data to buffer 
    const buffer = Buffer.from(data, 'base64')
    // new Buffer(data, 'base64');
    // temporary file name
    const tmpFilename = 'tmp_' + md5(name + req.ip) + '.' + ext;

    // check uploads folder exist
    if (!fs.existsSync(uploadfolderName)) {
        // if not make new folder with that name
        try {
            fs.mkdirSync(uploadfolderName, { recursive: true })
            return res.send({ success: false, message: 'Root Folder Uploads was just created. Pls re upload your file' })
        } catch (err) {
            if (err.code !== 'EEXIST') throw err
            res.send({ success: false, err });
        }
    }

    // check the post upload folder exist
    if (!fs.existsSync(uploadfolderName + '/' + POST_FOLDER_NAME)) {
        // create new
        try {
            fs.mkdirSync(uploadfolderName + '/' + POST_FOLDER_NAME, { recursive: true })
        } catch (error) {
            if (err.code !== 'EEXIST') throw err
            res.send({ success: false, err });
        }
    }


    //if the chunk is th first chunk and there is the same temp file
    // as the file was about to upload
    if (firstChunk && fs.existsSync(uploadfolderName + '/' + POST_FOLDER_NAME + '/' + tmpFilename)) {
        // remove that file
        fs.unlinkSync(uploadfolderName + '/' + POST_FOLDER_NAME + '/' + tmpFilename);
    }
    // else upload that file
    fs.appendFileSync(uploadfolderName + '/' + POST_FOLDER_NAME + '/' + tmpFilename, buffer);
    // if is the last chunk
    if (lastChunk) {
        // generate final name
        const finalFilename = md5(Date.now()).substr(0, 6) + '.' + ext;
        // change the temp file to final file
        fs.renameSync(uploadfolderName + '/' + POST_FOLDER_NAME + '/' + tmpFilename, uploadfolderName + '/' + POST_FOLDER_NAME + '/' + finalFilename);
        // send final file name
        res.json({ filepath: `${POST_FOLDER_NAME + '/' + finalFilename}`, finalFilename: finalFilename, foldername: POST_FOLDER_NAME });
    } else {
        // if still uploading
        res.json('uploading');
    }
});

// remove files

// download files
router.get('/zipdownload', async (req, res) => {
    const { foldername } = req.query;
    // initiate admz
    const zipper = new admz();
    // post folder name
    const POST_FOLDER_NAME = foldername;

    const folder2zip = fs.readdirSync(`${uploadfolderName + '/' + POST_FOLDER_NAME}`);
    // read folder
    if (!fs.existsSync(uploadfolderName + '/' + POST_FOLDER_NAME) || folder2zip.length === 0) {
        return res.send({ success: false, message: 'This Post do not have any document with it' })
    }

    folder2zip.map((files, index) => {
        zipper.addLocalFile(uploadfolderName + '/' + POST_FOLDER_NAME + '/' + folder2zip[index])
    })

    const zipname = `${POST_FOLDER_NAME}.zip`

    const data = zipper.toBuffer();

    // this is the code for downloading!
    // here we have to specify 3 things:
    // 1. type of content that we are downloading
    // 2. name of file to be downloaded
    // 3. length or size of the downloaded file!

    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${zipname}`);
    res.set('Content-Length', data.length);
    res.send(data);
})



module.exports = router
