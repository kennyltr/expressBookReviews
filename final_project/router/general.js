const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {

    let username = req.body.username;
    let password = req.body.password;
    
    if (!username || !password) {
        return res.status(404).json({message: "Please input a valid username and password."})
    }
    else {
        if (!isValid(username)) {
            users.push({"username": username,"password": password});
            return res.status(200).json({message: "User successfully registered. You may now login"});
        }
        else {
            return res.status(404).json({message: "Username already exists."})
        }
    }
})

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const getallbooks = new Promise((resolve, reject) => {
        resolve(res.status(200).send(JSON.stringify(books,null,4)));
    });
    getallbooks.then(() => console.log("Promise for all books fulfilled."));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const getbooksisbn = new Promise((resolve,reject) => {
    let isbn = req.params.isbn;
    if (books[isbn]) {
        resolve(res.status(200).send(JSON.stringify(books[isbn], null ,4)));
    }
    else {
        reject(res.status(404).send("Book with ISBN: " + isbn + " not found."))
    }
  });
  getbooksisbn
    .then (function() {
        console.log("Promise for book by isbn fulfilled");
    })
    .catch (function() { 
        console.log('ISBN not found');
    });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const getbooksauthor = new Promise((resolve,reject) => {
    let author = req.params.author;
    let authorsbooks = {...books};
    for (let i = 1; i <= Object.keys(books).length; i++) {
        if (books[i]["author"] != author) { 
            delete authorsbooks[i]
        }
    }
    if (Object.keys(authorsbooks).length > 0) {
        resolve(res.status(200).send(JSON.stringify(authorsbooks, null ,4)))
    }
    else {
        reject(res.status(404).send("No books by " + author + " found."))
    }
  });
  getbooksauthor
    .then (function() {
        console.log("Promise for book by author fulfilled");
    })
    .catch (function() { 
        console.log('Author not found');
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const getbookstitle = new Promise((resolve,reject) => {
    let title = req.params.title;
    let titles = {...books};
  
    for (let i = 1; i <= Object.keys(books).length; i++) {
        if (books[i]["title"] != title) { 
            delete titles[i]
        }
    }
    if (Object.keys(titles).length > 0) {
      resolve(res.status(200).send(JSON.stringify(titles, null ,4)))
    }
    else {
      reject(res.status(404).send("No books with title " + title + " found."))
    }
  });
  getbookstitle
    .then (function() {
        console.log("Promise for book by title fulfilled");
    })
    .catch (function() { 
        console.log('Title not found');
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
    if (books[isbn]) {
      let reviews = books[isbn]["reviews"];
      if (Object.keys(reviews).length == 0) {
        res.status(404).send("There are no existing reviews.")
      }
      else {
        res.status(200).send(JSON.stringify(reviews, null, 4));
      }
    }
    else {
        res.status(404).send("Book with ISBN: " + isbn + " not found.")
    }
});

module.exports.general = public_users;
