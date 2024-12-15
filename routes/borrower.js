const { GetAllBorrowers, CreateBorrower, GetBorrower, UpdateBorrower, DeleteBorrower} = require('../controllers/borrower');

const router = require('express').Router();

router.route('/create').post(CreateBorrower);
router.route('/update/:id').put(UpdateBorrower);
router.route('/delete/:id').delete(DeleteBorrower);
router.route('/:id').get(GetBorrower);
router.route('/').get(GetAllBorrowers);
module.exports = router;