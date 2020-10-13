const Handlebars = require('handlebars');

module.exports = {
	if_eq: function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	},
	if_not_eq: function (a, b, options) {
		return a === b ? options.inverse(this) : options.fn(this);
	},
	less_than_minus_one: function (a, b, options) {
		return a < b - 1 ? options.fn(this) : options.inverse(this);
	},
	genre_exists: function (genre) {
		return genre ? genre.name : '';
	},
	author_first_name_exists: function (author) {
		return author ? author.first_name : '';
	},
	author_family_name_exists: function (author) {
		return author ? author.family_name : '';
	},
	author_date_of_birth_exists: function (author) {
		return author ? author.date_of_birth : '';
	},
	author_date_of_death_exists: function (author) {
		return author ? author.date_of_death : '';
	},
	book_exists: function (book) {
		return book ? book.title : '';
	},
	sort_authors: function (authors) {
		authors.sort((a, b) => {
			return a.toUpperCase() < b.toUpperCase() ? -1 : 1;
		});
	},
	check_book_author: function (book, author) {
		return author._id.toString() === book.author._id.toString() ||
			author._id.toString() == book.author
			? 'selected'
			: '';
	},
	book_exists_summary: function (book) {
		return book ? book.summary : '';
	},
	book_exists_isbn: function (book) {
		return book ? book.isbn : '';
	},
	check_book_instance: function (bookInstance, book) {
		return bookInstance.book.toString() === book._id.toString()
			? 'true'
			: 'false';
	},
	check_bookInstance_imprint: function (bookInstance) {
		return bookInstance ? bookInstance.imprint : '';
	},
	check_bookInstance_due_back: function (bookInstance) {
		return bookInstance ? bookInstance.due_back : '';
	},
	delete_page: function (url) {
		return `${url}/delete`;
	},
	update_page: function (url) {
		return `${url}/update`;
	},
	get_length: function (item, options) {
		return item.length > 0 ? options.fn(this) : options.inverse(this);
	},
	check_genre_checked: function (genre) {
		return genre.checked ? 'checked' : '';
	},
};
