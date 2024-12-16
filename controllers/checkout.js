const Book = require('../db/models/book.js'); // Import the Book model
const Borrower = require('../db/models/borrower.js'); // Import the Borrower model
const Checkout = require('../db/models/checkout.js'); // Import the Checkout model
const { Parser } = require('json2csv');
const statusCodes = require('../statusCodes.js'); // Import status codes
const Sequelize = require('sequelize');
const Op = Sequelize.Op; // Destructure and use Sequelize's Op for querying

// Function to get all checkouts
const GetAllCheckouts = async (req, res) => {
    try {
        const checkoutList = await Checkout.findAll(); // Fetch all checkout records
        return res.status(200).json({
            statusCodes: statusCodes.generalCodes.success, // Success status code
            checkoutList: checkoutList // List of checkouts
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to get a specific checkout by ID
const GetCheckout = async (req, res) => {
    try {
        const checkoutInstance = await Checkout.findByPk(req.params.id); // Find the checkout by primary key
        if (checkoutInstance === null) {
            // If no checkout found, return 404 status with error message
            return res.status(404).json({
                statusCode: statusCodes.checkoutCodes.checkoutNotFound, // Checkout not found status code
                message: "Checkout not found" // Error message
            });
        }
        // If checkout found, return 200 status with the checkout details
        return res.status(200).json({
            status: statusCodes.generalCodes.success, // Success status code
            checkout: checkoutInstance // Checkout details
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to create a new checkout
const CreateCheckout = async (req, res) => {
    const body = req.body; // Get request body

    try {
        // Perform validation on the request data
        const borrowerInstance = await Borrower.findByPk(body.borrower_id); // Find the borrower by primary key
        if (borrowerInstance === null) {
            // If borrower not found, return 404 status with error message
            return res.status(404).json({
                statusCode: statusCodes.borrowerCodes.borrowerNotFound, // Borrower not found status code
                message: 'Borrower not found' // Error message
            });
        }

        const bookInstance = await Book.findByPk(body.ISBN); // Find the book by ISBN
        if (bookInstance === null) {
            // If book not found, return 404 status with error message
            return res.status(404).json({
                statusCode: statusCodes.bookCodes.bookNotFound, // Book not found status code
                message: 'Book not found' // Error message
            });
        }

        if (bookInstance.quantity < 1) {
            // If insufficient book quantity, return 400 status with error message
            return res.status(400).json({
                statusCode: statusCodes.checkoutCodes.checkoutInsufficientBookQuantity, // Insufficient quantity status code
                message: 'Insufficient book quantity' // Error message
            });
        }

        // Create a new checkout record
        const newCheckout = await Checkout.create({
            ISBN: body.ISBN,
            borrower_id: body.borrower_id,
            due_date: body.due_date,
            returned: false // Initially, the book is not returned
        });

        // Decrease the book quantity by 1
        await bookInstance.decrement('quantity', { by: 1 });

        // Return 200 status with the newly created checkout details
        return res.status(200).json({
            status: statusCodes.generalCodes.success, // Success status code
            createdCheckout: newCheckout // Newly created checkout details
        });
    } catch (err) {
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to return a book
const ReturnBook = async (req, res) => {
    try {
        const checkoutInstance = await Checkout.findByPk(req.params.id); // Find the checkout by primary key
        if (checkoutInstance === null) {
            // If checkout not found, return 404 status with error message
            return res.status(404).json({
                statusCode: statusCodes.checkoutCodes.checkoutNotFound, // Checkout not found status code
                message: "Checkout not found" // Error message
            });
        }

        if (checkoutInstance.returned === true) {
            // If the book has already been returned, return 400 status with error message
            return res.status(400).json({
                statusCodes: statusCodes.checkoutCodes.bookAlreadyReturned, // Book already returned status code
                message: "Book Already Returned" // Error message
            });
        }

        const bookInstance = await Book.findByPk(checkoutInstance.ISBN); // Find the book by ISBN
        await bookInstance.increment('quantity', { by: 1 }); // Increase the book quantity by 1
        await checkoutInstance.update({ returned: true }); // Mark the checkout as returned
        await checkoutInstance.save(); // Save the updated checkout instance

        // Return 200 status with success message
        return res.status(200).json({
            status: statusCodes.generalCodes.success, // Success status code
            message: "Book returned successfully" // Success message
        });
    } catch (err) {
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to get all checkouts for a specific borrower
const GetBorrowerCheckouts = async (req, res) => {
    try {
        const borrowerInstance = await Borrower.findByPk(req.params.borrower_id); // Find the borrower by primary key
        if (borrowerInstance === null) {
            // If borrower not found, return 404 status with error message
            return res.status(404).json({
                statusCode: statusCodes.borrowerCodes.borrowerNotFound, // Borrower not found status code
                message: 'Borrower not found' // Error message
            });
        }

        // Find all checkouts for this borrower that are not returned
        const checkoutList = await Checkout.findAll({
            where: { borrower_id: req.params.borrower_id, returned: false }
        });

        // Return 200 status with the list of checkouts
        return res.status(200).json({
            statusCode: statusCodes.generalCodes.success, // Success status code
            checkoutList: checkoutList // List of checkouts
        });
    } catch (err) {
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to get all overdue books
const GetOverdueBooks = async (req, res) => {
    try {
        const checkoutList = await Checkout.findAll({
            where: {
                due_date: { [Op.lt]: new Date() }, // Books with a due date before the current date
                returned: false // Books that have not been returned yet
            }
        });

        // Return 200 status with the list of overdue books
        return res.status(200).json({
            statusCodes: statusCodes.generalCodes.success, // Success status code
            overdueBooksList: checkoutList // List of overdue books
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};
const GetBorrowingReport = async (req, res) => {
        try {
            const { startDate, endDate } = req.body;
            console.log(startDate);
            const borrowingData = await Checkout.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [new Date(startDate), new Date(endDate)]
                    }
                }
            });
    
            const fields = ['id', 'ISBN', 'borrower_id', 'due_date', 'returned', 'createdAt'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(borrowingData);
    
            res.header('Content-Type', 'text/csv');
            res.attachment('borrowing_report.csv');
            return res.send(csv);
        } catch (err) {
            return res.status(500).json({ statusCode: statusCodes.generalCodes.unknown, message: err.message });
        }
    };


module.exports = { GetAllCheckouts, GetCheckout, CreateCheckout, ReturnBook, GetBorrowerCheckouts, GetOverdueBooks, GetBorrowingReport };
