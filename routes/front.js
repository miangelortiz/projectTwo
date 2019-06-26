var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main');
});

/* GET Login */
router.get('/login', function(_req, res) {
  res.render('login');
});

router.get('/add', function(_req, res) {
  res.render('adduser');
});

router.get('/user', function(_req, res) {
  res.render('user');
});







/* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
//   });

module.exports = router;