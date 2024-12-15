const Borrower = require('../db/models/borrower.js'); // Import the Borrower model
const statusCodes = require('../statusCodes.js'); // Import status codes
const { createValidation, updateValidation } = require('../validations/borrowerValidation.js'); // Import validation functions

// Function to create a new borrower
const CreateBorrower = async (req, res) => {
    const body = req.body; // Get request body

    try {
        // Perform validation on the request body
        const validation = createValidation(body);

        if (validation.error) {
            // If validation fails, return 400 status with error message
            return res.status(400).json({
                statusCode: statusCodes.borrowerCodes.borrowerValidationError, // Validation error status code
                message: validation.error.details[0].message // Validation error message
            });
        }

        // Check if a borrower with the same email already exists
        existingBorrower = await Borrower.findOne({ where: { email: body.email } });
        if (existingBorrower) {
            // If a duplicate is found, return 400 status with error message
            return res.status(400).json({
                statusCode: statusCodes.borrowerCodes.borrowerEmailAlreadyExists, // Duplicate email status code
                message: "Borrower email already exists" // Error message
            });
        }

        // Create a new borrower record
        const newBorrower = await Borrower.create({
            email: body.email,
            name: body.name,
            registered_date: new Date() // Record the registration date
        });

        // Return 200 status with the newly created borrower details
        return res.status(200).json({
            status: statusCodes.generalCodes.success, // Success status code
            CreatedBorrower: newBorrower // Newly created borrower details
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to get all borrowers
const GetAllBorrowers = async (req, res) => {
    try {
        // Fetch all borrowers from the database
        const borrowerList = await Borrower.findAll();
        // Send response with status 200 and the list of borrowers
        return res.status(200).json({
            statusCode: statusCodes.generalCodes.success, // Success status code
            borrowerList: borrowerList // List of borrowers
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to get a specific borrower by ID
const GetBorrower = async (req, res) => {
    try {
        // Find the borrower instance by its primary key
        const borrowerInstance = await Borrower.findByPk(req.params.id);
        if (borrowerInstance === null) {
            // If no borrower found, return 404 status with error message
            return res.status(404).json({
                statusCode: statusCodes.borrowerCodes.borrowerNotFound, // Borrower not found status code
                message: "Borrower not found" // Error message
            });
        }
        // If borrower found, return 200 status with the borrower details
        return res.status(200).json({
            status: statusCodes.generalCodes.success, // Success status code
            borrower: borrowerInstance // Borrower details
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to update a borrower
const UpdateBorrower = async (req, res) => {
    const body = req.body; // Get request body

    try {
        // Perform validation on the request body
        const validation = updateValidation(body);

        if (validation.error) {
            // If validation fails, return 400 status with error message
            return res.status(400).json({
                statusCode: statusCodes.borrowerCodes.borrowerValidationError, // Validation error status code
                message: validation.error.details[0].message // Validation error message
            });
        }

        // Find the borrower instance by its primary key
        const borrowerInstance = await Borrower.findByPk(req.params.id, {
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } // Exclude metadata fields
        });

        if (borrowerInstance === null) {
            // If no borrower found, return 404 status with error message
            return res.status(404).json({
                statusCode: statusCodes.borrowerCodes.borrowerNotFound, // Borrower not found status code
                message: "Borrower not found" // Error message
            });
        }

        // Update the borrower instance with new data
        Object.assign(borrowerInstance, body);
        await borrowerInstance.save(); // Save the updated borrower
        await borrowerInstance.reload(); // Reload the borrower instance

        // Return 200 status with the updated borrower details
        return res.status(200).json({
            status: statusCodes.generalCodes.success, // Success status code
            updatedBorrower: borrowerInstance // Updated borrower details
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

// Function to delete a borrower
const DeleteBorrower = async (req, res) => {
    try {
        // Find the borrower instance by its primary key
        const borrowerInstance = await Borrower.findByPk(req.params.id, {
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } // Exclude metadata fields
        });

        if (borrowerInstance === null) {
            // If no borrower found, return 404 status with error message
            return res.status(404).json({
                statusCode: statusCodes.borrowerCodes.borrowerNotFound, // Borrower not found status code
                message: "Borrower not found" // Error message
            });
        }

        // Delete the borrower instance
        await borrowerInstance.destroy();

        // Return 200 status indicating successful deletion
        return res.status(200).json({
            status: statusCodes.generalCodes.success, // Success status code
            message: "Borrower deleted successfully" // Success message
        });
    } catch (err) {
        // Handle any errors that occur
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown, // Unknown error status code
            message: err.message // Error message
        });
    }
};

module.exports = { GetAllBorrowers, CreateBorrower, GetBorrower, UpdateBorrower, DeleteBorrower };
