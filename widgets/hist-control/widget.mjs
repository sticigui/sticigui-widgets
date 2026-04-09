/**
 * Histogram Control Widget
 * 
 * Two overlaid histograms showing full dataset and filtered subset.
 * Allows filtering by variable restrictions and comparing distributions.
 */

import { fetchData } from '../../src/utils/fetchData.mjs';
import { mean, sampleSD, normalPDF } from '../../src/math/stats-math.mjs';
import styles from './styles.css';

// Inject styles into document
function injectStyles() {
  if (!document.getElementById('hist-control-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'hist-control-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
}

// Helper to get CSS variable value
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Main render function
 */
export async function render({ model, el }) {
  // Inject CSS
  injectStyles();

  // Get model state
  let title = model.get('title');
  const dataSpec = model.get('data');
  let variable = model.get('variable') || null;
  let bins = model.get('bins') || 20;
  let lo = model.get('lo') || null;
  let hi = model.get('hi') || null;
  let showNormal = model.get('show_normal') || false;
  let showFull = model.get('show_full') !== undefined ? model.get('show_full') : true;
  let showRestricted = model.get('show_restricted') !== undefined ? model.get('show_restricted') : true;
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
  container.className = 'widget-container';
  
  // Title (optional)
  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.className = 'widget-title';
    titleEl.textContent = title;
    container.appendChild(titleEl);
  }
  
  // Controls row 1: Dataset and variable selectors
  const controls1 = document.createElement('div');
  controls1.className = 'widget-controls';
  
  // Dataset selector (only show if multiple datasets)
  let datasetSelect;
  if (datasetNames.length > 1) {
    const datasetGroup = document.createElement('div');
    datasetGroup.className = 'widget-input-group';
    const datasetLabel = document.createElement('label');
    datasetLabel.className = 'widget-label';
    datasetLabel.textContent = 'Dataset:';
    datasetSelect = document.createElement('select');
    datasetSelect.className = 'widget-select';
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
  varGroup.className = 'widget-input-group';
  const varLabel = document.createElement('label');
  varLabel.className = 'widget-label';
  varLabel.textContent = 'Variable:';
  const varSelect = document.createElement('select');
  varSelect.className = 'widget-select';
  varSelect.setAttribute('data-testid', 'variable-select');
  varGroup.appendChild(varLabel);
  varGroup.appendChild(varSelect);
  controls1.appendChild(varGroup);
  
  // Bins input
  const binsGroup = document.createElement('div');
  binsGroup.className = 'widget-input-group';
  const binsLabel = document.createElement('label');
  binsLabel.className = 'widget-label';
  binsLabel.textContent = 'Bins:';
  const binsInput = document.createElement('input');
  binsInput.className = 'widget-input';
  binsInput.type = 'number';
  binsInput.min = '5';
  binsInput.max = '100';
  binsInput.value = bins;
  binsInput.setAttribute('data-testid', 'bins-input');
  binsGroup.appendChild(binsLabel);
  binsGroup.appendChild(binsInput);
  controls1.appendChild(binsGroup);
  
  container.appendChild(controls1);
  
  // Controls row 2: Show/hide toggles and normal curve
  const controls2 = document.createElement('div');
  controls2.className = 'widget-controls';
  
  // Helper to create checkbox
  function createCheckbox(id, label, checked, testId) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    checkbox.id = id;
    checkbox.setAttribute('data-testid', testId);
    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
    labelEl.textContent = label;
    const group = document.createElement('div');
    group.className = 'widget-checkbox';
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
  clearButton.className = 'widget-button';
  clearButton.textContent = 'Clear Restrictions';
  clearButton.setAttribute('data-testid', 'clear-restrictions-button');
  controls2.appendChild(clearButton);
  
  container.appendChild(controls2);
  
  // Restrictions container
  const restrictionsContainer = document.createElement('div');
  restrictionsContainer.style.marginBottom = '1rem';
  restrictionsContainer.style.padding = '0.5rem';
  restrictionsContainer.style.border = '1px solid var(--widget-border-light)';
  restrictionsContainer.style.borderRadius = '4px';
  restrictionsContainer.style.background = 'var(--widget-bg-secondary)';
  restrictionsContainer.setAttribute('data-testid', 'restrictions-container');
  
  const restrictionsTitle = document.createElement('div');
  restrictionsTitle.className = 'widget-label';
  restrictionsTitle.style.fontWeight = 'bold';
  restrictionsTitle.style.marginBottom = '0.5rem';
  restrictionsTitle.textContent = 'Restrictions:';
  restrictionsContainer.appendChild(restrictionsTitle);
  
  const restrictionsRows = document.createElement('div');
  restrictionsRows.setAttribute('data-testid', 'restrictions-rows');
  restrictionsContainer.appendChild(restrictionsRows);
  
  // Add restriction button
  const addRestrictionButton = document.createElement('button');
  addRestrictionButton.className = 'widget-button';
  addRestrictionButton.textContent = '+ Add Restriction';
  addRestrictionButton.style.marginTop = '0.5rem';
  addRestrictionButton.setAttribute('data-testid', 'add-restriction-button');
  restrictionsContainer.appendChild(addRestrictionButton);
  
  container.appendChild(restrictionsContainer);
  
  // Stats display
  const stats = document.createElement('div');
  stats.className = 'widget-summary';
  stats.setAttribute('data-testid', 'stats-display');
  container.appendChild(stats);
  
  // Chart container
  const chartContainer = document.createElement('div');
  chartContainer.className = 'widget-chart-container';
  chartContainer.setAttribute('data-testid', 'chart-container');
  container.appendChild(chartContainer);
  
  // SVG for chart
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = '100%';
  svg.style.height = '400px';
  chartContainer.appendChild(svg);
  
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
    const primaryColor = getCSSVar('--widget-primary');
    const borderColor = getCSSVar('--widget-border-dark');
    const accentColor = getCSSVar('--widget-accent');
    const chartLineColor = getCSSVar('--widget-chart-line');
    const textColor = getCSSVar('--widget-text-primary');
    
    // Draw full histogram
    if (showFull) {
      fullBins.forEach(bin => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', xScale(bin.start));
        rect.setAttribute('y', yScale(bin.count));
        rect.setAttribute('width', Math.max(1, xScale(bin.end) - xScale(bin.start) - 1));
        rect.setAttribute('height', margin.top + chartHeight - yScale(bin.count));
        rect.setAttribute('fill', primaryColor);
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
        rect.setAttribute('fill', '#22c55e'); // Greenish color to distinguish from primary
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
      row.className = 'widget-controls';
      row.style.marginBottom = '0.5rem';
      row.setAttribute('data-testid', `restriction-row-${index}`);
      
      // Variable selector
      const varSelect = document.createElement('select');
      varSelect.className = 'widget-select';
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
      minGroup.className = 'widget-checkbox';
      const minCheckbox = document.createElement('input');
      minCheckbox.type = 'checkbox';
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
      minInput.className = 'widget-input';
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
      maxGroup.className = 'widget-checkbox';
      const maxCheckbox = document.createElement('input');
      maxCheckbox.type = 'checkbox';
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
      maxInput.className = 'widget-input';
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
      removeButton.className = 'widget-button';
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
    renderChart();
    updateStats();
  });
  
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
  };
}

export default { render };
