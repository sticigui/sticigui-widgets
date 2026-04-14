/**
 * Distribution Viewer Widget
 * 
 * Parameterized viewer for Normal, Chi-Square, and Student's t distributions.
 * Renders a probability density curve with user-selectable highlight region
 * and displays the area under the curve for that region.
 */

import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { line, area } from 'd3-shape';
import { range } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import {
  normalPDF,
  normalCDF,
  chiSquarePDF,
  chiSquareCDF,
  tPDF,
  tCDF
} from '../../src/math/stats-math.mjs';
import styles from './styles.css';

// Inject styles into document
function injectStyles() {
  if (!document.getElementById('distribution-viewer-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'distribution-viewer-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
}

// Helper to get CSS variable value
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Get distribution functions based on distribution type and parameters
 */
function getDistributionFunctions(distribution, params) {
  switch (distribution) {
    case 'normal':
      return {
        pdf: (x) => normalPDF(x, params.mean, params.sd),
        cdf: (x) => normalCDF(x, params.mean, params.sd)
      };
    case 'chisquare':
      return {
        pdf: (x) => chiSquarePDF(x, params.df),
        cdf: (x) => chiSquareCDF(x, params.df)
      };
    case 't':
      return {
        pdf: (x) => tPDF(x, params.df),
        cdf: (x) => tCDF(x, params.df)
      };
    default:
      throw new Error(`Unknown distribution: ${distribution}`);
  }
}

/**
 * Calculate sensible x-axis domain for each distribution
 */
function getXDomain(distribution, params) {
  switch (distribution) {
    case 'normal':
      return [params.mean - 4 * params.sd, params.mean + 4 * params.sd];
    case 'chisquare': {
      const df = params.df;
      return [0, df + 5 * Math.sqrt(2 * df)];
    }
    case 't': {
      const df = params.df;
      // Use wider domain for small df (heavy tails)
      return df < 3 ? [-8, 8] : [-5, 5];
    }
    default:
      return [-4, 4];
  }
}

/**
 * Render the probability density curve with highlighted region
 */
function renderCurve(svg, width, height, distribution, params, lo, hi) {
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Clear previous content
  svg.selectAll('*').remove();

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Get distribution functions and domain
  const { pdf, cdf } = getDistributionFunctions(distribution, params);
  const [xMin, xMax] = getXDomain(distribution, params);

  // Generate curve data
  const numPoints = 200;
  const xValues = range(numPoints).map(i => xMin + (xMax - xMin) * i / (numPoints - 1));
  const yValues = xValues.map(x => pdf(x));
  const yMax = Math.max(...yValues);

  // Create scales
  const xScale = scaleLinear()
    .domain([xMin, xMax])
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain([0, yMax * 1.05])
    .range([innerHeight, 0]);

  // Create axes
  const xAxis = axisBottom(xScale).ticks(8);
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

  // Create line and area generators
  const lineGenerator = line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  const areaGenerator = area()
    .x(d => xScale(d.x))
    .y0(innerHeight)
    .y1(d => yScale(d.y));

  const curveData = xValues.map((x, i) => ({ x, y: yValues[i] }));

  // Draw full curve
  g.append('path')
    .datum(curveData)
    .attr('d', lineGenerator)
    .attr('fill', 'none')
    .style('stroke', getCSSVar('--widget-primary'))
    .attr('stroke-width', 2);

  // Draw highlighted area
  const highlightData = curveData.filter(d => d.x >= lo && d.x <= hi);
  if (highlightData.length > 0) {
    g.append('path')
      .datum(highlightData)
      .attr('d', areaGenerator)
      .style('fill', getCSSVar('--widget-primary'))
      .attr('opacity', 0.3);
  }
}

/**
 * Calculate the probability in the highlighted region
 */
function calculateProbability(distribution, params, lo, hi) {
  const { cdf } = getDistributionFunctions(distribution, params);
  return cdf(hi) - cdf(lo);
}

/**
 * Main render function
 */
function render({ model, el }) {
  // Inject CSS
  injectStyles();

  // Get initial state
  let title = model.get('title');
  let distribution = model.get('distribution') || 'normal';
  let mean = model.get('mean') || 0;
  let sd = model.get('sd') || 1;
  let df = model.get('df') || 5;
  let lo = model.get('lo') || -1;
  let hi = model.get('hi') || 1;
  let showMeanSdSliders = model.get('show_mean_sd_sliders') || false;

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

  // Create controls container
  const controls = document.createElement('div');
  controls.className = 'widget-controls';
  controls.style.alignItems = 'flex-end';

  // Distribution selector
  const distGroup = document.createElement('div');
  distGroup.className = 'widget-input-group';
  distGroup.style.flexDirection = 'column';
  distGroup.style.alignItems = 'flex-start';
  const distLabel = document.createElement('label');
  distLabel.className = 'widget-label';
  distLabel.textContent = 'Distribution:';
  const distSelect = document.createElement('select');
  distSelect.className = 'widget-select';
  distSelect.setAttribute('aria-label', 'Distribution type');
  ['normal', 'chisquare', 't'].forEach(dist => {
    const option = document.createElement('option');
    option.value = dist;
    option.textContent = dist === 'chisquare' ? 'Chi-Square' : 
                         dist === 't' ? "Student's t" : 'Normal';
    if (dist === distribution) option.selected = true;
    distSelect.appendChild(option);
  });
  distGroup.appendChild(distLabel);
  distGroup.appendChild(distSelect);
  controls.appendChild(distGroup);

  // Parameter inputs container
  const paramsContainer = document.createElement('div');
  paramsContainer.style.display = 'flex';
  paramsContainer.style.gap = '1rem';
  paramsContainer.style.flexWrap = 'wrap';

  // Mean input (for normal)
  const meanGroup = document.createElement('div');
  meanGroup.className = 'widget-input-group';
  meanGroup.style.flexDirection = 'column';
  meanGroup.style.alignItems = 'flex-start';
  const meanLabel = document.createElement('label');
  meanLabel.className = 'widget-label';
  meanLabel.textContent = 'Mean:';
  const meanInput = document.createElement('input');
  meanInput.className = 'widget-input';
  meanInput.type = 'number';
  meanInput.value = mean;
  meanInput.step = '0.1';
  meanInput.setAttribute('aria-label', 'Mean');
  meanGroup.appendChild(meanLabel);
  meanGroup.appendChild(meanInput);

  // SD input (for normal)
  const sdGroup = document.createElement('div');
  sdGroup.className = 'widget-input-group';
  sdGroup.style.flexDirection = 'column';
  sdGroup.style.alignItems = 'flex-start';
  const sdLabel = document.createElement('label');
  sdLabel.className = 'widget-label';
  sdLabel.textContent = 'SD:';
  const sdInput = document.createElement('input');
  sdInput.className = 'widget-input';
  sdInput.type = 'number';
  sdInput.value = sd;
  sdInput.step = '0.1';
  sdInput.min = '0.01';
  sdInput.setAttribute('aria-label', 'Standard deviation');
  sdGroup.appendChild(sdLabel);
  sdGroup.appendChild(sdInput);

  // DF input (for chisquare and t)
  const dfGroup = document.createElement('div');
  dfGroup.className = 'widget-input-group';
  dfGroup.style.flexDirection = 'column';
  dfGroup.style.alignItems = 'flex-start';
  const dfLabel = document.createElement('label');
  dfLabel.className = 'widget-label';
  dfLabel.textContent = 'Degrees of Freedom:';
  const dfInput = document.createElement('input');
  dfInput.className = 'widget-input';
  dfInput.type = 'number';
  dfInput.value = df;
  dfInput.step = '1';
  dfInput.min = '1';
  dfInput.setAttribute('aria-label', 'Degrees of freedom');
  dfGroup.appendChild(dfLabel);
  dfGroup.appendChild(dfInput);

  paramsContainer.appendChild(meanGroup);
  paramsContainer.appendChild(sdGroup);
  paramsContainer.appendChild(dfGroup);
  controls.appendChild(paramsContainer);

  // Range controls
  const rangeContainer = document.createElement('div');
  rangeContainer.style.display = 'flex';
  rangeContainer.style.gap = '1rem';
  rangeContainer.style.flexWrap = 'wrap';

  // Lo input
  const loGroup = document.createElement('div');
  loGroup.className = 'widget-input-group';
  loGroup.style.flexDirection = 'column';
  loGroup.style.alignItems = 'flex-start';
  const loLabel = document.createElement('label');
  loLabel.className = 'widget-label';
  loLabel.textContent = 'Lower bound:';
  const loInput = document.createElement('input');
  loInput.className = 'widget-input';
  loInput.type = 'number';
  loInput.value = lo;
  loInput.step = '0.1';
  loInput.style.width = '100px';
  loInput.setAttribute('aria-label', 'Lower bound');
  loGroup.appendChild(loLabel);
  loGroup.appendChild(loInput);

  // Hi input
  const hiGroup = document.createElement('div');
  hiGroup.className = 'widget-input-group';
  hiGroup.style.flexDirection = 'column';
  hiGroup.style.alignItems = 'flex-start';
  const hiLabel = document.createElement('label');
  hiLabel.className = 'widget-label';
  hiLabel.textContent = 'Upper bound:';
  const hiInput = document.createElement('input');
  hiInput.className = 'widget-input';
  hiInput.type = 'number';
  hiInput.value = hi;
  hiInput.step = '0.1';
  hiInput.style.width = '100px';
  hiInput.setAttribute('aria-label', 'Upper bound');
  hiGroup.appendChild(hiLabel);
  hiGroup.appendChild(hiInput);

  rangeContainer.appendChild(loGroup);
  rangeContainer.appendChild(hiGroup);
  controls.appendChild(rangeContainer);

  container.appendChild(controls);

  // Probability display
  const probDisplay = document.createElement('div');
  probDisplay.className = 'widget-display';
  probDisplay.setAttribute('data-testid', 'prob-display');
  container.appendChild(probDisplay);

  // SVG container
  const svgContainer = document.createElement('div');
  svgContainer.className = 'widget-chart-container';
  container.appendChild(svgContainer);

  const svg = select(svgContainer)
    .append('svg')
    .attr('class', 'widget-chart-svg')
    .attr('width', '100%')
    .attr('height', 400);

  let width = svgContainer.clientWidth;
  let height = 400;

  // Update parameter visibility based on distribution
  function updateParamVisibility() {
    if (distribution === 'normal') {
      meanGroup.style.display = showMeanSdSliders ? 'block' : 'none';
      sdGroup.style.display = showMeanSdSliders ? 'block' : 'none';
      dfGroup.style.display = 'none';
    } else {
      meanGroup.style.display = 'none';
      sdGroup.style.display = 'none';
      dfGroup.style.display = 'block';
    }
  }

  // Update display
  function update() {
    const params = distribution === 'normal' 
      ? { mean, sd }
      : { df };

    width = svgContainer.clientWidth;
    height = 400;

    renderCurve(svg, width, height, distribution, params, lo, hi);

    const prob = calculateProbability(distribution, params, lo, hi);
    probDisplay.textContent = `Selected area: ${(prob * 100).toFixed(4)}%`;
  }

  // Event listeners
  distSelect.addEventListener('change', () => {
    distribution = distSelect.value;
    updateParamVisibility();
    
    // Set sensible default range for new distribution
    const [xMin, xMax] = getXDomain(distribution, 
      distribution === 'normal' ? { mean, sd } : { df });
    const range = xMax - xMin;
    lo = xMin + range * 0.3;
    hi = xMin + range * 0.7;
    loInput.value = lo.toFixed(2);
    hiInput.value = hi.toFixed(2);
    
    update();
  });

  meanInput.addEventListener('input', () => {
    mean = parseFloat(meanInput.value) || 0;
    update();
  });

  sdInput.addEventListener('input', () => {
    const newSd = parseFloat(sdInput.value);
    if (newSd > 0) {
      sd = newSd;
      update();
    }
  });

  dfInput.addEventListener('input', () => {
    const newDf = parseInt(dfInput.value);
    if (newDf >= 1) {
      df = newDf;
      update();
    }
  });

  loInput.addEventListener('input', () => {
    const newLo = parseFloat(loInput.value);
    if (!isNaN(newLo)) {
      lo = newLo;
      if (lo > hi) {
        hi = lo;
        hiInput.value = hi.toFixed(2);
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
        loInput.value = lo.toFixed(2);
      }
      update();
    }
  });

  // Handle resize
  const resizeObserver = new ResizeObserver(() => {
    update();
  });
  resizeObserver.observe(svgContainer);

  // Append container to element
  el.appendChild(container);

  // Initial render
  updateParamVisibility();
  update();

  // Cleanup
  return () => {
    resizeObserver.disconnect();
  };
}

export default { render };
