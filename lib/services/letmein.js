var EventEmitter = require("events").EventEmitter
var util = require("util");

function LetMeIn_Auth(options) {
	this.on("request", function(req, res) {
		var _p=this;

		var ip = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
		var OA={
			authenticate: function(req,res,callback) {
				if (typeof req.query.pid=="undefined") {
					var redirectURL = options.host;
					res.writeHead(307, {'Location': redirectURL});
					res.write('<a href="' + redirectURL + '">login</a>');
					res.end();			
				} else {
					// we collect information
					global.Request({
						url: options.host.split('/login')[0]+'/pid'
						, method: "post"
						, form: {
							pid: req.query.pid
						}
					}, function (err, resp, body) {	
						console.log(err);
						var response=JSON.parse(body.toString('utf-8'));
						console.log(body.toString('utf-8'));
						callback(null,true,"stephane.zucatti@cerema.fr",null);
					});
				}
			}
		};
		OA.authenticate(req, res, function(err, status, username, extended) {
			var profile={
				service: "letmein",
				username: username
			};
			if (err) {
				_p.emit("error", req, res, err);
			} else {
				_p.emit("auth", req, res, profile)
			}
		});
	
	});
	EventEmitter.call(this);
};

util.inherits(LetMeIn_Auth, EventEmitter);

module.exports = LetMeIn_Auth;
