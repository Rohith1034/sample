// models.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productname: String,
    Category: String,
    productbrand: String,
    productprice: Number,
    No_of_units: Number,
    productimg: String, // Save the image path or URL
    productdescription: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = {
    Product,
};
