const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
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

app.use('/api/v1/plants', require('./routes/plantRoutes'));
app.use('/api/v1/users', require('./routes/productRoutes'));
app.use('/api/v1/products', require('./routes/greenhouseRoutes'));
app.use('/api/v1/greenhouses', require('./routes/userRoutes'));
app.use('/api/v1/articles', require('./routes/articleRoutes'));
app.use('/api/v1/reviews-article', require('./routes/reviewArticleRoutes'));
app.use(
  '/api/v1/reviews-greenhouse',
  require('./routes/reviewGreenhouseRoutes')
);
app.use('/api/v1/jobs', require('./routes/jobRoutes'));
app.use('/api/v1/questions', require('./routes/questionRoutes'));
app.use('/api/v1/answers', require('./routes/answerRoutes'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//GLOBAL ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
