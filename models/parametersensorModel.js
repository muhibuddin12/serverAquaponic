const Sequelize = require("sequelize");
const db = require("../config/db_config");

const ParameterSensor = db.define(
    "parameter_sensor",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            },
        ph_min: {type: Sequelize.DECIMAL(5,2)},
        ph_max: {type: Sequelize.DECIMAL(5,2)},
        suhu_min: {type: Sequelize.DECIMAL(5,2)},
        suhu_max: {type: Sequelize.DECIMAL(5,2)},
    },
    {
        freezeTableName : true,
        timestamps: false,
    }
);

module.exports = ParameterSensor;