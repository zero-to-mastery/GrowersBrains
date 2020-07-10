const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const plantRouter = require("./routes/plantRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

//ROUTES

app.use("/api/v1/plants", plantRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//GLOBAL ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
