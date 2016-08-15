
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

        function ElementTracker(elementLink){
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

            this.getRootElement = function(){
                //  Base case: element is root element
                if (this.link === document.body.parentNode){
                    return this;
                }
                //  Recursive case: element is not root element
                this.parent = new ParentElementTracker(this);
                return this.parent.getRootElement();
            };

            this.getDescendantElements = function(){
                var childCount = this.link.children.length;
                for (var childIndex = 0; childIndex < childCount; childIndex++){
                    this.children.push(new ChildElementTracker(this, childIndex));
                    this.children[childIndex].getDescendantElements();
                }
            };

            /**
             * End Public Methods
             */

            /**
             * Begin Variable Initialization
             */

            this.link = elementLink;
            this.parent = null;
            this.children = [];

            /**
             * End Variable Initialization
             */
        }

        function ParentElementTracker(childElementTracker){
            ElementTracker.call(this, childElementTracker.link.parentElement);
            this.children.push(childElementTracker);
        }

        function ChildElementTracker(parentElementTracker, childIndex){
            ElementTracker.call(this, parentElementTracker.link.children[childIndex]);
            this.parent = parentElementTracker;
        }

        /**
         * End Constructors
         */

        /**
         * Begin Public Methods
         */

        this.filterOverwrittenDeclarations = function(styleTree){

        };

        /**
         * End Public Methods
         */

        /**
         * Begin Variable Initialization
         */

        //  Create base object for referencing important ElementTrackers
        //  Add target element
        var elementList = {
            target: new ElementTracker(targetElement)
        };
        elementList.root = elementList.target;
        //  Add inherited elements, if applicable
        if (options.inherited){
            elementList.root = elementList.target.getRootElement();
        }
        //  Add descendant elements, if applicable
        if (options.descendants){
            elementList.target.getDescendantElements();
        }
        console.log("Added element tree: ", elementList);

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

        function StyleDeclarationTracker(styleDeclarationListLink, styleDeclarationIndex){
            /**
             * Begin Private Methods
             */

            function htmlToJs(htmlString){
                var tempString = "";
                var jsString = htmlString;
                while (jsString != tempString){
                    tempString = jsString;
                    jsString = tempString.replace(/-([a-z])/i, function(a,b){
                        var c = b; return c.toUpperCase();
                    });
                }
                return jsString;
            }

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


            /**
             * End Public Methods
             */

            /**
             * Begin Variable Initialization
             */

            this.listLink = styleDeclarationListLink;
            this.index = styleDeclarationIndex;
            this.declaration = {keyHTML: styleDeclarationListLink[styleDeclarationIndex]};
            this.declaration.keyJS = htmlToJs(this.declaration.keyHTML);
            this.declaration.value = this.listLink[this.declaration.keyJS];

            /**
             * End Variable Initialization
             */
        }

        function StyleRuleTracker(styleRuleLink){
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


            /**
             * End Public Methods
             */

            /**
             * Begin Variable Initialization
             */

            this.link = styleRuleLink;
            this.declarations = [];
            for (var declaration = 0; declaration < this.link.style.length; declaration++){
                this.declarations.push(new StyleDeclarationTracker(this.link.style, declaration));
            }

            /**
             * End Variable Initialization
             */
        }

        function StyleSheetTracker(styleSheetLink){
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


            /**
             * End Public Methods
             */

            /**
             * Begin Variable Initialization
             */

            this.link = styleSheetLink;
            this.rules = [];
            for (var rule = 0; rule < this.link.rules.length; rule++){
                this.rules.push(new StyleRuleTracker(this.link.rules[rule]));
            }

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

        this.filterUsedSelectors = function(elementTree){

        };

        this.output = function(outputOptions){

        };

        /**
         * End Public Methods
         */

        /**
         * Begin Variable Initialization
         */

        var sheetList = {
            link: document.styleSheets,
            sheets: []
        };
        for (var sheet = 0; sheet < sheetList.link.length; sheet++){
            sheetList.sheets.push(new StyleSheetTracker(sheetList.link[sheet]));
        }
        console.log("Added stylesheet tree: ", sheetList);

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
            fullSelectorText: false, //  used on filter-in selectors
            overwrittenStyleRules: true,    //  used on filter-out declarations
            overwrittenStyleDeclarations: true, //  used on filter-out declarations
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