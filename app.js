require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const helmet = require('helmet');
const catalogRouter = require('./routes/catalog');
const compression = require('compression');
const helpers = require('./views/helpers/helpers');
const { MongoClient } = require('mongodb');
const _handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {
	allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

const mongoDB = `mongodb+srv://ayounger:${process.env.PASSWORD}@locallibrary.rco6r.mongodb.net/local_library?retryWrites=true&w=majority`;

mongoose.connect(mongoDB, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

// view engine setup
const hbs = exphbs.create({
	extname: 'hbs',
	layoutsDir: './views/layouts',
	defaultLayout: 'defaultLayout.hbs',
	partialsDir: path.join(__dirname, 'views/partials'),
	handlebars: allowInsecurePrototypeAccess(_handlebars),
	helpers: helpers,
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
