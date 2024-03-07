const inputMin = document.getElementById('min');
const inputMax = document.getElementById('max');
const inputRows = document.getElementById('rows');
const selectRowsContainer = document.getElementById('select-number-rows');
const tablesContainer = document.getElementById('tables-container');

document.addEventListener('DOMContentLoaded', (event) => {
  const url = new URL(window.location.href);
  const min = url.searchParams.get('min');
  const max = url.searchParams.get('max');
  const rows = url.searchParams.get('rows');

  if (min) {
    inputMin.value = min;
  }
  if (max) {
    inputMax.value = max;
  }
  if (rows) {
    inputRows.value = rows;
  }

  if (min && max && rows) {
    btnSubmit.click();
  }

  if (!min || !max || !rows) {
    tablesContainer.style.display = 'none';
  } else {
    tablesContainer.style.display = 'flex';
  }

  if (!min || !max) {
    selectRowsContainer.style.display = 'none';
    return
  }
  selectRowsContainer.style.display = 'flex';
});

inputMin.addEventListener('input', (event) => {
  const { value } = event.target;
  const searchParams = new URLSearchParams(window.location.search);
  
  if (value) {
    searchParams.set('min', value);
  } else {
    searchParams.delete('min');
    selectRowsContainer.style.display = 'none';
  }

  const pathname = window.location.pathname;
  history.replaceState(null, '', `${pathname}?${searchParams.toString()}`);
});

inputMax.addEventListener('input', (event) => {
  const { value } = event.target;
  const searchParams = new URLSearchParams(window.location.search);

  if (value) {
    searchParams.set('max', value);
  } else {
    searchParams.delete('max');
    selectRowsContainer.style.display = 'none';
  }

  const pathname = window.location.pathname;
  history.replaceState(null, '', `${pathname}?${searchParams.toString()}`);
});

inputRows.addEventListener('input', (event) => {
  const { value } = event.target;
  const searchParams = new URLSearchParams(window.location.search);

  if (value) {
    searchParams.set('rows', value);
  } else {
    searchParams.delete('rows');
  }

  const pathname = window.location.pathname;
  history.replaceState(null, '', `${pathname}?${searchParams.toString()}`);
});

const form = document.getElementById('form');

let errors = {};

const getDataRange = () => {
  const formData = new FormData(form);
  const min = formData.get('min');
  const max = formData.get('max');

  if (!min || min === '') {
    errors.min = 'El mínimo es requerido.';
    selectRowsContainer.style.display = 'none';
    return;
  }

  if (!max || max === '') {
    errors.max = 'El máximo es requerido.';
    selectRowsContainer.style.display = 'none';
    return;
  }

  if (isNaN(+min)) {
    errors.min = 'No es un número.';
    selectRowsContainer.style.display = 'none';
    return;
  }

  if (isNaN(+max)) {
    errors.max = 'No es un número.';
    selectRowsContainer.style.display = 'none';
    return;
  }

  if (+min > +max) {
    errors.min = 'El mimino no puede ser el mayor.';
    selectRowsContainer.style.display = 'none';
    return;
  }

  if (+min === +max) {
    errors.other = 'No pueden ser iguales.';
    selectRowsContainer.style.display = 'none';
    return;
  }

  selectRowsContainer.style.display = 'flex';
  errors = {};
}

const getDataRows = () => {
  const formData = new FormData(form);
  const rows = formData.get('rows');

  if (!rows || rows === '') {
    errors.rows = 'Las filas son requeridas.';
    return;
  }

  if (isNaN(+rows)) {
    errors.rows = 'No es un número.';
    return;
  }

  if (+rows < 1) {
    errors.rows = 'El número de filas no puede ser menor a 1.';
    return;
  }

  errors = {};
}

const setErrors = (errors) => {
  const rangeError = document.getElementById('range-error')
  const rowsError = document.getElementById('rows-error')

  if (errors?.min) {
    rangeError.textContent = errors.min;

    rangeError.classList.add('error');
    inputMin.classList.add('input-error');  
  }

  if (errors?.max) {
    rangeError.textContent = errors.max;

    rangeError.classList.add('error');
    inputMax.classList.add('input-error');
  }

  if (errors?.other) {
    rangeError.textContent = errors.other;

    rangeError.classList.add('error');
    inputMin.classList.add('input-error');
    inputMax.classList.add('input-error');
  }

  if (!errors?.min && !errors?.max && !errors?.other) {
    rangeError.textContent = '';
    rangeError.classList.remove('error');
    inputMin.classList.remove('input-error');
    inputMax.classList.remove('input-error');
  }

  if (errors?.rows) {
    rowsError.textContent = errors.rows;
    rowsError.classList.add('error');
    inputRows.classList.add('input-error');
  }

  if (!errors?.rows) {
    rowsError.textContent = '';
    rowsError.classList.remove('error');
    inputRows.classList.remove('input-error');
  }
}


const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
});

const btnRange = document.getElementById('btn-range');
btnRange.addEventListener('click', (event) => {
  getDataRange()
  setErrors(errors)
});

const btnSubmit = document.getElementById('btn-submit');
btnSubmit.addEventListener('click', (event) => {
  getDataRange();
  getDataRows();
  setErrors(errors)
  console.log(errors);
  if (Object.keys(errors).length > 0) {
    return;
  }
  removeElements();
  createTable(+inputRows.value, +inputMin.value, +inputMax.value);
  tablesContainer.style.display = 'flex';
});


const removeElements = () => {
  const tbodyCumulativeDistribution = document.getElementById('tbody-cumulative-distribution');
  const elements = tbodyCumulativeDistribution.querySelectorAll('tr');
  for (const element of elements) {
    tbodyCumulativeDistribution.removeChild(element);
  }

  const theadProbabilityDensity = document.getElementById('thead-probability-density');
  const thElements = theadProbabilityDensity.querySelectorAll('th');
  for (const element of thElements) {
    if (element.textContent === 'x') continue;
    theadProbabilityDensity.removeChild(element);
  }

  const trProbabilityDensity = document.getElementById('tr-probability-density');
  const tdElementsProbabiltyDensity = trProbabilityDensity.querySelectorAll('td');
  for (const element of tdElementsProbabiltyDensity) {
    if (element.textContent === 'p(x)') continue;
    trProbabilityDensity.removeChild(element);
  }

  const trTotalProbabilityDensity = document.getElementById('tr-total-probability-density');
  const tdElementsTotalProbabilityDensity = trTotalProbabilityDensity.querySelectorAll('td');
  for (const element of tdElementsTotalProbabilityDensity) {
    if (element.textContent === 'Total') continue;
    trTotalProbabilityDensity.removeChild(element);
  }
}

const fragment = document.createDocumentFragment();

const createTable = (rows, min, max) => {
  const array = new Array(rows).fill('').map(() => getRandomNumber(min, max));

  const tbodyCumulativeDistribution = document.getElementById('tbody-cumulative-distribution');

  for (let i = 0; i < array.length; i++) {
    const tr = document.createElement('tr');

    const td1 = document.createElement('td');
    td1.textContent = i + 1;

    tr.appendChild(td1);

    const td2 = document.createElement('td');
    td2.textContent = array[i]

    tr.appendChild(td2);
    fragment.appendChild(tr);
  }
  tbodyCumulativeDistribution.appendChild(fragment);

  const theadProbabilityDensity = document.getElementById('thead-probability-density');
  for (let i = min; i <= max; i++) {
    const th = document.createElement('th');
    th.textContent = i;
    fragment.appendChild(th);
  }
  theadProbabilityDensity.appendChild(fragment);

  const trProbabilityDensity = document.getElementById('tr-probability-density');
  for (let i = min; i <= max; i++) {
    const td = document.createElement('td');

    const filteredArray = array.filter((item) => item === i);
    const probabilityDensity = (filteredArray.length / rows).toFixed(2);

    td.textContent = probabilityDensity
    fragment.appendChild(td);
  }
  trProbabilityDensity.appendChild(fragment);

  const trTotalProbabilityDensity = document.getElementById('tr-total-probability-density');
  for (let i = min; i <= max; i++) {
    const td = document.createElement('td');

    const filteredArray = array.filter((item) => item === i);

    td.textContent = filteredArray.length;
    fragment.appendChild(td);
  }
  trTotalProbabilityDensity.appendChild(fragment);
}