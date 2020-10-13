const Genre = require('../models/genre');
const async = require('async');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

// Display list of all Genre.
exports.genre_list = function (req, res, next) {
	Genre.find()
		.sort({ name: 'ascending' })
		.exec(function (err, list_genres) {
			if (err) {
				return next(err);
			}
			res.render('genre_list', {
				title: 'Genre List',
				genre_list: list_genres,
			});
		});
};

// Display detail page for a specific Genre.
exports.genre_detail = function (req, res, next) {
	async.parallel(
		{
			genre: function (callback) {
				Genre.findById(req.params.id).exec(callback);
			},
			genre_books: function (callback) {
				Book.find({ genre: req.params.id }).exec(callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			if (results.genre == null) {
				let err = new Error('Genre Not Found');
				err.status = 404;
				return next(err);
			}
			res.render('genre_detail', {
				title: 'Genre Detail',
				genre: results.genre,
				genre_books: results.genre_books,
			});
		}
	);
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res, next) {
	res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
	// validate/sanitize name field
	body('name', 'Genre name is required').trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		// check for and extract errors
		const errors = validationResult(req);
		console.log(errors);
		// create genre eith escaped and trimmed data
		const genre = new Genre({
			name: req.body.name,
		});
		if (!errors.isEmpty()) {
			// there are errors, render the form again with sanitized values and error message
			res.render('genre_form', {
				title: 'Create Genre',
				genre: genre,
				errors: errors.array(),
			});
			return;
		} else {
			// check if genre of the same name exists
			Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
				if (err) {
					return next(err);
				}
				if (found_genre) {
					// genre already exists, let me show you
					res.redirect(found_genre.url);
				} else {
					genre.save(function (err) {
						if (err) {
							return next(err);
						}
						res.redirect(genre.url);
					});
				}
			});
		}
	},
];

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res, next) {
	async.parallel(
		{
			genre: function (callback) {
				Genre.findById(req.params.id).exec(callback);
			},
			genre_books: function (callback) {
				Book.find({ genre: req.params.id }).exec(callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			if (results.genre == null) {
				res.redirect('/catalog/genres');
			}
			const { genre, genre_books } = results;
			res.render('genre_delete', {
				title: 'Delete genre',
				genre,
				genre_books,
			});
		}
	);
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res, next) {
	async.parallel(
		{
			genre: function (callback) {
				Genre.findById(req.body.genreid).exec(callback);
			},
			genre_books: function (callback) {
				Book.find({ genre: req.body.genreid }).exec(callback);
			},
		},
		function (err, results) {
			const { genre, genre_books } = results;
			if (err) {
				return next(err);
			}
			if (genre_books.length > 0) {
				res.render('genre_delete', {
					title: 'Delete genre',
					genre,
					genre_books,
				});
				return;
			} else {
				Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
					if (err) {
						return next(err);
					}
					res.redirect('/catalog/genres');
				});
			}
		}
	);
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res, next) {
	// Get genre
	Genre.findById(req.params.id, (err, genre) => {
		if (err) {
			return next(err);
		}
		if (genre == null) {
			const err = new Error('Genre not found');
			err.status = 404;
			return next(err);
		}
		res.render('genre_form', { title: 'Update Genre', genre });
	});
};

// Handle Genre update on POST.
exports.genre_update_post = [
	body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		const errors = validationResult(req);
		const genre = new Genre({
			name: req.body.name,
			_id: req.params.id,
		});
		if (!errors.isEmpty()) {
			res.render('genre_form', {
				title: 'Update Genre',
				genre,
				errors: errors.array(),
			});
			return;
		} else {
			Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, gen) {
				if (err) {
					return next(err);
				}
				res.redirect(gen.url);
			});
		}
	},
];
