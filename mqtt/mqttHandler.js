//ini file mqtt handler
const mqtt = require("mqtt");
const notification = require("../service/sendNotification");
const db = require("../config/db_config");
const Datasensors = require("../models/datasensorsModel");
const Dataactuators = require("../models/dataactuatorsModel");

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
               do: data.do.toString(),
               tds: data.tds.toString(),
               watertemp: data.watertemp.toString(),
               waterlevel: data.waterlevel.toString(),
               ammonia: data.ammonia.toString(),
               humidity: data.humidity.toString(),
               airtemp: data.airtemp.toString(),
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

            try {
               const saveDataActuator = await dataActuator.save();
               console.log(saveDataActuator);
            } catch (error) {
               
            }
         }

         //hidupkan aktuator ph up dan ph down berdasarkan perintah dari alat
         //to push notification to Android App
         if (parseInt(data.watertemp.toString()) < 27.0) {
            notification.sendNotification(
               sendMessage(
                  "Hidupkan Aktuator Pemanas Air",
                  "Kondisi Suhu Air : " + data.watertemp.toString() + " \u00b0C, kondisi tersebut dibawah normal."
                  )
            );
         }

         //to push notification to Android App
         if (parseInt(data.ph.toString()) < 6.0) {
            notification.sendNotification(
               sendMessage(
                  "Hidupkan Aktuator Penambah pH Air",
                  "Kondisi pH Air : " + data.ph.toString() + ", kondisi tersebut dibawah normal."
                  )
            );
         }
         else if (parseInt(data.ph.toString()) > 7.0) {
            notification.sendNotification(
               sendMessage(
                  "Hidupkan Aktuator Penurun pH Air",
                  "Kondisi pH Air : " + data.ph.toString() + ", kondisi tersebut diatas normal."
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