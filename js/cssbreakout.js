
function CSSBreakout() {

    var config = {
        elements: {
            inherited: false,
            descendants: false
        },
        styles: {
            mediaQueries: true,
            elementStates: false,
            unusedPseudoElements: false,
            overwrittenStyleRules: true,
            overwrittenStyleDeclarations: true,
            fullSelectorText: false
        },
        outputFormat: 'javascript'
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

    function ElementTreeTracker(targetElement, options = config.filter.elements){
        this.targetElement = function(){return targetElement};
    }

    /**
     * StyleSheetTracker - constructs an object representing all stylesheets, rules, and declarations
     * @param targetElement
     * @constructor
     */
    function StyleSheetTreeTracker(options){
        var styleSheetList = document.styleSheets;
        this.elements = {};
        this.sheets = [];
        for (var sheet = 0; sheet < styleSheetList.length; sheet++){
            console.log("Adding sheet: ", styleSheetList[sheet]);
            this.sheets.push(new StyleRuleTracker(styleSheetList[sheet]));
        }

        function StyleRuleTracker (styleSheet){
            this.link = styleSheet;
            this.rules = new Array(styleSheet.rules.length);
        }

        function StyleDeclarationTracker (styleRule){

        }

        /**
         * getSelectedRules - Adds all rules that select the given element to includedRules.
         * @param {Element} element
         * @param {Object} includedRules
         * @param {Object} styleSheets
         * @returns {boolean}
         */
        function getSelectedRules(element, includedRules, styleSheets){

            //  Check each stylesheet in order
            for (var sheet = 0; sheet < styleSheets.length; sheet++){
                console.log("stylesheet # " + sheet + ": ", styleSheets[sheet]);
            }

            return true;
        }

        this.getIncludedRules = function(targetElement){
            var docStyleSheets = document.styleSheets;
            console.log("stylesheets: ", docStyleSheets);
            //  initialize includedStyleSheetRules


            //  Get style rules applied directly to targetElement
            getSelectedRules(targetElement);
            //  Get style rules applied indirectly to targetElement through inheritance if necessary

            //  Get style rules applied to targetElement's descendants if necessary

            return includedStyleSheetRules;
        };
    }

    this.getCSSTree = function(targetElement, options = {}){
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
        var sheets = new StyleSheetTreeTracker();
    };
}

var element = document.getElementById('test');
var elementCSS = new CSSBreakout(element);
elementCSS.getStyles();