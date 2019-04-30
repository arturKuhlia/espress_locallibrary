#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/



var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/local_library';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.passageiros.insert(
  {
  _id: "P1",
  "nome": "Mary Anne",
  "loc": {
  type: "Point",
  "coordinates": [125.6, 10.1]
  } 
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [125.6, 10.1]
    },
    "properties": {
      "name": "Mary Anne"
    }
  }
  ) 
   
  db.passageiros.find()

// Optional callback
