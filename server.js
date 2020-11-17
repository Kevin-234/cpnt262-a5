// load dependencies
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const ejs = require('ejs');

// Import models
const Bushi = require(`./models/bushi.js`);

// Create express app
const app = express();

// Set view engine
app.set('view engine','ejs')

// app.use is for using middleware
app.use(express.static(path.join(__dirname, 'public')));

// Set up mongoose connection
// Connect to DB
mongoose.connect(process.env.MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on('error', function(error){
  console.log(`Connection Error: ${error.message}`)
});

db.once('open', function() {
  console.log('Connected to DB...');

});

app.get('/', function(req, res){
  res.send('<h1>Welcome Bushi Arts</h1><p>Enter this endpoint /api/v0/bushi if you want to return array of objects</p><p>or enter this endpoint /api/v0/bushi/:id to return individual objects.</p><p>Id must be 1 to 10</p>.')
})

app.get('/api/v0/bushi', (req, res) => {
    Bushi.find({}, (err, data) => {
        if (err) {
            res.send('Could not retrieve products')
        }
        else {
            res.json(data);
        }
    });
});

// JSON endpoint. Return for individual objects
app.get('/api/v0/bushi/:id', (req, res) => {

    Bushi.findOne({id: req.params.id}, (err, data) => {
      if (err || data===null) {
        res.send('Could not find product');
        console.log(err);
      }
      else {
        res.json(data);
      }
    });
  });
  
// Add more middleware
app.use(function(req, res, next) {
    res.status(404);
    res.send('404: File Not Found');
  });
  
  // Set port preference with default
  const PORT = process.env.PORT || 3000;
  
  // Start server
  app.listen(PORT, function(){
    console.log(`Listening on port ${PORT}`);
  });
