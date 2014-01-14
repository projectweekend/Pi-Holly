Pi-Holly
========

A home server project for my Raspberry Pi. The *web app* portion of this project uses [Node.js](http://nodejs.org/)/[MongoDB](http://www.mongodb.org/). It's based on [btford's](https://github.com/btford) awesome [Angular Socket IO Seed](https://github.com/btford/angular-socket-io-seed). The *system dashboard* page shown below uses websockets to receive updates from the server as new data is collected. All of the charting is done with [Chart.js](http://www.chartjs.org/).

In addition to the web app, there is a collection of worker processes, written in [Python](http://www.python.org/), performing some decoupled tasks. Right now there are three:

* One to check CPU temperature
* One to check memory usage
* One to check disk storage

Each of these workers is scheduled using `crontab` and reports the data colelcted data back to Mongo through a JSON API. If it wasn't already obvious, this is definitely a work in progress. :) 

![System Temp Page Screen Shot](http://i.imgur.com/pVhWYt1.png)
(System temperature line chart)

![System Info Page Screen Shot](http://i.imgur.com/hXajsLC.png)
(System info pie charts...with room for one more!)

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
