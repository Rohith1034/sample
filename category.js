const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id: String,
    productname: String,
    Category: String,
    productbrand: String,
    productprice: Number,
    No_of_units: Number,
    productimg: String, // Save the image path or URL
    productdescription: String,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
