const express = require('express');

app = express();
app.use(express.json());

exports.getInfoBroker = async function (req, res) {
    //res.status(200);
    return res.status(200).json({
        mqttAddress: process.env.DEFAULT_MQTT_ADDRESS,
        mqttPort: process.env.DEFAULT_MQTT_PORT,
        mqttUser: process.env.DEFAULT_MQTT_USER,
        mqttPassword: process.env.DEFAULT_MQTT_PASSWORD
    });
}

