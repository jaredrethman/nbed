/**
 * NBED DATA
 *
 * @author: Jared Rethman <jared.rethman@24.com>
 * @since: 0.0.1
 *
 */

var getFavicon = function( links, $ ) {
    'use strict';

    var keys = Object.keys(links);
    var icon = '';

    keys.forEach( function ( key ) {

        if( links[key].attribs && links[key].attribs.hasOwnProperty('rel') ) {
            var rel = links[key].attribs.rel.toLowerCase();
            if(
                rel === 'icon' ||
                rel === 'shortcut icon' ||
                rel === 'apple-touch-icon'
            ){
                icon = links[key].attribs.href;
                return false;
            }
        }


    });

    return icon;
}
var getOGTags = function( model, meta, $ ){
    'use strict';

    /*
     * Populate the model
     * */
    for( var i = 0, m = Object.keys( meta ).length; i < m; i++ ){

        var name = $( meta[i] ).attr( 'name' ),
            prop = $( meta[i] ).attr( 'property' );

        //Type
        if(
            '' === model.ogType &&
            (
                'og:type' === prop ||
                'og:type' === name
            )
        ){
            model.ogType = $( meta[i] ).attr( 'content' );
        }
        //Title
        if(
            '' === model.ogTitle &&
            (
                'og:title' === prop ||
                'og:title' === name  ||
                'twitter:title' === name ||
                'twitter:title' === prop
            )
        ){
            model.ogTitle = $( meta[i] ).attr( 'content' );
        }
        //Description
        if(
            '' === model.ogDescription &&
            (
                'og:description' === prop ||
                'og:description' === name  ||
                'twitter:description' === name ||
                'twitter:description' === prop ||
                'description' === name
            )
        ){
            model.ogDescription = $( meta[i] ).attr( 'content' );
        }
        //URL
        if(
            '' === model.ogUrl &&
            (
                'og:url' === prop ||
                'og:url' === name  ||
                'twitter:url' === name ||
                'twitter:url' === prop
            )
        ){
            model.ogUrl = $( meta[i] ).attr( 'content' );
        }
        //Image
        if(
            '' === model.ogImage.src &&
            (
                'og:image' === prop ||
                'og:image' === name ||
                'twitter:image' === name ||
                'twitter:image' === prop
            )
        ){
            model.ogImage.src = $( meta[i] ).attr( 'content' );
        }
        //Image dimensions
        if(
            '' === model.ogImage.width &&
            (
                'og:image:width' === prop ||
                'og:image:width' === name ||
                'twitter:width' === name ||
                'twitter:width' === prop
            )
        ){
            model.ogImage.width = $( meta[i] ).attr( 'content' );
        } else if (
            '' === model.ogImage.height &&
            (
                'og:image:height' === prop ||
                'og:image:height' === name ||
                'twitter:height' === name ||
                'twitter:height' === prop
            )
        ){
            model.ogImage.height = $( meta[i] ).attr( 'content' );
        }
        //Modified date
        if(
            '' === model.ogModified &&
            (
                'og:updated_time' === prop ||
                'og:updated_time' === name ||
                'article:modified_time' === prop ||
                'article:modified_time' === name
            )
        ){
            model.ogModified = $( meta[i] ).attr( 'content' );
        }

    }
    /*
     * Fallbacks
     * */
    //Title
    if ( '' === model.ogTitle ){
        var title = $('head > title');
        model.ogTitle = typeof title.text() !== 'undefined' ? title.text() : '';
    }
    //Description
    if ( '' === model.ogDescription ){
        var pTag = $('body').find('p').first();
        model.ogDescription = typeof pTag !== 'undefined' ? pTag.text() : '';
    }
    //Image
    if ( '' === model.ogImage.src && typeof $( 'img' ).first().attr( 'src' ) !== 'undefined' ){
        model.ogImage.src = $( 'img' ).first().attr( 'src' );
    }
    //URL
    if ( '' === model.ogUrl && typeof $( 'link[rel=canonical]').attr( 'href' ) !== 'undefined' ){
        model.ogUrl = $( 'link[rel=canonical]').attr( 'href' );
    }

}

/*
* Exports
* */
module.exports.getFavicon = getFavicon;
module.exports.getOGTags = getOGTags;