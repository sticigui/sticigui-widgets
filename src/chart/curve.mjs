/**
 * Probability density curve renderer
 * Creates and updates continuous curve visualizations (e.g., normal curve)
 */

import { select } from 'd3-selection';
import { line, area } from 'd3-shape';
import { createLinearScale } from './scales.mjs';
import { createBottomAxis, createLeftAxis, styleAxis } from './axes.mjs';

/**
 * Create a curve renderer
 * @param {Selection} svgSelection - D3 selection of SVG element
 * @param {Object} options - configuration options
 * @param {number} options.width - chart width
 * @param {number} options.height - chart height
 * @param {Object} options.margin - margins {top, right, bottom, left}
 * @param {Array<number>} options.xDomain - x-axis domain [min, max]
 * @param {Array<number>} options.yDomain - y-axis domain [min, max]
 * @param {number} options.nPoints - number of points to sample (default 200)
 * @param {string} options.color - curve stroke color
 * @param {string} options.fillColor - area fill color (optional)
 * @returns {Object} curve API with update method
 */
export function createCurve(svgSelection, options) {
  const {
    width,
    height,
    margin = { top: 20, right: 20, bottom: 40, left: 50 },
    xDomain,
    yDomain,
    nPoints = 200,
    color = 'var(--color-primary, steelblue)',
    fillColor = null,
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

  // Create clip path for area fill
  const clipId = `clip-${Math.random().toString(36).substr(2, 9)}`;
  svgSelection.append('defs')
    .append('clipPath')
    .attr('id', clipId)
    .append('rect')
    .attr('x', margin.left)
    .attr('y', margin.top)
    .attr('width', chartWidth)
    .attr('height', chartHeight);

  // Create area fill group (optional)
  const areaGroup = g.append('g')
    .attr('class', 'area')
    .attr('clip-path', `url(#${clipId})`);

  // Create curve path
  const curvePath = g.append('path')
    .attr('class', 'curve')
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 2);

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
   * Update curve with new function
   * @param {Function} pdfFn - probability density function f(x)
   * @param {Array<number>} fillRange - [min, max] range to fill (optional)
   */
  function update(pdfFn, fillRange = null) {
    if (!pdfFn) {
      curvePath.attr('d', null);
      areaGroup.selectAll('*').remove();
      return;
    }

    // Generate points along the curve
    const [xMin, xMax] = xScale.domain();
    const step = (xMax - xMin) / nPoints;
    const points = [];

    for (let i = 0; i <= nPoints; i++) {
      const x = xMin + i * step;
      const y = pdfFn(x);
      points.push({ x, y });
    }

    // Update y scale if needed
    const yMax = Math.max(...points.map(p => p.y));
    if (yMax > yScale.domain()[1]) {
      yScale.domain([0, yMax * 1.05]);
      updateAxes();
    }

    // Create line generator
    const lineGen = line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    // Update curve path
    curvePath.attr('d', lineGen(points));

    // Update filled area if fillRange is specified
    areaGroup.selectAll('*').remove();

    if (fillRange && fillColor) {
      const [fillMin, fillMax] = fillRange;
      
      // Filter points in fill range
      const fillPoints = points.filter(p => p.x >= fillMin && p.x <= fillMax);
      
      if (fillPoints.length > 0) {
        // Add boundary points if needed
        if (fillPoints[0].x > fillMin) {
          fillPoints.unshift({ x: fillMin, y: pdfFn(fillMin) });
        }
        if (fillPoints[fillPoints.length - 1].x < fillMax) {
          fillPoints.push({ x: fillMax, y: pdfFn(fillMax) });
        }

        // Create area generator
        const areaGen = area()
          .x(d => xScale(d.x))
          .y0(chartHeight)
          .y1(d => yScale(d.y));

        // Draw filled area
        areaGroup.append('path')
          .datum(fillPoints)
          .attr('d', areaGen)
          .attr('fill', fillColor)
          .attr('opacity', 0.3);
      }
    }
  }

  /**
   * Resize the curve
   * @param {number} newWidth - new width
   * @param {number} newHeight - new height
   */
  function resize(newWidth, newHeight) {
    const newChartWidth = newWidth - margin.left - margin.right;
    const newChartHeight = newHeight - margin.top - margin.bottom;

    xScale.range([0, newChartWidth]);
    yScale.range([newChartHeight, 0]);

    xAxisGroup.attr('transform', `translate(0,${newChartHeight})`);

    // Update clip path
    svgSelection.select(`#${clipId} rect`)
      .attr('width', newChartWidth)
      .attr('height', newChartHeight);

    updateAxes();

    // Re-render with current data (would need to store pdfFn and fillRange)
    // For now, caller should call update() again after resize
  }

  return {
    update,
    resize,
    xScale,
    yScale,
  };
}
