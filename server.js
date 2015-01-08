var mongoose = require('mongoose');
var service = require("soa-example-core-service");
var config = require("soa-example-service-config").config();

var productController = require('./controllers/ProductController');

mongoose.connect(config.mongoUri);

var app = service.createApiServer(config.productServicePort);

app.post('/products', service.ensureAuthenticated, productController.createProduct);
app.post('/products/delete', service.ensureAuthenticated, productController.deleteProduct);
app.get('/products', service.ensureAuthenticated, productController.getProducts);
app.get('/products/:id', service.ensureAuthenticated, productController.getProductById);
app.get('/products/category/:id', service.ensureAuthenticated, productController.getProductsByCategoryId);