const { getDatabase } = require("../utils/database")
const db = getDatabase().collection("flights");

const getDepartureFlights = async (departureDate, destination) => {
    const query = {
        $or: [
            {destcountry: destination},
            {destcity: destination}
        ],
        srccountry: "Singapore"
    }

    const options = {
        sort: {price: 1}
    }

    try {

        // find departure flights
        const cursor = db.find(query, options)

        if ((await db.countDocuments(query)) === 0) {
            return []
          }
          departureResults = []
          for await (const doc of cursor) {
            // check for depature date
            if (doc.date.toISOString().substring(0, 10) == departureDate) {
                
                // check for same price
                if (departureResults.length) {
                    if (doc.price == departureResults[0].price) {
                        departureResults.push(doc)
                    }
                }
                else {
                    departureResults.push(doc)
                }
            }
          }

          // return if empty
          if (!departureResults.length) {
            return []
          }

        return departureResults
    }
    catch (err) {
        console.log(err)
        return null
    }
}

const getReturnFlights = async (returnDate, destination) => {
    const query = {
        $or: [
            {srccountry: destination},
            {srccity: destination}
        ],
        destcountry: "Singapore"
    }

    const options = {
        sort: {price: 1}
    }

    try {

        // find return flights
        const cursor = db.find(query, options)

        if ((await db.countDocuments(query)) === 0) {
            return []
          }
          returnResults = []
          for await (const doc of cursor) {
            // check for return date
            if (doc.date.toISOString().substring(0, 10) == returnDate) {
                
                // check for same price
                if (returnResults.length) {
                    if (doc.price == returnResults[0].price) {
                        returnResults.push(doc)
                    }
                }
                else {
                    returnResults.push(doc)
                }
            }
          }

          // return if empty
          if (!returnResults.length) {
            return []
          }
        
        return returnResults
    }
    catch (err) {
        console.log(err)
        return null
    }
}

const get_flight = async (req, res) => {
    try {
        const {departureDate, returnDate, destination} = req.query
    
        // missing params
        if (departureDate == undefined || returnDate == undefined || destination == undefined) {
            res.sendStatus(400)
            return
        }

        // incorrect dates
        const dateReg = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/
        if (!departureDate.match(dateReg) || !returnDate.match(dateReg)) {
            res.sendStatus(400)
            return
        }

        const departureResults = await getDepartureFlights(departureDate, destination)
        const returnResults = await getReturnFlights(returnDate, destination)
    
        // console.log(departureResults)
        // console.log(returnResults)
    
        if (departureResults == null || returnResults == null) {
            res.sendStatus(404)
        }
    
        const result = []
        for (var d = 0; d < departureResults.length; d++) {
            for (var r = 0; r < returnResults.length; r++) {
                const d_flight = departureResults[d]
                const r_flight = returnResults[r]
                const data = {
                    "City": destination,
                    "Departure Date": departureDate,
                    "Departure Airline": d_flight.airlinename,
                    "Departure Price": d_flight.price,
                    "Return Date": returnDate,
                    "Return Airline": r_flight.airlinename,
                    "Return Price": r_flight.price
                  }
                result.push(data)
            }
        }
        // console.log(result)
        res.status(200).send(result)
    }
    catch (err) {
        res.sendStatus(404)
    }
}

module.exports = {
    get_flight
}