'use-strict';

var Data = require('../model/data.model');
var mqtt = require('mqtt');
// var data = require('./data.model');
var socket = undefined;
var dataStream;

var client = mqtt.connect({
    port: 1883,
    protocol: 'mqtt',
    host: '127.0.0.1',
    clientId: 'API_Server_Dev',
    reconnectPeriod: 1000,
    username: 'API_Server_Dev',
    password: 'API_Server_Dev',
    keepalive: 300,
    rejectUnauthorized: false
});

client.on('connect', function () {
    console.log('Connected to Mosca at ');
    client.subscribe('api-engine');
    client.subscribe('esp/test');
});

client.on('message', function (topic, message) {

    if (topic === 'esp/test') {
        var data = message.toString();
        var data1 = JSON.parse(data);
        dataStream = data1;
        Data.create(data1, function (err, data) {
            if (err) return console.error(err);
            // if the record has been saved successfully, 
            // websockets will trigger a message to the web-app
            // console.log('Data Saved :', data.data);
        });
    } else {
        console.log('Unknown topic', topic);
    }

});

client.on('close', () => {
    console.log('mqtt server closed!');
});

client.on('error', (err) => {
    console.log(err);
});

exports.register = function (_socket) {
    socket = _socket;
}

function onSave(doc) {
    if (!socket) return; // if no client is connected
    // send data to only the intended device
    socket.emit('data:save:' + doc.macAddress, doc);
}


module.exports.onSave = onSave;
