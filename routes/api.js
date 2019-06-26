var express = require('express');
var router = express.Router();

//var mongodb = require('mongodb');
require('../config/mongodb');

var jwt = require('jsonwebtoken');
var md5 = require('md5');


//Endpoint "sign" nos devuelve un token si el usuario es válido
//(Synchronous) Returns the JsonWebToken as string
router.post('/auth', (req, res) => {

    global.mongoConn.collection('users').find({
            username: req.body.username,
            password: md5(req.body.password)
        }).toArray()
        .then(result => {
            if (result.length > 0) {
                var token = jwt.sign({
                        id: result[0]._id,
                        username: result[0].username,
                        isAdmin: result[0].isAdmin ? true : false
                    },
                    "mysecret", {
                        expiresIn: 3600
                    }
                );
                res.send(token)
            } else {
                res.status(400).send('Invalid credentials'); //devolver un tipo de error invalid login(400)
            }
        });
});


//Resgistro de usuarios
router.post('/users', (req, res) => {
    // if (req.headers.authorization) {
    //     const token = req.headers.authorization.split(" ")[1];
    //     try {
    //         const decoded = jwt.verify(token, "mysecret");
    //         if (decoded.isAdmin) {
    //             global.mongoConn.collection('users').insertOne({
    //                 username: req.body.username,
    //                 password: md5(req.body.password),
    //                 email: req.body.email,
    //                 isAdmin: req.body.isAdmin
    //             }, (_err, result) => {
    //                 res.send(result.ops[0]);
    //             });
    //             //En la consulta le pasamos una callback y devolvemos el documento creado

    //         } else {
    //             res.status(401).send("You don't have permission. Not Admin");
    //         }
    //     } catch (e) {
    //         res.status(401).send("You don't have permission");
    //     }
    // } else {
        global.mongoConn.collection('users').insertOne({
            username: req.body.username,
            password: md5(req.body.password),
            email: req.body.email,
            isAdmin: false
        }, (_err, result) => {
            res.send(result);
        });
    

});

module.exports = router;