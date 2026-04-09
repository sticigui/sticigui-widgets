/**
 * D3 axis wrappers
 * Thin wrappers over d3-axis for consistent styling across widgets
 */

import { axisBottom, axisLeft, axisTop, axisRight } from 'd3-axis';

/**
 * Create a bottom axis
 * @param {Function} scale - D3 scale function
 * @param {number} ticks - number of ticks (optional)
 * @returns {Function} axis generator
 */
export function createBottomAxis(scale, ticks) {
  const axis = axisBottom(scale);
  if (ticks !== undefined) {
    axis.ticks(ticks);
  }
  return axis;
}

/**
 * Create a left axis
 * @param {Function} scale - D3 scale function
 * @param {number} ticks - number of ticks (optional)
 * @returns {Function} axis generator
 */
export function createLeftAxis(scale, ticks) {
  const axis = axisLeft(scale);
  if (ticks !== undefined) {
    axis.ticks(ticks);
  }
  return axis;
}

/**
 * Create a top axis
 * @param {Function} scale - D3 scale function
 * @param {number} ticks - number of ticks (optional)
 * @returns {Function} axis generator
 */
export function createTopAxis(scale, ticks) {
  const axis = axisTop(scale);
  if (ticks !== undefined) {
    axis.ticks(ticks);
  }
  return axis;
}

/**
 * Create a right axis
 * @param {Function} scale - D3 scale function
 * @param {number} ticks - number of ticks (optional)
 * @returns {Function} axis generator
 */
export function createRightAxis(scale, ticks) {
  const axis = axisRight(scale);
  if (ticks !== undefined) {
    axis.ticks(ticks);
  }
  return axis;
}

/**
 * Style an axis group with theme-aware colors
 * @param {Selection} axisGroup - D3 selection of axis group
 */
export function styleAxis(axisGroup) {
  axisGroup
    .selectAll('line')
    .attr('stroke', 'var(--color-border-secondary, #999)');
  
  axisGroup
    .selectAll('path')
    .attr('stroke', 'var(--color-border-secondary, #999)')
    .attr('fill', 'none');
  
  axisGroup
    .selectAll('text')
    .attr('fill', 'var(--color-text-primary, #000)')
    .style('font-size', '11px');
}
