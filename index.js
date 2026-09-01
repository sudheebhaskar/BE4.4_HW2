require("dotenv").config();

const express = require('express')
const app = express()
  
const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotels.models");

app.use(express.json())

initializeDatabase();



async function createHotel(newHotel){
  try{
    const hotel = new Hotel(newHotel)
    const saveHotel = await hotel.save()
    return saveHotel
  } catch(error){
    throw error
  }
}

app.post("/hotels", async (req, res) => {
  try{
    const addedHotel = await createHotel(req.body)
    res.status(201).json({message: "New hotel added successfully", hotel: addedHotel})
  } catch(error){
    res.status(500).json({error: "Failed to add hotel"})
  }
})

//createHotel(newHotel);

async function deleteHotel(hotelId){
  try{
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
    return deletedHotel
  } catch(error){
    console.log(error)
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try{
    const deletedHotel = await deleteHotel(req.params.hotelId)
    if(deletedHotel){
      res.status(200).json({message: "Hotel deleted successfully"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to delete hotel"})
  }
})

async function readAllHotels(){
  try{
    const allHotels = await Hotel.find()
    return allHotels
  } catch(error){
    console.log(error)
  }
}

app.get("/hotels", async (req, res) => {
  try{
    const hotels = await readAllHotels()
    if(hotels.length != 0){
      res.json(hotels)
    } else {
      res.status(404).json({error: "No Hotel found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to fetch hotels."})
  }
})
//readAllHotels();

async function readHotelByName(hotelName){
  try{
    const hotelByName = await Hotel.find({name: hotelName})
    console.log(hotelByName)
    return hotelByName  
  } catch(error){
    console.log(error)
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try{
    const hotels = await readHotelByName(req.params.hotelName)
    if(hotels.length != 0){
      res.json(hotels)
    } else {
      res.status(404).json({error: "No Hotel found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to fetch hotels."})
  }
})
//readHotelByName("Lake View")


//hotels with parking space
async function hotelsWithParking(){
  try{
    const hotelWithParkingSpace = await Hotel.find({isParkingAvailable: true})
    console.log(hotelWithParkingSpace)
  } catch(error){
    console.log(error)
  }
}

//hotelsWithParking()

//hotels with Restaurant
async function hotelsWithRestaurant(){
  try{
    const hotelAlongRestaurant = await Hotel.find({isRestaurantAvailable: true})
    console.log(hotelAlongRestaurant)
  } catch(error){
    console.log(error)
  }
}

//hotelsWithRestaurant();

//mid-range hotels
async function readMidRangeHotels(){
  try{
    const allMidRangeHotels = await Hotel.find({category: "Mid-Range"})
    console.log(allMidRangeHotels)
  } catch(error){
    console.log(error)
  }
}

//readMidRangeHotels()

//all price range $$$
async function readHotelsWithPriceRange(priceRange){
  try{
    const hotelsWithPriceRange = await Hotel.find({priceRange: priceRange})
    console.log(hotelsWithPriceRange)
  } catch(error){
    console.log(error)
  }
}

//readHotelsWithPriceRange("$$$$ (61+)")

//rating 4
// async function hotelsWithRating(hotelRating){
//   try{
//     const hotelRatedFour = await Hotel.find()
//     return hotelRatedFour
//   } catch(error){
//     console.log(error)
//   }
// }

// app.get("/hotels/rating/:hotelRating", async (req, res) => {
//   try{
//     const hotels = await hotelsWithRating(req.params.hotelRating)
//     if(hotels.length != 0){
//       res.json(hotels)
//     } else {
//       res.status(404).json({error: "No Hotel found"})
//     }
//   } catch(error){
//     res.status(500).json({error: "Failed to fetch hotels."})
//   }
// })

// Function to get hotels by rating
async function hotelsWithRating(hotelRating) {
  try {
    const hotelRated = await Hotel.find({ rating: hotelRating });  // Filter by rating
    return hotelRated;
  } catch (error) {
    console.log(error);
    throw error;  // Throw error to be caught in the route handler
  }
}

// Route to get hotels by rating
app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotelRating = parseFloat(req.params.hotelRating);  // Get the rating from the URL and convert it to a number
    const hotels = await hotelsWithRating(hotelRating);  // Pass the rating to the function

    if (hotels.length !== 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No Hotel found with this rating" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});




//hotelsWithRating()

//hotel having particular phone number
async function hotelPhoneNumber(phoneNumber){
  try{
    const hotelHavingPhoneNumber = await Hotel.findOne({phoneNumber: phoneNumber})
    return hotelHavingPhoneNumber
  } catch(error){
    console.log(error)
  }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try{
    const hotels = await hotelPhoneNumber(req.params.phoneNumber)
    if(hotels){
      res.json(hotels)
    } else {
      res.status(404).json({error: "No Hotel found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to fetch hotels."})
  }
})
//hotelPhoneNumber("+1299655890")
// +1234555890


// Function to get hotels by category
async function hotelsWithCategory(hotelCategory) {
  try {
    const hotelsByCategory = await Hotel.find({ category: hotelCategory }); 
    return hotelsByCategory;
  } catch (error) {
    console.log(error);
    throw error;  
  }
}

// Route to get hotels by category
app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotelCategory = req.params.hotelCategory;  // Get the category from the URL
    const hotels = await hotelsWithCategory(hotelCategory);  // Pass the category to the function

    if (hotels.length !== 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No Hotel found in this category" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});






//find by id
async function updateHotelCheckout(hotelID, dataToUpdate){
  try{
    const updateCheckoutTime = await Hotel.findByIdAndUpdate(hotelID, dataToUpdate, {new: true})
    console.log(updateCheckoutTime)
  } catch(error){
    console.log("Error while updating data", error)
  }
}

//updateHotelCheckout("66d9799b1c827155cd8ff14a", {checkOutTime: "11 AM"})

app.patch("/hotels/:hotelId", async (req, res) => {
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.hotelId,
        req.body,
        { new: true }
      );
  
      if (updatedHotel) {
        res.status(200).json({
          message: "Hotel updated successfully",
          hotel: updatedHotel
        });
      } else {
        res.status(404).json({
          error: "Hotel not found"
        });
      }
    } catch (error) {
      console.log("Error while updating hotel", error);
  
      res.status(500).json({
        error: "Failed to update hotel"
      });
    }
  });

 //update name to resort
async function updateHotelRating(hotelID, dataToUpdate){
  try{
    const hotelRatingUpdate = await Hotel.findByIdAndUpdate(hotelID, dataToUpdate, {new: true})
    console.log(hotelRatingUpdate)
  } catch(error){
    console.log("Error while updating data", error)
  }
}

//updateHotelRating("66d979d58afb6bd01dca4887", {rating: 4.2})



//update phoneNumber
async function updateHotelPhoneNumber(phoneNumber, dataToUpdate){
  try{
    const hotelPhoneNumberUpdate = await Hotel.findOneAndUpdate({phoneNumber: phoneNumber}, dataToUpdate, {new: true})
    console.log(hotelPhoneNumberUpdate)
  } catch(error){
    console.log("Error while updating data.", error)
  }
}

//updateHotelPhoneNumber("+1997687392", {phoneNumber: "+1299655890"})
//updateHotelPhoneNumber("+1299655890", {phoneNumber: "+1997687392"})



//find and delete by id
async function deleteHotelById(hotelID){
  try{
    const deletedHotel = await Hotel.findByIdAndDelete(hotelID)
  } catch(error){
    console.log("Error while deleting data", error)
  }
}

//deleteHotelById("66d8fe7232ff884039b9ace0")


//find and delete data
async function deleteHotelByPhoneNumber(phoneNumber){
  try{
    const deletedHotel = await Hotel.findOneAndDelete({phoneNumber: phoneNumber})
    console.log(deletedHotel)
  } catch(error){
    console.log("Error while deleting data", error)
  }
}

//deleteHotelByPhoneNumber("+1234567890")

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})