const BookInstance = require('../models/bookInstance');

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
	res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.bookInstance_create_post = function (req, res, next) {
	res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET.
exports.bookInstance_delete_get = function (req, res, next) {
	res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookInstance_delete_post = function (req, res, next) {
	res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookInstance_update_get = function (req, res, next) {
	res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookInstance update on POST.
exports.bookInstance_update_post = function (req, res, next) {
	res.send('NOT IMPLEMENTED: BookInstance update POST');
};
