const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = function (req, res, next) {
	async.parallel(
		{
			book_count: function (callback) {
				// passing empty objects retuns all documents
				Book.countDocuments({}, callback);
			},
			book_instance_count: function (callback) {
				BookInstance.countDocuments({}, callback);
			},
			book_instance_available_count: function (callback) {
				BookInstance.countDocuments({ status: 'Available' }, callback);
			},
			author_count: function (callback) {
				Author.countDocuments({}, callback);
			},
			genre_count: function (callback) {
				Genre.countDocuments({}, callback);
			},
		},
		function (err, result) {
			res.render('index', {
				title: 'Local Library Home',
				error: err,
				data: result,
			});
		}
	);
};

// Display list of all books.
exports.book_list = function (req, res, next) {
	Book.find({}, 'title author')
		.populate('author')
		.exec(function (err, list_books) {
			if (err) {
				return next(err);
			}
			res.render('book_list', {
				title: 'Book List',
				book_list: list_books.sort((a, b) =>
					a.title.toUpperCase() < b.title.toUpperCase() ? -1 : 1
				),
			});
		});
};

// Display detail page for a specific book.
exports.book_detail = function (req, res, next) {
	async.parallel(
		{
			book: function (callback) {
				Book.findById(req.params.id)
					.populate('author')
					.populate('genre')
					.exec(callback);
			},
			book_instance: function (callback) {
				BookInstance.find({ book: req.params.id }).exec(callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			if (results.book == null) {
				let err = new Error('No books found');
				err.status = 404;
				return next(err);
			}
			res.render('book_details', {
				title: results.book.title,
				book: results.book,
				book_instances: results.book_instance,
			});
		}
	);
};

// Display book create form on GET.
exports.book_create_get = function (req, res) {
	async.parallel(
		{
			authors: function (callback) {
				Author.find(callback);
			},
			genres: function (callback) {
				Genre.find(callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			const { authors, genres } = results;
			res.render('book_form', { title: 'New Book', authors, genres });
		}
	);
};

// Handle book create on POST.
exports.book_create_post = [
	(req, res, next) => {
		if (!(req.body.genre instanceof Array)) {
			req.body.genre =
				typeof req.body.genre === 'undefined' ? [] : new Array(req.body.genre);
		}
		next();
	},
	body('title', 'Title must not be empty').isLength({ min: 1 }).trim().escape(),
	body('author', 'Author must not be empty')
		.isLength({ min: 1 })
		.trim()
		.escape(),
	body('summary', 'Summary must not be empty')
		.isLength({ min: 1 })
		.trim()
		.escape(),
	body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim().escape(),
	body('genre.*').escape(),
	(req, res, next) => {
		const errors = validationResult(req);
		const { title, author, summary, isbn, genre } = req.body;
		const book = new Book({ title, author, summary, isbn, genre });
		if (!errors.isEmpty()) {
			// there are errors
			async.parallel(
				{
					authors: function (callback) {
						Author.find(callback);
					},
					genres: function (callback) {
						Genre.find(callback);
					},
				},
				function (err, results) {
					const { authors, genres } = results;
					if (err) {
						return next(err);
					}
					results.genres.forEach((g, i) => {
						if (book.genre.indexOf(g._id) > -1) {
							g.checked = 'true';
						}
					});
					res.render('book_form', {
						title: 'Create Book',
						authors,
						genres,
						book,
						errors: errors.array(),
					});
					return;
				}
			);
		} else {
			book.save(function (err) {
				if (err) {
					return next(err);
				}
				res.redirect(book.url);
			});
		}
	},
];

// Display book delete form on GET.
exports.book_delete_get = function (req, res, next) {
	res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res, next) {
	res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function (req, res, next) {
	res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function (req, res, next) {
	res.send('NOT IMPLEMENTED: Book update POST');
};
