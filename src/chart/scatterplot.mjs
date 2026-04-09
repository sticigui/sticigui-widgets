/**
 * Reusable scatterplot renderer
 * Creates and updates scatterplot visualizations with optional overlays
 */

import { select } from 'd3-selection';
import { createLinearScale } from './scales.mjs';
import { createBottomAxis, createLeftAxis, styleAxis } from './axes.mjs';
import { mean, sd, linearRegression } from '../math/stats-math.mjs';

/**
 * Create a scatterplot renderer
 * @param {Selection} svgSelection - D3 selection of SVG element
 * @param {Object} options - configuration options
 * @param {number} options.width - chart width
 * @param {number} options.height - chart height
 * @param {Object} options.margin - margins {top, right, bottom, left}
 * @param {string} options.xLabel - x-axis label
 * @param {string} options.yLabel - y-axis label
 * @returns {Object} scatterplot API
 */
export function createScatterplot(svgSelection, options) {
  const {
    width,
    height,
    margin = { top: 20, right: 20, bottom: 50, left: 60 },
    xLabel = 'X',
    yLabel = 'Y',
  } = options;

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Clear existing content
  svgSelection.selectAll('*').remove();

  // Create main group with margins
  const g = svgSelection
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create scales (will be updated with data)
  let xScale = createLinearScale([0, 1], [0, chartWidth]);
  let yScale = createLinearScale([0, 1], [chartHeight, 0]);

  // Create axes
  const xAxisGroup = g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${chartHeight})`);

  const yAxisGroup = g.append('g')
    .attr('class', 'y-axis');

  // Add axis labels
  svgSelection.append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'middle')
    .attr('x', margin.left + chartWidth / 2)
    .attr('y', height - 5)
    .attr('fill', 'var(--color-text-primary, #000)')
    .style('font-size', '12px')
    .text(xLabel);

  svgSelection.append('text')
    .attr('class', 'y-label')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(15,${margin.top + chartHeight / 2}) rotate(-90)`)
    .attr('fill', 'var(--color-text-primary, #000)')
    .style('font-size', '12px')
    .text(yLabel);

  // Create groups for overlays (order matters for z-index)
  const sdLinesGroup = g.append('g').attr('class', 'sd-lines');
  const sdLineGroup = g.append('g').attr('class', 'sd-line');
  const regressionLineGroup = g.append('g').attr('class', 'regression-line');
  const pointOfAveragesGroup = g.append('g').attr('class', 'point-of-averages');
  const pointsGroup = g.append('g').attr('class', 'points');
  const addedPointsGroup = g.append('g').attr('class', 'added-points');

  // Store current data and options
  let currentXArr = [];
  let currentYArr = [];
  let currentAddedPoints = [];
  let overlayOptions = {
    showPointOfAverages: false,
    showSDLines: false,
    showSDLine: false,
    showRegressionLine: false,
  };

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
   * Update scatterplot with new data
   * @param {number[]} xArr - x values
   * @param {number[]} yArr - y values
   * @param {Array<{x, y}>} addedPoints - manually added points (optional)
   */
  function update(xArr, yArr, addedPoints = []) {
    currentXArr = xArr || [];
    currentYArr = yArr || [];
    currentAddedPoints = addedPoints || [];

    if (currentXArr.length === 0 || currentYArr.length === 0) {
      pointsGroup.selectAll('*').remove();
      return;
    }

    // Update scales based on data
    const xMin = Math.min(...currentXArr, ...currentAddedPoints.map(p => p.x));
    const xMax = Math.max(...currentXArr, ...currentAddedPoints.map(p => p.x));
    const yMin = Math.min(...currentYArr, ...currentAddedPoints.map(p => p.y));
    const yMax = Math.max(...currentYArr, ...currentAddedPoints.map(p => p.y));

    const xPadding = (xMax - xMin) * 0.05 || 1;
    const yPadding = (yMax - yMin) * 0.05 || 1;

    xScale.domain([xMin - xPadding, xMax + xPadding]);
    yScale.domain([yMin - yPadding, yMax + yPadding]);

    updateAxes();

    // Draw main points
    const circles = pointsGroup
      .selectAll('circle')
      .data(currentXArr.map((x, i) => ({ x, y: currentYArr[i] })));

    circles.enter()
      .append('circle')
      .merge(circles)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4)
      .attr('fill', 'var(--color-primary, steelblue)')
      .attr('stroke', 'var(--color-border-primary, #333)')
      .attr('stroke-width', 1)
      .attr('opacity', 0.7);

    circles.exit().remove();

    // Draw added points
    const addedCircles = addedPointsGroup
      .selectAll('circle')
      .data(currentAddedPoints);

    addedCircles.enter()
      .append('circle')
      .merge(addedCircles)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4)
      .attr('fill', 'var(--color-accent, orange)')
      .attr('stroke', 'var(--color-border-primary, #333)')
      .attr('stroke-width', 1);

    addedCircles.exit().remove();

    // Update overlays
    updateOverlays();
  }

  /**
   * Update overlay visualizations
   */
  function updateOverlays() {
    // Clear all overlays
    sdLinesGroup.selectAll('*').remove();
    sdLineGroup.selectAll('*').remove();
    regressionLineGroup.selectAll('*').remove();
    pointOfAveragesGroup.selectAll('*').remove();

    if (currentXArr.length === 0) return;

    const xMean = mean(currentXArr);
    const yMean = mean(currentYArr);
    const xSD = sd(currentXArr);
    const ySD = sd(currentYArr);

    // Point of averages
    if (overlayOptions.showPointOfAverages) {
      pointOfAveragesGroup.append('circle')
        .attr('cx', xScale(xMean))
        .attr('cy', yScale(yMean))
        .attr('r', 6)
        .attr('fill', 'red')
        .attr('stroke', 'darkred')
        .attr('stroke-width', 2);
    }

    // SD lines (vertical and horizontal at mean ± 1 SD)
    if (overlayOptions.showSDLines) {
      // Vertical lines
      [xMean - xSD, xMean + xSD].forEach(x => {
        sdLinesGroup.append('line')
          .attr('x1', xScale(x))
          .attr('x2', xScale(x))
          .attr('y1', 0)
          .attr('y2', chartHeight)
          .attr('stroke', 'green')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,4');
      });

      // Horizontal lines
      [yMean - ySD, yMean + ySD].forEach(y => {
        sdLinesGroup.append('line')
          .attr('x1', 0)
          .attr('x2', chartWidth)
          .attr('y1', yScale(y))
          .attr('y2', yScale(y))
          .attr('stroke', 'green')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,4');
      });
    }

    // SD line (line through point of averages with slope SD_y/SD_x)
    if (overlayOptions.showSDLine) {
      const slope = ySD / xSD;
      const [xMin, xMax] = xScale.domain();
      
      const y1 = yMean + slope * (xMin - xMean);
      const y2 = yMean + slope * (xMax - xMean);

      sdLineGroup.append('line')
        .attr('x1', xScale(xMin))
        .attr('x2', xScale(xMax))
        .attr('y1', yScale(y1))
        .attr('y2', yScale(y2))
        .attr('stroke', 'purple')
        .attr('stroke-width', 2);
    }

    // Regression line
    if (overlayOptions.showRegressionLine) {
      const { slope, intercept } = linearRegression(currentXArr, currentYArr);
      
      if (!isNaN(slope) && !isNaN(intercept)) {
        const [xMin, xMax] = xScale.domain();
        const y1 = slope * xMin + intercept;
        const y2 = slope * xMax + intercept;

        regressionLineGroup.append('line')
          .attr('x1', xScale(xMin))
          .attr('x2', xScale(xMax))
          .attr('y1', yScale(y1))
          .attr('y2', yScale(y2))
          .attr('stroke', 'red')
          .attr('stroke-width', 2);
      }
    }
  }

  /**
   * Show/hide point of averages
   * @param {boolean} show - whether to show
   */
  function showPointOfAverages(show) {
    overlayOptions.showPointOfAverages = show;
    updateOverlays();
  }

  /**
   * Show/hide SD lines
   * @param {boolean} show - whether to show
   */
  function showSDLines(show) {
    overlayOptions.showSDLines = show;
    updateOverlays();
  }

  /**
   * Show/hide SD line
   * @param {boolean} show - whether to show
   */
  function showSDLine(show) {
    overlayOptions.showSDLine = show;
    updateOverlays();
  }

  /**
   * Show/hide regression line
   * @param {boolean} show - whether to show
   */
  function showRegressionLine(show) {
    overlayOptions.showRegressionLine = show;
    updateOverlays();
  }

  /**
   * Set click handler for adding points
   * @param {Function} callback - callback(x, y) called when chart is clicked
   */
  function onClickAdd(callback) {
    g.on('click', function(event) {
      const [mouseX, mouseY] = select(this).node().getBoundingClientRect();
      const x = xScale.invert(event.clientX - mouseX);
      const y = yScale.invert(event.clientY - mouseY);
      callback(x, y);
    });
  }

  return {
    update,
    showPointOfAverages,
    showSDLines,
    showSDLine,
    showRegressionLine,
    onClickAdd,
    xScale,
    yScale,
  };
}
