const Sequelize = require("sequelize");
const db = require("../config/db_config");

const Datasensors = db.define(
    "datasensors",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            },
        ph: {type: Sequelize.DECIMAL(19,2)},
        do: {type: Sequelize.DECIMAL(19,2)},
        tds: {type: Sequelize.DECIMAL(19,2)},
        watertemp: {type: Sequelize.DECIMAL(19,2)},
        waterlevel: {type: Sequelize.DECIMAL(19,2)},
        ammonia: {type: Sequelize.DECIMAL(19,2)},
        humidity: {type: Sequelize.DECIMAL(19,2)},
        airtemp: {type: Sequelize.DECIMAL(19,2)},
        time: {type: Sequelize.STRING},
    },
    {
        freezeTableName : true,
        timestamps: false,
    }
);

module.exports = Datasensors;