
function CSSBreakout(rootElement) {

    var config = {
        recursive: false
    };
    /**
     * Interface for configuration rules list. If no parameter is provided, returns a list of current config options
     * @param {Object|undefined} ruleList
     * @returns {Object|boolean}
     */
    this.config = function(ruleList){
        if (ruleList === undefined) {
            return copyObject(config);
        }
        for (var rule in ruleList){
            if (ruleList.hasOwnProperty(rule) && config.hasOwnProperty(rule)){
                config[rule] = ruleList[rule];
            }
        }
    };

    this.getStyles = function(ruleList){
        //  Set up rules for current this.getStyles() call
        if (ruleList === undefined) {
            var rules = copyObject(config);
        } else {

        }

    };

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
}