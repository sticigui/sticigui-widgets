/**
 * Histogram Control Widget
 * 
 * Two overlaid histograms showing full dataset and filtered subset.
 * Allows filtering by variable restrictions and comparing distributions.
 */

import { fetchData } from '../../src/utils/fetchData.mjs';
import { mean, sampleSD, normalPDF } from '../../src/math/stats-math.mjs';
import { isDarkMode, onDarkModeChange } from '../../src/utils/dark-mode.mjs';
import styles from '../../css/sticigui-tailwind.css';

// Inject styles into the widget container to ensure it penetrates any Shadow DOM
function injectStyles(el) {
  // Check if we already injected styles into this specific widget instance
  if (!el.querySelector('.hist-control-styles')) {
    const styleEl = document.createElement('style');
    styleEl.className = 'hist-control-styles';
    styleEl.textContent = styles;
    el.appendChild(styleEl);
  }
}

// Helper to get CSS variable value
function getCSSVar(name, el = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

/**
 * Main render function
 */
export async function render({ model, el }) {
  // Inject CSS directly into the widget element to bypass MyST's potential Shadow DOM isolation
  injectStyles(el);

  // Get model state
  let title = model.get('title');
  let advanced = model.get('advanced') || false;
  const dataSpec = model.get('data');
  let variable = model.get('variable') || null;
  let bins = model.get('bins') || 20;
  let lo = model.get('lo') !== undefined ? model.get('lo') : null;
  let hi = model.get('hi') !== undefined ? model.get('hi') : null;
  let showNormal = model.get('show_normal') || false;
  let showFull = model.get('show_full') !== undefined ? model.get('show_full') : true;
  let showRestricted = model.get('show_restricted') !== undefined ? model.get('show_restricted') : advanced;
  let restrictions = model.get('restrictions') || [];
  
  // Load data from URL, inline array, or object with named datasets
  let datasets = {};
  let datasetNames = [];
  let currentDataset = 'default';
  
  try {
    if (dataSpec) {
      datasets = await fetchData(dataSpec);
      datasetNames = Object.keys(datasets);
      currentDataset = datasetNames[0] || 'default';
    }
  } catch (error) {
    console.error('[hist-control] Error loading data:', error);
    el.textContent = `Error loading data: ${error.message}`;
    return;
  }
  
  // Current state
  let data = datasets[currentDataset] || [];
  let variables = [];
  
  // Container setup
  const container = document.createElement('div');
  container.className = 'sg-font-sans sg-p-6 sg-max-w-[800px] sg-bg-white dark:sg-bg-stone-950 sg-rounded-xl sg-shadow-sm sg-border sg-border-slate-200 dark:sg-border-stone-800 sg-text-slate-900 dark:sg-text-stone-100 sg-widget-root sg-transition-colors';
  
  // Title (optional)
  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.className = 'sg-m-0 sg-mb-6 sg-text-2xl sg-font-semibold sg-tracking-tight sg-text-slate-900 dark:sg-text-stone-100';
    titleEl.textContent = title;
    container.appendChild(titleEl);
  }
  
  // Setup dark mode sync
  const updateDarkMode = () => {
    if (isDarkMode(container)) {
      container.classList.add('dark');
    } else {
      container.classList.remove('dark');
    }
  };
  const cleanupDarkMode = onDarkModeChange(() => {
    updateDarkMode();
    renderChart();
  });
  // Initial sync
  setTimeout(updateDarkMode, 0);
  
  // Controls row 1: Dataset and variable selectors
  const controls1 = document.createElement('div');
  controls1.className = 'sg-mb-4 sg-flex sg-flex-wrap sg-gap-4 sg-items-center';
  
  // Dataset selector (only show if multiple datasets)
  let datasetSelect;
  if (datasetNames.length > 1) {
    const datasetGroup = document.createElement('div');
    datasetGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
    const datasetLabel = document.createElement('label');
    datasetLabel.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
    datasetLabel.textContent = 'Dataset:';
    datasetSelect = document.createElement('select');
    datasetSelect.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
    datasetSelect.setAttribute('data-testid', 'dataset-select');
    datasetNames.forEach(ds => {
      const option = document.createElement('option');
      option.value = ds;
      option.textContent = ds.toUpperCase();
      if (ds === currentDataset) option.selected = true;
      datasetSelect.appendChild(option);
    });
    datasetGroup.appendChild(datasetLabel);
    datasetGroup.appendChild(datasetSelect);
    controls1.appendChild(datasetGroup);
  }
  
  // Variable selector
  const varGroup = document.createElement('div');
  varGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
  const varLabel = document.createElement('label');
  varLabel.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
  varLabel.textContent = 'Variable:';
  const varSelect = document.createElement('select');
  varSelect.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
  varSelect.setAttribute('data-testid', 'variable-select');
  varGroup.appendChild(varLabel);
  varGroup.appendChild(varSelect);
  controls1.appendChild(varGroup);
  
  // Bins input
  const binsGroup = document.createElement('div');
  binsGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
  const binsLabel = document.createElement('label');
  binsLabel.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
  binsLabel.textContent = 'Bins:';
  const binsInput = document.createElement('input');
  binsInput.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
  binsInput.type = 'number';
  binsInput.min = '5';
  binsInput.max = '100';
  binsInput.value = bins;
  binsInput.setAttribute('data-testid', 'bins-input');
  binsGroup.appendChild(binsLabel);
  binsGroup.appendChild(binsInput);
  controls1.appendChild(binsGroup);
  
  
  // Lo input
  const loGroup = document.createElement('div');
  loGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
  controls1.appendChild(loGroup);
  const loLabel = document.createElement('label');
  loLabel.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
  loLabel.textContent = 'Area from:';
  const loInput = document.createElement('input');
  loInput.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
  loInput.type = 'number';
  if (lo !== null) loInput.value = lo;
  loInput.setAttribute('aria-label', 'Area from');
  loGroup.appendChild(loLabel);
  loGroup.appendChild(loInput);

  // Hi input
  const hiGroup = document.createElement('div');
  hiGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
  controls1.appendChild(hiGroup);
  const hiLabel = document.createElement('label');
  hiLabel.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
  hiLabel.textContent = 'Area to:';
  const hiInput = document.createElement('input');
  hiInput.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
  hiInput.type = 'number';
  if (hi !== null) hiInput.value = hi;
  hiInput.setAttribute('aria-label', 'Area to');
  hiGroup.appendChild(hiLabel);
  hiGroup.appendChild(hiInput);

  // List Data button
  const listDataBtn = document.createElement('button');
  listDataBtn.className = 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950';
  listDataBtn.textContent = 'List Data';
  controls1.appendChild(listDataBtn);

  // Univariate Stats button
  const statsBtn = document.createElement('button');
  statsBtn.className = 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950';
  statsBtn.textContent = 'Univariate Stats';
  controls1.appendChild(statsBtn);

  container.appendChild(controls1);
  
  // Controls row 2: Show/hide toggles and normal curve
  const controls2 = document.createElement('div');
  controls2.className = 'sg-mb-4 sg-flex sg-flex-wrap sg-gap-4 sg-items-center';
  
  // Helper to create checkbox
  function createCheckbox(id, label, checked, testId) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'sg-w-4 sg-h-4 sg-accent-blue-600 sg-cursor-pointer sg-rounded sg-border-slate-300 dark:sg-border-stone-600';
    checkbox.checked = checked;
    checkbox.id = id;
    checkbox.setAttribute('data-testid', testId);
    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
    labelEl.textContent = label;
    const group = document.createElement('div');
    group.className = 'sg-flex sg-items-center sg-gap-2.5';
    group.appendChild(checkbox);
    group.appendChild(labelEl);
    return { group, checkbox };
  }
  
  const { group: fullGroup, checkbox: fullCheckbox } = 
    createCheckbox('show-full', 'Show Full', showFull, 'show-full-checkbox');
  const { group: restGroup, checkbox: restCheckbox } = 
    createCheckbox('show-rest', 'Show Restricted', showRestricted, 'show-restricted-checkbox');
  const { group: normGroup, checkbox: normCheckbox } = 
    createCheckbox('show-norm', 'Normal Curve', showNormal, 'show-normal-checkbox');
  
  controls2.appendChild(fullGroup);
  controls2.appendChild(restGroup);
  controls2.appendChild(normGroup);
  
  // Clear restrictions button
  const clearButton = document.createElement('button');
  clearButton.className = 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950';
  clearButton.textContent = 'Clear Restrictions';
  clearButton.setAttribute('data-testid', 'clear-restrictions-button');
  controls2.appendChild(clearButton);
  
  if (advanced) container.appendChild(controls2);
  
  // Restrictions container
  const restrictionsContainer = document.createElement('div');
  restrictionsContainer.style.marginBottom = '1rem';
  // removed inline padding
  // removed inline border
  // removed inline border radius
  restrictionsContainer.className = 'sg-bg-slate-50 dark:sg-bg-stone-800/50 sg-rounded-lg sg-border sg-border-slate-200 dark:sg-border-stone-700 sg-p-4 sg-mb-6';
  restrictionsContainer.setAttribute('data-testid', 'restrictions-container');
  
  const restrictionsTitle = document.createElement('div');
  restrictionsTitle.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
  restrictionsTitle.style.fontWeight = 'bold';
  restrictionsTitle.style.marginBottom = '0.5rem';
  restrictionsTitle.textContent = 'Restrictions:';
  restrictionsContainer.appendChild(restrictionsTitle);
  
  const restrictionsRows = document.createElement('div');
  restrictionsRows.setAttribute('data-testid', 'restrictions-rows');
  restrictionsContainer.appendChild(restrictionsRows);
  
  // Add restriction button
  const addRestrictionButton = document.createElement('button');
  addRestrictionButton.className = 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950';
  addRestrictionButton.textContent = '+ Add Restriction';
  addRestrictionButton.style.marginTop = '0.5rem';
  addRestrictionButton.setAttribute('data-testid', 'add-restriction-button');
  restrictionsContainer.appendChild(addRestrictionButton);
  
  if (advanced) container.appendChild(restrictionsContainer);
  
  // Stats display
  const stats = document.createElement('div');
  stats.className = 'sg-mb-4 sg-text-sm sg-text-slate-900 dark:sg-text-stone-200';
  stats.setAttribute('data-testid', 'stats-display');
  container.appendChild(stats);

  // Proportion display
  const propDisplay = document.createElement('div');
  propDisplay.className = 'sg-mb-4 sg-text-sm sg-text-slate-900 dark:sg-text-stone-200';
  propDisplay.setAttribute('data-testid', 'prop-display');
  container.appendChild(propDisplay);

  
  // Chart container
  const chartContainer = document.createElement('div');
  chartContainer.className = 'sg-w-full sg-h-[400px]';
  chartContainer.setAttribute('data-testid', 'chart-container');
  container.appendChild(chartContainer);
  
  // SVG for chart
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = '100%';
  svg.style.height = '400px';
  chartContainer.appendChild(svg);
  

  // Helper to show the data table modal
  function showDataModal() {
    if (!data || data.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'sg-widget-root';

    const overlay = document.createElement('div');
    overlay.className = 'sg-fixed sg-inset-0 sg-bg-black/50 sg-flex sg-justify-center sg-items-center sg-z-[9999]';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-200 sg-border sg-border-slate-200 dark:sg-border-stone-700 sg-rounded-xl sg-p-6 sg-w-[90%] sg-max-w-4xl sg-max-h-[85vh] sg-overflow-y-auto sg-shadow-2xl sg-relative';

    const header = document.createElement('div');
    header.className = 'sg-flex sg-justify-between sg-items-center sg-mb-4 sg-border-b sg-border-stone-300 dark:sg-border-stone-600 sg-pb-2';
    
    const title = document.createElement('h3');
    title.className = 'sg-m-0 sg-text-xl';
    title.textContent = `Data: ${currentDataset}`;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sg-bg-transparent sg-border-none sg-text-2xl sg-leading-none sg-cursor-pointer sg-text-stone-500 hover:sg-text-slate-900 dark:hover:sg-text-stone-200';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => el.removeChild(wrapper);
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    modalContent.appendChild(header);

    const tableContainer = document.createElement('div');
    tableContainer.style.overflowX = 'auto';

    const table = document.createElement('table');
    table.className = 'sg-w-full sg-text-sm sg-text-left sg-border-collapse';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const columns = variables.length > 0 ? variables : ['value'];

    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(row => {
      const tr = document.createElement('tr');
      columns.forEach(col => {
        const td = document.createElement('td');
        td.textContent = typeof row === 'object' ? row[col] : row;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    modalContent.appendChild(tableContainer);
    overlay.appendChild(modalContent);
    
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        el.removeChild(wrapper);
      }
    };

    wrapper.appendChild(overlay);
    el.appendChild(wrapper);
  }

  // Calculate percentile
  function getPercentile(arr, p) {
    if (arr.length === 0) return 0;
    if (p <= 0) return arr[0];
    if (p >= 100) return arr[arr.length - 1];

    const index = (arr.length - 1) * p / 100;
    const lower = Math.floor(index);
    const upper = lower + 1;
    const weight = index % 1;

    if (upper >= arr.length) return arr[lower];
    return arr[lower] * (1 - weight) + arr[upper] * weight;
  }

  // Helper to show univariate stats modal
  function showStatsModal() {
    if (!data || data.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'sg-widget-root';

    const overlay = document.createElement('div');
    overlay.className = 'sg-fixed sg-inset-0 sg-bg-black/50 sg-flex sg-justify-center sg-items-center sg-z-[9999]';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-200 sg-border sg-border-slate-200 dark:sg-border-stone-700 sg-rounded-xl sg-p-6 sg-w-[90%] sg-max-w-4xl sg-max-h-[85vh] sg-overflow-y-auto sg-shadow-2xl sg-relative';

    const header = document.createElement('div');
    header.className = 'sg-flex sg-justify-between sg-items-center sg-mb-4 sg-border-b sg-border-stone-300 dark:sg-border-stone-600 sg-pb-2';
    
    const title = document.createElement('h3');
    title.className = 'sg-m-0 sg-text-xl';
    title.textContent = `Univariate Statistics: ${currentDataset}`;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sg-bg-transparent sg-border-none sg-text-2xl sg-leading-none sg-cursor-pointer sg-text-stone-500 hover:sg-text-slate-900 dark:hover:sg-text-stone-200';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => el.removeChild(wrapper);
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    modalContent.appendChild(header);

    const tableContainer = document.createElement('div');
    tableContainer.style.overflowX = 'auto';

    const table = document.createElement('table');
    table.className = 'sg-w-full sg-text-sm sg-text-left sg-border-collapse';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const statCols = ['Variable', 'Cases', 'Mean', 'SD', 'Min', 'LQ', 'Median', 'UQ', 'Max'];
    statCols.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    variables.forEach(v => {
      const varData = data.map(row => parseFloat(row[v])).filter(val => !isNaN(val));
      if (varData.length === 0) return;

      const sortedData = [...varData].sort((a, b) => a - b);
      const n = varData.length;
      const m = mean(varData);
      const sd = sampleSD(varData);
      const mn = sortedData[0];
      const mx = sortedData[n - 1];
      const lq = getPercentile(sortedData, 25);
      const median = getPercentile(sortedData, 50);
      const uq = getPercentile(sortedData, 75);

      const tr = document.createElement('tr');
      
      const tdVar = document.createElement('td');
      tdVar.textContent = v;
      tr.appendChild(tdVar);

      const tdN = document.createElement('td');
      tdN.textContent = n;
      tr.appendChild(tdN);

      [m, sd, mn, lq, median, uq, mx].forEach(val => {
        const td = document.createElement('td');
        td.textContent = Number.isInteger(val) ? val : val.toFixed(2);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);

    modalContent.appendChild(tableContainer);
    overlay.appendChild(modalContent);
    
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        el.removeChild(wrapper);
      }
    };

    wrapper.appendChild(overlay);
    el.appendChild(wrapper);
  }

  /**
   * Load a dataset by name
   */
  function loadDataset(name) {
    data = datasets[name] || [];
    currentDataset = name;
    
    // Filter to only numeric variables
    if (data.length > 0) {
      const allVars = Object.keys(data[0]);
      variables = allVars.filter(v => {
        const val = data[0][v];
        return typeof val === 'number' || !isNaN(parseFloat(val));
      });
    } else {
      variables = [];
    }
    
    // Set default variable if not set or doesn't exist in new dataset
    if ((!variable || !variables.includes(variable)) && variables.length > 0) {
      variable = variables[0];
    }
    
    updateVariableSelector();
    const firstVar = variables[0];
    const values = firstVar ? data.map(row => parseFloat(row[firstVar])).filter(v => !isNaN(v)) : [];

    if (values.length > 0) {
      const dataMin = Math.min(...values);
      const dataMax = Math.max(...values);
      const range = dataMax - dataMin;
      if (lo === null) lo = dataMin + range * 0.25;
      if (hi === null) hi = dataMax - range * 0.25;
      loInput.value = lo.toFixed(5).replace(/\.?0+$/, '');
      hiInput.value = hi.toFixed(5).replace(/\.?0+$/, '');
    }

    updateRestrictions();
  }
  
  /**
   * Update variable selector options
   */
  function updateVariableSelector() {
    // Clear existing options
    varSelect.innerHTML = '';
    
    variables.forEach(v => {
      const option = document.createElement('option');
      option.value = v;
      option.textContent = v;
      if (v === variable) option.selected = true;
      varSelect.appendChild(option);
    });
  }
  

  /**
   * Get restricted dataset
   */
  function getRestrictedData() {
    const result = data.filter(row => {

      return restrictions.every(r => {
        const val = parseFloat(row[r.variable]);
        if (isNaN(val)) {
          return false;
        }
        if (r.use_min && val < r.min) {
          return false;
        }
        if (r.use_max && val > r.max) {
          return false;
        }
        return true;
      });
    });
    return result;
  }
  
  /**
   * Extract values for histogram
   */
  function getValues(dataset) {
    return dataset
      .map(row => parseFloat(row[variable]))
      .filter(v => !isNaN(v));
  }
  
  /**
   * Compute histogram bins
   */
  function computeHistogram(values, numBins, domain) {
    if (values.length === 0 || numBins <= 0) return [];
    
    const [min, max] = domain;
    const binWidth = (max - min) / numBins;
    
    const binCounts = new Array(numBins).fill(0);
    
    for (const val of values) {
      if (val < min || val > max) continue;
      let binIndex = Math.floor((val - min) / binWidth);
      if (binIndex >= numBins) binIndex = numBins - 1;
      if (binIndex < 0) binIndex = 0;
      binCounts[binIndex]++;
    }
    
    const binsData = [];
    for (let i = 0; i < numBins; i++) {
      const binStart = min + i * binWidth;
      const binEnd = binStart + binWidth;
      binsData.push({
        start: binStart,
        end: binEnd,
        mid: (binStart + binEnd) / 2,
        count: binCounts[i],
        density: binCounts[i] / (values.length * binWidth)
      });
    }
    
    return binsData;
  }
  
  /**
   * Update stats display
   */
  function updateStats() {
    const fullValues = getValues(data);
    const restrictedValues = getValues(getRestrictedData());
    
    if (fullValues.length === 0) {
      stats.textContent = 'No data';
      return;
    }
    
    const fullMean = mean(fullValues);
    const fullSD = sampleSD(fullValues);
    
    let text = `Full: n=${fullValues.length}, mean=${fullMean.toFixed(2)}, SD=${fullSD.toFixed(2)}`;
    
    if (restrictedValues.length > 0 && restrictedValues.length !== fullValues.length) {
      const restMean = mean(restrictedValues);
      const restSD = sampleSD(restrictedValues);
      text += ` | Restricted: n=${restrictedValues.length}, mean=${restMean.toFixed(2)}, SD=${restSD.toFixed(2)}`;
    }
    
    stats.textContent = text;

    if (propDisplay && lo !== null && hi !== null) {
      const getHighlightedCount = (vals) => vals.filter(v => v >= lo && v <= hi).length;
      
      const fullHigh = getHighlightedCount(fullValues);
      const fullProp = fullValues.length > 0 ? fullHigh / fullValues.length : 0;
      let propText = advanced 
        ? `Selected area (Full): ${(fullProp * 100).toFixed(2)}% (${fullHigh}/${fullValues.length} values)`
        : `Selected area: ${(fullProp * 100).toFixed(2)}% (${fullHigh}/${fullValues.length} values)`;

      if (advanced && restrictedValues.length > 0 && restrictedValues.length !== fullValues.length) {
        const restHigh = getHighlightedCount(restrictedValues);
        const restProp = restrictedValues.length > 0 ? restHigh / restrictedValues.length : 0;
        propText += ` | Selected area (Restricted): ${(restProp * 100).toFixed(2)}% (${restHigh}/${restrictedValues.length} values)`;
      }
      
      propDisplay.textContent = propText;
    }
    
    if (!advanced) {
      stats.style.display = 'none';
    } else {
      stats.style.display = 'block';
    }
  }
  
  /**
   * Render histograms
   */
  function renderChart() {
    // Clear SVG
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    const fullValues = getValues(data);
    const restrictedValues = getValues(getRestrictedData());
    
    if (fullValues.length === 0) {
      return;
    }
    
    // Get dimensions
    const containerRect = chartContainer.getBoundingClientRect();
    const width = containerRect.width || 800; // fallback if 0
    const height = 400; // fixed height as requested
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Compute domain
    const allValues = fullValues;
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.05 || 1;
    const domain = [min - padding, max + padding];
    
    // Compute histograms
    const fullBins = computeHistogram(fullValues, bins, domain);
    const restrictedBins = restrictedValues.length > 0 
      ? computeHistogram(restrictedValues, bins, domain) 
      : [];
    
    // Find max count for y-scale
    const maxCount = Math.max(
      ...fullBins.map(b => b.count),
      ...restrictedBins.map(b => b.count),
      1
    );
    
    // Scales
    const xScale = (value) => margin.left + ((value - domain[0]) / (domain[1] - domain[0])) * chartWidth;
    const yScale = (count) => margin.top + chartHeight - (count / maxCount) * chartHeight;
    
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Get CSS vars for colors
    const primaryColor = getCSSVar('--widget-primary', container) || '#0ea5e9';
    const borderColor = getCSSVar('--widget-border-dark', container) || '#44403c';
    const accentColor = getCSSVar('--widget-accent', container) || '#ea580c';
    const chartLineColor = getCSSVar('--widget-chart-line', container) || '#dc2626';
    const textColor = getCSSVar('--widget-text-primary', container) || '#000000';
    
    // Draw full histogram
    if (showFull) {
      fullBins.forEach(bin => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', xScale(bin.start));
        rect.setAttribute('y', yScale(bin.count));
        rect.setAttribute('width', Math.max(1, xScale(bin.end) - xScale(bin.start) - 1));
        rect.setAttribute('height', margin.top + chartHeight - yScale(bin.count));
        const isHighlighted = lo !== null && hi !== null && bin.mid >= lo && bin.mid <= hi;
        rect.setAttribute('fill', isHighlighted ? accentColor : primaryColor);
        rect.setAttribute('fill-opacity', '0.6');
        rect.setAttribute('stroke', borderColor);
        rect.setAttribute('stroke-width', '1');
        rect.setAttribute('data-testid', 'full-bar');
        chartGroup.appendChild(rect);
      });
    }
    
    // Draw restricted histogram - on top
    if (showRestricted && restrictedBins.length > 0) {
      restrictedBins.forEach(bin => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', xScale(bin.start));
        rect.setAttribute('y', yScale(bin.count));
        rect.setAttribute('width', Math.max(1, xScale(bin.end) - xScale(bin.start) - 1));
        rect.setAttribute('height', margin.top + chartHeight - yScale(bin.count));
        const isHighlighted = lo !== null && hi !== null && bin.mid >= lo && bin.mid <= hi;
        rect.setAttribute('fill', isHighlighted ? '#d946ef' : '#22c55e'); // Magenta when highlighted, green otherwise
        rect.setAttribute('fill-opacity', '0.6');
        rect.setAttribute('stroke', borderColor);
        rect.setAttribute('stroke-width', '1');
        rect.setAttribute('data-testid', 'restricted-bar');
        chartGroup.appendChild(rect);
      });
    }
    
    // Draw normal curve overlay
    if (showNormal) {
      const mu = mean(fullValues);
      const sigma = sampleSD(fullValues);
      const n = fullValues.length;
      const binWidth = (domain[1] - domain[0]) / bins;
      const scaleFactor = n * binWidth;
      
      const points = [];
      const numPoints = 200;
      for (let i = 0; i <= numPoints; i++) {
        const x = domain[0] + (i / numPoints) * (domain[1] - domain[0]);
        const density = normalPDF(x, mu, sigma);
        const y = density * scaleFactor;
        points.push({ x, y });
      }
      
      let pathD = '';
      points.forEach((p, i) => {
        const px = xScale(p.x);
        const py = yScale(p.y);
        pathD += (i === 0 ? 'M' : 'L') + px + ',' + py;
      });
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathD);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', chartLineColor);
      path.setAttribute('stroke-width', '2');
      path.setAttribute('data-testid', 'normal-curve');
      chartGroup.appendChild(path);
    }
    
    // Draw axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', margin.top + chartHeight);
    xAxis.setAttribute('x2', margin.left + chartWidth);
    xAxis.setAttribute('y2', margin.top + chartHeight);
    xAxis.setAttribute('stroke', borderColor);
    xAxis.setAttribute('stroke-width', '1');
    chartGroup.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', margin.top + chartHeight);
    yAxis.setAttribute('stroke', borderColor);
    yAxis.setAttribute('stroke-width', '1');
    chartGroup.appendChild(yAxis);
    
    // Axis labels
    const xTicks = [domain[0], (domain[0] + domain[1]) / 2, domain[1]];
    xTicks.forEach(tick => {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', xScale(tick));
      label.setAttribute('y', margin.top + chartHeight + 20);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', textColor);
      label.setAttribute('font-size', '12px');
      label.textContent = tick.toFixed(1);
      chartGroup.appendChild(label);
    });
    
    // Axis title
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', margin.left + chartWidth / 2);
    xLabel.setAttribute('y', margin.top + chartHeight + 40);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('fill', textColor);
    xLabel.setAttribute('font-size', '14px');
    xLabel.textContent = variable || '';
    chartGroup.appendChild(xLabel);
    
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', margin.left - 45);
    yLabel.setAttribute('y', margin.top + chartHeight / 2);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('fill', textColor);
    yLabel.setAttribute('font-size', '14px');
    yLabel.setAttribute('transform', `rotate(-90, ${margin.left - 45}, ${margin.top + chartHeight / 2})`);
    yLabel.textContent = 'Count';
    chartGroup.appendChild(yLabel);
    
    svg.appendChild(chartGroup);
  }
  
  /**
   * Update restrictions UI
   */
  function updateRestrictions() {
    // Clear existing rows
    while (restrictionsRows.firstChild) {
      restrictionsRows.removeChild(restrictionsRows.firstChild);
    }
    
    restrictions.forEach((r, index) => {
      const row = document.createElement('div');
      row.className = 'sg-mb-4 sg-flex sg-flex-wrap sg-gap-4 sg-items-center';
      row.style.marginBottom = '0.5rem';
      row.setAttribute('data-testid', `restriction-row-${index}`);
      
      // Variable selector
      const varSelect = document.createElement('select');
      varSelect.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
      varSelect.style.fontSize = '12px';
      varSelect.setAttribute('data-testid', `restriction-var-${index}`);
      variables.forEach(v => {
        const option = document.createElement('option');
        option.value = v;
        option.textContent = v;
        if (v === r.variable) option.selected = true;
        varSelect.appendChild(option);
      });
      varSelect.addEventListener('change', () => {
        r.variable = varSelect.value;
        model.set('restrictions', restrictions);
        renderChart();
        updateStats();
      });
      row.appendChild(varSelect);
      
      // Min checkbox
      const minGroup = document.createElement('div');
      minGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
      const minCheckbox = document.createElement('input');
      minCheckbox.type = 'checkbox';
      minCheckbox.className = 'sg-w-4 sg-h-4 sg-accent-blue-600 sg-cursor-pointer sg-rounded sg-border-slate-300 dark:sg-border-stone-600';
      minCheckbox.checked = r.use_min;
      minCheckbox.setAttribute('data-testid', `restriction-use-min-${index}`);
      minCheckbox.addEventListener('change', () => {
        r.use_min = minCheckbox.checked;
        model.set('restrictions', restrictions);
        renderChart();
        updateStats();
      });
      minGroup.appendChild(minCheckbox);
      
      const minLabel = document.createElement('label');
      minLabel.textContent = 'min:';
      minLabel.style.fontSize = '12px';
      minGroup.appendChild(minLabel);
      row.appendChild(minGroup);
      
      const minInput = document.createElement('input');
      minInput.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
      minInput.type = 'number';
      minInput.value = r.min;
      minInput.style.width = '80px';
      minInput.style.fontSize = '12px';
      minInput.setAttribute('data-testid', `restriction-min-${index}`);
      minInput.addEventListener('input', () => {
        r.min = parseFloat(minInput.value);
        model.set('restrictions', restrictions);
        renderChart();
        updateStats();
      });
      row.appendChild(minInput);
      
      // Max checkbox
      const maxGroup = document.createElement('div');
      maxGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
      const maxCheckbox = document.createElement('input');
      maxCheckbox.type = 'checkbox';
      maxCheckbox.className = 'sg-w-4 sg-h-4 sg-accent-blue-600 sg-cursor-pointer sg-rounded sg-border-slate-300 dark:sg-border-stone-600';
      maxCheckbox.checked = r.use_max;
      maxCheckbox.setAttribute('data-testid', `restriction-use-max-${index}`);
      maxCheckbox.addEventListener('change', () => {
        r.use_max = maxCheckbox.checked;
        model.set('restrictions', restrictions);
        renderChart();
        updateStats();
      });
      maxGroup.appendChild(maxCheckbox);
      
      const maxLabel = document.createElement('label');
      maxLabel.textContent = 'max:';
      maxLabel.style.fontSize = '12px';
      maxGroup.appendChild(maxLabel);
      row.appendChild(maxGroup);
      
      const maxInput = document.createElement('input');
      maxInput.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
      maxInput.type = 'number';
      maxInput.value = r.max;
      maxInput.style.width = '80px';
      maxInput.style.fontSize = '12px';
      maxInput.setAttribute('data-testid', `restriction-max-${index}`);
      maxInput.addEventListener('input', () => {
        r.max = parseFloat(maxInput.value);
        model.set('restrictions', restrictions);
        renderChart();
        updateStats();
      });
      row.appendChild(maxInput);
      
      // Remove button
      const removeButton = document.createElement('button');
      removeButton.className = 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950';
      removeButton.textContent = '×';
      removeButton.style.padding = '2px 8px';
      removeButton.style.fontWeight = 'bold';
      removeButton.setAttribute('data-testid', `restriction-remove-${index}`);
      removeButton.addEventListener('click', () => {
        restrictions.splice(index, 1);
        model.set('restrictions', restrictions);
        updateRestrictions();
        renderChart();
        updateStats();
      });
      row.appendChild(removeButton);
      
      restrictionsRows.appendChild(row);
    });
  }
  
  // Event handlers
  if (datasetSelect) {
    datasetSelect.addEventListener('change', () => {
      const selectedDataset = datasetSelect.value;
      loadDataset(selectedDataset);
      renderChart();
      updateStats();
    });
  }
  
  varSelect.addEventListener('change', () => {
    variable = varSelect.value;
    model.set('variable', variable);
    const values = data.map(row => parseFloat(row[variable])).filter(v => !isNaN(v));
    
    if (values.length > 0) {
      const dataMin = Math.min(...values);
      const dataMax = Math.max(...values);
      const range = dataMax - dataMin;
      if (lo === null) lo = dataMin + range * 0.25;
      if (hi === null) hi = dataMax - range * 0.25;
      loInput.value = lo.toFixed(5).replace(/\.?0+$/, '');
      hiInput.value = hi.toFixed(5).replace(/\.?0+$/, '');
    }

    renderChart();
    updateStats();
  });
  

  loInput.addEventListener('input', () => {
    const newLo = parseFloat(loInput.value);
    if (!isNaN(newLo)) {
      lo = newLo;
      if (hi !== null && lo > hi) {
        hi = lo;
        hiInput.value = hi.toString();
        model.set('hi', hi);
      }
      model.set('lo', lo);
      renderChart();
      updateStats();
    }
  });

  hiInput.addEventListener('input', () => {
    const newHi = parseFloat(hiInput.value);
    if (!isNaN(newHi)) {
      hi = newHi;
      if (lo !== null && hi < lo) {
        lo = hi;
        loInput.value = lo.toString();
        model.set('lo', lo);
      }
      model.set('hi', hi);
      renderChart();
      updateStats();
    }
  });

  listDataBtn.addEventListener('click', showDataModal);
  statsBtn.addEventListener('click', showStatsModal);

  binsInput.addEventListener('input', () => {
    bins = parseInt(binsInput.value, 10);
    if (bins < 5) bins = 5;
    if (bins > 100) bins = 100;
    binsInput.value = bins;
    model.set('bins', bins);
    renderChart();
  });
  
  fullCheckbox.addEventListener('change', () => {
    showFull = fullCheckbox.checked;
    model.set('show_full', showFull);
    renderChart();
  });
  
  restCheckbox.addEventListener('change', () => {
    showRestricted = restCheckbox.checked;
    model.set('show_restricted', showRestricted);
    renderChart();
  });
  
  normCheckbox.addEventListener('change', () => {
    showNormal = normCheckbox.checked;
    model.set('show_normal', showNormal);
    renderChart();
  });
  
  clearButton.addEventListener('click', () => {
    restrictions = [];
    model.set('restrictions', restrictions);
    updateRestrictions();
    renderChart();
    updateStats();
  });
  
  addRestrictionButton.addEventListener('click', () => {
    if (variables.length === 0) return;
    
    // Find min/max for the first variable
    const firstVar = variables[0];
    const values = data.map(row => parseFloat(row[firstVar])).filter(v => !isNaN(v));
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    restrictions.push({
      variable: firstVar,
      use_min: false,
      min: min,
      use_max: false,
      max: max
    });
    model.set('restrictions', restrictions);
    updateRestrictions();
    renderChart();
    updateStats();
  });
  
  el.appendChild(container);
  
  // Initial load
  loadDataset(currentDataset);
  updateRestrictions();
  renderChart();
  updateStats();
  
  // Handle resize (width only) to avoid infinite loops
  let lastWidth = chartContainer.clientWidth;
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const newWidth = entry.contentRect.width;
      if (newWidth > 0 && newWidth !== lastWidth) {
        lastWidth = newWidth;
        renderChart();
      }
    }
  });
  resizeObserver.observe(chartContainer);
  
  // Cleanup
  return () => {
    resizeObserver.disconnect();
    cleanupDarkMode();
  };
}

export default { render };
