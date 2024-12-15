const { GetAllBooks, CreateBook, GetBook, UpdateBook, DeleteBook, SearchBook} = require('../controllers/book');

const router = require('express').Router();

router.route('/create').post(CreateBook);
router.route('/search/:keyword').get(SearchBook);
router.route('/update/:id').put(UpdateBook);
router.route('/delete/:id').delete(DeleteBook);
router.route('/:id').get(GetBook);
router.route('/').get(GetAllBooks);


module.exports = router;