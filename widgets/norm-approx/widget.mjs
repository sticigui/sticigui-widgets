/**
 * Normal Approximation Widget
 * 
 * Renders histogram of gravity dataset with normal curve overlay for comparison.
 * Fixed to the gravity dataset, always shows the normal approximation.
 * Displays area under both histogram and curve for the highlighted region.
 */

import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { bin } from 'd3-array';
import { line, area } from 'd3-shape';
import { fetchData } from '../../src/utils/fetchData.mjs';
import { mean, sampleSD, normalPDF, normalCDF } from '../../src/math/stats-math.mjs';
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
 * Compute histogram bins
 */
function computeBins(data, numBins) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  // Create exactly numBins - 1 thresholds for exactly numBins bins
  const thresholds = [];
  for (let i = 1; i < numBins; i++) {
    thresholds.push(min + (max - min) * i / numBins);
  }
  
  const binGenerator = bin()
    .domain([min, max])
    .thresholds(thresholds);
  
  return binGenerator(data);
}

/**
 * Render the histogram with normal curve overlay
 */
function renderHistogramWithNormal(svg, width, height, data, numBins, lo, hi, xLabel) {
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Clear previous content
  svg.selectAll('*').remove();

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Compute statistics
  const dataMean = mean(data);
  const dataSD = sampleSD(data);

  // Compute bins
  const bins = computeBins(data, numBins);

  // Calculate bin width for density scaling
  const binWidth = bins.length > 0 ? bins[0].x1 - bins[0].x0 : 1;
  const totalCount = data.length;

  // Create scales, making sure domain covers at least [lo, hi] so highlight is fully visible
  const xMin = Math.min(...data, lo);
  const xMax = Math.max(...data, hi);
  
  const xScale = scaleLinear()
    .domain([xMin, xMax])
    .range([0, innerWidth]);

  // Y-scale for density (not count)
  const maxDensity = Math.max(...bins.map(b => b.length / (totalCount * binWidth)));
  const normalPeakDensity = normalPDF(dataMean, dataMean, dataSD);
  const yMax = Math.max(maxDensity, normalPeakDensity) * 1.1;

  const yScale = scaleLinear()
    .domain([0, yMax])
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
    .text(xLabel || 'Value (Standard Units)');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -45)
    .attr('text-anchor', 'middle')
    .style('fill', getCSSVar('--widget-text-primary'))
    .style('font-size', '12px')
    .text('Density');

  // Draw histogram bars (as density)
  g.selectAll('.bar')
    .data(bins)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.x0))
    .attr('y', d => yScale(d.length / (totalCount * binWidth)))
    .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
    .attr('height', d => innerHeight - yScale(d.length / (totalCount * binWidth)))
    .style('fill', d => {
      // Check if bin overlaps with highlight range
      const binMid = (d.x0 + d.x1) / 2;
      return binMid >= lo && binMid <= hi
        ? getCSSVar('--widget-accent')
        : getCSSVar('--widget-primary');
    })
    .attr('opacity', 0.6)
    .style('stroke', getCSSVar('--widget-border-dark'))
    .style('stroke-width', '0.5');

  // Draw normal curve
  const numPoints = 200;
  const xValues = [];
  for (let i = 0; i < numPoints; i++) {
    xValues.push(xMin + (xMax - xMin) * i / (numPoints - 1));
  }
  const curveData = xValues.map(x => ({
    x,
    y: normalPDF(x, dataMean, dataSD)
  }));

  const lineGenerator = line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  // Draw full curve
  g.append('path')
    .datum(curveData)
    .attr('d', lineGenerator)
    .attr('fill', 'none')
    .style('stroke', getCSSVar('--widget-chart-line'))
    .style('stroke-width', '2');

  // Draw highlighted area under curve
  const highlightCurveData = curveData.filter(d => d.x >= lo && d.x <= hi);
  if (highlightCurveData.length > 0) {
    const areaGenerator = area()
      .x(d => xScale(d.x))
      .y0(innerHeight)
      .y1(d => yScale(d.y));

    g.append('path')
      .datum(highlightCurveData)
      .attr('d', areaGenerator)
      .style('fill', getCSSVar('--widget-chart-line'))
      .attr('opacity', 0.2);
  }
}

/**
 * Calculate proportion of data in range (histogram area)
 */
function calculateHistogramProportion(data, lo, hi) {
  const inRange = data.filter(d => d >= lo && d <= hi).length;
  return inRange / data.length;
}

/**
 * Calculate normal curve area in range
 */
function calculateNormalArea(data, lo, hi) {
  const dataMean = mean(data);
  const dataSD = sampleSD(data);
  return normalCDF(hi, dataMean, dataSD) - normalCDF(lo, dataMean, dataSD);
}

/**
 * Main render function
 */
async function render({ model, el }) {
  // Inject CSS
  injectStyles(el);
  
  // Load data
  const dataSpec = model.get('data') || '../../public-data/gravity.json';
  const datasets = await fetchData(dataSpec);
  const rawData = Object.values(datasets)[0]; // Use first (or only) dataset
  
  // Transform to standard units automatically since the original applet did this
  const m = mean(rawData);
  const sd = sampleSD(rawData);
  const data = rawData.map(x => (x - m) / sd);
  
  let title = model.get('title');
  let numBins = model.get('bins') !== undefined ? model.get('bins') : 10;
  let lo = model.get('lo') !== undefined ? model.get('lo') : -2;
  let hi = model.get('hi') !== undefined ? model.get('hi') : 2;

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

  // Create controls container
  const controls = document.createElement('div');
  controls.className = 'sg-mb-4 sg-flex sg-flex-wrap sg-gap-4 sg-items-center';

  // Bins input
  const binsGroup = document.createElement('div');
  binsGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
  const binsLabel = document.createElement('label');
  binsLabel.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
  binsLabel.textContent = 'Bins:';
  const binsInput = document.createElement('input');
  binsInput.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
  binsInput.type = 'number';
  binsInput.value = numBins;
  binsInput.min = '1';
  binsInput.step = '1';
  binsInput.style.width = '60px';
  binsInput.setAttribute('aria-label', 'Bins');
  binsGroup.appendChild(binsLabel);
  binsGroup.appendChild(binsInput);
  controls.appendChild(binsGroup);

  // Lo input
  const loGroup = document.createElement('div');
  loGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
  const loLabel = document.createElement('label');
  loLabel.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
  loLabel.textContent = 'Lower bound:';
  const loInput = document.createElement('input');
  loInput.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
  loInput.type = 'number';
  loInput.value = lo;
  loInput.step = '0.1';
  loInput.style.width = '80px';
  loInput.setAttribute('aria-label', 'Lower bound');
  loGroup.appendChild(loLabel);
  loGroup.appendChild(loInput);

  // Hi input
  const hiGroup = document.createElement('div');
  hiGroup.className = 'sg-flex sg-items-center sg-gap-2.5';
  const hiLabel = document.createElement('label');
  hiLabel.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
  hiLabel.textContent = 'Upper bound:';
  const hiInput = document.createElement('input');
  hiInput.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
  hiInput.type = 'number';
  hiInput.value = hi;
  hiInput.step = '0.1';
  hiInput.style.width = '80px';
  hiInput.setAttribute('aria-label', 'Upper bound');
  hiGroup.appendChild(hiLabel);
  hiGroup.appendChild(hiInput);

  controls.appendChild(loGroup);
  controls.appendChild(hiGroup);
  container.appendChild(controls);

  // Area displays
  const areaDisplay = document.createElement('div');
  areaDisplay.className = 'sg-bg-slate-50 dark:sg-bg-stone-800/50 sg-rounded-lg sg-border sg-border-slate-200 dark:sg-border-stone-700 sg-p-4 sg-mb-6';
  areaDisplay.setAttribute('data-testid', 'area-display');

  const histArea = document.createElement('div');
  histArea.style.marginBottom = '0.5rem';
  histArea.setAttribute('data-testid', 'hist-area');
  areaDisplay.appendChild(histArea);

  const normalArea = document.createElement('div');
  normalArea.setAttribute('data-testid', 'normal-area');
  areaDisplay.appendChild(normalArea);

  container.appendChild(areaDisplay);

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
    
    const xLabel = model.get('xLabel') || 'Value (Standard Units)';

    renderHistogramWithNormal(svg, width, height, data, numBins, lo, hi, xLabel);

    const histProp = calculateHistogramProportion(data, lo, hi);
    const normProp = calculateNormalArea(data, lo, hi);
    const count = Math.round(histProp * data.length);

    histArea.innerHTML = `<strong>Histogram area:</strong> ${histProp.toFixed(3)} (${count}/${data.length} values)`;
    normalArea.innerHTML = `<strong>Normal curve area:</strong> ${normProp.toFixed(3)}`;
  }

  // Event listeners
  binsInput.addEventListener('input', () => {
    const newBins = parseInt(binsInput.value, 10);
    if (!isNaN(newBins) && newBins >= 1) {
      numBins = newBins;
      model.set('bins', numBins);
      update();
    }
  });

  loInput.addEventListener('input', () => {
    const newLo = parseFloat(loInput.value);
    if (!isNaN(newLo)) {
      lo = newLo;
      if (lo > hi) {
        hi = lo;
        hiInput.value = hi;
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
        loInput.value = lo;
      }
      update();
    }
  });

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
