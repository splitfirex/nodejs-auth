var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var User = require('../models/User');
var Session = require('../models/Session');

var sessionActual;

/* GET home page. */
router.post('/authenticate', function (req, res, next) {

    console.log("username" + req.body.username);
    console.log("password" + req.body.password);

    User.findByUsername(req.body.username, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            res.json(user);
            console.log("password2" +user.get("password"));
            // check if password matches
            if (user.get("password") != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });

});

router.use(function (req, res, next) {

    sessionActual = new Session();
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    sessionActual.set("ip", ip);
    sessionActual.set("token", token);

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
});



module.exports = router;
