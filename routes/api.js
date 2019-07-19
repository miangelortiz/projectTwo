/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();

const mongodb = require('mongodb');
require('../config/mongodb');

const jwt = require('jsonwebtoken');
const md5 = require('md5');


// Endpoint "sign" nos devuelve un token si el usuario es válido
// (Synchronous) Returns the JsonWebToken as string
router.post('/auth', (req, res) => {
  global.mongoConn.collection('users').find({
    username: req.body.username,
    password: md5(req.body.password),
  }).toArray()
    .then((result) => {
      if (result.length > 0) {
        const token = jwt.sign({
          id: result[0]._id,
          username: result[0].username,
          email: result[0].email,
          isAdmin: !!result[0].isAdmin,
        },
        'mysecret', {
          expiresIn: 3600,
        });
        res.send(token);
      } else {
        res.status(400).send('Invalid credentials'); // devolver un tipo de error invalid login(400)
      }
    });
});


// Resgistro de usuarios
router.post('/user/add', (req, res) => {
  global.mongoConn.collection('users').insertOne({
    username: req.body.username,
    password: md5(req.body.password),
    email: req.body.email,
    isAdmin: false,
  }, (_err, result) => {
    res.send(result);
  });
});

// Registro de ideas por usuario logueado
router.post('/idea', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'mysecret');
    global.mongoConn.collection('ideas').insertOne({
      title: req.body.title,
      comentary: req.body.comentary,
      date: new Date(),
      user: mongodb.ObjectID(decoded.id),
    }, (_err, result) => {
      res.send(result);
    });
  } catch (e) {
    res.status(401).send();
  }
});

// listado de todas las ideas de todos los usuarios
router.get('/idea', (_req, res) => {
  try {
    const SHOW_IDEAS = global.mongoConn.collection('ideas').find({});

    SHOW_IDEAS.toArray().then((documents) => {
      const showideas = documents.map(ideas => ({
        title: ideas.title,
        comentary: ideas.comentary,
        date: ideas.date,
      }));
      res.send(showideas);
    });
  } catch (e) {
    res.status(401).send();
  }
});

// Listado de todas las ideas de un usuario
router.get('/myidea', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'mysecret');
    const SHOW_MY_IDEAS = global.mongoConn.collection('ideas').find({
      user: mongodb.ObjectID(decoded.id),
    });

    SHOW_MY_IDEAS.toArray().then((documents) => {
      const showmyideas = documents.map(ideas => ({
        title: ideas.title,
        comentary: ideas.comentary,
        date: ideas.date,
        // eslint-disable-next-line no-underscore-dangle
        id: ideas._id,
      }));
      res.send(showmyideas);
    });
  } catch (e) {
    res.status(401).send();
  }
});


// Devuelve una idea de usuario para editarla
router.get('/myidea/:id', (req, res) => {
  try {
    // const token = req.headers.authorization.split(" ")[1];
    const SHOW_MY_IDEA = global.mongoConn.collection('ideas').find({
      _id: mongodb.ObjectID(req.params.id),
    });

    SHOW_MY_IDEA.toArray().then((documents) => {
      const showmyideas = documents.map(ideas => ({
        title: ideas.title,
        comentary: ideas.comentary,
        date: ideas.date,
        id: ideas._id,
      }));
      res.send(showmyideas);
    });
  } catch (e) {
    res.status(401).send();
  }
});

// Editar la idea de un usuario
router.put('/myidea/:id', (req, res) => {
  try {
    // Comprobamos si nos llega algun campo vacío al editar
    const setObjet = {};
    if (req.body.title !== '') {
      setObjet.title = req.body.title;
    }
    if (req.body.comentary !== '') {
      setObjet.comentary = req.body.comentary;
    }
    setObjet.date = new Date();

    global.mongoConn.collection('ideas').updateOne({
      _id: mongodb.ObjectID(req.params.id),
    }, {
      $set: setObjet,
    });
    res.send();
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});

// Borrar una idea de un usuario
router.delete('/myidea/:id', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    if (token) {
      console.log(req.params.id);
      global.mongoConn.collection('ideas').deleteOne(
        { _id: mongodb.ObjectID(req.params.id) },
        (_err, _result) => {
          res.send();
        },
      );
    } else {
      res.status(401).send("You don't have permission. Not login");
    }
  } catch (e) {
    res.status(401).send("You don't have permission");
  }
});


module.exports = router;
