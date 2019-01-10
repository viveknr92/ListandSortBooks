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

function getComparator(colName) {
  return {
    title: compare_title,
    author: compare_author,
    price:compare_price,
    availability:compare_availability
  }[colName] // specifies the key of the object. ie. title or author or price or availability
}

function handleSort(req, res, colName, result) {
  if (req.query.sort === "aesc") return res.json(result.sort(getComparator(colName)));
  else if (req.query.sort === "desc") return res.json(result.sort(getComparator(colName)).reverse());
  else return res.status(400).json({err : "Invalid sort query"});
}

router.get('/', function(req, res) {
  db.query("SELECT * from books", function (err, result){
    if (err) return res.status(500).send({err});
    
    console.log(req.query.sort);
    console.log(req.query.col);

    if (req.query.sort === undefined || req.query.col === undefined){
      //default case - sort by title in aesc order
      return res.json(result.sort(compare_title));
    }

    else if (req.query.col === "title"){
      handleSort(req,res, "title", result);
    }

    else if (req.query.col === "author"){
      handleSort(req,res, "author", result);
    }

    else if (req.query.col === "price"){
      handleSort(req,res, "price", result);
    }

    else if (req.query.col === "availability"){
      handleSort(req,res, "availability", result);
    }

    else{
      return res.status(400).json({err : "Invalid column name query"});
    }
  })
});

function handleStringSort(prop) {
  return function(a, b) {
    if(a[prop].toLowerCase() < b[prop].toLowerCase()) return -1;
    if (a[prop].toLowerCase() > b[prop].toLowerCase()) return 1;
    return 0;
  }
}

function compare_title(a, b) {
  return handleStringSort('title')(a, b)
}

function compare_author(a, b) {
  return handleStringSort('author')(a, b)
}

function compare_price(a, b) {
  if (parseFloat(a.price) < parseFloat(b.price)) return -1;
  if (parseFloat(a.price) > parseFloat(b.price)) return 1;
  return 0;
}

function compare_availability(a, b) {
  return handleStringSort('availability')(a, b)
}

router.post('/', function(req, res) {
  var sql = "INSERT INTO books (title, author, price, availability, url) VALUES ?";
  var values = [[req.body.title, req.body.author, req.body.price, req.body.availability, req.body.url]];

  db.query(sql, [values], function (err, result) {
    if (err) return res.status(500).json({err : err});
    res.status(201).json({message : "New book inserted with id " + result.insertId});
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
