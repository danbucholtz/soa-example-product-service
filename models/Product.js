var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
	name: String,
    price : Number,
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
	updated: { type: Date, default: Date.now },
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);