---
title: Probability Calculator
description: Compute probabilities and quantiles for common distributions
---

This tool lets you calculate the probability that a random variable X is in a specified range, for a variety of probability distributions for X: the normal distribution , the binomial distribution with parameters n and p , the chi-square distribution , the exponential distribution , the geometric distribution , the hypergeometric distribution , the negative binomial distribution , the Poisson distribution , and Student's t -distribution .

The first choice box lets you select a probability distribution. Depending on the distribution you select, text areas will appear for you to enter the values of the parameters of the distribution. Parameters that are probabilities ( e.g. , the chance of success in each trial for a binomial distribution) can be entered either as decimal numbers between 0 and 1, or as percentages. If you enter a probability as a percentage, be sure to include the percent sign (%) after the number.

The check boxes and corresponding text entry areas let you constrain the range of values for which to find the probability. If a box is not checked, there is no constraint in that direction. For example if the box in front of >= is not checked, the lower limit of the range of values for which the probability is calculated is minus infinity; if the box in front of <= is not checked, the upper limit of the range of values for which the probability is calculated is infinity. When a box is checked, the value in the corresponding text area limits the range of possibilities for which the probability is calculated.

The tool also shows the expected value and standard error of the distribution.

```{anywidget} ../../widgets/prob-calc/dist/widget.mjs
{
  "distribution": "normal",
  "params": {
    "mean": 100,
    "sd": 15
  },
  "use_lo": true,
  "lo": 85,
  "use_hi": true,
  "hi": 115
}
```
