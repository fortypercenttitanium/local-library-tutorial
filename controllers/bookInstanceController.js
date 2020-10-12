const BookInstance = require('../models/bookInstance');
const { body, validationResult } = require('express-validator');
const Book = require('../models/book');

// Display list of all BookInstances.
exports.bookInstance_list = function (req, res, next) {
	// no parameters finds and returns all info
	BookInstance.find()
		.populate('book')
		.exec(function (err, list_bookInstances) {
			if (err) {
				return next(err);
			}
			res.render('bookInstance_list', {
				title: 'Book Instance List',
				bookInstance_list: list_bookInstances,
			});
		});
};

// Display detail page for a specific BookInstance.
exports.bookInstance_detail = function (req, res, next) {
	BookInstance.findById(req.params.id)
		.populate('book')
		.exec(function (err, bookInstance) {
			if (err) {
				return next(err);
			}
			if (bookInstance === null) {
				const err = new Error('Book copy not found');
				err.status = 404;
				return next(err);
			}
			res.render('bookInstance_detail', {
				title: `Copy: ${bookInstance.book.title}`,
				bookInstance,
			});
		});
};

// Display BookInstance create form on GET.
exports.bookInstance_create_get = function (req, res, next) {
	Book.find({}, 'title').exec(function (err, results) {
		if (err) {
			return next(err);
		}
		res.render('bookInstance_form', {
			title: 'Create Book Instance',
			books: results,
		});
	});
};

// Handle BookInstance create on POST.
exports.bookInstance_create_post = [
	body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
	body('imprint', 'Imprint must be specified')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('status').trim().escape(),
	body('due_back', 'Invalid date')
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate(),
	function (req, res, next) {
		const errors = validationResult(req);
		const { book, imprint, status, due_back } = req.body;
		const bookInstance = new BookInstance({
			book,
			imprint,
			status,
			due_back,
		});
		if (!errors.isEmpty()) {
			Book.find({}, 'title').exec(function (err, results) {
				if (err) {
					return next(err);
				}
				res.render('bookInstance_form', {
					title: 'Create Book Instance',
					book_list: results,
					selected_book: bookInstance.book._id,
					errors: errors.array(),
				});
			});
			return;
		} else {
			bookInstance.save(function (err) {
				if (err) {
					return next(err);
				}
				res.redirect(bookInstance.url);
			});
		}
	},
];

// Display BookInstance delete form on GET.
exports.bookInstance_delete_get = function (req, res, next) {
	BookInstance.findById(req.params.id)
		.populate('book')
		.exec(function (err, bookInstance) {
			if (err) {
				return next(err);
			}
			if (bookInstance === null) {
				res.redirect('/catalog/bookInstances');
			}
			res.render('bookInstance_delete', {
				title: 'Delete book copy',
				bookInstance,
			});
		});
};

// Handle BookInstance delete on POST.
exports.bookInstance_delete_post = function (req, res, next) {
	BookInstance.findById(req.body.bookInstance_id).exec(function (
		err,
		bookInstance
	) {
		if (err) {
			return next(err);
		} else {
			BookInstance.findByIdAndRemove(req.body.bookInstance_id, function (err) {
				if (err) {
					return next(err);
				}
				res.redirect('/catalog/bookInstances');
			});
		}
	});
};

// Display BookInstance update form on GET.
exports.bookInstance_update_get = function (req, res, next) {
	res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookInstance update on POST.
exports.bookInstance_update_post = function (req, res, next) {
	res.send('NOT IMPLEMENTED: BookInstance update POST');
};
