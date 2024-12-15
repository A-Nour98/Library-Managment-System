const Book = require('../db/models/book.js'); // Import the Book model
const statusCodes = require('../status_codes.js'); // Import status codes
const { createValidation, updateValidation, searchValidation } = require('../validations/bookValidation.js'); // Import validation functions
const Sequelize = require('sequelize'); // Import Sequelize
const Op = Sequelize.Op; // Destructure the Op object from Sequelize

// Function to get all books
const GetAllBooks = async (req, res) => {
    try {
        // Fetch all books from the database
        const bookList = await Book.findAll();
        // Send response with status 200 and the list of books
        return res.status(200).json({
            statusCode: statusCodes.generalCodes.success, // Success status code
            bookList: bookList // List of books
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to get a specific book by ID
const GetBook = async (req, res) => {
    try {
        // Find the book instance by its primary key
        const bookInstance = await Book.findByPk(req.params.id);
        if (bookInstance === null) {
            // If no book found, return 404 status with error message
            return res.status(404).json({
                statusCode: statusCodes.bookCodes.bookNotFound, // Book not found status code
                message: "Book not found" // Error message
            });
        }
        // If book found, return 200 status with the book details
        return res.status(200).json({
            status: statusCodes.generalCodes.success, // Success status code
            book: bookInstance // Book details
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to create a new book
const CreateBook = async (req, res) => {
    const body = req.body; // Get request body

    try {
        // Perform validation on the request body, especially ISBN
        const validation = createValidation(body);

        if (validation.error) {
            // If validation fails, return 400 status with error message
            return res.status(400).json({
                statusCode: statusCodes.bookCodes.bookValidationError, // Validation error status code
                message: validation.error.details[0].message // Validation error message
            });
        }

        // Check for duplicate book by ISBN
        let duplicate = await Book.findByPk(body.ISBN);
        if (duplicate !== null) {
            // If duplicate found, return 400 status with error message
            return res.status(400).json({
                statusCode: statusCodes.bookCodes.bookAlreadyExists, // Duplicate book status code
                existingBook: duplicate, // Existing book details
                message: 'Book ISBN already exists' // Error message
            });
        }

        // Create a new book record
        const newBook = await Book.create({
            ISBN: body.ISBN,
            title: body.title,
            author: body.author,
            quantity: body.quantity,
            shelf_location: body.shelf_location
        });

        // Return 200 status with the newly created book details
        return res.status(200).json({
            status: statusCodes.generalCodes.success, // Success status code
            CreatedBook: newBook // Newly created book details
        });
    } catch (err) {
        // Handle any errors that occur
        console.log(err); // Log the error for debugging
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to update a book
const UpdateBook = async (req, res) => {
    const body = req.body; // Get request body

    try {
        // Perform validation on the request body, especially ISBN
        const validation = updateValidation(body);

        if (validation.error) {
            // If validation fails, return 400 status with error message
            return res.status(400).json({
                statusCode: statusCodes.bookCodes.bookValidationError, // Validation error status code
                message: validation.error.details[0].message // Validation error message
            });
        }

        // Find the book instance by its primary key
        const bookInstance = await Book.findByPk(req.params.id, {
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
        });

        if (bookInstance === null) {
            // If no book found, return 404 status with error message
            return res.status(404).json({
                statusCode: statusCodes.bookCodes.bookNotFound, // Book not found status code
                message: "Book not found" // Error message
            });
        }

        // Update the book instance with new data
        Object.assign(bookInstance, body);
        await bookInstance.save(); // Save the updated book
        await bookInstance.reload(); // Reload the book instance

        // Return 200 status with the updated book details
        return res.status(200).json({
            status: statusCodes.generalCodes.success, // Success status code
            updatedBook: bookInstance // Updated book details
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to delete a book
const DeleteBook = async (req, res) => {
    try {
        // Find the book instance by its primary key
        const bookInstance = await Book.findByPk(req.params.id, {
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
        });

        if (bookInstance === null) {
            // If no book found, return 404 status with error message
            return res.status(404).json({
                statusCode: statusCodes.bookCodes.bookNotFound, // Book not found status code
                message: "Book not found" // Error message
            });
        }

        // Delete the book instance
        await bookInstance.destroy();

        // Return 200 status indicating successful deletion
        return res.status(200).json({
            status: statusCodes.generalCodes.success, // Success status code
            message: "Book deleted successfully" // Success message
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to search for a book by keyword
const SearchBook = async (req, res) => {
    try {
        // Perform validation on the request parameters
        const validation = searchValidation(req.params);

        if (validation.error) {
            // If validation fails, return 400 status with error message
            return res.status(400).json({
                statusCode: statusCodes.bookCodes.bookValidationError, // Validation error status code
                message: validation.error.details[0].message // Validation error message
            });
        }

        const keyword = req.params.keyword; // Get the search keyword
        // Find books that match the keyword in title, author, or ISBN
        const books = await Book.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${keyword}%` } }, // Partial match in title
                    { author: { [Op.iLike]: `%${keyword}%` } }, // Partial match in author
                    { ISBN: { [Op.like]: `%${keyword}%` } } // Exact match in ISBN
                ]
            }
        });

        // Return 200 status with the list of matching books
        return res.status(200).json({
            statusCode: statusCodes.generalCodes.success, // Success status code
            books: books // List of matching books
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Export all functions
module.exports = { GetAllBooks, CreateBook, GetBook, UpdateBook, DeleteBook, SearchBook };
