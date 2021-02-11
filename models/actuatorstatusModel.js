const Sequelize = require("sequelize");
const db = require("../config/db_config");

const actuatorStatus = db.define(
    "actuatorStatus",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            },
        actuatorName: {type: Sequelize.STRING},
        status: {type: Sequelize.TINYINT}
    },
    {
        freezeTableName : true,
        timestamps: false,
    }
);

module.exports = actuatorStatus;