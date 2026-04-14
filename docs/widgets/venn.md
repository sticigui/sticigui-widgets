---
title: Venn Diagrams
description: Visualize probability and set operations with two or three events
---

## Two Sets

```{anywidget} ../../widgets/venn/dist/widget.mjs
{
  "sets": 2,
  "pa": 0.6,
  "pb": 0.5,
  "pab": 0.3,
  "highlight": "AB"
}
```

Venn diagrams are a way of visualizing sets. This widget lets you highlight the set A, the set B, the universal set S, the empty set {}, the complement of A (Ac), the complement of B (Bc), the intersection of A and B (AB), the union of A and B (A or B), the intersection of the complement of A with B (AcB), and the intersection of A with the complement of B (ABc).

One can think of the relative area of a set to the area of S as a probability. The picture uses that analogy: the numbers P(A) and P(B) are proportional to the area of A and the area of B, respectively; P(AB) is the area of the intersection of A and B, and P(A or B) is the area of the union of A and B.

You can drag the events A and B around, which changes the probability of their intersection and of their union. When A and B do not overlap, they are said to be disjoint or mutually exclusive. When the probability of the intersection of A and B equals the product of the probability of A and the probability of B (when P(AB) = P(A)×P(B)), A and B are independent. Try to drag A or B to make P(AB) = P(A)×P(B); notice how hard it is to make the overlap just right: independence is a very special relationship between events. The scrollbars let you adjust the probability of A and the probability of B.

## Three Sets

```{anywidget} ../../widgets/venn/dist/widget.mjs
{
  "sets": 3,
  "pa": 0.5,
  "pb": 0.4,
  "pc": 0.3,
  "pab": 0.15,
  "pac": 0.12,
  "pbc": 0.10,
  "pabc": 0.05,
  "highlight": "ABC"
}
```

This diagram extends the two-set case by adding a third event $C$, introducing new regions (AC, BC, ABC) and expanded unions like A ∪ B ∪ C. Independence becomes more restrictive: pairwise independence alone is not enough — full independence also requires

```{math}
P(A \cap B \cap C) = P(A)P(B)P(C)
```

making true independence among three events even harder to achieve geometrically. The diagram also supports conditional probabilities involving multiple events, such as P(A | B), P(A | BC), and P(A | B ∪ C), computed as ratios of highlighted regions.
