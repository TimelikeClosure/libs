function CSSBreakout() {
    "use strict";
    /**
     * Begin Private Methods
     */

    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

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

            this.setRootElement = function(){
                //  Base case: element is root element
                if (element.link === document.body.parentNode){
                    return element;
                }
                //  Recursive case: element is not root element
                element.parent = new ParentElementTracker(element);
                return element.parent.setRootElement();
            };

            this.setDescendantElements = function(){
                var childCount = this.link.children.length;
                for (var childIndex = 0; childIndex < childCount; childIndex++){
                    this.children.push(new ChildElementTracker(this, childIndex));
                    this.children[childIndex].setDescendantElements();
                }
            };

            this.getDOMElement = function(){
                return this.link;
            };

            this.addSelector = function(selector){
                if (selector.addElement(this)){
                    this.selectors.push({
                        selector: selector,
                        specificity: selector.getSpecifity()
                    });
                }
                for (var childIndex = 0; childIndex < this.children.length; childIndex++){
                    this.children[childIndex].addSelector(selector);
                }
            };

            this.addRule = function(rule){
                this.rules.push(rule);
                return true;
            };

            this.addSupportsRule = function(supportsRule){
                this.supportsRules.push(supportsRule);
                return true;
            };

            this.addMediaQuery = function(mediaQuery){
                this.mediaQueries.push(mediaQuery);
                return true;
            };

            this.addSheet = function(sheet){
                this.sheets.push(sheet);
                return true;
            };

            this.getOpeningTagText = function(){
                var tagText = "<";
                tagText += element.link.localName;
                var attributes = element.link.attributes;
                for (var i = 0; i < attributes.length; i++){
                    tagText += " " + attributes[i].localName + "=\"" + attributes[i].value + "\"";
                }
                tagText += ">";
                return tagText;
            };

            this.getClosingTagText = function(){
                var tagText = "</";
                tagText += element.link.localName;
                tagText += ">";
                return tagText;
            };

            this.getInheritedCSS = function(originalOptions){
                var css = "";
                if (this.parent !== null){
                    css += this.parent.getInheritedCSS(originalOptions);
                }
                css += "/* " + this.getOpeningTagText() + " */\n";
                var elementOptions = {
                    elements: {
                        inherited: false,
                        descendants: originalOptions.elements.descendants
                    },
                    styles: originalOptions.styles,
                    output: originalOptions.output
                };
                var elementCSSBreakout = new CSSBreakout();
                css += elementCSSBreakout.getCSS(this.link, elementOptions);
                css += "/* " + this.getClosingTagText() + " */\n";
                return css;
            };

            /**
             * End Public Methods
             */

            /**
             * Begin Variable Initialization
             */

            var element = this;
            this.link = elementLink;
            this.parent = null;
            this.children = [];
            this.selectors = [];
            this.rules = [];
            this.mediaQueries = [];
            this.supportsRules = [];
            this.sheets = [];

            /**
             * End Variable Initialization
             */
        }

        function ParentElementTracker(childElementTracker){
            ElementTracker.call(this, childElementTracker.link.parentElement);
            var element = this;
            this.children.push(childElementTracker);



            this.getInheritedCSS = function(originalOptions){
                var css = "";
                if (this.parent !== null){
                    css += this.parent.getInheritedCSS(originalOptions);
                }
                css += "/* " + this.getOpeningTagText() + " */\n";
                var elementOptions = {
                    elements: {
                        inherited: false,
                        descendants: false
                    },
                    styles: originalOptions.styles,
                    output: originalOptions.output
                };
                var elementCSSBreakout = new CSSBreakout();
                css += elementCSSBreakout.getCSS(this.link, elementOptions);
                css += "/* " + this.getClosingTagText() + " */\n";
                return css;
            };
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

        this.addSelector = function(selector){
            elementList.root.addSelector(selector);
        };

        this.findSelectedDeclarations = function(styleTree){

        };

        this.getInheritedCSS = function(originalOptions){
            return elementList.target.getInheritedCSS(originalOptions);
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

        if (options.inherited){ //  Add inherited elements, if applicable
            elementList.root = elementList.target.setRootElement();
        } else if (options.descendants){  //  Add descendant elements, if applicable
            elementList.target.setDescendantElements();
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

        function addElements(testElements){
            while (testElements.length > 0){
                var testElement = testElements.shift();
                if (sheetList.elements.indexOf(testElement) < 0 && testElement.addSheet(sheet)){
                    sheetList.elements.push(testElement);
                }
            }
        }

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

            this.getCSS = function(){
                var output = "";
                output += this.declaration.keyHTML += ": ";
                output += this.declaration.value += ";\n";
                return output;
            };

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

        function StyleSelectorTracker(selectorOriginalString){
            /**
             * Begin Private Methods
             */

            function setSpecificity(originalText){
                var specificity = [0, 0, 0];

                //  calculate specificity from count of: (ids), (classes, attributes, pseudo-classes), (types, pseudo-elements)

                return specificity;
            }

            function setSearchText(originalText){

                var removeSelectorPortions = [];
                if (options.preservePseudoElements){
                    removeSelectorPortions = removeSelectorPortions.concat(['::before', '::after', ':before', ':after']);
                }
                if (options.preserveElementStates){
                    removeSelectorPortions = removeSelectorPortions.concat([':hover', ':focus', ':active', ':visited']);
                }
                removeSelectorPortions = removeSelectorPortions.concat([':not()']);
                var reducedText = originalText;
                for (var index = 0; index < removeSelectorPortions.length; index++){
                    if (reducedText.indexOf(removeSelectorPortions[index]) == 0){
                        reducedText = "*" + reducedText.slice(removeSelectorPortions[index].length, reducedText.length);
                    }
                    reducedText = reducedText.split(' ' + removeSelectorPortions[index]).join(' *');
                    reducedText = reducedText.split('>' + removeSelectorPortions[index]).join('>*');
                    reducedText = reducedText.split(removeSelectorPortions[index]).join('');
                }
                return reducedText;
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

            this.getSearchText = function(){
                return this.searchText;
            };

            this.getSpecifity = function(){
                return this.specificity;
            };

            this.addElement = function(element){
                if (element.getDOMElement().matches(this.searchText)){
                    this.elements.push(element);
                    return true;
                }
                return false;
            };

            this.findSelectedElements = function(elementTree){
                elementTree.addSelector(this);
                return this.elements;
            };

            this.getCSS = function(){
                return this.originalText;
            };

            /**
             * End Public Methods
             */

            /**
             * Begin Variable Initialization
             */

            this.originalText = selectorOriginalString.trim();
            this.specificity = setSpecificity(this.originalText);
            this.searchText = setSearchText(this.originalText);
            if (this.searchText === ''){
                console.log('Warning, StyleSelectorTracker.searchText is empty for: ', this.originalText);
            }
            this.elements = [];


            /**
             * End Variable Initialization
             */
        }

        function StyleRuleTracker(styleRuleLink){
            /**
             * Begin Private Methods
             */

            function addElements(testElements){
                while (testElements.length > 0){
                    var testElement = testElements.shift();
                    if (rule.elements.indexOf(testElement) < 0 && testElement.addRule(rule)){
                        rule.elements.push(testElement);
                    }
                }
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

            this.findSelectedElements = function(elementTree){
                for (var selectorIndex = this.selectors.length - 1 ; selectorIndex >= 0 ; selectorIndex--){
                    var selectorElements = this.selectors[selectorIndex].findSelectedElements(elementTree);
                    if (selectorElements.length > 0) {
                        addElements(selectorElements);
                    } else if (!options.fullSelectorText){
                        this.selectors.splice(selectorIndex, 1);
                    }
                }
                return this.elements;
            };

            this.getCSS = function(){
                var output = "";
                var selectorOutputList = [];
                for (var index = 0; index < this.selectors.length; index++){
                    selectorOutputList.push(this.selectors[index].getCSS());
                }
                output += selectorOutputList.join(",") + " {\n";
                for (var index = 0; index < this.declarations.length; index++){
                    output += this.declarations[index].getCSS();
                }
                output += "}\n";
                return output;
            };

            /**
             * End Public Methods
             */

            /**
             * Begin Variable Initialization
             */

            var rule = this;
            this.link = styleRuleLink;
            this.selectors = [];
            var selectorList= this.link.selectorText.split(',');
            for (var selector = 0; selector < selectorList.length; selector++){
                this.selectors.push(new StyleSelectorTracker(selectorList[selector], this));
            }
            this.declarations = [];
            for (var declaration = 0; declaration < this.link.style.length; declaration++){
                this.declarations.push(new StyleDeclarationTracker(this.link.style, declaration));
            }
            this.elements = [];

            /**
             * End Variable Initialization
             */
        }



        if (options.preserveMediaQueries){

            var SupportsRuleTracker = function(supportsRuleLink){
                /**
                 * Begin Private Methods
                 */

                function addRulesToList(originalRulesList, rulesTrackerList){
                    for (var ruleIndex = 0; ruleIndex < originalRulesList.length; ruleIndex++){
                        var rule = originalRulesList[ruleIndex];
                        if (rule instanceof CSSStyleRule){  //  if rule is a style, add tracker for it
                            rulesTrackerList.push(new StyleRuleTracker(rule));
                        } else if (rule instanceof CSSMediaRule){   //  if rule is a media query,
                            rulesTrackerList.push(new MediaRuleTracker(rule, addRulesToList));
                        } else if (rule instanceof CSSSupportsRule){   //  if rule is a supports rule,
                            rulesTrackerList.push(new SupportsRuleTracker(rule, addRulesToList));
                        } else {
                            rulesTrackerList.push(null);
                            console.log('Warning, invalid rule type: ', rule);
                        }
                    }
                }

                function addElements(testElements){
                    while (testElements.length > 0){
                        var testElement = testElements.shift();
                        if (supportsRule.elements.indexOf(testElement) < 0 && testElement.addSupportsRule(supportsRule)){
                            supportsRule.elements.push(testElement);
                        }
                    }
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

                this.findSelectedElements = function(elementTree){
                    for (var ruleIndex = this.rules.length - 1; ruleIndex >= 0; ruleIndex--){
                        var ruleElements = this.rules[ruleIndex].findSelectedElements(elementTree);
                        if (ruleElements.length > 0){
                            addElements(ruleElements);
                        } else {
                            this.rules.splice(ruleIndex, 1);
                        }
                    }
                    return this.elements;
                };

                this.outputJS = function(){
                    var output = [];
                    for (var index = 0; index < this.rules.length; index++){
                        output = output.concat(this.rules[index].outputJS());
                    }
                    return output;
                };

                this.getCSS = function(){
                    var output = "@supports " + this.link.conditionText + " {\n";
                    var mediaSelectors = [];
                    for (var index = 0; index < this.rules.length; index++){
                        output += this.rules[index].getCSS();
                    }
                    output += "}\n";
                    return output;
                };

                /**
                 * End Public Methods
                 */

                /**
                 * Begin Variable Initialization
                 */

                var supportsRule = this;
                this.link = supportsRuleLink;
                this.rules = [];
                this.elements = [];
                addRulesToList(this.link.cssRules, this.rules);

                /**
                 * End Variable Initialization
                 */
            };

            var MediaRuleTracker = function(mediaRuleLink){
                /**
                 * Begin Private Methods
                 */

                function addRulesToList(originalRulesList, rulesTrackerList){
                    for (var ruleIndex = 0; ruleIndex < originalRulesList.length; ruleIndex++){
                        var rule = originalRulesList[ruleIndex];
                        if (rule instanceof CSSStyleRule){  //  if rule is a style, add tracker for it
                            rulesTrackerList.push(new StyleRuleTracker(rule));
                        } else if (rule instanceof CSSMediaRule){   //  if rule is a media query,
                            rulesTrackerList.push(new MediaRuleTracker(rule, addRulesToList));
                        } else if (rule instanceof CSSSupportsRule){   //  if rule is a supports rule,
                            rulesTrackerList.push(new SupportsRuleTracker(rule, addRulesToList));
                        } else {
                            rulesTrackerList.push(null);
                            console.log('Warning, invalid rule type: ', rule);
                        }
                    }
                }

                function addElements(testElements){
                    while (testElements.length > 0){
                        var testElement = testElements.shift();
                        if (mediaRule.elements.indexOf(testElement) < 0 && testElement.addMediaQuery(mediaRule)){
                            mediaRule.elements.push(testElement);
                        }
                    }
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

                this.findSelectedElements = function(elementTree){
                    for (var ruleIndex = this.rules.length - 1; ruleIndex >= 0; ruleIndex--){
                        var ruleElements = this.rules[ruleIndex].findSelectedElements(elementTree);
                        if (ruleElements.length > 0){
                            addElements(ruleElements);
                        } else {
                            this.rules.splice(ruleIndex, 1);
                        }
                    }
                    return this.elements;
                };

                this.outputJS = function(){
                    var output = [];
                    for (var index = 0; index < this.rules.length; index++){
                        output = output.concat(this.rules[index].outputJS());
                    }
                    return output;
                };

                this.getCSS = function(){
                    var output = "@media " + this.link.media.mediaText + " {\n";
                    var mediaSelectors = [];
                    for (var index = 0; index < this.rules.length; index++){
                        output += this.rules[index].getCSS();
                    }
                    output += "}\n";
                    return output;
                };

                /**
                 * End Public Methods
                 */

                /**
                 * Begin Variable Initialization
                 */

                var mediaRule = this;
                this.link = mediaRuleLink;
                this.rules = [];
                this.elements = [];
                addRulesToList(this.link.cssRules, this.rules);

                /**
                 * End Variable Initialization
                 */
            };
        }

        function StyleSheetTracker(styleSheetLink){
            /**
             * Begin Private Methods
             */

            var addRulesToList;
            if (options.preserveMediaQueries){
                addRulesToList = function(originalRulesList, rulesTrackerList){
                    for (var ruleIndex = 0; ruleIndex < originalRulesList.length; ruleIndex++){
                        var rule = originalRulesList[ruleIndex];
                        if (rule instanceof CSSStyleRule){  //  if rule is a style, add tracker for it
                            rulesTrackerList.push(new StyleRuleTracker(rule));
                        } else if (rule instanceof CSSMediaRule){   //  if rule is a media query,
                            rulesTrackerList.push(new MediaRuleTracker(rule));
                        } else if (rule instanceof CSSSupportsRule){   //  if rule is a supports rule,
                            rulesTrackerList.push(new SupportsRuleTracker(rule, addRulesToList));
                        } else {
                            //rulesTrackerList.push(null);
                            console.log('Warning, invalid rule type: ', rule);
                        }
                    }
                }
            } else {
                addRulesToList = function(originalRulesList, rulesTrackerList){
                    for (var ruleIndex = 0; ruleIndex < originalRulesList.length; ruleIndex++){
                        var rule = originalRulesList[ruleIndex];
                        if (rule instanceof CSSStyleRule){  //  if rule is a style, add tracker for it
                            rulesTrackerList.push(new StyleRuleTracker(rule));
                        } else if (rule instanceof CSSMediaRule){   //  if rule is a media query,
                            if (window.matchMedia(rule.media.mediaText).matches){ //  and if media query is active, add included rules
                                addRulesToList(rule.cssRules, rulesTrackerList);
                            }
                        } else if (rule instanceof CSSSupportsRule){   //  if rule is a supports rule,
                            if (CSS.support(rule.conditionText)){ //  and if supports rule is active, add included rules
                                addRulesToList(rule.cssRules, rulesTrackerList);
                            }
                        } else {
                            rulesTrackerList.push(null);
                            console.log('Warning, invalid rule type: ', rule);
                        }
                    }
                }
            }

            function addElements(testElements){
                while (testElements.length > 0){
                    var testElement = testElements.shift();
                    if (sheet.elements.indexOf(testElement) < 0 && testElement.addSheet(sheet)){
                        sheet.elements.push(testElement);
                    }
                }
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

            this.findSelectedElements = function(elementTree){
                for (var ruleIndex = this.rules.length - 1; ruleIndex >= 0; ruleIndex--){
                    var rulesElements = this.rules[ruleIndex].findSelectedElements(elementTree);
                    if (rulesElements.length > 0){
                        addElements(rulesElements);
                    } else {
                        this.rules.splice(ruleIndex, 1);
                    }
                }
                return this.elements;
            };

            this.getCSS = function(){
                var output = "";
                for (var index = 0; index < this.rules.length; index++){
                    output += this.rules[index].getCSS();
                }
                return output;
            };

            /**
             * End Public Methods
             */

            /**
             * Begin Variable Initialization
             */

            var sheet = this;
            this.link = styleSheetLink;
            this.rules = [];
            this.elements = [];
            addRulesToList(this.link.rules, this.rules);

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

        this.findSelectedElements = function(elementTree){
            var sheets = sheetList.sheets;
            for (var sheetIndex = sheets.length - 1; sheetIndex >= 0; sheetIndex--){
                var sheetElements = sheets[sheetIndex].findSelectedElements(elementTree);
                if (sheetElements.length > 0){
                    console.log("sheet kept: ", sheets[sheetIndex]);
                    addElements(sheetElements);
                } else {
                    console.log("sheet spliced: ", sheets[sheetIndex]);
                    sheets.splice(sheetIndex, 1);
                }
            }
            console.log("Trimmed stylesheet tree: ", sheetList);
        };

        this.output = function(outputOptions){
            switch (outputOptions.format){
                case "css":
                    var output = "";
                    for (var index = 0; index < sheetList.sheets.length; index++){
                        output += sheetList.sheets[index].getCSS();
                    }
                    return output;
            }
        };

        /**
         * End Public Methods
         */

        /**
         * Begin Variable Initialization
         */

        var sheetList = {
            link: document.styleSheets,
            elements: [],
            sheets: []
        };
        for (var sheet = 0; sheet < sheetList.link.length; sheet++){
            if (sheetList.link[sheet].cssRules !== null){
                sheetList.sheets.push(new StyleSheetTracker(sheetList.link[sheet]));
            }
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
        //  If checking inherited properties, get CSS for each part of inherited chain
        if (elementOptions.inherited){
            var inheritedOptions = {
                elements: elementOptions,
                styles: getCombinedOptions(options, 'styles'),
                output: getCombinedOptions(options, 'output')
            };
            return elements.getInheritedCSS(inheritedOptions);
        }

        //  Create the stylesheet tree
        var styleOptions = getCombinedOptions(options, 'styles');
        var sheets = new StyleSheetTreeTracker(styleOptions);

        //  Filter in selectors of the stylesheet tree used by the element tree
        sheets.findSelectedElements(elements);

        //  Filter out declarations overwritten by other declarations
        elements.findSelectedDeclarations(sheets);

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
            inherited: true,   //  check for inherited properties on the target element
            descendants: true  //  check for properties affecting any of target element's children
        },
        styles: {
            preserveMediaQueries: true, //  preserve media query blocks instead of selecting rules inside currently applied media queries
            preservePseudoElements: true,    //  preserve pseudo elements
            preserveElementStates: true,   //  preserve element state selectors instead of selecting currently applied states
            fullSelectorText: false, //  preserve full list of selectors instead of filtering out unused ones
            overwrittenStyleRules: true,    //  used on filter-out declarations
            overwrittenStyleDeclarations: true, //  used on filter-out declarations
            inline: false   //  used on filter-out declarations
        },
        output: {
            format: 'css'
        }
    };

    /**
     * End Variable Initialization
     */
}