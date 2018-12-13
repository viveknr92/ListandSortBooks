var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"books"
});

db.connect(function(err) {
  if (err) console.log(err);
  else console.log("Connected to DB!");
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.query("SELECT * from books", function (err, result){
    if (err) res.status(500).send({err});
    res.json(result.sort(compare_title));
  })
});

router.get('/title', function(req, res, next) {
  var sort_order = req.query.sort;
  db.query("SELECT * from books", function (err, result){
    if (err) res.status(500).send({err});
    if (sort_order === "aesc"){
      res.json(result.sort(compare_title));
    }
    else if (sort_order === "desc"){
      res.json(result.sort(compare_title).reverse());
    }
    else{
      res.json({err : "Incorrect sort parameter"});
    }
  })
});

router.get('/author', function(req, res, next) {
  var sort_order = req.query.sort;
  db.query("SELECT * from books", function (err, result){
    if (err) res.status(500).send({err});
    if (sort_order === "aesc"){
      res.json(result.sort(compare_author));
    }
    else if (sort_order === "desc"){
      res.json(result.sort(compare_author).reverse());
    }
    else{
      res.json({err : "Incorrect sort parameter"});
    }
  })
});

router.get('/price', function(req, res, next) {
  var sort_order = req.query.sort;
  db.query("SELECT * from books", function (err, result){
    if (err) res.status(500).send({err});
    if (sort_order === "aesc"){
      res.json(result.sort(compare_price));
    }
    else if (sort_order === "desc"){
      res.json(result.sort(compare_price).reverse());
    }
    else{
      res.json({err : "Incorrect sort parameter"});
    }
  })
});

router.get('/availability', function(req, res, next) {
  var sort_order = req.query.sort;
  db.query("SELECT * from books", function (err, result){
    if (err) res.status(500).send({err});
    if (sort_order === "aesc"){
      res.json(result.sort(compare_availability));
    }
    else if (sort_order === "desc"){
      res.json(result.sort(compare_availability).reverse());
    }
    else{
      res.json({err : "Incorrect sort parameter"});
    }
  })
});

function compare_title(a, b) {
  if (a.title < b.title)
    return -1;
  if (a.title > b.title)
    return 1;
  return 0;
}

function compare_author(a, b) {
  if (a.author < b.author)
    return -1;
  if (a.author > b.author)
    return 1;
  return 0;
}

function compare_price(a, b) {
  if (parseFloat(a.price) < parseFloat(b.price))
    return -1;
  if (parseFloat(a.price) > parseFloat(b.price))
    return 1;
  return 0;
}

function compare_availability(a, b) {
  if (a.availability < b.availability)
    return -1;
  if (a.availability > b.availability)
    return 1;
  return 0;
}

module.exports = router;
