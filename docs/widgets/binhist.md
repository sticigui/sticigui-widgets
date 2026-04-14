---
title: Binomial Histogram
description: Interactive visualization of the binomial distribution
---

```{anywidget} ../../widgets/binhist/dist/widget.mjs
{
  "n": 5,
  "p": 0.5,
  "lo": 5,
  "hi": 15,
  "curve_points": 200,
  "show_normal": false
}
```

The number of "successes" in n independent trials that each have the same probability p of success has the binomial distribution with parameters n and p .

For example, the number of heads in 10 tosses of a fair coin has a binomial distribution with parameters n =10 and p =50%.

The expected value of the binomial distribution is n×p (that's where the probability histogram would balance), and the standard error of the binomial distribution is ( n × p ×(1- p )) ½ .

Note that for a fixed value of n , the distribution is broadest (has the largest SE) when p = 50%.

You can use the scrollbars to select different parts of the histogram; the area of the selected region is printed in the middle.

The normal approximation to the binomial probability histogram is good when n is large and p is neither close to 0 nor close to 100%.

## Explanation of Controls

The "Show Normal Curve" button superposes the normal approximation to the binomial over the binomial histogram.

The "Area from" and "to" scrollbars and text boxes allow you to select a range of possible "successes," for which the widget will calculate the probability, displayed after "Selected area."

The text boxes on the bottom row let you change the number of trials n and the probability p of success in each trial. To change the value, delete the value in the box, type in the new value, then strike the "enter" or "return" key or click the mouse anywhere outside the box.
