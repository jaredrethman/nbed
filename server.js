'use strict';
/*
* Load modules
* */
var express         = require('express');
var fs              = require('fs');
var app             = express();

app.set('view engine', 'pug');

/*
* Custom
* */
var cache_directory = './cache/';

//NBED Object
var nbed = {};
nbed.api = require('./scripts/api.js');
nbed.utils = require('./scripts/utils.js');

module.exports.nbed = nbed;

/*
* EXPRESS
* */
//CORS Headers
app.use(function (req, res, next) {
    'use strict';
    res.header( 'Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});
//Scarpe route
app.get('/scrape', function (req, res) {
    'use strict';

    //Format URL, remove any query strings/hashes
    var url = req.query.src;
    var file_to_read = nbed.utils.fileName( url );

    var pathToFile = cache_directory +  nbed.utils.slugify( file_to_read ) + '.json';

    //Add theme and layout variables
    res[ 'theme' ]  = req.query.hasOwnProperty( 'theme' ) && '1' === req.query.theme;
    res[ 'layout' ] = req.query.hasOwnProperty( 'layout' ) && '0' === req.query.layout;
    res[ 'cta' ]    = req.query.hasOwnProperty( 'cta' ) ? req.query.cta : 'Read more...';

    //If file/cache exists read, otherwise request and create
    fs.stat( pathToFile, function( err, stats ) {
        if ( !err ) {
            nbed.api.readFile( res, pathToFile );
        } else {
            nbed.api.buildFile( res, url, pathToFile );
        }
    });

});

app.post('/track_click', function ( req, res ) {

    'use strict';

    var url = req.query.url;
    var file_to_read = nbed.utils.fileName( url );
    var pathToFile = cache_directory +  nbed.utils.slugify( file_to_read ) + '.json';

    nbed.utils.incrementCount( pathToFile, 'clicks', fs );

});

app.listen('8081');
console.log('Ready...');
var exports = module.exports = app;