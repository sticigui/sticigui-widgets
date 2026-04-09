---
title: Normal Approximation
description: Compare a real dataset histogram to a normal curve
---

Many (but probably not most) histograms of data can be approximated by a Normal Curve if the data values are converted to Standard Units , in the sense that the area under the histogram over various regions is about the same as the area of the normal curve over the same regions. The following widget shows the histogram of 100 measurements of the acceleration of gravity at Pion Flat Observatory .

The scroll bars let you select different regions of the histogram; the area under the histogram and under the corresponding part of the normal curve are shown at the bottom of the widget.

The following is a table of 100 observations of g , the acceleration due to gravity, made at Pion Flat Observatory in 1989 (day 229, between 5:29:52pm and 5:48:08pm). The base g value is 9.792838 meters/s**2. The table lists the deviations of the measurements from that reference value. The experimental apparatus is pretty slick: it uses a laser and an accurate time reference to determine the distance a mirrored corner of a cube falls in a vacuum chamber as a function of time. These measurements were made by Glen Sasagawa and Mark Zumberge.

Why take so many measurements?

```{anywidget} ../../widgets/norm-approx/dist/widget.mjs
{
  "data": "../../public-data/gravity.json",
  "lo": -2,
  "hi": 2
}
```
