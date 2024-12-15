const Book = require('../db/models/book.js');
const statusCodes = require('../status_codes.js');
const {createValidation, updateValidation,searchValidation} = require('../validations/bookValidation.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const GetAllBooks = async(req,res)=>{
    try
    {
        const bookList = await Book.findAll();
        return res.status(200).json({
            statusCodes: statusCodes.generalCodes.success,
            bookList: bookList
        });
    }
    catch(err){
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }
};

const GetBook = async (req, res) => {
    try{
        const bookInstance = await Book.findByPk(req.params.id);
        if(bookInstance===null)
            return res.status(404).json({
                statusCode: statusCodes.bookCodes.bookNotFound,
                message: "Book not found"
            });
            return res.status(200).json({
                status: statusCodes.generalCodes.success,
                book: bookInstance
            });
    }
    catch(err){
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }
};
const CreateBook = async (req, res) => {
    const body = req.body;
    //perform validation:espically ISBN
    try{
        const validation = createValidation(body);

        if (validation.error) {
            return res.status(400).json({statusCode: statusCodes.bookCodes.bookValidationError,
                message: validation.error.details[0].message}); 
        } 

        let duplicate = await Book.findByPk(body.ISBN);
        if(duplicate!=null)
            return res.status(400).json({   
                statusCode: statusCodes.bookCodes.bookAlreadyExists, 
                existingBook:duplicate, 
                message: 'Book ISBN already exists'});

        const newBook   = await Book.create({
        ISBN: body.ISBN,
        title: body.title,
        author: body.author,
        quantity: body.quantity,
        shelf_location: body.shelf_location
        });

        return res.status(200).json({
            status: statusCodes.generalCodes.success,
            CreatedBook: newBook
        });
}
    catch(err){
        console.log(err)
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }

};
const UpdateBook = async(req,res) =>{
    const body = req.body;
    //perform validation:espically ISBN
    
    try{
        const validation = updateValidation(body);

        if (validation.error) {
            return res.status(400).json({statusCode: statusCodes.bookCodes.bookValidationError,
                message: validation.error.details[0].message}); 
        } 
        const bookInstance = await Book.findByPk(req.params.id,
            {
              attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
            });
        if(bookInstance===null)
            return res.status(404).json({
                statusCode: statusCodes.bookCodes.bookNotFound,
                message: "Book not found"
            });

        Object.assign(bookInstance,body);
        await bookInstance.save();
        await bookInstance.reload();
        return res.status(200).json({
            status: statusCodes.generalCodes.success,
            updatedBook: bookInstance
        });
        
    }
    catch(err){
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }
};
const DeleteBook = async(req,res) =>{
    try{
        const bookInstance = await Book.findByPk(req.params.id,
            {
              attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
            });
        if(bookInstance===null)
            return res.status(404).json({
                statusCode: statusCodes.bookCodes.bookNotFound,
                message: "Book not found"
            });
        await bookInstance.destroy();
        return res.status(200).json({
            status: statusCodes.generalCodes.success,
            message: "Book deleted successfully"
        });
        }

        catch(err){
            return res.status(400).json({
                statusCode: statusCodes.generalCodes.unknown,
                message: err.message});
        }
};

const SearchBook = async(req,res)=>{
    try {
        const validation = searchValidation(req.params);

        if (validation.error) {
            return res.status(400).json({statusCode: statusCodes.bookCodes.bookValidationError,
                message: validation.error.details[0].message}); 
        } 
        const keyword = req.params.keyword;
        const books = await Book.findAll({
          where: {
            [Op.or]: [
              { title: { [Op.iLike]: `%${keyword}%` } }, // Partial match in title
              { author: { [Op.iLike]: `%${keyword}%` } }, // Partial match in author
              { ISBN: {[Op.like]: `%${keyword}%`}}
            ],
          },
        });
        return res.status(200).json({
            statusCode: statusCodes.generalCodes.success,
            books: books
        });
      } catch (err) {
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
      }
};

module.exports = {GetAllBooks, CreateBook, GetBook, UpdateBook, DeleteBook, SearchBook};