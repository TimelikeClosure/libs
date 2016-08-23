/**
 * cssbreakouttest.js - script for testing cssbreakout.js
 */

var elementCSS = new CSSBreakout();

document.addEventListener("DOMContentLoaded", function(){
    var element = document.getElementById('test');
    var css = elementCSS.getCSS(element, {
        elements: {
            inherited: true,
            descendants: true
        },
        styles: {
            preserveMediaQueries: true,
            preservePseudoElements: true,
            preserveElementStates: true,
            fullSelectorText: false
        },
        output: {
            format: 'css'
        }
    });
    console.log(css);
    document.getElementById("output").getElementsByTagName("pre")[0].textContent = css;
});