---
title: Scatterplot
description: Visualize and analyze bivariate data with regression tools
---

```{anywidget} ../../widgets/scatterplot/dist/widget.mjs
{
  "data": {
    "cities": "../../public-data/cities.json",
    "ccv": "../../public-data/ccv.json",
    "gmat": "../../public-data/gmat.json"
  },
  "x_var": "unemployment_rate",
  "y_var": "homeless_rate",
  "show_regression": true,
  "show_residuals": false,
  "show_graph_of_averages": false,
  "include_added_points": true
}
```

This widget lets you study the relationship between pairs of variables using scatterplots , the correlation coefficient , the graph of averages , linear regression , and residual plots .

You can select one of four data sets using the drop-down menu, or type in the URL of a different dataset . The four data sets are

The next two choice boxes let you select which variable in the selected data set to plot on the X axis, and which to plot on the Y axis. Again, on monochrome monitors on unix systems, the box itself might not be visible: click on the name of the variable to see the other choices.

The buttons should be self-explanatory. They let you plot 1 SD from the point of averages , which is plotted in red; plot the SD Line , the graph of averages (yellow squares), and the regression line , pop up a window containing the currently plotted dataset, pop up a window containing summary statistics for each variable, and toggle from a scatterplot of the data to a residual plot , use or ignore points you have added by clicking on the graph, and clear points you added previously by clicking on the graph. (The univariate summary statistics are always for the original data; they do not include any points you have added.) You can find the X and Y values for any point by positioning the mouse cursor over it: the coordinates of the cursor are given in the lower right corner of the widget. If you select some rows of data in the dataset window and strike "return," the corresponding points in the scatterplot will be plotted in yellow, rather than blue.
