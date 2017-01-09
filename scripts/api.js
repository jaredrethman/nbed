/**
 * NBED API
 *
 * @author: Jared Rethman <jared.rethman@24.com>
 * @since: 0.0.1
 *
 */

/*
 * API actions
 * */
var request = require('request');
var cheerio = require('cheerio');
var fs      = require('fs');

var nbed = nbed || {};

nbed.utils = nbed.utils || require('./utils.js');
nbed.data = nbed.data || require('./data.js');

var readFile = function( res, file_to_read ) {
    'use strict';

    fs.readFile( file_to_read, 'utf8', function ( err, data ) {

        nbed.utils.debug('Opening...');

        //Increment impression
        nbed.utils.incrementCount( file_to_read, 'impressions', fs );

        var j = JSON.parse( data );
        sendData( res, j );
    });

}
var sendData = function( res, json ) {

    'use strict';
    nbed.utils.debug("sending...");

    //Render
    json['theme'] = res['theme'];
    json['layout'] = res['layout'];
    json['callToAction'] = res['cta'];
    json['callToAction'] = res['cta'];
    //nbed.utils.debug(json);
    res.render('index', json );

}
var buildFile = function( res, url, file_to_read ) {

    'use strict';

    nbed.utils.debug('Requesting...');

    var r = request.get({
        url: url,
        jar: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            'Accept-Language': 'en-GB,en;q=0.8,en-US;q=0.6,es;q=0.4,fr;q=0.2,ja;q=0.2'
        }
    }, function ( request_error, response, html ) {

        nbed.utils.debug('Response...');

        //Data to send
        var model = {
            'opengraph': {
                'ogType': '',
                'ogTitle': '',
                'ogDescription': '',
                'ogUrl': '',
                'ogImage': {
                    'src': '',
                    'width': '',
                    'height': ''
                },
                'ogCreate' : '',
                'ogModified' : ''
            },
            'standard' : {
                'icon' : '',
                'baseUrl' : '',
                'created' : Date.now(),
                'modified' : ''
            },
            'error' : {
                'status' : false,
                'statusCode' : '',
                'message' : ''
            },
            'analytics' : {
                'impressions' : 0,
                'clicks' : 0
            }
        };

        if ( !request_error ) {

            //Base info
            var host = response.request.uri.host;
            var protocol = response.request.uri.protocol ;

            model.standard['baseUrl'] = protocol + '//' + host;
            model.standard['modified'] = protocol + '//' + host;

            /*
             * Variables and data structuring
             * */
            //Parse html through cheerio
            var $ = cheerio.load( html );
            //Get Metadata
            var $meta = $('meta');
            //Get Links
            var $links = $('link');

            //Favicon
            model.standard['icon'] = '' !== nbed.data.getFavicon( $links, $ ) ? nbed.data.getFavicon( $links, $ ) : 'http://api.byi.pw/favicon?url=' + url;
            //model.standard['icon'] = '' !== nbed.data.getFavicon( $links, $ ) ? nbed.data.getFavicon( $links, $ ) : 'http://icons.better-idea.org/icon?url=' + url + '&size=32';

            //Get OG'ish data
            nbed.data.getOGTags( model.opengraph, $meta, $ ); //Returns object

            //Absolute URLs for images
            model.opengraph.ogImage.src = nbed.utils.getAbsoluteURL( model.standard.baseUrl, model.opengraph.ogImage.src );
            model.standard.icon = nbed.utils.getAbsoluteURL( model.standard.baseUrl, model.standard.icon );

            //Attempt at getting last modified date
            model.standard.modified = typeof response.headers[ 'last-modified' ] !== 'undefined' ? response.headers[ 'last-modified' ] : '';

            //Further fallbacks
            model.opengraph.ogUrl = '' !== model.opengraph.ogUrl ? model.opengraph.ogUrl : protocol + '//' + url;

            /*
             * Merge both objects, send and then create file.
             * */
            // Make sure image isn't broken
            if(
                typeof model.opengraph.ogImage.src !== 'undefined' &&
                '' !== model.opengraph.ogImage.src
            ) {
                request( model.opengraph.ogImage.src, function ( image_error, image_response, image_data) {
                    if ( null !== image_error && typeof image_response !== 'undefined' && image_response.statusCode === 404 ) {
                        model.opengraph.ogImage.src = '';
                    }
                    sendData( res, model );
                });
            }else{
                sendData( res, model );
            }

            fs.writeFile( file_to_read, JSON.stringify( model, null, 4 ), function ( err ) {
                nbed.utils.debug("File written");
            });

        } else {
            nbed.utils.debug("URL Request - Error!");
            model.error.status = true;
            model.error.statusCode = '404';
            model.opengraph.ogTitle = 'URL Request - Error!';
            model.error.message = 'The URL <strong>' + url + '</strong> could not be resolved.';
            sendData( res, model );
        }

    });

}

/*
* Exports
* */
module.exports.readFile = readFile;
module.exports.sendData = sendData;
module.exports.buildFile = buildFile;