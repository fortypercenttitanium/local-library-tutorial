const mongoose = require('mongoose');
const format = require('date-fns/format');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
	first_name: { type: String, required: true, maxlength: 100 },
	family_name: { type: String, required: true, maxlength: 100 },
	date_of_birth: { type: Date },
	date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual('name').get(function () {
	return this.first_name && this.family_name
		? `${this.family_name}, ${this.first_name}`
		: '';
});

// Virtual for author's url
AuthorSchema.virtual('url').get(function () {
	return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual('lifespan').get(function () {
	let birth = 'unknown';
	let death = '';
	if (this.date_of_birth) {
		birth = format(this.date_of_birth, 'MMM do, yyyy');
	}
	if (this.date_of_death) {
		death = format(this.date_of_death, 'MMM do, yyyy');
	}

	return `${birth} - ${death}`;
});

//Export module
module.exports = mongoose.model('Author', AuthorSchema);
