Pi-Holly
========

A home server project for my Raspberry Pi.

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
