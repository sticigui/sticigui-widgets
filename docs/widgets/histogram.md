---
title: Histogram
description: Create histograms from data with adjustable bin width and filtering
---

## Simple Histogram

You can change the inputs to highlight different parts of the histogram; the area highlighted is given below the chart. You can also view the raw data and basic univariate statistics.

```{anywidget} ../../widgets/histogram/dist/widget.mjs
{
  "advanced": false,
  "data": {
    "cities": "../../public-data/cities.json",
    "ccv": "../../public-data/ccv.json",
    "gmat": "../../public-data/gmat.json"
  },
  "bins": 10,
  "show_normal": false
}
```

## Advanced Histogram (Controlling for Variables)

This advanced mode lets you take "slices" through a multivariate data set. You can compare the overall distribution of a variable (in blue) against the distribution of that same variable when restricted by conditions on other variables (in green).

The blue histogram shows the distribution of the selected variable for the entire data set. The green histogram shows the distribution of the selected variable for only those members of the population whose measurement on other variables are in the ranges specified in the restrictions section.

You can select one of three built-in data sets: CCV (emissions of EPA test vehicles), Cities (homeless rates and related variables), and GMAT (GMAT scores and GPAs). From each data set you can choose a histogram of one of several variables, and superimpose the restricted histogram.

```{anywidget} ../../widgets/histogram/dist/widget.mjs
{
  "advanced": true,
  "data": {
    "cities": "../../public-data/cities.json",
    "ccv": "../../public-data/ccv.json",
    "gmat": "../../public-data/gmat.json"
  },
  "variable": "homeless_rate",
  "bins": 20,
  "restrictions": [
    {"variable": "unemployment_rate", "use_min": true, "min": 5, "use_max": false, "max": 15}
  ],
  "show_normal": true,
  "show_full": true,
  "show_restricted": true
}
```
