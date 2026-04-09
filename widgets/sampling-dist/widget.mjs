/**
 * Sampling Distributions Widget
 */
import { PRNG } from '../../src/sim/prng.mjs';
import { mean, sampleSD, sd, normalPDF, normalCDFRange } from '../../src/math/stats-math.mjs';
import { bin } from 'd3-array';
import styles from './styles.css';

function injectStyles() {
  if (!document.getElementById('sampling-dist-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'sampling-dist-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
}

// Helper to get CSS variable value
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function render({ model, el }) {
  injectStyles();
  
  // State
  let statistic = model.get('statistic') || 'mean';
  let populationType = model.get('population_type') || 'box';
  let populationValues = model.get('population_values') || [0, 1, 2, 3, 4];
  let withReplacement = model.get('with_replacement') ?? true;
  
  let sampleSize = model.get('sample_size') || 25;
  let samplesPerClick = model.get('samples_per_click') || 1;
  let numBins = model.get('bins') || 50;
  
  let lo = model.get('lo') || null;
  let hi = model.get('hi') || null;
  
  let showPopHist = true;
  let curveType = 'Normal Curve';
  let seed = model.get('seed') || 42;
  
  let sampleStats = [];
  
  // Create UI
  const container = document.createElement('div');
  container.className = 'widget-container';
  
  // Group 1: Configuration
  const configControls = document.createElement('div');
  configControls.className = 'widget-controls';
  
  const statGroup = document.createElement('div');
  statGroup.className = 'widget-input-group';
  statGroup.innerHTML = '<label class="widget-label">Distribution of:</label>';
  const statSelect = document.createElement('select');
  statSelect.className = 'widget-select';
  ['mean', 'sum', 'variance', 'chi_square'].forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s === 'chi_square' ? 'Chi-Square' : s.charAt(0).toUpperCase() + s.slice(1);
    if(s === statistic) opt.selected = true;
    statSelect.appendChild(opt);
  });
  statGroup.appendChild(statSelect);
  
  const popGroup = document.createElement('div');
  popGroup.className = 'widget-input-group';
  popGroup.innerHTML = '<label class="widget-label">Sample from:</label>';
  const popSelect = document.createElement('select');
  popSelect.className = 'widget-select';
  ['box', 'uniform', 'normal'].forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p.charAt(0).toUpperCase() + p.slice(1);
    if(p === populationType) opt.selected = true;
    popSelect.appendChild(opt);
  });
  popGroup.appendChild(popSelect);
  
  const boxInputGroup = document.createElement('div');
  boxInputGroup.className = 'widget-input-group';
  const boxInput = document.createElement('input');
  boxInput.type = 'text';
  boxInput.className = 'widget-input';
  boxInput.style.width = '150px';
  boxInput.value = populationValues.join(', ');
  boxInputGroup.appendChild(boxInput);
  
  const replaceGroup = document.createElement('div');
  replaceGroup.className = 'widget-checkbox';
  const replaceCheck = document.createElement('input');
  replaceCheck.type = 'checkbox';
  replaceCheck.id = 'sd-replace-check';
  replaceCheck.checked = withReplacement;
  const replaceLabel = document.createElement('label');
  replaceLabel.htmlFor = 'sd-replace-check';
  replaceLabel.textContent = 'With replacement';
  replaceGroup.append(replaceCheck, replaceLabel);
  
  configControls.append(statGroup, popGroup, boxInputGroup, replaceGroup);
  
  // Group 2: Sampling Parameters
  const sampleControls = document.createElement('div');
  sampleControls.className = 'widget-controls';
  
  const szGroup = document.createElement('div');
  szGroup.className = 'widget-input-group';
  szGroup.innerHTML = '<label class="widget-label">Sample Size:</label>';
  const szInput = document.createElement('input');
  szInput.type = 'number'; szInput.value = sampleSize; szInput.className = 'widget-input';
  szGroup.appendChild(szInput);
  
  const spcGroup = document.createElement('div');
  spcGroup.className = 'widget-input-group';
  spcGroup.innerHTML = '<label class="widget-label">Take N samples:</label>';
  const spcInput = document.createElement('input');
  spcInput.type = 'number'; spcInput.value = samplesPerClick; spcInput.className = 'widget-input';
  spcGroup.appendChild(spcInput);
  
  const binGroup = document.createElement('div');
  binGroup.className = 'widget-input-group';
  binGroup.innerHTML = '<label class="widget-label">Bins:</label>';
  const binInput = document.createElement('input');
  binInput.type = 'number'; binInput.value = numBins; binInput.className = 'widget-input';
  binGroup.appendChild(binInput);
  
  const takeSampleBtn = document.createElement('button');
  takeSampleBtn.className = 'widget-button widget-button-primary';
  takeSampleBtn.textContent = 'Take Sample';
  
  const clearBtn = document.createElement('button');
  clearBtn.className = 'widget-button widget-button-secondary';
  clearBtn.textContent = 'Clear';
  
  sampleControls.append(szGroup, spcGroup, binGroup, takeSampleBtn, clearBtn);
  
  // Group 3: Analysis
  const highlightControls = document.createElement('div');
  highlightControls.className = 'widget-controls';
  
  const areaGroup = document.createElement('div');
  areaGroup.className = 'widget-input-group';
  areaGroup.innerHTML = '<label class="widget-label">Area from:</label>';
  const areaFromInput = document.createElement('input');
  areaFromInput.type = 'number'; areaFromInput.className = 'widget-input'; areaFromInput.style.width = '70px';
  areaFromInput.value = lo !== null ? lo : '';
  const toLabel = document.createElement('span');
  toLabel.className = 'widget-label'; toLabel.textContent = 'to:';
  const areaToInput = document.createElement('input');
  areaToInput.type = 'number'; areaToInput.className = 'widget-input'; areaToInput.style.width = '70px';
  areaToInput.value = hi !== null ? hi : '';
  areaGroup.append(areaFromInput, toLabel, areaToInput);
  
  const curveGroup = document.createElement('div');
  curveGroup.className = 'widget-input-group';
  curveGroup.innerHTML = '<label class="widget-label">Curve:</label>';
  const curveSelect = document.createElement('select');
  curveSelect.className = 'widget-select';
  ['Normal Curve', 'None'].forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    curveSelect.appendChild(opt);
  });
  curveGroup.appendChild(curveSelect);
  
  const togglePopHistBtn = document.createElement('button');
  togglePopHistBtn.className = 'widget-button widget-button-secondary';
  togglePopHistBtn.textContent = 'No Population Histogram';
  
  highlightControls.append(areaGroup, curveGroup, togglePopHistBtn);
  
  // Stats Dashboard
  const statsDashboard = document.createElement('div');
  statsDashboard.style.display = 'grid';
  statsDashboard.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
  statsDashboard.style.gap = '15px';
  statsDashboard.style.padding = '15px';
  statsDashboard.style.backgroundColor = 'var(--widget-bg-secondary)';
  statsDashboard.style.borderRadius = '8px';
  statsDashboard.style.marginBottom = '20px';
  statsDashboard.style.color = 'var(--widget-text-primary)';
  statsDashboard.style.fontSize = '14px';
  
  const boxStats = document.createElement('div');
  const theoStats = document.createElement('div');
  const empStats = document.createElement('div');
  const areaStats = document.createElement('div');
  
  statsDashboard.append(boxStats, theoStats, empStats, areaStats);
  
  // Chart Container
  const chartContainer = document.createElement('div');
  chartContainer.className = 'widget-chart-container';
  const mainSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  mainSvg.setAttribute('class', 'widget-chart-svg');
  mainSvg.style.width = '100%';
  mainSvg.style.height = '400px';
  chartContainer.appendChild(mainSvg);
  
  container.append(configControls, sampleControls, highlightControls, statsDashboard, chartContainer);
  el.appendChild(container);
  
  // Logic Functions
  function updateVisibility() {
    boxInputGroup.style.display = populationType === 'box' ? 'flex' : 'none';
  }
  updateVisibility();
  
  function getPopulation() {
    return populationType === 'uniform' ? 'uniform' : populationType === 'normal' ? 'normal' : populationValues;
  }
  
  function drawSample(prng, pop, n, replacement) {
    const sample = [];
    if (pop === 'uniform') {
      for (let i=0; i<n; i++) sample.push(prng.nextFloat());
    } else if (pop === 'normal') {
      for (let i=0; i<n; i++) sample.push(prng.nextNormal(0, 1));
    } else {
      let pool = [...pop];
      for (let i=0; i<n; i++) {
        if (!replacement && pool.length === 0) break;
        const idx = Math.floor(prng.nextFloat() * pool.length);
        sample.push(pool[idx]);
        if (!replacement) pool.splice(idx, 1);
      }
    }
    return sample;
  }
  
  function getTheoreticalMean(pop) {
    if (pop === 'uniform') return 0.5;
    if (pop === 'normal') return 0;
    return mean(pop);
  }
  
  function getTheoreticalSD(pop) {
    if (pop === 'uniform') return Math.sqrt(1/12);
    if (pop === 'normal') return 1;
    return sd(pop);
  }
  
  function computeStat(sample, stat, pop) {
    if (stat === 'mean') return mean(sample);
    if (stat === 'sum') return sample.reduce((a,b)=>a+b, 0);
    if (stat === 'variance') {
      const m = mean(sample);
      return sample.reduce((a,x)=>a+Math.pow(x-m,2), 0) / (sample.length - 1 || 1);
    }
    if (stat === 'chi_square') {
      if (pop === 'uniform' || pop === 'normal') return 0;
      const sSum = pop.reduce((a,b)=>a+Math.abs(b),0);
      const probs = pop.map(x => Math.abs(x)/sSum);
      const obs = new Array(probs.length).fill(0);
      sample.forEach(v => {
        const i = pop.indexOf(v);
        if(i>=0) obs[i]++;
      });
      let c=0;
      probs.forEach((p,i) => {
        const exp = sample.length * p;
        if (exp>0) c += Math.pow(obs[i]-exp, 2)/exp;
      });
      return c;
    }
    return 0;
  }
  
  let eStat = 0, seStat = 1;
  let hlCount = 0;
  
  function updateChart() {
    while(mainSvg.firstChild) mainSvg.removeChild(mainSvg.firstChild);
    
    const w = chartContainer.clientWidth || 800;
    const h = 400;
    const padding = 30;
    const cw = w - padding * 2;
    const ch = h - padding * 2;
    
    const pop = getPopulation();
    const pMean = getTheoreticalMean(pop);
    const pSD = getTheoreticalSD(pop);
    
    // Update Stats Models
    eStat = pMean;
    seStat = pSD / Math.sqrt(sampleSize);
    if (statistic === 'sum') { eStat = pMean * sampleSize; seStat = pSD * Math.sqrt(sampleSize); }
    else if (statistic === 'variance') { eStat = Math.pow(pSD,2); seStat = Math.pow(pSD,2)*Math.sqrt(2/(sampleSize-1)); }
    
    const sMean = sampleStats.length > 0 ? mean(sampleStats) : NaN;
    const sSD = sampleStats.length > 0 ? sampleSD(sampleStats) : NaN;
    
    // Determine Bounds
    let popMin = pMean, popMax = pMean;
    if (populationType === 'normal') {
      popMin = pMean - 4 * pSD; popMax = pMean + 4 * pSD;
    } else if (populationType === 'uniform') {
      popMin = 0; popMax = 1;
    } else if (populationType === 'box' && populationValues.length > 0) {
      popMin = Math.min(...populationValues); popMax = Math.max(...populationValues);
    }
    
    let statMin = eStat - 4 * seStat, statMax = eStat + 4 * seStat;
    let sampMin = Infinity, sampMax = -Infinity;
    if (sampleStats.length > 0) {
      sampMin = Math.min(...sampleStats); sampMax = Math.max(...sampleStats);
    }
    
    let xMin = Math.min(popMin, statMin, sampMin === Infinity ? statMin : sampMin);
    let xMax = Math.max(popMax, statMax, sampMax === -Infinity ? statMax : sampMax);
    
    if (xMin >= xMax) {
      const offset = Math.abs(xMin)*0.1 || 1;
      xMin -= offset; xMax += offset;
    }
    
    // Bin Samples
    let bins = [];
    let binWidth = (xMax - xMin) / numBins;
    if (sampleStats.length > 0) {
      const binner = bin().domain([xMin, xMax]).thresholds(numBins);
      bins = binner(sampleStats);
      if (bins.length > 0) {
        binWidth = bins[0].x1 - bins[0].x0;
        if (binWidth <= 0) binWidth = (xMax - xMin) / numBins;
      }
    }
    
    // Density Max
    let maxDensity = 0;
    let boxWidth = (xMax - xMin) / 100;
    let boxCounts = {};
    if (showPopHist) {
      if (populationType === 'normal') maxDensity = Math.max(maxDensity, normalPDF(pMean, pMean, pSD));
      else if (populationType === 'uniform') maxDensity = Math.max(maxDensity, 1);
      else if (populationType === 'box') {
        populationValues.forEach(v => { boxCounts[v] = (boxCounts[v] || 0) + 1; });
        for (let v in boxCounts) maxDensity = Math.max(maxDensity, (boxCounts[v]/populationValues.length)/boxWidth);
      }
    }
    if (sampleStats.length > 0) {
      bins.forEach(b => maxDensity = Math.max(maxDensity, b.length / (sampleStats.length * binWidth)));
    }
    if (curveType === 'Normal Curve' && seStat > 0) {
      maxDensity = Math.max(maxDensity, normalPDF(eStat, eStat, seStat));
    }
    if (maxDensity === 0 || isNaN(maxDensity)) maxDensity = 1;
    maxDensity *= 1.05;
    
    const xScale = (v) => padding + ((v - xMin) / (xMax - xMin)) * cw;
    const yScale = (d) => padding + ch - (d / maxDensity) * ch;
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Draw Pop
    const popColor = getCSSVar('--widget-primary');
    if (showPopHist) {
      if (populationType === 'box') {
        for (let v in boxCounts) {
          const val = parseFloat(v), prob = boxCounts[v]/populationValues.length, dens = prob/boxWidth;
          const px = xScale(val - boxWidth/2), pw = xScale(val + boxWidth/2) - px, py = yScale(dens), ph = padding + ch - py;
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', px); rect.setAttribute('y', py);
          rect.setAttribute('width', Math.max(1, pw)); rect.setAttribute('height', Math.max(0, ph));
          rect.setAttribute('fill', popColor); rect.setAttribute('stroke', getCSSVar('--widget-border-dark'));
          rect.setAttribute('opacity', '0.4');
          g.appendChild(rect);
        }
      } else if (populationType === 'uniform') {
        for (let i = 0; i < 50; i++) {
          const px = xScale(i/50), pw = xScale((i+1)/50) - px, py = yScale(1), ph = padding + ch - py;
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', px); rect.setAttribute('y', py);
          rect.setAttribute('width', Math.max(1, pw)); rect.setAttribute('height', Math.max(0, ph));
          rect.setAttribute('fill', popColor); rect.setAttribute('stroke', getCSSVar('--widget-border-dark'));
          rect.setAttribute('opacity', '0.4');
          g.appendChild(rect);
        }
      } else if (populationType === 'normal') {
        const nMin = pMean - 4*pSD, nMax = pMean + 4*pSD, bW = (nMax - nMin)/100;
        for (let i = 0; i < 100; i++) {
          const vx = nMin + i*bW, vxNext = nMin + (i+1)*bW, dens = normalPDF((vx+vxNext)/2, pMean, pSD);
          const px = xScale(vx), pw = xScale(vxNext) - px, py = yScale(dens), ph = padding + ch - py;
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', px); rect.setAttribute('y', py);
          rect.setAttribute('width', Math.max(1, pw)); rect.setAttribute('height', Math.max(0, ph));
          rect.setAttribute('fill', popColor); rect.setAttribute('stroke', getCSSVar('--widget-border-dark'));
          rect.setAttribute('opacity', '0.4');
          g.appendChild(rect);
        }
      }
    }
    
    // Draw Samples
    hlCount = 0;
    const highlightColor = getCSSVar('--widget-primary-highlight');
    if (sampleStats.length > 0) {
      bins.forEach(b => {
        const dens = b.length / (sampleStats.length * binWidth);
        const x = xScale(b.x0), bw = Math.max(1, xScale(b.x1) - x), by = yScale(dens), bh = padding + ch - by;
        const mid = (b.x0 + b.x1) / 2;
        const inRange = (lo !== null && hi !== null) && (mid >= lo && mid <= hi);
        if (inRange) hlCount += b.length;
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x); rect.setAttribute('y', by);
        rect.setAttribute('width', bw); rect.setAttribute('height', Math.max(0, bh));
        rect.setAttribute('fill', inRange ? highlightColor : popColor);
        rect.setAttribute('stroke', getCSSVar('--widget-border-dark'));
        g.appendChild(rect);
      });
    }
    
    // Draw Curve
    if (curveType === 'Normal Curve' && seStat > 0) {
      const pts = [];
      for (let i = 0; i <= 100; i++) {
        const vx = xMin + (i / 100) * (xMax - xMin);
        pts.push(`${i === 0 ? 'M' : 'L'} ${xScale(vx)} ${yScale(normalPDF(vx, eStat, seStat))}`);
      }
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', pts.join(' ')); p.setAttribute('fill', 'none');
      p.setAttribute('stroke', getCSSVar('--widget-chart-line')); p.setAttribute('stroke-width', '3');
      g.appendChild(p);
    }
    
    // Axes
    const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axis.setAttribute('x1', padding); axis.setAttribute('y1', padding+ch);
    axis.setAttribute('x2', padding+cw); axis.setAttribute('y2', padding+ch);
    axis.setAttribute('stroke', getCSSVar('--widget-border-dark'));
    g.appendChild(axis);
    
    for (let i = 0; i <= 8; i++) {
      const v = xMin + (i/8)*(xMax - xMin);
      const px = xScale(v);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', px); text.setAttribute('y', padding+ch+20);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', getCSSVar('--widget-text-primary'));
      text.setAttribute('font-size', '12px');
      text.textContent = v.toPrecision(3).replace(/\.0+$/, '');
      g.appendChild(text);
    }
    mainSvg.appendChild(g);
    
    // Update Dashboard Text
    boxStats.innerHTML = `<strong>Population</strong><br>Ave: ${pMean.toFixed(4)}<br>SD: ${pSD.toFixed(4)}`;
    theoStats.innerHTML = `<strong>Theoretical Setup</strong><br>E(${statistic}): ${eStat.toFixed(4)}<br>SE(${statistic}): ${seStat.toFixed(4)}`;
    empStats.innerHTML = `<strong>Empirical Setup</strong><br>Mean(vals): ${isNaN(sMean)?'NaN':sMean.toFixed(4)}<br>SD(vals): ${isNaN(sSD)?'NaN':sSD.toFixed(4)}<br>Samples: ${sampleStats.length}`;
    
    let areaHtml = `<strong>Analysis</strong><br>Selected area: `;
    if (sampleStats.length > 0 && lo !== null && hi !== null) {
      areaHtml += `${((hlCount / sampleStats.length) * 100).toFixed(2)}%<br>`;
    } else {
      areaHtml += `0%<br>`;
    }
    if (lo !== null && hi !== null && seStat > 0) {
      areaHtml += `Normal approx: ${(normalCDFRange(lo, hi, eStat, seStat) * 100).toFixed(2)}%`;
    } else {
      areaHtml += `Normal approx: 0%`;
    }
    areaStats.innerHTML = areaHtml;
  }
  
  function refresh() {
    updateChart();
  }
  
  // Events
  takeSampleBtn.addEventListener('click', () => {
    const prng = new PRNG(seed);
    const pop = getPopulation();
    for (let i=0; i<samplesPerClick; i++) {
      sampleStats.push(computeStat(drawSample(prng, pop, sampleSize, withReplacement), statistic, pop));
    }
    seed++; model.set('seed', seed);
    refresh();
  });
  
  clearBtn.addEventListener('click', () => { sampleStats = []; refresh(); });
  
  statSelect.addEventListener('change', (e) => {
    statistic = e.target.value; model.set('statistic', statistic);
    sampleStats = []; refresh();
  });
  
  popSelect.addEventListener('change', (e) => {
    populationType = e.target.value; model.set('population_type', populationType);
    updateVisibility();
    sampleStats = []; refresh();
  });
  
  boxInput.addEventListener('change', (e) => {
    const vals = e.target.value.split(/[,\s]+/).map(v => parseFloat(v)).filter(v => !isNaN(v));
    if (vals.length > 0) {
      populationValues = vals; model.set('population_values', populationValues);
      sampleStats = []; refresh();
    }
  });
  
  replaceCheck.addEventListener('change', (e) => {
    withReplacement = e.target.checked; model.set('with_replacement', withReplacement);
    sampleStats = []; refresh();
  });
  
  szInput.addEventListener('change', (e) => {
    sampleSize = parseInt(e.target.value)||25; model.set('sample_size', sampleSize);
    sampleStats = []; refresh();
  });
  
  spcInput.addEventListener('change', (e) => {
    samplesPerClick = parseInt(e.target.value)||1; model.set('samples_per_click', samplesPerClick);
  });
  
  binInput.addEventListener('change', (e) => {
    numBins = parseInt(e.target.value)||50; model.set('bins', numBins);
    refresh();
  });
  
  togglePopHistBtn.addEventListener('click', () => {
    showPopHist = !showPopHist;
    togglePopHistBtn.textContent = showPopHist ? 'No Population Histogram' : 'Show Population Histogram';
    refresh();
  });
  
  curveSelect.addEventListener('change', (e) => { curveType = e.target.value; refresh(); });
  
  const updateRange = () => {
    const f = parseFloat(areaFromInput.value), t = parseFloat(areaToInput.value);
    lo = isNaN(f) ? null : f; hi = isNaN(t) ? null : t;
    model.set('lo', lo); model.set('hi', hi);
    refresh();
  };
  areaFromInput.addEventListener('input', updateRange);
  areaToInput.addEventListener('input', updateRange);
  
  const ro = new ResizeObserver(() => {
    if(chartContainer.clientWidth > 0) refresh();
  });
  ro.observe(chartContainer);
  
  requestAnimationFrame(refresh);
  
  return () => { ro.disconnect(); el.innerHTML = ''; };
}
export default { render };
