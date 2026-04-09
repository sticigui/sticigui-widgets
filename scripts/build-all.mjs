import * as esbuild from 'esbuild';
import { readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const widgetsDir = join(__dirname, '..', 'widgets');

async function buildWidget(widgetPath, widgetName) {
  const entryPoint = join(widgetPath, 'widget.mjs');
  const distDir = join(widgetPath, 'dist');
  const outfile = join(distDir, 'widget.mjs');

  // Ensure dist directory exists
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }

  console.log(`Building ${widgetName}...`);
  
  try {
    await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      format: 'esm',
      outfile: outfile,
      minify: true,
      target: ['es2020'],
      loader: {
        '.css': 'text'  // Import CSS as text strings
      },
    });
    console.log(`✓ ${widgetName} built successfully`);
    return true;
  } catch (error) {
    console.error(`✗ ${widgetName} build failed:`, error.message);
    return false;
  }
}

async function buildAll() {
  console.log('Building all widgets...\n');
  
  if (!existsSync(widgetsDir)) {
    console.error(`Widgets directory not found: ${widgetsDir}`);
    process.exit(1);
  }

  const widgets = readdirSync(widgetsDir).filter(name => {
    const widgetPath = join(widgetsDir, name);
    const entryPoint = join(widgetPath, 'widget.mjs');
    return statSync(widgetPath).isDirectory() && existsSync(entryPoint);
  });

  if (widgets.length === 0) {
    console.log('No widgets found to build.');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const widgetName of widgets) {
    const widgetPath = join(widgetsDir, widgetName);
    const success = await buildWidget(widgetPath, widgetName);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\nBuild complete: ${successCount} succeeded, ${failCount} failed`);
  
  if (failCount > 0) {
    process.exit(1);
  }
}

// Check for watch mode
const watchMode = process.argv.includes('--watch');

if (watchMode) {
  console.log('Watch mode not yet implemented. Building once...\n');
}

buildAll().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
