/**
 * Probability Calculator Widget
 * 
 * Computes P(lo ≤ X ≤ hi) for user-selected distributions.
 * Displays probability, expected value, and standard error.
 * No visualization - purely calculation-based.
 */

import {
  normalCDF,
  binomialCDF,
  chiSquareCDF,
  exponentialCDF,
  geometricCDF,
  hypergeometricCDF,
  negativeBinomialCDF,
  poissonCDF,
  tCDF,
  // For EV and SE calculations
  mean,
  sampleSD
} from '../../src/math/stats-math.mjs';
import styles from './styles.css';

// Inject styles into document
function injectStyles() {
  if (!document.getElementById('prob-calc-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'prob-calc-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
}

// Helper to get CSS variable value
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Parameter definitions for each distribution
 */
const DISTRIBUTIONS = {
  normal: {
    label: 'Normal',
    params: [
      { name: 'mean', label: 'Mean (μ)', type: 'number', default: 0, step: 0.1 },
      { name: 'sd', label: 'Standard Deviation (σ)', type: 'number', default: 1, step: 0.1, min: 0.01 }
    ],
    discrete: false,
    ev: (p) => p.mean,
    se: (p) => p.sd
  },
  binomial: {
    label: 'Binomial',
    params: [
      { name: 'n', label: 'Number of trials (n)', type: 'number', default: 10, step: 1, min: 1 },
      { name: 'p', label: 'Success probability (p)', type: 'number', default: 0.5, step: 0.01, min: 0, max: 1 }
    ],
    discrete: true,
    ev: (p) => p.n * p.p,
    se: (p) => Math.sqrt(p.n * p.p * (1 - p.p))
  },
  chisquare: {
    label: 'Chi-Square',
    params: [
      { name: 'df', label: 'Degrees of freedom (df)', type: 'number', default: 5, step: 1, min: 1 }
    ],
    discrete: false,
    ev: (p) => p.df,
    se: (p) => Math.sqrt(2 * p.df)
  },
  exponential: {
    label: 'Exponential',
    params: [
      { name: 'rate', label: 'Rate (λ)', type: 'number', default: 1, step: 0.1, min: 0.01 }
    ],
    discrete: false,
    ev: (p) => 1 / p.rate,
    se: (p) => 1 / p.rate
  },
  geometric: {
    label: 'Geometric',
    params: [
      { name: 'p', label: 'Success probability (p)', type: 'number', default: 0.5, step: 0.01, min: 0.01, max: 1 }
    ],
    discrete: true,
    ev: (p) => 1 / p.p,
    se: (p) => Math.sqrt((1 - p.p) / (p.p * p.p))
  },
  hypergeometric: {
    label: 'Hypergeometric',
    params: [
      { name: 'N', label: 'Population size (N)', type: 'number', default: 50, step: 1, min: 1 },
      { name: 'K', label: 'Successes in population (K)', type: 'number', default: 25, step: 1, min: 0 },
      { name: 'n', label: 'Sample size (n)', type: 'number', default: 10, step: 1, min: 1 }
    ],
    discrete: true,
    ev: (p) => p.n * (p.K / p.N),
    se: (p) => Math.sqrt(p.n * (p.K / p.N) * (1 - p.K / p.N) * ((p.N - p.n) / (p.N - 1)))
  },
  negativebinomial: {
    label: 'Negative Binomial',
    params: [
      { name: 'r', label: 'Number of successes (r)', type: 'number', default: 5, step: 1, min: 1 },
      { name: 'p', label: 'Success probability (p)', type: 'number', default: 0.5, step: 0.01, min: 0.01, max: 1 }
    ],
    discrete: true,
    ev: (p) => p.r / p.p,
    se: (p) => Math.sqrt(p.r * (1 - p.p) / (p.p * p.p))
  },
  poisson: {
    label: 'Poisson',
    params: [
      { name: 'lambda', label: 'Rate (λ)', type: 'number', default: 5, step: 0.1, min: 0.01 }
    ],
    discrete: true,
    ev: (p) => p.lambda,
    se: (p) => Math.sqrt(p.lambda)
  },
  t: {
    label: "Student's t",
    params: [
      { name: 'df', label: 'Degrees of freedom (df)', type: 'number', default: 10, step: 1, min: 1 }
    ],
    discrete: false,
    ev: (p) => 0,
    se: (p) => p.df > 2 ? Math.sqrt(p.df / (p.df - 2)) : Infinity
  }
};

/**
 * Calculate probability for a distribution
 */
function calculateProbability(distribution, params, useLo, lo, useHi, hi) {
  const dist = DISTRIBUTIONS[distribution];
  
  // For discrete distributions, round bounds to integers
  if (dist.discrete) {
    lo = Math.round(lo);
    hi = Math.round(hi);
  }
  
  // Calculate CDF values
  let cdfLo = 0;
  let cdfHi = 1;
  
  if (useLo) {
    switch (distribution) {
      case 'normal':
        cdfLo = normalCDF(lo, params.mean, params.sd);
        break;
      case 'binomial':
        cdfLo = lo > 0 ? binomialCDF(lo - 1, params.n, params.p) : 0;
        break;
      case 'chisquare':
        cdfLo = chiSquareCDF(lo, params.df);
        break;
      case 'exponential':
        cdfLo = exponentialCDF(lo, params.rate);
        break;
      case 'geometric':
        cdfLo = lo > 1 ? geometricCDF(lo - 1, params.p) : 0;
        break;
      case 'hypergeometric':
        cdfLo = lo > 0 ? hypergeometricCDF(lo - 1, params.N, params.K, params.n) : 0;
        break;
      case 'negativebinomial':
        cdfLo = lo > 0 ? negativeBinomialCDF(lo - 1, params.r, params.p) : 0;
        break;
      case 'poisson':
        cdfLo = lo > 0 ? poissonCDF(lo - 1, params.lambda) : 0;
        break;
      case 't':
        cdfLo = tCDF(lo, params.df);
        break;
    }
  }
  
  if (useHi) {
    switch (distribution) {
      case 'normal':
        cdfHi = normalCDF(hi, params.mean, params.sd);
        break;
      case 'binomial':
        cdfHi = binomialCDF(hi, params.n, params.p);
        break;
      case 'chisquare':
        cdfHi = chiSquareCDF(hi, params.df);
        break;
      case 'exponential':
        cdfHi = exponentialCDF(hi, params.rate);
        break;
      case 'geometric':
        cdfHi = geometricCDF(hi, params.p);
        break;
      case 'hypergeometric':
        cdfHi = hypergeometricCDF(hi, params.N, params.K, params.n);
        break;
      case 'negativebinomial':
        cdfHi = negativeBinomialCDF(hi, params.r, params.p);
        break;
      case 'poisson':
        cdfHi = poissonCDF(hi, params.lambda);
        break;
      case 't':
        cdfHi = tCDF(hi, params.df);
        break;
    }
  }
  
  return cdfHi - cdfLo;
}

/**
 * Main render function
 */
export function render({ model, el }) {
  // Inject CSS
  injectStyles();
  
  // Get initial state
  let title = model.get('title');
  let presentationMode = model.get('mode') || 'sentence'; // 'sentence' or 'table'
  let distribution = model.get('distribution') || 'normal';
  const initialParams = model.get('params') || {};
  let useLo = model.get('use_lo') !== false;
  let lo = model.get('lo') || -1;
  let useHi = model.get('use_hi') !== false;
  let hi = model.get('hi') || 1;
  
  // Initialize params with defaults
  let params = {};
  DISTRIBUTIONS[distribution].params.forEach(p => {
    params[p.name] = initialParams[p.name] !== undefined ? initialParams[p.name] : p.default;
  });

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

  // Distribution selector
  const distGroup = document.createElement('div');
  distGroup.className = 'widget-input-group';
  distGroup.style.marginBottom = '1rem';
  distGroup.style.display = presentationMode === 'sentence' ? 'inline-block' : 'block';
  
  const distLabel = document.createElement('label');
  distLabel.className = 'widget-label';
  if (presentationMode === 'sentence') {
    distLabel.textContent = 'If X has a ';
    distLabel.style.display = 'inline';
    distLabel.style.fontWeight = 'normal';
  } else {
    distLabel.textContent = 'Distribution: ';
    distLabel.style.display = 'block';
    distLabel.style.marginBottom = '0.5rem';
    distLabel.style.fontWeight = 'bold';
  }
  
  const distSelect = document.createElement('select');
  distSelect.className = 'widget-select';
  distSelect.style.width = presentationMode === 'sentence' ? 'auto' : '100%';
  distSelect.style.padding = '0.5rem';
  distSelect.style.fontSize = '1rem';
  distSelect.setAttribute('aria-label', 'Distribution');
  
  Object.keys(DISTRIBUTIONS).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = DISTRIBUTIONS[key].label;
    if (key === distribution) option.selected = true;
    distSelect.appendChild(option);
  });
  
  distGroup.appendChild(distLabel);
  distGroup.appendChild(distSelect);
  if (presentationMode === 'sentence') {
    const distSuffix = document.createElement('span');
    distSuffix.textContent = ' distribution with ';
    distGroup.appendChild(distSuffix);
  }
  container.appendChild(distGroup);

  // Parameters container
  const paramsContainer = document.createElement('div');
  if (presentationMode === 'table') {
    paramsContainer.style.marginBottom = '1rem';
    paramsContainer.style.padding = '1rem';
    paramsContainer.style.background = getCSSVar('--widget-bg-secondary');
    paramsContainer.style.borderRadius = '4px';
  } else {
    paramsContainer.style.display = 'inline-block';
  }
  paramsContainer.setAttribute('data-testid', 'params-container');
  container.appendChild(paramsContainer);

  if (presentationMode === 'sentence') {
    const commaSpan = document.createElement('span');
    commaSpan.textContent = ', the chance that ';
    container.appendChild(commaSpan);
  }

  // Bounds container
  const boundsContainer = document.createElement('div');
  if (presentationMode === 'table') {
    boundsContainer.style.marginBottom = '1rem';
    boundsContainer.style.padding = '1rem';
    boundsContainer.style.background = getCSSVar('--widget-bg-secondary');
    boundsContainer.style.borderRadius = '4px';
    
    const boundsTitle = document.createElement('div');
    boundsTitle.textContent = 'Probability Range';
    boundsTitle.style.fontWeight = 'bold';
    boundsTitle.style.marginBottom = '0.75rem';
    boundsContainer.appendChild(boundsTitle);
  } else {
    boundsContainer.style.display = 'inline-block';
    boundsContainer.style.verticalAlign = 'middle';
  }
  
  // Lower bound
  const loGroup = document.createElement('div');
  if (presentationMode === 'table') {
    loGroup.style.marginBottom = '0.75rem';
    loGroup.style.display = 'flex';
  } else {
    loGroup.style.display = 'inline-flex';
  }
  loGroup.style.alignItems = 'center';
  loGroup.style.gap = '0.5rem';
  
  const loCheckbox = document.createElement('input');
  loCheckbox.type = 'checkbox';
  loCheckbox.checked = useLo;
  loCheckbox.setAttribute('aria-label', 'Use lower bound');
  
  const loLabel = document.createElement('label');
  loLabel.textContent = presentationMode === 'sentence' ? '≤ X ' : 'Lower bound:';
  if (presentationMode === 'table') loLabel.style.minWidth = '100px';
  
  const loInput = document.createElement('input');
  loInput.className = 'widget-input';
  loInput.type = 'number';
  loInput.value = lo;
  loInput.step = '0.1';
  if (presentationMode === 'table') {
    loInput.style.flex = '1';
  } else {
    loInput.style.width = '60px';
  }
  loInput.disabled = !useLo;
  loInput.setAttribute('aria-label', 'Lower bound value');
  
  loGroup.appendChild(loCheckbox);
  if (presentationMode === 'sentence') {
    loGroup.appendChild(loInput);
    loGroup.appendChild(loLabel);
  } else {
    loGroup.appendChild(loLabel);
    loGroup.appendChild(loInput);
  }
  boundsContainer.appendChild(loGroup);
  
  if (presentationMode === 'sentence') {
    const andSpan = document.createElement('span');
    andSpan.textContent = ' and ';
    andSpan.style.margin = '0 0.5rem';
    boundsContainer.appendChild(andSpan);
  }
  
  // Upper bound
  const hiGroup = document.createElement('div');
  hiGroup.style.display = presentationMode === 'sentence' ? 'inline-flex' : 'flex';
  hiGroup.style.alignItems = 'center';
  hiGroup.style.gap = '0.5rem';
  
  const hiCheckbox = document.createElement('input');
  hiCheckbox.type = 'checkbox';
  hiCheckbox.checked = useHi;
  hiCheckbox.setAttribute('aria-label', 'Use upper bound');
  
  const hiLabel = document.createElement('label');
  hiLabel.textContent = 'Upper bound:';
  hiLabel.style.minWidth = '100px';
  
  const hiInput = document.createElement('input');
  hiInput.className = 'widget-input';
  hiInput.type = 'number';
  hiInput.value = hi;
  hiInput.step = '0.1';
  hiInput.style.flex = '1';
  hiInput.disabled = !useHi;
  hiInput.setAttribute('aria-label', 'Upper bound value');
  
  hiGroup.appendChild(hiCheckbox);
  hiGroup.appendChild(hiLabel);
  hiGroup.appendChild(hiInput);
  boundsContainer.appendChild(hiGroup);
  
  container.appendChild(boundsContainer);

  if (presentationMode === 'sentence') {
    const isSpan = document.createElement('span');
    isSpan.textContent = ' is ';
    container.appendChild(isSpan);
  }

  // Results container
  const resultsContainer = document.createElement(presentationMode === 'table' ? 'div' : 'span');
  if (presentationMode === 'table') {
    resultsContainer.style.padding = '1rem';
    resultsContainer.style.background = getCSSVar('--widget-bg-secondary');
    resultsContainer.style.borderRadius = '4px';
    resultsContainer.style.fontSize = '1rem';
  } else {
    resultsContainer.style.display = 'inline';
    resultsContainer.style.fontSize = '1rem';
  }
  resultsContainer.setAttribute('data-testid', 'results-container');
  
  const probResult = document.createElement(presentationMode === 'table' ? 'div' : 'span');
  if (presentationMode === 'table') {
    probResult.style.marginBottom = '0.75rem';
    probResult.style.fontSize = '1.125rem';
    probResult.style.fontWeight = 'bold';
  } else {
    probResult.style.display = 'inline';
    probResult.style.fontWeight = 'bold';
  }
  probResult.setAttribute('data-testid', 'prob-result');
  
  const evResult = document.createElement(presentationMode === 'table' ? 'div' : 'span');
  if (presentationMode === 'table') {
    evResult.style.marginBottom = '0.5rem';
  } else {
    evResult.style.display = 'inline';
    evResult.style.marginLeft = '0.5rem';
  }
  evResult.setAttribute('data-testid', 'ev-result');
  
  const seResult = document.createElement(presentationMode === 'table' ? 'div' : 'span');
  if (presentationMode === 'table') {
    seResult.style.marginBottom = '0';
  } else {
    seResult.style.display = 'inline';
    seResult.style.marginLeft = '0.5rem';
  }
  seResult.setAttribute('data-testid', 'se-result');
  
  resultsContainer.appendChild(probResult);
  resultsContainer.appendChild(evResult);
  resultsContainer.appendChild(seResult);
  container.appendChild(resultsContainer);

  // Function to render parameter inputs
  function renderParams() {
    paramsContainer.innerHTML = '';
    
    const paramInputs = {};
    
    DISTRIBUTIONS[distribution].params.forEach((paramDef, index) => {
      const group = document.createElement('div');
      
      if (presentationMode === 'table') {
        group.style.marginBottom = '0.75rem';
      } else {
        group.style.display = 'inline-flex';
        group.style.alignItems = 'center';
        if (index > 0) {
          group.style.marginLeft = '0.5rem';
        }
      }
      
      const label = document.createElement('label');
      label.className = 'widget-label';
      if (presentationMode === 'table') {
        label.textContent = paramDef.label;
        label.style.display = 'block';
        label.style.marginBottom = '0.25rem';
      } else {
        label.textContent = paramDef.name + ' = ';
        label.style.display = 'inline';
        label.style.marginRight = '0.25rem';
        label.style.fontWeight = 'normal';
      }
      
      const input = document.createElement('input');
      input.className = 'widget-input';
      input.type = paramDef.type;
      input.value = params[paramDef.name] || paramDef.default;
      input.step = paramDef.step || '1';
      if (paramDef.min !== undefined) input.min = paramDef.min;
      if (paramDef.max !== undefined) input.max = paramDef.max;
      
      if (presentationMode === 'table') {
        input.style.width = '100%';
      } else {
        input.style.width = '60px';
      }
      
      input.setAttribute('aria-label', paramDef.label);
      input.setAttribute('data-param', paramDef.name);
      
      input.addEventListener('input', () => {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
          params[paramDef.name] = value;
          updateResults();
        }
      });
      
      group.appendChild(label);
      group.appendChild(input);
      
      if (presentationMode === 'sentence' && index < DISTRIBUTIONS[distribution].params.length - 1) {
        const comma = document.createElement('span');
        comma.textContent = ',';
        group.appendChild(comma);
      }
      
      paramsContainer.appendChild(group);
      
      paramInputs[paramDef.name] = input;
    });
    
    return paramInputs;
  }

  // Function to update results
  function updateResults() {
    const dist = DISTRIBUTIONS[distribution];
    
    // Update bound inputs for discrete distributions
    if (dist.discrete) {
      loInput.step = '1';
      hiInput.step = '1';
    } else {
      loInput.step = '0.1';
      hiInput.step = '0.1';
    }
    
    const prob = calculateProbability(distribution, params, useLo, lo, useHi, hi);
    const ev = dist.ev(params);
    const se = dist.se(params);
    
    // Format probability display
    const loStr = useLo ? (dist.discrete ? Math.round(lo).toString() : lo.toFixed(2)) : '-∞';
    const hiStr = useHi ? (dist.discrete ? Math.round(hi).toString() : hi.toFixed(2)) : '+∞';
    
    if (presentationMode === 'table') {
      probResult.innerHTML = `<strong>P(${loStr} ≤ X ≤ ${hiStr}) = ${prob.toFixed(4)}</strong> (${(prob * 100).toFixed(2)}%)`;
      evResult.innerHTML = `<strong>Expected Value:</strong> ${ev.toFixed(4)}`;
      seResult.innerHTML = `<strong>Standard Error:</strong> ${se.toFixed(4)}`;
    } else {
      probResult.innerHTML = `${prob.toFixed(4)} (${(prob * 100).toFixed(2)}%).`;
      evResult.innerHTML = `E(X) = ${ev.toFixed(4)},`;
      seResult.innerHTML = `SE(X) = ${se.toFixed(4)}.`;
    }
  }

  // Initial render
  let paramInputs = renderParams();
  updateResults();
  
  // Append container to el
  el.appendChild(container);

  // Event listeners
  distSelect.addEventListener('change', () => {
    distribution = distSelect.value;
    
    // Reset params to defaults for new distribution
    params = {};
    DISTRIBUTIONS[distribution].params.forEach(p => {
      params[p.name] = p.default;
    });
    
    paramInputs = renderParams();
    updateResults();
  });

  loCheckbox.addEventListener('change', () => {
    useLo = loCheckbox.checked;
    loInput.disabled = !useLo;
    updateResults();
  });

  loInput.addEventListener('input', () => {
    const value = parseFloat(loInput.value);
    if (!isNaN(value)) {
      lo = value;
      updateResults();
    }
  });

  hiCheckbox.addEventListener('change', () => {
    useHi = hiCheckbox.checked;
    hiInput.disabled = !useHi;
    updateResults();
  });

  hiInput.addEventListener('input', () => {
    const value = parseFloat(hiInput.value);
    if (!isNaN(value)) {
      hi = value;
      updateResults();
    }
  });

  // No cleanup needed (no ResizeObserver or other resources)
  return () => {};
}

export default { render };
