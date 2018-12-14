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

router.get('/', function(req, res) {
  db.query("SELECT * from books", function (err, result){
    if (err) return res.status(500).send({err});

    console.log(req.query.sort);
    console.log(req.query.col);

    if (req.query.sort === undefined || req.query.col === undefined){
      //default case
      return res.json(result.sort(compare_title));
    }

    else if (req.query.col === "title"){
      if (req.query.sort === "aesc") return res.json(result.sort(compare_title));
      else if (req.query.sort === "desc") return res.json(result.sort(compare_title).reverse());
      else return res.json({err : "Invalid sort query"});
    }

    else if (req.query.col === "author"){
      if (req.query.sort === "aesc") return res.json(result.sort(compare_author));
      else if (req.query.sort === "desc") return res.json(result.sort(compare_author).reverse());
      else return res.json({err : "Invalid sort query"});
    }

    else if (req.query.col === "price"){
      if (req.query.sort === "aesc") return res.json(result.sort(compare_price));
      else if (req.query.sort === "desc") return res.json(result.sort(compare_price).reverse());
      else return res.json({err : "Invalid sort query"});
    }

    else if (req.query.col === "availability"){
      if (req.query.sort === "aesc") return res.json(result.sort(compare_availability));
      else if (req.query.sort === "desc") return res.json(result.sort(compare_availability).reverse());
      else return res.json({err : "Invalid sort query"});
    }

    else{
      return res.json({err : "Invalid column name query"});
    }
  })
});

function compare_title(a, b) {
  if (a.title < b.title) return -1;
  if (a.title > b.title) return 1;
  return 0;
}

function compare_author(a, b) {
  if (a.author < b.author) return -1;
  if (a.author > b.author) return 1;
  return 0;
}

function compare_price(a, b) {
  if (parseFloat(a.price) < parseFloat(b.price)) return -1;
  if (parseFloat(a.price) > parseFloat(b.price)) return 1;
  return 0;
}

function compare_availability(a, b) {
  if (a.availability < b.availability) return -1;
  if (a.availability > b.availability) return 1;
  return 0;
}

router.post('/', function(req, res) {
  var sql = "INSERT INTO books (title, author, price, availability, url) VALUES ?";
  var values = [[req.body.title, req.body.author, req.body.price, req.body.availability, req.body.url]];

  db.query(sql, [values], function (err, result) {
    if (err) return res.status(500).json({err : err});
    res.json({message : "New book inserted with id " + result.insertId});
  });

})

router.put('/:id', function(req, res) {
  var sql = `UPDATE books SET title = '${req.body.title}', author = '${req.body.author}' 
  , price = '${req.body.price}', availability = '${req.body.availability}', url = '${req.body.url}'
  WHERE id = ${req.params.id}`;
  
  db.query(sql, function (err, result) {
    if (err) return res.status(500).json({err : err});
    if (result.affectedRows === 0) return res.status(400).json({message : "Invalid Book ID"});
    res.json({message : "Book with id " + req.params.id + " updated"});
  });

})

router.delete('/:id', function(req, res) {
  var sql = `DELETE from books where id = '${req.params.id}'`;
  db.query(sql, function (err, result) {
    if (err) return res.status(500).json({err : err});
    if (result.affectedRows === 0) return res.status(400).json({message : "Invalid Book ID"});
    res.json({message : "Book with id " + req.params.id + " deleted"});
  });
})

module.exports = router;
