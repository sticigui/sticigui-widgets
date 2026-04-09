/**
 * Seeded pseudorandom number generator using xoshiro128**
 * Provides reproducible random number generation for simulations
 * 
 * Reference: https://prng.di.unimi.it/xoshiro128starstar.c
 */

/**
 * PRNG class with xoshiro128** algorithm
 */
export class PRNG {
  /**
   * Initialize PRNG with a seed
   * @param {number} seed - 32-bit integer seed
   */
  constructor(seed) {
    // Initialize state using SplitMix32 (simple seed expansion)
    this.state = new Uint32Array(4);
    let s = seed >>> 0; // ensure unsigned 32-bit
    
    // SplitMix32 to generate initial state from seed
    for (let i = 0; i < 4; i++) {
      s = (s + 0x9e3779b9) >>> 0;
      let z = s;
      z = (z ^ (z >>> 16)) >>> 0;
      z = Math.imul(z, 0x85ebca6b) >>> 0;
      z = (z ^ (z >>> 13)) >>> 0;
      z = Math.imul(z, 0xc2b2ae35) >>> 0;
      z = (z ^ (z >>> 16)) >>> 0;
      this.state[i] = z;
    }
    
    // Cache for Box-Muller transform
    this._hasSpare = false;
    this._spare = 0;
  }

  /**
   * Generate next random 32-bit unsigned integer using xoshiro128**
   * @returns {number} random 32-bit unsigned integer
   */
  _next() {
    const s = this.state;
    
    // xoshiro128** algorithm
    const result = (Math.imul(s[1], 5) >>> 0);
    const t = (s[1] << 9) >>> 0;
    
    s[2] = (s[2] ^ s[0]) >>> 0;
    s[3] = (s[3] ^ s[1]) >>> 0;
    s[1] = (s[1] ^ s[2]) >>> 0;
    s[0] = (s[0] ^ s[3]) >>> 0;
    
    s[2] = (s[2] ^ t) >>> 0;
    s[3] = ((s[3] << 11) | (s[3] >>> 21)) >>> 0; // rotl(s[3], 11)
    
    return (Math.imul(result, 9) >>> 0);
  }

  /**
   * Generate uniform float in [0, 1)
   * @returns {number} random float in [0, 1)
   */
  nextFloat() {
    // Use 53 bits for full double precision
    const upper = this._next() >>> 5;  // 27 bits
    const lower = this._next() >>> 6;  // 26 bits
    return (upper * 67108864.0 + lower) / 9007199254740992.0; // 2^53
  }

  /**
   * Generate uniform integer in [0, n)
   * @param {number} n - upper bound (exclusive)
   * @returns {number} random integer in [0, n)
   */
  nextInt(n) {
    return Math.floor(this.nextFloat() * n);
  }

  /**
   * Generate normal(mean, sd) using Box-Muller transform
   * @param {number} mean - mean (default 0)
   * @param {number} sd - standard deviation (default 1)
   * @returns {number} random value from N(mean, sd)
   */
  nextNormal(mean = 0, sd = 1) {
    // Box-Muller transform generates pairs of independent normals
    // Cache the spare to avoid wasting it
    if (this._hasSpare) {
      this._hasSpare = false;
      return mean + sd * this._spare;
    }
    
    // Generate two uniform(0,1) values
    let u, v, s;
    do {
      u = this.nextFloat() * 2 - 1;
      v = this.nextFloat() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    
    const mul = Math.sqrt(-2 * Math.log(s) / s);
    this._spare = v * mul;
    this._hasSpare = true;
    
    return mean + sd * (u * mul);
  }

  /**
   * Generate Bernoulli(p) trial
   * @param {number} p - probability of success
   * @returns {number} 1 with probability p, 0 otherwise
   */
  nextBernoulli(p) {
    return this.nextFloat() < p ? 1 : 0;
  }

  /**
   * Generate Binomial(n, p) value
   * Sum of n Bernoulli(p) trials for small n
   * Normal approximation for large n
   * @param {number} n - number of trials
   * @param {number} p - probability of success
   * @returns {number} number of successes
   */
  nextBinomial(n, p) {
    // Use direct sum for small n
    if (n < 30) {
      let count = 0;
      for (let i = 0; i < n; i++) {
        count += this.nextBernoulli(p);
      }
      return count;
    }
    
    // Normal approximation for large n
    // Binomial(n, p) ≈ Normal(n*p, sqrt(n*p*(1-p)))
    const mean = n * p;
    const sd = Math.sqrt(n * p * (1 - p));
    let value = Math.round(this.nextNormal(mean, sd));
    
    // Clamp to valid range [0, n]
    return Math.max(0, Math.min(n, value));
  }

  /**
   * Sample k items from array
   * @param {Array} arr - array to sample from
   * @param {number} k - number of items to sample
   * @param {boolean} replacement - whether to sample with replacement (default false)
   * @returns {Array} sampled items
   */
  sample(arr, k, replacement = false) {
    if (!arr || arr.length === 0) return [];
    if (k <= 0) return [];
    
    if (replacement) {
      // Sample with replacement: just pick k random items
      const result = [];
      for (let i = 0; i < k; i++) {
        result.push(arr[this.nextInt(arr.length)]);
      }
      return result;
    } else {
      // Sample without replacement: Fisher-Yates shuffle variant
      if (k >= arr.length) {
        // Return shuffled copy of entire array
        k = arr.length;
      }
      
      const indices = Array.from({ length: arr.length }, (_, i) => i);
      const result = [];
      
      for (let i = 0; i < k; i++) {
        const j = i + this.nextInt(arr.length - i);
        // Swap indices[i] and indices[j]
        [indices[i], indices[j]] = [indices[j], indices[i]];
        result.push(arr[indices[i]]);
      }
      
      return result;
    }
  }
}
