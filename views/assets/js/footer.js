/**
 * DESCRIPTION
 *
 * @author: Jared Rethman <jared.rethman@24.com>
 * @since: 0.0.1
 *
 */

(function() {

    'use strict';

    var nbedLink = document.getElementById( 'nbed-link' );
    var nbedLinkHref = null;

    if( null !== nbedLink ){

        nbedLinkHref = nbedLink.href;
        nbedLink.addEventListener( 'click', handleClick );

    }

    function handleClick( e ){

        e.preventDefault();

        var url = 'http://localhost:8081/track_click?url=' + nbedLinkHref;
        var method = "POST";
        var async = true;
        var request = new XMLHttpRequest();

        request.onload = function () {

            var status = request.status;
            var data = request.responseText;

        };

        request.onerror = function( error ) {
            console.log( error );
        };

        //Do request
        request.open( method, url, async );
        request.setRequestHeader( "Content-Type", "application/json;charset=UTF-8" );
        request.send();

        var win = window.open( nbedLinkHref, '_blank' );

        if (win) {
            win.focus();
        } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
        }

        return false;

    }

})();