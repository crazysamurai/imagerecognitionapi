const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const register = require("./controlers/register");
const signin = require("./controlers/signin");
const profile = require("./controlers/profile");
const image = require("./controlers/image");
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

app.use(bodyparser.json()); //add bodyparser to parse json data
app.use(cors()); //to remove the security error while connecting the server and frontend

//root

app.get("/", (req, res) => {
  res.send("Hello! Welcome to root");
});

// Signin

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});
//Register

app.post("/register", (req, res) => {
  register.handleRegister(req, res, bcrypt, db);
}); //dependency injection

//profile

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

//entries

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
