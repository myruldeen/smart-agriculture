const express = require('express');
const Data = require('../model/data.model');
const router = express.Router();

router.get('/:deviceId/:limit', function (req, res) {
    var macAddress = req.params.deviceId;
    var limit = parseInt(req.params.limit) || 30;
    Data
    .find({
        macAddress: macAddress
    })
    .sort({'createdAt': -1})
    .limit(limit)
    .exec(function(err, devices) {
        if (err) return res.status(500).send(err);
        res.status(200).json(devices);
    });
});

router.post('/', function(req, res) {
    var data = req.body;
    // data.createdBy = req.user._id;
    Data.create(data, function(err, _data) {
        if (err) return res.status(500).send(err);
        res.json(_data);
    });
})
module.exports = router;