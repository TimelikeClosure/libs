/**
 * cssbreakouttest.js - script for testing cssbreakout.js
 */

var elementCSS = new CSSBreakout();

document.addEventListener("DOMContentLoaded", function(){
    var element = document.getElementById('test');
    elementCSS.getCSS(element, {
        elements: {
            inherited: false,
            descendants: false
        },
        styles: {
            preserveMediaQueries: false
        }
    });
});