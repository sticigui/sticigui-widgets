/**
 * D3 scale wrappers
 * Thin wrappers over d3-scale for consistent usage across widgets
 */

import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';

/**
 * Create a linear scale
 * @param {Array<number>} domain - [min, max] input range
 * @param {Array<number>} range - [min, max] output range
 * @returns {Function} linear scale function
 */
export function createLinearScale(domain, range) {
  return scaleLinear()
    .domain(domain)
    .range(range);
}

/**
 * Create a band scale (for categorical data like histograms)
 * @param {Array} domain - array of category values
 * @param {Array<number>} range - [min, max] output range
 * @param {number} padding - padding between bands (0-1, default 0.1)
 * @returns {Function} band scale function
 */
export function createBandScale(domain, range, padding = 0.1) {
  return scaleBand()
    .domain(domain)
    .range(range)
    .padding(padding);
}

/**
 * Create an ordinal scale (for categorical colors, etc.)
 * @param {Array} domain - array of input values
 * @param {Array} range - array of output values
 * @returns {Function} ordinal scale function
 */
export function createOrdinalScale(domain, range) {
  return scaleOrdinal()
    .domain(domain)
    .range(range);
}
