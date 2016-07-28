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

MongoClient.connect(mongolabUri, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(port);
})
