const Author = require('../models/author');
const async = require('async');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

// Display list of all authors
exports.author_list = function (req, res, next) {
	Author.find()
		.populate('author')
		.sort({ family_name: 'ascending' })
		.exec(function (err, list_authors) {
			if (err) {
				return next(err);
			}
			res.render('author_list', {
				title: 'Author List',
				author_list: list_authors,
			});
		});
};

// Display detail page for a specific author
exports.author_detail = function (req, res, next) {
	async.parallel(
		{
			author: function (callback) {
				Author.findById(req.params.id).exec(callback);
			},
			author_books: function (callback) {
				Book.find({ author: req.params.id }, 'title summary').exec(callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			if (results.author == null) {
				const err = new Error('Author not found');
				err.status = 404;
				return next(err);
			}
			res.render('author_detail', {
				title: 'Author detail',
				author: results.author,
				author_books: results.author_books,
			});
		}
	);
};

// Display author create form on GET
exports.author_create_get = function (req, res, next) {
	res.render('author_form', { title: 'Create Author' });
};

// Handle author create on POST
exports.author_create_post = [
	body('first_name')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('First name must be specified')
		.isAlphanumeric()
		.withMessage('First name must use alphanumeric characters only'),
	body('family_name')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('Family name must be specified')
		.isAlphanumeric()
		.withMessage('Family name must use alphanumeric characters only'),
	body('date_of_birth', 'Invalid date of birth')
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate(),
	body('date_of_death', 'Invalid date of death')
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate(),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// there are errors
			res.render('author_form', {
				title: 'Create Author',
				author: req.body,
				errors: errors.array(),
			});
			return;
		} else {
			// data is valid
			const {
				first_name,
				family_name,
				date_of_birth,
				date_of_death,
			} = req.body;
			const author = new Author({
				first_name,
				family_name,
				date_of_birth,
				date_of_death,
			});
			author.save(function (err) {
				if (err) {
					return next(err);
				}
				res.redirect(author.url);
			});
		}
	},
];

// Display Author delete form on GET
exports.author_delete_get = function (req, res, next) {
	async.parallel(
		{
			author: function (callback) {
				Author.findById(req.params.id).exec(callback);
			},
			author_books: function (callback) {
				Book.find({ author: req.params.id }).exec(callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			if (results.author == null) {
				res.redirect('/catalog/authors');
			}
			const { author, author_books } = results;
			res.render('author_delete', {
				title: 'Delete author',
				author,
				author_books,
			});
		}
	);
};

// Display Author delete form on POST
exports.author_delete_post = function (req, res, next) {
	async.parallel(
		{
			author: function (callback) {
				Author.findById(req.body.authorid).exec(callback);
			},
			author_books: function (callback) {
				Book.find({ author: req.body.authorid }).exec(callback);
			},
		},
		function (err, results) {
			const { author, author_books } = results;
			if (err) {
				return next(err);
			}
			if (author_books.length > 0) {
				res.render('author_delete', {
					title: 'Delete author',
					author,
					author_books,
				});
				return;
			} else {
				Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
					if (err) {
						return next(err);
					}
					res.redirect('/catalog/authors');
				});
			}
		}
	);
};

// Display author update form on GET
exports.author_update_get = function (req, res, next) {
	Author.findById(req.params.id).exec((err, author) => {
		if (err) {
			return next(err);
		}
		if (author == null) {
			const err = new Error('Author not found');
			err.status = 404;
			return next(err);
		}
		res.render('author_form', { title: 'Update Author', author });
	});
};

// Display author update form on POST
exports.author_update_post = [
	body('first_name')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('First name must be specified')
		.isAlphanumeric()
		.withMessage('First name must use alphanumeric characters only'),
	body('family_name')
		.isLength({ min: 1 })
		.trim()
		.escape()
		.withMessage('Family name must be specified')
		.isAlphanumeric()
		.withMessage('Family name must use alphanumeric characters only'),
	body('date_of_birth', 'Invalid date of birth')
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate(),
	body('date_of_death', 'Invalid date of death')
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate(),
	(req, res, next) => {
		const errors = validationResult(req);
		const { first_name, family_name, date_of_birth, date_of_death } = req.body;
		const author = new Author({
			first_name,
			family_name,
			date_of_birth,
			date_of_death,
			_id: req.params.id,
		});
		if (!errors.isEmpty()) {
			res.render('author_form', {
				title: 'Update Author',
				author,
				errors: errors.array(),
			});
			return;
		} else {
			Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor) => {
				if (err) {
					return next(err);
				}
				res.redirect(theauthor.url);
			});
		}
	},
];
