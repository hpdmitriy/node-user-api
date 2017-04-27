const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: "Необходимо заполнить",
	},
	description: {
		type: String,
		required: "Необходимо заполнить",
	},
	price: {
		type: Number,
		required: "Необходимо заполнить",
	}
}, {
	timestamps: true,
});

userSchema.plugin(beautifyUnique);

userSchema.statics.publicFields = ['description', 'name', 'price'];

module.exports = mongoose.model('User', userSchema);
