
/**
 * Scales the d3 graph to fit with the size of the parent HTML element
 */
function scaleDiagram(){
    var self = this
    var svgBCR = d3.select('#interactive_diagram_svg').select('svg').node().getBoundingClientRect()

    svgBCR.width = svgBCR.width * 0.63
    
    var gBBox = d3.select('#interactive_diagram_svg').select('.output').node().getBBox()
    
    var widthScale = svgBCR.width / gBBox.width
    var heightScale = svgBCR.height / gBBox.height
    
    var abswidth = gBBox.width * widthScale - svgBCR.width
    var absheight = gBBox.height * widthScale - svgBCR.height

    if(absheight < abswidth){
        var heightDiff = svgBCR.height / widthScale - gBBox.height
        d3.select('#interactive_diagram_svg').select('.output')
        .style('transform','scale(' + widthScale + ') translate(' + 0 + 'px, '+ (heightDiff/2) +'px)')
    }else{
        var widthDiff = svgBCR.width / heightScale - gBBox.width
        d3.select('#interactive_diagram_svg').select('.output')
        .style('transform','scale(' + heightScale + ') translate(' + widthDiff/2 + 'px, '+ 0 +'px)')
    }
}

/**
 * Adds line breaks to long sentences
 * @param {string} sentence - sentence to wrap
 */
function sentenceWrap(sentence){
    wrappedSentence = ''
    sentenceSplitted = sentence.split(' ')
    sentenceWordCount = sentenceSplitted.length
    if(sentenceWordCount>20){
        firstPart = sentenceSplitted.slice(0,20)
        secondPart = sentenceSplitted.slice(20, sentenceWordCount)
        wrappedSentence = firstPart.join(' ')
        wrappedSentence += ' \n'

        if(secondPart.length>20){
            secPart = secondPart.slice(0,20)
            thirdPart = secondPart.slice(20, secPart.length)            
            wrappedSentence += secPart.join(' ')
            wrappedSentence += ' \n'
            wrappedSentence += thirdPart.join(' ')
        }
        else{
            wrappedSentence += secondPart.join(' ')
        }
    }
    else{
        wrappedSentence = sentence
    }
    return wrappedSentence
    
}

/**
 * Finds sentence in the software documentation and takes the user to its location
 * @param {string} sentence - sentence to find
 */
function searchMatchingSentence(sentence){
    text = d3.select('.results').node().childNodes
    for(textnodes of text){
        if(textnodes.tagName == 'H1' || textnodes.tagName == 'H2' || textnodes.tagName == 'H3' || textnodes.tagName == 'H4' || textnodes.tagName == 'H5'){
            if(textnodes.innerHTML == sentence){
                textnodes.setAttribute('id', sentence)
                window.location.hash = sentence;
            }
        }
        else{
            for(child of textnodes.childNodes){
                if(child.innerHTML == sentence){
                    child.setAttribute('id', sentence)
                    window.location.hash = sentence;
                }
            }
        }
    }
}

/**
 * Unhighlights all sentences in the software documentation
 */
function unhighlightAllSentences(){
    text = d3.select('.results').node().childNodes
    for(textnodes of text){
        if(textnodes.tagName == 'H1' || textnodes.tagName == 'H2' || textnodes.tagName == 'H3' || textnodes.tagName == 'H4' || textnodes.tagName == 'H5'){
            if(textnodes.getAttribute("class") == 'highlighted'){
                jQuery(textnodes).removeClass('highlighted')
            }
        }
        else{
            for(child of textnodes.childNodes){
                if(child.getAttribute("class") == 'highlighted'){
                    jQuery(child).removeClass('highlighted')
                }
            }
        }
    }
}

/**
 * Highlights the sentences relevant to the user query (question)
 * @param {string} sentence - sentence to be highlighted
 */
function highlightMatchingSentence(sentence){
    text = d3.select('.results').node().childNodes
    for(textnodes of text){
        if(textnodes.tagName == 'H1' || textnodes.tagName == 'H2' || textnodes.tagName == 'H3' || textnodes.tagName == 'H4' || textnodes.tagName == 'H5'){
            if(textnodes.innerHTML == sentence){
                textnodes.setAttribute('class', 'highlighted');
            }
        }
        else{
            for(child of textnodes.childNodes){
                if(child.innerHTML == sentence){
                    child.setAttribute('class', 'highlighted');
                }
            }
        }
    }
}