var express = require('express');
var logger = require('morgan');

var booksRouter = require('./routes/books');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function(err, res){
  res.redirect('/books');
})
app.use('/books', booksRouter);

module.exports = app;
