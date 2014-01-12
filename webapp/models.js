var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


IndoorEnvironmentalDataSchema = Schema( {
	id: ObjectId,
	date: Date,
	temperature: Number,
	humidity: Number,
	pressure: Number
} );
IndoorEnvironmentalData = mongoose.model( 'IndoorEnvironmentalData', IndoorEnvironmentalDataSchema );


SystemTemperatureDataSchema = Schema( {
	id: ObjectId,
	date: Date,
	celsius: Number,
	fahrenheit: Number
} );
SystemTemperatureData = mongoose.model( 'SystemTemperatureData', SystemTemperatureDataSchema );


SystemMemoryDataSchema = Schema( {
	id: ObjectId,
	date: Date,
    total: Number,
    used: Number,
    free: Number,
    shared: Number,
    buffers: Number,
    cached: Number
} );
SystemMemoryData = mongoose.model( 'SystemMemoryData', SystemMemoryDataSchema );
