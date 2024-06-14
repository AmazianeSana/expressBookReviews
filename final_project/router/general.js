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

const fetchBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    }, 1000); 
  });
};

const fetchBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const keys = Object.keys(books);
      const authorBooks = keys
        .filter(key => books[key].author.toLowerCase() === author.toLowerCase())
        .map(key => books[key]);

      if (authorBooks.length > 0) {
        resolve(authorBooks);
      } else {
        reject("No books found for this author");
      }
    }, 1000); 
  });
};

const fetchBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const keys = Object.keys(books);
      const titleBooks = keys
        .filter(key => books[key].title.toLowerCase() === title.toLowerCase())
        .map(key => books[key]);

      if (titleBooks.length > 0) {
        resolve(titleBooks);
      } else {
        reject("No books found with this title");
      }
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

  fetchBookByISBN(isbn)
    .then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });
});
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  fetchBooksByAuthor(author)
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  fetchBooksByTitle(title)
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });
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
