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
        data.json().then(stuff => renderHighlightedData(stuff))

        //renderSection(data.results));
      }) 
      .catch((error) => {
        console.error('Villa við að sækja gögn', error);
        showMessage('Villa við að sækja gögn');
      });
  }

  function renderHighlightedData(data){
    //console.log(data)
    for(let sentenceToHighlight of data){
      //console.log('----- new search starting -----')
      for (let section of storedResults) {
        highlightData(section, sentenceToHighlight['sentence'].toLowerCase());
      }
    }
    
    renderFullJsonData(storedResults)
  }
  function highlightData(section, sentenceToHighlight){
    //console.log(sentenceToHighlight)
    //console.log(sentenceToHighlight.length)
    //console.log(section[Object.keys(section)[0]])
    //console.log(section[Object.keys(section)[0]].length)
    
    //checking headers

    //console.log(sentenceToHighlight)
    sentenceToHighlight = sentenceToHighlight.replace(/[,;:.]$/,'');
    //console.log(sentenceToHighlight)
    if(section[Object.keys(section)[0]]){
      header = section[Object.keys(section)[0]].toLowerCase()
      header = header.replace(/[,;:.]$/,'');
      if(sentenceToHighlight == header){
        //paragraphObj['Highlighted']='True'
        console.log('MATCH!!!!!!!!!!!!!!!!!!!!!!!!!!')
        console.log(header)
      }
    }
    
    for (let paragraphs of section['paragraphs']) {
      if(paragraphs.length>0){
        for (let paragraphObj of paragraphs) {
          paragraph = paragraphObj['sentence'].toLowerCase().replace(/[,;:.]$/,'');
          //console.log('sentence 1: ', sentenceToHighlight['sentence'] )
          //console.log('sentence 2: ', paragraph)
          if(sentenceToHighlight.includes('sort by name') && paragraph.includes('sort by name')){
            console.log(sentenceToHighlight)
            console.log(paragraph)
          }
          if(sentenceToHighlight == paragraph){
            paragraphObj['Highlighted']='True'
            console.log('MATCH!!!!!!!!!!!!!!!!!!!!!!!!!!')
            console.log(paragraph)
          }
        } 
      }
    }    
    for (let subSection of section['sub-sections']) {
      //console.log(subSection)
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
    storedResults = JSON.parse(JSON.stringify(initData));
    var selectObj = document.getElementById('front-search-question')
    var currentSelection = selectObj.options[selectObj.selectedIndex].value
    fetchResults('http://127.0.0.1:5000/query/question', currentSelection);
    //$.post('http://127.0.0.1:5000/query/question', {currQuestion: currentSelection}, function(data){
    //  console.log(data)
    //  })

  }

  function renderSection(section) {
    header = el(Object.keys(section)[0], section[Object.keys(section)[0]])
    results.appendChild(header);
    for (let paragraphs of section['paragraphs']) {
      let div = el('div')
      div.classList.add('paragraph')
      div.classList.add(Object.keys(section)[0]);
      for (let paragraphObj of paragraphs) {
        paragraph = el('p', paragraphObj['sentence']);
        if (paragraphObj['Highlighted'] === 'True') {
          paragraph.classList.add('highlighted');
        }
        div.appendChild(paragraph);
      }
      results.appendChild(div);
    }
    for (let subSection of section['sub-sections']) {
      renderSection(subSection);
    }
  }

  function init(domains) {
    const form = domains.querySelector('form');
    input = form.querySelector('input');
    results = domains.querySelector('.results');
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