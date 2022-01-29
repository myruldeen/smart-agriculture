'use-strict';
var cron = require('node-cron');
var Data = require('../model/data.model');
var mqtt = require('mqtt');
// var data = require('./data.model');
var socket = undefined;
var dataStream;
var dataSet;

var options = {
    port: 18685,
    host: 'mqtt://driver.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'spvjjkqq',
    password: 'hc_7fOQmGQaE',
    keepAlive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    encoding: 'utf8'
}

var client = mqtt.connect('mqtt://driver.cloudmqtt.com', options);
client.on('connect', function () {
    console.log('connected to broker');
    client.subscribe('esp/sada', function () {
        client.on('message', function (topic, message, packet) {
            // console.log(message.toString())
            if (topic === 'esp/sada') {
                var data = message.toString();
                try {
                    var data1 = JSON.parse(data);
                    dataSet = data1;
                    dataStream = data1;
                    socket.emit('data', dataSet);
                } catch (error) {
                    console.log(error.message);
                }

            } else {
                console.log('Unknown topic', topic);
            }
        })
        setInterval(async function () {
            try {
                var result = await Data.create(dataSet);
                // console.log(result.data);
            } catch (error) {
                console.log(error.message);
            }
        }, 60000);

    })

});

client.on('close', () => {
    console.log('mqtt server closed!');
});

client.on('error', (err) => {
    console.log(err);
});

// cron.schedule('* * * * *', () => {
//     // console.log('running a task every minute');
//     var x = require('../routes/data');
//     x.exportCsv(function(err, data) {
//         if (err) throw err;
//         console.log(data);
//     })

// });

exports.register = function (_socket) {
    socket = _socket;
}

function onSave(doc) {
    if (!socket) return; // if no client is connected
    // send data to only the intended device
    socket.emit('data:save:' + doc.macAddress, doc);
}


module.exports.onSave = onSave;
