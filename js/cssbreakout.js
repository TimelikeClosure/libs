
function CSSBreakout() {

    var config = {
        elements: {
            inherited: false,   //  used on construction
            descendants: false  //  used on construction
        },
        styles: {
            mediaQueries: true, //  used on construction
            elementStates: false,   //  used on construction
            unusedPseudoElements: false,    //  used on filter-in selectors
            overwrittenStyleRules: true,    //  used on filter-out declarations
            overwrittenStyleDeclarations: true, //  used on filter-out declarations
            fullSelectorText: false, //  used on filter-in selectors
            inline: false   //  used later
        },
        output: {
            format: 'javascript'
        }
    };
    ///**
    // * Interface for configuration rules list. If no parameter is provided, returns a list of current config options
    // * @param {Object|undefined} ruleList
    // * @returns {Object|boolean}
    // */
    //this.config = function(ruleList){
    //    if (ruleList === undefined) {
    //        return copyObject(config);
    //    }
    //    for (var rule in ruleList){
    //        if (ruleList.hasOwnProperty(rule) && config.hasOwnProperty(rule)){
    //            config[rule] = ruleList[rule];
    //        }
    //    }
    //};
    //
    //this.getStyles = function(ruleList){
    //    //  Set up rules for current this.getStyles() call
    //    if (ruleList === undefined) {
    //        var rules = copyObject(config);
    //    } else {
    //        var currentConfig = copyObject(config);
    //        this.config(ruleList);
    //        rules = copyObject(config);
    //        config = currentConfig;
    //    }
    //
    //    var includedStyleSheetRules = new StyleSheetTracker(targetElement);
    //
    //    //  Get links to style rules for all relevant elements (inclusive)
    //    includedStyleSheetRules.getIncludedRules(targetElement);
    //    console.log("includedStyleSheetRules: ", includedStyleSheetRules);
    //    //  Filter out all overwritten / unused css as configured (exclusive)
    //
    //    //  Format output
    //
    //    //  Return output
    //
    //};


    /**
     * copyObject - returns a clone of the given object or array with no shared references
     * @param {Object|Array} originalObject - reference object to clone
     * @returns {Object|Array} clone of the given reference object
     */
    function copyObject(originalObject){
        if (Array.isArray(originalObject)){
            var copiedObject = [];
        } else {
            copiedObject = {};
        }
        for (var key in originalObject){
            if (originalObject.hasOwnProperty(key)){
                if (typeof originalObject[key] != "object" || originalObject[key] === null){
                    copiedObject[key] = originalObject[key];
                } else {
                    copiedObject[key] = copyObject(originalObject[key]);
                }
            }
        }
        return copiedObject;
    }

    /**
     * ElementTreeTracker - constructs an object representing all elements
     * @param targetElement
     * @param options
     * @constructor
     */
    function ElementTreeTracker(targetElement, options){
        this.targetElement = function(){return targetElement};
    }

    /**
     * StyleSheetTracker - constructs an object representing all stylesheets, rules, and declarations
     * @param {Object} options - list of stylesheet options
     * @constructor
     */
    function StyleSheetTreeTracker(options){


    }

    /**
     * this.getCSS - returns all css rules and declarations based upon provided option values (if provided) or defaults (if not).
     * @param {Element} targetElement - element to use as the base for all styles
     * @param {Object} [options] - one-time configuration object
     * @returns {*|{format}}
     */
    this.getCSS = function(targetElement, options = {}){

        //  Create the element tree
        var elementOptions = copyObject(config.elements);
        if (options.hasOwnProperty('elements')){
            for (var option in elementOptions){
                if (options.elements.hasOwnProperty(option)){
                    elementOptions[option] = options.elements[option];
                }
            }
        }
        var elements = new ElementTreeTracker(targetElement, elementOptions);

        //  Create the stylesheet tree
        var styleOptions = copyObject(config.styles);
        if (options.hasOwnProperty('styles')){
            for (option in styleOptions){
                if (options.styles.hasOwnProperty(option)){
                    styleOptions[option] = options.styles[option];
                }
            }
        }
        var sheets = new StyleSheetTreeTracker(styleOptions);

        //  Filter in selectors of the stylesheet tree used by the element tree
        sheets.filterUsedSelectors(elements);

        //  Filter out declarations overwritten by other declarations
        elements.filterOverwrittenDeclarations(sheets);

        //  Return output
        var outputOptions = copyObject(config.output);
        if (options.hasOwnProperty('output')){
            for (option in outputOptions){
                if (options.output.hasOwnProperty(option)){
                    outputOptions[option] = options.output[option];
                }
            }
        }
        return sheets.output(outputOptions);
    };
}

var element = document.getElementById('test');
var elementCSS = new CSSBreakout();
elementCSS.getCSS(element);