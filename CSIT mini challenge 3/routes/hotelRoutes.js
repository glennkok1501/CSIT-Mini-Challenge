const express = require('express')
const { get_hotel } = require('../controllers/hotelController')
const router = express.Router()

router.get('/', get_hotel)

module.exports = router