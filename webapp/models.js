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
