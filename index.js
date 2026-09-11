require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotels.models");

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();


// =====================================================
// 1. CREATE A NEW HOTEL
// =====================================================

app.post("/hotels", async (req, res) => {
  try {
    const hotel = new Hotel(req.body);

    const savedHotel = await hotel.save();

    res.status(201).json({
      message: "Hotel added successfully",
      hotel: savedHotel,
    });
  } catch (error) {
    console.log("Error while creating hotel:", error);

    res.status(500).json({
      error: "Failed to add hotel",
      message: error.message,
    });
  }
});


// =====================================================
// 2. GET ALL HOTELS
// =====================================================

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await Hotel.find();

    if (hotels.length !== 0) {
      res.status(200).json(hotels);
    } else {
      res.status(404).json({
        error: "No Hotel found",
      });
    }
  } catch (error) {
    console.log("Error while fetching hotels:", error);

    res.status(500).json({
      error: "Failed to fetch hotels",
      message: error.message,
    });
  }
});


// =====================================================
// 3. GET HOTELS BY RATING
// =====================================================

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotelRating = parseFloat(req.params.hotelRating);

    const hotels = await Hotel.find({
      rating: hotelRating,
    });

    if (hotels.length !== 0) {
      res.status(200).json(hotels);
    } else {
      res.status(404).json({
        error: "No Hotel found with this rating",
      });
    }
  } catch (error) {
    console.log("Error while fetching hotels by rating:", error);

    res.status(500).json({
      error: "Failed to fetch hotels",
      message: error.message,
    });
  }
});


// =====================================================
// 4. GET HOTELS BY CATEGORY
// =====================================================

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await Hotel.find({
      category: req.params.hotelCategory,
    });

    if (hotels.length !== 0) {
      res.status(200).json(hotels);
    } else {
      res.status(404).json({
        error: "No Hotel found in this category",
      });
    }
  } catch (error) {
    console.log("Error while fetching hotels by category:", error);

    res.status(500).json({
      error: "Failed to fetch hotels",
      message: error.message,
    });
  }
});


// =====================================================
// 5. GET HOTEL BY NAME
// =====================================================

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotelName = req.params.hotelName;

    console.log("Searching hotel:", hotelName);

    const hotel = await Hotel.findOne({
      name: hotelName,
    });

    console.log("Hotel found:", hotel);

    if (hotel) {
      res.status(200).json(hotel);
    } else {
      res.status(404).json({
        error: "No Hotel found",
      });
    }
  } catch (error) {
    console.log("Error while fetching hotel by name:", error);

    res.status(500).json({
      error: "Failed to fetch hotel",
      message: error.message,
    });
  }
});


// =====================================================
// 6. DELETE HOTEL
// =====================================================

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const hotelId = req.params.hotelId;

    console.log("Deleting hotel:", hotelId);

    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

    if (deletedHotel) {
      res.status(200).json({
        message: "Hotel deleted successfully",
        hotel: deletedHotel,
      });
    } else {
      res.status(404).json({
        error: "Hotel not found",
      });
    }
  } catch (error) {
    console.log("Error while deleting hotel:", error);

    res.status(500).json({
      error: "Failed to delete hotel",
      message: error.message,
    });
  }
});


// =====================================================
// VERCEL EXPORT
// =====================================================

module.exports = app;