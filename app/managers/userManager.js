var user = require('../models/user');
var User = user.User;
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', {useMongoClient: true});
mongoose.Promise = global.Promise;

module.exports = {
    listUsers: function (callback) {
        User.find({}, function (err, users) {
            callback(null, users);
        });
    },
    getUserByID: function (callback, _id) {
        User.findOne({'_id': _id}, function (err, user) {
            callback(null, user);
        })
    },
    getUserByEmail: function (callback, email) {
        User.findOne({'email': email}, function (err, user) {
            callback(null, user);
        })
    },
    createUser: function (callback, newUser) {
        var passwordHash = require('password-hash');
        newUser = new User(newUser);
        newUser.password = passwordHash.generate(newUser.password);
        newUser.save(function (err, user) {
            if (err) {
                console.error(err);
            }
            else {
                callback(null, user.id);
            }
        });
    },
    deleteUserByID: function (callback, _id) {
        User.remove({'_id': _id}, function (err) {
            if (err) {
                console.error(err);
            }
            callback(null, _id);
        })
    },
    updateUserByID: function (callback, newUser) {
        var changedUser = newUser;
        var passwordHash = require('password-hash');
        changedUser.password = passwordHash.generate(changedUser.password);
        changedUser.save(function (err, user) {
            if (err) {
                console.error(err);
            }
            else {
                callback(null, user.id);
            }
        });
    }

};