require.paths.unshift('./cradle/lib/');
require.paths.unshift('./vargs/lib/');

var udp    = require('dgram'),
    cradle = require('./cradle/lib/cradle');

var server = udp.createSocket('udp4');
server.on("message", function(msg, rinfo) {
	console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
});
server.on("listening", function() { console.log("listening"); });

server.bind(31337);
