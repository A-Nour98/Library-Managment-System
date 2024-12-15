const Book = require('../db/models/book.js');
const Borrower = require('../db/models/borrower.js');
const Checkout = require('../db/models/checkout.js');

const statusCodes = require('../status_codes.js');
const {createValidation, updateValidation} = require('../validations/checkoutValidation.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const GetAllCheckouts = async(req,res)=>{
    try
    {
        const checkoutList = await Checkout.findAll();
        return res.status(200).json({
            statusCodes: statusCodes.generalCodes.success,
            checkoutList: checkoutList
        });
    }
    catch(err){
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }
};

const GetCheckout = async (req, res) => {
    try{
        const checkoutInstance = await Checkout.findByPk(req.params.id);
        if(checkoutInstance===null)
            return res.status(404).json({
                statusCode: statusCodes.checkoutCodes.checkoutNotFound,
                message: "Checkout not found"
            });
            return res.status(200).json({
                status: statusCodes.generalCodes.success,
                checkout: checkoutInstance
            });
    }
    catch(err){
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }
};

const CreateCheckout = async (req, res) => {
    const body = req.body;
    //perform validation: due date as well
    try{
        const borrowerInstance = await Borrower.findByPk(body.borrower_id);
        if(borrowerInstance === null)
            return res.status(404).json({
                statusCode: statusCodes.borrowerCodes.borrowerNotFound,
                message: 'Borrower not found'
        });
        const bookInstance = await Book.findByPk(body.ISBN);
        console.log(bookInstance);
        if(bookInstance === null)
            return res.status(404).json({
                statusCode: statusCodes.bookCodes.bookNotFound,
                message: 'Book not found'
        });
        if(bookInstance.quantity<1)
            return res.status(400).json({
                statusCode: statusCodes.checkoutCodes.checkoutInsufficientBookQuantity,
                message: 'Insufficient book quantity'
        });

        const newCheckout = await Checkout.create({
        ISBN: body.ISBN,
        borrower_id: body.borrower_id,
        due_date: body.due_date,
        returned: false
        });

        await bookInstance.decrement('quantity', { by: 1 });  

        return res.status(200).json({
            status: statusCodes.generalCodes.success,
            createdCheckout: newCheckout
        });
}
    catch(err){
        console.log(err)
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }

};

const ReturnBook = async (req, res) => {
    const body = req.body;
    try{
        const checkoutInstance = await Checkout.findByPk(req.params.id);
        if(checkoutInstance===null)
            return res.status(404).json({
                statusCode: statusCodes.checkoutCodes.checkoutNotFound,
                message: "Checkout not found"
            });
        if(checkoutInstance.returned==true)
            return res.status(400).json({
                statusCodes: statusCodes.checkoutCodes.bookAlreadyReturned,
                message: "Book Already Returned"
        })
        const bookInstance = await Book.findByPk(checkoutInstance.ISBN);
        bookInstance.increment('quantity', {by:1})
        checkoutInstance.update({ returned: true });
        checkoutInstance.save();
        return res.status(200).json({
            status: statusCodes.generalCodes.success,
            message: "Book returned successfully" });
        }
        
        catch(err){
            console.log(err)
            return res.status(400).json({
                statusCode: statusCodes.generalCodes.unknown,
                message: err.message});
        }
};

const GetBorrowerCheckouts = async(req,res)=>{
    try{
        const borrowerInstance = await Borrower.findByPk(req.params.borrower_id);
        if(borrowerInstance === null)
            return res.status(404).json({
                statusCode: statusCodes.borrowerCodes.borrowerNotFound,
                message: 'Borrower not found'
        });
        const checkoutList= await Checkout.findAll({where:{borrower_id:req.params.borrower_id, returned: false}}) ;
        return res.status(200).json({
            statusCode: statusCodes.generalCodes.success,
            checkoutList: checkoutList
        });
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }
};

const GetOverdueBooks = async(req,res)=>{
    try
    {
        const checkoutList = await Checkout.findAll({where:{
                                                        due_date :
                                                            {[Op.lt]: new Date()},
                                                        returned:false    
                                                            }});
        return res.status(200).json({
            statusCodes: statusCodes.generalCodes.success,
            overdueBooksList: checkoutList
        });
    }
    catch(err){
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }
};
module.exports = {GetAllCheckouts, GetCheckout, CreateCheckout, ReturnBook, GetBorrowerCheckouts,GetOverdueBooks};