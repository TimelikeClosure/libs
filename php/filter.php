<?php
    /**
     * filter.php - contains functions and methods for validating inputs
     */


    /**
     * filterInput - filters the given key inside the given input superglobal against the given filter
     * @param {Array) $inputSuperglobal - superglobal to check for key
     * @param {string} $key - superglobal key to test
     * @param {string|Object} $filter - filter to apply, either a RegEx string or a FILTER
     * @return {Array} - associative array with the following keys:
     *      'result' => the filtered result if successful, false otherwise,
     *      'success' => true if successful, false otherwise,
     *      'errMsg' => message that indicates reason for failure if 'success' => false
     */
    function filterInput($inputSuperglobal, $key, $filter) {
        $output = [
            'success' => null
        ];
        if (is_string($filter) && preg_match("/^\/.+\/[a-z]*$/i", $filter)) { //  Test if $filter is regex
            $output['result'] = filter_var($inputSuperglobal[$key], FILTER_VALIDATE_REGEXP, ['options'=>['regexp'=>$filter]]);
            $output['success'] = !empty($output['result'] ? true : $output['result']);
            if (!$output['success']) {
                $output['errMsg'] = 'key ' . $key . ' has failed against regex filter: ' .$filter;
            }
        } else {
            $output['result'] = filter_var($inputSuperglobal[$key], $filter);
            $output['success'] = !empty($output['result']);
            if (!$output['success']) {
                $output['errMsg'] = 'key ' . $key . ' has failed against filter: ' . $filter;
            }
        }
        return $output;
    }

    /**
     * filterGet - filters the given $_GET key against the given filter
     * @param {string} $key - $_GET key to test
     * @param {string|Object} $filter - filter to apply, either a RegEx string or a FILTER
     * @return {Array} - associative array with the following keys:
     *      'result' => the filtered result if successful, false otherwise,
     *      'success' => true if successful, false otherwise,
     *      'errMsg' => message that indicates reason for failure if 'success' => false
     */
    function filterGet($key, $filter) {
        return filterInput($_GET, $key, $filter);
    }

    /**
     * filterPost - filters the given $_POST key against the given filter
     * @param {string} $key - $_POST key to test
     * @param {string|Object} $filter - filter to apply, either a RegEx string or a FILTER
     * @return {Array} - associative array with the following keys:
     *      'result' => the filtered result if successful, false otherwise,
     *      'success' => true if successful, false otherwise,
     *      'errMsg' => message that indicates reason for failure if 'success' => false
     */
    function filterPost($key, $filter) {
        return filterInput($_POST, $key, $filter);
    }

    /**
     * filterInputArray - filters the given keys inside the given input superglobal against their given filters
     * @param {Array} $inputSuperglobal - superglobal to check for keys
     * @param {string[]} $keyFilterArray - associative array of keys and filters to test them against, with each pair in the form 'key' => $filter
     * @return {Array} - associative array of associative arrays. Outer array uses keys given by $keyFilterArray to link to inner arrays. Inner arrays have the following keys:
     *      'result' => the filtered result if successful, false otherwise,
     *      'success' => true if successful, false otherwise,
     *      'errMsg' => message that indicates reason for failure if 'success' => false
     */
    function filterInputArray($inputSuperglobal, $keyFilterArray) {
        $output = [];
        foreach($keyFilterArray as $key => $filter) {
            $output[$key] = filterInput($inputSuperglobal, $key, $filter);
        }
        return $output;
    }

    /**
     * filterGetArray - filters the given keys inside $_GET against their given filters
     * @param {string[]} $keyFilterArray - associative array of keys and filters to test them against, with each pair in the form 'key' => $filter
     * @return {Array} - associative array of associative arrays. Outer array uses keys given by $keyFilterArray to link to inner arrays. Inner arrays have the following keys:
     *      'result' => the filtered result if successful, false otherwise,
     *      'success' => true if successful, false otherwise,
     *      'errMsg' => message that indicates reason for failure if 'success' => false
     */
    function filterGetArray($keyFilterArray) {
        return filterInputArray($_GET, $keyFilterArray);
    }

    /**
     * filterPostArray - filters the given keys inside $_POST against their given filters
     * @param {string[]} $keyFilterArray - associative array of keys and filters to test them against, with each pair in the form 'key' => $filter
     * @return {Array} - associative array of associative arrays. Outer array uses keys given by $keyFilterArray to link to inner arrays. Inner arrays have the following keys:
     *      'result' => the filtered result if successful, false otherwise,
     *      'success' => true if successful, false otherwise,
     *      'errMsg' => message that indicates reason for failure if 'success' => false
     */
    function filterPostArray($keyFilterArray) {
        return filterInputArray($_POST, $keyFilterArray);
    }

?>