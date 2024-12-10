// Entry point: index.js
const express = require('express');
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Main application setup: app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const staffRoutes = require('./routes/staffRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/books', bookRoutes);
app.use('/members', memberRoutes);
app.use('/staff', staffRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;

// Models: models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, enum: ['Fiction', 'Non-Fiction'], required: true },
    publishedYear: { type: Number },
});

module.exports = mongoose.model('Book', bookSchema);

// Models: models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    joinedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Member', memberSchema);

// Models: models/Staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    hireDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Staff', staffSchema);

// Routes: routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { getBooks, createBook, updateBook, deleteBook } = require('.. /controllers/bookController');

router.get('/', getBooks);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;

// Controllers: controllers/bookController.js
const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};

exports.createBook = async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create book' });
    }
    exports.createBook = async (req, res) => {
        try {
            const book = new Book(req.body);
            await book.save();
            res.status(201).json(book);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create book' });
        }
    };
    
    exports.updateBook = async (req, res) => {
        try {
            const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(updatedBook);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update book' });
        }
    };
    
    exports.deleteBook = async (req, res) => {
        try {
            await Book.findByIdAndDelete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: 'Failed to delete book' });
        }
    };
    
    // Repeat similar structure for memberRoutes.js, staffRoutes.js, memberController.js, and staffController.js
    
    // Testing: __tests__/bookController.test.js
    const request = require('supertest');
    const app = require('../app');

    describe('Book Endpoints', () => {
        it('should fetch all books', async () => {
            const res = await request(app).get('/books');
            expect(res.statusCode).toEqual(200);
        });
    
        it('should create a new book', async () => {
            const res = await request(app).post('/books').send({
                title: 'Test Book',
                author: 'Test Author',
                genre: 'Fiction',
                publishedYear: 2021,
            });
            expect(res.statusCode).toEqual(201);
        });
    });
    