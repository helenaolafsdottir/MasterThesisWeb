const API_URL = 'https://apis.is/isnic?domain=';

const program = (() => {

  let input;
  let results;
  let dropdown;
  let initData = JSON.parse(JSON.stringify(storedResults));

  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function deleteEl(element) {
    element.parentNode.removeChild(element);
  }
  

  function el(name, ...children) {
    const element = document.createElement(name);

    for (let child of children) { /* eslint-disable-line */
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    }

    return element;
  }

  function formatDate(date) {
    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    function zeropad(s) {
      if (s.toString().length === 1) {
        return `0${s}`;
      }

      return s;
    }

    return `${d.getFullYear()}-${zeropad(d.getMonth() + 1)}-${zeropad(d.getDate())}`;
  }

  function showMessage(msg) {
    results.appendChild(el('p', msg));
  }

  //Bolds a specific substring of string
  function boldString(str, find){
    var re = new RegExp(find, 'g');
    return str.replace(re, '<b>'+find+'</b>');
  }
  
  //Italizes a specific substring of string
  function italicString(str, find){
    var re = new RegExp(find, 'g');
    return str.replace(re, '<i>'+find+'</i>');
  }


  function addReqSentenceAndButtonsToPage(sentence, wordClusters) {
    sentenceElement = el('p', sentence);
    sentenceElement.setAttribute("id", "reqSentence")
    summary.appendChild(sentenceElement)

    summary.style.borderBottom = '1px solid black'

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
        createClusterGraphQuestion3(wordClusters)    
        
      });
      wordButtons.appendChild(btn);   
    }
  }

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

    groupButtons.appendChild(el('p', 'Groups shown in the graph:'));
    
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
          createClusterGraph(relevantSentences, feature)
        }
        else if(question == 'Q1'){
          createClusterGraphQuestion1(relevantSentences)
        }
        else if (question == 'Q3' || question == 'Q4' || question == 'Q5'|| question == 'Q6' || question == 'Q7' || question == 'Q8' || question == 'Q9' || question == 'Q10' || question == 'Q11' || question == 'Q12' || question == 'Q13' || question == 'Q14' || question == 'Q17'){
          empty(graph)
          createClusterGraphQuestion3(relevantSentences)
        }
        
      });
      groupButtons.appendChild(btn);   
    }
  }

  function addQuestionHeader(question){
    summaryHeader = document.getElementById('summaryHeader')
    summaryHeader.innerHTML = question;
  }
  
  function addChosenFeature(feature){
    chosenFeature = el('p', 'Chosen feature: ' + feature);
    chosenFeature.setAttribute("id", "reqSentence")
    summary.appendChild(chosenFeature)
    summary.style.borderBottom = '1px solid black'
  }
  
  

  function fetchResults(domain, currentQuestion) {
    //fetch(`${domain}`, {'method': 'POST', 'body': {'currQuestion': currentQuestion}})
    fetch('http://127.0.0.1:5000/query/question', 
      {
        'method': 'POST',
        'headers': {
          'Content-Type': "application/json"
        },
        'body':  JSON.stringify({'currQuestion': currentQuestion})
    })
      .then(data =>{
        data.json().then(stuff => renderResponseToUserQuery(stuff, currentQuestion))
      }) 
      .catch((error) => {
        console.error('Villa við að sækja gögn', error);
        showMessage('Villa við að sækja gögn');
      });
  }

  function renderResponseToUserQuery(relevantSentences, currentQuestion){

    if(currentQuestion == 'question1'){
      //groupResults(relevantSentences)
      addFeatureButtonsToPage(relevantSentences)
      addGroupButtonsToPage(relevantSentences, '', "Q1")
      addQuestionHeader('What functionalities exist in the system?')
      createClusterGraphQuestion1(relevantSentences)
      alterGroupNaming()
    }
    if(currentQuestion == 'feature1'){
      //groupResults(relevantSentences)
      addQuestionHeader('What functionalities does this feature provide?')
      addChosenFeature('Display products')
      addGroupButtonsToPage(relevantSentences, "displayProduct", "Q2")
      createClusterGraph(relevantSentences, "displayProduct")
      alterGroupNaming()
    }
    if(currentQuestion == 'feature2'){
      //groupResults(relevantSentences)
      addQuestionHeader('What functionalities does this feature provide?')
      addChosenFeature('Purchase products')
      addGroupButtonsToPage(relevantSentences, "purchaseProduct", "Q2")
      createClusterGraph(relevantSentences, "purchaseProduct")
      alterGroupNaming()
    }
    if(currentQuestion == 'feature3'){
      //groupResults(relevantSentences)
      addQuestionHeader('What functionalities does this feature provide?')
      addChosenFeature('User management')
      addGroupButtonsToPage(relevantSentences, "userManagement", "Q2")
      createClusterGraph(relevantSentences, "userManagement")
      alterGroupNaming()
    }
    if(currentQuestion.includes('question3')){
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question3', '')
        addGroupButtonsToPage(relevantSentences, '', "Q3")
        addQuestionHeader('Find everything related to this functional requirement.')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
        alterGroupNaming()
      }        
    }
    if(currentQuestion.includes('question4')){
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question4', '')
        addGroupButtonsToPage(relevantSentences, '', "Q4")
        addQuestionHeader('How is this functionality implemented?')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
        alterGroupNaming()
      }        
    }
  
    if(currentQuestion.includes('question5')){   
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question5', '')
        addGroupButtonsToPage(relevantSentences, '', "Q5")
        addQuestionHeader('What is the behaviour of this functionality?')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
        alterGroupNaming()
      }        
    }
    if(currentQuestion.includes('question6')){   
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question6', '')
        addGroupButtonsToPage(relevantSentences, '', "Q6")
        addQuestionHeader('What is the structure of this functionality?')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
        alterGroupNaming()
      }        
    }
    if(currentQuestion.includes('question7')){   
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question7', '')
        addGroupButtonsToPage(relevantSentences, '', "Q7")
        addQuestionHeader('What is the UI design of this functionality?')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
        alterGroupNaming()
      }        
    }
    if(currentQuestion.includes('question8')){   
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question8', '')
        addGroupButtonsToPage(relevantSentences, '', "Q8")
        addQuestionHeader('What was the development process related to this functionality?')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
        alterGroupNaming()
      }        
    }
    if(currentQuestion.includes('question9')){   
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question9', '')
        addGroupButtonsToPage(relevantSentences, '', "Q9")
        addQuestionHeader('Find everything related to this non-functional requirement.')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
        alterGroupNaming()
      }        
    }
    if(currentQuestion.includes('question10')){   
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question10', '')
        addGroupButtonsToPage(relevantSentences, '', "Q10")
        addQuestionHeader('How is this non-functional requirement implemented?')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
        alterGroupNaming()
      }        
    }
    if(currentQuestion.includes('question11')){   
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question11', '')
        addGroupButtonsToPage(relevantSentences, '', "Q11")
        addQuestionHeader('What is the behaviour of this non-functional requirement?')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
        alterGroupNaming()
      }        
    }
    if(currentQuestion.includes('question12')){   
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question12', '')
        addGroupButtonsToPage(relevantSentences, '', "Q12")
        addQuestionHeader('What is the structure of this non-functional requirement?')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
      }        
    }
    if(currentQuestion.includes('question13')){   
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question13', '')
        addGroupButtonsToPage(relevantSentences, '', "Q13")
        addQuestionHeader('What is the UI design of this non-functional requirement?')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
        alterGroupNaming()
      }        
    }
    if(currentQuestion.includes('question14')){   
      if(relevantSentences == 'There are no results for this requirement.'){
        var message = document.createElement("p");
        message.innerHTML = relevantSentences;
        message.setAttribute("class", "noRequirementMessage");       
        summary.appendChild(message);   
      }
      else{
        currUserStory = currentQuestion.replace('question14', '')
        addGroupButtonsToPage(relevantSentences, '', "Q14")
        addQuestionHeader('What was the development process related to this non-functional requirement?')
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
        alterGroupNaming()
      }        
    }
    if(currentQuestion == 'question15'){
      addQuestionHeader('What architecture patterns are used in the system?')
      findWordMatch(relevantSentences, 'Architecture patterns')
    }
    if(currentQuestion == 'question16'){
      addQuestionHeader('What programming languages are used in the system?')
      findWordMatch(relevantSentences, 'Programming languages')
    }
    if(currentQuestion == 'question17'){ 
      printWords(relevantSentences, 'Architecture patterns')
      addGroupButtonsToPage(relevantSentences, '', "Q17")
      addQuestionHeader('How are the architecture patterns in the system implemented?')
      addReqSentenceAndButtonsToPage('',relevantSentences)
      createClusterGraphQuestion3(relevantSentences)    
      alterGroupNaming()
    }
}

  function printWords(relevantSentences, lookingFor){
    summary.append(el('p', lookingFor + ` mentioned in the text:`));
    for(clusters of relevantSentences){
        summary.append(el('li', clusters['word']))
    }
  }

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
    
    //highlight sentences that contain matched words?
    return [wordMatches, sentenceMatches]
  }

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
 
  function groupResults(relevantSentences){
    features=0;
    usecases=0;
    funcreqs=0;

    for(let sentence of relevantSentences){
      if(sentence['type'].includes('Feature')){
        features++;
      }
      if(sentence['type'].includes('UseCase')){
        usecases++;
      }
      if(sentence['type'].includes('FunctionalRequirementAndBehaviour')){
        funcreqs++;
      }
    }
    if(features>0){
      summary1 = el('p', `The system identified ${features} sentences related to features`);
      summary.appendChild(summary1)
    }
    if(usecases>0){
      summary2 = el('p', `The system identified ${usecases} sentences related to use cases`);
      summary.appendChild(summary2)
    }
    if(funcreqs>0){
      summary3 = el('p', `The system identified ${funcreqs} sentences related to functional requirements`);
      summary.appendChild(summary3)
    }

  }

  // function renderHighlightedData(relevantSentences){
  //   for(let sentenceToHighlight of relevantSentences){
  //     for (let section of storedResults) {
  //       highlightData(section, sentenceToHighlight['sentence'].toLowerCase());
  //     }
  //   }
    
  //   renderFullJsonData(storedResults)
  // }
  // function highlightData(section, sentenceToHighlight){
  
  //   //checking headers
  //   if(section[Object.keys(section)[0]]['sentence']){
  //     header = section[Object.keys(section)[0]]['sentence'].toLowerCase()
  //     if(sentenceToHighlight == header){
  //       section[Object.keys(section)[0]]['Highlighted']='True'
  //       //console.log('MATCH!!!!!!!!!!!!!!!!!!!!!!!!!!')
  //     }
  //   }
    
  //   for (let paragraphs of section['paragraphs']) {
  //     if(paragraphs.length>0){
  //       for (let paragraphObj of paragraphs) {
  //         paragraph = paragraphObj['sentence'].toLowerCase();
  //         if(sentenceToHighlight == paragraph){
  //           paragraphObj['Highlighted']='True'
  //           //console.log('MATCH!!!!!!!!!!!!!!!!!!!!!!!!!!')
  //         }
  //       } 
  //     }
  //   }    
  //   for (let subSection of section['sub-sections']) {
  //     highlightData(subSection, sentenceToHighlight);
  //   }
  // }


  
  function renderFullJsonData(data) {
    empty(results);
    for (let section of data) {
      renderSection(section);
    }
  }

  //Currently not using this function!
  function onChangeQuestion(){
    empty(summary)
    summary.style.borderBottom = ''
    svg = d3.getElementById("svg")
    storedResults = JSON.parse(JSON.stringify(initData));
    var selectObj = document.getElementById('front-search-question')
    var currentSelection = selectObj.options[selectObj.selectedIndex].value
    fetchResults('http://127.0.0.1:5000/query/question', currentSelection);
  }

  function renderSection(section) {
    if(section['included']==='yes'){
      header = el(Object.keys(section)[0], section[Object.keys(section)[0]]['sentence'])
      if(section[Object.keys(section)[0]]['Highlighted'] === 'True') {
        header.classList.add('highlighted');
      }
    
      header.classList.add(Object.keys(section)[0]);
      results.appendChild(header);
    
      for (let paragraphs of section['paragraphs']) {
        let div = el('div')
        div.classList.add('paragraph')
        //div.classList.add(Object.keys(section)[0]);
        for (let paragraphObj of paragraphs) {
          if(paragraphObj['sentence'].startsWith('ImageToDisplay')){
            imagePath = paragraphObj['sentence'].replace('ImageToDisplay','..\\')
            imgDiv = el('img')
            imgDiv.setAttribute('src', imagePath)
            imgDiv.setAttribute('class', 'imgDiv')
            div.append(imgDiv)
          }
          else{
            sentence = el('p', paragraphObj['sentence']);
            if (paragraphObj['Highlighted'] === 'True') {
              sentence.classList.add('highlighted');
            }
            div.appendChild(sentence);
            div.appendChild(el('p', ' ')) //Adding space between sentences
          }
        }
        results.appendChild(div);
      }
    }
    
    for (let subSection of section['sub-sections']) {
      renderSection(subSection);
    }
  }

  function showSelector(selector, question) {
    var featureOpt = document.getElementById(selector);
    featureOpt.setAttribute('class', question)
    //featureOpt.style.visibility = "visible";
    featureOpt.style = '';
  }
  function hideSelector(selector) {
    var featureOpt = document.getElementById(selector);
    //featureOpt.style.visibility = "hidden";
    featureOpt.style =" display:none";
  }

  function init(domains) {
    results = domains.querySelector('.results');
    summary = domains.querySelector('.summary');
    wordButtons = document.querySelector('#wordButtons');
    groupButtons = document.querySelector('#groupButtons');
    graph = domains.querySelector	("#interactive_diagram_svg")
    jQuery("#question1").click(function(e){
      // TODO: create a function for the next four lines - they reset everything.
      unhighlightAllSentences()
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      empty(summary)
      empty(wordButtons)
      empty(groupButtons)
      empty(graph)
      summary.style.borderBottom = ''
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'question1');

      e.preventDefault();
    });

    jQuery("#question2").click(function(e){
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      showSelector("featureSelector", "question2")
      e.preventDefault();
    });
    jQuery("#feature1").click(function(e){
      unhighlightAllSentences()
      hideSelector("featureSelector")
      empty(summary)
      empty(wordButtons)
      empty(groupButtons)
      empty(graph)
      summary.style.borderBottom = ''
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'feature1');
      e.preventDefault();
    });
    jQuery("#feature2").click(function(e){
      unhighlightAllSentences()
      hideSelector("featureSelector")
      empty(summary)
      empty(wordButtons)
      empty(groupButtons)
      empty(graph)
      summary.style.borderBottom = ''
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'feature2');
      e.preventDefault();
    });
    jQuery("#feature3").click(function(e){
      unhighlightAllSentences()
      hideSelector("featureSelector")
      empty(summary)
      empty(wordButtons)
      empty(groupButtons)
      empty(graph)
      summary.style.borderBottom = ''
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'feature3');
      e.preventDefault();
    });

    jQuery("#question3").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStoryNonFuncSelector")
      showSelector("userStorySelector", "question3")
    });
    jQuery(".req").click(function(e){
      unhighlightAllSentences()
      question = this.parentNode.parentNode.parentNode.className.replace(' open', '')
      requirement = this.textContent
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      empty(summary)
      empty(wordButtons)
      empty(groupButtons)
      empty(graph)
      summary.style.borderBottom = ''
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', question + requirement);
      e.preventDefault();
    });
    jQuery("#question4").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStoryNonFuncSelector")
      showSelector("userStorySelector", "question4")
    });
    jQuery("#question5").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStoryNonFuncSelector")
      showSelector("userStorySelector", "question5")
    });
    jQuery("#question6").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStoryNonFuncSelector")
      showSelector("userStorySelector", "question6")
    });
    jQuery("#question7").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStoryNonFuncSelector")
      showSelector("userStorySelector", "question7")
    });
    jQuery("#question8").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStoryNonFuncSelector")
      showSelector("userStorySelector", "question8")
    });
    jQuery("#question9").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      showSelector("userStoryNonFuncSelector", "question9")
    });
    jQuery("#question10").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      showSelector("userStoryNonFuncSelector", "question10")
    });
    jQuery("#question11").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      showSelector("userStoryNonFuncSelector", "question11")
    });
    jQuery("#question12").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      showSelector("userStoryNonFuncSelector", "question12")
    });
    jQuery("#question13").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      showSelector("userStoryNonFuncSelector", "question13")
    });
    jQuery("#question14").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      showSelector("userStoryNonFuncSelector", "question14")
    });
    jQuery("#question15").click(function(e){
      unhighlightAllSentences()
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      empty(summary)
      empty(wordButtons)
      empty(groupButtons)
      empty(graph)
      summary.style.borderBottom = ''
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'question15');      
    });
    jQuery("#question16").click(function(e){
      unhighlightAllSentences()
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      empty(summary)
      empty(wordButtons)
      empty(groupButtons)
      empty(graph)
      summary.style.borderBottom = ''
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'question16');
    });
    jQuery("#question17").click(function(e){
      unhighlightAllSentences()
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      empty(summary)
      empty(wordButtons)
      empty(groupButtons)
      empty(graph)
      summary.style.borderBottom = ''
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'question17');
    });
    renderFullJsonData(storedResults);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');

  program.init(domains);
});
