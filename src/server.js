//let us use the variable into .env file
require("dotenv").config();
const nunjucks = require("nunjucks");
const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");

const server = express();
nunjucks.configure("src/views", {
  express: server,
  noCache: true,
});

//it let us to parse the req of server
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

function inputPage(req, res) {
  return res.render("index.html");
}

function successfulPage(req, res) {
  return res.render("successful.html");
}

//it i'll get the post method from '/' adress
server.post("/", async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //switch for one that you use
    port: 587, //see the documentation of your email client
    secure: false,
    auth: {
      user: process.env.EMAIL, //i'd recommend you to use a .env file to keep your credentials
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  //will send the email
  let emailSender = await transporter.sendMail({
    from: `<${process.env.EMAIL}>`,
    to: req.body.recipient, // email receivers
    subject: `${req.body.subject}`, // Subject
    html: req.body.text, // email body
  });
  //   console.log(req.body); i recomment let it uncommented if you change the html body
  res.render("successful.html");
});

//server configs
server
  .use(express.static("public")) //it makes the server understand the public dir as static dir
  .get("/", inputPage)
  .get("/successful.html", successfulPage)
  .listen(8080, console.log("ouvindo porta 8080"));
