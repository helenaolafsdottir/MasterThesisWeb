/**
 * Bolds a specific substring of string
 * @param {string} str - the string containing the substring "substringToBold"
 * @param {string} substringToBold - the substring to be bolded
 */
function boldString(str, substringToBold){
    var re = new RegExp(substringToBold, 'g');
    return str.replace(re, '<b>'+substringToBold+'</b>');
}


/**
 * Adds the chosen user story and the buttons for the words from the taskphrase to the summary box.
 * @param {string} sentence - the user story chosen by the user
 * @param {Array} wordClusters - the contains the words from the taskphrases and their clusters
 */
function addReqSentenceAndButtonsToPage(sentence, wordClusters) {
    sentenceElement = el('p', sentence);
    sentenceElement.setAttribute("id", "reqSentence")
    summary.appendChild(sentenceElement)

    summary.style.borderBottom = '1px solid lightgray'

    wordButtons.appendChild(el('p', 'Words used to connect:'));
    for(let wordCluster of wordClusters) {
        //Bold the Treude words of the sentence
        var reqSentence = document.getElementById("reqSentence").innerHTML;
        word = wordCluster['word']
        var result = boldString(reqSentence, word);
        document.getElementById("reqSentence").innerHTML = result;

        //Add button for each word
        var btn = document.createElement("BUTTON");
        btn.innerHTML = word;
        btn.setAttribute("type", "button")
        btn.setAttribute("chosen", "True")
        btn.setAttribute("class", "buttonForGraph btn")
        btn.setAttribute("id", word)
        btn.addEventListener("click", function(){
        if(this.getAttribute("chosen") == "True"){
            this.setAttribute("chosen", "False")
        }
        else {
            this.setAttribute("chosen", "True")
        }
        svg = document.querySelector("svg");
        if(svg){deleteEl(svg)}
        empty(graph)
        createClusterGraphTreudeQuestions(wordClusters)    
        
        });
        wordButtons.appendChild(btn);   
    }
}


/**
 * Adds the feature buttons to the summary box. 
 * Only used for question 1: "What functionalities exist in the system?"
 * @param {Array} relevantSentences - List of sentences that are relevant to answer the user's question
 */
function addFeatureButtonsToPage (relevantSentences){
    features = ["Display product", "Purchase product", "User management"]

    wordButtons.appendChild(el('p', 'The features of the system:'));
    for(let feature of features){
        //Add button for each feature
        var btn = document.createElement("BUTTON");
        btn.innerHTML = feature;
        btn.setAttribute("type", "button")
        btn.setAttribute("chosen", "True")
        btn.setAttribute("class", "buttonForGraph btn")
        btn.setAttribute("id", feature)
        btn.addEventListener("click", function(){
        if(this.getAttribute("chosen") == "True"){
            this.setAttribute("chosen", "False")
        }
        else {
            this.setAttribute("chosen", "True")
        }
        svg = document.querySelector("svg");
        if(svg){deleteEl(svg)}
        createClusterGraphQuestion1(relevantSentences)
        
        });
        wordButtons.appendChild(btn);  
    }
}


/**
 * Makes the category button labels clearer
 */
function alterGroupNaming(){
    buttons = document.getElementsByClassName('groupButtonForGraph')
    for(button of buttons){
        button.innerHTML
        if(button.innerHTML == 'FunctionalRequirementAndBehaviour'){
        button.innerHTML = 'Functional requirement & behaviour'
        }
        else if(button.innerHTML == 'UseCase'){
        button.innerHTML = 'Use case'
        }
        else if(button.innerHTML == 'UserStory'){
        button.innerHTML = 'User story'
        }
        else if(button.innerHTML == 'NonFunctionalRequirementAndBehaviour'){
        button.innerHTML = 'Non-functional requirement & behaviour'
        }
        else if(button.innerHTML == 'RequirementGeneral'){
        button.innerHTML = 'Requirements - general'
        }
        else if(button.innerHTML == 'Document_Organisation'){
        button.innerHTML = 'Document organisation'
        }
        else if(button.innerHTML == 'DevelopmentPractice'){
        button.innerHTML = 'Development practice'
        }
        else if(button.innerHTML == 'U-Architecture'){
        button.innerHTML = 'UI design - architecture'
        }
        else if(button.innerHTML == 'U-Implementation'){
        button.innerHTML = 'UI design - implementation'
        }
        else if(button.innerHTML == 'S-Architecture'){
        button.innerHTML = 'Structure - architecture'
        }
        else if(button.innerHTML == 'S-TechnologySolution'){
        button.innerHTML = 'Structure - technology solution'
        }
        else if(button.innerHTML == 'S-SourceCode'){
        button.innerHTML = 'Structure - source code'
        }
        else if(button.innerHTML == 'B-Architecture'){
        button.innerHTML = 'Behaviour - architecture'
        }
        else if(button.innerHTML == 'B-TechnologySolution'){
        button.innerHTML = 'Behaviour - technology solution'
        }
        else if(button.innerHTML == 'B-General'){
        button.innerHTML = 'Behaviour - general'
        }
        else if(button.innerHTML == 'D-Architecture'){
        button.innerHTML = 'Data - architecture'
        }
        else if(button.innerHTML == 'D-Implementation'){
        button.innerHTML = 'Data - implementation'
        }
    }
}


/**
 * Adds a button to the summary box for each unique sentence category in the relevantSentences list
 * @param {Array} relevantSentences - List of sentences that are relevant to answer the user's question
 * @param {string} feature - The feature chosen by the user
 * @param {string} question - The question chosen by the user
 */
function addGroupButtonsToPage(relevantSentences, feature, question){

    if(question == 'Q3' || question == 'Q4' || question == 'Q5' || question == 'Q6' || question == 'Q7' || question == 'Q8' || question == 'Q9' || question == 'Q10' || question == 'Q11' || question == 'Q12' || question == 'Q13' || question == 'Q14' || question == 'Q17' ){

        groups = []
        for(cluster of relevantSentences){
            for(sentence of cluster['cluster']){
                groups.push(sentence['type'].replace(baseURI,''))
            }
        }
        groups = [...new Set(groups)];
    }
    else {
        groups = ["FunctionalRequirementAndBehaviour", "UseCase"]
    }

    groupButtons.appendChild(el('p', 'Categories shown in the graph:'));

    for(let group of groups){
        var btn = document.createElement("BUTTON");
        btn.innerHTML = group;
        btn.setAttribute("type", "button")
        btn.setAttribute("chosen", "True")
        btn.setAttribute("class", "groupButtonForGraph btn")
        btn.setAttribute("id", group)
        btn.addEventListener("click", function(){
            if(this.getAttribute("chosen") == "True"){
                this.setAttribute("chosen", "False")
            }
            else {
                this.setAttribute("chosen", "True")
            }
            svg = document.querySelector("svg");
            if(svg){deleteEl(svg)}
            if(question == 'Q2'){
                createClusterGraphQuestion2(relevantSentences, feature)
            }
            else if(question == 'Q1'){
                createClusterGraphQuestion1(relevantSentences)
            }
            else if (question == 'Q3' || question == 'Q4' || question == 'Q5'|| question == 'Q6' || question == 'Q7' || question == 'Q8' || question == 'Q9' || question == 'Q10' || question == 'Q11' || question == 'Q12' || question == 'Q13' || question == 'Q14' || question == 'Q17'){
                empty(graph)
                createClusterGraphTreudeQuestions(relevantSentences)
            }
        });
        groupButtons.appendChild(btn);   
    }   
}


/**
 * Adds the question chosen by the user to the header of the summary box
 * @param {string} question - The question chosen by the user
 */
function addQuestionHeader(question){
    summaryHeader = document.getElementById('summaryHeader')
    summaryHeader.innerHTML = question;
}


/**
 * Adds the feature chosen by the user to the summary box
 * Only used in question 2: What functionalities exist in the system
 * @param {string} feature - The feature chosen by the user
 */
function addChosenFeature(feature){
    chosenFeature = el('p', 'Chosen feature: ' + feature);
    chosenFeature.setAttribute("id", "reqSentence")
    summary.appendChild(chosenFeature)
    summary.style.borderBottom = '1px solid lightgray'
}


/** 
 * Clears the results from previously asked questions
 * @param {HTML DOM Element Object} domains - HTML element containing the documentation and result sections of the web page
*/
function clearUIElements(domains){
    unhighlightAllSentences()
    empty(summary)
    empty(wordButtons)
    empty(groupButtons)
    empty(graph)
    summary.style.borderBottom = ''     
    svg = domains.querySelector('svg');
    if(svg){deleteEl(svg)}
  }