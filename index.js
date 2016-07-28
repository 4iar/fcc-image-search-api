"use strict";
const express = require('express');
const mongodb = require('mongodb');
const Search = require('bing.search');

const search = new Search(process.env.BING_API_KEY);
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
  const page = request.query.offset ? 1 : 0;

  const dateObj = new Date();
  const dateStr = dateObj.toISOString();

  const dbEntry = {
    term: searchTerm,
    when: dateStr
  }


  db.collection('searches').save(dbEntry, (error, result) => {
    if (result) {
      console.log("saved result");
    } else {
      console.log("couldn't save result");
    }
  })

  search.images(searchTerm, {top: 5, skip: (5 * page)}, (error, resultsDirty) => {
    const resultsClean = [];
    resultsDirty.forEach((r) => {
      resultsClean.push({
        url: r.url,
        context: r.sourceUrl,
        thumbnail: r.thumbnail.url,
        metadata: {
          format: r.type,
          width: r.width,
          height: r.height,
          size: r.size
        }
      })
    })

    response.json(resultsClean);
  });
});

app.get('/latest/imagesearch', (request, response) => {
  db.collection('searches').find(null, {_id: 0, when: 1, term: 1}).limit(5).sort({when: -1}).toArray((error, results) => {
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
