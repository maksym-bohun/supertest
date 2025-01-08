const express = require('express');
const {check, validationResult} = require('express-validator');

const router = express.Router();
const bookData = require('../data/books.json')
const {save} = require("../services/save.service");

router.get('/', (req, res) => {
    res.json(bookData)
})

router.post('/', [
    check('name', 'Book name is required').not().isEmpty(),
    check('author', 'Author name is required').not().isEmpty()
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    bookData.push({
        name: req.body.name, author: req.body.author, id: Math.random()
    })

    const result = save(bookData);
    if (!result) return res.status(500).json({error: true, message: 'Could not save book'});
    return res.status(200).json({message: 'Success'})
})

router.patch('/:bookId', [
    check('name', 'Book name is required').not().isEmpty(),
    check('author', 'Author name is required').not().isEmpty()
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const bookId = +req.params.bookId;
    const {name, author} = req.body;


    const book = bookData.find(book => book.id === bookId);
    if (!book) return res.status(404).json({error: true, message: 'No book with such id'});

    book.name = name;
    book.author = author;

    const result = save(bookData);
    if (!result) return res.status(500).json({error: true, message: 'Could not save book'});
    return res.status(201).json(book)
})

module.exports = router;