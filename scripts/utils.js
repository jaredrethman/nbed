/**
 * NBED UTILS
 *
 * @author: Jared Rethman <jared.rethman@24.com>
 * @since: 0.0.1
 *
 */

var siteDebug = true;

var getAbsoluteURL = function( base, url ) {
    'use strict';
    if( typeof url !== 'undefined' ) {
        var r = new RegExp('^(?:[a-z]+:)?//', 'i');

        if ( !r.test( url ) ) {
            if ( url.indexOf( '/' ) === 0 ) {
                return base + url;
            } else {
                return base + '/' + url;
            }
        }else{
            return url;
        }
    }

}
var debug = function(msg) {
    //debug = typeof debug !== 'undefined';
    if (siteDebug) {
        console.log(msg);
    }
}
var slugify = function(s) {
    'use strict';
    var _slugify_strip_re = /[^\w\s-]/g;
    var _slugify_hyphenate_re = /[-\s]+/g;

    s = s.replace(_slugify_strip_re, '').trim().toLowerCase();
    s = s.replace(_slugify_hyphenate_re, '-');
    return s;
}
var fileName = function( url ){
    if( -1 !== url.indexOf( '?' ) || -1 !== url.indexOf( '#' ) ){
        url = url.split(/[?#]/)[0];
    }
    //Cache directory
    var file_to_read = url;
    if( -1 !== file_to_read.indexOf( '://' ) ){
        file_to_read = url.substr( url.indexOf( '://' ) + 3 );
    }else{
        url = 'http://' + url; //If url has no protocol append http://
    }
    if( -1 !== file_to_read.indexOf( 'www.' ) ){
        file_to_read = url.substr( url.indexOf( 'www.' ) + 4 );
    }

    return file_to_read;
}
var incrementCount = function( file, type, fs ){
    fs.readFile( file, 'utf8', function ( err, data ) {

        if ( err ) throw err;

        var json = JSON.parse( data ); // Convert string to JSON
        json.analytics[ type ] = parseInt( json.analytics[ type ] ) + 1;

        fs.writeFile ( file, JSON.stringify( json, null, 4 ), function( err ) {
            if (err) throw err;
        });
    });
}

/*
* Exports
* */

module.exports.getAbsoluteURL = getAbsoluteURL;
module.exports.debug = debug;
module.exports.slugify = slugify;
module.exports.fileName = fileName;
module.exports.incrementCount = incrementCount;