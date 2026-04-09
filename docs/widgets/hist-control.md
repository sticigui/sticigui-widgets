---
title: Histogram Control
description: Advanced histogram with data filtering and restrictions
---

This widget lets you take "slices" through a multivariate data set to compare the distribution of a variable without regard for the values of the other variables with the distribution of that variable when the value of one or more of the other variables is restricted to some range; that is, the distribution for just those individuals in the data set for which the other variables are all in the specified ranges.

The blue histogram (yellow when highlighted) shows the distribution of the selected variable for the entire data set. The green histogram (magenta when highlighted) shows the distribution of the selected variable for only those members of the population whose measurement on other variables are in the ranges specified near the bottom of the widget. The means and SDs of the overall and restricted values, as well as the overall number of individuals and the number in the restricted group, are given at the bottom. Using the scrollbars or text entry areas, you can select a range of values and see how the area of the histograms the selected range differs between the restricted and unrestricted groups; you can also see the normal curves (blue for the blue histogram; green for the green histogram) and the area under the normal curve corresponding to the selected region of the histograms.

The bins are plotted in such a way that if both the unrestricted and restricted histograms have a positive height in a given class interval, the shorter one is "in front," so that you see the taller one sticking up beyond it. If the two have exactly the same height in a given bin, the restricted one (green or magenta, depending on whether or not it is highlighted) plots in front, so only it is visible.

You can select one of three data sets, CCV (emissions of EPA test vehicles in 96 tests) , Cities (homeless rates and several other variables possibly related to homelessness for 50 cities) , and GMAT (GMAT scores, undergraduate GPAs and first-year MBA GPAs for 913 students) . From each data set you can choose a histogram of one of several variables, and you can superpose the histogram of that variable for just those cases where it and other variables are in specified ranges. It is interesting to compare such slices with scatterplots of these variables.

The choice boxes above the histogram allow you to choose which data set to look at, and which variable in that data set to plot a histogram of. The check boxes above the histogram control whether the histogram of the original, unrestricted data is plotted (blue in the unhighlighted regions and yellow where highlighted), and/or the histogram of the data that remain after the restrictions are applied (green in the unhighlighted regions and magenta where highlighted).

The three text boxes and scroll bars just under the histogram control the lower endpoint of the range to highlight, the upper endpoint of the range to highlight, and the number of bins in the histogram, respectively. You can either use the scrollbars to change the values, or type a new value into the box, followed by the "return" or "enter" key.

In the next row of controls, the button controls whether or not normal curves are superposed on the histograms; if so, the areas under the normal curves for the highlighted parts of the histograms are displayed. The highlighted areas of the histograms themselves are always displayed.

The next row of controls allows you to select other variables in the current dataset to apply restrictions to, and show the histogram of the value of the variable selected on the previous line, but for only those individuals whose measurements of the variables restricted on this line fall in the specified ranges. The first check box specifies whether or not you want to restrict the variable selected on this line to be larger than some threshold; the threshold is displayed in the text area just to the right of ">=". You can change the threshold by typing in a new value, then striking the "enter" or "return" key. The next check box specifies whether or not you want to constrain the variable selected on this line to be less than the threshold value displayed in the text area just to the right of "<=." Again, you can change the threshold value by typing over it and striking "return" or "enter." The histogram of the remaining values of the variable selected on the previous line, after the restrictions are applies, is shown in green (magenta where highlighted). Note that any restrictions you apply persist when you select a different variable on this line; you have to clear them individually, or all at once using the "clear restrictions" button, which unchecks all the check boxes for all the variables, and resets the threshold values to the minimum and maximum values of each variable.

The button on the bottom line pops up a new window that lists the current dataset. The rest of the bottom line shows the number of original observations of the variable plotted, the mean and sd of those values, the number of observations that remain after the restrictions are applied, and the mean and sd of those observations.

```{anywidget} ../../widgets/hist-control/dist/widget.mjs
{
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
