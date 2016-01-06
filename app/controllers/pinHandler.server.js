'use strict';


var Pins = require('../models/pins.js');




function PinHandler() {

    this.getPinArray = function(req, res) {

        Pins.find().sort({
                _id: -1
            })
            .exec(function(err, result) {
                if (err) throw err;
                res.send(result);


            });
    };
    //change findone to findAll
    this.getUserPinArray = function(req, res) {
      console.log(req.params)
        Pins.findOne({
          owner: req.params.id
        })
            .exec(function(err, result) {
                if (err) throw err;
                res.send(result);
            });
    };

    this.addPinNew = function(req, res) {
        var newDoc = new Pins({
              caption: req.body.caption,
              url: req.body.url,
              owner: req.body.owner
        });

        newDoc.save(function(err, doc) {
            if (err) {
                throw err;
            }

            res.send(doc);
        });


    };

    //add is owner flag..
    this.removePin = function(req, res) {
        Pins.findOneAndRemove({
            "_id": req.params.id
        }, function(err) {
            if (err) {
                throw err;
            }
            res.send(req.body);
        });
    };

    this.editPin = function(req, res) {

        Pins.findOneAndUpdate({
            "_id": req.body.id
        },{
              caption: req.body.caption,
              url: req.body.url
            }, function(err) {
            if (err) {
                console.log(err)
                throw err;
            }
            res.send(req.body);
        });
    };
}

module.exports = PinHandler;
