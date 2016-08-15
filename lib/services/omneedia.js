var EventEmitter = require("events").EventEmitter
var util = require("util");

function OA_Auth(options) {
	this.on("request", this.onRequest.bind(this));
	EventEmitter.call(this);
};

util.inherits(OA_Auth, EventEmitter);

var OA={
	authenticate: function(req,res,callback) {
		if (typeof req.query.pid=="undefined") {
			var redirectURL = req.session.host;
    		res.writeHead(307, {'Location': redirectURL});
    		res.write('<a href="' + redirectURL + '">CAS login</a>');
    		res.end();			
		} else {
			// we collect information
			GLOBAL.Request({
				url: req.session.host+'/pid?pid='+req.query.pid
				, method: "get"
			}, function (err, resp, body) {		
				callback(null,true,JSON.parse(body.toString('utf-8')),null);
			});
		}
	}
};

OA_Auth.prototype.onRequest = function(req, res) {
	var _p=this;

	var ip = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	
	OA.authenticate(req, res, function(err, status, profile, extended) {
		profile.service="omneedia";
		if (err) {
			_p.emit("error", req, res, err);
		} else {
			_p.emit("auth", req, res, profile)
		}
	});
	
};

module.exports = OA_Auth;
