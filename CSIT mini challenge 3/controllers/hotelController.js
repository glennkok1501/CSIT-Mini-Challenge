const { getDatabase } = require("../utils/database");
const db = getDatabase().collection("hotels");

const get_hotel = async (req, res) => {
    try {
        const {checkInDate, checkOutDate, destination} = req.query
        // missing params
        if (checkInDate == undefined || checkOutDate == undefined || destination == undefined) {
            res.sendStatus(400)
            return
        }

        // incorrect dates
        const dateReg = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/
        if (!checkInDate.match(dateReg) || !checkOutDate.match(dateReg)) {
            res.sendStatus(400)
            return
        }

        const query = {
            date: {
                $gte: new Date(checkInDate),
                $lte: new Date(checkOutDate)
            },
            city: destination
        }

        const options = {
            sort: {hotelName: 1}
        }

        // find hotels between date range
        const cursor = db.find(query, options)

        const results = {}
        const prices = []
        var current = ""
        var price = 0
        for await (const doc of cursor) {
            if (current != doc.hotelName) {
                if (current != "") {
                    results[current] = price
                    prices.push(price)
                }
                current = doc.hotelName
                price = 0
            }
            price += doc.price
        }
        // console.log(results)
        // console.log(prices)

        // find cheapest hotels based on cheapest prices
        const cheapestPrice = getCheapestHotels(prices)[0]
        const cheapestHotels = []
        for (const [key, value] of Object.entries(results)) {
            if (value == cheapestPrice) {
                var data = {
                    "City": destination,
                    "Check In Date": checkInDate,
                    "Check Out Date": checkOutDate,
                    "Hotel": key,
                    "Price": value
                  }
                cheapestHotels.push(data)
            }
          }
        // console.log(cheapestHotels)
        res.status(200).send(cheapestHotels)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(404) 
    }

}

const getCheapestHotels = (prices) => {
    const swap = (items, leftIndex, rightIndex) => {
        var temp = items[leftIndex]
        items[leftIndex] = items[rightIndex]
        items[rightIndex] = temp
    }

    const partition = (items, left, right) => {
        var pivot = items[Math.floor((right + left) / 2)], i = left, j = right
        while (i <= j) {
            while (items[i] < pivot) {
                i++;
            }
            while (items[j] > pivot) {
                j--;
            }
            if (i <= j) {
                swap(items, i, j); 
                i++;
                j--;
            }
        }
        return i;
    }

    const quickSort = (items, left, right) => {
        var index;
        if (items.length > 1) {
            index = partition(items, left, right); 
            if (left < index - 1) { 
                quickSort(items, left, index - 1);
            }
            if (index < right) { 
                quickSort(items, index, right);
            }
        }
        return items;
    }

    return quickSort(prices, 0, prices.length - 1)
}

module.exports = {
    get_hotel
}