const Sequelize = require("sequelize");
const db = require("../config/db_config");

const Dataactuator = db.define(
    "dataactuators",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            },
        actuatorName: {type: Sequelize.STRING},
        action: {type: Sequelize.STRING},
        time: {type: Sequelize.DATE},
    },
    {
        freezeTableName : true,
        timestamps: false,
    }
);

module.exports = Dataactuator;