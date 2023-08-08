"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOneBook = exports.updatedBook = exports.viewOneBook = exports.viewAllBooks = exports.createBook = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let databaseFolder = path_1.default.join(__dirname, "../../src/bookDatabase");
let databaseFile = path_1.default.join(databaseFolder, "bookDatabase.json");
const createBook = async (req, res, next) => {
    try {
        if (!fs_1.default.existsSync(databaseFolder)) {
            fs_1.default.mkdirSync(databaseFolder);
        }
        if (!fs_1.default.existsSync(databaseFile)) {
            fs_1.default.writeFileSync(databaseFile, JSON.stringify([]));
        }
        //read from database
        let allBooks = [];
        try {
            const data = fs_1.default.readFileSync(databaseFile, 'utf-8');
            if (!data) {
                return res.status(400).json({
                    message: 'Cannot read data'
                });
            }
            else {
                allBooks = JSON.parse(data);
            }
        }
        catch (parseErr) {
            allBooks = [];
        }
        const { title, author, datePublished, description, pageCount, genre, bookId, publisher, } = req.body;
        console.log({ allBooks, type: typeof allBooks });
        let availableBooks = allBooks.find((book) => book.title === title);
        if (availableBooks) {
            return res.status(400).json({
                message: `Book already available`
            });
        }
        let newBook = {
            bookId: (0, uuid_1.v4)(),
            title: title,
            author: author,
            datePublished: datePublished,
            description: description,
            pageCount: pageCount,
            genre: genre,
            publisher: publisher,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        allBooks.push(newBook);
        fs_1.default.writeFile(databaseFile, JSON.stringify(allBooks, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({
                    message: `Unable to add book`
                });
            }
            else {
                return res.status(200).json({
                    message: `Book successfully added`,
                    newBook
                });
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.createBook = createBook;
// View a book
const viewAllBooks = async (req, res, next) => {
    try {
        const data = fs_1.default.readFileSync(databaseFile, 'utf-8');
        if (!data) {
            return res.status(400).json({
                message: 'Cannot view data'
            });
        }
        if (data) {
            let allBooks = JSON.parse(data);
            return res.status(200).json({
                allBooks: allBooks
            });
        }
    }
    catch (err) {
        return res.status(500).json({ err });
    }
};
exports.viewAllBooks = viewAllBooks;
const viewOneBook = async (req, res, next) => {
    try {
        const data = fs_1.default.readFileSync(databaseFile, 'utf-8');
        if (!data) {
            return res.status(400).json({
                message: 'Cannot view data'
            });
        }
        else if (data) {
            let allBooks = JSON.parse(data);
            // let id = req.params.id
            let book = allBooks.filter((x) => x.bookId === req.params.id);
            return res.status(200).json({
                "book": book
            });
        }
    }
    catch (err) {
        return res.status(500).json({ err });
    }
};
exports.viewOneBook = viewOneBook;
// //To update book
const updatedBook = async (req, res, next) => {
    let allBooks = [];
    try {
        const bookId = req.params.id;
        const fieldToUpdate = req.body;
        const data = fs_1.default.readFileSync(databaseFile, 'utf-8');
        const allBooks = JSON.parse(data);
        let existingBook = allBooks.find((book) => book.bookId === bookId);
        if (!existingBook) {
            return res.status(404).json({
                message: "Book does not exist"
            });
        }
        existingBook = { ...existingBook, ...fieldToUpdate };
        fs_1.default.writeFile(databaseFile, JSON.stringify(allBooks, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({
                    message: `Unable to update book`
                });
            }
            else {
                return res.status(200).json({
                    message: `Book successfully updated`,
                    existingBook
                });
            }
        });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
};
exports.updatedBook = updatedBook;
const deleteOneBook = async (req, res, next) => {
    try {
        const data = fs_1.default.readFileSync(databaseFile, 'utf-8');
        if (!data) {
            return res.status(400).json({
                message: 'Cannot view data'
            });
        }
        else if (data) {
            let allBooks = JSON.parse(data);
            // let id = req.params.id
            let book = allBooks.filter((x) => x.bookId === req.params.id);
            let books = allBooks.filter((x) => x.bookId !== req.params.id);
            fs_1.default.writeFileSync(databaseFile, JSON.stringify(books, null, 2));
            return res.status(200).json({
                message: `Book successfully deleted`,
                "book": book
            });
        }
    }
    catch (err) {
        return res.status(500).json({ err });
    }
};
exports.deleteOneBook = deleteOneBook;
