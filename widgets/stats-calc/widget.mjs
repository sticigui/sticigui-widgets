/**
 * Statistics Calculator Widget
 * 
 * A scientific calculator with statistical functions.
 * Operations: +, -, ×, ÷, =, nCk, nPk, x², √x, 1/x, log, ln, e^x, sin, cos, tan, π, U[0,1]
 */

import styles from './styles.css';

// Inject styles into document
function injectStyles() {
  if (!document.getElementById('stats-calc-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'stats-calc-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
}

// Helper to get CSS variable value
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Calculate nCk (combinations)
 */
function combinations(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  // Use the smaller of k and n-k for efficiency
  k = Math.min(k, n - k);
  
  let result = 1;
  for (let i = 0; i < k; i++) {
    result *= (n - i);
    result /= (i + 1);
  }
  return result;
}

/**
 * Calculate nPk (permutations)
 */
function permutations(n, k) {
  if (k < 0 || k > n) return 0;
  
  let result = 1;
  for (let i = 0; i < k; i++) {
    result *= (n - i);
  }
  return result;
}

/**
 * Main render function
 */
export function render({ model, el }) {
  // Inject CSS
  injectStyles();

  // Calculator state
  let title = model.get('title');
  let display = model.get('display') || '0';
  let currentOperand = 0;
  let operator = null;
  let waitingForOperand = false;
  let memory = model.get('memory') || null;

  // Create container
  const container = document.createElement('div');
  container.className = 'widget-container';
  container.style.maxWidth = '400px';

  // Title (optional)
  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.className = 'widget-title';
    titleEl.textContent = title;
    container.appendChild(titleEl);
  }

  // Display
  const displayEl = document.createElement('div');
  displayEl.className = 'widget-display';
  displayEl.style.padding = '1rem';
  displayEl.style.background = getCSSVar('--widget-bg-secondary');
  displayEl.style.border = `1px solid ${getCSSVar('--widget-border-light')}`;
  displayEl.style.borderRadius = '4px';
  displayEl.style.fontSize = '2rem';
  displayEl.style.textAlign = 'right';
  displayEl.style.fontFamily = 'monospace';
  displayEl.style.minHeight = '3rem';
  displayEl.style.display = 'flex';
  displayEl.style.alignItems = 'center';
  displayEl.style.justifyContent = 'flex-end';
  displayEl.style.wordBreak = 'break-all';
  displayEl.textContent = display;
  displayEl.setAttribute('data-testid', 'display');
  container.appendChild(displayEl);

  // Update display
  function updateDisplay() {
    displayEl.textContent = display;
  }

  // Handle digit input
  function inputDigit(digit) {
    if (waitingForOperand) {
      display = String(digit);
      waitingForOperand = false;
    } else {
      display = display === '0' ? String(digit) : display + digit;
    }
    updateDisplay();
  }

  // Handle decimal point
  function inputDecimal() {
    if (waitingForOperand) {
      display = '0.';
      waitingForOperand = false;
    } else if (display.indexOf('.') === -1) {
      display += '.';
    }
    updateDisplay();
  }

  // Handle clear
  function clear() {
    display = '0';
    currentOperand = 0;
    operator = null;
    waitingForOperand = false;
    updateDisplay();
  }

  // Handle unary operations
  function handleUnaryOp(op) {
    const value = parseFloat(display);
    let result;

    switch (op) {
      case 'square':
        result = value * value;
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'inverse':
        result = 1 / value;
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'exp':
        result = Math.exp(value);
        break;
      case 'sin':
        result = Math.sin(value);
        break;
      case 'cos':
        result = Math.cos(value);
        break;
      case 'tan':
        result = Math.tan(value);
        break;
      case 'negate':
        result = -value;
        break;
      default:
        return;
    }

    display = String(result);
    waitingForOperand = true;
    updateDisplay();
  }

  // Handle binary operations
  function handleBinaryOp(nextOperator) {
    const inputValue = parseFloat(display);

    if (operator && waitingForOperand) {
      operator = nextOperator;
      return;
    }

    if (currentOperand === 0) {
      currentOperand = inputValue;
    } else if (operator) {
      const result = performCalculation(currentOperand, inputValue, operator);
      display = String(result);
      currentOperand = result;
      updateDisplay();
    }

    waitingForOperand = true;
    operator = nextOperator;
  }

  // Perform calculation
  function performCalculation(left, right, op) {
    switch (op) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      case 'nCk':
        return combinations(Math.round(left), Math.round(right));
      case 'nPk':
        return permutations(Math.round(left), Math.round(right));
      default:
        return right;
    }
  }

  // Handle equals
  function handleEquals() {
    const inputValue = parseFloat(display);

    if (operator) {
      const result = performCalculation(currentOperand, inputValue, operator);
      display = String(result);
      currentOperand = 0;
      operator = null;
      waitingForOperand = true;
      updateDisplay();
    }
  }

  // Handle constants
  function handleConstant(constant) {
    switch (constant) {
      case 'pi':
        display = String(Math.PI);
        break;
      case 'random':
        display = String(Math.random());
        break;
    }
    waitingForOperand = true;
    updateDisplay();
  }

  // Button grid
  const buttonGrid = document.createElement('div');
  buttonGrid.style.display = 'grid';
  buttonGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  buttonGrid.style.gap = '0.5rem';

  const buttons = [
    { label: '7', action: () => inputDigit(7) },
    { label: '8', action: () => inputDigit(8) },
    { label: '9', action: () => inputDigit(9) },
    { label: '÷', action: () => handleBinaryOp('/'), class: 'operator' },
    
    { label: '4', action: () => inputDigit(4) },
    { label: '5', action: () => inputDigit(5) },
    { label: '6', action: () => inputDigit(6) },
    { label: '×', action: () => handleBinaryOp('*'), class: 'operator' },
    
    { label: '1', action: () => inputDigit(1) },
    { label: '2', action: () => inputDigit(2) },
    { label: '3', action: () => inputDigit(3) },
    { label: '−', action: () => handleBinaryOp('-'), class: 'operator' },
    
    { label: '0', action: () => inputDigit(0) },
    { label: '.', action: () => inputDecimal() },
    { label: '=', action: () => handleEquals(), class: 'equals' },
    { label: '+', action: () => handleBinaryOp('+'), class: 'operator' },
  ];

  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.label;
    button.style.padding = '1rem';
    button.style.fontSize = '1.25rem';
    button.style.border = `1px solid ${getCSSVar('--widget-border-light')}`;
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.background = getCSSVar('--widget-bg-primary');
    button.style.color = getCSSVar('--widget-text-primary');
    
    if (btn.class === 'operator') {
      button.style.background = getCSSVar('--widget-primary');
      button.style.color = 'white';
    } else if (btn.class === 'equals') {
      button.style.background = getCSSVar('--widget-accent');
      button.style.color = 'white';
    }
    
    button.addEventListener('click', btn.action);
    button.setAttribute('aria-label', btn.label);
    buttonGrid.appendChild(button);
  });

  container.appendChild(buttonGrid);

  // Scientific functions row
  const sciRow1 = document.createElement('div');
  sciRow1.style.display = 'grid';
  sciRow1.style.gridTemplateColumns = 'repeat(4, 1fr)';
  sciRow1.style.gap = '0.5rem';
  sciRow1.style.marginTop = '0.5rem';

  const sciButtons1 = [
    { label: 'x²', action: () => handleUnaryOp('square') },
    { label: '√x', action: () => handleUnaryOp('sqrt') },
    { label: '1/x', action: () => handleUnaryOp('inverse') },
    { label: 'C', action: () => clear(), class: 'clear' },
  ];

  sciButtons1.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.label;
    button.style.padding = '0.75rem';
    button.style.fontSize = '1rem';
    button.style.border = `1px solid ${getCSSVar('--widget-border-light')}`;
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.background = getCSSVar('--widget-bg-secondary');
    button.style.color = getCSSVar('--widget-text-primary');
    
    if (btn.class === 'clear') {
      button.style.background = getCSSVar('--widget-chart-line');
      button.style.color = 'white';
    }
    
    button.addEventListener('click', btn.action);
    button.setAttribute('aria-label', btn.label);
    sciRow1.appendChild(button);
  });

  container.appendChild(sciRow1);

  // Scientific functions row 2
  const sciRow2 = document.createElement('div');
  sciRow2.style.display = 'grid';
  sciRow2.style.gridTemplateColumns = 'repeat(4, 1fr)';
  sciRow2.style.gap = '0.5rem';
  sciRow2.style.marginTop = '0.5rem';

  const sciButtons2 = [
    { label: 'log', action: () => handleUnaryOp('log') },
    { label: 'ln', action: () => handleUnaryOp('ln') },
    { label: 'eˣ', action: () => handleUnaryOp('exp') },
    { label: '±', action: () => handleUnaryOp('negate') },
  ];

  sciButtons2.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.label;
    button.style.padding = '0.75rem';
    button.style.fontSize = '1rem';
    button.style.border = `1px solid ${getCSSVar('--widget-border-light')}`;
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.background = getCSSVar('--widget-bg-secondary');
    button.style.color = getCSSVar('--widget-text-primary');
    
    button.addEventListener('click', btn.action);
    button.setAttribute('aria-label', btn.label);
    sciRow2.appendChild(button);
  });

  container.appendChild(sciRow2);

  // Trig functions row
  const trigRow = document.createElement('div');
  trigRow.style.display = 'grid';
  trigRow.style.gridTemplateColumns = 'repeat(4, 1fr)';
  trigRow.style.gap = '0.5rem';
  trigRow.style.marginTop = '0.5rem';

  const trigButtons = [
    { label: 'sin', action: () => handleUnaryOp('sin') },
    { label: 'cos', action: () => handleUnaryOp('cos') },
    { label: 'tan', action: () => handleUnaryOp('tan') },
    { label: 'π', action: () => handleConstant('pi') },
  ];

  trigButtons.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.label;
    button.style.padding = '0.75rem';
    button.style.fontSize = '1rem';
    button.style.border = `1px solid ${getCSSVar('--widget-border-light')}`;
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.background = getCSSVar('--widget-bg-secondary');
    button.style.color = getCSSVar('--widget-text-primary');
    
    button.addEventListener('click', btn.action);
    button.setAttribute('aria-label', btn.label);
    trigRow.appendChild(button);
  });

  container.appendChild(trigRow);

  // Statistical functions row
  const statRow = document.createElement('div');
  statRow.style.display = 'grid';
  statRow.style.gridTemplateColumns = 'repeat(3, 1fr)';
  statRow.style.gap = '0.5rem';
  statRow.style.marginTop = '0.5rem';

  const statButtons = [
    { label: 'nCk', action: () => handleBinaryOp('nCk') },
    { label: 'nPk', action: () => handleBinaryOp('nPk') },
    { label: 'U[0,1]', action: () => handleConstant('random') },
  ];

  statButtons.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.label;
    button.style.padding = '0.75rem';
    button.style.fontSize = '1rem';
    button.style.border = `1px solid ${getCSSVar('--widget-border-light')}`;
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.background = getCSSVar('--widget-bg-secondary');
    button.style.color = getCSSVar('--widget-text-primary');
    
    button.addEventListener('click', btn.action);
    button.setAttribute('aria-label', btn.label);
    statRow.appendChild(button);
  });

  container.appendChild(statRow);

  // Append container to element
  el.appendChild(container);

  // No cleanup needed
  return () => {};
}

export default { render };
