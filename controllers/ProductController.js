var uuid = require('node-uuid');
var Q = require("q");
var Product = require("../models/Product");

var categoryService = require("soa-example-category-service-api");

var createProduct = function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var description = req.body.description;
	var categoryId = req.body.categoryId;

	var accessToken = req.user.accessToken;

	createProductInternal(accessToken, name, price, description, categoryId).then(function(response){
		if ( !response.success ){
			res.statusCode = 500;
		}
		res.send(response);
	});
};

var deleteProduct = function(req, res){
	var productId = req.body.id;

	deleteProductInternal(productId).then(function(response){
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

var getProductsByCategoryId = function(req, res){
	var categoryId = req.params.id;

	getProductsByCategoryIdInternal(categoryId).then(function(entities){
		res.send(entities);
	});
};

var createProductInternal = function(accessToken, name, price, description, categoryId){
	var deferred = Q.defer();

	// make sure it's a valid categoryId
	categoryService.getCategoryById(accessToken, categoryId).then(function(category){
		if ( !category ){
			deferred.resolve({success:false, errorMessage:"Invalid Category ID [" + categoryId + "]"});
			return;
		}

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

var getProductsByCategoryIdInternal = function(categoryId){
	var deferred = Q.defer();

	Product.find({category:categoryId}, function(err, entities){
		deferred.resolve(entities);
	});

	return deferred.promise;
};

var deleteProductInternal = function(id){
	var deferred = Q.defer();
	getProductByIdInternal(id).then(function(entity){
		if ( !entity ){
			deferred.resolve({success:false, errorMessage:"Could not find Product with ID [" + id + "]"});
			return;
		}
		entity.remove();
		deferred.resolve({success:true});
	});
	return deferred.promise;
};

module.exports = {
	createProduct: createProduct,
	deleteProduct: deleteProduct,
	getProducts: getProducts,
	getProductById: getProductById,
	getProductsByCategoryId: getProductsByCategoryId
};