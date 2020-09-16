const mongoose = require('mongoose');
require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🤯 Shutting down....');
  console.log(err.name, err.message);

  process.exit(1);
});

const app = require('./app');

// Use this if you will use a local database
mongoose.connect('mongodb://localhost:27017/GrowersBrains')
.then(() => console.log('Successfully connected to the database!'));

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//   })
//   .then(() => console.log('Successfully connected to the database!'));
//No need to add the catch block because we add an event listener to the `unhandledRejection` he will take care of it

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}....`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHADLED REJECTION! 🤯 Shutting down....');
  console.log(err.name, err.message);
  //Here we give the server time to finish all the requests that are still pending
  //or being handled at the time, and only after that the server is thein basically killed
  server.close(() => {
    process.exit(1);
  });
});
