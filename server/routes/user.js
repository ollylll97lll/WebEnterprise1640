require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')

const User = require('../models/User')