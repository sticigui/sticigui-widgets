---
title: Venn Diagram (Two Sets)
description: Visualize probability and set operations with two events
---

```{anywidget} ../../widgets/venn2/dist/widget.mjs
{
  "pa": 0.6,
  "pb": 0.5,
  "pab": 0.3,
  "highlight": "AB"
}
```

Venn diagrams are a way of visualizing sets. This widget lets you highlight the set A, the set B, the universal set S, the empty set {}, the complement of A (Ac), the complement of B (Bc), the intersection of A and B (AB), the union of A and B (A or B), the intersection of the complement of A with B (AcB), and the intersection of A with the complement of B (ABc).

One can think of the relative area of a set to the area of S as a probability. The picture uses that analogy: the numbers P(A) and P(B) are proportional to the area of A and the area of B, respectively; P(AB) is the area of the intersection of A and B, and P(A or B) is the area of the union of A and B.

You can drag the events A and B around, which changes the probability of their intersection and of their union. When A and B do not overlap, they are said to be disjoint or mutually exclusive . When the probability of the intersection of A and B equals the product of the probability of A and the probability of B (when P(AB) = P(A)×P(B)), A and B are independent . Try to drag A or B to make P(AB) = P(A)×P(B); notice how hard it is to make the overlap just right: independence is a very special relationship between events. The scrollbars let you adjust the probability of A and the probability of B.
