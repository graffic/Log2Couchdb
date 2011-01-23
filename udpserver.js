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
	server.on("message", processMessage);
	server.on("listening", function() { 
		var addr = server.address();	
		console.log("listening "+addr.port); 
	});
	server.on("error",function(ex) {console.log(ex);});
	server.bind(31337);
};

/*
	Splits a message into the fundamental parts
*/
function processMessage(buffer,rinfo) {
	var msg = buffer.toString('utf8'),
		msgForDb = msg.split("\t",6),
		messagePos = 0;
		i = 0;

	console.log("Incoming: '" + msg + "' from: " + rinfo.address + ":" + rinfo.port);

	// Check message: 
  // Format: Application<tab>Environment<tab>Level<tab>Timestamp<tab>Where<tab>Message
	if (msgForDb.length != 6) { 
		console.log("Invalid message");
		return;
	}
	
	// Find the message position
	for (;i<5;i++)
		messagePos = msg.indexOf('\t',messagePos+1);
	msgForDb[5]=msg.substr(messagePos+1);

	// Save it
	// We add the version number and we don't add field names (sorry)
	db.save({d:[1].concat(msgForDb)});
	console.log("Saved!");
}
