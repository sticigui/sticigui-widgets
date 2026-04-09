---
title: Sampling Distribution
description: Visualize the Central Limit Theorem through repeated sampling
---

```{anywidget} ../../widgets/sampling-dist/dist/widget.mjs
{
  "population": "uniform",
  "sample_size": 30,
  "num_samples": 100,
  "show_normal_overlay": true,
  "seed": 456
}
```

This widget illustrates the concept of the sampling distribution of a statistic by simulating the sampling distribution of four common statistics: the sample sum , the sample mean , S{sup}`2`, the sample variance, and the Chi-Squared statistic .

Each time you press the "take sample" button, a (pseudo-) random sample is drawn from a population of numbers, and the statistic is computed from the sample. A histogram displays the history of values of the statistic as you take more and more samples; also, the display shows the mean and SD of the sample values of the statistic. With the sample mean, sample sum, and sample S{sup}`2`, there are three choices for the population of numbers from which to draw each sample: from the list of numbers in the box on the right, from a uniform distribution, and from a normal distribution. With the sample chi-square statistic, the box contains the category probabilities for the population: each number in the box stands for a category of outcome; the value of the number is interpreted to be the probability of that outcome. (The numbers are automatically renormalized to sum to unity when the chi-square statistic is selected.)

The sample sum is the sum of a random sample from a population. The sample mean is the usual average of a random sample from a population: it is the sample sum, divided by the number of numbers in the sample (the sample size ). S{sup}`2` is the sum of the squares of the deviations of a random sample from its sample mean, divided by (sample size - 1).

Suppose we have a random sample of size n ; denote the data by

$$
{X 1 , X 2 , ... , X n }.
$$

Then the sample sum is

$$
X 1 + X 2 + ... + X n ,
$$

the sample mean is

$$
M = (X 1 + X 2 + ... + X n )/ n ,
$$

and S{sup}`2` is

$$
S2 = ( (X1 - M)2 + (X2 - M)2 + ... + (Xn - M)2 )/(n - 1). 
$$

The sample mean is a statistic commonly used to estimate the mean of a population. It is an unbiased estimator of the population mean. The square-root of S 2 is a statistic commonly used to estimate the standard deviation of a population. S 2 is an unbiased estimator of the square of the population standard deviation ; in general, (S 2 ) ½ is a biased estimator of the population standard deviation.

The blue histogram shows the distribution of the numbers in the box on the right, which initially contains the five numbers 0, 1, 2, 3, and 4. When you press the "Take Sample" button, the computer draws a pseudo-random sample with replacement from the population, computes the sum or mean of the sample, and plots the histogram of the result in green. As you take more samples, the green histogram will evolve, showing the distribution of the results. The value of the sample sum or sample mean is random, because it depends on the random sample. It is not the same every time a sample is drawn. The default sample size is 1. Because the average of one number is just that number, if you sample repeatedly, you will reproduce the histogram of the population. This is not terribly interesting.

What is more interesting is what happens when you increase the sample size . You can change the sample size (the number of numbers in each sample) by typing a different number into the box labeled "Sample Size," then striking the "enter" or "return" key. If you increase the sample size, the variability of the sample mean will be smaller, and the shape of the green histogram will look more nearly normal (as you sample repeatedly). You can speed things up by taking more than one sample at a time; this is controlled by the "Take _____ samples" box. Another box controls the number of bins in the histograms. You will probably get the clearest impression of the phenomena we are trying to see by using the maximum number of bins.

To Notice:

 - The average of the sample means gets close to the population mean as you take more and more samples. This illustrates that the sample mean is an unbiased estimator of the population mean.
 - The variability (as measured by the standard error or SE) of the sample mean is smaller for larger sample sizes. It shrinks like the square-root of the sample size. This is an illustration of the Square-root Law.
 - If the sample size is large, the histogram of the sample mean and sample sum approach the normal curve as you take more samples, even though the histogram of the population isn't even vaguely shaped like a normal curve. (Click the "Show Normal Curve" button to superpose the corresponding normal curve.) This is an illustration of the Central Limit Theorem. 

## More Detail

The sample mean of a random sample from a population is an estimator of the mean of the population. The sample mean is a random variable, because its value depends on what the particular random sample happens to be. The expected value of the sample sum is the sample size times the population mean (the average of the numbers in the box). The standard error (SE) of the sample sum is the square-root of the sample size, times the standard deviation (SD) of the numbers in the box. The expected value of the sample mean is the population mean, and the SE of the sample mean is the SD of the population, divided by the square-root of the sample size.

This widget lets you type a population of numbers into a box, then look at how the histogram of sample values of the sample mean evolves as you take more and more samples. There are controls for the sample size and the number of samples to take each time the "Take Sample" button is pushed, as well as a control for the number of bins in the histogram. 

If the sample size is sufficiently large, the histogram of the sampling distribution of the sample sum and sample mean, converted to standard units, follow the normal curve approximately. A button in the widget lets you superpose the theoretical normal curve with the histogram of observed values of the sample sum or mean. Two controls ("Highlight from" and "to") let you highlight part of the histogram, and compare the area of that part of the histogram with the area of the same part of the normal curve. For large sample size, the areas should become close as you take more and more samples of that fixed large size.

To replace the contents of the box, delete the numbers in the box, type in the numbers you want, then click anywhere outside the box. You should then see a blue histogram of the population of numbers you typed into the box.

Press the "Take Sample" button a few times, using the default sample size of one. You will see a histogram of sample values emerge in green. As you take more and more samples, the green histogram should get closer and closer to the blue one: the sample mean of a random sample of size one has the same distribution as the population. Increase the number of samples to take to 100 by typing into the corresponding box ("Take ____ samples") and striking the "enter" or "return" key. Press the "Take Sample" button a few times. The green and blue histograms should match pretty well---the observed sampling of samples of size one converges to the distribution of values of the population.

Now change the "Take ____ samples" control back to one, and change the "Sample Size" to 50. This will clear the green histogram. Every time you press the "Take Sample" button now, you are computing the sample mean of a random sample of size 50 from the population of numbers you put into the box. The green histogram that evolves as you take more and more samples will be concentrated nearer the population mean than the blue histogram is. The values of the sample mean are more finely divided than the values in the population, as well. Change the "Samples to Take" to 100, and press the "Take Sample" button a few more times. As you take more and more samples, the mean of the green histogram that emerges will tend to be closer and closer to the mean of the population. The spread of the histogram, measured by its SE, will be about the SD of the population, divided by the square-root of 50 (about 7). Press the "Show Normal Curve" button. The green histogram should follow the normal curve pretty well. You can compare areas under the histogram with the corresponding areas under the normal curve with the "Highlight from" and "to" controls.

Now set the sample size up to 200, the maximum, and set the "Samples to Take" to 1. The green histogram will clear again. Take a few samples of size 200 from your population. The values of the sample mean will be even more finely divided than before, and will tend to be even closer to the population mean. Slide the "Samples to Take" control up to a large value, and press the "Take Sample" button a few times. The green histogram should follow the normal curve very well. It should "balance" quite close to the population mean, and its width should be about the SD of the population, divided by about 14 (the square-root of 200).

The histogram of values of the chi-squared statistic also is approximated better and better by a normal curve as the sample size increases, if the number of categories is not too small. The histogram is approximated even better by the Chi-square curve with ( k - 1) degrees of freedom, where k is the number of categories.

The histogram of values of S 2 also is approximated better and better by the normal curve as the sample size increases, but the transformation to standard units depends on the population in a complicated way, unless the population has a normal distribution . If it does, for moderate sample sizes, the chi-squared curve gives a better approximation than the normal curve. The chi-square curve needs to be scaled, in much the same way as the normal approximation depends on transforming to standard units. In particular, it is the distribution of (sd 2 /( n -1))× S 2 that is approximated by the chi-squared curve with ( n -1) degrees of freedom , where sd is the standard deviation of the normal population.

This widget illustrates several important statistical concepts:

The choice box in the title area lets you select either the sample mean or the sample sum. Every time you press the "Take Sample" button in the title area, samples with replacement are drawn from the population of numbers in the box at the right hand side, and either the sum or mean of each sample is taken, corresponding to whichever is visible in the title. The "Sample Size" box controls how large each sample is, and the "Take ____ samples" box controls how many samples of that size are taken each time you press the "Take sample" button. The mean and SD of the numbers in the box are displayed on the left, along with the SE of the sample mean or sample sum (corresponding to whichever is selected), and the number of sample valuesand histograms of the numbers in the box and of the sample values of the sample mean or sum are shown in the middle, in blue and green, respectively. You can superpose the normal curve on the histogram of sample values by clicking the "Show Normal Curve" button.

The "Highlight from" and "To" boxes let you highlight a range of sample values in the histogram; the area of the highlighted range of sample values (the proportion of values of the sample mean or sample sum in the range) is then displayed, along with the corresponding area under the normal curve, if the normal curve is showing. When you switch between the sample sum and the sample mean, the "Highlight from" and "To" limits are transformed to correspond to the equivalent range of sample values. The "Bins" box controls the number of bins in the histograms. If you change the sample size, the history of sample values will be reset and green histogram will clear (you cannot mix sample sizes in the same plot). Changing the number of samples to take does not clear the history, nor does toggling back and forth between the sample sum and the sample mean.

To change the numbers in the population box, either delete the numbers in the box using the backspace key and type in new values, or selecting the numbers in the box and type over them. Then click outside the population box to update the values. The display of the Ave(box), SD(box) and SE(mean) or SE(sum) (depending on which is displayed) will be updated to reflect the new contents of the box.

To change the number in the "Highlight From," "To," "Sample Size," "Take ____ Samples," or "Bins" box, delete or select and type over the current number, then strike the "enter" or "return" key. The "Highlight From" and "To" values can also be changed using the neighboring scrollbars.
