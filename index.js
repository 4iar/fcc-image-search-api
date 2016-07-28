"use strict";
const express = require('express');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
let db;
const mongolabUri = process.env.MONGODB_URI;
const app = express();
// let Heroku set the port
const port = process.env.PORT || 5000;

app.get('/', (request, response) => {
  response.json({error: "invalid endpoint bla bla bla"});
})

app.get('/imagesearch/:term', (request, response) => {
  const searchTerm = request.params.term;
  const page = request.query.offset;

  console.log("search term: " + searchTerm);
  console.log("page: " + page);
});

app.get('/latest/imagesearch', (request, response) => {
  db.collection('searches').find().toArray((error, results) => {
    if (error) {
      response.json({error: "could not get recent searches from the database"});
    } else {
      response.json(results);
    }
  })
})


MongoClient.connect(mongolabUri, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(port);
})
