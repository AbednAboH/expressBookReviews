const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username=req.body.username;
    const password=req.body.password;
    if (!username || !password){
      return res.status(404).json({message: "username &/ password are not provided."})
    }
    if (isValid(username)){
      return res.status(404).json({message: `username ${username} already exists`})
    }
    else{
      users.push({"username":username,"password":password});
      return res.status(200).json({message: `${username} has been added`})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const books_string=JSON.stringify(books,null,4);
  return res.status(200).send(books_string);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  const book=books[isbn];
  if (book){
    res.status(200).send(JSON.stringify(book,null,4));
  }
  else {
    res.status(404).json({mssage: "Book not found!"});
  }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author=req.params.author;
  const booksByAuthor={}
  for (const isbn in books){
    if (books[isbn].author===author){
        booksByAuthor[isbn]=books[isbn]; 
    }
  }
  if (booksByAuthor){
    return res.status(200).send(JSON.stringify(booksByAuthor,null,4));
  }
  else{
    return res.status(404).send({message: `Books by author ${author} not found`});
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title=req.params.title;
  const booksByTitle={}
  for (const isbn in books){
    if (books[isbn].title===title){
        booksByTitle[isbn]=books[isbn]; 
    }
  }
  if (booksByTitle){
    return res.status(200).send(JSON.stringify(booksByTitle,null,4));
  }
  else{
    return res.status(404).send({message: `Books by title ${title} not found`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const book=books[req.params.isbn];
  if (book){  
    return res.status(200).send(JSON.stringify(book.reviews));
  }
  else{
    return res.status(404).send({message: "ISBN doesn't exist"});
  }
});

module.exports.general = public_users;
