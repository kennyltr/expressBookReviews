const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//returns boolean, code to check is the username is valid
const isValid = (username) => {
    let validuser = users.filter((user) => user.username === username)
    if (validuser.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

//returns boolean code to check if username and password match the one we have in records.
const authenticatedUser = (username,password)=>{ 
    let authenticuser = users.filter((user) => user.username === username && user.password === password);
    if (authenticuser.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    res.status(404).json({message: "Please input a valid username/password."});
  }
  else {
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {accessToken,username}
        res.status(200).json({message: ("You have successfully logged in.")})
    }
    else {
        res.status(208).json({message: "Incorrect username/password."});
    }
  };
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  let review = req.query.review;
  let bookreviews = books[isbn].reviews

  if (!books[isbn]) {
    res.status(404).send("Book with ISBN: " + isbn + " not found.")
  }
  else {
    if (!review) {
        res.status(204).send("Invalid review.")
    }
    else {
        bookreviews[username] = review;
        res.status(200).send("Review published by " + username + " for book with ISBN: " + isbn + ", review: " + bookreviews[username])
    }
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization.username;
    let review = req.query.review;
    let bookreviews = books[isbn].reviews;
  
    if (!books[isbn]) {
      res.status(404).send("Book with ISBN: " + isbn + " not found.")
    }
    else {
      if (bookreviews[username]) {
        delete bookreviews[username];
        res.status(200).send("Your review has been deleted.") 
      }
      else {
        res.status(404).send("No review for deletion.")
      }
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
