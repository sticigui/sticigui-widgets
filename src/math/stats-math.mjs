/**
 * Statistical mathematics library
 * Wraps jstat and provides named functions for all statistical operations
 * All functions are pure (no side effects)
 */

import jstat from 'jstat';

// ============================================================================
// Normal distribution
// ============================================================================

/**
 * Normal probability density function
 * @param {number} x - value
 * @param {number} mean - mean (default 0)
 * @param {number} sd - standard deviation (default 1)
 * @returns {number} PDF value at x
 */
export function normalPDF(x, mean = 0, sd = 1) {
  return jstat.normal.pdf(x, mean, sd);
}

/**
 * Normal cumulative distribution function P(X ≤ x)
 * @param {number} x - value
 * @param {number} mean - mean (default 0)
 * @param {number} sd - standard deviation (default 1)
 * @returns {number} CDF value at x
 */
export function normalCDF(x, mean = 0, sd = 1) {
  return jstat.normal.cdf(x, mean, sd);
}

/**
 * Normal CDF range P(lo ≤ X ≤ hi)
 * @param {number} lo - lower bound
 * @param {number} hi - upper bound
 * @param {number} mean - mean
 * @param {number} sd - standard deviation
 * @returns {number} probability in range
 */
export function normalCDFRange(lo, hi, mean, sd) {
  return normalCDF(hi, mean, sd) - normalCDF(lo, mean, sd);
}

/**
 * Normal quantile function (inverse CDF)
 * @param {number} p - probability (0 to 1)
 * @param {number} mean - mean (default 0)
 * @param {number} sd - standard deviation (default 1)
 * @returns {number} x value such that P(X ≤ x) = p
 */
export function normalQuantile(p, mean = 0, sd = 1) {
  return jstat.normal.inv(p, mean, sd);
}

// ============================================================================
// Binomial distribution
// ============================================================================

/**
 * Binomial probability mass function
 * @param {number} k - number of successes
 * @param {number} n - number of trials
 * @param {number} p - probability of success
 * @returns {number} P(X = k)
 */
export function binomialPMF(k, n, p) {
  return jstat.binomial.pdf(k, n, p);
}

/**
 * Binomial cumulative distribution function P(X ≤ k)
 * @param {number} k - number of successes
 * @param {number} n - number of trials
 * @param {number} p - probability of success
 * @returns {number} P(X ≤ k)
 */
export function binomialCDF(k, n, p) {
  return jstat.binomial.cdf(k, n, p);
}

/**
 * Binomial CDF range P(lo ≤ X ≤ hi)
 * @param {number} lo - lower bound (inclusive)
 * @param {number} hi - upper bound (inclusive)
 * @param {number} n - number of trials
 * @param {number} p - probability of success
 * @returns {number} probability in range
 */
export function binomialCDFRange(lo, hi, n, p) {
  if (lo > hi) return 0;
  if (lo === 0) {
    return binomialCDF(hi, n, p);
  }
  return binomialCDF(hi, n, p) - binomialCDF(lo - 1, n, p);
}

// ============================================================================
// Chi-square distribution
// ============================================================================

/**
 * Chi-square probability density function
 * @param {number} x - value (x ≥ 0)
 * @param {number} df - degrees of freedom
 * @returns {number} PDF value at x
 */
export function chiSquarePDF(x, df) {
  return jstat.chisquare.pdf(x, df);
}

/**
 * Chi-square cumulative distribution function P(X ≤ x)
 * @param {number} x - value
 * @param {number} df - degrees of freedom
 * @returns {number} CDF value at x
 */
export function chiSquareCDF(x, df) {
  return jstat.chisquare.cdf(x, df);
}

/**
 * Chi-square CDF range P(lo ≤ X ≤ hi)
 * @param {number} lo - lower bound
 * @param {number} hi - upper bound
 * @param {number} df - degrees of freedom
 * @returns {number} probability in range
 */
export function chiSquareCDFRange(lo, hi, df) {
  return chiSquareCDF(hi, df) - chiSquareCDF(lo, df);
}

// ============================================================================
// Student's t distribution
// ============================================================================

/**
 * Student's t probability density function
 * @param {number} x - value
 * @param {number} df - degrees of freedom
 * @returns {number} PDF value at x
 */
export function tPDF(x, df) {
  return jstat.studentt.pdf(x, df);
}

/**
 * Student's t cumulative distribution function P(X ≤ x)
 * @param {number} x - value
 * @param {number} df - degrees of freedom
 * @returns {number} CDF value at x
 */
export function tCDF(x, df) {
  return jstat.studentt.cdf(x, df);
}

/**
 * Student's t CDF range P(lo ≤ X ≤ hi)
 * @param {number} lo - lower bound
 * @param {number} hi - upper bound
 * @param {number} df - degrees of freedom
 * @returns {number} probability in range
 */
export function tCDFRange(lo, hi, df) {
  return tCDF(hi, df) - tCDF(lo, df);
}

/**
 * Student's t quantile function (inverse CDF)
 * @param {number} p - probability (0 to 1)
 * @param {number} df - degrees of freedom
 * @returns {number} quantile value
 */
export function tQuantile(p, df) {
  return jstat.studentt.inv(p, df);
}

// ============================================================================
// Exponential distribution
// ============================================================================

/**
 * Exponential CDF range P(lo ≤ X ≤ hi)
 * @param {number} lo - lower bound
 * @param {number} hi - upper bound
 * @param {number} rate - rate parameter (lambda)
 * @returns {number} probability in range
 */
export function exponentialCDFRange(lo, hi, rate) {
  return jstat.exponential.cdf(hi, rate) - jstat.exponential.cdf(lo, rate);
}

/**
 * Exponential cumulative distribution function P(X ≤ x)
 * @param {number} x - upper bound
 * @param {number} rate - rate parameter
 * @returns {number} cumulative probability
 */
export function exponentialCDF(x, rate) {
  return jstat.exponential.cdf(x, rate);
}

// ============================================================================
// Geometric distribution
// ============================================================================

/**
 * Geometric CDF range P(lo ≤ X ≤ hi)
 * Number of trials until first success
 * @param {number} lo - lower bound (inclusive)
 * @param {number} hi - upper bound (inclusive)
 * @param {number} p - probability of success
 * @returns {number} probability in range
 */
export function geometricCDFRange(lo, hi, p) {
  if (lo > hi) return 0;
  
  // Implement geometric distribution manually
  // P(X = k) = (1-p)^(k-1) * p for k = 1, 2, 3, ...
  let sum = 0;
  for (let k = lo; k <= hi; k++) {
    sum += Math.pow(1 - p, k - 1) * p;
  }
  return sum;
}

/**
 * Geometric cumulative distribution function P(X ≤ k)
 * Number of trials until first success
 * @param {number} k - upper bound
 * @param {number} p - probability of success
 * @returns {number} cumulative probability
 */
export function geometricCDF(k, p) {
  let sum = 0;
  for (let i = 1; i <= k; i++) {
    sum += Math.pow(1 - p, i - 1) * p;
  }
  return sum;
}

// ============================================================================
// Hypergeometric distribution
// ============================================================================

/**
 * Hypergeometric CDF range P(lo ≤ X ≤ hi)
 * @param {number} lo - lower bound (inclusive)
 * @param {number} hi - upper bound (inclusive)
 * @param {number} N - population size
 * @param {number} K - number of success states in population
 * @param {number} n - number of draws
 * @returns {number} probability in range
 */
export function hypergeometricCDFRange(lo, hi, N, K, n) {
  if (lo > hi) return 0;
  let sum = 0;
  for (let k = lo; k <= hi; k++) {
    sum += jstat.hypgeom.pdf(k, N, K, n);
  }
  return sum;
}

/**
 * Hypergeometric cumulative distribution function P(X ≤ k)
 * @param {number} k - upper bound
 * @param {number} N - population size
 * @param {number} K - number of success states in population
 * @param {number} n - number of draws
 * @returns {number} cumulative probability
 */
export function hypergeometricCDF(k, N, K, n) {
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += jstat.hypgeom.pdf(i, N, K, n);
  }
  return sum;
}

// ============================================================================
// Negative binomial distribution
// ============================================================================

/**
 * Negative binomial CDF range P(lo ≤ X ≤ hi)
 * Number of failures before r successes
 * @param {number} lo - lower bound (inclusive)
 * @param {number} hi - upper bound (inclusive)
 * @param {number} r - number of successes
 * @param {number} p - probability of success
 * @returns {number} probability in range
 */
export function negativeBinomialCDFRange(lo, hi, r, p) {
  if (lo > hi) return 0;
  if (lo === 0) {
    return jstat.negbin.cdf(hi, r, p);
  }
  return jstat.negbin.cdf(hi, r, p) - jstat.negbin.cdf(lo - 1, r, p);
}

/**
 * Negative binomial cumulative distribution function P(X ≤ k)
 * Number of failures before r successes
 * @param {number} k - upper bound
 * @param {number} r - number of successes
 * @param {number} p - probability of success
 * @returns {number} cumulative probability
 */
export function negativeBinomialCDF(k, r, p) {
  return jstat.negbin.cdf(k, r, p);
}

// ============================================================================
// Poisson distribution
// ============================================================================

/**
 * Poisson CDF range P(lo ≤ X ≤ hi)
 * @param {number} lo - lower bound (inclusive)
 * @param {number} hi - upper bound (inclusive)
 * @param {number} lambda - rate parameter
 * @returns {number} probability in range
 */
export function poissonCDFRange(lo, hi, lambda) {
  if (lo > hi) return 0;
  if (lo === 0) {
    return jstat.poisson.cdf(hi, lambda);
  }
  return jstat.poisson.cdf(hi, lambda) - jstat.poisson.cdf(lo - 1, lambda);
}

/**
 * Poisson cumulative distribution function P(X ≤ k)
 * @param {number} k - upper bound
 * @param {number} lambda - rate parameter
 * @returns {number} cumulative probability
 */
export function poissonCDF(k, lambda) {
  return jstat.poisson.cdf(k, lambda);
}

// ============================================================================
// Summary statistics
// ============================================================================

/**
 * Mean (average) of an array
 * @param {number[]} arr - array of numbers
 * @returns {number} mean
 */
export function mean(arr) {
  if (!arr || arr.length === 0) return NaN;
  return jstat.mean(arr);
}

/**
 * Population standard deviation
 * @param {number[]} arr - array of numbers
 * @returns {number} population SD
 */
export function sd(arr) {
  if (!arr || arr.length === 0) return NaN;
  return jstat.stdev(arr, false); // false = population SD (divide by n)
}

/**
 * Sample standard deviation (n-1 denominator)
 * @param {number[]} arr - array of numbers
 * @returns {number} sample SD
 */
export function sampleSD(arr) {
  if (!arr || arr.length === 0) return NaN;
  return jstat.stdev(arr, true); // true = sample SD (divide by n-1)
}

/**
 * Sample variance (n-1 denominator)
 * @param {number[]} arr - array of numbers
 * @returns {number} sample variance
 */
export function sampleVariance(arr) {
  if (!arr || arr.length === 0) return NaN;
  return jstat.variance(arr, true); // true = sample variance (divide by n-1)
}

/**
 * Correlation coefficient between two arrays
 * @param {number[]} xArr - x values
 * @param {number[]} yArr - y values
 * @returns {number} correlation coefficient r
 */
export function correlation(xArr, yArr) {
  if (!xArr || !yArr || xArr.length === 0 || yArr.length === 0) return NaN;
  if (xArr.length !== yArr.length) return NaN;
  return jstat.corrcoeff(xArr, yArr);
}

/**
 * Linear regression (ordinary least squares)
 * @param {number[]} xArr - x values
 * @param {number[]} yArr - y values
 * @returns {{slope: number, intercept: number, r: number, r2: number}} regression results
 */
export function linearRegression(xArr, yArr) {
  if (!xArr || !yArr || xArr.length === 0 || yArr.length === 0) {
    return { slope: NaN, intercept: NaN, r: NaN, r2: NaN };
  }
  if (xArr.length !== yArr.length) {
    return { slope: NaN, intercept: NaN, r: NaN, r2: NaN };
  }

  const n = xArr.length;
  const xMean = mean(xArr);
  const yMean = mean(yArr);
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (xArr[i] - xMean) * (yArr[i] - yMean);
    denominator += (xArr[i] - xMean) * (xArr[i] - xMean);
  }
  
  const slope = denominator === 0 ? NaN : numerator / denominator;
  const intercept = yMean - slope * xMean;
  const r = correlation(xArr, yArr);
  const r2 = r * r;
  
  return { slope, intercept, r, r2 };
}
