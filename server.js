const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 3000;
const app = express();
const bookRouter = require('./routes/book.js')
const borrowerRouter = require('./routes/borrower.js')
const checkoutRouter = require('./routes/checkout.js');
const sequelize = require('./config/database.js');

app.get('/', (req,res)=> {
    res.status(200).json({
        status: 'success',
        message: 'Server is connected and running'
    });
});

app.use(express.json());


/*(async () => {
    try {
      await sequelize.sync({ force: true }); // Recreate tables and indexes
      console.log('Database synced and indexes created!');
    } catch (err) {
      console.error('Error syncing database:', err);
    }
  })();*/
app.use('/api/book',bookRouter);
app.use('/api/borrower',borrowerRouter);
app.use('/api/checkout',checkoutRouter);

app.listen(port, () => {
    console.log("Server is up and running");
});