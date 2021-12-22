const express = require('express');
const Device = require('../model/device.model');
const router = express.Router();

router.get('/', function (req, res) {
    Device.find({}, function (err, devices) {
        if (err) return res.status(500).send(err);
        res.status(200).json(devices);
    });
});

router.get('/:id', function (req, res) {
    var deviceId = req.params.id;
    // the current user should have created this device
    if (!deviceId) return;
    Device.findOne({
        _id: deviceId,
    }, function(err, device) {
        if (err) return res.status(500).send(err);
        if (!device) return res.status(404).end();
        res.json(device);
    });
})



router.delete('/:id', function (req, res) {
    Device.findOne({
        _id: req.params.id
    }, function(err, device) {
        if (err) return res.status(500).send(err);

        device.remove(function(err) {
            if (err) return res.status(500).send(err);
            return res.status(204).end();
        });
    });
})

router.post('/', function (req, res) {
    var device = req.body;
    // this device is created by the current user
    // device.createdBy = req.user._id;
    Device.create(device, function (err, device) {
        if (err) return res.status(500).send(err);
        res.json(device);
    });
});
module.exports = router;