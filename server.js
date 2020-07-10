const mongoose = require("mongoose");
require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 🤯 Shutting down....");
  console.log(err.name, err.message);

  process.exit(1);
});

const app = require("./app");

const uri = process.env.ATLAS_URI.replace(
  "<password>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Successfully connected to the database!"));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}....`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHADLED REJECTION! 🤯 Shutting down....");
  console.log(err);
  //Here we give the server time to finish all the requests that are still panding
  //or being handled at the time, and only after that the server is thein basically killed
  server.close(() => {
    process.exit(1);
  });
});
