/**
 * DOMStack - A DOMStack object is used in DOM creation to create, manipulate, and append a stack of nodes to the DOM.
 * @param rootNode
 * @constructor
 */
function DOMStack(rootNode){
    var stack = [];
    if (rootNode !== undefined){
        stack[0] = rootNode;
    }
    this.getLast = function(){
        return stack[stack.length - 1];
    };
    this.createElement = function(tagName){
        stack.push(document.createElement(tagName));
    };
    this.createTextNode = function(textValue){
        stack.push(document.createTextNode(textValue));
    };
    this.appendLast = function(){
        var last = stack.pop();
        this.getLast().appendChild(last);
    };
    this.addStyles = function(cssObject){
        var lastNode = this.getLast();
        for (var i in cssObject){
            if (cssObject.hasOwnProperty(i)){
                lastNode.style[i] = cssObject[i];
            }
        }
    };
}