/**
 * Dark Mode Detection Utility
 * 
 * Provides utilities for detecting and responding to dark mode in various contexts:
 * - MyST/Tailwind sites (detects 'dark' class on html/parent elements)
 * - Standalone HTML pages (uses system preference via matchMedia)
 */

/**
 * Detect if dark mode is active
 * @param {HTMLElement} el - Element to check (looks for 'dark' class in ancestors)
 * @returns {boolean} - True if dark mode is active
 */
export function isDarkMode(el) {
  // Check if any parent has 'dark' class (MyST/Tailwind approach)
  if (el && el.closest && el.closest('.dark')) {
    return true;
  }
  
  // Check if html element has 'dark' class
  if (document.documentElement.classList.contains('dark')) {
    return true;
  }
  
  // Fall back to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  
  return false;
}

/**
 * Get color based on dark mode state
 * @param {HTMLElement} el - Element to check dark mode state
 * @param {string} lightColor - Color to use in light mode
 * @param {string} darkColor - Color to use in dark mode
 * @returns {string} - Appropriate color for current mode
 */
export function getColor(el, lightColor, darkColor) {
  return isDarkMode(el) ? darkColor : lightColor;
}

/**
 * Color palette for dark mode
 */
export const colors = {
  // Text colors
  text: {
    light: '#000000',
    dark: '#e7e5e4'  // stone-200
  },
  textSecondary: {
    light: '#57534e',  // stone-600
    dark: '#a8a29e'    // stone-400
  },
  
  // Background colors
  background: {
    light: '#ffffff',
    dark: '#1c1917'  // stone-900
  },
  backgroundSecondary: {
    light: '#f5f5f4',  // stone-100
    dark: '#292524'    // stone-800
  },
  
  // Border colors (for UI elements like inputs)
  border: {
    light: '#d6d3d1',  // stone-300 - lighter for input borders
    dark: '#57534e'    // stone-600
  },
  borderSecondary: {
    light: '#a8a29e',  // stone-400
    dark: '#78716c'    // stone-500
  },
  
  // Axis/chart structure colors (darker for better visibility)
  axis: {
    light: '#44403c',  // stone-700 - dark enough to see on white
    dark: '#a8a29e'    // stone-400 - light enough to see on dark
  },
  
  // Accent colors (these work in both modes)
  accent: {
    light: '#ea580c',  // orange-600
    dark: '#fb923c'    // orange-400
  },
  primary: {
    light: '#0284c7',  // sky-600
    dark: '#38bdf8'    // sky-400
  },
  
  // Chart colors
  chart: {
    bar: {
      light: '#0ea5e9',  // sky-500
      dark: '#38bdf8'    // sky-400
    },
    barHighlight: {
      light: '#f97316',  // orange-500
      dark: '#fb923c'    // orange-400
    },
    line: {
      light: '#dc2626',  // red-600
      dark: '#f87171'    // red-400
    }
  }
};

/**
 * Listen for dark mode changes
 * @param {Function} callback - Function to call when dark mode changes
 * @returns {Function} - Cleanup function to remove listeners
 */
export function onDarkModeChange(callback) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // MutationObserver for class changes on html element
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        callback();
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  // MediaQuery listener for system preference changes
  const mediaListener = (e) => callback();
  mediaQuery.addEventListener('change', mediaListener);
  
  // Return cleanup function
  return () => {
    observer.disconnect();
    mediaQuery.removeEventListener('change', mediaListener);
  };
}
