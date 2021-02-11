//ini file mqtt handler
const mqtt = require("mqtt");
const notification = require("../service/sendNotification");
const db = require("../config/db_config");
const Datasensors = require("../models/datasensorsModel");
const Dataactuators = require("../models/dataactuatorsModel");
const actuatorStatus = require("../models/actuatorstatusModel");
const ParameterSensor = require("../models/parametersensorModel");
const { where } = require("sequelize");

db.authenticate().then(() =>
   console.log("Berhasil terkoneksi mqtt")
);

class mqttHandler {
   constructor() {
      this.mqttClient = null;
      this.host = "http://54.218.210.162/";
      this.username = "admin2020";
      this.password = "wisuda2020";
   }

   connect() {
      this.mqttClient = mqtt.connect(this.host, {
         username: this.username,
         password: this.password,
      });

      //Mqtt error callback
      this.mqttClient.on("error", (err) => {
         console.log(err);
         this.mqttClient.end();
      });

      //connection callback
      this.mqttClient.on("connect", () => {
         console.log("mqtt client connected");
         //mqtt subcription
         this.mqttClient.subscribe("aquaponik/datasensor", { qos: 0 });
      });

      function sendMessage(title,msg) {
         const message = {
            app_id: "7b18609e-b6dc-4660-8365-669550f5dcb1",
            headings: { en: title },
            contents: { en: msg },
            included_segments: ["Active Users"],
         };
         return message;
      }

      //when message arrive
      this.mqttClient.on("message", async (topic, message) => {
         var msg = message.toString();
         const data = await JSON.parse(msg);
         if (data.data.toString() == "sensor") {
            const dataSensor = new Datasensors({
               id : null, 
               ph: data.ph.toString(),
               tds: data.tds.toString(),
               watertemp: data.watertemp.toString(),
               time: data.time.toString(),
            });
            try {
               const saveDataSensor = await dataSensor.save();
               console.log(saveDataSensor)
            } catch (error) {
               console.log(error.message);
            }
         }else if(data.data.toString() == "actuator"){
            const dataActuator = new Dataactuators({
               id: null,
               actuatorName: data.actuatorName.toString(),
               action: data.action.toString(),
               time: data.time.toString()
            });
            
            //ini berguna untuk membuat status ph tidak bisa dihidupkan lagi oleh user
            if (data.actuatorName.toString() == "pH up") {
               await actuatorStatus.update({status : 0},{
                  where:{
                     id: 1
                  }
               });
            }
            else if (data.actuatorName.toString() == "pH down") {
               await actuatorStatus.update({status : 0},{
                  where:{
                     id: 2
                  }
               });
            }

            try {
               const saveDataActuator = await dataActuator.save();
               console.log(saveDataActuator);
            } catch (error) {
               
            }
         }
         else if(data.data.toString() == "notification"){
            // console.log(data.actuatorName.toString());
            // to push notification to Android App
            if (data.actuatorName.toString() == "pH up") {
               await actuatorStatus.update({status : 1},{
                  where:{
                     id: 1
                  }
               });
               notification.sendNotification(
                  sendMessage(
                     "Hidupkan Aktuator Penambah pH Air",
                     "Kondisi pH Air : " + data.ph.toString() + ", kondisi tersebut dibawah normal."
                     )
               );
            }
            else if (data.actuatorName.toString() == "pH down") {
               await actuatorStatus.update({status : 1},{
                  where:{
                     id: 2
                  }
               });
               notification.sendNotification(
                  sendMessage(
                     "Hidupkan Aktuator Penurun pH Air",
                     "Kondisi pH Air : " + data.ph.toString() + ", kondisi tersebut diatas normal."
                     )
               );
            }
         }

         const parameter = await ParameterSensor.findOne({where:{id:1}});

         if (data.ph.toString() < parameter.ph_min) {
            notification.sendNotification(
               sendMessage(
                  "Hidupkan Aktuator Penambah pH Air",
                  "Kondisi pH Air : " + data.ph.toString() + ", kondisi tersebut dibawah normal."
                  )
            );
         }
         else if (data.ph.toString() > parameter.ph_max) {
            notification.sendNotification(
               sendMessage(
                  "Hidupkan Aktuator Penurun pH Air",
                  "Kondisi pH Air : " + data.ph.toString() + ", kondisi tersebut diatas normal."
                  )
            );
         }

         //hidupkan aktuator ph up dan ph down berdasarkan perintah dari alat
         //to push notification to Android App
         if (parseInt(data.watertemp.toString()) < parameter.suhu_min) {
            notification.sendNotification(
               sendMessage(
                  "Hidupkan Aktuator Pemanas Air",
                  "Kondisi Suhu Air : " + data.watertemp.toString() + " \u00b0C, kondisi tersebut dibawah normal."
                  )
            );
         }

         //aerator
         //watertemp

      });

      this.mqttClient.on("close", () => {
         console.log("mqtt client disconnected");
      });
   }

   //send message to topic : aquaponik/datasensor
   sendMessage(topic, message) {
      this.mqttClient.publish(topic, message);
   }
}

module.exports = mqttHandler;