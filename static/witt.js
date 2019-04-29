
/**
 * Adds the results from the Witt database to the summary box
 * @param {Array} resultsFound - The results found in the Witt database
 * @param {string} lookingFor - Specifies what the user was looking for, e.g. architecture patterns
 */
function printWords(resultsFound, lookingFor){
    summary.append(el('p', lookingFor + ` mentioned in the text:`));
    for(clusters of resultsFound){
        summary.append(el('li', clusters['word']))
    }
}


/**
 * Finds matches between the wordToMatch and the section of the software documentation
 * @param {Array} section - A section from the software documentation
 * @param {string} wordToMatch - A word from the Witt database to be matched with 
 */
function findMatch(section, wordToMatch){
    if(section['included']==='yes'){
        header = section[Object.keys(section)[0]]['sentence'].toLowerCase()
        headerWords = header.split(' ')
        match = headerWords.indexOf(wordToMatch.toLowerCase())
            if(match != -1){
            wordMatches.push(headerWords[match])
            arr = new Array(headerWords[match], header)
            sentenceMatches.push(arr)            
            }

        for (let paragraphs of section['paragraphs']) {
        for (let paragraphObj of paragraphs) {
            sentence = paragraphObj['sentence'].toLowerCase()
            sentenceWords = sentence.split(' ');
            
            match = sentenceWords.indexOf(wordToMatch.toLowerCase())
            if(match != -1){
            wordMatches.push(sentenceWords[match])
            arr = new Array(sentenceWords[match], sentence)
            sentenceMatches.push(arr)
            }
        }
        }
    }    
    for (let subSection of section['sub-sections']) {
        findMatch(subSection, wordToMatch);
    }
}
  

/**
 * Searches for matches in the software documentation for each of the result from the Witt database
 * @param {Array} relevantSentences - Contains a list of relevant sentences/words retrieved from the Witt database
 * @param {string} lookingFor - Specifies what the user was looking for, e.g. architecture patterns 
 */
function findWordMatch(relevantSentences, lookingFor){

    sentenceMatches = [];
    wordMatches = [];
    for(word of relevantSentences){
        for (let section of storedResults){
        findMatch(section, word)
        }
    }
    sentenceMatches = [...new Set(sentenceMatches)];
    wordMatches = [...new Set(wordMatches)];

    //show the matched words in the summary div
    summary.append(el('p', lookingFor + ` mentioned in the text:`));
    for(match of wordMatches){
        summary.append(el('li', match))
    }

    return [wordMatches, sentenceMatches]
}
