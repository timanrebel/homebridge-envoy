# homebridge-envoy
A homebridge plugin that will display the live power meter data from an Enlighten Envoy-S solar system.  Currently works with solar production / consumption, but does not support storage.  

This does not rely on API keys, the Enlighten Manager or any external connectivity - it connects directly into your Envoy's IP address to obtain live data.

Envoy has three meters (production, net consumption, and the difference between the two which gives you actual consumption).  In addition, the net consumption can be either positive or negative (export vs import).

Homekit doesn't support power meters natively - We are pretending to be an Elgato Eve Energy, which is a single meter outlet, so we need to create separate Eve accessories to represent each of our meters.  In addition, 
we create separate export vs import meters, so that we don't report a negative consumption - the Eve isn't intended for displaying generation, so all four meters are displayed as "Consumption".

The Eve app also only supports one tariff across all devices - so "cost" is not going to be correct, as you can't set a separate tariff for your export vs your import.

# Installation
Follow the instruction in [homebridge](https://www.npmjs.com/package/homebridge) for the homebridge server installation.

Check out the repository on github and add to your node_packages directory.

# Configuration
Remember to configure the plugin in config.json in your home directory inside the .homebridge directory. Configuration parameters:
```javascript
{
    "accessories": [
        {
            "accessory": "Envoy",
            "name": "Production",
            "host": "IP Address"
        },
        {
            "accessory": "Envoy",
            "name": "Consumption",
            "host": "IP Address"
        },
        {
            "accessory": "Envoy",
            "name": "Export",
            "host": "IP Address"
        },
        {
            "accessory": "Envoy",
            "name": "Import",
            "host": "IP Address"
        }
       ]

}
```

