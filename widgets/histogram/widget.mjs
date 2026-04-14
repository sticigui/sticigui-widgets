/**
 * Histogram Widget
 * 
 * Renders a histogram of a real dataset with user-selectable highlight region.
 * Displays the proportion of data in the highlighted region.
 */

import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { bin } from 'd3-array';
import { fetchData } from '../../src/utils/fetchData.mjs';
import styles from './styles.css';

// Inject styles into document
function injectStyles() {
  if (!document.getElementById('histogram-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'histogram-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
}

// Helper to get CSS variable value
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Render the histogram with highlighted region
 */
function renderHistogram(svg, width, height, data, numBins, lo, hi, xLabel) {
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Clear previous content
  svg.selectAll('*').remove();

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create base scales with nicely rounded ends to accommodate bins
  const xMin = Math.min(...data);
  const xMax = Math.max(...data);
  
  const xScale = scaleLinear()
    .domain([xMin, xMax])
    .nice(numBins)
    .range([0, innerWidth]);

  // Compute bins explicitly against the x-scale
  // To force exactly `numBins` bins, we calculate the thresholds manually
  const domainMin = xScale.domain()[0];
  const domainMax = xScale.domain()[1];
  const step = (domainMax - domainMin) / numBins;
  const thresholds = Array.from({length: numBins - 1}, (_, i) => domainMin + (i + 1) * step);

  const binGenerator = bin()
    .domain(xScale.domain())
    .thresholds(thresholds);
  
  const bins = binGenerator(data);

  const yMax = Math.max(...bins.map(b => b.length));
  const yScale = scaleLinear()
    .domain([0, yMax])
    .nice()
    .range([innerHeight, 0]);

  // Create axes
  const xAxis = axisBottom(xScale)
    .ticks(8);
  
  const yAxis = axisLeft(yScale).ticks(6);

  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis)
    .style('color', getCSSVar('--widget-text-primary'))
    .selectAll('text')
    .style('fill', getCSSVar('--widget-text-primary'));

  g.append('g')
    .call(yAxis)
    .style('color', getCSSVar('--widget-text-primary'))
    .selectAll('text')
    .style('fill', getCSSVar('--widget-text-primary'));

  // Axis labels
  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 40)
    .attr('text-anchor', 'middle')
    .style('fill', getCSSVar('--widget-text-primary'))
    .style('font-size', '12px')
    .text(xLabel || 'Value');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -45)
    .attr('text-anchor', 'middle')
    .style('fill', getCSSVar('--widget-text-primary'))
    .style('font-size', '12px')
    .text('Frequency');

  // Draw bars
  g.selectAll('.bar')
    .data(bins)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.x0))
    .attr('y', d => yScale(d.length))
    .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
    .attr('height', d => innerHeight - yScale(d.length))
    .style('fill', d => {
      // Check if bin overlaps with highlight range
      const binMid = (d.x0 + d.x1) / 2;
      return binMid >= lo && binMid <= hi
        ? getCSSVar('--widget-accent')
        : getCSSVar('--widget-primary');
    })
    .style('stroke', getCSSVar('--widget-border-dark'))
    .style('stroke-width', '0.5');
}

/**
 * Calculate proportion of data in range
 */
function calculateProportion(data, lo, hi) {
  const inRange = data.filter(d => d >= lo && d <= hi).length;
  return inRange / data.length;
}

/**
 * Main render function
 */
async function render({ model, el }) {
  // Inject CSS
  injectStyles();
  
  // Load data
  const dataSpec = model.get('data') || '../../public-data/gravity.json';
  const datasets = await fetchData(dataSpec);
  
  // State for selected dataset and variable
  let datasetNames = Object.keys(datasets);
  let selectedDatasetName = datasetNames[0];
  let selectedDataset = datasets[selectedDatasetName];
  
  let variables = getNumericVariables(selectedDataset);
  let selectedVariable = variables[0];
  let data = getVariableData(selectedDataset, selectedVariable);
  
  // Get initial state
  let title = model.get('title');
  let numBins = model.get('bins') || 20;
  let lo = model.get('lo') || -0.0001;
  let hi = model.get('hi') || 0.0001;

  // Extract numeric keys from a dataset for the Variable dropdown
  function getNumericVariables(dataset) {
    if (!dataset || dataset.length === 0) return [];
    const firstRow = dataset[0];
    if (typeof firstRow === 'number') return ['value'];
    
    // It's an array of objects
    return Object.keys(firstRow).filter(key => {
      // Check if mostly numbers
      return typeof firstRow[key] === 'number' || !isNaN(parseFloat(firstRow[key]));
    });
  }

  // Helper to extract a 1D array of numbers for the selected variable
  function getVariableData(dataset, variable) {
    if (!dataset || dataset.length === 0) return [];
    if (variable === 'value' && typeof dataset[0] !== 'object') {
      return dataset.map(d => parseFloat(d)).filter(n => !isNaN(n));
    }
    return dataset.map(d => parseFloat(d[variable])).filter(n => !isNaN(n));
  }

  // Container setup
  const container = document.createElement('div');
  container.className = 'widget-container';

  // Title (optional)
  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.className = 'widget-title';
    titleEl.textContent = title;
    container.appendChild(titleEl);
  }

  // Helper to determine an appropriate step size for inputs based on the data range
  function getOptimalStep(dataArray) {
    if (!dataArray || dataArray.length === 0) return '0.1';
    const range = Math.max(...dataArray) - Math.min(...dataArray);
    if (range === 0) return '0.1';
    const step = Math.pow(10, Math.floor(Math.log10(range)) - 2);
    // Limit precision to avoid floating point representation issues in the input step attribute
    return step.toPrecision(1).replace(/\.0+e/, 'e');
  }

  // Create controls container
  const controls = document.createElement('div');
  controls.className = 'widget-controls';

  // Data dropdown (hide if only one 'default' dataset)
  const dataGroup = document.createElement('div');
  dataGroup.className = 'widget-input-group';
  dataGroup.style.display = (datasetNames.length === 1 && datasetNames[0] === 'default') ? 'none' : 'flex';
  const dataLabel = document.createElement('label');
  dataLabel.className = 'widget-label';
  dataLabel.textContent = 'Data:';
  const dataSelect = document.createElement('select');
  dataSelect.className = 'widget-input';
  datasetNames.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    dataSelect.appendChild(opt);
  });
  dataSelect.value = selectedDatasetName;
  dataGroup.appendChild(dataLabel);
  dataGroup.appendChild(dataSelect);

  // Variable dropdown (hide if no variables or just 'value')
  const varGroup = document.createElement('div');
  varGroup.className = 'widget-input-group';
  const varLabel = document.createElement('label');
  varLabel.className = 'widget-label';
  varLabel.textContent = 'Variable:';
  const varSelect = document.createElement('select');
  varSelect.className = 'widget-input';
  
  function populateVariableDropdown() {
    varSelect.innerHTML = '';
    variables.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      varSelect.appendChild(opt);
    });
    varSelect.value = selectedVariable;
    // hide if just the implicit 'value'
    varGroup.style.display = (variables.length === 1 && variables[0] === 'value') ? 'none' : 'flex';
  }
  populateVariableDropdown();
  varGroup.appendChild(varLabel);
  varGroup.appendChild(varSelect);

  // Bins input
  const binsGroup = document.createElement('div');
  binsGroup.className = 'widget-input-group';
  const binsLabel = document.createElement('label');
  binsLabel.className = 'widget-label';
  binsLabel.textContent = 'Bins:';
  const binsInput = document.createElement('input');
  binsInput.className = 'widget-input';
  binsInput.type = 'number';
  binsInput.value = numBins;
  binsInput.min = '5';
  binsInput.max = '50';
  binsInput.step = '1';
  binsInput.setAttribute('aria-label', 'Number of bins');
  binsGroup.appendChild(binsLabel);
  binsGroup.appendChild(binsInput);

  // Lo input
  const loGroup = document.createElement('div');
  loGroup.className = 'widget-input-group';
  const loLabel = document.createElement('label');
  loLabel.className = 'widget-label';
  loLabel.textContent = 'Area from:';
  const loInput = document.createElement('input');
  loInput.className = 'widget-input';
  loInput.type = 'number';
  loInput.value = lo;
  loInput.step = getOptimalStep(data);
  loInput.setAttribute('aria-label', 'Area from');
  loGroup.appendChild(loLabel);
  loGroup.appendChild(loInput);

  // Hi input
  const hiGroup = document.createElement('div');
  hiGroup.className = 'widget-input-group';
  const hiLabel = document.createElement('label');
  hiLabel.className = 'widget-label';
  hiLabel.textContent = 'Area to:';
  const hiInput = document.createElement('input');
  hiInput.className = 'widget-input';
  hiInput.type = 'number';
  hiInput.value = hi;
  hiInput.step = getOptimalStep(data);
  hiInput.setAttribute('aria-label', 'Area to');
  hiGroup.appendChild(hiLabel);
  hiGroup.appendChild(hiInput);

  // List Data button
  const listDataBtn = document.createElement('button');
  listDataBtn.className = 'widget-button widget-button-secondary';
  listDataBtn.textContent = 'List Data';

  // Univariate Stats button
  const statsBtn = document.createElement('button');
  statsBtn.className = 'widget-button widget-button-secondary';
  statsBtn.textContent = 'Univariate Stats';

  controls.appendChild(dataGroup);
  controls.appendChild(varGroup);
  controls.appendChild(binsGroup);
  controls.appendChild(loGroup);
  controls.appendChild(hiGroup);
  controls.appendChild(listDataBtn);
  controls.appendChild(statsBtn);
  container.appendChild(controls);

  // Stats display
  const statsDisplay = document.createElement('div');
  statsDisplay.className = 'widget-display';
  statsDisplay.style.fontWeight = 'normal';
  statsDisplay.style.fontSize = '0.9em';
  statsDisplay.setAttribute('data-testid', 'stats-display');
  container.appendChild(statsDisplay);

  // Proportion display
  const propDisplay = document.createElement('div');
  propDisplay.className = 'widget-display';
  propDisplay.setAttribute('data-testid', 'prop-display');
  container.appendChild(propDisplay);

  // SVG container
  const svgContainer = document.createElement('div');
  svgContainer.className = 'widget-chart-container';
  container.appendChild(svgContainer);

  const svg = select(svgContainer)
    .append('svg')
    .attr('width', '100%')
    .attr('height', 400);

  // Update display
  function update() {
    const width = svgContainer.clientWidth;
    const height = 400;

    const xLabel = model.get('xLabel') || selectedVariable;

    renderHistogram(svg, width, height, data, numBins, lo, hi, xLabel);

    // Helper to format numbers reasonably
    const formatNum = (n) => {
      if (Math.abs(n) >= 10000 || (Math.abs(n) < 0.01 && n !== 0)) {
        return n.toExponential(2);
      }
      return Number.isInteger(n) ? n.toString() : n.toFixed(3).replace(/\.?0+$/, '');
    };

    const prop = calculateProportion(data, lo, hi);
    const count = Math.round(prop * data.length);
    propDisplay.textContent = `Selected area: ${(prop * 100).toFixed(2)}% (${count}/${data.length} values)`;

    if (data.length > 0) {
      const mean = data.reduce((a, b) => a + b, 0) / data.length;
      const sd = Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length);
      statsDisplay.textContent = `N = ${data.length}, Mean = ${formatNum(mean)}, SD = ${formatNum(sd)}`;
    } else {
      statsDisplay.textContent = 'No data';
    }
  }

  // Helper to show the data table modal
  function showDataModal() {
    if (!selectedDataset || selectedDataset.length === 0) return;

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'widget-modal-overlay';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'widget-modal-content';

    // Header
    const header = document.createElement('div');
    header.className = 'widget-modal-header';
    
    const title = document.createElement('h3');
    title.className = 'widget-modal-title';
    title.textContent = `Data: ${selectedDatasetName}`;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'widget-modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => document.body.removeChild(overlay);
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    modalContent.appendChild(header);

    // Table container (for scroll)
    const tableContainer = document.createElement('div');
    tableContainer.style.overflowX = 'auto';

    // Table
    const table = document.createElement('table');
    table.className = 'widget-table';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Determine columns
    const firstRow = selectedDataset[0];
    const columns = typeof firstRow === 'object' ? Object.keys(firstRow) : ['value'];

    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    selectedDataset.forEach(row => {
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
    
    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    };

    document.body.appendChild(overlay);
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
    if (!selectedDataset || selectedDataset.length === 0) return;

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'widget-modal-overlay';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'widget-modal-content';

    // Header
    const header = document.createElement('div');
    header.className = 'widget-modal-header';
    
    const title = document.createElement('h3');
    title.className = 'widget-modal-title';
    title.textContent = `Univariate Statistics: ${selectedDatasetName}`;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'widget-modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => document.body.removeChild(overlay);
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    modalContent.appendChild(header);

    // Table container
    const tableContainer = document.createElement('div');
    tableContainer.style.overflowX = 'auto';

    // Table
    const table = document.createElement('table');
    table.className = 'widget-table';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Columns
    const statCols = ['Variable', 'Cases', 'Mean', 'SD', 'Min', 'LQ', 'Median', 'UQ', 'Max'];
    statCols.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    // Calculate stats for all numeric variables
    variables.forEach(variable => {
      const varData = getVariableData(selectedDataset, variable);
      if (varData.length === 0) return;

      const sortedData = [...varData].sort((a, b) => a - b);
      const n = varData.length;
      const mean = varData.reduce((a, b) => a + b, 0) / n;
      const sd = Math.sqrt(varData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n);
      const min = sortedData[0];
      const max = sortedData[n - 1];
      const lq = getPercentile(sortedData, 25);
      const median = getPercentile(sortedData, 50);
      const uq = getPercentile(sortedData, 75);

      const tr = document.createElement('tr');
      
      const tdVar = document.createElement('td');
      tdVar.textContent = variable;
      tr.appendChild(tdVar);

      const tdN = document.createElement('td');
      tdN.textContent = n;
      tr.appendChild(tdN);

      [mean, sd, min, lq, median, uq, max].forEach(val => {
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
    
    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    };

    document.body.appendChild(overlay);
  }

  // Event listeners
  dataSelect.addEventListener('change', () => {
    selectedDatasetName = dataSelect.value;
    selectedDataset = datasets[selectedDatasetName];
    
    variables = getNumericVariables(selectedDataset);
    selectedVariable = variables.includes(selectedVariable) ? selectedVariable : variables[0];
    populateVariableDropdown();
    
    data = getVariableData(selectedDataset, selectedVariable);
    
    // reset bounds
    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);
    const range = dataMax - dataMin;
    lo = dataMin + range * 0.25;
    hi = dataMax - range * 0.25;
    
    const newStep = getOptimalStep(data);
    loInput.step = newStep;
    hiInput.step = newStep;
    
    loInput.value = lo.toFixed(5).replace(/\.?0+$/, '');
    hiInput.value = hi.toFixed(5).replace(/\.?0+$/, '');
    
    update();
  });

  varSelect.addEventListener('change', () => {
    selectedVariable = varSelect.value;
    data = getVariableData(selectedDataset, selectedVariable);
    
    // reset bounds
    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);
    const range = dataMax - dataMin;
    lo = dataMin + range * 0.25;
    hi = dataMax - range * 0.25;
    
    const newStep = getOptimalStep(data);
    loInput.step = newStep;
    hiInput.step = newStep;
    
    loInput.value = lo.toFixed(5).replace(/\.?0+$/, '');
    hiInput.value = hi.toFixed(5).replace(/\.?0+$/, '');
    
    update();
  });

  binsInput.addEventListener('input', () => {
    const newBins = parseInt(binsInput.value);
    if (newBins >= 5 && newBins <= 50) {
      numBins = newBins;
      update();
    }
  });

  loInput.addEventListener('input', () => {
    const newLo = parseFloat(loInput.value);
    if (!isNaN(newLo)) {
      lo = newLo;
      if (lo > hi) {
        hi = lo;
        hiInput.value = hi.toString();
      }
      update();
    }
  });

  hiInput.addEventListener('input', () => {
    const newHi = parseFloat(hiInput.value);
    if (!isNaN(newHi)) {
      hi = newHi;
      if (hi < lo) {
        lo = hi;
        loInput.value = lo.toString();
      }
      update();
    }
  });

  listDataBtn.addEventListener('click', showDataModal);
  statsBtn.addEventListener('click', showStatsModal);

  // Append to element
  el.appendChild(container);

  // Handle resize (width only)
  const resizeObserver = new ResizeObserver(() => {
    update();
  });
  resizeObserver.observe(svgContainer);

  // Initial render
  update();

  // Cleanup
  return () => {
    resizeObserver.disconnect();
  };
}


export default { render };
