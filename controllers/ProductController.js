var uuid = require('node-uuid');
var Q = require("q");
var Product = require("../models/Product");

var createProduct = function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var description = req.body.description;
	var categoryId = req.body.categoryId;

	createProductInternal(name, price, description, categoryId).then(function(response){
		if ( !response.success ){
			res.statusCode = 500;
		}
		res.send(response);
	});
};

var getProducts = function(req, res){
	getProductsInternal().then(function(entities){
		res.send(entities);
	});
};

var getProductById = function(req, res){
	
	var productId = req.params.id;

	getProductByIdInternal(productId).then(function(entity){
		if ( !entity ){
			res.statusCode = 500;
		}
		res.send(entity);
	});
};

var createProductInternal = function(name, price, description, categoryId){
	var deferred = Q.defer();

	Product.findOne({name: name}, function(err, entity){
		if ( entity ){
			deferred.resolve({success:false, errorMessage:"A Product with that name already exists"});
			return;
		}
		
		var product = new Product();
		product.name = name;
		product.price = price;
		product.description = description;
		product.category = categoryId;
		product.created = new Date();

		product.save(function(err, productEntity){
			if ( err ){
				deferred.resolve({success:false, errorMessage:"Failed to save product [" + err.toString() + "]"});
				return;
			}
			deferred.resolve({success:true, entity:productEntity});
		});

	});

	return deferred.promise;
};

var getProductsInternal = function(){
	var deferred = Q.defer();

	Product.find({}, function(err, entities){
		deferred.resolve(entities);
	});

	return deferred.promise;
};

var getProductByIdInternal = function(id){
	var deferred = Q.defer();

	Product.findOne({_id:id}, function(err, entity){
		deferred.resolve(entity);
	});

	return deferred.promise;
};

module.exports = {
	createProduct: createProduct,
	getProducts: getProducts,
	getProductById: getProductById
};