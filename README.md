Pi-Holly
========

A home server project for my Raspberry Pi. The *web app* portion of this project uses [Node.js](http://nodejs.org/)/[MongoDB](http://www.mongodb.org/). It's based on [btford's](https://github.com/btford) awesome [Angular Socket IO Seed](https://github.com/btford/angular-socket-io-seed). The *system dashboard* page shown below uses websockets to receive updates from the server as new data is collected. All of the charting is done with [Chart.js](http://www.chartjs.org/).

In addition to the web app, there is a collection of worker processes, written in [Python](http://www.python.org/), performing some decoupled tasks. Right now there are three:

* One to check CPU temperature
* One to check memory usage
* One to check disk storage

Each of these workers is scheduled using `crontab` and reports the data colelcted data back to Mongo through a JSON API. 

Holly is named after the ship's computer in one of my all-time favorite television shows, [Red Dwarf](http://en.wikipedia.org/wiki/Holly_(Red_Dwarf)). Growing up, I only caught this British Comedy/Sci-Fi sporadically on PBS, but it made a lasting impression. If it wasn't already obvious, this is definitely a work in progress. Stay tuned. :) 


### System Temp Chart
![System Temp Page Screen Shot](http://i.imgur.com/pVhWYt1.png)

### System Info Charts
![System Info Page Screen Shot](http://i.imgur.com/X24o0e7.png)

# API Routes
The following routes are used add/retreive data from the web server exposed on the local network. The user facing **dashboard** pages retrieve the all information they display through these endpoints. Likewise, the **worker** processes that gather info use the same routes to send data back to MongoDB.

## Get latest system temperature

**GET:** `/api/system-temperature-data`

**Response:** 
```
 {
     date: "2014-01-10T23:22:24.150Z",
     celsius: 40,
     fahrenheit: 104,
     _id: "52d080b03a62e79fbf000003",
     __v: 0
 }
```

## Add new system temperature

**POST:** `/api/system-temperature-data`

**Payload:**
```
 {
     celsius: 40,
     fahrenheit: 104
 }     
```

## Get recent system temperatures
Right now, this returns the last 18 temperature readings. That limit will be moved into a URL parameter for more flexibility very soon.

**GET:** `/api/reporting/system-temperature-data/recent`

**Response:**
```
 [
     {
         date: "2014-01-10T23:22:24.150Z",
         celsius: 40,
         fahrenheit: 104,
         _id: "52d080b03a62e79fbf000003",
         __v: 0
     },
     {
         date: "2014-01-10T23:20:46.229Z",
         celsius: 47,
         fahrenheit: 116.6,
         _id: "52d0804e3a62e79fbf000002",
         __v: 0
     },
     {
         date: "2014-01-10T23:05:34.437Z",
         celsius: 46,
         fahrenheit: 114.8,
         _id: "52d07cbe3a62e79fbf000001",
         __v: 0
     }
 ]
```

## Get system temperature stats
This returns an object with the current, average, min, and max temperatures.

**GET:** `/api/reporting/system-temperature-data/stats`

**Response:**
```
 {
     average: 
     {
         celsius: 43,
         fahrenheit: 109.39999999999999
     },
     min: 
     {
         celsius: 40,
         fahrenheit: 104
     },
     max: 
     {
         celsius: 47,
         fahrenheit: 116.6
     }
 }
```

## Get latest memory usage

**GET:** `/api/system-memory-data`

**Response:**
```
 {
     date: "2014-01-14T02:00:06.058Z",
     total: 485,
     used: 170,
     free: 315,
     shared: 0,
     buffers: 15,
     cached: 74,
     _id: "52d49a26163cb90b06000001",
     __v: 0
}
```

## Add new memory usage

**POST:** `/api/system-memory-data`

**Payload:**
```
 {
     total: 485,
     used: 170,
     free: 315,
     shared: 0,
     buffers: 15,
     cached: 74
 }     
```

## Get latest storage data

**GET:** `/api/system-storage-data`

**Response:**
```
 {
     date: "2014-01-14T02:00:06.455Z",
     available: 3531,
     used: 2238,
     percent: 39,
     _id: "52d49a26163cb90b06000003",
     __v: 0
 }
```

## Add new storage data

**POST:** `/api/system-storage-data`

**Payload:**
```
 {
     available: 3531,
     used: 2238,
     percent: 39
 }     
```

## Get latest config data

**GET:** `/api/system-config-data`

**Respoonse:**
```
 {
     date: "2014-01-17T01:07:41.655Z",
     arm_freq: 800,
     core_freq: 250,
     sdram_freq: 400,
     emmc_pll_core: 1,
     force_pwm_open: 1,
     config_hdmi_boost: 4,
     hdmi_force_hotplug: 1,
     hdmi_group: 2,
     hdmi_ignore_edid: "0xa5000080",
     hdmi_mode: 4,
     hdmi_safe: 1,
     disable_splash: 1,    
     disable_overscan: 1,
     overscan_bottom: 16,
     overscan_left: 24,
     overscan_right: 24,
     overscan_top: 16,
     pause_burst_frames: 1,
     program_serial_random: 1,
     second_boot: 1,
     temp_limit: 185,
     _id: "52d8825d858ee93205000004",
     __v: 0
 }
```

## Add new config data

**POST:** `/api/system-config-data`

**Payload:**
```
 {
     arm_freq: 800,
     core_freq: 250,
     sdram_freq: 400,
     emmc_pll_core: 1,
     force_pwm_open: 1,
     config_hdmi_boost: 4,
     hdmi_force_hotplug: 1,
     hdmi_group: 2,
     hdmi_ignore_edid: "0xa5000080",
     hdmi_mode: 4,
     hdmi_safe: 1,
     disable_splash: 1,    
     disable_overscan: 1,
     overscan_bottom: 16,
     overscan_left: 24,
     overscan_right: 24,
     overscan_top: 16,
     pause_burst_frames: 1,
     program_serial_random: 1,
     second_boot: 1,
     temp_limit: 185
 }
```

