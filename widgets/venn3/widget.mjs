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

  // Coordinates for circles (initialize on first render)
  let coords = null;

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
    model.set('pa', pa);
    if (coords) updateProbsFromCoords();
    renderVenn();
    updateProbDisplay();
  });
  controls.appendChild(paSlider.group);
  
  // P(B) slider
  const pbSlider = createSlider('P(B):', pb, 'pb-slider', (newValue) => {
    pb = newValue;
    model.set('pb', pb);
    if (coords) updateProbsFromCoords();
    renderVenn();
    updateProbDisplay();
  });
  controls.appendChild(pbSlider.group);
  
  // P(C) slider
  const pcSlider = createSlider('P(C):', pc, 'pc-slider', (newValue) => {
    pc = newValue;
    model.set('pc', pc);
    if (coords) updateProbsFromCoords();
    renderVenn();
    updateProbDisplay();
  });
  controls.appendChild(pcSlider.group);
  
  
  container.appendChild(controls);
  

  const highlightOptions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'Ac', label: 'Ac' },
    { value: 'Bc', label: 'Bc' },
    { value: 'Cc', label: 'Cc' },
    { value: 'AB', label: 'A∩B' },
    { value: 'AC', label: 'A∩C' },
    { value: 'BC', label: 'B∩C' },
    { value: 'AorB', label: 'A∪B' },
    { value: 'AorC', label: 'A∪C' },
    { value: 'BorC', label: 'B∪C' },
    { value: 'ABC', label: 'A∩B∩C' },
    { value: 'AorBorC', label: 'A∪B∪C' },
    { value: 'ABc', label: 'A∩Bc' },
    { value: 'AcB', label: 'Ac∩B' },
    { value: 'AcBC', label: 'Ac∩B∩C' },
    { value: 'AcorBC', label: 'Ac∪(B∩C)' },
    { value: 'S', label: 'S' },
    { value: 'empty', label: '{}' },
    { value: 'PA_B', label: 'P(A|B)' },
    { value: 'PAc_B', label: 'P(Ac|B)' },
    { value: 'PB_A', label: 'P(B|A)' },
    { value: 'PA_BC', label: 'P(A|BC)' },
    { value: 'PAc_BC', label: 'P(Ac|BC)' },
    { value: 'PA_BorC', label: 'P(A|B∪C)' }
  ];

  const highlightGroup = document.createElement('div');
  highlightGroup.className = 'widget-input-group';
  highlightGroup.style.marginBottom = '1rem';
  
  const highlightLabel = document.createElement('label');
  highlightLabel.className = 'widget-label';
  highlightLabel.textContent = 'Highlight:';
  
  const highlightSelect = document.createElement('select');
  highlightSelect.className = 'widget-select';
  highlightSelect.setAttribute('data-testid', 'highlight-select');
  
  highlightOptions.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.innerHTML = opt.label;
    if (opt.value === highlight) option.selected = true;
    highlightSelect.appendChild(option);
  });
  
  highlightSelect.addEventListener('change', () => {
    highlight = highlightSelect.value;
    model.set('highlight', highlight);
    updateHighlight();
  });
  
  highlightGroup.appendChild(highlightLabel);
  highlightGroup.appendChild(highlightSelect);
  container.appendChild(highlightGroup);

  function updateButtons() {
    highlightSelect.value = highlight;
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

  let currentGeom = null;

  function computeGeometry() {
    const rect = svgContainer.getBoundingClientRect();
    const width = rect.width || 500;
    const height = rect.height || 500;
    const padding = 40;
    
    const availableWidth = width - 2 * padding;
    const availableHeight = height - 2 * padding;
    const maxDim = Math.min(availableWidth, availableHeight);
    
    const C = maxDim / 2.2;
    const rA = C * Math.sqrt(pa);
    const rB = C * Math.sqrt(pb);
    const rC = C * Math.sqrt(pc);
    
    if (!coords) {
      // Initial equilateral triangle
      const targetAreaAB = C * C * pab;
      const targetAreaAC = C * C * pac;
      const targetAreaBC = C * C * pbc;
      
      const dAB = findDistanceForIntersection(rA, rB, targetAreaAB);
      const dAC = findDistanceForIntersection(rA, rC, targetAreaAC);
      const dBC = findDistanceForIntersection(rB, rC, targetAreaBC);
      
      const centerX = width / 2;
      const centerY = height / 2;
      const avgDist = (dAB + dAC + dBC) / 3;
      const triangleHeight = avgDist * Math.sqrt(3) / 2;
      
      coords = {
        xA: centerX,
        yA: centerY - triangleHeight * 0.5,
        xB: centerX - avgDist / 2,
        yB: centerY + triangleHeight * 0.5,
        xC: centerX + avgDist / 2,
        yC: centerY + triangleHeight * 0.5
      };
    }
    
    currentGeom = { 
      rA, rB, rC, 
      xA: coords.xA, yA: coords.yA, 
      xB: coords.xB, yB: coords.yB, 
      xC: coords.xC, yC: coords.yC, 
      width, height, C 
    };
    return currentGeom;
  }

  function get3CircleIntersectionArea(geom) {
    // Fast numerical approximation (Monte Carlo)
    const { xA, yA, rA, xB, yB, rB, xC, yC, rC } = geom;
    
    // Bounding box of intersection
    const minX = Math.max(xA - rA, xB - rB, xC - rC);
    const maxX = Math.min(xA + rA, xB + rB, xC + rC);
    const minY = Math.max(yA - rA, yB - rB, yC - rC);
    const maxY = Math.min(yA + rA, yB + rB, yC + rC);
    
    if (minX >= maxX || minY >= maxY) return 0;
    
    const N = 10000;
    let hits = 0;
    const w = maxX - minX;
    const h = maxY - minY;
    
    // Fixed seed for stable display if needed, but random is fine for fast display
    for (let i = 0; i < N; i++) {
      const px = minX + Math.random() * w;
      const py = minY + Math.random() * h;
      
      if ((px - xA)**2 + (py - yA)**2 <= rA**2 &&
          (px - xB)**2 + (py - yB)**2 <= rB**2 &&
          (px - xC)**2 + (py - yC)**2 <= rC**2) {
        hits++;
      }
    }
    
    return (w * h) * (hits / N);
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
    

    // SVG Mask Helpers for Complex Regions
    let maskCounter = 0;
    function createMask(includes, excludes) {
      maskCounter++;
      const maskId = 'mask_venn3_' + maskCounter;
      const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
      mask.setAttribute('id', maskId);
      
      const baseRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      baseRect.setAttribute('x', '0');
      baseRect.setAttribute('y', '0');
      baseRect.setAttribute('width', geom.width);
      baseRect.setAttribute('height', geom.height);
      baseRect.setAttribute('fill', includes.length === 0 ? 'white' : 'black');
      mask.appendChild(baseRect);
      
      if (includes.length > 0) {
        let parent = mask;
        for (let i = 0; i < includes.length - 1; i++) {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('clip-path', `url(#${includes[i]})`);
          parent.appendChild(g);
          parent = g;
        }
        const includeRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        includeRect.setAttribute('x', '0');
        includeRect.setAttribute('y', '0');
        includeRect.setAttribute('width', geom.width);
        includeRect.setAttribute('height', geom.height);
        includeRect.setAttribute('fill', 'white');
        includeRect.setAttribute('clip-path', `url(#${includes[includes.length - 1]})`);
        parent.appendChild(includeRect);
      }
      
      excludes.forEach(ex => {
        const excludeRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        excludeRect.setAttribute('x', '0');
        excludeRect.setAttribute('y', '0');
        excludeRect.setAttribute('width', geom.width);
        excludeRect.setAttribute('height', geom.height);
        excludeRect.setAttribute('fill', 'black');
        excludeRect.setAttribute('clip-path', `url(#${ex})`);
        mask.appendChild(excludeRect);
      });
      
      defs.appendChild(mask);
      return maskId;
    }

    function createUnionMask(regions) {
      maskCounter++;
      const maskId = 'maskUnion_' + maskCounter;
      const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
      mask.setAttribute('id', maskId);
      
      const baseRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      baseRect.setAttribute('x', '0');
      baseRect.setAttribute('y', '0');
      baseRect.setAttribute('width', geom.width);
      baseRect.setAttribute('height', geom.height);
      baseRect.setAttribute('fill', 'black');
      mask.appendChild(baseRect);
      
      regions.forEach(inc => {
        const incRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        incRect.setAttribute('x', '0');
        incRect.setAttribute('y', '0');
        incRect.setAttribute('width', geom.width);
        incRect.setAttribute('height', geom.height);
        incRect.setAttribute('fill', 'white');
        incRect.setAttribute('clip-path', `url(#${inc})`);
        mask.appendChild(incRect);
      });
      
      defs.appendChild(mask);
      return maskId;
    }

    function createAcorBCMask() {
      maskCounter++;
      const maskId = 'maskAcorBC_' + maskCounter;
      const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
      mask.setAttribute('id', maskId);
      
      const baseRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      baseRect.setAttribute('x', '0');
      baseRect.setAttribute('y', '0');
      baseRect.setAttribute('width', geom.width);
      baseRect.setAttribute('height', geom.height);
      baseRect.setAttribute('fill', 'white');
      mask.appendChild(baseRect);
      
      const exclA = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      exclA.setAttribute('x', '0');
      exclA.setAttribute('y', '0');
      exclA.setAttribute('width', geom.width);
      exclA.setAttribute('height', geom.height);
      exclA.setAttribute('fill', 'black');
      exclA.setAttribute('clip-path', 'url(#clipA)');
      mask.appendChild(exclA);
      
      const gBC = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gBC.setAttribute('clip-path', 'url(#clipB)');
      const bcRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bcRect.setAttribute('x', '0');
      bcRect.setAttribute('y', '0');
      bcRect.setAttribute('width', geom.width);
      bcRect.setAttribute('height', geom.height);
      bcRect.setAttribute('fill', 'white');
      bcRect.setAttribute('clip-path', 'url(#clipC)');
      gBC.appendChild(bcRect);
      mask.appendChild(gBC);
      
      defs.appendChild(mask);
      return maskId;
    }

    function createIntersectionUnionMask(intersectRegion, unionRegions) {
      maskCounter++;
      const maskId = 'maskIntUn_' + maskCounter;
      const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
      mask.setAttribute('id', maskId);
      
      const baseRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      baseRect.setAttribute('x', '0');
      baseRect.setAttribute('y', '0');
      baseRect.setAttribute('width', geom.width);
      baseRect.setAttribute('height', geom.height);
      baseRect.setAttribute('fill', 'black');
      mask.appendChild(baseRect);
      
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('clip-path', `url(#${intersectRegion})`);
      
      unionRegions.forEach(inc => {
        const incRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        incRect.setAttribute('x', '0');
        incRect.setAttribute('y', '0');
        incRect.setAttribute('width', geom.width);
        incRect.setAttribute('height', geom.height);
        incRect.setAttribute('fill', 'white');
        incRect.setAttribute('clip-path', `url(#${inc})`);
        g.appendChild(incRect);
      });
      
      mask.appendChild(g);
      defs.appendChild(mask);
      return maskId;
    }

    function fillMaskedRect(maskId, fill, opacity) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', fill);
      rect.setAttribute('fill-opacity', opacity);
      rect.setAttribute('mask', `url(#${maskId})`);
      highlightGroup.appendChild(rect);
    }

    if (highlight === 'A') {
      fillMaskedRect(createMask(['clipA'], []), '#fbbf24', '0.75');
    } else if (highlight === 'B') {
      fillMaskedRect(createMask(['clipB'], []), '#fbbf24', '0.75');
    } else if (highlight === 'C') {
      fillMaskedRect(createMask(['clipC'], []), '#fbbf24', '0.75');
    } else if (highlight === 'Ac') {
      fillMaskedRect(createMask([], ['clipA']), '#fbbf24', '0.75');
    } else if (highlight === 'Bc') {
      fillMaskedRect(createMask([], ['clipB']), '#fbbf24', '0.75');
    } else if (highlight === 'Cc') {
      fillMaskedRect(createMask([], ['clipC']), '#fbbf24', '0.75');
    } else if (highlight === 'AB') {
      fillMaskedRect(createMask(['clipA', 'clipB'], []), '#fbbf24', '0.75');
    } else if (highlight === 'AC') {
      fillMaskedRect(createMask(['clipA', 'clipC'], []), '#fbbf24', '0.75');
    } else if (highlight === 'BC') {
      fillMaskedRect(createMask(['clipB', 'clipC'], []), '#fbbf24', '0.75');
    } else if (highlight === 'AorB') {
      fillMaskedRect(createUnionMask(['clipA', 'clipB']), '#fbbf24', '0.75');
    } else if (highlight === 'AorC') {
      fillMaskedRect(createUnionMask(['clipA', 'clipC']), '#fbbf24', '0.75');
    } else if (highlight === 'BorC') {
      fillMaskedRect(createUnionMask(['clipB', 'clipC']), '#fbbf24', '0.75');
    } else if (highlight === 'ABC') {
      fillMaskedRect(createMask(['clipA', 'clipB', 'clipC'], []), '#fbbf24', '0.75');
    } else if (highlight === 'AorBorC') {
      fillMaskedRect(createUnionMask(['clipA', 'clipB', 'clipC']), '#fbbf24', '0.75');
    } else if (highlight === 'ABc') {
      fillMaskedRect(createMask(['clipA'], ['clipB']), '#fbbf24', '0.75');
    } else if (highlight === 'AcB') {
      fillMaskedRect(createMask(['clipB'], ['clipA']), '#fbbf24', '0.75');
    } else if (highlight === 'AcBC') {
      fillMaskedRect(createMask(['clipB', 'clipC'], ['clipA']), '#fbbf24', '0.75');
    } else if (highlight === 'AcorBC') {
      fillMaskedRect(createAcorBCMask(), '#fbbf24', '0.75');
    } else if (highlight === 'S') {
      fillMaskedRect(createMask([], []), '#fbbf24', '0.75');
    } else if (highlight === 'empty') {
      // empty is not highlighted
    } else if (highlight === 'PA_B') {
      fillMaskedRect(createMask(['clipB'], []), 'cyan', '0.5');
      fillMaskedRect(createMask(['clipA', 'clipB'], []), '#fbbf24', '0.75');
    } else if (highlight === 'PAc_B') {
      fillMaskedRect(createMask(['clipB'], []), 'cyan', '0.5');
      fillMaskedRect(createMask(['clipB'], ['clipA']), '#fbbf24', '0.75');
    } else if (highlight === 'PB_A') {
      fillMaskedRect(createMask(['clipA'], []), 'cyan', '0.5');
      fillMaskedRect(createMask(['clipA', 'clipB'], []), '#fbbf24', '0.75');
    } else if (highlight === 'PA_BC') {
      fillMaskedRect(createMask(['clipB', 'clipC'], []), 'cyan', '0.5');
      fillMaskedRect(createMask(['clipA', 'clipB', 'clipC'], []), '#fbbf24', '0.75');
    } else if (highlight === 'PAc_BC') {
      fillMaskedRect(createMask(['clipB', 'clipC'], []), 'cyan', '0.5');
      fillMaskedRect(createMask(['clipB', 'clipC'], ['clipA']), '#fbbf24', '0.75');
    } else if (highlight === 'PA_BorC') {
      fillMaskedRect(createUnionMask(['clipB', 'clipC']), 'cyan', '0.5');
      fillMaskedRect(createIntersectionUnionMask('clipA', ['clipB', 'clipC']), '#fbbf24', '0.75');
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
  
  // Drag handling
  let dragging = null;
  let dragOffset = { x: 0, y: 0 };
  
  function handleMouseDown(e) {
    if (!currentGeom) return;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const distA = Math.hypot(x - coords.xA, y - coords.yA);
    const distB = Math.hypot(x - coords.xB, y - coords.yB);
    const distC = Math.hypot(x - coords.xC, y - coords.yC);
    
    // Determine which circle was clicked. If overlapping, arbitrary priority C > B > A.
    let clicked = null;
    let minDist = Infinity;
    
    if (distC <= currentGeom.rC) { clicked = 'C'; minDist = distC; }
    if (distB <= currentGeom.rB && (clicked === null || distB < minDist)) { clicked = 'B'; minDist = distB; }
    if (distA <= currentGeom.rA && (clicked === null || distA < minDist)) { clicked = 'A'; minDist = distA; }
    
    if (clicked) {
      dragging = clicked;
      dragOffset = { x: x - coords[`x${clicked}`], y: y - coords[`y${clicked}`] };
      e.preventDefault(); // Prevent text selection while dragging
    }
  }
  
  function handleMouseMove(e) {
    if (!dragging || !currentGeom) {
      if (currentGeom) {
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const distA = Math.hypot(x - coords.xA, y - coords.yA);
        const distB = Math.hypot(x - coords.xB, y - coords.yB);
        const distC = Math.hypot(x - coords.xC, y - coords.yC);
        
        if (distA <= currentGeom.rA || distB <= currentGeom.rB || distC <= currentGeom.rC) {
          svg.style.cursor = 'grab';
        } else {
          svg.style.cursor = 'default';
        }
      }
      return;
    }
    svg.style.cursor = 'grabbing';
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
    coords[`x${dragging}`] = x;
    coords[`y${dragging}`] = y;
    
    updateProbsFromCoords();
    renderVenn();
    updateProbDisplay();
  }
  
  function handleMouseUp() {
    dragging = null;
  }
  
  function updateProbsFromCoords() {
    const geom = computeGeometry();
    const C2 = geom.C * geom.C;
    
    const dAB = Math.hypot(coords.xA - coords.xB, coords.yA - coords.yB);
    const dAC = Math.hypot(coords.xA - coords.xC, coords.yA - coords.yC);
    const dBC = Math.hypot(coords.xB - coords.xC, coords.yB - coords.yC);
    
    const areaAB = circleIntersectionArea(geom.rA, geom.rB, dAB);
    const areaAC = circleIntersectionArea(geom.rA, geom.rC, dAC);
    const areaBC = circleIntersectionArea(geom.rB, geom.rC, dBC);
    
    pab = Math.max(0, Math.min(pa, pb, areaAB / C2));
    pac = Math.max(0, Math.min(pa, pc, areaAC / C2));
    pbc = Math.max(0, Math.min(pb, pc, areaBC / C2));
    
    const areaABC = get3CircleIntersectionArea(geom);
    pabc = Math.max(0, Math.min(pab, pac, pbc, areaABC / C2));
    
    model.set('pab', pab);
    model.set('pac', pac);
    model.set('pbc', pbc);
    model.set('pabc', pabc);
  }

  svg.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  
  // Cleanup
  return () => {
    svg.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
}

export default { render };
