
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
 * Highlights the sentences that contain the words
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
                    arrMatchesToLocate = new Array(sentenceWords[match], paragraphObj['sentence'])
                    sentenceMatches.push(arr)
                    sentenceMatchesToLocate.push(arrMatchesToLocate)
                    highlightMatchingSentence(paragraphObj['sentence'])
                }
            }
        }
    }    
    for (let subSection of section['sub-sections']) {
        findMatch(subSection, wordToMatch);
    }
}

/**
 * Finds sentences in the software documentation and takes the user to its location
 * @param {string} sentences - sentences to find in the documentation
 */
function searchMatchingSentences(sentences){
    currLoc = ''
    text = d3.select('.results').node().childNodes
    for(x in sentences){
        for(textnodes of text){
            if(textnodes.tagName == 'H1' || textnodes.tagName == 'H2' || textnodes.tagName == 'H3' || textnodes.tagName == 'H4' || textnodes.tagName == 'H5'){
                if(textnodes.innerHTML == sentences[x]){
                    if(window.location.hash == sentences[x]){
                        textnodes.setAttribute('id', sentences[x+1])
                        window.location.hash = sentences[x+1]
                    }else{
                        textnodes.setAttribute('id', sentences[x])
                        window.location.hash = sentences[x]
                    }
                }
            }
            else{
                for(child of textnodes.childNodes){

                    if(child.innerHTML == sentences[x]){
                        console.log('found mathcing sentence')
                        hashString = window.location.hash //current location in document
                        sentenceWords = sentences[x].split(' ')
                        sentenceWordsLength = sentenceWords.length
                        i=0;

                        for(word of sentenceWords){
                            if(hashString.includes(word)!=-1){
                                i++;
                            }
                        }
                        if(i == sentenceWordsLength){
                            currLoc = sentences[x]
                            console.log('curLoc: ', currLoc)
                        }
                        if(currLoc == sentences[x]){
                            child.setAttribute('id', sentences[parseInt(x)+1])
                            if(sentences.length < (parseInt(x))){
                                console.log('HERE')
                                console.log(sentences[0])
                                window.location.hash = sentences[0]
                            }else{
                                console.log(sentences[parseInt(x)+1])
                                window.location.hash = sentences[parseInt(x)-1]    
                            }
                        }
                        else{
                            child.setAttribute('id', sentences[x])
                            window.location.hash = sentences[x]
                        }
                        break;
                    }
                }
            }
        }
    }
}


/**
 * Searches for matches in the software documentation for each of the result from the Witt database
 * @param {Array} relevantSentences - Contains a list of relevant sentences/words retrieved from the Witt database
 * @param {string} lookingFor - Specifies what the user was looking for, e.g. architecture patterns 
 */
function findWordMatch(relevantSentences, lookingFor){
    
    sentenceMatches = [];
    sentenceMatchesToLocate = [];
    wordMatches = [];
    for(word of relevantSentences){
        for (let section of storedResults){
        findMatch(section, word)
        }
    }
    sentenceMatches = [...new Set(sentenceMatches)];
    sentenceMatchesToLocate = [...new Set(sentenceMatchesToLocate)];
    wordMatches = [...new Set(wordMatches)];

    //show the matched words in the summary div
    summary.append(el('p', lookingFor + ` mentioned in the text:`));
    for(match of wordMatches){
        
        techWord = el('li', match)
        techWord.setAttribute('class', 'techWord')

        summary.append(techWord)

    }
    // //Clicking sentences will take you to the relevant place in the document
    $(document).ready(function() {
        $('.techWord').click(function() {
            sentencesToLocate = []
            for(sentence of sentenceMatchesToLocate){
                if(this.innerHTML == sentence[0]){
                    sentencesToLocate.push(sentence[1])
                }
            }
            searchMatchingSentences(sentencesToLocate)
        })
    })
    return [wordMatches, sentenceMatches]
}
