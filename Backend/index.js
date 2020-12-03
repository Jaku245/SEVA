require('dotenv/config')
require('./models/Customers');
require('./models/Professionals');
require('./models/Category');
require('./models/SubCategory');
require('./models/Bookings');
require('./models/Payments');
require('./models/Feedbacks');
require('./models/Applications');

const path = require('path');
const Razorpay = require('razorpay')
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

app.use('/api/seva/backend/public/customer/profilePhoto', express.static('public/customer/profilePhoto'));
app.use('/api/seva/backend/public/professional/profilePhoto', express.static('public/professional/profilePhoto'));
app.use('/api/seva/backend/public/professional/applicationForm/attachments', express.static('public/professional/applicationForm/attachments'));
app.use('/api/seva/backend/public/professional/applicationForm/bankDetails', express.static('public/professional/applicationForm/bankDetails'));
app.use('/api/seva/backend/public/professional/applicationForm/identityProof', express.static('public/professional/applicationForm/identityProof'));

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

//Customer Routes
const customerRoutes = require('./routes/customerRoutes')
app.use("/api/seva", customerRoutes);

// Professional Routes
const professionalRoutes = require('./routes/professionalRoutes')
app.use("/api/seva", professionalRoutes);

server.listen(PORT, () => {
  console.log("Server running on port : " + PORT)
})