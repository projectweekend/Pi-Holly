
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/**
 * Configuration
 */

// all environments
app.set('port', process.env.WEBAPP_PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


// connect to the db
var mongoUri = process.env.MONGO_URL ||
    'mongodb://localhost/holly-webapp-db';

mongoose.connect(mongoUri);
var db = mongoose.connection;


// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
}


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/indoor/temperature', api.indoorTemperatureData);
app.post('/api/indoor/temperature', api.indoorTemperatureData);
app.post('/api/indoor/temperature/bulk', api.indoorTemperatureDataBulk);
app.get('/api/indoor/temperature/recent', api.indoorTemperatureDataRecent);

app.get('/api/indoor/humidity', api.indoorHumidityData);
app.post('/api/indoor/humidity', api.indoorHumidityData);
app.post('/api/indoor/humidity/bulk', api.indoorHumidityDataBulk);
app.get('/api/indoor/humidity/recent', api.indoorHumidityDataRecent);

app.get('/api/starbug/temperature', api.starbugTemperatureData);
app.post('/api/starbug/temperature', api.starbugTemperatureData);
app.get('/api/starbug/temperature/recent', api.starbugTemperatureDataRecent);
app.get('/api/starbug/temperature/stats', api.starbugTemperatureDataStats);

app.get('/api/reporting/system-temperature-data/all', api.systemTemperatureDataReportingAll);
app.get('/api/reporting/system-temperature-data/recent', api.systemTemperatureDataReportingRecent);
app.get('/api/reporting/system-temperature-data/stats', api.systemTemperatureDataReportingStats);

app.get('/api/system-temperature-data', api.systemTemperatureData);
app.get('/api/system-memory-data', api.systemMemoryData);
app.get('/api/system-storage-data', api.systemStorageData);
app.get('/api/system-config-data', api.systemConfigData);

app.get('/api/news-source/config', api.newsSourceConfig);
app.post('/api/news-source/config', api.newsSourceConfig);
app.put('/api/news-source/config', api.newsSourceConfig);
app.delete('/api/news-source/config', api.newsSourceConfig);

app.get('/api/news-articles', api.newsArticles);
app.get('/api/article-keywords', api.articleKeywords);

app.post('/api/news-articles/read', api.readArticle);
app.post('/api/news-articles/ignore', api.ignoreArticle);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
