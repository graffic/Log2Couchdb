// Include needed modules
var udp    = require('dgram'),
    cradle = require('cradle'),
		couch  = new(cradle.Connection);

// Prepare database
var db = new(cradle.Connection)('127.0.0.1').database("logs");
db.exists(function (message, result) {
	if (result == false)
		db.create(startApp);
	else
		startApp();
});

function startApp () {
	var server = udp.createSocket('udp4');
	server.on("message", function(msg, rinfo) {
		console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
	});
	server.on("listening", function() { console.log("listening"); });

	server.bind(31337);
};

function processMessage(msg,rinfo) {
	console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
	// Check message
	// Save it
	db.save({
		App:"",
		Env:"",
		Level:"",
		Timestamp:"",
		Where:"",
		Msg:""		
	});
}
