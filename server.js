const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.set("view engine", "ejs"); // Add this line to configure the view engine

const productSchema = new mongoose.Schema({
    product_id: String, // Change this to product_id
    productname: String,
    Category: String,
    productbrand: String,
    productprice: Number,
    No_of_units: Number,
    productimg: String,
    productdescription: String,
});

const sequenceSchema = new mongoose.Schema({
    _id: String,
    seq: Number
});

// Create the Sequence model
const Sequence = mongoose.model('Sequence', sequenceSchema);

const productDb = mongoose.model("Product", productSchema); // Use mongoose.model directly

const main = async () => {
    try {
        await mongoose.connect("mongodb+srv://rohithchanda7:Rohith1034@grocery.j81rj7c.mongodb.net/", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected successfully");
    } catch (error) {
        console.log(error);
    }
}

app.listen(3000, function () { // Change to function without req, res parameters
    console.log("Server started");
})

var full_name = null;

app.get("/", function (req, res) {
    res.render("index.ejs", { full_name });
})

app.get("/addproduct", function (req, res) {
    res.render("addproductform.ejs");
})

app.get("/category/:postman",async function(req,res) {
    var categoryName = req.params.postman;
    categoryName = categoryName.toLocaleLowerCase();
    try {
        const categoryCollection = mongoose.connection.collection(categoryName);
        const categoryItems = await categoryCollection.find({}).toArray();
        res.render("category.ejs", { categoryItems });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred.");
    }
})

app.post("/add-product", async function (req, res) {
    const categoryName = req.body.Category;
    const categorydb = new mongoose.model(categoryName,productSchema);
    try {
        const itemId_to_string = await getNextSequenceValue("items_id");
        const newProduct = new productDb({
            product_id: itemId_to_string.toString(),
            productname: req.body.productname,
            Category: req.body.Category,
            productbrand: req.body.productbrand,
            productprice: req.body.productprice,
            No_of_units: req.body.No_of_units,
            productimg: req.body.productimg,
            productdescription: req.body.productdescription,
        });
        const newCategoryProduct = new categorydb({
            product_id: newProduct.product_id,
            productname: req.body.productname,
            Category: req.body.Category,
            productbrand: req.body.productbrand,
            productprice: req.body.productprice,
            No_of_units: req.body.No_of_units,
            productimg: req.body.productimg,
            productdescription: req.body.productdescription,
        });
        await newProduct.save();
        await newCategoryProduct.save();
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});


app.get("/grocery_account_page", function (req, res) {
    res.render("grocery_account_page.ejs");
});

app.post("/submit",function(req,res) {
    full_name = req.body.fullname;
    res.render("index.ejs",full_name);
    res.redirect("/");
})

app.get("/product/:productid", async function (req, res) {
    try {
        var productid = req.params.productid;
        const foundItems = await productDb.find({product_id: productid}).exec();
        res.render("product.ejs",{foundItems:foundItems});
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred.");
    }
});


async function getNextSequenceValue(sequenceName) {
    try {
        const sequenceDocument = await Sequence.findOneAndUpdate(
            { _id: sequenceName },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        return sequenceDocument.seq;
    } catch (error) {
        throw error;
    }
}

main();

