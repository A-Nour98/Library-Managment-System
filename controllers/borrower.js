const { exist } = require('joi');
const Borrower = require('../db/models/borrower.js');
const statusCodes = require('../status_codes.js');
const {createValidation, updateValidation} = require('../validations/borrowerValidation.js');

const CreateBorrower = async(req,res)=>{
    const body = req.body;
    try{
        const validation = createValidation(body);
        if (validation.error) {
            return res.status(400).json({statusCode: statusCodes.borrowerCodes.borrowerValidationError,
                message: validation.error.details[0].message}); 
        } 

        existingBorrower = await Borrower.findOne({ where: { email: body.email } });
        if(existingBorrower)
            return res.status(400).json({
                statusCode: statusCodes.borrowerCodes.borrowerEmailAlreadyExists,
                message: "Borrower email already exists"});

        const newBorrower  = await Borrower.create({
            email: body.email,
            name: body.name,
            registered_date: new Date()
            });
    
            return res.status(200).json({
                status: statusCodes.generalCodes.success,
                CreatedBorrower: newBorrower
            });
    }
    catch(err){
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }
};
const GetAllBorrowers = async(req,res)=>{
    try
    {
        const borrowerList = await Borrower.findAll();
        return res.status(200).json({
            statusCodes: statusCodes.generalCodes.success,
            borrowerList: borrowerList
        });
    }
    catch(err){
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }
};
const GetBorrower = async(req,res)=>{
    try{
        const borrowerInstance = await Borrower.findByPk(req.params.id);
        if(borrowerInstance===null)
            return res.status(404).json({
                statusCode: statusCodes.borrowerCodes.borrowerNotFound,
                message: "Borrower not found"
            });
            return res.status(200).json({
                status: statusCodes.generalCodes.success,
                borrower: borrowerInstance
            });
    }
    catch(err){
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }
};

const UpdateBorrower = async(req,res) =>{
    const body = req.body;
    //perform validation
    
    try{
        
        const validation = updateValidation(body);

        if (validation.error) {
            return res.status(400).json({statusCode: statusCodes.borrowerCodes.borrowerValidationError,
                message: validation.error.details[0].message}); 
        } 
        const borrowerInstance = await Borrower.findByPk(req.params.id,
            {
              attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
            });
        if(borrowerInstance===null)
            return res.status(404).json({
                statusCode: statusCodes.borrowerCodes.borrowerNotFound,
                message: "Borrower not found"
            });

        Object.assign(borrowerInstance,body);
        await borrowerInstance.save();
        await borrowerInstance.reload();
        return res.status(200).json({
            status: statusCodes.generalCodes.success,
            updatedBorrower: borrowerInstance
        });
        
    }
    catch(err){
        return res.status(400).json({
            statusCode: statusCodes.generalCodes.unknown,
            message: err.message});
    }
};

const DeleteBorrower = async(req,res)=>{
    try{
        const borrowerInstance = await Borrower.findByPk(req.params.id,
            {
              attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
            });
        if(borrowerInstance===null)
            return res.status(404).json({
                statusCode: statusCodes.borrowerCodes.borrowerNotFound,
                message: "Borrower not found"
            });
        await borrowerInstance.destroy();
        return res.status(200).json({
            status: statusCodes.generalCodes.success,
            message: "Borrower deleted successfully"
        });
        }

        catch(err){
            return res.status(400).json({
                statusCode: statusCodes.generalCodes.unknown,
                message: err.message});
        }
}
module.exports = {GetAllBorrowers,CreateBorrower,GetBorrower,UpdateBorrower,DeleteBorrower};