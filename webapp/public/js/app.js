'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
    'myApp.controllers',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',

    // 3rd party dependencies
    'btford.socket-io',
    'angles'
]).
config( function ( $routeProvider, $locationProvider, $httpProvider ) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    $routeProvider.
    when( '/home', {
        templateUrl: 'partials/home',
        controller: 'HomeCtrl'
    } ).
    when( '/system', {
        templateUrl: 'partials/system',
        controller: 'SystemCtrl'
    } ).
    when( '/news', {
        templateUrl: 'partials/news',
        controller: 'NewsCtrl'
    } ).
    when( '/news/config', {
        templateUrl: 'partials/news-config',
        controller: 'NewsConfigCtrl'
    } ).
    otherwise( {
        redirectTo: '/home'
    } );

    $locationProvider.html5Mode( true );

} );
