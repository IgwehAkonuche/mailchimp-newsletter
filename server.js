const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const request = require("request");
const dontenv = require("dotenv").config()

const server = express();

server.use(express.static("public"));
server.use(bodyParser.urlencoded({extended: true}));
// server.set("view engine", "ejs");

server.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

server.post("/", function(req, res) {

var firstname = req.body.fName;
var lastname = req.body.lName;
var email = req.body.email;
console.log(firstname, lastname, email);
var data = {
    members:[
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME:firstname,
                LNAME:lastname
            }
        }
    ]
}

var jsonData = JSON.stringify(data);

var options = {
    url: process.env.Mailchimp_URI,
    method: "post",
    headers: {
        "Authorization" : process.env.Authorization
    },

     body: jsonData
    

};

request(options, (error, response, body) => {
if (error){
    res.sendFile(__dirname + "/failure.html");
} else {
    if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }
}
});

});

server.post("/failure.html", function(req, res) {
    res.redirect("/");
})





server.listen(3000, function(){
    console.log("server running on port 3000");
});
