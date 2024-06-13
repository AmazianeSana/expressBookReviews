const express = require('express');
let books = require("./booksdb.js");

let users = require("./auth_users.js").users;
const public_users = express.Router();

const fetchBooks = async () => {
 
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
};

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the list of books available in the shop
public_users.get('/', async (req, res) => {
  try {
    const bookList = await fetchBooks();
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book);
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const keys = Object.keys(books); 
  const authorBooks = keys.filter(key => books[key].author.toLowerCase() === author).map(key => books[key]);

  if (authorBooks.length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }

  return res.status(200).json(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const keys = Object.keys(books);
  const titleBooks = keys.filter(key => books[key].title.toLowerCase() === title).map(key => books[key]);

  if (titleBooks.length === 0) {
    return res.status(404).json({ message: "No books found with this title" });
  }
  return res.status(200).json(titleBooks);
});

// Get book review based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews || Object.keys(book.reviews).length === 0) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
