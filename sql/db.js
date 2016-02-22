var sqlite3 = require('sqlite3').verbose();
var schemas = require("./schemas");
var _ = require("underscore");

var sqlParser = {
    selectObject: function (schema, object, callback) {
        var executionLog = [];
        var result = [];
        try {
            var db = new sqlite3.Database(schema);

            var sqlSelect = [];
            var sqlValores = [];
            var sqlQuestion = [];

            _.each((schemas[schema])[object.tableName], function (v, k) {
                if (object.get(k)) { sqlSelect.push(k); sqlValores.push(object.get(k)); sqlQuestion.push(k + " = ? ") };
            });

            console.log("SELECT * FROM " + object.tableName + " WHERE " + sqlQuestion.join('and '));

            var stmt = db.prepare("SELECT * FROM " + object.tableName + " WHERE " + sqlQuestion.join('and '));
            stmt.bind(sqlValores);
            stmt.each(function (error, row) {
                if (error) {
                    throw error;
                }
                else {

                    result.push(object.newInstance(row));
                    console.log(result);
                }
            });
            stmt.finalize();

        } catch (error) {
            callback("NOK", error);
        }
        callback("OK", result);
    },

    insertObject: function (schema, object, callback) {
        var executionLog = [];
        try {
            var db = new sqlite3.Database(schema);

            var sqlInsert = [];
            var sqlValores = [];
            var sqlQuestion = [];

            _.each((schemas[schema])[object.tableName], function (v, k) {
                if (object.get(k)) { sqlInsert.push(k); sqlValores.push(object.get(k)); sqlQuestion.push("?") };
            });

            var stmt = db.prepare("INSERT INTO " + object.tableName + "(" + sqlInsert.join(',') + ") VALUES (" + sqlQuestion.join(',') + ")");
            stmt.run(sqlValores);
            stmt.finalize();
            executionLog.push("INSERT INTO " + object.tableName + "(" + sqlInsert.join(',') + ") VALUES (" + sqlValores.join(',') + ") ");

        } catch (error) {
            callback("NOK", error);
        }
        callback("OK", executionLog);
    },
    exQuery: function (schema, sqlQuery, callback) {
        var db = new sqlite3.Database(schema);
        try {
            db.run(sqlQuery);
            console.log("Query ejecutado " + sqlQuery);
        } catch (error) {
            callback("NOK", error);
        }
        callback("OK", "");
    },
    createSchema: function (callback) {
        var executionLog = [];

        try {
            _.each(schemas, function (dbv, dbk) {
                var db = new sqlite3.Database(dbk);
                // Ciclo de tablas
                _.each(dbv, function (v, k) {

                    var columnas = [];
                    // Ciclo de propiedades
                    _.each(v, function (pv, pk) {
                        var valores = pk + " ";

                        if (pv.type) valores = valores + pv.type + " ";
                        if (pv.primarykey) valores = valores + "PRIMARY KEY ";
                        if (pv.required) valores = valores + "NOT NULL ";
                        if (pv.autoincrement) valores = valores + "AUTOINCREMENT ";
                        if (pv.defaut) valores = valores + "DEFAULT " + pv.default;

                        columnas.push(valores);

                    });
                    // creacion de las tablas
                    try {
                        db.run("DROP TABLE "+ k);
                    } catch(ET){
                        console.log("fallo la tabla");
                    }
                    db.finalize();
                    db.run("CREATE TABLE IF NOT EXISTS " + k + " (" + columnas.join(',') + ")");
                    db.finalize();
                    executionLog.push("CREATE TABLE " + k + " (" + columnas.join(',') + ")" + ": OK");
                });
                console.log("Creada la DB : " + dbk);

            });
        } catch (error) {
            callback("NOK", error);
        }
        callback("OK", executionLog);
    },
};

module.exports = sqlParser;