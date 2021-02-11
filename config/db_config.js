const sequelize = require("sequelize");

const db = new sequelize("aquaponic_db", "root", "@Budi1998",{
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

db.sync({});

module.exports = db;