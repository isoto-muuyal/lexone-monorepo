const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");

const { I18n } = require('i18n');

const i18n = new I18n({
  locales: ['en', 'de', 'fr', 'ar'],
  defaultLocale: 'en',
  directory: path.join(__dirname, 'locales'),
});
const cronController = require('../src/controllers/cronController');

const app = express();
require('dotenv').config();

// user & tasker routes
const mainRoutev1 = require("./routes/mainRoutev1");
const WebmainRoutev1 = require("./routes/WebmainRoutev1");

// localization
app.use(i18n.init);

// enables cross-origin resource sharing
app.use(cors());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// default port
app.set('port', process.env.API_PORT || 3000);

// security middleware
app.use(helmet());

// serve uploaded case documents
app.use(process.env.DOCS_MEDIA_URL || "/media/documents/", express.static(path.join(__dirname, "public", "documents")));

// request logger middleware, disable in production 
if (process.env.ENV === "production") {
  app.use(morgan('dev'));
}

// api routes
app.use("/api/v1/", mainRoutev1);
app.use("/web/api/v1/", WebmainRoutev1);

app.get("/api/v2/", (req, res) => {
  return res.status(200).json({ status_code: 200, message: res.__("API v2.0") });
});

// initialize socket
let chatServer = require("./socket/chat.js");

// invalid route
app.all("*", (req, res) => {
  return res.status(404).json({ status_code: 404, message: res.__("Invalid Route") });
});

// load mongodb
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(
  () => { console.log("MongoDB is connected") },
  err => { console.log("Cannot connect to the mongodb" + err); }
);

// create express server
let server = require('http').createServer(app);

// for https connection
if (process.env.SSL === "1") {
  // load ssl certificates
  let privateKey = fs.readFileSync("/etc/letsencrypt/live/tudofyapp.com/privkey.pem");
  let certificate = fs.readFileSync("/etc/letsencrypt/live/tudofyapp.com/cert.pem");
  let ca = fs.readFileSync("/etc/letsencrypt/live/tudofyapp.com/fullchain.pem");
  const sslOptions = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
  server = require('https').createServer(sslOptions, app);
}


server.listen(app.get('port'), () => console.log(`Node.js API is running on: ${app.get('port')}`));
