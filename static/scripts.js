const API_URL = 'https://apis.is/isnic?domain=';

function changeInputType(){
  console.log('ajgfækoasjfæladjfædlasjkæl')
}

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
        data.json().then(stuff => renderResponseToUserQuery(stuff))

        //renderSection(data.results));
      }) 
      .catch((error) => {
        console.error('Villa við að sækja gögn', error);
        showMessage('Villa við að sækja gögn');
      });
  }

  function renderResponseToUserQuery(relevantSentences){
    groupResults(relevantSentences)
    renderHighlightedData(relevantSentences)
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

  function renderHighlightedData(relevantSentences){
    for(let sentenceToHighlight of relevantSentences){
      console.log(sentenceToHighlight['sentence'])
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
        console.log('MATCH!!!!!!!!!!!!!!!!!!!!!!!!!!')
      }
    }
    
    for (let paragraphs of section['paragraphs']) {
      if(paragraphs.length>0){
        for (let paragraphObj of paragraphs) {
          paragraph = paragraphObj['sentence'].toLowerCase();
          if(sentenceToHighlight == paragraph){
            paragraphObj['Highlighted']='True'
            console.log('MATCH!!!!!!!!!!!!!!!!!!!!!!!!!!')
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

  function onChangeQuestion(){
    empty(summary)
    storedResults = JSON.parse(JSON.stringify(initData));
    var selectObj = document.getElementById('front-search-question')
    var currentSelection = selectObj.options[selectObj.selectedIndex].value
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

  function init(domains) {
    const form = domains.querySelector('form');
    input = form.querySelector('input');
    results = domains.querySelector('.results');
    summary = domains.querySelector('.summary');
    dropdown = document.querySelector('#front-search-question');
    dropdown.addEventListener('change', onChangeQuestion);

    form.addEventListener('onchange', changeInputType);

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
