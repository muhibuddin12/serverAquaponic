//sebagai router data sensor
const express = require("express");
const router = express.Router();
const db = require("../config/db_config");
const Datasensors = require("../models/datasensorsModel");
const Sequelize = require("sequelize");

const Op = Sequelize.Op;

db.authenticate().then(() =>
   console.log("Berhasil terkoneksi")
);

router.get("/findall", async (req,res)=>{
   try {
      const getAllData = await Datasensors.findAll({
         order: [
            ['time','ASC']
         ]
      });
      res.json(getAllData);
   } catch (error) {
      res.json({
         message:error.message
      })
   }
});

router.get("/findone", async (req,res)=>{
   try {
      const getOneData = await Datasensors.findOne({
         order : [
            ['time','DESC']
         ]
      });
      res.json(getOneData);
   } catch (error) {
      res.json({
         message:error.message
      })
   }
});

router.get("/:time", async (req, res) => {
   try {
      const time = req.params.time;
      if(time == "week"){
         const datasensor = await Datasensors.findAll({
            where:Sequelize.where(Sequelize.fn('datediff', Sequelize.fn("NOW"), Sequelize.col('time')),{
               [Op.lt]:7
            }), 
            order : [
               ['time','DESC']
         ]});
         res.json(datasensor);
      }else if(time == "month"){
         const datasensor = await Datasensors.findAll({
            where:Sequelize.where(Sequelize.fn('datediff', Sequelize.fn("NOW"), Sequelize.col('time')),{
               [Op.lt]: 30
            }), 
            order : [
               ['time','DESC']
         ]});
         res.json(datasensor);
      }else if(time == "year"){
         const datasensor = await Datasensors.findAll({
            where:Sequelize.where(Sequelize.fn('datediff', Sequelize.fn("NOW"), Sequelize.col('time')),{
               [Op.lt]:365
            }),  
            order : [
               ['time','DESC']
         ]});
         res.json(datasensor);
      }
   } catch (error) {
      res.json({
         message:error.message
      })
   }
});

module.exports = router;

// SELECT * FROM datasensors WHERE time > date_sub(now(), interval 1 week);