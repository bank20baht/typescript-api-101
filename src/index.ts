import express, { Request, Response } from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// Sample in-memory data store
let books = [
  { id: 1, title: "Book 1" },
  { id: 2, title: "Book 2" },
  { id: 3, title: "Book 3" },
  { id: 4, title: "Book 4" },
];

// GET all books
app.get("/books", (req: Request, res: Response) => {
  res.json(books);
});

// GET a single book by ID
app.get("/books/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// POST a new book
app.post("/books", (req: Request, res: Response) => {
  const { id, title } = req.body;
  const newBook = { id, title };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT (update) an existing book
app.put("/books/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;
  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].title = title;
    res.json(books[bookIndex]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// DELETE a book
app.delete("/books/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex !== -1) {
    const deletedBook = books.splice(bookIndex, 1)[0];
    res.json(deletedBook);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
