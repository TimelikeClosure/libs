<?php
    /**
     * prepared.php - contains functions and methods for interfacing with a MySQL database through mysqli prepared statements
     */


    /**
     * prepareStatement - opens a prepared statement for the given MySQL query.
     * @param {Object} $connection - a mysqli connection object.
     * @param {string} $queryString - a MySQL query string with placeholders for missing parameters.
     * @return {Object} - a mysqli statement object.
     */
    function prepareStatement($connection, $queryString) {
        $statement = $connection->prepare($queryString);
        if (!$statement) {
            $output['success'] = false;
            $output['error_no'] = $connection->errno;
            $output['error_msg'] = $connection->error;
            return $output;
        } else {
            return $statement;
        }
    }

    /**
     * executeStatement - Binds and executes a prepared statement of the given MySQL query. Returns results from that query or an error message. Requires PHP 5.6 or later.
     * @param {Object} $connection - mysqli connection object.
     * @param {Object} $statement - mysqli statement object.
     * @param {Array}$inputParameters - array of input variables to bind to prepared statement. The first index must contain a string with a letter for each following variable, indicating it's expected data type ('i' for integer, 'd' for double, 's' for string, and 'b' for blob).
     * @param {string[]}$outputKeys - array of strings, indicating which key names to bind output data to.
     * @return {Array} - associative array containing a success indicator and either bound response data or error data. Contains the following keys:
     *     'success' - indicates true if the query was successful, or false if it was unsuccessful.
     *     'data' - contains all results from the query, if the query was successful.
     *     'error_no' - contains the mysqli error number or null, if the query was unsuccessful.
     *     'error_msg' - contains the mysqli or custom error message, if the query was unsuccessful.
     */
    function executeStatement($connection, $statement, $inputParameters, $outputKeys) {
        /** Binds input parameters to the prepared statement, if provided. */
        if (!empty($inputParameters)) {
            $status = $statement->bind_param(...$inputParameters);
            $output['progress'][] = "Input parameters bound";
            if (!$status) {
                $output['success'] = false;
                $output['error_no'] = $connection->errno;
                $output['error_msg'] = $connection->error;
                return $output;
            }
        }
        /** Sends the input parameters to the server to be inserted into the previously sent statement. */
        if (!$statement->execute()) {
            $output['progress'][] = "Statement executed";
            $output['success'] = false;
            $output['error_no'] = $connection->errno;
            $output['error_msg'] = $connection->error;
            return $output;
        }
        $output['progress'][] = "Statement executed";
        /**
         * Creates variables with names given by the strings in $outputKeys. For example:
         * if $outputKeys == ["keyName1", "keyName2", "keyName3"],
         * then $outputParameters == [$keyName1, $keyName2, $keyName3].
         */
        foreach($outputKeys as $keyString) {
            $outputParameters[] = $$keyString;
        }
        /** Binds output columns to the resulting output parameters. */
        $statement->bind_result(...$outputParameters);
        $output['progress'][] = "Output parameters bound";
        if (!$outputParameters) {
            $output['success'] = false;
            $output['error_no'] = $connection->errno;
            $output['error_msg'] = $connection->error;
            return $output;
        }
        /**
         * Fetches all rows and stores them for output. For example:
         * if $outputKeys == ["keyName1", "keyName2", "keyName3"]
         * and the resulting query has row values ["value1", "value2", "value3"] in row 0,
         * then $output['data'][0] == ["keyName1" => "value1", "keyName2" => "value2", "keyName3" => "value3"]
         */
        while($statement->fetch()) {
            $output['progress'][] = "Row fetched";
            $output['success'] = true;
            foreach($outputKeys as $index => $key) {
                $row[$key] = $outputParameters[$index];
            }
            $output['data'][] = $row;
        }
        if (!empty($statement->insert_id)) {
            $output['progress'][] = "Insert id obtained";
            $output['success'] = true;
            $output['insert_id'] = $statement->insert_id;
        } else if ($output['success'] == null) {
            $output['success'] = false;
            $output['error_no'] = null;
            $output['error_msg'] = 'Empty data set';
        }

        return $output;
    }

    /**
     * closeStatement - closes the given mysqli statement.
     * @param {Object} $statement - a mysqli statement object.
     */
    function closeStatement($statement) {
        $statement->close();
    }

?>