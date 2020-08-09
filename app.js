const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const plantRouter = require('./routes/plantRoutes');
const productRouter = require('./routes/productRoutes');
const greenhouseRouter = require('./routes/greenhouseRoutes');
const userRouter = require('./routes/userRoutes');
const articleRouter = require('./routes/articleRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

//Devlopment middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Set Security HTTP headers
app.use(helmet());

//Limit requests from the same API
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // allow 100 requests from the same IP for 1 hour
  message: 'Too Many request from that IP ! Please try again after 1 hour.',
});
app.use('/api', limiter); // apply the limiter middleware for all the routes that starts with `/api`

//Body Parser; reading the data from the body to req.body(max 15kb)
app.use(express.json({ limit: '15kb' }));

//Data sanitization , against NOSQL query injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());

//ROUTES

app.use('/api/v1/plants', plantRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/greenhouse', greenhouseRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//GLOBAL ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
