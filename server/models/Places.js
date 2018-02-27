const mongoose = require('mongoose');
const { Schema } = mongoose;

const Places = new Schema({
	twitterId: String,
	details: [
		{
			resId: String,
			count: Number
		}
	]
});

mongoose.model('places', Places);
