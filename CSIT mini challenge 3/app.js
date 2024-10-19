const express = require('express')
const app = express();
const morgan = require('morgan')
const db = require('./utils/database')

// middleware
app.use(morgan('dev')) //logging purpose
app.use(express.urlencoded( {extended: true}))
app.use(express.json());

// imported routes
const flightRoutes = require('./routes/flightRoutes')
const hotelRoutes = require('./routes/hotelRoutes')


const SERVER_PORT = 8080
const init = async () => {
    try {
        await db.init()
        app.listen(SERVER_PORT)
        console.log(`Service is ready to listen on port ${SERVER_PORT}`)
    }
    catch(err){
        console.log(err)
    }
}

init()

// routes
app.use('/flight', flightRoutes)
app.use('/hotel', hotelRoutes)


// unknown requests
app.use((req, res) => res.send(null))