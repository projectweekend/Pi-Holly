var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


IndoorEnvironmentalDataSchema = Schema( {
	id: ObjectId,
	date: {
		type: Date,
		default: Date.now
	},
	temperature: Number,
	humidity: Number,
	pressure: Number
} );
IndoorEnvironmentalData = mongoose.model( 'IndoorEnvironmentalData', IndoorEnvironmentalDataSchema );


SystemTemperatureDataSchema = Schema( {
	id: ObjectId,
	date: {
		type: Date,
		default: Date.now
	},
	celsius: Number,
	fahrenheit: Number
} );
SystemTemperatureData = mongoose.model( 'SystemTemperatureData', SystemTemperatureDataSchema );


SystemMemoryDataSchema = Schema( {
	id: ObjectId,
	date: {
		type: Date,
		default: Date.now
	},
    total: Number,
    used: Number,
    free: Number,
    shared: Number,
    buffers: Number,
    cached: Number
} );
SystemMemoryData = mongoose.model( 'SystemMemoryData', SystemMemoryDataSchema );


SystemStorageDataSchema = Schema( {
	id: ObjectId,
	date: {
		type: Date,
		default: Date.now
	},
    available: Number,
    used: Number,
    percent: Number
} );
SystemStorageData = mongoose.model( 'SystemStorageData', SystemStorageDataSchema );


SystemConfigDataSchema = Schema( {
	id: ObjectId,
	date: {
		type: Date,
		default: Date.now
	},
	arm_freq: Number,
	config_hdmi_boost: Number,
	core_freq: Number,
	disable_overscan: Number,
	disable_splash: Number,
	emmc_pll_core: Number,
	force_pwm_open: Number,
	hdmi_force_hotplug: Number,
	hdmi_group: Number,
	hdmi_ignore_edid: String,
	hdmi_mode: Number,
	hdmi_safe: Number,
	overscan_bottom: Number,
	overscan_left: Number,
	overscan_right: Number,
	overscan_top: Number,
	pause_burst_frames: Number,
	program_serial_random: Number,
	sdram_freq: Number,
	second_boot: Number,
	temp_limit: Number
} );
SystemConfigData = mongoose.model( 'SystemConfigData', SystemConfigDataSchema );


NewsSourceConfigSchema = Schema( {
	id: ObjectId,
	date: Date,
	url: String
} );
NewsSourceConfig = mongoose.model( 'NewsSourceConfig', NewsSourceConfigSchema );


NewsArticleSchema = Schema( {
	id: ObjectId,
	title: String,
	summary: String,
	image_url: String,
	url: String,
	keywords: [String]
} );
NewsArticle = mongoose.model( 'NewsArticle', NewsArticleSchema );


NewsArticleKeywordSchema = Schema( {
	id: ObjectId,
	word: {
		type: String,
		index: true,
		unique: true
	},
	score: Number
} );
NewsArticleKeyword = mongoose.model( 'NewsArticleKeyword', NewsArticleKeywordSchema );
