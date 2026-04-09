/**
 * Reusable histogram renderer
 * Creates and updates histogram visualizations
 */

import { select } from 'd3-selection';
import { createLinearScale } from './scales.mjs';
import { createBottomAxis, createLeftAxis, styleAxis } from './axes.mjs';

/**
 * Create a histogram renderer
 * @param {Selection} svgSelection - D3 selection of SVG element
 * @param {Object} options - configuration options
 * @param {number} options.width - chart width
 * @param {number} options.height - chart height
 * @param {Object} options.margin - margins {top, right, bottom, left}
 * @param {Array<number>} options.xDomain - x-axis domain [min, max]
 * @param {Array<number>} options.yDomain - y-axis domain [min, max]
 * @param {string} options.color - bar fill color
 * @param {string} options.highlightColor - highlighted bar color
 * @returns {Object} histogram API with update method
 */
export function createHistogram(svgSelection, options) {
  const {
    width,
    height,
    margin = { top: 20, right: 20, bottom: 40, left: 50 },
    xDomain,
    yDomain,
    color = 'var(--color-primary, steelblue)',
    highlightColor = 'var(--color-accent, orange)',
  } = options;

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Clear existing content
  svgSelection.selectAll('*').remove();

  // Create main group with margins
  const g = svgSelection
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create scales
  let xScale = createLinearScale(xDomain, [0, chartWidth]);
  let yScale = createLinearScale(yDomain, [chartHeight, 0]);

  // Create axes
  const xAxisGroup = g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${chartHeight})`);

  const yAxisGroup = g.append('g')
    .attr('class', 'y-axis');

  // Create bars container
  const barsGroup = g.append('g').attr('class', 'bars');

  // Initial axis render
  updateAxes();

  /**
   * Update axes
   */
  function updateAxes() {
    const xAxis = createBottomAxis(xScale);
    const yAxis = createLeftAxis(yScale);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    styleAxis(xAxisGroup);
    styleAxis(yAxisGroup);
  }

  /**
   * Update histogram with new data
   * @param {Array<Object>} data - array of {x, y, width} objects
   * @param {Array<number>} highlightRange - [min, max] range to highlight (optional)
   */
  function update(data, highlightRange = null) {
    if (!data || data.length === 0) {
      barsGroup.selectAll('.bar').remove();
      return;
    }

    // Update scales if needed
    const xExtent = [
      Math.min(...data.map(d => d.x)),
      Math.max(...data.map(d => d.x + d.width))
    ];
    const yMax = Math.max(...data.map(d => d.y));

    xScale.domain(xExtent);
    yScale.domain([0, yMax * 1.05]); // 5% padding at top

    updateAxes();

    // Bind data
    const bars = barsGroup
      .selectAll('.bar')
      .data(data);

    // Enter new bars
    const barsEnter = bars
      .enter()
      .append('rect')
      .attr('class', 'bar');

    // Update all bars (enter + existing)
    bars.merge(barsEnter)
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y))
      .attr('width', d => {
        const barWidth = xScale(d.x + d.width) - xScale(d.x) - 1;
        return Math.max(0, barWidth);
      })
      .attr('height', d => chartHeight - yScale(d.y))
      .attr('fill', d => {
        if (highlightRange) {
          const center = d.x + d.width / 2;
          const isHighlighted = center >= highlightRange[0] && center <= highlightRange[1];
          return isHighlighted ? highlightColor : color;
        }
        return color;
      })
      .attr('stroke', 'var(--color-border-primary, #333)')
      .attr('stroke-width', 0.5);

    // Remove old bars
    bars.exit().remove();
  }

  /**
   * Resize the histogram
   * @param {number} newWidth - new width
   * @param {number} newHeight - new height
   */
  function resize(newWidth, newHeight) {
    const newChartWidth = newWidth - margin.left - margin.right;
    const newChartHeight = newHeight - margin.top - margin.bottom;

    xScale.range([0, newChartWidth]);
    yScale.range([newChartHeight, 0]);

    xAxisGroup.attr('transform', `translate(0,${newChartHeight})`);

    updateAxes();
    
    // Re-render bars with new scales
    barsGroup.selectAll('.bar')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y))
      .attr('width', d => {
        const barWidth = xScale(d.x + d.width) - xScale(d.x) - 1;
        return Math.max(0, barWidth);
      })
      .attr('height', d => newChartHeight - yScale(d.y));
  }

  return {
    update,
    resize,
    xScale,
    yScale,
  };
}
