/* 
 Name: Aniruth
 Class: CSC 
 Description: server.js shows the different server requests using express & mongo DB for the Ostaa Website.
 Date: 03/25/2023
*/
const express = require("express");
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  status: String,
  owner: String,
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  listings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  purchases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

const User = mongoose.model("User", UserSchema);
const Item = mongoose.model("Item", ItemSchema);

const port = process.env.PORT || 3000;
const dbURL = "mongodb://127.0.0.1:27017/ostaa";

const app = express();

app.use(express.json());
app.use(express.static("public_html"));

app.get("/get/users", async (req, res) => {
  const users = await User.find({}).exec();
  res.json(users);
});

app.get("/get/items", async (req, res) => {
  const items = await Item.find({}).exec();
  res.json(items);
});

app.get("/get/listings/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .populate("listings")
    .exec();
  if (user) {
    res.json(user.listings);
  } else {
    res.json({ ok: false, message: "No user found" });
  }
});

app.get("/get/purchases/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .populate("purchases")
    .exec();
  if (user) {
    res.json(user.purchases);
  } else {
    res.json({ ok: false, message: "No user found" });
  }
});

app.get("/search/users/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  const users = await User.find({
    username: { $regex: keyword, $options: "i" },
  }).exec();
  res.json(users);
});

app.get("/search/items/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  const items = await Item.find({
    description: { $regex: keyword, $options: "i" },
  }).exec();
  res.json(items);
});

app.post("/add/user", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await User.create({
      username,
      password,
      listings: [],
      purchases: [],
    });
    newUser.save();
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, message: "server error" });
  }
});

app.post("/add/item/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.json({ ok: false, message: "No user exists" });
    }
    const newItem = await Item.create({ ...req.body, owner: username });
    newItem.save();
    user.listings.push(newItem.id);
    user.save();
    res.json({ ok: true });
  } catch (e) {
    console.log("error", e);
    res.json({ ok: false, message: "server error" });
  }
});

mongoose
  .connect(dbURL)
  .then(() => console.log("Connected to Database"))
  .catch((e) => console.log("Error connecting to Database", e));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
