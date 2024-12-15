const generalCodes = {
    success:0,
    unknown:1
}

const bookCodes = {
    bookNotFound: 101,
    bookISBNAlreadyExists:102,
    bookValidationError:103
}

const borrowerCodes = {
    borrowerNotFound: 201,
    borrowerEmailAlreadyExists:202,
    borrowerValidationError:203
}

const checkoutCodes = {
    checkoutNotFound: 301,
    checkoutValidationError:302,
    checkoutInsufficientBookQuantity:303,
    bookAlreadyReturned:304
}
module.exports = {generalCodes,bookCodes, borrowerCodes, checkoutCodes}