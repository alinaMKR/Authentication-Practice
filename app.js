//jshint esversion:6
require('dotenv').config();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

////////////////// GET ///////////////////////

app.get("/", function(req,res){
  res.render("home");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.get("/login", function(req,res){
  res.render("login");
});


////////////////// POST ///////////////////////

app.post("/register", function( req, res){
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets")
    }else{
      console.log(err);
    }
  })
});

app.post("/login", function(req, res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email: userName}, function(err, result){
    if(result){
      if (result.password === password){
        res.render("secrets");
      }
    } else if (err){
      console.log(err);
    }
  });

});


app.listen("3000", function(){
  console.log("Server is running on port 3000");
});

