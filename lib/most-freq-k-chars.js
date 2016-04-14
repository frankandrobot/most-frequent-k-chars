var _ = require('underscore');


/**
 * Create a hashmap containing the frequencies (count) of each character
 *
 * @param str
 * @returns {{}}
 */
function countCharOccurrence(str) {

    var countHashMap = {};

    for (var i = 0; i < str.length; ++i) {

        var stri = str[i],

            index = countHashMap[stri] ? countHashMap[stri].index : i,

            prevCount = countHashMap[stri] ? countHashMap[stri].count : 0;

        countHashMap[stri] = {
            letter: stri,
            index: index,
            count: prevCount + 1
        };
    }

    return countHashMap;
}

/**
 * Group by frequency (count), then sort by frequency, then sort by first occurrance
 *
 * @param countHashMap
 * @returns {*}
 */
function sort(countHashMap) {

    var sorted;

    //group by frequency (count)
    sorted = _.groupBy(countHashMap, function(obj) { return obj.count; });
    //then sort by frequency
    sorted = _.sortBy(sorted, function(obj, key) { return -key; });
    //then sort by first occurrance in word
    sorted = _.each(sorted, function(obj) {_.sortBy(obj, function(letter) { letter.index; })});

    return sorted;
}


function maxFreqKHashing(str, K) {

    var outputString = "",

        countHashMap = countCharOccurrence(str),

        sorted = sort(countHashMap);


    //output
    var len = 0;

    for(var i=0; i<sorted.length; ++i) {
        for(var j=0; j<sorted[i].length; ++j) {

            outputString += sorted[i][j].letter + sorted[i][j].count;

            if (len++ == K-1) break;
        }
        if (len == K) break;
    }

    while (outputString.length != 2*K) {

        outputString += " 0"; //case when word is shorter than K
    }

    return outputString;
}


function toInt(str) {

    return parseInt(str, 10);
}


/**
 * If #mostFreq2Similarity === 0, then the two words have no common chars
 * If #mostFreq2Similarity > 0, then common characters exist
 *
 * @param str1
 * @param str2
 * @param maxWordLength
 * @returns {number}
 */
function mostFreq2Similarity(str1, str2) {

    var x1 = maxFreqKHashing(str1, 2),
        x2 = maxFreqKHashing(str2, 2),

        similarity = 0;

    if (x1[0] === x2[0]) similarity = similarity + x1[1]+x2[1];
    if (x1[0] === x2[2]) similarity = similarity + x1[1]+x2[3];
    if (x1[2] === x2[0]) similarity = similarity + x1[3]+x2[1];
    if (x1[2] === x2[2]) similarity = similarity + x1[3]+x2[3];

    return similarity;
}


/**
 * Same as #mostFreq2Similarity.
 *
 * @param str1
 * @param str2
 * @param maxWordLength
 * @returns {number}
 */
function mostFreq3Similarity(str1, str2) {

    var x1 = maxFreqKHashing(str1, 3),
        x2 = maxFreqKHashing(str2, 3),

        similarity = 0;

    if (x1[0] === x2[0]) similarity = similarity + x1[1]+x2[1];
    if (x1[0] === x2[2]) similarity = similarity + x1[1]+x2[3];
    if (x1[0] === x2[4]) similarity = similarity + x1[1]+x2[5];

    if (x1[2] === x2[0]) similarity = similarity + x1[3]+x2[1];
    if (x1[2] === x2[2]) similarity = similarity + x1[3]+x2[3];
    if (x1[2] === x2[4]) similarity = similarity + x1[3]+x2[5];

    if (x1[4] === x2[0]) similarity = similarity + x1[5]+x2[1];
    if (x1[4] === x2[2]) similarity = similarity + x1[5]+x2[3];
    if (x1[4] === x2[4]) similarity = similarity + x1[5]+x2[5];

    return similarity;
}


/**
 * General case
 *
 * @param str1
 * @param str2
 * @param maxWordLength
 * @returns {number}
 */
function mostFreqKSimilarity(str1, str2, k) {

    var x1 = maxFreqKHashing(str1, k),
        x2 = maxFreqKHashing(str2, k),

        similarity = 0;


    for(var i=0; i<k; ++i) {

        var x1index = 2 * i,
            x1indexPlus1 = x1index + 1,
            x1value = toInt(x1[x1indexPlus1]);

        for(var j=0; j<k; ++j) {

            var x2index = 2*j;

            if (x1[x1index] === x2[x2index]) { //if a letter occurs in both words

                similarity += x1value + toInt(x2[x2index + 1]);
            }
        }
    }

    return similarity;
}


exports.maxFreqKHashing = maxFreqKHashing;
exports.mostFreq2Similarity = mostFreq2Similarity;
exports.mostFreq3Similarity = mostFreq3Similarity;
exports.mostFreqKSimilarity = mostFreqKSimilarity;

exports.mostFreqKPseudoMetric = function(str1,str2,k) {

    var max = 2*Math.max(str1.length, str2.length);

    return max - mostFreqKSimilarity(str1,str2,k);
};
