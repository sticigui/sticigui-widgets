/**
 * Correlation and Regression Widget
 * 
 * Generates bivariate normal data with specified correlation coefficient.
 * Shows scatterplot with optional overlays: SD lines, SD line, regression line.
 * Allows clicking to add points interactively.
 * 
 * Model state:
 * - r: correlation coefficient (default: 0.7, range: -1 to 1)
 * - n: sample size (default: 50, range: 10 to 200)
 * - show_sd_lines: show horizontal/vertical lines at mean ± 1 SD (default: false)
 * - show_sd_line: show SD line (slope = SD_y/SD_x through point of averages) (default: false)
 * - show_regression: show regression line (default: false)
 * - include_added_points: include user-added points in calculations (default: true)
 * - seed: PRNG seed (default: 42)
 */

import { PRNG } from '../../src/sim/prng.mjs';
import { mean, sampleSD, linearRegression } from '../../src/math/stats-math.mjs';
import styles from './styles.css';

// Inject styles into document
function injectStyles() {
  if (!document.getElementById('correlation-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'correlation-styles';
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
export function render({ model, el }) {
  // Inject CSS
  injectStyles();

  // Get model state
  let title = model.get('title');
  let r = model.get('r') ?? 0.7;
  let n = model.get('n') ?? 50;
  let showSDLines = model.get('show_sd_lines') ?? false;
  let showSDLine = model.get('show_sd_line') ?? false;
  let showRegression = model.get('show_regression') ?? false;
  let includeAddedPoints = model.get('include_added_points') ?? true;
  let seed = model.get('seed') ?? 42;
  
  // Generated data
  let dataX = [];
  let dataY = [];
  let addedPoints = []; // {x, y} pairs from clicks
  
  // Create container
  const container = document.createElement('div');
  container.className = 'widget-container';
  
  // Title (optional)
  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.className = 'widget-title';
    titleEl.textContent = title;
    container.appendChild(titleEl);
  }
  
  // Controls row 1: r and n sliders
  const controls1 = document.createElement('div');
  controls1.className = 'widget-controls';
  
  // r slider
  const rGroup = document.createElement('div');
  rGroup.className = 'widget-input-group';
  const rLabel = document.createElement('label');
  rLabel.className = 'widget-label';
  rLabel.textContent = 'r =';
  const rSlider = document.createElement('input');
  rSlider.className = 'widget-input';
  rSlider.type = 'range';
  rSlider.min = '-1';
  rSlider.max = '1';
  rSlider.step = '0.01';
  rSlider.value = r;
  rSlider.style.width = '150px';
  rSlider.setAttribute('data-testid', 'r-slider');
  rSlider.setAttribute('aria-label', 'Correlation coefficient');
  const rValue = document.createElement('span');
  rValue.className = 'widget-label';
  rValue.textContent = r.toFixed(2);
  rValue.style.minWidth = '40px';
  rValue.setAttribute('data-testid', 'r-value');
  rGroup.appendChild(rLabel);
  rGroup.appendChild(rSlider);
  rGroup.appendChild(rValue);
  controls1.appendChild(rGroup);
  
  // n slider
  const nGroup = document.createElement('div');
  nGroup.className = 'widget-input-group';
  const nLabel = document.createElement('label');
  nLabel.className = 'widget-label';
  nLabel.textContent = 'n =';
  const nSlider = document.createElement('input');
  nSlider.className = 'widget-input';
  nSlider.type = 'range';
  nSlider.min = '10';
  nSlider.max = '200';
  nSlider.step = '10';
  nSlider.value = n;
  nSlider.style.width = '150px';
  nSlider.setAttribute('data-testid', 'n-slider');
  nSlider.setAttribute('aria-label', 'Sample size');
  const nValue = document.createElement('span');
  nValue.className = 'widget-label';
  nValue.textContent = n;
  nValue.style.minWidth = '40px';
  nValue.setAttribute('data-testid', 'n-value');
  nGroup.appendChild(nLabel);
  nGroup.appendChild(nSlider);
  nGroup.appendChild(nValue);
  controls1.appendChild(nGroup);
  
  container.appendChild(controls1);
  
  // Controls row 2: annotation toggles
  const controls2 = document.createElement('div');
  controls2.className = 'widget-controls';
  
  // SD Lines checkbox
  const sdLinesGroup = document.createElement('div');
  sdLinesGroup.className = 'widget-checkbox';
  const sdLinesCheckbox = document.createElement('input');
  sdLinesCheckbox.type = 'checkbox';
  sdLinesCheckbox.checked = showSDLines;
  sdLinesCheckbox.id = 'show-sd-lines';
  sdLinesCheckbox.setAttribute('data-testid', 'show-sd-lines-checkbox');
  const sdLinesLabel = document.createElement('label');
  sdLinesLabel.htmlFor = 'show-sd-lines';
  sdLinesLabel.textContent = 'SD Lines';
  sdLinesGroup.appendChild(sdLinesCheckbox);
  sdLinesGroup.appendChild(sdLinesLabel);
  controls2.appendChild(sdLinesGroup);
  
  // SD Line checkbox
  const sdLineGroup = document.createElement('div');
  sdLineGroup.className = 'widget-checkbox';
  const sdLineCheckbox = document.createElement('input');
  sdLineCheckbox.type = 'checkbox';
  sdLineCheckbox.checked = showSDLine;
  sdLineCheckbox.id = 'show-sd-line';
  sdLineCheckbox.setAttribute('data-testid', 'show-sd-line-checkbox');
  const sdLineLabel = document.createElement('label');
  sdLineLabel.htmlFor = 'show-sd-line';
  sdLineLabel.textContent = 'SD Line';
  sdLineGroup.appendChild(sdLineCheckbox);
  sdLineGroup.appendChild(sdLineLabel);
  controls2.appendChild(sdLineGroup);
  
  // Regression checkbox
  const regressionGroup = document.createElement('div');
  regressionGroup.className = 'widget-checkbox';
  const regressionCheckbox = document.createElement('input');
  regressionCheckbox.type = 'checkbox';
  regressionCheckbox.checked = showRegression;
  regressionCheckbox.id = 'show-regression';
  regressionCheckbox.setAttribute('data-testid', 'show-regression-checkbox');
  const regressionLabel = document.createElement('label');
  regressionLabel.htmlFor = 'show-regression';
  regressionLabel.textContent = 'Regression Line';
  regressionGroup.appendChild(regressionCheckbox);
  regressionGroup.appendChild(regressionLabel);
  controls2.appendChild(regressionGroup);
  
  // Include added points checkbox
  const includeAddedGroup = document.createElement('div');
  includeAddedGroup.className = 'widget-checkbox';
  const includeAddedCheckbox = document.createElement('input');
  includeAddedCheckbox.type = 'checkbox';
  includeAddedCheckbox.checked = includeAddedPoints;
  includeAddedCheckbox.id = 'include-added-points';
  includeAddedCheckbox.setAttribute('data-testid', 'include-added-points-checkbox');
  const includeAddedLabel = document.createElement('label');
  includeAddedLabel.htmlFor = 'include-added-points';
  includeAddedLabel.textContent = 'Include Added Points';
  includeAddedGroup.appendChild(includeAddedCheckbox);
  includeAddedGroup.appendChild(includeAddedLabel);
  controls2.appendChild(includeAddedGroup);
  
  // Clear added points button
  const clearButton = document.createElement('button');
  clearButton.className = 'widget-button';
  clearButton.textContent = 'Clear Added Points';
  clearButton.setAttribute('data-testid', 'clear-added-button');
  clearButton.setAttribute('aria-label', 'Clear user-added points');
  controls2.appendChild(clearButton);
  
  container.appendChild(controls2);
  
  // Stats display
  const stats = document.createElement('div');
  stats.className = 'widget-summary';
  stats.setAttribute('data-testid', 'stats-display');
  container.appendChild(stats);
  
  // Chart container
  const chartContainer = document.createElement('div');
  chartContainer.className = 'widget-chart-container';
  chartContainer.style.height = '500px';
  chartContainer.style.border = `1px solid ${getCSSVar('--widget-border-light')}`;
  chartContainer.style.borderRadius = '4px';
  chartContainer.setAttribute('data-testid', 'chart-container');
  container.appendChild(chartContainer);
  
  // SVG for chart
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.style.cursor = 'crosshair';
  chartContainer.appendChild(svg);
  
  /**
   * Generate bivariate normal data
   */
  function generateData() {
    const prng = new PRNG(seed);
    dataX = [];
    dataY = [];
    
    for (let i = 0; i < n; i++) {
      const x = prng.nextNormal(0, 1);
      const z = prng.nextNormal(0, 1);
      const y = r * x + Math.sqrt(1 - r * r) * z;
      dataX.push(x);
      dataY.push(y);
    }
  }
  
  /**
   * Get combined data (original + added points)
   */
  function getCombinedData() {
    if (includeAddedPoints && addedPoints.length > 0) {
      const allX = [...dataX, ...addedPoints.map(p => p.x)];
      const allY = [...dataY, ...addedPoints.map(p => p.y)];
      return { x: allX, y: allY };
    }
    return { x: dataX, y: dataY };
  }
  
  /**
   * Update stats display
   */
  function updateStats() {
    const data = getCombinedData();
    if (data.x.length === 0) {
      stats.textContent = '';
      return;
    }
    
    const mx = mean(data.x);
    const my = mean(data.y);
    const sx = sampleSD(data.x);
    const sy = sampleSD(data.y);
    
    // Compute correlation
    const n = data.x.length;
    let sumXY = 0;
    for (let i = 0; i < n; i++) {
      sumXY += (data.x[i] - mx) * (data.y[i] - my);
    }
    const rComputed = sumXY / ((n - 1) * sx * sy);
    
    // Regression
    const regression = linearRegression(data.x, data.y);
    
    stats.textContent = `n = ${n} | r = ${rComputed.toFixed(3)} | ` +
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
    
    const data = getCombinedData();
    
    if (data.x.length === 0) {
      return;
    }
    
    // Get dimensions
    const containerRect = chartContainer.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Compute stats
    const mx = mean(data.x);
    const my = mean(data.y);
    const sx = sampleSD(data.x);
    const sy = sampleSD(data.y);
    
    // Find data range
    const xMin = Math.min(...data.x);
    const xMax = Math.max(...data.x);
    const yMin = Math.min(...data.y);
    const yMax = Math.max(...data.y);
    
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
    
    // Draw SD Lines (horizontal and vertical at mean ± 1 SD)
    if (showSDLines) {
      // Vertical lines at mx - sx, mx, mx + sx
      [mx - sx, mx, mx + sx].forEach(x => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', xScale(x));
        line.setAttribute('y1', margin.top);
        line.setAttribute('x2', xScale(x));
        line.setAttribute('y2', margin.top + chartHeight);
        line.setAttribute('stroke', getCSSVar('--widget-accent'));
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '4');
        line.setAttribute('data-testid', 'sd-line-vertical');
        chartGroup.appendChild(line);
      });
      
      // Horizontal lines at my - sy, my, my + sy
      [my - sy, my, my + sy].forEach(y => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', yScale(y));
        line.setAttribute('x2', margin.left + chartWidth);
        line.setAttribute('y2', yScale(y));
        line.setAttribute('stroke', getCSSVar('--widget-accent'));
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '4');
        line.setAttribute('data-testid', 'sd-line-horizontal');
        chartGroup.appendChild(line);
      });
    }
    
    // Draw SD Line (line through point of averages with slope SD_y/SD_x)
    if (showSDLine) {
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
      line.setAttribute('stroke', getCSSVar('--widget-chart-line'));
      line.setAttribute('stroke-width', '2');
      line.setAttribute('data-testid', 'sd-line');
      chartGroup.appendChild(line);
    }
    
    // Draw regression line
    if (showRegression) {
      const regression = linearRegression(data.x, data.y);
      const x1 = xDomain[0];
      const y1 = regression.slope * x1 + regression.intercept;
      const x2 = xDomain[1];
      const y2 = regression.slope * x2 + regression.intercept;
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', xScale(x1));
      line.setAttribute('y1', yScale(y1));
      line.setAttribute('x2', xScale(x2));
      line.setAttribute('y2', yScale(y2));
      line.setAttribute('stroke', getCSSVar('--widget-chart-line'));
      line.setAttribute('stroke-width', '2');
      line.setAttribute('data-testid', 'regression-line');
      chartGroup.appendChild(line);
    }
    
    // Draw original data points
    for (let i = 0; i < dataX.length; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', xScale(dataX[i]));
      circle.setAttribute('cy', yScale(dataY[i]));
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', getCSSVar('--widget-primary'));
      circle.setAttribute('stroke', getCSSVar('--widget-border-dark'));
      circle.setAttribute('stroke-width', '0.5');
      circle.setAttribute('data-testid', 'data-point');
      chartGroup.appendChild(circle);
    }
    
    // Draw added points (in different color)
    addedPoints.forEach(point => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', xScale(point.x));
      circle.setAttribute('cy', yScale(point.y));
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', getCSSVar('--widget-chart-line'));
      circle.setAttribute('stroke', getCSSVar('--widget-chart-line'));
      circle.setAttribute('stroke-width', '1');
      circle.setAttribute('data-testid', 'added-point');
      chartGroup.appendChild(circle);
    });
    
    // Draw axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', margin.top + chartHeight);
    xAxis.setAttribute('x2', margin.left + chartWidth);
    xAxis.setAttribute('y2', margin.top + chartHeight);
    xAxis.setAttribute('stroke', getCSSVar('--widget-border-dark'));
    xAxis.setAttribute('stroke-width', '1');
    chartGroup.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', margin.top + chartHeight);
    yAxis.setAttribute('stroke', getCSSVar('--widget-border-dark'));
    yAxis.setAttribute('stroke-width', '1');
    chartGroup.appendChild(yAxis);
    
    // Axis labels
    const xTicks = [xDomain[0], (xDomain[0] + xDomain[1]) / 2, xDomain[1]];
    xTicks.forEach(tick => {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', xScale(tick));
      label.setAttribute('y', margin.top + chartHeight + 20);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', getCSSVar('--widget-text-primary'));
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
      label.setAttribute('fill', getCSSVar('--widget-text-primary'));
      label.setAttribute('font-size', '0.75rem');
      label.textContent = tick.toFixed(1);
      chartGroup.appendChild(label);
    });
    
    // Axis titles
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', margin.left + chartWidth / 2);
    xLabel.setAttribute('y', margin.top + chartHeight + 40);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('fill', getCSSVar('--widget-text-primary'));
    xLabel.setAttribute('font-size', '0.875rem');
    xLabel.textContent = 'X';
    chartGroup.appendChild(xLabel);
    
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', margin.left - 45);
    yLabel.setAttribute('y', margin.top + chartHeight / 2);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('fill', getCSSVar('--widget-text-primary'));
    yLabel.setAttribute('font-size', '0.875rem');
    yLabel.setAttribute('transform', `rotate(-90, ${margin.left - 45}, ${margin.top + chartHeight / 2})`);
    yLabel.textContent = 'Y';
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
      
      // Check if click is within chart area
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
  rSlider.addEventListener('input', () => {
    r = parseFloat(rSlider.value);
    rValue.textContent = r.toFixed(2);
    model.set('r', r);
    generateData();
    renderChart();
    updateStats();
  });
  
  nSlider.addEventListener('input', () => {
    n = parseInt(nSlider.value, 10);
    nValue.textContent = n;
    model.set('n', n);
    generateData();
    renderChart();
    updateStats();
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
  
  regressionCheckbox.addEventListener('change', () => {
    showRegression = regressionCheckbox.checked;
    model.set('show_regression', showRegression);
    renderChart();
  });
  
  includeAddedCheckbox.addEventListener('change', () => {
    includeAddedPoints = includeAddedCheckbox.checked;
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
  
  el.appendChild(container);
  
  // Initial render
  generateData();
  renderChart();
  updateStats();
  
  // Cleanup
  return () => {
    svg.removeEventListener('click', handleClick);
  };
}

export default { render };
