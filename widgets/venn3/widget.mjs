import styles from './styles.css';

// Inject styles into document
function injectStyles() {
  if (!document.getElementById('venn3-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'venn3-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
}

// Helper to get CSS variable value
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Venn Diagram - 3 Sets Widget
 * 
 * Three draggable circles representing sets A, B, and C arranged in an equilateral triangle.
 * Sliders control P(A), P(B), P(C), P(AB), P(AC), P(BC), P(ABC).
 * Buttons highlight different set operations.
 * 
 * Model state:
 * - pa: P(A) - probability of set A (0 to 1)
 * - pb: P(B) - probability of set B (0 to 1)
 * - pc: P(C) - probability of set C (0 to 1)
 * - pab: P(A∩B) - probability of A and B (0 to min(pa, pb))
 * - pac: P(A∩C) - probability of A and C (0 to min(pa, pc))
 * - pbc: P(B∩C) - probability of B and C (0 to min(pb, pc))
 * - pabc: P(A∩B∩C) - probability of all three (0 to min(pab, pac, pbc))
 * - highlight: region to highlight ("A", "B", "C", "ABC", "AB", "AC", "BC", "S")
 */

/**
 * Compute intersection area of two circles
 * Uses the two-circle intersection area formula
 */
function circleIntersectionArea(r1, r2, d) {
  // If circles don't overlap
  if (d >= r1 + r2) return 0;
  
  // If one circle is inside the other
  if (d <= Math.abs(r1 - r2)) {
    const smaller = Math.min(r1, r2);
    return Math.PI * smaller * smaller;
  }
  
  // General case: partial overlap
  const part1 = r1 * r1 * Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1));
  const part2 = r2 * r2 * Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2));
  const part3 = 0.5 * Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2));
  
  return part1 + part2 - part3;
}

/**
 * Use Newton's method to find distance d such that intersection area equals target
 */
function findDistanceForIntersection(r1, r2, targetArea, maxIterations = 50) {
  // Handle edge case where target area is very small
  if (targetArea < 0.0001) {
    return r1 + r2; // Non-overlapping
  }
  
  // Initial guess: circles overlap by half
  let d = Math.abs(r1 - r2) + (r1 + r2 - Math.abs(r1 - r2)) / 2;
  
  const epsilon = 0.0001;
  
  for (let i = 0; i < maxIterations; i++) {
    const area = circleIntersectionArea(r1, r2, d);
    const error = area - targetArea;
    
    if (Math.abs(error) < epsilon) {
      return d;
    }
    
    // Numerical derivative
    const h = 0.001;
    const areaPlus = circleIntersectionArea(r1, r2, d + h);
    const derivative = (areaPlus - area) / h;
    
    if (Math.abs(derivative) < epsilon) {
      break;
    }
    
    // Newton's method update
    d = d - error / derivative;
    
    // Constrain d to valid range
    d = Math.max(Math.abs(r1 - r2), Math.min(r1 + r2, d));
  }
  
  return d;
}

/**
 * Main render function
 */
export function render({ model, el }) {
  // Inject CSS
  injectStyles();

  // Get model state
  let title = model.get('title');
  let pa = model.get('pa') || 0.5;
  let pb = model.get('pb') || 0.4;
  let pc = model.get('pc') || 0.3;
  let pab = model.get('pab') || 0.15;
  let pac = model.get('pac') || 0.12;
  let pbc = model.get('pbc') || 0.10;
  let pabc = model.get('pabc') || 0.05;
  let highlight = model.get('highlight') || 'ABC';
  
  // Ensure valid probabilities
  pa = Math.max(0, Math.min(1, pa));
  pb = Math.max(0, Math.min(1, pb));
  pc = Math.max(0, Math.min(1, pc));
  pab = Math.max(0, Math.min(pa, pb, pab));
  pac = Math.max(0, Math.min(pa, pc, pac));
  pbc = Math.max(0, Math.min(pb, pc, pbc));
  pabc = Math.max(0, Math.min(pab, pac, pbc, pabc));
  
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
  
  // Controls container
  const controls = document.createElement('div');
  controls.style.marginBottom = '1rem';
  controls.style.display = 'grid';
  controls.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
  controls.style.gap = '1rem';
  
  // Helper function to create a slider
  function createSlider(label, value, testid, onInput) {
    const group = document.createElement('div');
    const labelEl = document.createElement('label');
    labelEl.className = 'widget-label';
    labelEl.textContent = label;
    labelEl.style.display = 'block';
    labelEl.style.marginBottom = '0.25rem';
    
    const slider = document.createElement('input');
    slider.className = 'widget-input';
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.01';
    slider.value = value;
    slider.style.width = '100%';
    slider.setAttribute('data-testid', testid);
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'widget-label';
    valueSpan.textContent = value.toFixed(3);
    valueSpan.style.marginLeft = '0.5rem';
    valueSpan.setAttribute('data-testid', `${testid}-value`);
    
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.appendChild(slider);
    row.appendChild(valueSpan);
    
    group.appendChild(labelEl);
    group.appendChild(row);
    
    slider.addEventListener('input', () => {
      const newValue = parseFloat(slider.value);
      valueSpan.textContent = newValue.toFixed(3);
      onInput(newValue);
    });
    
    return { group, slider, valueSpan };
  }
  
  // P(A) slider
  const paSlider = createSlider('P(A):', pa, 'pa-slider', (newValue) => {
    pa = newValue;
    pab = Math.min(pab, pa, pb);
    pac = Math.min(pac, pa, pc);
    pabc = Math.min(pabc, pab, pac, pbc);
    
    model.set('pa', pa);
    model.set('pab', pab);
    model.set('pac', pac);
    model.set('pabc', pabc);
    
    renderVenn();
    updateProbDisplay();
  });
  controls.appendChild(paSlider.group);
  
  // P(B) slider
  const pbSlider = createSlider('P(B):', pb, 'pb-slider', (newValue) => {
    pb = newValue;
    pab = Math.min(pab, pa, pb);
    pbc = Math.min(pbc, pb, pc);
    pabc = Math.min(pabc, pab, pac, pbc);
    
    model.set('pb', pb);
    model.set('pab', pab);
    model.set('pbc', pbc);
    model.set('pabc', pabc);
    
    renderVenn();
    updateProbDisplay();
  });
  controls.appendChild(pbSlider.group);
  
  // P(C) slider
  const pcSlider = createSlider('P(C):', pc, 'pc-slider', (newValue) => {
    pc = newValue;
    pac = Math.min(pac, pa, pc);
    pbc = Math.min(pbc, pb, pc);
    pabc = Math.min(pabc, pab, pac, pbc);
    
    model.set('pc', pc);
    model.set('pac', pac);
    model.set('pbc', pbc);
    model.set('pabc', pabc);
    
    renderVenn();
    updateProbDisplay();
  });
  controls.appendChild(pcSlider.group);
  
  // P(A∩B) slider
  const pabSlider = createSlider('P(A∩B):', pab, 'pab-slider', (newValue) => {
    pab = Math.min(newValue, pa, pb);
    pabc = Math.min(pabc, pab, pac, pbc);
    
    model.set('pab', pab);
    model.set('pabc', pabc);
    
    renderVenn();
    updateProbDisplay();
  });
  controls.appendChild(pabSlider.group);
  
  // P(A∩C) slider
  const pacSlider = createSlider('P(A∩C):', pac, 'pac-slider', (newValue) => {
    pac = Math.min(newValue, pa, pc);
    pabc = Math.min(pabc, pab, pac, pbc);
    
    model.set('pac', pac);
    model.set('pabc', pabc);
    
    renderVenn();
    updateProbDisplay();
  });
  controls.appendChild(pacSlider.group);
  
  // P(B∩C) slider
  const pbcSlider = createSlider('P(B∩C):', pbc, 'pbc-slider', (newValue) => {
    pbc = Math.min(newValue, pb, pc);
    pabc = Math.min(pabc, pab, pac, pbc);
    
    model.set('pbc', pbc);
    model.set('pabc', pabc);
    
    renderVenn();
    updateProbDisplay();
  });
  controls.appendChild(pbcSlider.group);
  
  // P(A∩B∩C) slider
  const pabcSlider = createSlider('P(A∩B∩C):', pabc, 'pabc-slider', (newValue) => {
    pabc = Math.min(newValue, pab, pac, pbc);
    
    model.set('pabc', pabc);
    
    renderVenn();
    updateProbDisplay();
  });
  controls.appendChild(pabcSlider.group);
  
  container.appendChild(controls);
  
  // Highlight buttons
  const highlightRow = document.createElement('div');
  highlightRow.style.marginBottom = '1rem';
  highlightRow.style.display = 'flex';
  highlightRow.style.gap = '0.5rem';
  highlightRow.style.flexWrap = 'wrap';
  
  const highlightOptions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'AB', label: 'A∩B' },
    { value: 'AC', label: 'A∩C' },
    { value: 'BC', label: 'B∩C' },
    { value: 'ABC', label: 'A∩B∩C' },
    { value: 'S', label: 'S' }
  ];
  
  highlightOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = opt.value === highlight ? 'widget-button widget-button-accent' : 'widget-button';
    btn.textContent = opt.label;
    btn.style.padding = '0.5rem 1rem';
    btn.setAttribute('data-testid', `highlight-${opt.value}`);
    btn.addEventListener('click', () => {
      highlight = opt.value;
      model.set('highlight', highlight);
      updateHighlight();
      updateButtons();
    });
    highlightRow.appendChild(btn);
  });
  
  container.appendChild(highlightRow);
  
  function updateButtons() {
    const buttons = highlightRow.querySelectorAll('button');
    buttons.forEach((btn, i) => {
      const opt = highlightOptions[i];
      btn.className = opt.value === highlight ? 'widget-button widget-button-accent' : 'widget-button';
    });
  }
  
  // Probability display
  const probDisplay = document.createElement('div');
  probDisplay.className = 'widget-display';
  probDisplay.setAttribute('data-testid', 'prob-display');
  container.appendChild(probDisplay);
  
  // SVG container
  const svgContainer = document.createElement('div');
  svgContainer.style.width = '100%';
  svgContainer.style.height = '500px';
  svgContainer.style.border = `1px solid ${getCSSVar('--widget-border-light')}`;
  svgContainer.style.borderRadius = '4px';
  svgContainer.style.background = getCSSVar('--widget-bg-primary');
  svgContainer.setAttribute('data-testid', 'svg-container');
  container.appendChild(svgContainer);
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.setAttribute('data-testid', 'venn-svg');
  svgContainer.appendChild(svg);
  
  /**
   * Compute circle positions and radii
   * Circles are arranged in an equilateral triangle
   */
  function computeGeometry() {
    const rect = svgContainer.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    
    const availableWidth = width - 2 * padding;
    const availableHeight = height - 2 * padding;
    const maxDim = Math.min(availableWidth, availableHeight);
    
    // Scale factor: map probabilities to radii
    // Area = π * r² = C² * p, so r = C * √p
    const sumSqrt = Math.sqrt(pa) + Math.sqrt(pb) + Math.sqrt(pc);
    const C = maxDim / (2.5 * sumSqrt);
    
    const rA = C * Math.sqrt(pa);
    const rB = C * Math.sqrt(pb);
    const rC = C * Math.sqrt(pc);
    
    // Find distances between centers using intersection areas
    const targetAreaAB = C * C * pab;
    const targetAreaAC = C * C * pac;
    const targetAreaBC = C * C * pbc;
    
    const dAB = findDistanceForIntersection(rA, rB, targetAreaAB);
    const dAC = findDistanceForIntersection(rA, rC, targetAreaAC);
    const dBC = findDistanceForIntersection(rB, rC, targetAreaBC);
    
    // Position circles in equilateral triangle arrangement
    // A at top, B at bottom-left, C at bottom-right
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Compute triangle height based on average distance
    const avgDist = (dAB + dAC + dBC) / 3;
    const triangleHeight = avgDist * Math.sqrt(3) / 2;
    
    const xA = centerX;
    const yA = centerY - triangleHeight * 0.5;
    
    const xB = centerX - avgDist / 2;
    const yB = centerY + triangleHeight * 0.5;
    
    const xC = centerX + avgDist / 2;
    const yC = centerY + triangleHeight * 0.5;
    
    return { rA, rB, rC, xA, yA, xB, yB, xC, yC, width, height };
  }
  
  /**
   * Update probability display
   */
  function updateProbDisplay() {
    // Compute union using inclusion-exclusion
    const pAorBorC = pa + pb + pc - pab - pac - pbc + pabc;
    
    probDisplay.innerHTML = 
      `P(A) = ${pa.toFixed(3)} | P(B) = ${pb.toFixed(3)} | P(C) = ${pc.toFixed(3)}<br>` +
      `P(A∩B) = ${pab.toFixed(3)} | P(A∩C) = ${pac.toFixed(3)} | P(B∩C) = ${pbc.toFixed(3)}<br>` +
      `P(A∩B∩C) = ${pabc.toFixed(3)} | P(A∪B∪C) = ${pAorBorC.toFixed(3)}`;
  }
  
  /**
   * Render the Venn diagram
   */
  function renderVenn() {
    // Clear SVG
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    const geom = computeGeometry();
    
    // Create defs for clip paths
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Clip path for circle A
    const clipA = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipA.setAttribute('id', 'clipA');
    const clipACircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    clipACircle.setAttribute('cx', geom.xA);
    clipACircle.setAttribute('cy', geom.yA);
    clipACircle.setAttribute('r', geom.rA);
    clipA.appendChild(clipACircle);
    defs.appendChild(clipA);
    
    // Clip path for circle B
    const clipB = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipB.setAttribute('id', 'clipB');
    const clipBCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    clipBCircle.setAttribute('cx', geom.xB);
    clipBCircle.setAttribute('cy', geom.yB);
    clipBCircle.setAttribute('r', geom.rB);
    clipB.appendChild(clipBCircle);
    defs.appendChild(clipB);
    
    // Clip path for circle C
    const clipC = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipC.setAttribute('id', 'clipC');
    const clipCCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    clipCCircle.setAttribute('cx', geom.xC);
    clipCCircle.setAttribute('cy', geom.yC);
    clipCCircle.setAttribute('r', geom.rC);
    clipC.appendChild(clipCCircle);
    defs.appendChild(clipC);
    
    svg.appendChild(defs);
    
    // Draw highlight region based on current highlight mode
    const highlightGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    highlightGroup.setAttribute('data-testid', 'highlight-region');
    
    if (highlight === 'A') {
      // Entire circle A
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', 'yellow');
      rect.setAttribute('fill-opacity', '0.5');
      rect.setAttribute('clip-path', 'url(#clipA)');
      highlightGroup.appendChild(rect);
    } else if (highlight === 'B') {
      // Entire circle B
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', 'yellow');
      rect.setAttribute('fill-opacity', '0.5');
      rect.setAttribute('clip-path', 'url(#clipB)');
      highlightGroup.appendChild(rect);
    } else if (highlight === 'C') {
      // Entire circle C
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', 'yellow');
      rect.setAttribute('fill-opacity', '0.5');
      rect.setAttribute('clip-path', 'url(#clipC)');
      highlightGroup.appendChild(rect);
    } else if (highlight === 'AB') {
      // Intersection A ∩ B
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('clip-path', 'url(#clipA)');
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', 'yellow');
      rect.setAttribute('fill-opacity', '0.5');
      rect.setAttribute('clip-path', 'url(#clipB)');
      g.appendChild(rect);
      highlightGroup.appendChild(g);
    } else if (highlight === 'AC') {
      // Intersection A ∩ C
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('clip-path', 'url(#clipA)');
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', 'yellow');
      rect.setAttribute('fill-opacity', '0.5');
      rect.setAttribute('clip-path', 'url(#clipC)');
      g.appendChild(rect);
      highlightGroup.appendChild(g);
    } else if (highlight === 'BC') {
      // Intersection B ∩ C
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('clip-path', 'url(#clipB)');
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', 'yellow');
      rect.setAttribute('fill-opacity', '0.5');
      rect.setAttribute('clip-path', 'url(#clipC)');
      g.appendChild(rect);
      highlightGroup.appendChild(g);
    } else if (highlight === 'ABC') {
      // Intersection A ∩ B ∩ C (all three)
      const g1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g1.setAttribute('clip-path', 'url(#clipA)');
      
      const g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g2.setAttribute('clip-path', 'url(#clipB)');
      
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', 'yellow');
      rect.setAttribute('fill-opacity', '0.5');
      rect.setAttribute('clip-path', 'url(#clipC)');
      
      g2.appendChild(rect);
      g1.appendChild(g2);
      highlightGroup.appendChild(g1);
    } else if (highlight === 'S') {
      // Entire sample space
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', 'yellow');
      rect.setAttribute('fill-opacity', '0.5');
      highlightGroup.appendChild(rect);
    }
    
    svg.appendChild(highlightGroup);
    
    // Draw circles (outline only)
    const circleA = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleA.setAttribute('cx', geom.xA);
    circleA.setAttribute('cy', geom.yA);
    circleA.setAttribute('r', geom.rA);
    circleA.setAttribute('fill', 'none');
    circleA.style.stroke = getCSSVar('--widget-primary');
    circleA.setAttribute('stroke-width', '2');
    circleA.setAttribute('data-testid', 'circle-a');
    svg.appendChild(circleA);
    
    const circleB = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleB.setAttribute('cx', geom.xB);
    circleB.setAttribute('cy', geom.yB);
    circleB.setAttribute('r', geom.rB);
    circleB.setAttribute('fill', 'none');
    circleB.style.stroke = getCSSVar('--widget-accent');
    circleB.setAttribute('stroke-width', '2');
    circleB.setAttribute('data-testid', 'circle-b');
    svg.appendChild(circleB);
    
    const circleC = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleC.setAttribute('cx', geom.xC);
    circleC.setAttribute('cy', geom.yC);
    circleC.setAttribute('r', geom.rC);
    circleC.setAttribute('fill', 'none');
    circleC.style.stroke = getCSSVar('--widget-chart-line');
    circleC.setAttribute('stroke-width', '2');
    circleC.setAttribute('data-testid', 'circle-c');
    svg.appendChild(circleC);
    
    // Labels
    const labelA = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelA.setAttribute('x', geom.xA);
    labelA.setAttribute('y', geom.yA - geom.rA * 0.6);
    labelA.setAttribute('text-anchor', 'middle');
    labelA.setAttribute('dominant-baseline', 'middle');
    labelA.style.fill = getCSSVar('--widget-text-primary');
    labelA.setAttribute('font-size', '1.5rem');
    labelA.setAttribute('font-weight', 'bold');
    labelA.textContent = 'A';
    svg.appendChild(labelA);
    
    const labelB = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelB.setAttribute('x', geom.xB - geom.rB * 0.6);
    labelB.setAttribute('y', geom.yB + geom.rB * 0.4);
    labelB.setAttribute('text-anchor', 'middle');
    labelB.setAttribute('dominant-baseline', 'middle');
    labelB.style.fill = getCSSVar('--widget-text-primary');
    labelB.setAttribute('font-size', '1.5rem');
    labelB.setAttribute('font-weight', 'bold');
    labelB.textContent = 'B';
    svg.appendChild(labelB);
    
    const labelC = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelC.setAttribute('x', geom.xC + geom.rC * 0.6);
    labelC.setAttribute('y', geom.yC + geom.rC * 0.4);
    labelC.setAttribute('text-anchor', 'middle');
    labelC.setAttribute('dominant-baseline', 'middle');
    labelC.style.fill = getCSSVar('--widget-text-primary');
    labelC.setAttribute('font-size', '1.5rem');
    labelC.setAttribute('font-weight', 'bold');
    labelC.textContent = 'C';
    svg.appendChild(labelC);
  }
  
  /**
   * Update highlight region only (without full re-render)
   */
  function updateHighlight() {
    renderVenn();
  }
  
  // Append container to element
  el.appendChild(container);
  
  // Initial render
  renderVenn();
  updateProbDisplay();
  updateButtons();
  
  // Cleanup
  return () => {
    // No global event listeners in this version
  };
}

export default { render };
