const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('main');
});

/* GET Login */
router.get('/login', (_req, res) => {
  res.render('login');
});

router.get('/add', (_req, res) => {
  res.render('adduser');
});

router.get('/user', (_req, res) => {
  res.render('user');
});

router.get('/myidea/:id', (_req, res) => {
  res.render('user');
});


module.exports = router;
