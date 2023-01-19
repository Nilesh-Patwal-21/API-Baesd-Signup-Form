const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
// dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  var firstName = req.body.Fname;
  var lastName = req.body.Lname;
  var email = req.body.email;
  var message = req.body.Message;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          MESSAGE: message,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  // const url = process.env.URL;
  const url = "https://us21.api.mailchimp.com/3.0/lists/1a25203bcf"

  const options = {
    method: "POST",
    // auth: process.env.APIKEY,
    auth:"Nilesh:293d628edde1c2ea615a857d246a4dd1-us21",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
