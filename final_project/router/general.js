const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const data = await new Promise((resolve) => {
      resolve(books);
    });

    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;

  try {
    const data = await new Promise((resolve) => {
      resolve(books[isbn]);
    });

    if (data) {
      return res.status(200).send(JSON.stringify(data, null, 4));
    }

    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author.toLowerCase();

  try {
    const data = await new Promise((resolve) => {
      let result = {};
      Object.keys(books).forEach((key) => {
        if (books[key].author.toLowerCase() === author) {
          result[key] = books[key];
        }
      });
      resolve(result);
    });

    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title.toLowerCase();

  try {
    const data = await new Promise((resolve) => {
      let result = {};
      Object.keys(books).forEach((key) => {
        if (books[key].title.toLowerCase() === title) {
          result[key] = books[key];
        }
      });
      resolve(result);
    });

    return res.status(200).send(JSON.stringify(data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }

  return res.status(404).json({ message: "Book not found" });
});
