
var schemas = {
    user: {
        id: null,
        name: null,
        username: null,
        password: null,
        role: null
    },
    session: { 
        id: null,
        idUser: null,
        token: null,
        timestamp: null
    }
}

module.exports = schemas;