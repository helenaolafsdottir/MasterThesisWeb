const API_URL = 'https://apis.is/isnic?domain=';


const program = (() => {
  let input;
  let results;

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
    empty(results);
    results.appendChild(el('p', msg));
  }

  function showResults(item) {
    
  }

  function showLoading() {
    empty(results);

    const img = document.createElement('img');
    img.setAttribute('alt', '');
    img.setAttribute('src', 'loading.gif');

    const loading = el('div', img, 'Leita að léni...');
    loading.classList.add('loading');

    results.appendChild(loading);
  }

  function fetchResults(domain) {
    showLoading();

    fetch(`${API_URL}${domain}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Non 200 status');
        }
        return res.json();
      })
      .then(data => showResults(data.results))
      .catch((error) => {
        console.error('Villa við að sækja gögn', error);
        showMessage('Villa við að sækja gögn');
      });
  }

  function onSubmit(e) {
    e.preventDefault();

    const domain = input.value;

    if (typeof domain !== 'string'|| domain === '') {
      showMessage('Lén verður að vera strengur');
    } else {
      fetchResults(domain);
    }
  }

  function renderFullJsonData(data) {
    for (let section of data) {
      renderSection(section);
    }
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

    form.addEventListener('submit', onSubmit);


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
