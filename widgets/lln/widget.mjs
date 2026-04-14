/**
 * Law of Large Numbers Widget
 * 
 * Simulates n Bernoulli(p) trials and plots the running difference 
 * between observed count (or proportion) and expected value.
 * 
 * Model state:
 * - n: number of trials (default: 500)
 * - p: success probability (default: 0.5)
 * - mode: "count" or "proportion" (default: "count")
 * - seed: PRNG seed (default: 42)
 */

import { PRNG } from '../../src/sim/prng.mjs';
import styles from '../../css/sticigui-tailwind.css';

// Inject styles into document
function injectStyles(el) {
  if (!el.querySelector('.widget-styles')) {
    const styleEl = document.createElement('style');
    styleEl.className = 'widget-styles';
    styleEl.textContent = styles;
    el.appendChild(styleEl);
  }
}

// Helper to get CSS variable value
function getCSSVar(name) {
  const root = document.querySelector('.sg-widget-root') || document.documentElement;
  const val = getComputedStyle(root).getPropertyValue(name).trim();
  if (val) return val;
  const fallbacks = {
    '--widget-text-primary': '#000000',
    '--widget-text-secondary': '#57534e',
    '--widget-bg-primary': '#ffffff',
    '--widget-bg-secondary': '#f5f5f4',
    '--widget-border-light': '#d6d3d1',
    '--widget-border-dark': '#44403c',
    '--widget-accent': '#ea580c',
    '--widget-primary': '#0ea5e9',
    '--widget-primary-highlight': '#f97316',
    '--widget-chart-line': '#dc2626'
  };
  return fallbacks[name] || '#000000';
}

/**
 * Main render function
 */
export function render({ model, el }) {
  // Inject CSS
  injectStyles(el);
  
  // Get model state
  let title = model.get('title');
  let n = model.get('n') || 800;
  let p = model.get('p') || 0.5;
  let mode = model.get('mode') || 'count';
  let seed = model.get('seed') || 42;
  
  // Simulation results (not stored in model)
  let differences = null;
  
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
  
  // Controls container
  const controls = document.createElement('div');
  controls.className = 'sg-mb-4 sg-flex sg-flex-wrap sg-gap-4 sg-items-center';
  
  // N input
  const nGroup = document.createElement('div');
  nGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
  const nLabel = document.createElement('label');
  nLabel.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
  nLabel.textContent = 'Number of trials (n):';
  const nInput = document.createElement('input');
  nInput.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
  nInput.type = 'number';
  nInput.value = n;
  nInput.min = '10';
  nInput.max = '10000';
  nInput.step = '10';
  nInput.setAttribute('data-testid', 'n-input');
  nGroup.appendChild(nLabel);
  nGroup.appendChild(nInput);
  controls.appendChild(nGroup);
  
  // P input
  const pGroup = document.createElement('div');
  pGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
  const pLabel = document.createElement('label');
  pLabel.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
  pLabel.textContent = 'Chances of success (%):';
  const pInput = document.createElement('input');
  pInput.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
  pInput.type = 'number';
  pInput.value = p * 100;
  pInput.min = '0';
  pInput.max = '100';
  pInput.step = '1';
  pInput.setAttribute('data-testid', 'p-input');
  pGroup.appendChild(pLabel);
  pGroup.appendChild(pInput);
  controls.appendChild(pGroup);
  
  // Mode toggle button
  const modeButton = document.createElement('button');
  modeButton.className = 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950';
  modeButton.textContent = mode === 'count' ? 'Show: Count Difference' : 'Show: Proportion Difference';
  modeButton.setAttribute('data-testid', 'mode-button');
  modeButton.setAttribute('aria-label', `Toggle between count and proportion difference (currently ${mode})`);
  controls.appendChild(modeButton);
  
  container.appendChild(controls);
  
  // Chart container
  const chartContainer = document.createElement('div');
  chartContainer.className = 'widget-chart-container';
  chartContainer.style.height = '400px';
  chartContainer.setAttribute('data-testid', 'chart-container');
  container.appendChild(chartContainer);
  
  // SVG for chart
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = '100%';
  svg.style.height = '100%';
  chartContainer.appendChild(svg);
  
  /**
   * Run simulation
   */
  function runSimulation() {
    const prng = new PRNG(seed);
    const results = [];
    let successCount = 0;
    
    // Run n Bernoulli trials
    for (let i = 1; i <= n; i++) {
      const trial = prng.nextFloat() < p ? 1 : 0;
      successCount += trial;
      
      // Calculate difference based on mode
      let diff;
      if (mode === 'count') {
        // Count difference: observed count - expected count
        diff = successCount - (i * p);
      } else {
        // Proportion difference: observed proportion - p
        diff = (successCount / i) - p;
      }
      
      results.push({ trial: i, difference: diff });
    }
    
    differences = results;
    renderChart();
  }
  
  /**
   * Render chart
   */
  function renderChart() {
    // Clear SVG
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    if (!differences || differences.length === 0) {
      // Show placeholder text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '50%');
      text.setAttribute('y', '50%');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.style.fill = getCSSVar('--widget-border-light');
      text.style.fontSize = '1rem';
      text.textContent = 'Click "Run" to start simulation';
      svg.appendChild(text);
      return;
    }
    
    // Get dimensions
    const containerRect = chartContainer.getBoundingClientRect();
    const width = containerRect.width || 800;
    const height = containerRect.height || 400;
    
    // Margins
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Create scales
    const xMin = 0;
    const xMax = n;
    const yValues = differences.map(d => d.difference);
    const yMin = Math.min(0, ...yValues);
    const yMax = Math.max(0, ...yValues);
    const yRange = yMax - yMin;
    const yPadding = yRange * 0.1;
    
    const xScale = (trial) => margin.left + (trial / xMax) * chartWidth;
    const yScale = (diff) => margin.top + chartHeight - ((diff - (yMin - yPadding)) / (yRange + 2 * yPadding)) * chartHeight;
    
    // Chart group
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Draw axes
    // X-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', yScale(0));
    xAxis.setAttribute('x2', margin.left + chartWidth);
    xAxis.setAttribute('y2', yScale(0));
    xAxis.style.stroke = getCSSVar('--widget-text-primary');
    xAxis.style.strokeWidth = '2';
    chartGroup.appendChild(xAxis);
    
    // Y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', margin.top + chartHeight);
    yAxis.style.stroke = getCSSVar('--widget-text-primary');
    yAxis.style.strokeWidth = '1';
    chartGroup.appendChild(yAxis);
    
    // X-axis labels
    const xTicks = [0, n / 4, n / 2, 3 * n / 4, n];
    xTicks.forEach(tick => {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', xScale(tick));
      label.setAttribute('y', margin.top + chartHeight + 20);
      label.setAttribute('text-anchor', 'middle');
      label.style.fill = getCSSVar('--widget-text-primary');
      label.style.fontSize = '0.75rem';
      label.textContent = Math.round(tick);
      chartGroup.appendChild(label);
    });
    
    // X-axis label
    const xAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xAxisLabel.setAttribute('x', margin.left + chartWidth / 2);
    xAxisLabel.setAttribute('y', height - 5);
    xAxisLabel.setAttribute('text-anchor', 'middle');
    xAxisLabel.style.fill = getCSSVar('--widget-text-primary');
    xAxisLabel.style.fontSize = '0.875rem';
    xAxisLabel.textContent = 'Trial Number';
    chartGroup.appendChild(xAxisLabel);
    
    // Y-axis labels
    const yTicks = [yMin, (yMin + yMax) / 2, yMax];
    yTicks.forEach(tick => {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', margin.left - 10);
      label.setAttribute('y', yScale(tick));
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('dominant-baseline', 'middle');
      label.style.fill = getCSSVar('--widget-text-primary');
      label.style.fontSize = '0.75rem';
      label.textContent = tick.toFixed(3);
      chartGroup.appendChild(label);
    });
    
    // Y-axis label
    const yAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yAxisLabel.setAttribute('x', 15);
    yAxisLabel.setAttribute('y', margin.top + chartHeight / 2);
    yAxisLabel.setAttribute('text-anchor', 'middle');
    yAxisLabel.style.fill = getCSSVar('--widget-text-primary');
    yAxisLabel.style.fontSize = '0.875rem';
    yAxisLabel.setAttribute('transform', `rotate(-90, 15, ${margin.top + chartHeight / 2})`);
    yAxisLabel.textContent = mode === 'count' ? 'Count - Expected' : 'Proportion - p';
    chartGroup.appendChild(yAxisLabel);
    
    // Draw line
    const pathData = differences.map((d, i) => {
      const x = xScale(d.trial);
      const y = yScale(d.difference);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.style.stroke = getCSSVar('--widget-primary');
    path.style.strokeWidth = '2';
    path.setAttribute('data-testid', 'difference-line');
    chartGroup.appendChild(path);
    
    svg.appendChild(chartGroup);
  }
  
  // Event handlers
  nInput.addEventListener('input', () => {
    const value = parseInt(nInput.value, 10);
    if (!isNaN(value) && value >= 10 && value <= 10000) {
      n = value;
      model.set('n', n);
      runSimulation();
    }
  });
  
  pInput.addEventListener('input', () => {
    const value = parseFloat(pInput.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      p = value / 100;
      model.set('p', p);
      runSimulation();
    }
  });
  
  modeButton.addEventListener('click', () => {
    mode = mode === 'count' ? 'proportion' : 'count';
    modeButton.textContent = mode === 'count' ? 'Show: Count Difference' : 'Show: Proportion Difference';
    modeButton.setAttribute('aria-label', `Toggle between count and proportion difference (currently ${mode})`);
    model.set('mode', mode);
    
    // Re-calculate differences with new mode
    runSimulation();
  });
  
  // Append to element
  el.appendChild(container);
  
  // Initial render
  runSimulation();
  
  // Cleanup
  return () => {};
}

export default { render };
