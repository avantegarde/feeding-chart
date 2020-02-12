var SAVE_KEY = 'nutes_save_v2';
/**
* Save state
* @param state
*/
function save(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
/**
* Load state
*/
function load() {
  return JSON.parse(localStorage.getItem(SAVE_KEY));
}
var state = load();
var cocoNutes = [
  {
    name: 'si',
    u: 'ml',
    p: 100,
    m: [0, 0.5, 1, 1, 1.5, 1.5, 1.5, 1.5, 1.5, 1, 0.5, 0, 0],
  },
  {
    name: 'calmag',
    u: 'ml',
    p: 100,
    m: [5, 5, 5, 5, 4, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 1.5, 0],
  },
  {
    name: 'micro',
    u: 'ml',
    p: 100,
    m: [1.25, 2.25, 2.25, 2.5, 2.25, 2.5, 2.5, 2.25, 2.25, 2.25, 2.25, 1, 0],
  },
  {
    name: 'gro',
    u: 'ml',
    p: 100,
    m: [0.6, 2.25, 2.5, 2.5, 2.25, 1, 1, 0.5, 0.5, 0, 0, 0, 0],
  },
  {
    name: 'bloom',
    u: 'ml',
    p: 100,
    m: [0.6, 0.6, 1, 1.2, 2.25, 2.5, 2.5, 3, 3, 4, 4, 4, 0],
  },
  {
    name: 'ppm',
    u: '',
    p: 100,
    m: [200, 550, 600, 625, 575, 575, 575, 600, 600, 650, 650, 475, 0],
  },
];
var dwcNutes = [
  {
    name: 'si',
    u: 'ml',
    p: 100,
    m: [0, 1.5, 2, 2.5, 2.5, 2.5, 2.5, 2.5, 2, 1.5, 0, 0],
  },
  {
    name: 'calmag',
    u: 'ml',
    p: 50,
    m: [0, 2.5, 5, 5, 5, 5, 5, 5, 5, 2.5, 0, 0],
  },
  {
    name: 'micro',
    u: 'ml',
    p: 50,
    m: [2.5, 7.5, 10, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 5, 0],
  },
  {
    name: 'gro',
    u: 'ml',
    p: 50,
    m: [2.5, 10, 10, 7.5, 2.5, 2.5, 2.5, 2.5, 0, 0, 0, 0],
  },
  {
    name: 'bloom',
    u: 'ml',
    p: 50,
    m: [2.5, 2.5, 5, 7.5, 10, 10, 12.5, 12.5, 15, 15, 15, 0],
  },
  {
    name: 'enzymes',
    u: 'g',
    p: 100,
    m: [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25],
  },
];
if (state) {
  state = state;
  if (!state.medium) {
    state.medium = 'dwc';
  }
} else {
  var state = {
    week: 1,
    medium: 'dwc',
    nutes: dwcNutes,
    stage: 'veg',
  };
  save(state);
}
/** 
 * Load the new state object if old one doesn't have the right data
 * */
function newState(){
  var state = {
    week: 1,
    medium: 'dwc',
    nutes: dwcNutes,
    stage: 'veg',
  };
  save(state);
}
/**
 * Convert ml -> tsp
 * @param {int} u 
 * @param {int} x 
 */
function convert(u, x) {
  if (u === 'ml') {
    var c = x * 0.20;
  } else if (u === 'tsp') {
    var c = x / 0.20;
  }
  if(c){
    c = c.toFixed(2);
  } else {
    c = x;
  }
  return c;
}
/**
 * Switch nutrient units
 */
function switchUnits() {
  var nutes = state.nutes;
  for(i=0;i<nutes.length;i++){
    for (n=0;n<nutes[i].m.length;n++) {
      if (nutes[i].name != 'enzymes' || nutes[i].name != 'ppm') {
        nutes[i].m[n] = convert(nutes[i].u, nutes[i].m[n]);
      }
    }
    if (nutes[i].u === 'tsp') {
      nutes[i].u = 'ml';
    } else if (nutes[i].u === 'ml') {
      nutes[i].u = 'tsp'
    }
  }
  render(state);
}
/**
 * Update the max number of weeks allowed to select/highlight
 */
function updateMaxWeeks() {
  var weekSelect = document.getElementById('week');
  if(state.medium === 'coco'){
    weekSelect.setAttribute('max', '13');
  } else {
    weekSelect.setAttribute('max', '12');
  }
}
/**
 * Switch grow medium
 */
function switchMedium() {
  if(state.medium === 'dwc') {
    state.medium = 'coco';
    state.nutes = cocoNutes;
  } else {
    state.medium = 'dwc';
    state.nutes = dwcNutes;
  }
  render(state);
}
/**
 * Set percentage for each nutrient
 * @param {int} p 
 * @param {obj} nute 
 */
function setPercent(p, nute) {
  var nutes = state.nutes;
  var p = p?p.value:100;
  for(i=0;i<nutes.length;i++){
    if (nutes[i].name === nute) {
      nutes[i].p = p;
    }
  }
  render(state);
}
/**
 * Set and render the percentage select dropdown
 * @param {int} p 
 * @param {obj} nute 
 */
function percentSelect(p, nute) {
  var choices = [];
  for (x=0;x<=100;x++) {
    if (Number.isInteger(x / 5)) {
      choices.push(x);
    }
  }
  var select = "<select id="+nute+" name="+nute+" onchange=setPercent(this,'"+nute+"')>";
  for (j=0;j<choices.length;j++) {
    select += '<option value="'+choices[j]+'">'+choices[j]+'%</option>';
  }
  select += '</select>';
  return select;
}
/**
 * Return the nutrient value
 * @param {obj} n 
 * @param {int} w 
 */
function nuteVal(n, w) {
  var p = n.p;
  var val = (p / 100) * w;
  if(n.name != 'ppm'){
    val = val.toFixed(2)
  } else {
    val = val;
  }
  return val;
}
/**
 * Automatically set the current week
 * @param {obj} state 
 */
function autoSelect(state) {
  var nutes = state.nutes;
  for(i=0;i<nutes.length;i++){
    var e = document.getElementById(nutes[i].name);
    e.value = nutes[i].p;
  }
  var week = document.getElementById('week');
  week.value = state.week;
}
/**
 * Render the column group for week highlight
 * @param {obj} nutes 
 */
function renderColgroup(nutes) {
  var colgroup = document.getElementById('columns');
  var columns = '';
  var totalCol = nutes[0].m.length + 2
  for (w=0;w<totalCol;w++) {
    columns += '<col span="1" class="week' + (w+1) +'">';
  }
  colgroup.innerHTML = columns;
}
/**
 * Render the nutrient table Header
 * @param {obj} nutes 
 */
function renderTableHead(nutes) {
  var thead = document.getElementById('tablehead');
  var tableHead = '' +
  '<tr>' +
  '  <th>Nutrient</th>' +
  '  <th>Strength</th>';
  for (w=0;w<nutes[0].m.length;w++) {
    var vegWeeks = (state.medium === 'coco')?4:3;
    var week = (vegWeeks === 4)?w-1:w;
    if (w+1 === 1 && vegWeeks === 4) {
      tableHead += '<th>S ' + (week+1) +'</th>';
    } else if (w+1 <= vegWeeks) {
      tableHead += '<th>V ' + (week+1) +'</th>';
    } else {
      tableHead += '<th>F ' + (week-2) +'</th>';
    }
  }
  tableHead += '</tr>'
  thead.innerHTML = tableHead;
}
/**
 * Render the nutrient table body
 * @param {obj} nutes 
 */
function renderTableBody(nutes) {
  var tbody = document.getElementById('nutes');
  var tableBody = '';
  for(i=0;i<nutes.length;i++){
    tableBody += '' +
    '<tr>' +
    '  <td><strong>'+ nutes[i].name +'</strong></td>' +
    '  <td>' + percentSelect(nutes[i].p, nutes[i].name) + '</td>';
    for (n=0;n<nutes[i].m.length;n++) {
      tableBody += '<td>' + nuteVal(nutes[i], nutes[i].m[n]) + '<span>' + nutes[i].u + '</span>' +'</td>';
    }
    tableBody += '</tr>';
  }
  tbody.innerHTML = tableBody;
}
/**
 * Set the active week
 * @param {int} week 
 */
function setActiveWeek(week) {
  var week = week?week.value:1;
  state.week = week;
  render(state);
}
/**
 * Highlight the current week in the table
 * @param {int} week 
 */
function highlightWeek(week) {
  var columns = document.querySelectorAll('#columns col');
  var column = document.querySelectorAll('#columns .week'+ (week+2));
  for (i=0;i<columns.length;i++) {
    columns[i].classList.remove('active');
  }
  column[0].classList.add('active');
}
/**
 * Render the nutrient table title
 */
function renderTableTitle(){
  let title = document.getElementById('medium');
  title.innerHTML = state.medium.toUpperCase();
}
/**
 * Render the contents of the "More Info" box
 * @param {string} medium 
 */
function renderMoreInfo(medium) {
  if(medium === 'coco'){
    var notes = [
      'Never premix nutrients',
      'Add nutrients in order listed below',
      'Add all nutrients before adjusting PH',
      'PH 6.2-6.4 during seedling stage to prevent calMag deficiency',
      'PH 5.8-6.2 during veg stage',
      'PH 5.7-6.3 during flower stage',
      'Water at LEAST once a day with ~20% runoff',
      'Repeat Week 3 for a longer vegetative period',
      'Repeat Week 7 for a longer flowering stage',
    ];
  } else{
    var notes = [
      'Never premix nutrients',
      'Add nutrients in order listed below',
      'Add all nutrients before adjusting PH',
      'PH 5.8 during Veg. PH 6.1 during Flower',
      'Change reservoir every 7-10 days',
      'Repeat Week 3 for a longer vegetative period',
      'Repeat Week 8 for a longer flowering stage',
      'CalMag required when using RO/low ppm water',
    ];
  }
  var moreInfo = document.getElementById('more-info');
  var notesTemplate = '';
  notesTemplate += '<ul>';
  for(i=0;i<notes.length;i++){
    notesTemplate += '<li>' + notes[i] + '</li>';
  }
  notesTemplate += '</ul>';
  moreInfo.innerHTML = notesTemplate;
}
/**
 * Render the app
 * @param {obj} state 
 */
function render (state) {
  var nutes = state.nutes;
  updateMaxWeeks();
  renderMoreInfo(state.medium);
  renderTableTitle();
  renderColgroup(nutes);
  renderTableHead(nutes);
  renderTableBody(nutes);
  autoSelect(state);
  highlightWeek(parseInt(state.week));
  save(state);
}
render(state);
/**
 * Toggle the "More Info" content box
 */
function moreInfo() {
  var more_info = document.getElementById('more-info');
  if(more_info.classList.contains('active')) {
      more_info.classList.remove('active');
  } else {
      more_info.classList.add('active');
  }
}