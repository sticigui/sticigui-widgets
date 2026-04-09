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
 * Compute histogram bins
 */
function computeBins(data, numBins) {
  const binGenerator = bin()
    .thresholds(numBins);
  
  return binGenerator(data);
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

  // Compute bins
  const bins = computeBins(data, numBins);

  // Create scales
  const xMin = Math.min(...data);
  const xMax = Math.max(...data);
  
  const xScale = scaleLinear()
    .domain([xMin, xMax])
    .range([0, innerWidth]);

  const yMax = Math.max(...bins.map(b => b.length));
  const yScale = scaleLinear()
    .domain([0, yMax])
    .range([innerHeight, 0]);

  // Create axes
  const xAxis = axisBottom(xScale)
    .ticks(8)
    .tickFormat(d => d.toExponential(1));
  
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
  const data = Object.values(datasets)[0]; // Use first (or only) dataset
  
  // Get initial state
  let title = model.get('title');
  let numBins = model.get('bins') || 20;
  let lo = model.get('lo') || -0.0001;
  let hi = model.get('hi') || 0.0001;

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

  // Create controls container
  const controls = document.createElement('div');
  controls.className = 'widget-controls';

  // Bins input
  const binsGroup = document.createElement('div');
  binsGroup.className = 'widget-input-group';
  const binsLabel = document.createElement('label');
  binsLabel.className = 'widget-label';
  binsLabel.textContent = 'Number of bins:';
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
  loLabel.textContent = 'Lower bound:';
  const loInput = document.createElement('input');
  loInput.className = 'widget-input';
  loInput.type = 'number';
  loInput.value = lo;
  loInput.step = '0.00001';
  loInput.setAttribute('aria-label', 'Lower bound');
  loGroup.appendChild(loLabel);
  loGroup.appendChild(loInput);

  // Hi input
  const hiGroup = document.createElement('div');
  hiGroup.className = 'widget-input-group';
  const hiLabel = document.createElement('label');
  hiLabel.className = 'widget-label';
  hiLabel.textContent = 'Upper bound:';
  const hiInput = document.createElement('input');
  hiInput.className = 'widget-input';
  hiInput.type = 'number';
  hiInput.value = hi;
  hiInput.step = '0.00001';
  hiInput.setAttribute('aria-label', 'Upper bound');
  hiGroup.appendChild(hiLabel);
  hiGroup.appendChild(hiInput);

  controls.appendChild(binsGroup);
  controls.appendChild(loGroup);
  controls.appendChild(hiGroup);
  container.appendChild(controls);

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

    const xLabel = model.get('xLabel') || 'Value';

    renderHistogram(svg, width, height, data, numBins, lo, hi, xLabel);

    const prop = calculateProportion(data, lo, hi);
    const count = Math.round(prop * data.length);
    propDisplay.textContent = `Proportion in range [${lo.toExponential(2)}, ${hi.toExponential(2)}]: ${prop.toFixed(3)} (${count}/${data.length} values)`;
  }

  // Event listeners
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
        hiInput.value = hi.toExponential(5);
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
        loInput.value = lo.toExponential(5);
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
