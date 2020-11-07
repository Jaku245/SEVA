require('dotenv/config');

require('./models/Admins');
require('./models/Customers');
require('./models/Professionals');
require('./models/Category');
require('./models/SubCategory');
require('./models/Bookings');
require('./models/Feedbacks');
require('./models/Applications');

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
require("./socket/refresh")(io);

var config = require('./config')
var PORT = config.PORT;


mongoose.connect(config.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
mongoose.connection.on('connected', () => {
  console.log("Connected to mongoDB")
})
mongoose.connection.on('error', (err) => {
  console.log("This  is error", err)
})

app.use(bodyParser.json())

app.use('/backend/public/categoryImage', express.static('public/categoryImage'));
app.use('/backend/public/serviceImage', express.static('public/serviceImage'));
app.use('/backend/public/subCategoryImage', express.static('public/subCategoryImage'));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With , Content-Type , Accept, Authorization ");
  res.setHeader(
    "Access-Control-Allow-Methods",
    " GET , POST , PUT , PATCH , DELETE , OPTIONS ");
  next();
})

//Admin Routes
const manageServiceRoutes = require('./routes/manageServiceRoutes')
app.use("/api/seva/admin", manageServiceRoutes);

const adminRoutes = require('./routes/adminRoutes')
app.use("/api/seva/admin", adminRoutes);

server.listen(PORT, () => {
  console.log("Server running on port : " + PORT)
})