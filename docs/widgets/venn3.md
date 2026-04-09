---
title: Venn Diagram (Three Sets)
description: Visualize complex probability relationships with three events
---

```{anywidget} ../../widgets/venn3/dist/widget.mjs
{
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

Venn diagrams are a way of visualizing sets. This widget lets you highlight the set A, the set B, the set C, the universal set S, the empty set {}, the complement of A (Ac), the complement of B (Bc), the complement of C (Cc), the intersection of A and B (AB), the union of A and B (A or B), the intersection of the complement of A with B (AcB), the intersection of A with the complement of B (ABc), the intersection of A, B, and C (ABC), the union of A, B, and C (A or B or C), the intersection of Ac and B and C (AcBC), and the union of the complement of A and the intersection of B and C (Ac or BC). One can think of the relative area of a set to the area of S as a probability. The picture uses that analogy: the numbers P(A), P(B), and P(C) are proportional to the area of A, the area of B, and the area of C, respectively; P(AB) is the area of the intersection of A and B, and P(A or B) is the area of the union of A and B, etc.

You can drag the events A, B, and C around, which changes the probability of their intersection and of their union. When A and B do not overlap, they are said to be disjoint or mutually exclusive . When the probability of the intersection of A and B equals the product of the probability of A and the probability of B (when P(AB) = P(A)×P(B)), A and B are independent . Try to drag A or B to make P(AB) = P(A)×P(B); notice how hard it is to make the overlap just right: independence is a very special relationship between events. For the collection of all three events, {A, B, C}, to be independent, one needs P(AB) = P(A)×P(B), P(AC)=P(A)×P(C), P(BC) = P(B)×P(C), and P(ABC)=P(A)×P(B)×P(C). This is quite hard to arrange. The scrollbars let you adjust the probability of A, the probability of B, and the probability of C.

The conditional probability of A given B, P(A|B), is defined to be P(AB)/P(B), provided P(B) is not zero. This widget displays six conditional probabilities: P(A|B), P(Ac|B), P(B|A), P(A|BC), P(Ac|BC), and P(A|(B or C)). When the corresponding checkbox is ticked, the events whose probabilities are involved in computing the conditional probability are highlighted in contrasting colors.
