const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/userModel');
const Article = require('../models/articleModel');
const Greenhouse = require('../models/greenhouseModel');
const Product = require('../models/productModel');
const Plant = require('../models/plantModel');
const Question = require('../models/questionModel');
const Answer = require('../models/answerModel');
const ReviewGreenhouse = require('../models/reviewGreenhouseModel');
const ReviewArticle = require('../models/reviewArticleModel');
const Job = require('../models/jobModel');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILES
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8')
);
const articles = JSON.parse(
  fs.readFileSync(`${__dirname}/data/articles.json`, 'utf-8')
);
const greenhouses = JSON.parse(
  fs.readFileSync(`${__dirname}/data/greenhouses.json`, 'utf-8')
);
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/data/products.json`, 'utf-8')
);
const plants = JSON.parse(
  fs.readFileSync(`${__dirname}/data/plants.json`, 'utf-8')
);
const questions = JSON.parse(
  fs.readFileSync(`${__dirname}/data/questions.json`, 'utf-8')
);
const answers = JSON.parse(
  fs.readFileSync(`${__dirname}/data/answers.json`, 'utf-8')
);
const reviewsArticle = JSON.parse(
  fs.readFileSync(`${__dirname}/data/reviewsArticle.json`, 'utf-8')
);
const reviewsGreenhouse = JSON.parse(
  fs.readFileSync(`${__dirname}/data/reviewsGreenhouse.json`, 'utf-8')
);
const jobs = JSON.parse(
  fs.readFileSync(`${__dirname}/data/jobs.json`, 'utf-8')
);

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Plant.create(plants, { validateBeforeSave: false });
    await Article.create(articles, { validateBeforeSave: false });
    await Greenhouse.create(greenhouses, { validateBeforeSave: false });
    await ReviewGreenhouse.create(reviewsGreenhouse, {
      validateBeforeSave: false,
    });
    await ReviewArticle.create(reviewsArticle, { validateBeforeSave: false });
    await Product.create(products, { validateBeforeSave: false });
    await Question.create(questions, { validateBeforeSave: false });
    await Answer.create(answers, { validateBeforeSave: false });
    await Job.create(jobs, { validateBeforeSave: false });

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM THE DATABASE
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Article.deleteMany();
    await Greenhouse.deleteMany();
    await Product.deleteMany();
    await Plant.deleteMany();
    await Question.deleteMany();
    await Answer.deleteMany();
    await ReviewGreenhouse.deleteMany();
    await ReviewArticle.deleteMany();
    await Job.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
