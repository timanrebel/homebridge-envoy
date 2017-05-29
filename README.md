# homebridge-fluksometer
An homebridge plugin that creates an HomeKit consumption accessory mapped on MQTT topics. The fluksometer supports multiple types of sensors - Consumption and Generation of power, water and gas consumption.

# Installation
Follow the instruction in [homebridge](https://www.npmjs.com/package/homebridge) for the homebridge server installation.
The plugin is published through [NPM](https://www.npmjs.com/package/homebridge-mqtt-power-consumption) and should be installed "globally" by typing:

    npm install -g homebridge-fluksometer

# Configuration
Remember to configure the plugin in config.json in your home directory inside the .homebridge directory. Configuration parameters:
```javascript
{
  "accessory": "fluksometer",
  "name": "<name of the power-consumption>",
  "url": "<url of the broker>", // i.e. "http://mosquitto.org:1883"
  "username": "<username>",
  "password": "<password>",
  "topics": {
    "power": "<topic to get the current power consumption>"
    "totalPower": "<topic to get the total power consumption>"
  }
}
```

# Info
First version supports only Power Consumption.
