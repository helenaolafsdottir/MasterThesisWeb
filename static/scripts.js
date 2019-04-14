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
      renderHighlightedData(relevantSentences)
    }
    if(currentQuestion == 'feature1'){
      createClusterGraph(relevantSentences, "displayProduct")
      groupResults(relevantSentences)
      renderHighlightedData(relevantSentences)
    }
    if(currentQuestion == 'feature2'){
      createClusterGraph(relevantSentences, "purchaseProduct")
      groupResults(relevantSentences)
      renderHighlightedData(relevantSentences)
    }
    if(currentQuestion == 'feature3'){
      createClusterGraph(relevantSentences, "userManagement")
      groupResults(relevantSentences)
      renderHighlightedData(relevantSentences)
    }
    if(currentQuestion == 'question3'){
      createTreeVisualisation(relevantSentences)
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

  function renderHighlightedData(relevantSentences){
    for(let sentenceToHighlight of relevantSentences){
      //console.log(sentenceToHighlight['sentence'])
      for (let section of storedResults) {
        highlightData(section, sentenceToHighlight['sentence'].toLowerCase());
      }
    }
    
    renderFullJsonData(storedResults)
  }
  function highlightData(section, sentenceToHighlight){
  
    //checking headers
    if(section[Object.keys(section)[0]]['sentence']){
      header = section[Object.keys(section)[0]]['sentence'].toLowerCase()
      if(sentenceToHighlight == header){
        section[Object.keys(section)[0]]['Highlighted']='True'
        //console.log('MATCH!!!!!!!!!!!!!!!!!!!!!!!!!!')
      }
    }
    
    for (let paragraphs of section['paragraphs']) {
      if(paragraphs.length>0){
        for (let paragraphObj of paragraphs) {
          paragraph = paragraphObj['sentence'].toLowerCase();
          if(sentenceToHighlight == paragraph){
            paragraphObj['Highlighted']='True'
            //console.log('MATCH!!!!!!!!!!!!!!!!!!!!!!!!!!')
          }
        } 
      }
    }    
    for (let subSection of section['sub-sections']) {
      highlightData(subSection, sentenceToHighlight);
    }
  }


  
  function renderFullJsonData(data) {
    empty(results);
    for (let section of data) {
      renderSection(section);
    }
  }

  //Currently not using this function!
  function onChangeQuestion(){
    empty(summary)
    svg = d3.getElementById("svg")
    console.log(svg)
    storedResults = JSON.parse(JSON.stringify(initData));
    var selectObj = document.getElementById('front-search-question')
    var currentSelection = selectObj.options[selectObj.selectedIndex].value
    console.log('currSelection:')
    console.log(currentSelection)
    fetchResults('http://127.0.0.1:5000/query/question', currentSelection);
    //$.post('http://127.0.0.1:5000/query/question', {currQuestion: currentSelection}, function(data){
    //  console.log(data)
    //  })

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

  function showFeatureSelector() {
    var featureOpt = document.getElementById("featureSelector");
    featureOpt.style.visibility = "visible";
  }

  function init(domains) {
       
    results = domains.querySelector('.results');
    summary = domains.querySelector('.summary');
    
    jQuery("#question1").click(function(e){
      // TODO: create a function for the next four lines - they reset everything.
      empty(summary)
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'question1');
      e.preventDefault();
    });
    jQuery("#question2").click(function(e){
      empty(summary)
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      showFeatureSelector()
      e.preventDefault();
    });
    jQuery("#feature1").click(function(e){
      empty(summary)
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'feature1');
      e.preventDefault();
    });
    jQuery("#feature2").click(function(e){
      empty(summary)
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'feature2');
      e.preventDefault();
    });
    jQuery("#feature3").click(function(e){
      empty(summary)
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'feature3');
      e.preventDefault();
    });


    jQuery("#question3").click(function(e){
      empty(summary)
      svg = domains.querySelector('svg');
      if(svg){deleteEl(svg)}
      storedResults = JSON.parse(JSON.stringify(initData));
      fetchResults('http://127.0.0.1:5000/query/question', 'question3');
      e.preventDefault();
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
