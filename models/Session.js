var db = require("../sql/db.js");
var schemas = require("../sql/schemas.js");
var _ = require("lodash");

var Session = function (data) {
    this.data = this.sanitize(data);
}

Session.prototype.data = {}

Session.prototype.get = function (name) {
    return this.data[name];
}

Session.prototype.set = function (name, value) {
    this.data[name] = value;
}

Session.prototype.sanitize = function (data) {
    data = data || {};
    schema = schemas.session;
    return _.pick(_.defaults(data, schema), _.keys(schema)); 
}

Session.prototype.save = function (callback) {
    var self = this;
    this.data = this.sanitize(this.data);
    db.get('Session', {id: this.data.id}).update(JSON.stringify(this.data)).run(function (err, result) {
        if (err) return callback(err);
        callback(null, result); 
    });
}

Session.findById = function (id, callback) {
    db.get('Session', {id: id}).run(function (err, data) {
        if (err) return callback(err);
        callback(null, new Session(data));
    });
}

Session.findByToken = function (token, callback) {
    db.get('Session', {token: token}).run(function (err, data) {
        if (err) return callback(err);
        callback(null, new Session(data));
    });
}

module.exports = Session;