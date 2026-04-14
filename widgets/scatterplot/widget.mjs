/**
 * Scatterplot Widget
 * 
 * Real dataset scatterplot with full annotation suite and residual plot toggle.
 * 
 * Model state:
 * - data: array of data objects OR string URL to JSON/CSV file
 * - x_var: name of X variable
 * - y_var: name of Y variable
 * - show_point_of_averages: show point at (mean_x, mean_y)
 * - show_sd_lines: show horizontal/vertical lines at mean ± 1 SD
 * - show_sd_line: show SD line (slope = SD_y/SD_x through point of averages)
 * - show_graph_of_averages: bin X, plot mean Y for each bin
 * - show_regression: show regression line
 * - show_residuals: toggle residual plot view
 * - include_added_points: include user-added points in calculations
 */

import { fetchData } from '../../src/utils/fetchData.mjs';
import { mean, sampleSD, linearRegression } from '../../src/math/stats-math.mjs';
import { isDarkMode, getColor, colors } from '../../src/utils/dark-mode.mjs';

/**
 * Main render function
 */
export async function render({ model, el }) {
  // Get model state
  let title = model.get('title');
  const dataSpec = model.get('data');
  let xVar = model.get('x_var') || null;
  let yVar = model.get('y_var') || null;
  let showPointOfAverages = model.get('show_point_of_averages') || false;
  let showSDLines = model.get('show_sd_lines') || false;
  let showSDLine = model.get('show_sd_line') || false;
  let showGraphOfAverages = model.get('show_graph_of_averages') || false;
  let showRegression = model.get('show_regression') || false;
  let showResiduals = model.get('show_residuals') || false;
  let includeAddedPoints = model.get('include_added_points') || true;
  
  const darkMode = isDarkMode(el);
  
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
    console.error('[scatterplot] Error loading data:', error);
    el.textContent = `Error loading data: ${error.message}`;
    return;
  }
  
  // Current state
  let data = datasets[currentDataset] || [];
  let addedPoints = [];
  let variables = [];
  
  // Container setup
  el.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  el.style.padding = '1rem';
  
  // Title (optional)
  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.marginTop = '0';
    titleEl.style.marginBottom = '1rem';
    titleEl.style.color = getColor(el, colors.text.light, colors.text.dark);
    el.appendChild(titleEl);
  }
  
  // Controls row 1: Dataset and variable selectors
  const controls1 = document.createElement('div');
  controls1.style.marginBottom = '0.5rem';
  controls1.style.display = 'flex';
  controls1.style.gap = '1rem';
  controls1.style.flexWrap = 'wrap';
  controls1.style.alignItems = 'flex-end';
  
  // Dataset selector (only show if multiple datasets)
  let datasetSelect;
  if (datasetNames.length > 1) {
    const datasetGroup = document.createElement('div');
    const datasetLabel = document.createElement('label');
    datasetLabel.textContent = 'Dataset:';
    datasetLabel.style.display = 'block';
    datasetLabel.style.marginBottom = '0.25rem';
    datasetLabel.style.fontSize = '0.875rem';
    datasetLabel.style.color = getColor(el, colors.text.light, colors.text.dark);
    datasetSelect = document.createElement('select');
    datasetSelect.style.padding = '0.5rem';
    datasetSelect.style.border = `1px solid ${getColor(el, colors.border.light, colors.border.dark)}`;
    datasetSelect.style.borderRadius = '4px';
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
  
  // X variable selector
  const xVarGroup = document.createElement('div');
  const xVarLabel = document.createElement('label');
  xVarLabel.textContent = 'X Variable:';
  xVarLabel.style.display = 'block';
  xVarLabel.style.marginBottom = '0.25rem';
  xVarLabel.style.fontSize = '0.875rem';
  xVarLabel.style.color = getColor(el, colors.text.light, colors.text.dark);
  const xVarSelect = document.createElement('select');
  xVarSelect.style.padding = '0.5rem';
  xVarSelect.style.border = `1px solid ${getColor(el, colors.border.light, colors.border.dark)}`;
  xVarSelect.style.borderRadius = '4px';
  xVarSelect.setAttribute('data-testid', 'x-var-select');
  xVarGroup.appendChild(xVarLabel);
  xVarGroup.appendChild(xVarSelect);
  controls1.appendChild(xVarGroup);
  
  // Y variable selector
  const yVarGroup = document.createElement('div');
  const yVarLabel = document.createElement('label');
  yVarLabel.textContent = 'Y Variable:';
  yVarLabel.style.display = 'block';
  yVarLabel.style.marginBottom = '0.25rem';
  yVarLabel.style.fontSize = '0.875rem';
  yVarLabel.style.color = getColor(el, colors.text.light, colors.text.dark);
  const yVarSelect = document.createElement('select');
  yVarSelect.style.padding = '0.5rem';
  yVarSelect.style.border = `1px solid ${getColor(el, colors.border.light, colors.border.dark)}`;
  yVarSelect.style.borderRadius = '4px';
  yVarSelect.setAttribute('data-testid', 'y-var-select');
  yVarGroup.appendChild(yVarLabel);
  yVarGroup.appendChild(yVarSelect);
  controls1.appendChild(yVarGroup);
  
  el.appendChild(controls1);
  
  // Controls row 2: Overlay toggles
  const controls2 = document.createElement('div');
  controls2.style.marginBottom = '0.5rem';
  controls2.style.display = 'flex';
  controls2.style.gap = '1rem';
  controls2.style.flexWrap = 'wrap';
  controls2.style.alignItems = 'center';
  
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
    labelEl.style.fontSize = '0.875rem';
    labelEl.style.color = getColor(el, colors.text.light, colors.text.dark);
    labelEl.style.cursor = 'pointer';
    const group = document.createElement('div');
    group.style.display = 'flex';
    group.style.alignItems = 'center';
    group.style.gap = '0.5rem';
    group.appendChild(checkbox);
    group.appendChild(labelEl);
    return { group, checkbox };
  }
  
  const { group: poaGroup, checkbox: poaCheckbox } = 
    createCheckbox('show-poa', 'Point of Averages', showPointOfAverages, 'show-poa-checkbox');
  const { group: sdLinesGroup, checkbox: sdLinesCheckbox } = 
    createCheckbox('show-sd-lines', 'SD Lines', showSDLines, 'show-sd-lines-checkbox');
  const { group: sdLineGroup, checkbox: sdLineCheckbox } = 
    createCheckbox('show-sd-line', 'SD Line', showSDLine, 'show-sd-line-checkbox');
  const { group: goaGroup, checkbox: goaCheckbox } = 
    createCheckbox('show-goa', 'Graph of Averages', showGraphOfAverages, 'show-goa-checkbox');
  const { group: regGroup, checkbox: regCheckbox } = 
    createCheckbox('show-reg', 'Regression', showRegression, 'show-regression-checkbox');
  const { group: resGroup, checkbox: resCheckbox } = 
    createCheckbox('show-res', 'Show Residuals', showResiduals, 'show-residuals-checkbox');
  const { group: incGroup, checkbox: incCheckbox } = 
    createCheckbox('inc-added', 'Include Added Points', includeAddedPoints, 'include-added-checkbox');
  
  controls2.appendChild(poaGroup);
  controls2.appendChild(sdLinesGroup);
  controls2.appendChild(sdLineGroup);
  controls2.appendChild(goaGroup);
  controls2.appendChild(regGroup);
  controls2.appendChild(resGroup);
  controls2.appendChild(incGroup);
  
  // Clear button
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Clear Added';
  clearButton.style.padding = '0.5rem 1rem';
  clearButton.style.border = `1px solid ${getColor(el, colors.border.light, colors.border.dark)}`;
  clearButton.style.borderRadius = '4px';
  clearButton.style.background = getColor(el, colors.background.light, colors.background.dark);
  clearButton.style.color = getColor(el, colors.text.light, colors.text.dark);
  clearButton.style.cursor = 'pointer';
  clearButton.style.fontSize = '0.875rem';
  clearButton.setAttribute('data-testid', 'clear-button');
  controls2.appendChild(clearButton);
  
  el.appendChild(controls2);
  
  // Stats display
  const stats = document.createElement('div');
  stats.style.marginBottom = '1rem';
  stats.style.fontSize = '0.875rem';
  stats.style.color = getColor(el, colors.text.light, colors.text.dark);
  stats.setAttribute('data-testid', 'stats-display');
  el.appendChild(stats);
  
  // Chart container
  const chartContainer = document.createElement('div');
  chartContainer.style.width = '100%';
  chartContainer.style.height = '500px';
  chartContainer.style.border = `1px solid ${getColor(el, colors.border.light, colors.border.dark)}`;
  chartContainer.style.borderRadius = '4px';
  chartContainer.style.background = getColor(el, colors.background.light, colors.background.dark);
  chartContainer.setAttribute('data-testid', 'chart-container');
  el.appendChild(chartContainer);
  
  // SVG for chart
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.style.cursor = 'crosshair';
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
    
    // Set default variables if not set or if current variables don't exist in new dataset
    if ((!xVar || !variables.includes(xVar)) && variables.length > 0) {
      const initialXVar = model.get('x_var');
      // Use model's initial if valid, else fallback
      if (initialXVar && variables.includes(initialXVar)) {
        xVar = initialXVar;
      } else {
        xVar = variables[0];
      }
    }
    if ((!yVar || !variables.includes(yVar)) && variables.length > 1) {
      const initialYVar = model.get('y_var');
      if (initialYVar && variables.includes(initialYVar)) {
        yVar = initialYVar;
      } else {
        yVar = variables[1];
      }
    }
    
    updateVariableSelectors();
  }
  
  /**
   * Update variable selector options
   */
  function updateVariableSelectors() {
    // Clear existing options
    xVarSelect.innerHTML = '';
    yVarSelect.innerHTML = '';
    
    variables.forEach(v => {
      const xOption = document.createElement('option');
      xOption.value = v;
      xOption.textContent = v;
      if (v === xVar) xOption.selected = true;
      xVarSelect.appendChild(xOption);
      
      const yOption = document.createElement('option');
      yOption.value = v;
      yOption.textContent = v;
      if (v === yVar) yOption.selected = true;
      yVarSelect.appendChild(yOption);
    });
  }
  
  /**
   * Get combined data (original + added points)
   */
  function getCombinedData() {
    if (includeAddedPoints && addedPoints.length > 0) {
      // Convert added points to dataset format
      const addedAsObjects = addedPoints.map(p => {
        const obj = {};
        obj[xVar] = p.x;
        obj[yVar] = p.y;
        return obj;
      });
      return [...data, ...addedAsObjects];
    }
    return data;
  }
  
  /**
   * Extract X and Y arrays
   */
  function getXY(dataset) {
    const pairs = [];
    for (const row of dataset) {
      const xVal = parseFloat(row[xVar]);
      const yVal = parseFloat(row[yVar]);
      if (!isNaN(xVal) && !isNaN(yVal)) {
        pairs.push({ x: xVal, y: yVal });
      }
    }
    const x = pairs.map(p => p.x);
    const y = pairs.map(p => p.y);
    return { x, y };
  }
  
  /**
   * Update stats display
   */
  function updateStats() {
    const combined = getCombinedData();
    const { x, y } = getXY(combined);
    
    if (x.length === 0 || y.length === 0) {
      stats.textContent = 'No data';
      return;
    }
    
    const mx = mean(x);
    const my = mean(y);
    const sx = sampleSD(x);
    const sy = sampleSD(y);
    
    // Compute correlation
    const n = Math.min(x.length, y.length);
    let sumXY = 0;
    for (let i = 0; i < n; i++) {
      sumXY += (x[i] - mx) * (y[i] - my);
    }
    const r = sumXY / ((n - 1) * sx * sy);
    
    const regression = linearRegression(x, y);
    
    stats.textContent = `n = ${n} | r = ${r.toFixed(3)} | ` +
      `Mean: (${mx.toFixed(2)}, ${my.toFixed(2)}) | ` +
      `SD: (${sx.toFixed(2)}, ${sy.toFixed(2)}) | ` +
      `Regression: y = ${regression.slope.toFixed(3)}x + ${regression.intercept.toFixed(3)}`;
  }
  
  /**
   * Render scatterplot
   */
  function renderChart() {
    // Clear SVG
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    const combined = getCombinedData();
    let { x, y } = getXY(combined);
    
    if (x.length === 0 || y.length === 0) {
      return;
    }
    
    // If showing residuals, transform Y values
    if (showResiduals) {
      const regression = linearRegression(x, y);
      y = y.map((yi, i) => yi - (regression.slope * x[i] + regression.intercept));
    }
    
    // Get dimensions
    const containerRect = chartContainer.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Compute stats
    const mx = mean(x);
    const my = mean(y);
    const sx = sampleSD(x);
    const sy = sampleSD(y);
    
    // Find data range
    const xMin = Math.min(...x);
    const xMax = Math.max(...x);
    const yMin = Math.min(...y);
    const yMax = Math.max(...y);
    
    // Add padding
    const xPad = (xMax - xMin) * 0.1 || 1;
    const yPad = (yMax - yMin) * 0.1 || 1;
    const xDomain = [xMin - xPad, xMax + xPad];
    const yDomain = [yMin - yPad, yMax + yPad];
    
    // Scales
    const xScale = (value) => margin.left + ((value - xDomain[0]) / (xDomain[1] - xDomain[0])) * chartWidth;
    const yScale = (value) => margin.top + chartHeight - ((value - yDomain[0]) / (yDomain[1] - yDomain[0])) * chartHeight;
    const xScaleInverse = (pixel) => xDomain[0] + ((pixel - margin.left) / chartWidth) * (xDomain[1] - xDomain[0]);
    const yScaleInverse = (pixel) => yDomain[0] + ((margin.top + chartHeight - pixel) / chartHeight) * (yDomain[1] - yDomain[0]);
    
    // Chart group
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Draw SD Lines
    if (showSDLines) {
      [mx - sx, mx, mx + sx].forEach(xVal => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', xScale(xVal));
        line.setAttribute('y1', margin.top);
        line.setAttribute('x2', xScale(xVal));
        line.setAttribute('y2', margin.top + chartHeight);
        line.setAttribute('stroke', getColor(el, colors.accent.light, colors.accent.dark));
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '4');
        line.setAttribute('data-testid', 'sd-line-vertical');
        chartGroup.appendChild(line);
      });
      
      [my - sy, my, my + sy].forEach(yVal => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', yScale(yVal));
        line.setAttribute('x2', margin.left + chartWidth);
        line.setAttribute('y2', yScale(yVal));
        line.setAttribute('stroke', getColor(el, colors.accent.light, colors.accent.dark));
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '4');
        line.setAttribute('data-testid', 'sd-line-horizontal');
        chartGroup.appendChild(line);
      });
    }
    
    // Draw SD Line (meaningless in residual plot since r=0)
    if (showSDLine && !showResiduals) {
      const slope = sy / sx;
      const x1 = xDomain[0];
      const y1 = my + slope * (x1 - mx);
      const x2 = xDomain[1];
      const y2 = my + slope * (x2 - mx);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', xScale(x1));
      line.setAttribute('y1', yScale(y1));
      line.setAttribute('x2', xScale(x2));
      line.setAttribute('y2', yScale(y2));
      line.setAttribute('stroke', 'purple');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('data-testid', 'sd-line');
      chartGroup.appendChild(line);
    }
    
    // Draw regression line (or y=0 line in residual view)
    if (showRegression) {
      if (showResiduals) {
        // In residual view, regression line is y = 0
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', yScale(0));
        line.setAttribute('x2', margin.left + chartWidth);
        line.setAttribute('y2', yScale(0));
        line.setAttribute('stroke', 'red');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('data-testid', 'regression-line');
        chartGroup.appendChild(line);
      } else {
        const { x: origX, y: origY } = getXY(combined);
        const regression = linearRegression(origX, origY);
        const x1 = xDomain[0];
        const y1 = regression.slope * x1 + regression.intercept;
        const x2 = xDomain[1];
        const y2 = regression.slope * x2 + regression.intercept;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', xScale(x1));
        line.setAttribute('y1', yScale(y1));
        line.setAttribute('x2', xScale(x2));
        line.setAttribute('y2', yScale(y2));
        line.setAttribute('stroke', 'red');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('data-testid', 'regression-line');
        chartGroup.appendChild(line);
      }
    }
    
    // Draw data points
    for (let i = 0; i < Math.min(data.length, x.length); i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', xScale(x[i]));
      circle.setAttribute('cy', yScale(y[i]));
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', getColor(el, colors.chart.bar.light, colors.chart.bar.dark));
      circle.setAttribute('stroke', getColor(el, colors.border.light, colors.border.dark));
      circle.setAttribute('stroke-width', '0.5');
      circle.setAttribute('data-testid', 'data-point');
      chartGroup.appendChild(circle);
    }
    
    // Draw added points
    const numOriginal = Math.min(data.length, x.length);
    for (let i = numOriginal; i < x.length; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', xScale(x[i]));
      circle.setAttribute('cy', yScale(y[i]));
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', 'red');
      circle.setAttribute('stroke', 'darkred');
      circle.setAttribute('stroke-width', '1');
      circle.setAttribute('data-testid', 'added-point');
      chartGroup.appendChild(circle);
    }

    // Draw graph of averages (drawn after data points to appear on top)
    if (showGraphOfAverages) {
      // Use the actual data bounds rather than the padded domain for binning
      const numBins = 10;
      const binWidth = (xMax - xMin) / numBins;
      
      for (let i = 0; i < numBins; i++) {
        const binStart = xMin + i * binWidth;
        const binEnd = i === numBins - 1 ? xMax + 1e-9 : binStart + binWidth; // ensure last bin includes max point
        
        // Find all points in this bin
        let sumY = 0;
        let count = 0;
        let sumX = 0;
        
        for (let j = 0; j < x.length; j++) {
          if (x[j] >= binStart && x[j] < binEnd) {
            sumY += y[j];
            sumX += x[j];
            count++;
          }
        }
        
        if (count > 0) {
          const binMeanX = sumX / count;
          const binMeanY = sumY / count;
          
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          // Center the square at the mean X and mean Y of the points in the bin
          rect.setAttribute('x', xScale(binMeanX) - 4);
          rect.setAttribute('y', yScale(binMeanY) - 4);
          rect.setAttribute('width', '8');
          rect.setAttribute('height', '8');
          rect.setAttribute('fill', 'yellow');
          rect.setAttribute('stroke', 'orange');
          rect.setAttribute('stroke-width', '1');
          rect.setAttribute('data-testid', 'goa-point');
          chartGroup.appendChild(rect);
        }
      }
    }
    
    // Draw point of averages
    if (showPointOfAverages) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', xScale(mx));
      circle.setAttribute('cy', yScale(my));
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', 'green');
      circle.setAttribute('stroke', 'darkgreen');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('data-testid', 'point-of-averages');
      chartGroup.appendChild(circle);
    }
    
    // Draw axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', margin.top + chartHeight);
    xAxis.setAttribute('x2', margin.left + chartWidth);
    xAxis.setAttribute('y2', margin.top + chartHeight);
    xAxis.setAttribute('stroke', getColor(el, colors.axis.light, colors.axis.dark));
    xAxis.setAttribute('stroke-width', '1');
    chartGroup.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', margin.top + chartHeight);
    yAxis.setAttribute('stroke', getColor(el, colors.axis.light, colors.axis.dark));
    yAxis.setAttribute('stroke-width', '1');
    chartGroup.appendChild(yAxis);
    
    // Axis labels
    const xTicks = [xDomain[0], (xDomain[0] + xDomain[1]) / 2, xDomain[1]];
    xTicks.forEach(tick => {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', xScale(tick));
      label.setAttribute('y', margin.top + chartHeight + 20);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', getColor(el, colors.text.light, colors.text.dark));
      label.setAttribute('font-size', '0.75rem');
      label.textContent = tick.toFixed(1);
      chartGroup.appendChild(label);
    });
    
    const yTicks = [yDomain[0], (yDomain[0] + yDomain[1]) / 2, yDomain[1]];
    yTicks.forEach(tick => {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', margin.left - 10);
      label.setAttribute('y', yScale(tick));
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('fill', getColor(el, colors.text.light, colors.text.dark));
      label.setAttribute('font-size', '0.75rem');
      label.textContent = tick.toFixed(1);
      chartGroup.appendChild(label);
    });
    
    // Axis titles
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', margin.left + chartWidth / 2);
    xLabel.setAttribute('y', margin.top + chartHeight + 40);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('fill', getColor(el, colors.text.light, colors.text.dark));
    xLabel.setAttribute('font-size', '0.875rem');
    xLabel.textContent = showResiduals ? xVar : xVar;
    chartGroup.appendChild(xLabel);
    
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', margin.left - 45);
    yLabel.setAttribute('y', margin.top + chartHeight / 2);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('fill', getColor(el, colors.text.light, colors.text.dark));
    yLabel.setAttribute('font-size', '0.875rem');
    yLabel.setAttribute('transform', `rotate(-90, ${margin.left - 45}, ${margin.top + chartHeight / 2})`);
    yLabel.textContent = showResiduals ? `${yVar} (residuals)` : yVar;
    chartGroup.appendChild(yLabel);
    
    svg.appendChild(chartGroup);
    
    // Store scales for click handling
    svg._xScaleInverse = xScaleInverse;
    svg._yScaleInverse = yScaleInverse;
  }
  
  /**
   * Handle click to add point
   */
  function handleClick(event) {
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (svg._xScaleInverse && svg._yScaleInverse) {
      const dataX = svg._xScaleInverse(x);
      const dataY = svg._yScaleInverse(y);
      
      const containerRect = chartContainer.getBoundingClientRect();
      const margin = { top: 20, right: 20, bottom: 50, left: 60 };
      if (x >= margin.left && x <= containerRect.width - margin.right &&
          y >= margin.top && y <= containerRect.height - margin.bottom) {
        addedPoints.push({ x: dataX, y: dataY });
        renderChart();
        updateStats();
      }
    }
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
  
  xVarSelect.addEventListener('change', () => {
    xVar = xVarSelect.value;
    model.set('x_var', xVar);
    renderChart();
    updateStats();
  });
  
  yVarSelect.addEventListener('change', () => {
    yVar = yVarSelect.value;
    model.set('y_var', yVar);
    renderChart();
    updateStats();
  });
  
  poaCheckbox.addEventListener('change', () => {
    showPointOfAverages = poaCheckbox.checked;
    model.set('show_point_of_averages', showPointOfAverages);
    renderChart();
  });
  
  sdLinesCheckbox.addEventListener('change', () => {
    showSDLines = sdLinesCheckbox.checked;
    model.set('show_sd_lines', showSDLines);
    renderChart();
  });
  
  sdLineCheckbox.addEventListener('change', () => {
    showSDLine = sdLineCheckbox.checked;
    model.set('show_sd_line', showSDLine);
    renderChart();
  });
  
  goaCheckbox.addEventListener('change', () => {
    showGraphOfAverages = goaCheckbox.checked;
    model.set('show_graph_of_averages', showGraphOfAverages);
    renderChart();
  });
  
  regCheckbox.addEventListener('change', () => {
    showRegression = regCheckbox.checked;
    model.set('show_regression', showRegression);
    renderChart();
  });
  
  resCheckbox.addEventListener('change', () => {
    showResiduals = resCheckbox.checked;
    model.set('show_residuals', showResiduals);
    renderChart();
    updateStats();
  });
  
  incCheckbox.addEventListener('change', () => {
    includeAddedPoints = incCheckbox.checked;
    model.set('include_added_points', includeAddedPoints);
    renderChart();
    updateStats();
  });
  
  clearButton.addEventListener('click', () => {
    addedPoints = [];
    renderChart();
    updateStats();
  });
  
  svg.addEventListener('click', handleClick);
  
  // Initial load
  loadDataset(currentDataset);
  renderChart();
  updateStats();
  
  // Cleanup
  return () => {
    svg.removeEventListener('click', handleClick);
  };
}

export default { render };
