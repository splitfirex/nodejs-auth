var express = require('express');
var router = express.Router();

var User = require('../models/User');

/* GET users listing. */
router.get('/setup', function(req, res, next) {

  var usu = new User();
  usu.set("id","1");
  usu.set("username","daniel");
  usu.set("password","123456");
  usu.save(function(err, savedToby) {
    console.log("Saved toby: ", savedToby);
    });
   
     var usu2 = new User();
     usu2.set("id","2");
  usu2.set("username","daniel1");
  usu2.set("password","123456");
  usu2.save(function(err, savedToby) {
    console.log("Saved toby: ", savedToby);
    });
   
  User.getAll(function (err, all) {
      res.json(all);
  }) 
      
});

module.exports = router;
