/**
 * Binomial Histogram Widget
 * 
 * Renders the binomial(n, p) probability mass function as a histogram.
 * User can select a range of outcomes and see P(lo ≤ X ≤ hi).
 * Optional normal curve overlay for approximation visualization.
 * 
 * Model state:
 * - n: number of trials (1-200)
 * - p: probability of success (0-1)
 * - lo: lower bound for highlighted region
 * - hi: upper bound for highlighted region
 * - show_normal: whether to show normal approximation curve
 */

import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { binomialPMF, binomialCDFRange, normalPDF } from '../../src/math/stats-math.mjs';
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

export default {
  render({ model, el }) {
    console.log('[binhist] render called', { model, el });
    
    // Inject CSS
    injectStyles(el);
    
    // Get initial state from model
    let n = model.get('n') || 10;
    let p = model.get('p') || 0.5;
    let lo = model.get('lo') !== undefined ? model.get('lo') : 3;
    let hi = model.get('hi') !== undefined ? model.get('hi') : 7;
    let showNormal = model.get('show_normal') || false;
    let curvePoints = model.get('curve_points') || 200;
    let title = model.get('title');
    
    console.log('[binhist] initial state', { n, p, lo, hi, showNormal, curvePoints });

    // Validate and constrain initial values
    n = Math.max(1, Math.min(200, Math.floor(n)));
    p = Math.max(0.001, Math.min(0.999, p));
    lo = Math.max(0, Math.min(n, Math.floor(lo)));
    hi = Math.max(0, Math.min(n, Math.floor(hi)));
    if (lo > hi) [lo, hi] = [hi, lo];

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
    container.appendChild(controls);

    // Helper to create labeled input
    function createInput(labelText, type, value, min, max, step) {
      const wrapper = document.createElement('div');
      wrapper.className = 'sg-flex sg-items-center sg-gap-2.5';

      const label = document.createElement('label');
      label.className = 'sg-text-sm sg-font-medium sg-text-slate-700 dark:sg-text-stone-300';
      label.textContent = labelText;
      wrapper.appendChild(label);

      const input = document.createElement('input');
      input.className = 'sg-px-3 sg-py-2 sg-text-sm sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-900 dark:sg-text-stone-100 sg-shadow-sm sg-transition-colors hover:sg-border-slate-400 dark:hover:sg-border-stone-500 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:border-blue-500';
      input.type = type;
      input.value = value;
      if (min !== undefined) input.min = min;
      if (max !== undefined) input.max = max;
      if (step !== undefined) input.step = step;
      label.appendChild(input);

      return { wrapper, input };
    }

    // Create n input
    const nInput = createInput('n (trials):', 'number', n, 1, 200, 1);
    controls.appendChild(nInput.wrapper);

    // Create p input
    const pInput = createInput('p (success prob):', 'number', p, 0.001, 0.999, 0.001);
    controls.appendChild(pInput.wrapper);

    // Create lo input
    const loInput = createInput('Highlight from:', 'number', lo, 0, n, 1);
    controls.appendChild(loInput.wrapper);

    // Create hi input
    const hiInput = createInput('to:', 'number', hi, 0, n, 1);
    controls.appendChild(hiInput.wrapper);

    // Create curve_points input
    const curvePointsInput = createInput('Curve Points:', 'number', curvePoints, 10, 1000, 10);
    controls.appendChild(curvePointsInput.wrapper);

    // Create normal curve toggle
    const normalToggle = document.createElement('button');
    normalToggle.className = showNormal ? 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950' : 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950';
    normalToggle.textContent = showNormal ? 'Hide Normal Curve' : 'Show Normal Curve';
    controls.appendChild(normalToggle);

    // Create probability display
    const probDisplay = document.createElement('div');
    probDisplay.className = 'sg-mb-4 sg-text-sm sg-text-slate-900 dark:sg-text-stone-200';
    container.appendChild(probDisplay);

    // Create SVG container
    const svgContainer = document.createElement('div');
    svgContainer.className = 'widget-chart-container';
    container.appendChild(svgContainer);

    const svg = select(svgContainer)
      .append('svg')
      .attr('class', 'widget-chart-svg')
      .attr('width', '100%')
      .attr('height', 400);

    // Chart dimensions
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    let width = svgContainer.clientWidth;
    let height = 400;
    let chartWidth = width - margin.left - margin.right;
    let chartHeight = height - margin.top - margin.bottom;

    // Create chart group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create groups for bars and normal curve
    const barsGroup = g.append('g').attr('class', 'bars');
    const normalGroup = g.append('g').attr('class', 'normal-curve');
    const xAxisGroup = g.append('g').attr('class', 'x-axis');
    const yAxisGroup = g.append('g').attr('class', 'y-axis');

    // Add axis labels
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', margin.left + chartWidth / 2)
      .attr('y', height - 5)
      .style('font-size', '12px')
      .style('fill', getCSSVar('--widget-text-primary'))
      .text('Number of Successes');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(15,${margin.top + chartHeight / 2}) rotate(-90)`)
      .style('font-size', '12px')
      .style('fill', getCSSVar('--widget-text-primary'))
      .text('Probability');

    /**
     * Update the histogram visualization
     */
    function updateChart() {
      // Calculate binomial PMF for all k from 0 to n
      const data = [];
      let maxProb = 0;

      for (let k = 0; k <= n; k++) {
        const prob = binomialPMF(k, n, p);
        data.push({ k, prob });
        maxProb = Math.max(maxProb, prob);
      }

      // Create scales
      const xScale = (k) => (k / n) * chartWidth;
      const yScale = (prob) => chartHeight - (prob / maxProb) * chartHeight * 0.95;
      const barWidth = chartWidth / (n + 1);

      // Update axes
      xAxisGroup
        .attr('transform', `translate(0,${chartHeight})`)
        .selectAll('*').remove();
      
      // Simple x-axis ticks
      const xTicks = xAxisGroup.selectAll('.tick')
        .data(data.filter((d, i) => i % Math.max(1, Math.ceil(n / 10)) === 0))
        .enter()
        .append('g')
        .attr('class', 'tick axis-tick')
        .attr('transform', d => `translate(${xScale(d.k) + barWidth / 2},0)`);

      xTicks.append('line')
        .attr('y2', 6)
        .style('stroke', getCSSVar('--widget-border-dark'));

      xTicks.append('text')
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('fill', getCSSVar('--widget-text-primary'))
        .text(d => d.k);

      // Y-axis
      yAxisGroup.selectAll('*').remove();
      const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map(t => t * maxProb);
      
      const yTicksGroup = yAxisGroup.selectAll('.tick')
        .data(yTicks)
        .enter()
        .append('g')
        .attr('class', 'tick axis-tick')
        .attr('transform', d => `translate(0,${yScale(d)})`);

      yTicksGroup.append('line')
        .attr('x2', -6)
        .style('stroke', getCSSVar('--widget-border-dark'));

      yTicksGroup.append('text')
        .attr('x', -10)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '11px')
        .style('fill', getCSSVar('--widget-text-primary'))
        .text(d => d.toFixed(3));

      // Draw bars
      const bars = barsGroup.selectAll('rect').data(data);

      bars.enter()
        .append('rect')
        .merge(bars)
        .attr('x', d => xScale(d.k))
        .attr('y', d => yScale(d.prob))
        .attr('width', Math.max(1, barWidth - 1))
        .attr('height', d => chartHeight - yScale(d.prob))
        .style('fill', d => {
          const isHighlighted = d.k >= lo && d.k <= hi;
          return isHighlighted ? getCSSVar('--widget-primary-highlight') : getCSSVar('--widget-primary');
        })
        .style('stroke', getCSSVar('--widget-border-dark'))
        .style('stroke-width', '0.5');

      bars.exit().remove();

      // Draw normal curve if enabled
      normalGroup.selectAll('*').remove();

      if (showNormal) {
        const mean = n * p;
        const stdDev = Math.sqrt(n * p * (1 - p));
        const points = [];

        // Generate a smooth curve with many points across the x-axis range
        const numPoints = curvePoints;
        const xMin = -0.5;
        const xMax = n + 0.5;
        const step = (xMax - xMin) / numPoints;

        for (let i = 0; i <= numPoints; i++) {
          const x = xMin + i * step;
          const y = normalPDF(x, mean, stdDev);
          points.push({ x, y }); 
        }

        const lineGen = line()
          .x(d => xScale(d.x) + barWidth / 2)
          .y(d => yScale(d.y));

        normalGroup.append('path')
          .datum(points)
          .attr('d', lineGen)
          .attr('fill', 'none')
          .style('stroke', getCSSVar('--widget-chart-line'))
          .style('stroke-width', '2');
      }

      // Update probability display
      const prob = binomialCDFRange(lo, hi, n, p);
      probDisplay.textContent = `P(${lo} ≤ X ≤ ${hi}) = ${prob.toFixed(6)} = ${(prob * 100).toFixed(4)}%`;
    }

    // Event handlers
    nInput.input.addEventListener('change', () => {
      console.log('[binhist] n input changed, old:', n, 'new:', nInput.input.value);
      const newN = Math.max(1, Math.min(200, Math.floor(parseFloat(nInput.input.value) || 10)));
      n = newN;
      nInput.input.value = n;
      lo = Math.min(lo, n);
      hi = Math.min(hi, n);
      loInput.input.max = n;
      hiInput.input.max = n;
      loInput.input.value = lo;
      hiInput.input.value = hi;
      model.set('n', n);
      console.log('[binhist] calling updateChart after n change');
      updateChart();
    });

    pInput.input.addEventListener('change', () => {
      console.log('[binhist] p input changed, old:', p, 'new:', pInput.input.value);
      const newP = Math.max(0.001, Math.min(0.999, parseFloat(pInput.input.value) || 0.5));
      p = newP;
      pInput.input.value = p;
      model.set('p', p);
      console.log('[binhist] calling updateChart after p change');
      updateChart();
    });

    loInput.input.addEventListener('change', () => {
      let newLo = Math.max(0, Math.min(n, Math.floor(parseFloat(loInput.input.value) || 0)));
      if (newLo > hi) newLo = hi;
      lo = newLo;
      loInput.input.value = lo;
      model.set('lo', lo);
      updateChart();
    });

    hiInput.input.addEventListener('change', () => {
      let newHi = Math.max(0, Math.min(n, Math.floor(parseFloat(hiInput.input.value) || n)));
      if (newHi < lo) newHi = lo;
      hi = newHi;
      hiInput.input.value = hi;
      model.set('hi', hi);
      updateChart();
    });

    curvePointsInput.input.addEventListener('change', () => {
      const newPoints = Math.max(10, Math.min(1000, Math.floor(parseFloat(curvePointsInput.input.value) || 200)));
      curvePoints = newPoints;
      curvePointsInput.input.value = curvePoints;
      model.set('curve_points', curvePoints);
      updateChart();
    });

    normalToggle.addEventListener('click', () => {
      showNormal = !showNormal;
      normalToggle.textContent = showNormal ? 'Hide Normal Curve' : 'Show Normal Curve';
      normalToggle.className = showNormal ? 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950' : 'sg-px-4 sg-py-2 sg-text-sm sg-font-medium sg-border sg-border-slate-300 dark:sg-border-stone-700 sg-rounded-md sg-bg-white dark:sg-bg-stone-900 sg-text-slate-700 dark:sg-text-stone-200 sg-shadow-sm sg-cursor-pointer sg-transition-colors hover:sg-bg-slate-50 dark:hover:sg-bg-stone-800 sg-focus:outline-none sg-focus:ring-2 sg-focus:ring-blue-500 sg-focus:ring-offset-2 dark:sg-focus:ring-offset-stone-950';
      model.set('show_normal', showNormal);
      updateChart();
    });

    // Handle window resize
    const resizeObserver = new ResizeObserver(() => {
      width = svgContainer.clientWidth;
      // height is fixed at 400px, don't update it
      chartWidth = width - margin.left - margin.right;
      // chartHeight remains constant since height is fixed
      
      svg.attr('width', width);
      // Don't update height - it's fixed
      
      // Update x-axis label position (horizontal only)
      svg.selectAll('text').filter(function() {
        return this.textContent === 'Number of Successes';
      }).attr('x', margin.left + chartWidth / 2);
      
      // Y-axis label position doesn't change since height is fixed
      
      updateChart();
    });

    resizeObserver.observe(svgContainer);

    // Append to element BEFORE initial render so dimensions are available
    el.appendChild(container);

    // Initial render - use requestAnimationFrame to ensure layout is complete
    requestAnimationFrame(() => {
      width = svgContainer.clientWidth;
      // height is already set to 400px, don't read from container
      chartWidth = width - margin.left - margin.right;
      // chartHeight is already calculated from fixed height
      console.log('[binhist] initial dimensions', { width, height, chartWidth, chartHeight });
      updateChart();
    });

    // Cleanup function
    return () => {
      resizeObserver.disconnect();
      el.innerHTML = '';
    };
  }
};
