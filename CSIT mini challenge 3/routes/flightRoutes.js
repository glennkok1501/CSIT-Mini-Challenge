const express = require('express')
const { get_flight } = require('../controllers/flightController')
const router = express.Router()

router.get('/', get_flight)

module.exports = router