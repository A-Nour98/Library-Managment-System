const { GetAllCheckouts, CreateCheckout, GetCheckout, ReturnBook, GetBorrowerCheckouts, GetOverdueBooks} = require('../controllers/checkout');

const router = require('express').Router();

router.route('/create').post(CreateCheckout);
router.route('/return/:id').put(ReturnBook);
router.route('/list/:borrower_id').get(GetBorrowerCheckouts);
router.route('/overdue').get(GetOverdueBooks);
router.route('/:id').get(GetCheckout);
router.route('/').get(GetAllCheckouts);
module.exports = router;