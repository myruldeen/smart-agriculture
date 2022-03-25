const moment = require('moment');
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const express = require('express');
const Data = require('../model/data.model');
const router = express.Router();
const path = require('path');

function dataWithTime(arr) {
    return arr.map((m) => {
        return {
            SoilTemp1: m.data.SoilTemp1,
            SoilTemp2: m.data.SoilTemp2,
            Humd: m.data.Humd,
            Temp: m.data.Temp,
            Light: m.data.Light,
            Soil1: m.data.Soil1,
            Soil2: m.data.Soil2,
            createdAt: moment(m.createdAt).format('YYYY-MM-DD h:mm:ss')
        }
    })
}
router.get('/daily', function (req, res) {
    var start = moment().subtract(24, 'hours').toDate();
    Data
        .find({ "createdAt": { "$gte": start } })
        .exec(function(err, data) {
            if (err) return res.status(500).send(err);
            
            const dArr = [];
            data.forEach(element => {
                dArr.push(element.data)
            });
           
            res.json({data: dArr,  date: start});
        });
});

router.get('/weekly', function (req, res) {
    var start = moment().subtract(24, 'hours').toDate();
    Data
        .find({ "createdAt": { "$gte": start } })
        .exec(function(err, data) {
            if (err) return res.status(500).send(err);
            
            const dArr = [];
            data.forEach(element => {
                dArr.push(element.data)
            });
           
            res.json({data: dArr,  date: start});
        });
});

router.get('/monthly', function (req, res) {
    var start = moment().subtract(24, 'hours').toDate();
    Data
        .find({ "createdAt": { "$gte": start } })
        .exec(function(err, data) {
            if (err) return res.status(500).send(err);
            
            const dArr = [];
            data.forEach(element => {
                dArr.push(element.data)
            });
           
            res.json({data: dArr,  date: start});
        });
});

router.get('/yearly', function (req, res) {
    var start = moment().subtract(24, 'hours').toDate();
    Data
        .find({ "createdAt": { "$gte": start } })
        .exec(function(err, data) {
            if (err) return res.status(500).send(err);
            
            const dArr = [];
            data.forEach(element => {
                dArr.push(element.data)
            });
           
            res.json({data: dArr,  date: start});
        });
});

//-----------------------------------------------------------

router.get('/save', function (req, res) {
    let limit = parseInt(req.params.limit) || 100;
    exportCsv(limit, true, function(err, result) {
        if (err) res.send(err);
        res.status(200).json({ msg: result })
    });
});

router.get('/file', (req, res, next) => {
    const filePath = path.join('excel_data');
    const fileList = [];
    fs.readdir(filePath, (err, files) => {
        if (err) next(err);
        files.forEach(file => {
            console.log(file)
            fileList.push(file);
        });
        res.status(200).json({ fileList: fileList });
    });

})

router.delete('/file/:id', (req, res, next) => {
    const fileId = req.params.id;
    const dirPath = path.join('excel_data');

    fs.unlink(dirPath + '/' + fileId + '.csv', (err) => {
        if (err) next(err);
        res.status(200).json({ msg: 'File successfully deleted' })
    })
})

router.get('/:limit', function (req, res) {
    var limit = parseInt(req.params.limit) || 30;
    Data
        .find({})
        .sort({ 'createdAt': -1 })
        .limit(limit)
        .exec(function (err, devices) {
            if (err) return res.status(500).send(err);
            res.status(200).json(devices);
        });
});

router.post('/', function (req, res) {
    var data = req.body;
    // data.createdBy = req.user._id;
    Data.create(data, function (err, _data) {
        if (err) return res.status(500).send(err);
        res.json(_data);
    });
})



function exportCsv(limit, withDate, callback) {
    var limit = limit || 100;
    Data
        .find({})
        .sort({ 'createdAt': -1 })
        .limit(limit)
        .exec(function (err, data) {

            if (err) return res.status(500).send(err);
            const json2csvParser = new Json2csvParser({ header: true });

            let dArr = [];

            if (!withDate) {
                data.forEach(element => {
                    dArr.push(element.data)
                });
            } else {
                dArr = dataWithTime(data);
            }
            
            const csvData = json2csvParser.parse(dArr);
            const csvPath = path.join('excel_data', Date.now() + '.csv');

            // console.log(dArr)
            fs.writeFile(csvPath, csvData, function (error) {
                // if (error) throw error;
                if (error) {
                    callback(error);
                }
                callback(null, "Write to csv successfully!");
            });
        });
}
module.exports = router;
module.exports.exportCsv = exportCsv;
