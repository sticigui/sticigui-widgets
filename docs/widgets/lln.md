---
title: Law of Large Numbers
description: Watch convergence to the expected value as sample size grows
---

```{anywidget} ../../widgets/lln/dist/widget.mjs
{
  "n": 800,
  "p": 0.5,
  "mode": "count",
  "seed": 42
}
```

The Law of Large Numbers says that in repeated, independent trials with the same probability _p_ of success in each trial, the chance that the percentage of successes differs from the probability _p_ by more than a fixed positive amount, _e > 0_, converges to zero as the number of trials n goes to infinity, for every positive _e_. Note two things:

The difference between the number of successes and the number of trials times the chance of success in each trial (the expected number of successes) tends to *grow* as the number of trials increases. (In fact, this difference tends to grow like the square-root of the number of trials.) Although the chance of a large difference between the percentage of successes and the chance of success gets smaller and smaller as n grows, nothing prevents the difference from being large in some sequences of trials. The assumption that this difference always tends to zero, as opposed to this difference having a large probability of being arbitrarily close to zero, is the difference between the Law of Large Numbers , which is a mathematical theorem, and the Empirical Law of Averages , which is an assumption about how the world works that lies at the base of the Frequency Theory of probability.

The distribution of the number of successes in n independent trials with probability _p_ of success in each trial is Binomial , with parameters _n_ and _p_.

The controls on this widget let you change the number of trials, the probability of success in each trial, and toggle between viewing either the difference between the number of successes and the expected number of successes, or the difference between the percentage of successes and the probability of success in each trial.

