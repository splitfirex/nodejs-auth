var db = require("../sql/db.js");
var schemas = require("../sql/schemas.js");
var _ = require("lodash");

var User = function (data) {
    this.data = this.sanitize(data);
}

User.prototype.data = {}

User.prototype.get = function (name) {
    return this.data[name];
}

User.prototype.set = function (name, value) {
    this.data[name] = value;
}

User.prototype.sanitize = function (data) {
    data = data || {};
    schema = schemas.user;
    return _.pick(_.defaults(data, schema), _.keys(schema)); 
}

User.prototype.save = function (callback) {
    var self = this;
    this.data = this.sanitize(this.data);
    db.get('users', {id: this.data.id}).update(JSON.stringify(this.data)).run(function (err, result) {
        if (err) return callback(err);
        callback(null, result); 
    });
}

User.findByUsername = function (username, callback) {
    db.get('users', {username: username}).run(function (err, data) {
        if (err) return callback(err);
        callback(null, new User(data));
    });
}

User.getAll= function (callback) {
    db.get('users').run(function (err, data) {
        if (err) return callback(err);
        callback(null, data);
    });
}

module.exports = User;