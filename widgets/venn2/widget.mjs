/**
 * Venn Diagram - 2 Sets Widget
 * 
 * Two draggable circles representing sets A and B.
 * Sliders control P(A) and P(B), dragging changes P(A∩B).
 * Buttons highlight different set operations.
 * 
 * Model state:
 * - pa: P(A) - probability of set A (0 to 1)
 * - pb: P(B) - probability of set B (0 to 1)
 * - pab: P(A∩B) - probability of intersection (0 to min(pa, pb))
 * - highlight: region to highlight ("A", "B", "S", "empty", "Ac", "Bc", "AB", "AorB", "AcB", "ABc")
 */

import styles from './styles.css';

// Inject styles into document
function injectStyles() {
  if (!document.getElementById('venn2-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'venn2-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
}

// Helper to get CSS variable value
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

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
  let pa = model.get('pa') || 0.4;
  let pb = model.get('pb') || 0.3;
  let pab = model.get('pab') || 0.1;
  let highlight = model.get('highlight') || 'AB';
  
  let coords = null;
  let currentGeom = null;
  
  // Ensure valid probabilities
  pa = Math.max(0, Math.min(1, pa));
  pb = Math.max(0, Math.min(1, pb));
  pab = Math.max(0, Math.min(pa, pb, pab));
  
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
  controls.className = 'widget-controls';
  controls.style.gap = '2rem';
  
  // P(A) slider
  const paGroup = document.createElement('div');
  paGroup.className = 'widget-input-group';
  paGroup.style.flex = '1';
  paGroup.style.minWidth = '200px';
  paGroup.style.flexDirection = 'column';
  paGroup.style.alignItems = 'flex-start';
  const paLabel = document.createElement('label');
  paLabel.className = 'widget-label';
  paLabel.textContent = 'P(A):';
  const paSlider = document.createElement('input');
  paSlider.className = 'widget-input';
  paSlider.type = 'range';
  paSlider.min = '0';
  paSlider.max = '1';
  paSlider.step = '0.01';
  paSlider.value = pa;
  paSlider.style.width = '100%';
  paSlider.setAttribute('data-testid', 'pa-slider');
  const paValue = document.createElement('span');
  paValue.className = 'widget-label';
  paValue.textContent = pa.toFixed(3);
  paValue.style.marginLeft = '0.5rem';
  paValue.setAttribute('data-testid', 'pa-value');
  paGroup.appendChild(paLabel);
  const paRow = document.createElement('div');
  paRow.style.display = 'flex';
  paRow.style.alignItems = 'center';
  paRow.appendChild(paSlider);
  paRow.appendChild(paValue);
  paGroup.appendChild(paRow);
  controls.appendChild(paGroup);
  
  // P(B) slider
  const pbGroup = document.createElement('div');
  pbGroup.className = 'widget-input-group';
  pbGroup.style.flex = '1';
  pbGroup.style.minWidth = '200px';
  pbGroup.style.flexDirection = 'column';
  pbGroup.style.alignItems = 'flex-start';
  const pbLabel = document.createElement('label');
  pbLabel.className = 'widget-label';
  pbLabel.textContent = 'P(B):';
  const pbSlider = document.createElement('input');
  pbSlider.className = 'widget-input';
  pbSlider.type = 'range';
  pbSlider.min = '0';
  pbSlider.max = '1';
  pbSlider.step = '0.01';
  pbSlider.value = pb;
  pbSlider.style.width = '100%';
  pbSlider.setAttribute('data-testid', 'pb-slider');
  const pbValue = document.createElement('span');
  pbValue.className = 'widget-label';
  pbValue.textContent = pb.toFixed(3);
  pbValue.style.marginLeft = '0.5rem';
  pbValue.setAttribute('data-testid', 'pb-value');
  pbGroup.appendChild(pbLabel);
  const pbRow = document.createElement('div');
  pbRow.style.display = 'flex';
  pbRow.style.alignItems = 'center';
  pbRow.appendChild(pbSlider);
  pbRow.appendChild(pbValue);
  pbGroup.appendChild(pbRow);
  controls.appendChild(pbGroup);
  
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
    { value: 'AB', label: 'A∩B' },
    { value: 'AorB', label: 'A∪B' },
    { value: 'AcB', label: 'A\'∩B' },
    { value: 'ABc', label: 'A∩B\'' },
    { value: 'Ac', label: 'A\'' },
    { value: 'Bc', label: 'B\'' },
    { value: 'S', label: 'S' },
    { value: 'empty', label: '∅' }
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
   */
  function computeGeometry() {
    const rect = svgContainer.getBoundingClientRect();
    const width = rect.width || 500;
    const height = rect.height || 500;
    const padding = 40;
    
    const availableWidth = width - 2 * padding;
    const availableHeight = height - 2 * padding;
    const maxDim = Math.min(availableWidth, availableHeight);
    
    // Scale factor: map probabilities to radii
    const C = maxDim / 2.2;
    
    const rA = C * Math.sqrt(Math.max(0.0001, pa));
    const rB = C * Math.sqrt(Math.max(0.0001, pb));
    
    if (!coords) {
      // Find distance between centers
      const targetIntersectionArea = Math.PI * C * C * pab;
      const d = findDistanceForIntersection(rA, rB, targetIntersectionArea);
      
      // Center positions (A on left, B on right)
      const centerX = width / 2;
      const centerY = height / 2;
      
      coords = {
        xA: centerX - d / 2,
        yA: centerY,
        xB: centerX + d / 2,
        yB: centerY
      };
    }
    
    currentGeom = { 
      rA, rB, 
      xA: coords.xA, yA: coords.yA, 
      xB: coords.xB, yB: coords.yB, 
      width, height, C 
    };
    return currentGeom;
  }
  
  /**
   * Update probability display
   */
  function updateProbDisplay() {
    const pAonly = pa - pab;
    const pBonly = pb - pab;
    const pNeither = 1 - pa - pb + pab;
    const pAorB = pa + pb - pab;
    
    probDisplay.textContent = 
      `P(A) = ${pa.toFixed(3)} | P(B) = ${pb.toFixed(3)} | ` +
      `P(A∩B) = ${pab.toFixed(3)} | P(A∪B) = ${pAorB.toFixed(3)}`;
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
      rect.setAttribute('fill', '#fbbf24');
      rect.setAttribute('fill-opacity', '0.75');
      rect.setAttribute('clip-path', 'url(#clipA)');
      highlightGroup.appendChild(rect);
    } else if (highlight === 'B') {
      // Entire circle B
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', '#fbbf24');
      rect.setAttribute('fill-opacity', '0.75');
      rect.setAttribute('clip-path', 'url(#clipB)');
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
      rect.setAttribute('fill', '#fbbf24');
      rect.setAttribute('fill-opacity', '0.75');
      rect.setAttribute('clip-path', 'url(#clipB)');
      g.appendChild(rect);
      highlightGroup.appendChild(g);
    } else if (highlight === 'AorB') {
      // Union A ∪ B
      const rectA = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rectA.setAttribute('x', '0');
      rectA.setAttribute('y', '0');
      rectA.setAttribute('width', geom.width);
      rectA.setAttribute('height', geom.height);
      rectA.setAttribute('fill', '#fbbf24');
      rectA.setAttribute('fill-opacity', '0.75');
      rectA.setAttribute('clip-path', 'url(#clipA)');
      highlightGroup.appendChild(rectA);
      
      const rectB = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rectB.setAttribute('x', '0');
      rectB.setAttribute('y', '0');
      rectB.setAttribute('width', geom.width);
      rectB.setAttribute('height', geom.height);
      rectB.setAttribute('fill', '#fbbf24');
      rectB.setAttribute('fill-opacity', '0.75');
      rectB.setAttribute('clip-path', 'url(#clipB)');
      highlightGroup.appendChild(rectB);
    } else if (highlight === 'AcB') {
      // A' ∩ B (B minus A)
      const clipNotA = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipNotA.setAttribute('id', 'clipNotA');
      const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bgRect.setAttribute('x', '0');
      bgRect.setAttribute('y', '0');
      bgRect.setAttribute('width', geom.width);
      bgRect.setAttribute('height', geom.height);
      clipNotA.appendChild(bgRect);
      const holeA = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      holeA.setAttribute('cx', geom.xA);
      holeA.setAttribute('cy', geom.yA);
      holeA.setAttribute('r', geom.rA);
      holeA.setAttribute('fill', 'black');
      clipNotA.appendChild(holeA);
      defs.appendChild(clipNotA);
      
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('clip-path', 'url(#clipB)');
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', '#fbbf24');
      rect.setAttribute('fill-opacity', '0.75');
      g.appendChild(rect);
      
      // Subtract A from B by clipping
      const maskA = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      maskA.setAttribute('cx', geom.xA);
      maskA.setAttribute('cy', geom.yA);
      maskA.setAttribute('r', geom.rA);
      maskA.setAttribute('fill', 'white');
      maskA.setAttribute('fill-opacity', '1');
      g.appendChild(maskA);
      
      highlightGroup.appendChild(g);
    } else if (highlight === 'ABc') {
      // A ∩ B' (A minus B)
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('clip-path', 'url(#clipA)');
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', '#fbbf24');
      rect.setAttribute('fill-opacity', '0.75');
      g.appendChild(rect);
      
      const maskB = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      maskB.setAttribute('cx', geom.xB);
      maskB.setAttribute('cy', geom.yB);
      maskB.setAttribute('r', geom.rB);
      maskB.setAttribute('fill', 'white');
      maskB.setAttribute('fill-opacity', '1');
      g.appendChild(maskB);
      
      highlightGroup.appendChild(g);
    } else if (highlight === 'Ac') {
      // Complement of A (everything except A)
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', '#fbbf24');
      rect.setAttribute('fill-opacity', '0.75');
      highlightGroup.appendChild(rect);
      
      // Subtract A by drawing white circle on top
      const maskA = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      maskA.setAttribute('cx', geom.xA);
      maskA.setAttribute('cy', geom.yA);
      maskA.setAttribute('r', geom.rA);
      maskA.style.fill = getCSSVar('--widget-bg-primary');
      maskA.setAttribute('fill-opacity', '1');
      highlightGroup.appendChild(maskA);
    } else if (highlight === 'Bc') {
      // Complement of B (everything except B)
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', '#fbbf24');
      rect.setAttribute('fill-opacity', '0.75');
      highlightGroup.appendChild(rect);
      
      // Subtract B by drawing white circle on top
      const maskB = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      maskB.setAttribute('cx', geom.xB);
      maskB.setAttribute('cy', geom.yB);
      maskB.setAttribute('r', geom.rB);
      maskB.style.fill = getCSSVar('--widget-bg-primary');
      maskB.setAttribute('fill-opacity', '1');
      highlightGroup.appendChild(maskB);
    } else if (highlight === 'S') {
      // Entire sample space
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', geom.width);
      rect.setAttribute('height', geom.height);
      rect.setAttribute('fill', '#fbbf24');
      rect.setAttribute('fill-opacity', '0.75');
      highlightGroup.appendChild(rect);
    }
    // empty is not highlighted
    
    svg.appendChild(highlightGroup);
    

    // Draw Universal Set S bounding box and label
    const sBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    sBox.setAttribute('x', '2');
    sBox.setAttribute('y', '2');
    sBox.setAttribute('width', geom.width - 4);
    sBox.setAttribute('height', geom.height - 4);
    sBox.setAttribute('fill', 'none');
    sBox.setAttribute('stroke', getCSSVar('--widget-border-dark'));
    sBox.setAttribute('stroke-width', '1');
    svg.appendChild(sBox);
    
    const sLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    sLabel.setAttribute('x', '10');
    sLabel.setAttribute('y', '20');
    sLabel.setAttribute('fill', getCSSVar('--widget-text-primary'));
    sLabel.setAttribute('font-size', '16');
    sLabel.setAttribute('font-weight', 'bold');
    sLabel.textContent = 'S';
    svg.appendChild(sLabel);

    // Draw circles (outline only)
    const circleA = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleA.setAttribute('cx', geom.xA);
    circleA.setAttribute('cy', geom.yA);
    circleA.setAttribute('r', geom.rA);
    circleA.setAttribute('fill', 'none');
    circleA.style.stroke = getCSSVar('--widget-primary');
    circleA.setAttribute('stroke-width', '2');
    circleA.setAttribute('data-testid', 'circle-a');
    circleA.style.cursor = 'move';
    svg.appendChild(circleA);
    
    const circleB = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleB.setAttribute('cx', geom.xB);
    circleB.setAttribute('cy', geom.yB);
    circleB.setAttribute('r', geom.rB);
    circleB.setAttribute('fill', 'none');
    circleB.style.stroke = getCSSVar('--widget-accent');
    circleB.setAttribute('stroke-width', '2');
    circleB.setAttribute('data-testid', 'circle-b');
    circleB.style.cursor = 'move';
    svg.appendChild(circleB);
    
    // Labels
    const labelA = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelA.setAttribute('x', geom.xA - geom.rA * 0.7);
    labelA.setAttribute('y', geom.yA);
    labelA.setAttribute('text-anchor', 'middle');
    labelA.setAttribute('dominant-baseline', 'middle');
    labelA.style.fill = getCSSVar('--widget-text-primary');
    labelA.setAttribute('font-size', '1.5rem');
    labelA.setAttribute('font-weight', 'bold');
    labelA.textContent = 'A';
    svg.appendChild(labelA);
    
    const labelB = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelB.setAttribute('x', geom.xB + geom.rB * 0.7);
    labelB.setAttribute('y', geom.yB);
    labelB.setAttribute('text-anchor', 'middle');
    labelB.setAttribute('dominant-baseline', 'middle');
    labelB.style.fill = getCSSVar('--widget-text-primary');
    labelB.setAttribute('font-size', '1.5rem');
    labelB.setAttribute('font-weight', 'bold');
    labelB.textContent = 'B';
    svg.appendChild(labelB);
  }
  
  /**
   * Drag Handlers
   */
  let dragging = null;
  let dragOffset = { x: 0, y: 0 };
  
  function handleMouseDown(e) {
    if (!currentGeom) return;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const distA = Math.hypot(x - coords.xA, y - coords.yA);
    const distB = Math.hypot(x - coords.xB, y - coords.yB);
    
    let clicked = null;
    let minDist = Infinity;
    
    if (distB <= currentGeom.rB) { clicked = 'B'; minDist = distB; }
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
        
        if (distA <= currentGeom.rA || distB <= currentGeom.rB) {
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
    const C2 = Math.PI * geom.C * geom.C;
    
    const dAB = Math.hypot(coords.xA - coords.xB, coords.yA - coords.yB);
    const areaAB = circleIntersectionArea(geom.rA, geom.rB, dAB);
    
    pab = Math.max(0, Math.min(pa, pb, areaAB / C2));
    
    model.set('pab', pab);
  }
  
  /**
   * Update highlight region only (without full re-render)
   */
  function updateHighlight() {
    renderVenn();
  }
  
  // Event handlers for sliders
  paSlider.addEventListener('input', () => {
    pa = parseFloat(paSlider.value);
    paValue.textContent = pa.toFixed(3);
    
    model.set('pa', pa);
    if (coords) updateProbsFromCoords();
    renderVenn();
    updateProbDisplay();
  });
  
  pbSlider.addEventListener('input', () => {
    pb = parseFloat(pbSlider.value);
    pbValue.textContent = pb.toFixed(3);
    
    model.set('pb', pb);
    if (coords) updateProbsFromCoords();
    renderVenn();
    updateProbDisplay();
  });
  
  // Global mouse handlers for dragging
  svg.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  
  // Append container to element
  el.appendChild(container);
  
  // Initial render
  renderVenn();
  updateProbDisplay();
  updateButtons();
  
  // Cleanup
  return () => {
    svg.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
}

export default { render };
