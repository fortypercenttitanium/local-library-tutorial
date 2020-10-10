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
};
