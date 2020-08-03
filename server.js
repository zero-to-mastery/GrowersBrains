const mongoose = require('mongoose');
require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🤯 Shutting down....');
  console.log(err.name, err.message);

  process.exit(1);
});

const app = require('./app');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('Successfully connected to the database!'))
  .catch((err) => console.error(err));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}....`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHADLED REJECTION! 🤯 Shutting down....');
  console.log(err);
  //Here we give the server time to finish all the requests that are still pending
  //or being handled at the time, and only after that the server is thein basically killed
  server.close(() => {
    process.exit(1);
  });
});
