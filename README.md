Pi-Holly
========

A home server project for my Raspberry Pi. The `webapp` portion of this project uses [Node.js](http://nodejs.org/) and [MongoDB](http://www.mongodb.org/). In addition will be a collection of worker processes written in [Python](http://www.python.org/). Right now there is only one worker that collects the CPU temperature and reports it back to Mongo.

![System Temp Page Screen Shot](http://i.imgur.com/pVhWYt1.png)

API Routes
==========

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
