/**
 * Data fetching utilities for anywidget widgets
 * 
 * Supports loading data from:
 * - URLs (JSON or CSV)
 * - Inline arrays (pass-through from Python/Jupyter)
 */

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - CSV text content
 * @returns {Array<Object>} Array of objects with column headers as keys
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      const value = values[index];
      // Try to parse as number, otherwise keep as string
      row[header] = isNaN(value) || value === '' ? value : parseFloat(value);
    });
    rows.push(row);
  }
  
  return rows;
}

/**
 * Fetch and parse data from a URL
 * @param {string} url - URL to fetch data from
 * @returns {Promise<Array>} Array of data objects
 */
async function fetchFromURL(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
  }
  
  const contentType = response.headers.get('content-type') || '';
  const urlLower = url.toLowerCase();
  
  // Determine format from content-type or URL extension
  if (contentType.includes('application/json') || urlLower.endsWith('.json')) {
    return await response.json();
  } else if (contentType.includes('text/csv') || urlLower.endsWith('.csv')) {
    const csvText = await response.text();
    return parseCSV(csvText);
  } else {
    // Default to JSON
    return await response.json();
  }
}

/**
 * Load data from various sources
 * 
 * Supports:
 * - Array: single dataset (from Python/Jupyter) → {default: data}
 * - String: single dataset URL → {default: data}
 * - Object: multiple named datasets → {name1: data1, name2: data2, ...}
 * 
 * @param {Array|string|Object} dataSpec - Data specification
 * @returns {Promise<Object>} Object with dataset names as keys
 * 
 * @example
 * // From Python/Jupyter (already loaded) - returns {default: [...]}
 * const datasets = await fetchData([{x: 1, y: 2}, {x: 3, y: 4}]);
 * 
 * // From URL (MyST) - returns {default: [...]}
 * const datasets = await fetchData('https://example.com/data.json');
 * 
 * // Multiple datasets (MyST) - returns {cities: [...], gmat: [...]}
 * const datasets = await fetchData({
 *   cities: 'https://example.com/cities.json',
 *   gmat: 'https://example.com/gmat.json'
 * });
 */
export async function fetchData(dataSpec) {
  // If it's already an array, return it as default dataset (from Python/Jupyter)
  if (Array.isArray(dataSpec)) {
    return { default: dataSpec };
  }
  
  // If it's a string, treat it as a URL and return as default dataset
  if (typeof dataSpec === 'string') {
    const data = await fetchFromURL(dataSpec);
    return { default: data };
  }
  
  // If it's an object, load each dataset
  if (typeof dataSpec === 'object' && dataSpec !== null) {
    const datasets = {};
    for (const [name, source] of Object.entries(dataSpec)) {
      if (typeof source === 'string') {
        datasets[name] = await fetchFromURL(source);
      } else if (Array.isArray(source)) {
        datasets[name] = source;
      } else {
        throw new Error(
          `Invalid data source for "${name}". Expected array or URL string, got: ${typeof source}`
        );
      }
    }
    return datasets;
  }
  
  // Invalid data specification
  throw new Error(
    `Invalid data specification. Expected array, URL string, or object with named datasets, got: ${typeof dataSpec}`
  );
}
