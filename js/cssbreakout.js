
function CSSBreakout() {
    /**
     * Begin Private Methods
     */

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
     * getCombinedOptions - Returns an object that combines the [key] portion of the config and inputOptions object. Any subkeys that exist in both
     * @param inputOptions
     * @param key
     * @returns {Object|Array}
     */
    function getCombinedOptions(inputOptions, key){
        var combinedOptions = copyObject(config[key]);
        if (inputOptions.hasOwnProperty(key)){
            for (var option in combinedOptions){
                if (inputOptions[key].hasOwnProperty(option)){
                    combinedOptions[option] = inputOptions[key][option];
                }
            }
        }
        return combinedOptions;
    }

    /**
     * End Private Methods
     */

    /**
     * Begin Constructors
     */

    /**
     * ElementTreeTracker - constructs an object representing all elements
     * @param targetElement
     * @param options
     * @constructor
     */
    function ElementTreeTracker(targetElement, options){
        /**
         * Begin Private Methods
         */



        /**
         * End Private Methods
         */

        /**
         * Begin Constructors
         */


        /**
         * End Constructors
         */

        /**
         * Begin Public Methods
         */

        this.targetElement = function(){return targetElement};

        /**
         * End Public Methods
         */

        /**
         * Begin Variable Initialization
         */



        /**
         * End Variable Initialization
         */
    }

    /**
     * StyleSheetTracker - constructs an object representing all stylesheets, rules, and declarations
     * @param {Object} options - list of stylesheet options
     * @constructor
     */
    function StyleSheetTreeTracker(options){
        /**
         * Begin Private Methods
         */



        /**
         * End Private Methods
         */

        /**
         * Begin Constructors
         */



        /**
         * End Constructors
         */

        /**
         * Begin Public Methods
         */

        this.filterUsedSelectors = function(elementTree){

        };

        /**
         * End Public Methods
         */

        /**
         * Begin Variable Initialization
         */


        /**
         * End Variable Initialization
         */
    }

    /**
     * End Constructors
     */

    /**
     * Begin Public Methods
     */

    /**
     * this.getCSS - returns all css rules and declarations based upon provided option values (if provided) or defaults (if not).
     * @param {Element} targetElement - element to use as the base for all styles
     * @param {Object} [options] - one-time configuration object
     * @returns {*|{format}}
     */
    this.getCSS = function(targetElement, options = {}){

        //  Create the element tree
        var elementOptions = getCombinedOptions(options, 'elements');
        var elements = new ElementTreeTracker(targetElement, elementOptions);

        //  Create the stylesheet tree
        var styleOptions = getCombinedOptions(options, 'styles');
        var sheets = new StyleSheetTreeTracker(styleOptions);

        //  Filter in selectors of the stylesheet tree used by the element tree
        sheets.filterUsedSelectors(elements);

        //  Filter out declarations overwritten by other declarations
        elements.filterOverwrittenDeclarations(sheets);

        //  Return output
        var outputOptions = getCombinedOptions(options, 'output');
        return sheets.output(outputOptions);
    };

    /**
     * End Public Methods
     */

    /**
     * Begin Variable Initialization
     */

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
            inline: false   //  used on filter-out declarations
        },
        output: {
            format: 'javascript'
        }
    };

    /**
     * End Variable Initialization
     */
}

var element = document.getElementById('test');
var elementCSS = new CSSBreakout();
elementCSS.getCSS(element);