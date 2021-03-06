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


var svcMod = angular.module('myApp.services_news_articles', []);


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
