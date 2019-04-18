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

    wordButtons.appendChild(el('p', 'The following are the words used to connect:'));
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
          console.log("new chosen value: False")
        }
        else {
          this.setAttribute("chosen", "True")
          console.log("new chosen value: True")
        }
        svg = document.querySelector("svg");
        if(svg){deleteEl(svg)}
        empty(message)
        createClusterGraphQuestion3(wordClusters)    
        
      });
      wordButtons.appendChild(btn);   
    }
  }

  function addFeatureButtonsToPage (relevantSentences){
    features = ["Display product", "Purchase product", "User management"]

    wordButtons.appendChild(el('p', 'The following are the features of the system:'));
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
          console.log("new chosen value: False")
        }
        else {
          this.setAttribute("chosen", "True")
          console.log("new chosen value: True")
        }
        svg = document.querySelector("svg");
        if(svg){deleteEl(svg)}
        createClusterGraphQuestion1(relevantSentences)
        
      });
      wordButtons.appendChild(btn);   
    }
  }
  function addGroupButtonsToPage(relevantSentences, feature, question){
    
    if(question == 'Q3' || question == 'Q4' || question == 'Q5' || question == 'Q6' || question == 'Q7' || question == 'Q8' || question == 'Q9' || question == 'Q10' || question == 'Q11' || question == 'Q12' || question == 'Q13' || question == 'Q14' ){

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

    groupButtons.appendChild(el('p', 'The following are the groups shown in the graph:'));
    
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
          console.log("new chosen value: False")
        }
        else {
          this.setAttribute("chosen", "True")
          console.log("new chosen value: True")
        }
        svg = document.querySelector("svg");
        console.log("svg: ")
        console.log(svg)
        if(svg){deleteEl(svg)}
        if(question == 'Q2'){
          empty(message)
          createClusterGraph(relevantSentences, feature)
        }
        else if(question == 'Q1'){
          empty(message)
          createClusterGraphQuestion1(relevantSentences)
        }
        else if (question == 'Q3' || question == 'Q4' || question == 'Q5'|| question == 'Q6' || question == 'Q7' || question == 'Q8' || question == 'Q9' || question == 'Q10' || question == 'Q11' || question == 'Q12' || question == 'Q13' || question == 'Q14'){
          empty(message)
          createClusterGraphQuestion3(relevantSentences)
        }
        
      });
      console.log('groupButtons: ', groupButtons )
      groupButtons.appendChild(btn);   
    }
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
      groupResults(relevantSentences)
      addFeatureButtonsToPage(relevantSentences)
      addGroupButtonsToPage(relevantSentences, '', "Q1")
      createClusterGraphQuestion1(relevantSentences)
      
    }
    if(currentQuestion == 'feature1'){
      groupResults(relevantSentences)
      addGroupButtonsToPage(relevantSentences, "displayProduct", "Q2")
      createClusterGraph(relevantSentences, "displayProduct")
    }
    if(currentQuestion == 'feature2'){
      groupResults(relevantSentences)
      addGroupButtonsToPage(relevantSentences, "displayProduct", "Q2")
      createClusterGraph(relevantSentences, "purchaseProduct")
    }
    if(currentQuestion == 'feature3'){
      groupResults(relevantSentences)
      addGroupButtonsToPage(relevantSentences, "displayProduct", "Q2")
      createClusterGraph(relevantSentences, "userManagement")
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
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
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
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
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
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
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
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
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
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
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
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
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
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
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
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
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
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
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
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
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
        addReqSentenceAndButtonsToPage(currUserStory, relevantSentences)
        createClusterGraphQuestion3(relevantSentences)
      }        
    }
}

 
  function groupResults(relevantSentences){
    features=0;
    usecases=0;
    funcreqs=0;

    console.log(relevantSentences)

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
    empty(message)
    svg = d3.getElementById("svg")
    console.log(svg)
    storedResults = JSON.parse(JSON.stringify(initData));
    var selectObj = document.getElementById('front-search-question')
    var currentSelection = selectObj.options[selectObj.selectedIndex].value
    console.log('currSelection:')
    console.log(currentSelection)
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
          sentence = el('p', paragraphObj['sentence']);
          if (paragraphObj['Highlighted'] === 'True') {
            sentence.classList.add('highlighted');
          }
          div.appendChild(sentence);
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
    message = domains.querySelector('.message');
    wordButtons = domains.querySelector('#wordButtons');
    groupButtons = domains.querySelector('#groupButtons');
    console.log("message element: ", message)
    jQuery("#question1").click(function(e){
      // TODO: create a function for the next four lines - they reset everything.
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      empty(summary)
      empty(message)
      empty(wordButtons)
      empty(groupButtons)
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
      hideSelector("featureSelector")
      empty(summary)
      empty(message)
      empty(wordButtons)
      empty(groupButtons)
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'feature1');
      e.preventDefault();
    });
    jQuery("#feature2").click(function(e){
      hideSelector("featureSelector")
      empty(summary)
      empty(message)
      empty(wordButtons)
      empty(groupButtons)
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'feature2');
      e.preventDefault();
    });
    jQuery("#feature3").click(function(e){
      hideSelector("featureSelector")
      empty(summary)
      empty(message)
      empty(wordButtons)
      empty(groupButtons)
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
      question = this.parentNode.parentNode.parentNode.className.replace(' open', '')
      requirement = this.textContent
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      empty(summary)
      empty(message)
      empty(wordButtons)
      empty(groupButtons)
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
