# SticiGui Widget Datasets

This directory contains sample datasets for use with SticiGui widgets.

## Datasets

### cities.json
50 US cities with homeless, unemployment, and vacancy data.

**Fields:**
- `city` - City name and state
- `homeless_rate` - Homeless per 1000 population
- `homeless_count` - Total number of homeless
- `unemployment_rate` - Unemployed per 1000 population  
- `population` - Population in thousands
- `vacancy_rate` - Vacancies per 1000 housing units

**Size:** 50 records

### ccv.json
California Clean Vehicle emissions data from 96 tests.

**Fields:**
- `test` - Test number
- `HC` - Hydrocarbons (ppm)
- `CO` - Carbon monoxide (ppm)
- `NOx` - Nitrogen oxides (ppm)

**Size:** 96 records

### gmat.json
913 MBA students with GPA and GMAT scores.

**Fields:**
- `school` - School identifier (1-3)
- `mgpa` - First year MBA GPA
- `verbal` - Verbal GMAT score
- `quant` - Quantitative GMAT score
- `ugpa` - Undergraduate GPA

**Size:** 913 records

### gravity.json
100 measurements of acceleration due to gravity.

Measured at Piñon Flat Observatory in 1989 (day 229, between 5:29:52pm and 5:48:08pm).
Base g value is 9.792838 meters/s². These values are deviations from that reference value.

**Size:** 100 measurements

Source: https://www.stat.berkeley.edu/~stark/Java/Html/NormApprox.htm  
Measurements by Glen Sasagawa and Mark Zumberge.

## Usage

### In MyST

```yaml
---
myst:
  widgets:
    - name: scatterplot
      data: "https://raw.githubusercontent.com/YOUR_USERNAME/sticigui-widgets/main/public-data/cities.json"
      x: "unemployment_rate"
      y: "homeless_rate"
---
```

### In Jupyter/Python

```python
import requests
import anywidget

# Load data from URL
cities = requests.get("https://raw.githubusercontent.com/YOUR_USERNAME/sticigui-widgets/main/public-data/cities.json").json()

# Or pass inline
widget = ScatterplotWidget(data=cities, x="unemployment_rate", y="homeless_rate")
```

## Data Sources

Data sourced from original SticiGui applet pages:
- https://www.stat.berkeley.edu/~stark/Java/Html/
