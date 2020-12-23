//include library expressjs
const express = require("express");
//exexute library
const app = express();
//for parsing body
const bodyParser = require("body-parser");
//for mqtt
const mqttHandler = require("./mqtt/mqttHandler");

// ROUTER
const dataSensorRouter = require("./routers/dataSensorRouter");
// const dataAquaponicRouter = require("./routers/dataAquaponicRouter");

//declare mqtt
const mqttClient = new mqttHandler();
mqttClient.connect();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/datasensor", dataSensorRouter);

app.post("/sendCommand", (req, res) => {
   const command = req.body.command;
   mqttClient.sendMessage("aquaponik/command", command);
   res.send(command);
});


app.listen(8080);