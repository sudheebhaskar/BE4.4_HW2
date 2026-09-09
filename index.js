require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotels.models");

app.use(cors());
app.use(express.json());

initializeDatabase();


// GET all hotels
app.get("/hotels", async (req, res) => {
  try {
    const hotels = await Hotel.find();

    if (hotels.length !== 0) {
      res.json(hotels);
    } else {
      res.status(404).json({
        error: "No Hotel found"
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch hotels."
    });
  }
});


// GET hotel by rating
app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotelRating = parseFloat(req.params.hotelRating);

    const hotels = await Hotel.find({
      rating: hotelRating
    });

    if (hotels.length !== 0) {
      res.json(hotels);
    } else {
      res.status(404).json({
        error: "No Hotel found with this rating"
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch hotels."
    });
  }
});


// GET hotel by category
app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await Hotel.find({
      category: req.params.hotelCategory
    });

    if (hotels.length !== 0) {
      res.json(hotels);
    } else {
      res.status(404).json({
        error: "No Hotel found in this category"
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch hotels."
    });
  }
});


// // GET hotel by name
// app.get("/hotels/:hotelName", async (req, res) => {
//   try {
//     const hotel = await Hotel.findOne({
//       name: req.params.hotelName
//     });

//     if (hotel) {
//       res.json(hotel);
//     } else {
//       res.status(404).json({
//         error: "No Hotel found"
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       error: "Failed to fetch hotel."
//     });
//   }
// });


app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotelName = req.params.hotelName;

    console.log("Searching hotel:", hotelName);

    const hotel = await Hotel.findOne({
      name: hotelName
    });

    console.log("Hotel found:", hotel);

    if (hotel) {
      res.status(200).json(hotel);
    } else {
      res.status(404).json({
        error: "No Hotel found"
      });
    }

  } catch (error) {
    console.log("Error while fetching hotel by name:", error);

    res.status(500).json({
      error: "Failed to fetch hotel.",
      details: error.message
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});