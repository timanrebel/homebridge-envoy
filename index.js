'use strict';
var inherits = require('util').inherits;
var Service, Characteristic;


var request = require('request-json');

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-envoy', 'Envoy', envoy);
};

var envoycache = new Array();
var envoycachetime = new Array();

function envoy(log, config) {
    this.log = log;
    this.host = config['host'];
    this.url = config['url'] || '/production.json';
    this.refreshage = 1;
    this.name = config['name'];

    envoycache[this.host] = 0;
    envoycachetime[this.host] = 0;

    var EvePowerConsumption = function() {
        Characteristic.call(this, 'Consumption', 'E863F10D-079E-48FF-8F27-9C2605A29F52');
        this.setProps({
            format: Characteristic.Formats.UINT16,
            unit: 'watts',
            maxValue: 1000000000,
            minValue: 0,
            minStep: 1,
            perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
        });
        this.value = this.getDefaultValue();
    };
    inherits(EvePowerConsumption, Characteristic);

    var EveTotalPowerConsumption = function() {
        Characteristic.call(this, 'Total Consumption', 'E863F10C-079E-48FF-8F27-9C2605A29F52');
        this.setProps({
            format: Characteristic.Formats.FLOAT, // Deviation from Eve Energy observed type
            unit: 'kilowatthours',
            maxValue: 1000000000,
            minValue: 0,
            minStep: 0.001,
            perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
        });
        this.value = this.getDefaultValue();
    };
    inherits(EveTotalPowerConsumption, Characteristic);

    var PowerMeterService = function(displayName, subtype) {
        Service.call(this, displayName, '00000001-0000-1777-8000-775D67EC4377', subtype);
        this.addCharacteristic(EvePowerConsumption);
        this.addOptionalCharacteristic(EveTotalPowerConsumption);
    };

    inherits(PowerMeterService, Service);

    log(this.name);
    this.service = new PowerMeterService(this.name);
    this.service.getCharacteristic(EvePowerConsumption).on('get', this.getPowerConsumption.bind(this));
    this.service.addCharacteristic(EveTotalPowerConsumption).on('get', this.getTotalPowerConsumption.bind(this));

    var self = this;

}

envoy.prototype.getstatus = function(callback) {
    var curtime = new Date() / 1000;

    if (curtime - envoycachetime[this.host] > this.refreshage) {
        var client = request.createClient('http://' + this.host);

//        console.log("Fetching " + this.host + this.url);

        client.get(this.url, function(err, res, body) {
           if (err) console.log("Error fetching data " + err);
           else {
               console.log('Fetched status.  Current production is ' + body.production[1].wNow.toFixed(0) + " watts, consumption is " + body.consumption[0].wNow.toFixed(0) + " watts");
               envoycache[this.host] = body;
               envoycachetime[this.host] = new Date() / 1000;
               callback(envoycache[this.host]);
               };
           }.bind(this));
    } else {
//        console.log("Using cached details fetched " + (curtime - envoycachetime[this.host]).toFixed(0) + " seconds ago");
        callback(this.status);
        };
};

envoy.prototype.getPowerConsumption = function (callback) {
    this.getstatus(function() {
        switch (this.name) {
            case "Production":  callback(null, envoycache[this.host].production[1].wNow.toFixed(0)); break;
            case "Export":      callback(null, envoycache[this.host].consumption[1].wNow < 0 ? -envoycache[this.host].consumption[1].wNow.toFixed(0) : 0); break;
            case "Import":      callback(null, envoycache[this.host].consumption[1].wNow > 0 ? envoycache[this.host].consumption[1].wNow.toFixed(0) : 0); break;
            case "Consumption":
            default:            callback(null, envoycache[this.host].consumption[0].wNow.toFixed(0)); break;
            };
        }.bind(this));
};

envoy.prototype.getTotalPowerConsumption = function (callback) {
    this.getstatus(function() {
        switch (this.name) {
            case "Production":  callback(null, envoycache[this.host].production[1].whToday / 1000); break;
            case "Export":      callback(null, envoycache[this.host].consumption[1].whToday < 0 ? -envoyfetch[this.host].consumption[1].whToday / 1000 : 0); break;
            case "Import":      callback(null, envoycache[this.host].consumption[1].whToday > 0 ? envoyfetch[this.host].consumption[1].whToday / 1000 : 0); break;
            case "Consumption":
            default:            callback(null, envoycache[this.host].consumption[0].whToday / 1000); break;
            };
       }.bind(this));
};

envoy.prototype.getServices = function () {
    return [this.service];
};
