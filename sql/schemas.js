
var schemas = {
    DBusers: {
        user: {
            id: { primarykey: true, type: "INTEGER", autoincrement: true },
            name: { required: true, type: "VARCHAR(20)" },
            username: { required: true, type: "VARCHAR(20)" },
            password: { required: true, type: "VARCHAR(20)" },
            role: { required: true, type: "VARCHAR(20)" }
        },
        session: {
            id: { primarykey: true, type: "INTEGER", autoincrement: true },
            idUser: { required: true, type: "INTEGER" },
            token: { required: true, type: "TEXT" },
            timestamp: { required: true, type: "DATETIME", default: "CURRENT_TIMESTAMP" }
        }
    }
}

module.exports = schemas;