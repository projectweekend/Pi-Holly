'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var makeHoursMinutesTimeString = function ( dateString ) {

    var d = new Date( dateString );
    var h = d.getHours();
    var m = d.getMinutes();

    if ( m === 0 ) {
        m = "00";
    }

    return h + ":" + m;
};

var logError = function ( data ) {
    console.log( data );
};


var svcMod = angular.module('myApp.services', []);


svcMod.value('version', '0.1');

// Indoor Temperature Reporting
svcMod.factory( "IndoorTempReporting", function ( $http, socket ) {

    return {
        chart: {
            options: {},
            data: {
                labels: [],
                datasets: [
                    {
                        fillColor : "rgba(151,187,205,0)",
                        strokeColor : "#e67e22",
                        pointColor : "rgba(151,187,205,0)",
                        pointStrokeColor : "#e67e22",
                        data: []
                    }
                ]
            }
        },
        buildChart: function ( display_units ) {
            var chart = this.chart;
            var apiUrl = "/api/indoor/temperature/recent";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    data.forEach( function ( element, index, array ) {
                        
                        var parsedTime = makeHoursMinutesTimeString( element.date );
                        chart.data.labels.push( parsedTime );

                        if ( display_units == 'F' ) {
                            chart.data.datasets[0].data.push( element.fahrenheit );
                        } else {
                            chart.data.datasets[0].data.push( element.celsius );
                        }

                    } );
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        },
        clearChart: function () {
            var chart = this.chart;
            chart.data.labels = [];
            chart.data.datasets[0].data = [];
        },
        init: function ( display_units ) {
            var IndoorTempReporting = this;
            var currentData = IndoorTempReporting.chart.data.datasets[0].data;
            if ( currentData.length === 0 ) {
                IndoorTempReporting.buildChart( display_units );
            }
        }
    };

} );

// Indoor Humidity Reporting
svcMod.factory( "IndoorHumidityReporting", function ( $http, socket ) {

    return {
        chart: {
            options: {},
            data: {
                labels: [],
                datasets: [
                    {
                        fillColor : "rgba(151,187,205,0)",
                        strokeColor : "#e67e22",
                        pointColor : "rgba(151,187,205,0)",
                        pointStrokeColor : "#e67e22",
                        data: []
                    }
                ]
            }
        },
        buildChart: function () {
            var chart = this.chart;
            var apiUrl = "/api/indoor/humidity/recent";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    data.forEach( function ( element, index, array ) {

                        var parsedTime = makeHoursMinutesTimeString( element.date );
                        chart.data.labels.push( parsedTime );

                        chart.data.datasets[0].data.push( element.percent );

                    } );
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        },
        clearChart: function () {
            var chart = this.chart;
            chart.data.labels = [];
            chart.data.datasets[0].data = [];
        },
        init: function () {
            var IndoorHumidityReporting = this;
            var currentData = IndoorHumidityReporting.chart.data.datasets[0].data;
            if ( currentData.length === 0 ) {
                IndoorHumidityReporting.buildChart( );
            }
        }
    };

} );

// System Reporting
svcMod.factory( "SystemTempReporting", function ( $http, socket ) {

    return {
        recentTempChart: {
            options: {},
            data: {
                labels: [],
                datasets: [
                    {
                        fillColor : "rgba(151,187,205,0)",
                        strokeColor : "#e67e22",
                        pointColor : "rgba(151,187,205,0)",
                        pointStrokeColor : "#e67e22",
                        data: []
                    }
                ]
            }
        },
        buildRecentTempChart: function ( display_units ) {
            var recentTempChart = this.recentTempChart;
            var apiUrl = "/api/reporting/system-temperature-data/recent";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    data.forEach( function ( element, index, array ) {

                        var parsedTime = makeHoursMinutesTimeString( element.date );
                        recentTempChart.data.labels.push( parsedTime );

                        if ( display_units == 'F' ) {
                            recentTempChart.data.datasets[0].data.push( element.fahrenheit );
                        } else {
                            recentTempChart.data.datasets[0].data.push( element.celsius );
                        }

                    } );
                }).
                error( function ( data, status ) {
                    logError( data );
                });
        },
        clearRecentTempChart: function () {
            var recentTempChart = this.recentTempChart;
            recentTempChart.data.labels = [];
            recentTempChart.data.datasets[0].data = [];
        },
        listenForUpdates: function ( display_units ) {
            
            var recentTempChart = this.recentTempChart;
            
            socket.on( 'updates:system:temp', function ( data ) {
            
                var newLabel = makeHoursMinutesTimeString( data.date );
                var latestLabel = recentTempChart.data.labels[0];

                if ( newLabel != latestLabel ) {
                    // remove oldest one
                    recentTempChart.data.labels.pop();
                    recentTempChart.data.datasets[0].data.pop();
                    // add new one
                    recentTempChart.data.labels.unshift( newLabel );
                    if ( display_units == 'F' ) {
                        recentTempChart.data.datasets[0].data.unshift( data.fahrenheit );
                    } else {
                        recentTempChart.data.datasets[0].data.unshift( data.celsius );
                    }

                }

            } );
        },
        init: function ( display_units ) {
            var SystemTempReporting = this;
            var currentData = SystemTempReporting.recentTempChart.data.datasets[0].data;
            if ( currentData.length === 0 ) {
                SystemTempReporting.buildRecentTempChart( display_units );
            }
        }

    };

} );

// Current System Temp
svcMod.factory( "SystemTempCurrent", function ( $http, socket ) {

    return {
        values: {
            date: null,
            fahrenheit: null,
            celsius: null
        },
        getValues: function () {
            var values = this.values;
            var apiUrl = "/api/system-temperature-data";

            $http.get( apiUrl ).
                success( function ( data, status) {
                    values.date = data.date;
                    values.fahrenheit = data.fahrenheit;
                    values.celsius = data.celsius;
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        },
        listenForUpdates: function () {
            var values = this.values;
            socket.on( 'updates:system:temp', function ( data ) {
                if ( values.date != data.date ) {
                    values.date = data.date;
                    values.fahrenheit = data.fahrenheit;
                    values.celsius = data.celsius;
                }
            } );
        },
        init: function () {
            var SystemTempCurrent = this;
            var currentFarenheit = SystemTempCurrent.values.fahrenheit;
            var currentCelsius = SystemTempCurrent.values.celsius;
            if ( currentFarenheit === null && currentCelsius === null ) {
                SystemTempCurrent.getValues();
            }
        }
    };

} );

// System Temp Stats
svcMod.factory( "SystemTempStats", function ( $http, socket ) {

    return {
        values: {
            average: null,
            min: null,
            max: null
        },
        getValues: function () {
            var values = this.values;
            var apiUrl = "/api/reporting/system-temperature-data/stats";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    values.average = data.average;
                    values.min = data.min;
                    values.max = data.max;
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );

        },
        listenForUpdates: function () {
            // TOOD: Make a socket and hook this up
            var values = this.values;
        },
        init: function () {
            var SystemTempStats = this;
            var values = this.values;
            if ( values.average === null || values.min === null || values.max === null ) {
                SystemTempStats.getValues();
            }
        }
    };

} );

// Current System Memory
svcMod.factory( "SystemMemoryCurrent", function ( $http, socket ) {

    return {
        values: {
            date: null,
            total: null,
            used: null,
            free: null,
            shared: null,
            buffers: null,
            cached: null
        },
        currentMemoryChart: {
            options: {},
            data: []
        },
        buildCurrentMemoryChart: function () {
            var values = this.values;
            var currentMemoryChart = this.currentMemoryChart;
            currentMemoryChart.data = [
                {
                    value: values.used,
                    color: "#F7464A"
                },
                {
                    value: values.free,
                    color: "#4D5360"
                },
                {
                    value: values.shared,
                    color: "#7EC5BC"
                },
                {
                    value: values.buffers,
                    color : "#949FB1"
                },
                {
                    value: values.cached,
                    color : "#D4CCC5"
                }
            ];
        },
        getValues: function () {
            var SystemMemoryCurrent = this;
            var values = this.values;
            var apiUrl = "/api/system-memory-data";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    values.date = data.date;
                    values.total = data.total;
                    values.used = data.used;
                    values.free = data.free;
                    values.shared = data.shared;
                    values.buffers = data.buffers;
                    values.cached = data.cached;
                    SystemMemoryCurrent.buildCurrentMemoryChart();
                }).
                error( function ( data, status ) {
                    logError( data );
                });
        },
        listenForUpdates: function () {
            // TOOD: Make a socket and hook this up
            var values = this.values;
        },
        init: function () {
            
            var SystemMemoryCurrent = this;
            
            var values = this.values;
            if ( values.date === null || values.total === null || values.used === null || values.free === null || values.shared === null || values.buffers === null || values.cached === null ) {
                SystemMemoryCurrent.getValues();
            }

        }

    };

} );

// Current System Storage
svcMod.factory( "SystemStorageCurrent", function ( $http, socket ) {

    return {
        values: {
            date: null,
            available: null,
            used: null
        },
        currentStorageChart: {
            options: {},
            data: []
        },
        buildCurrentStorageChart: function () {
            var values = this.values;
            var currentStorageChart = this.currentStorageChart;
            currentStorageChart.data = [
                {
                    value: values.available,
                    color: "#4D5360"
                },
                {
                    value: values.used,
                    color: "#F7464A"
                }
            ];

        },
        getValues: function () {
            var SystemStorageCurrent = this;
            var values = this.values;
            var apiUrl = "/api/system-storage-data";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    values.date = data.date;
                    values.available = data.available;
                    values.used = data.used;
                    SystemStorageCurrent.buildCurrentStorageChart();
                }).
                error( function ( data, status ) {
                    logError( data );
                });
        },
        listenForUpdates: function () {
            // TOOD: Make a socket and hook this up
            var values = this.values;
        },
        init: function () {

            var SystemStorageCurrent = this;

            var values = this.values;
            if ( values.available === null || values.used === null ) {
                SystemStorageCurrent.getValues();
            }
        }
    };

} );

// Current System Config
svcMod.factory( "SystemConfigCurrent", function ( $http, socket ) {

    return {
        values: {
            date: null,
            arm_freq: null,
            core_freq: null,
            sdram_freq: null,
            temp_limit: null
        },
        getValues: function () {
            var values = this.values;
            var apiUrl = "/api/system-config-data";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    values.date = data.date;
                    values.arm_freq = data.arm_freq;
                    values.core_freq = data.core_freq;
                    values.sdram_freq = data.sdram_freq;
                    values.temp_limit = data.temp_limit;
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        },
        init: function () {

            var SystemConfigCurrent = this;

            var values = this.values;
            if ( values.arm_freq === null || values.core_freq === null || values.sdram_freq === null || values.temp_limit === null ) {
                SystemConfigCurrent.getValues();
            }

        }
    };

} );

// Starbug Temperature Reporting
svcMod.factory( "StarbugTempReporting", function ( $http, socket ) {

    return {
        chart: {
            options: {},
            data: {
                labels: [],
                datasets: [
                    {
                        fillColor : "rgba(151,187,205,0)",
                        strokeColor : "#e67e22",
                        pointColor : "rgba(151,187,205,0)",
                        pointStrokeColor : "#e67e22",
                        data: []
                    }
                ]
            }
        },
        buildChart: function ( display_units ) {
            var chart = this.chart;
            var apiUrl = "/api/starbug/temperature/recent";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    data.forEach( function ( element, index, array ) {

                        var parsedTime = makeHoursMinutesTimeString( element.date );
                        chart.data.labels.push( parsedTime );

                        if ( display_units == 'F' ) {
                            chart.data.datasets[0].data.push( element.fahrenheit );
                        } else {
                            chart.data.datasets[0].data.push( element.celsius );
                        }

                    } );
                }).
                error( function ( data, status ) {
                    logError( data );
                });
        },
        clearChart: function () {
            var chart = this.chart;
            chart.data.labels = [];
            chart.data.datasets[0].data = [];
        },
        listenForUpdates: function ( display_units ) {
            var chart = this.chart;
            
            socket.on( 'updates:starbug:temp', function ( data ) {
            
                var newLabel = makeHoursMinutesTimeString( data.date );
                var latestLabel = chart.data.labels[0];

                if ( newLabel != latestLabel ) {
                    // remove oldest one
                    chart.data.labels.pop();
                    chart.data.datasets[0].data.pop();
                    // add new one
                    chart.data.labels.unshift( newLabel );
                    if ( display_units == 'F' ) {
                        chart.data.datasets[0].data.unshift( data.fahrenheit );
                    } else {
                        chart.data.datasets[0].data.unshift( data.celsius );
                    }

                }

            } );
        },
        init: function ( display_units ) {
            var StarbugTempReporting = this;
            var currentData = StarbugTempReporting.chart.data.datasets[0].data;
            if ( currentData.length === 0 ) {
                StarbugTempReporting.buildChart( display_units );
            }
        }
    };

} );

// News Source Config
svcMod.factory( "NewsSourceConfig", function ( $http ) {

    return {
        editing: {
            _id: "",
            url: "",
            clearForm: function () {
                var editing = this;
                editing._id = "";
                editing.url = "";
            },
            begin: function ( itemToEdit ) {
                var editing = this;
                editing.clearForm();
                editing._id = itemToEdit._id;
                editing.url = itemToEdit.url;
            }
        },
        save: function () {
            var NewsSourceConfig = this;
            var apiUrl = "/api/news-source/config";

            if ( !NewsSourceConfig.editing._id ) {
                $http.post( apiUrl, NewsSourceConfig.editing ).
                    success( function ( data, status ) {
                        NewsSourceConfig.editing.clearForm();
                        NewsSourceConfig.getSources();
                    } ).
                    error( function ( data, status ) {
                        logError( data );
                    } );
            } else {
                $http.put( apiUrl, NewsSourceConfig.editing ).
                    success( function ( data, status ) {
                        NewsSourceConfig.editing.clearForm();
                        NewsSourceConfig.getSources();
                    } ).
                    error( function ( data, status ) {
                        logError( data );
                    } );
            }

        },
        cancel: function () {
            var NewsSourceConfig = this;
            NewsSourceConfig.editing.clearForm();
        },
        edit: function ( itemToEdit ) {
            var NewsSourceConfig = this;
            NewsSourceConfig.editing.begin( itemToEdit );
        },
        remove: function ( id ) {
            var NewsSourceConfig = this;
            var apiUrl = "/api/news-source/config?id=" + id;

            $http.delete( apiUrl ).
                success( function ( data, status ) {
                    NewsSourceConfig.getSources();
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        },
        sources: [],
        getSources: function () {
            var NewsSourceConfig = this;
            var apiUrl = "/api/news-source/config";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    NewsSourceConfig.sources = data;
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        }
    };

} );

svcMod.factory( "NewsArticles", function ( $http ) {

    return {
        articles: {
            col_1: [],
            col_2: []
        },
        getArticles: function () {
            var NewsArticles = this;
            var apiUrl = "/api/news-articles";

            $http.get( apiUrl ).
                success( function ( data, status ) {
                    data.forEach( function ( article, index, array ) {
                        switch ( index % 2 ) {
                            case 0:
                                NewsArticles.articles.col_1.push( article );
                                break;
                            case 1:
                                NewsArticles.articles.col_2.push( article );
                                break;
                        }
                    } );
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        },
        readArticle: function ( article, articleList ) {
            var apiUrl = "/api/news-articles/read";
            $http.post( apiUrl, article ).
                success( function ( data, status ) {
                    var index = articleList.indexOf( article );
                    if ( index > -1 ) {
                        articleList.splice( index, 1 );
                    }
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        },
        ignoreArticle: function ( article, articleList ) {
            var apiUrl = "/api/news-articles/ignore";
            $http.post( apiUrl, article ).
                success( function ( data, status ) {
                    var index = articleList.indexOf( article );
                    if ( index > -1 ) {
                        articleList.splice( index, 1 );
                    }
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        }
    };

} );


svcMod.factory( "HueLighting", function ( $http ) {

    return {
        bridge: {
            ip: "",
            isAuthorized: false
        },
        lights: [],
        buildRouteURL: function ( route ) {
            var bridge = this.bridge;
            return "http://" + bridge.ip + route;
        },
        findBridgeIP: function () {
            var HueLighting = this;
            var apiUrl = "http://www.meethue.com/api/nupnp";
            $http.get( apiUrl ).
                success( function ( data, status ) {
                    HueLighting.bridge.ip = data[0].internalipaddress;
                    HueLighting.checkBridgeAuthorization();
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        },
        checkBridgeAuthorization: function () {
            var HueLighting = this;
            var apiUrl = HueLighting.buildRouteURL( "/api/hollydotlocal" );
            $http.get( apiUrl ).
                success( function ( data, status ) {
                    var response = data[0];
                    if ( response.error.type == 1 ) {
                        HueLighting.bridge.isAuthorized = false;
                    } else {
                        HueLighting.bridge.isAuthorized = true;
                        HueLighting.findLights();
                    }
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        },
        authorizeBridge: function () {
            var HueLighting = this;
            var apiUrl = HueLighting.buildRouteURL( "/api" );
            var postData = {
                "devicetype": "Holly.local",
                "username": "hollydotlocal"
            };
            $http.post( apiUrl, postData ).
                success( function ( data, status ) {
                    var response = data[0];
                    if ( response.error.type == 101 ) {
                        HueLighting.bridge.isAuthorized = false;
                    } else {
                        HueLighting.bridge.isAuthorized = true;
                        HueLighting.findLights();
                    }
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );

        },
        populateLightAttributes: function ( lightID, lightItem ) {
            var HueLighting = this;
            var apiUrl = HueLighting.buildRouteURL( "/api/hollydotlocal/lights/" + lightID );
            $http.get( apiUrl ).
                success( function ( data, status ) {
                    lightItem.data = data;
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        },
        findLights: function () {
            var HueLighting = this;
            var apiUrl = HueLighting.buildRouteURL( "/api/hollydotlocal/lights" );
            $http.get( apiUrl ).
                success( function ( data, status ) {
                    for (var key in data) {
                        var light = {
                            id: key,
                            name: data[key].name
                        };
                        HueLighting.populateLightAttributes( key, light );
                        HueLighting.lights.push( light );
                    }
                } ).
                error( function ( data, status ) {
                    logError( data );
                } );
        },
        init: function () {
            var HueLighting = this;
            HueLighting.findBridgeIP();
        }
    };

} );
