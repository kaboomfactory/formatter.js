/*
 * pattern.js
 *
 * Utilities to parse str pattern and return info
 *
 */


define(['utils'], function (utils) {


// Define module
    var pattern = {};

// Match information
    var DELIM_SIZE = 4;

// Our regex used to parse
    var regexp = new RegExp('{{([^}]+)}}', 'g');

//
// Helper method to parse pattern str
//
    var getMatches = function (pattern) {
        // Populate array of matches
        var matches = [],
            match;
        while (match = regexp.exec(pattern)) {
            matches.push(match);
        }

        return matches;
    };

//
// Create an object holding all formatted characters
// with corresponding positions
//
    pattern.parse = function (pattern) {
        // Our obj to populate

        var props = {};
        if(typeof pattern === 'object' && !(pattern instanceof String)){
            props = utils.extend(props, pattern);
            pattern = props.format;
        }
        var info = {inpts: {}, chars: {}};

        // Pattern information
        var matches = getMatches(pattern),
            pLength = pattern.length;

        // Counters
        var mCount = 0,
            iCount = 0,
            i = 0;

        // Add inpts, move to end of match, and process
        var processMatch = function (val) {
            var valLength = val.length;
            for (var j = 0; j < valLength; j++) {
                info.inpts[iCount] = val.charAt(j);
                iCount++;
            }
            mCount++;
            i += (val.length + DELIM_SIZE - 1);
        };

        // Process match or add chars
        for (i; i < pLength; i++) {
            if (mCount < matches.length && i === matches[mCount].index) {
                processMatch(matches[mCount][1]);
            } else {
                info.chars[i - (mCount * DELIM_SIZE)] = pattern.charAt(i);
            }
        }

        // Set mLength and return
        info.mLength = i - (mCount * DELIM_SIZE);

        if(props.cloak){
            var parsedCloak = {};
            for (var j = 0; j < props.cloak.length; j++) {
                var cloakChar = props.cloak[j];
                if(cloakChar === '*'){
                    parsedCloak[j] = cloakChar;
                }
            }
            info.cloak = parsedCloak;
        }

        return info;
    };


// Expose
    return pattern;


});