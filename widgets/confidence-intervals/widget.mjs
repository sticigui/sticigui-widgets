/**
 * Confidence Intervals Widget
 * 
 * Simulates drawing samples and constructing confidence intervals.
 * Displays horizontal CI bars colored by whether they cover the true parameter.
 * 
 * Model state:
 * - population: "normal" (default, mean=0, sd=1)
 * - n: sample size (default: 30)
 * - confidence: confidence level (default: 0.95)
 * - samples_per_click: number of samples per click (default: 20)
 * - seed: PRNG seed (default: 42)
 */

import { PRNG } from '../../src/sim/prng.mjs';
import { tQuantile } from '../../src/math/stats-math.mjs';
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
  let population = model.get('population') || 'normal';
  let n = model.get('n') || 30;
  let confidence = model.get('confidence') || 0.95;
  let samplesPerClick = model.get('samples_per_click') || 20;
  let seed = model.get('seed') || 42;
  
  // True population parameters (fixed for normal)
  const TRUE_MEAN = 0;
  const TRUE_SD = 1;
  
  // Confidence intervals history (not stored in model)
  let intervals = [];
  
  // Create container
  const container = document.createElement('div');
  container.className = 'sg-font-sans sg-p-6 sg-max-w-[800px] sg-bg-white dark:sg-bg-stone-950 sg-rounded-xl sg-shadow-sm sg-border sg-border-slate-200 dark:sg-border-stone-800 sg-text-slate-900 dark:sg-text-stone-100 sg-widget-root sg-transition-colors';
  
  // Create title if specified
  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.className = 'sg-m-0 sg-mb-6 sg-text-2xl sg-font-semibold sg-tracking-tight sg-text-slate-900 dark:sg-text-stone-100';
    titleEl.textContent = title;
    container.appendChild(titleEl);
  }
  
  // Create controls container
  const controls = document.createElement('div');
  controls.className = 'sg-mb-4 sg-flex sg-flex-wrap sg-gap-4 sg-items-center';
  controls.style.alignItems = 'flex-end';
  
  // Helper to create labeled input
  function createInput(labelText, type, value, min, max, step, testId) {
    const wrapper = document.createElement('div');
    wrapper.className = 'sg-flex sg-flex-col sg-gap-1';

    const label = document.createElement('label');
    label.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
    label.textContent = labelText;
    wrapper.appendChild(label);

    const input = document.createElement('input');
    input.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
    input.type = type;
    input.value = value;
    input.style.width = '100px';
    if (min !== undefined) input.min = min;
    if (max !== undefined) input.max = max;
    if (step !== undefined) input.step = step;
    if (testId) input.setAttribute('data-testid', testId);
    wrapper.appendChild(input);

    return { wrapper, input };
  }
  
  // Sample size input
  const nInput = createInput('Sample size (n):', 'number', n, 2, 1000, 1, 'n-input');
  controls.appendChild(nInput.wrapper);
  
  // Confidence level input
  const confInput = createInput('Confidence level:', 'number', confidence, 0.5, 0.999, 0.01, 'confidence-input');
  controls.appendChild(confInput.wrapper);
  
  // Samples per click input
  const spcInput = createInput('Samples per click:', 'number', samplesPerClick, 1, 100, 1, 'samples-per-click-input');
  controls.appendChild(spcInput.wrapper);
  
  // Take sample button
  const sampleButton = document.createElement('button');
  sampleButton.className = 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950';
  sampleButton.textContent = 'Take Sample';
  sampleButton.setAttribute('data-testid', 'sample-button');
  sampleButton.setAttribute('aria-label', 'Take sample and compute confidence intervals');
  controls.appendChild(sampleButton);
  
  // Clear button
  const clearButton = document.createElement('button');
  clearButton.className = 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950';
  clearButton.textContent = 'Clear';
  clearButton.setAttribute('data-testid', 'clear-button');
  clearButton.setAttribute('aria-label', 'Clear all confidence intervals');
  controls.appendChild(clearButton);
  
  container.appendChild(controls);
  
  // Coverage summary
  const summary = document.createElement('div');
  summary.className = 'sg-mb-4 sg-text-sm sg-text-slate-900 dark:sg-text-stone-200';
  summary.setAttribute('data-testid', 'coverage-summary');
  container.appendChild(summary);
  
  // Chart container
  const chartContainer = document.createElement('div');
  chartContainer.style.width = '100%';
  chartContainer.style.height = '400px';
  chartContainer.style.border = `1px solid ${getCSSVar('--widget-border-light')}`;
  chartContainer.style.borderRadius = '4px';
  chartContainer.style.background = getCSSVar('--widget-bg-primary');
  chartContainer.style.position = 'relative';
  chartContainer.style.overflowY = 'auto';
  chartContainer.setAttribute('data-testid', 'chart-container');
  container.appendChild(chartContainer);
  
  // SVG for chart
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = '100%';
  svg.style.minHeight = '100%';
  chartContainer.appendChild(svg);
  
  /**
   * Update coverage summary
   */
  function updateSummary() {
    if (intervals.length === 0) {
      summary.textContent = 'No samples taken yet. Click "Take Sample" to begin.';
      return;
    }
    
    const covering = intervals.filter(ci => ci.covers).length;
    const total = intervals.length;
    const coverage = (covering / total * 100).toFixed(1);
    
    summary.textContent = `Coverage: ${covering}/${total} (${coverage}%) | Expected: ${(confidence * 100).toFixed(0)}%`;
  }
  
  /**
   * Take samples and compute confidence intervals
   */
  function takeSamples() {
    const prng = new PRNG(seed);
    
    // Draw samples and compute CIs
    for (let s = 0; s < samplesPerClick; s++) {
      const sample = [];
      
      // Draw n values from normal(0, 1)
      for (let i = 0; i < n; i++) {
        sample.push(prng.nextNormal(TRUE_MEAN, TRUE_SD));
      }
      
      // Compute sample mean
      const sampleMean = sample.reduce((sum, x) => sum + x, 0) / n;
      
      // Compute sample SD
      const sampleSD = Math.sqrt(
        sample.reduce((sum, x) => sum + Math.pow(x - sampleMean, 2), 0) / (n - 1)
      );
      
      // Compute standard error
      const se = sampleSD / Math.sqrt(n);
      
      // Compute t-critical value for confidence level
      const alpha = 1 - confidence;
      const tCrit = tQuantile(1 - alpha / 2, n - 1);
      
      // Compute CI
      const marginOfError = tCrit * se;
      const lower = sampleMean - marginOfError;
      const upper = sampleMean + marginOfError;
      
      // Check if CI covers true mean
      const covers = lower <= TRUE_MEAN && TRUE_MEAN <= upper;
      
      intervals.push({
        lower,
        upper,
        mean: sampleMean,
        covers
      });
    }
    
    // Keep only 100 most recent intervals
    if (intervals.length > 100) {
      intervals = intervals.slice(intervals.length - 100);
    }
    
    // Increment seed for next batch
    seed = seed + 1;
    model.set('seed', seed);
    
    renderChart();
    updateSummary();
  }
  
  /**
   * Render chart
   */
  function renderChart() {
    // Clear SVG
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    if (intervals.length === 0) {
      return;
    }
    
    // Get dimensions
    const containerRect = chartContainer.getBoundingClientRect();
    const width = containerRect.width;
    
    // Calculate height based on number of intervals
    const barHeight = 8;
    const barSpacing = 2;
    const margin = { top: 20, right: 20, bottom: 20, left: 60 };
    const totalBarsHeight = intervals.length * (barHeight + barSpacing);
    const height = Math.max(400, totalBarsHeight + margin.top + margin.bottom);
    
    svg.setAttribute('height', height);
    
    const chartWidth = width - margin.left - margin.right;
    
    // Find data range
    const allValues = intervals.flatMap(ci => [ci.lower, ci.upper]);
    const dataMin = Math.min(...allValues, TRUE_MEAN);
    const dataMax = Math.max(...allValues, TRUE_MEAN);
    const dataRange = dataMax - dataMin;
    const padding = dataRange * 0.1;
    
    const xMin = dataMin - padding;
    const xMax = dataMax + padding;
    
    // Create scale
    const xScale = (value) => margin.left + ((value - xMin) / (xMax - xMin)) * chartWidth;
    
    // Chart group
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Draw vertical line at true mean
    const trueMeanLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    trueMeanLine.setAttribute('x1', xScale(TRUE_MEAN));
    trueMeanLine.setAttribute('y1', margin.top);
    trueMeanLine.setAttribute('x2', xScale(TRUE_MEAN));
    trueMeanLine.setAttribute('y2', height - margin.bottom);
    trueMeanLine.setAttribute('stroke-width', '2');
    trueMeanLine.setAttribute('stroke-dasharray', '4');
    trueMeanLine.style.stroke = getCSSVar('--widget-border-dark');
    chartGroup.appendChild(trueMeanLine);
    
    // Draw CI bars
    intervals.forEach((ci, i) => {
      const y = margin.top + i * (barHeight + barSpacing);
      const x1 = xScale(ci.lower);
      const x2 = xScale(ci.upper);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y + barHeight / 2);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y + barHeight / 2);
      line.setAttribute('stroke-width', barHeight);
      line.setAttribute('data-testid', 'ci-bar');
      line.style.stroke = ci.covers ? getCSSVar('--widget-primary') : getCSSVar('--widget-chart-line');
      chartGroup.appendChild(line);
    });
    
    // Draw x-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', height - margin.bottom);
    xAxis.setAttribute('x2', margin.left + chartWidth);
    xAxis.setAttribute('y2', height - margin.bottom);
    xAxis.setAttribute('stroke-width', '1');
    xAxis.style.stroke = getCSSVar('--widget-border-dark');
    chartGroup.appendChild(xAxis);
    
    // X-axis ticks and labels
    const xTicks = [xMin, (xMin + xMax) / 2, xMax];
    xTicks.forEach(tick => {
      const tickLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tickLine.setAttribute('x1', xScale(tick));
      tickLine.setAttribute('y1', height - margin.bottom);
      tickLine.setAttribute('x2', xScale(tick));
      tickLine.setAttribute('y2', height - margin.bottom + 5);
      tickLine.style.stroke = getCSSVar('--widget-border-dark');
      chartGroup.appendChild(tickLine);
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', xScale(tick));
      label.setAttribute('y', height - margin.bottom + 18);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '0.75rem');
      label.style.fill = getCSSVar('--widget-text-primary');
      label.textContent = tick.toFixed(2);
      chartGroup.appendChild(label);
    });
    
    // Y-axis label (number of intervals)
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', 10);
    yLabel.setAttribute('y', margin.top + 10);
    yLabel.setAttribute('font-size', '0.75rem');
    yLabel.style.fill = getCSSVar('--widget-text-primary');
    yLabel.textContent = `n = ${intervals.length}`;
    chartGroup.appendChild(yLabel);
    
    svg.appendChild(chartGroup);
  }
  
  // Event handlers
  nInput.input.addEventListener('input', () => {
    const value = parseInt(nInput.input.value, 10);
    if (!isNaN(value) && value >= 2 && value <= 1000) {
      n = value;
      model.set('n', n);
    }
  });
  
  confInput.input.addEventListener('input', () => {
    const value = parseFloat(confInput.input.value);
    if (!isNaN(value) && value >= 0.5 && value <= 0.999) {
      confidence = value;
      model.set('confidence', confidence);
      updateSummary();
    }
  });
  
  spcInput.input.addEventListener('input', () => {
    const value = parseInt(spcInput.input.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 100) {
      samplesPerClick = value;
      model.set('samples_per_click', samplesPerClick);
    }
  });
  
  sampleButton.addEventListener('click', () => {
    takeSamples();
  });
  
  clearButton.addEventListener('click', () => {
    intervals = [];
    renderChart();
    updateSummary();
  });
  
  // Append to element
  el.appendChild(container);
  
  // Initial render
  updateSummary();
  
  // Cleanup
  return () => {
    el.innerHTML = '';
  };
}

export default { render };
