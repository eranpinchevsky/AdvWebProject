var express = require('express');
var router = express.Router();
var userManager = require('../managers/userManager');
// var transactionManager = require('../managers/transactionManager');
// var Transaction = require("../models/Transaction");

/* GET list users */
module.exports = function (app) {

    // Get all users
    app.get('/User/GetAll', function (req, res, next) {
        userManager.listUsers(function (err, users) {
            if (err) {
                console.log('GetAllUsers Err: ' + err);
                res.next();
            } else {
                res.json(users);
            }
        });
    });

    // Get user by id
    app.get('/User/GetById/:userId', function (req, res, next) {
        userManager.getUserByID(function (err, user) {
                if (err) {
                    console.log('getUserByID Err: ' + err);
                    res.next();
                } else {
                    res.json(user)
                }

            },
            req.params.userId)
    });

    app.get('/User/GetGroupById/:userId', function (req, res, next) {
        userManager.getGroupTransaction(function (err, transactions) {
                if (err) {
                    console.log('getUserByID Err: ' + err);
                    res.next();
                } else {
                    res.json(transactions)
                }

            },
            req.params.userId)
    });

    // app.get('/User/GetGroupById/:userId', function (req, res, next) {
    //     userManager.getGroupTransaction(function (err, transactions) {
    //         if (err) {
    //             console.log('GetGroupTransactions Err: ' + err);
    //             res.next();
    //         } else {
    //             console.log(transactions);
    //             res.json(transactions);
    //         }
    //     });
    // });

    // Get user by mail
    app.get('/User/GetByEmail/:userEmail', function (req, res, next) {
        userManager.getUserByEmail(function (err, user) {
                if (err) {
                    console.log('getUserByEmail Err: ' + err);
                    res.next();
                } else {
                    res.json(user)
                }
            },
            req.params.userEmail)
    });

    // Check user
    app.get('/User/CheckUser/:userEmail/:userPassword', function (req, res, next) {
        userManager.checkUser(function (err, isAuthorized) {
                if (err) {
                    console.log('checkUser Err: ' + err);
                    res.next();
                } else {
                    res.json(isAuthorized);
                }
            },
            req.params.userEmail,req.params.userPassword)
    });

    // Create new user
    app.post('/User/Create', function (req, res, next) {
        userManager.createUser(function (err, id) {
                if (err) {
                    console.log('createUser Err: ' + err);
                    res.next();
                } else {
                    res.json({'id': id})
                }

            },
            req.body)
    });

    app.post('/User/AddTransaction', function (req, res, next) {
        userManager.addTransaction(function (err, id) {
            if (err) {
                console.log('createUser Err: ' + err);
                res.next();
            } else {
                res.json({'id': id})
            }

            },
            req.body)
    });

    // Delete User By ID
    app.delete('/User/DeleteByID', function (req, res, next) {
        userManager.deleteUserByID(function (err, user) {
                if (err) {
                    console.log('deleteUserByID Err: ' + err);
                    res.next();
                } else {
                    res.json({'id': user});
                }

            },
            req.body.id);
    });

    // Update new user
    app.post('/User/UpdateByID/:id', function (req, res, next) {
        userManager.updateUserByID(function (err, id) {
                if (err) {
                    console.log('updateUser Err: ' + err);
                    res.next();
                } else {
                    res.json({'id': id})
                }

            },
            req.body)
    });
}


// /* PUT update user*/
// router.put('/users', function(req, res, next) {
//     res.send('respond with a resource');
// });
// module.exports = router;