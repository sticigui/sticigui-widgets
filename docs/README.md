# MyST Example Site - Interactive Statistics Widgets

This directory contains a complete MyST website demonstrating the interactive statistics widgets.

## Quick Start

### Important Note

⚠️ **The widgets in this MyST example may not be fully interactive** due to MyST's anywidget limitations. For fully working demonstrations, use the test HTML files in the parent directory:

```bash
cd ..
open test-binhist.html
open test-correlation.html
# etc.
```

### Prerequisites

1. **Install MyST CLI** (requires Node.js):
   ```bash
   npm install -g mystmd
   ```

2. **Build the widgets** (from parent directory):
   ```bash
   cd ..
   npm run build
   cd myst-example
   ```

### Running the Site Locally

#### Option A: Basic (Static Display)

```bash
myst start
```

Open the URL shown (usually http://localhost:3000). Widgets will render but may not be fully interactive.

#### Option B: With HTTP-Served Widgets (More Reliable)

1. **Start an HTTP server** from the project root (in one terminal):
   ```bash
   cd ..
   python3 -m http.server 8000
   # Or: npx http-server -p 8000
   ```

2. **Update widget URLs** in `index.md` and `advanced.md` to use `http://localhost:8000/`:
   ```markdown
   \`\`\`{anywidget} http://localhost:8000/widgets/binhist/dist/widget.mjs
   {"n": 20, "p": 0.5}
   \`\`\`
   ```

3. **Start MyST** (in another terminal):
   ```bash
   cd myst-example
   myst start
   ```

### Troubleshooting

If widgets don't respond to interactions, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for:
- CORS and HTTP server setup
- Browser console debugging
- Alternative deployment methods

**Best for demonstrations:** Use the `test-*.html` files in the parent directory.

## What's Included

The example site (`index.md`) demonstrates 6 interactive widgets:

1. **Binomial Histogram** - Visualize binomial distribution P(X = k) for n trials
2. **Distribution Viewer** - Normal distribution with adjustable parameters
3. **Correlation & Regression** - Bivariate data with correlation coefficient r
4. **Venn Diagram (2 sets)** - Set operations and probability relationships
5. **Confidence Intervals** - Repeated sampling simulation
6. **Law of Large Numbers** - Running convergence demonstration

## How It Works

Each widget is embedded using MyST's `anywidget` directive:

```markdown
\`\`\`{anywidget} ../widgets/binhist/dist/widget.mjs
{
  "n": 20,
  "p": 0.5,
  "lo": 5,
  "hi": 15
}
\`\`\`
```

The JSON object sets the initial widget state. Users can interact with the widget to change these values in real-time.

## Building for Production

To build a static site for deployment:

```bash
mystmd build --html
```

This creates a `_build/html/` directory with static HTML/CSS/JS files ready to deploy to any web host (GitHub Pages, Netlify, Vercel, etc.).

## Customization

### Adding More Widgets

To add another widget, simply add a new section to `index.md`:

```markdown
## My New Widget

\`\`\`{anywidget} ../widgets/YOUR-WIDGET/dist/widget.mjs
{
  "param1": "value1",
  "param2": "value2"
}
\`\`\`
```

### Styling

MyST automatically handles styling, including:
- Responsive layout
- Dark mode support (widgets adapt automatically)
- Professional typography
- Mobile-friendly design

### Configuration

Edit `myst.yml` to customize:
- Site title and description
- Navigation structure
- Theme options
- Author information

## File Structure

```
myst-example/
├── myst.yml          # MyST configuration
├── index.md          # Main page content with widgets
├── requirements.txt  # Python dependencies (for mystmd)
└── README.md         # This file
```

## Deployment Options

### GitHub Pages

1. Build the site: `mystmd build --html`
2. Push `_build/html/` to your GitHub Pages repository
3. Configure GitHub Pages to serve from the appropriate branch

### Netlify / Vercel

1. Connect your GitHub repository
2. Set build command: `npm install -g mystmd && mystmd build --html`
3. Set publish directory: `_build/html`
4. Deploy!

### Other Hosts

Upload the contents of `_build/html/` to any static web host.

## Learn More

- [MyST Documentation](https://mystmd.org)
- [anywidget Specification](https://anywidget.dev)
- [Widget Source Code](../widgets/)

## Troubleshooting

### Widgets don't load

- Check that widget paths in `index.md` are correct relative to `myst-example/`
- Ensure widgets have been built: `npm run build` from the parent directory
- Check browser console for errors

### MyST command not found

Install MyST globally: `npm install -g mystmd`

### Port 3000 already in use

Start on a different port: `mystmd start --port 3001`
