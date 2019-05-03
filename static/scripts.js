const API_URL = 'https://apis.is/isnic?domain=';

const program = (() => {

  let input;
  let results;
  let dropdown;
  let initData = JSON.parse(JSON.stringify(storedResults));
  
  /**
   * Post method for getting data from the Python server
   * @param {string} domain - URL for requesting data from the Python server
   * @param {string} currentQuestion - The question chosen by the user
   */
  function fetchResults(domain, currentQuestion) {
    //fetch(`${domain}`, {'method': 'POST', 'body': {'currQuestion': currentQuestion}})
    //fetch('https://hinriksnaer.pythonanywhere.com/query/question', 
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
        console.error('Error fetching data', error);
      });
  }

  /**
   * Renders the response to the user queries (questions)
   * @param {Array} relevantSentences - List of sentences that are relevant to answer the user's question
   * @param {string} currentQuestion - The question chosen by the user
   */
  function renderResponseToUserQuery(relevantSentences, currentQuestion){
    if(currentQuestion == 'question1'){
      addFeatureButtonsToPage(relevantSentences)
      addGroupButtonsToPage(relevantSentences, '', "Q1")
      addQuestionHeader('What functionalities exist in the system?')
      createClusterGraphQuestion1(relevantSentences)
      alterGroupNaming()
    }
    if(currentQuestion == 'feature1'){
      addQuestionHeader('What functionalities does this feature provide?')
      addChosenFeature('Display products')
      addGroupButtonsToPage(relevantSentences, "displayProduct", "Q2")
      createClusterGraphQuestion2(relevantSentences, "displayProduct")
      alterGroupNaming()
    }
    if(currentQuestion == 'feature2'){
      addQuestionHeader('What functionalities does this feature provide?')
      addChosenFeature('Purchase products')
      addGroupButtonsToPage(relevantSentences, "purchaseProduct", "Q2")
      createClusterGraphQuestion2(relevantSentences, "purchaseProduct")
      alterGroupNaming()
    }
    if(currentQuestion == 'feature3'){
      addQuestionHeader('What functionalities does this feature provide?')
      addChosenFeature('User management')
      addGroupButtonsToPage(relevantSentences, "userManagement", "Q2")
      createClusterGraphQuestion2(relevantSentences, "userManagement")
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
        createClusterGraphTreudeQuestions(relevantSentences)
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
      createClusterGraphTreudeQuestions(relevantSentences)    
      alterGroupNaming()
    }
  }
  
  /**
   * Renders the software documentation 
   * @param {Array} data - The whole software documentation
   */
  function renderFullJsonData(data) {
    empty(results);
    for (let section of data) {
      renderSection(section);
    }
  }

  /**
   * Renders a section of the software documentation
   * @param {Array} section - A section of the software documentation
   */
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

  /**
   * Initialises the system when the web page is loaded
   * @param {HTML DOM Element Object} domains - HTML element containing the documentation and result sections of the web page
   */
  function init(domains) {
    results = domains.querySelector('.results');
    summary = domains.querySelector('.summary');
    wordButtons = document.querySelector('#wordButtons');
    groupButtons = document.querySelector('#groupButtons');
    graph = domains.querySelector	("#interactive_diagram_svg")
    jQuery("#question1").click(function(e){
      clearUIElements(domains)
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      storedResults = JSON.parse(JSON.stringify(initData));
      //fetchResults('https://hinriksnaer.pythonanywhere.com/query/question', 'question1');
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
      clearUIElements(domains)
      hideSelector("featureSelector")
      storedResults = JSON.parse(JSON.stringify(initData));
      //fetchResults('https://hinriksnaer.pythonanywhere.com/query/question', 'feature1');
      fetchResults('http://127.0.0.1:5000/query/question', 'feature1');
      e.preventDefault();
    });
    jQuery("#feature2").click(function(e){
      clearUIElements(domains)
      hideSelector("featureSelector")
      storedResults = JSON.parse(JSON.stringify(initData));
      //fetchResults('https://hinriksnaer.pythonanywhere.com/query/question', 'feature2');
      fetchResults('http://127.0.0.1:5000/query/question', 'feature2');
      e.preventDefault();
    });
    jQuery("#feature3").click(function(e){
      clearUIElements(domains)
      hideSelector("featureSelector")
      storedResults = JSON.parse(JSON.stringify(initData));
      //fetchResults('https://hinriksnaer.pythonanywhere.com/query/question', 'feature3');
      fetchResults('http://127.0.0.1:5000/query/question', 'feature3');
      e.preventDefault();
    });

    jQuery("#question3").click(function(e){
      hideSelector("featureSelector")
      hideSelector("userStoryNonFuncSelector")
      showSelector("userStorySelector", "question3")
    });
    jQuery(".req").click(function(e){
      clearUIElements(domains)
      question = this.parentNode.parentNode.parentNode.className.replace(' open', '')
      requirement = this.textContent
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      storedResults = JSON.parse(JSON.stringify(initData));
      //fetchResults('https://hinriksnaer.pythonanywhere.com/query/question', question + requirement);
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
      clearUIElements(domains)
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      storedResults = JSON.parse(JSON.stringify(initData));
      //fetchResults('https://hinriksnaer.pythonanywhere.com/query/question', 'question15');  
      fetchResults('http://127.0.0.1:5000/query/question', 'question15');    
    });
    jQuery("#question16").click(function(e){
      clearUIElements(domains)
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      storedResults = JSON.parse(JSON.stringify(initData));
      //fetchResults('https://hinriksnaer.pythonanywhere.com/query/question', 'question16');
      fetchResults('http://127.0.0.1:5000/query/question', 'question16');
    });
    jQuery("#question17").click(function(e){
      clearUIElements(domains)
      hideSelector("featureSelector")
      hideSelector("userStorySelector")
      hideSelector("userStoryNonFuncSelector")
      storedResults = JSON.parse(JSON.stringify(initData));
      //fetchResults('https://hinriksnaer.pythonanywhere.com/query/question', 'question17');
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
