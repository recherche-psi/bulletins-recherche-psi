---
title: "Preregistration and the traceability of results"
description: "A review of 60 preregistered psi experiments: results, numerical checks and the role of scientific evaluation."
tags: ["parapsychology", "metascience", "preregistration", "anomalistics"]
publishedAt: "2026-10-30"
draft: false
announce: false
status: "Critical review of scientific publications"
reading: "Explained results and methodological analysis"
authors: "Recherche psi"
publication: "PsyArXiv, Journal of Anomalistics, JMIR Metascience and Research Integrity, Psi Encyclopedia"
---

This issue follows the same question across several topics: how can we check what a result warrants? An updated review counts preregistered psi experiments; a correction revisits the statistical calculations in colour experiments. The metascience section, which studies how research is conducted and evaluated, examines reviewers' contributions and the responsibility of authors using AI. A historical entry concerns extraordinary experiences attributed to Goethe. The new contributions date from 24 to 30 October; the correction of 20 October is identified as a catch-up item.

## Psi research

### An updated review of preregistered studies

Tressoldi and Storm [1] · 28 October 2026 · Preprint version 4 · Manuscript marked in press in the Journal of Anomalous Experience and Cognition (JAEX); final publisher version not identified

[Manuscript and DOI](https://doi.org/10.31234/osf.io/ha4np_v4)  |  [Data version 5 of 28 October [2]](https://doi.org/10.5281/zenodo.23722257)

Psi research includes tests of the proposed ability to obtain information without a known sensory pathway, for example by identifying a hidden or future target. Other experiments investigate a proposed influence on a random system, called micropsychokinesis. In such experiments, choices of hypotheses and analyses can affect interpretation of the result.

**Preregistration** records hypotheses, exclusion criteria and planned tests in advance, before the relevant results are known. A **confirmatory** hypothesis is thus announced before it is evaluated. An **exploratory** analysis discovers a possible lead in the data; that lead then requires a new test planned in advance. Preregistration allows the initial plan to be compared with the final report. Tressoldi and Storm ask how many psi tests produce a positive result when they follow the announced plan [1].

**Design and status.** The authors search the Open Science Framework (OSF), a platform for depositing research protocols and documents, the Koestler Parapsychology Unit (KPU) study registry in Edinburgh, and meta-analyses. One author extracts the information and the other checks it. The review itself was not preregistered. It includes 50 studies, 60 experiments and 97 hypotheses. These are different units: one study can contain several experiments, each of which can test multiple hypotheses. An experiment is classified as positive if at least one confirmatory hypothesis is supported without deviation from the plan [1].

| Unit counted | Reported result reproduced from the data |
| --- | --- |
| Positive experiments | 17 / 60 = 28.3% |
| Supported confirmatory hypotheses | 20 / 97 = 20.6% |
| Other outcomes under the authors' coding | 43 experiments and 77 hypotheses not positive |

A result is **statistically significant** when its test crosses the decision threshold specified in the protocol. This verdict depends on the observed difference, the amount of data and the test's assumptions. The percentage of positive experiments therefore counts how many cross their criterion; it does not measure the magnitude of a common psi effect.

The 43 experiments not classified as positive are not all equivalence tests demonstrating the absence of an effect. Such a test would require a prespecified minimum effect of interest and sufficiently precise data to exclude an effect of that magnitude.

### What can be checked in the data

Our check of PreregisteredStudies_Final.xlsx [2] reproduces the totals in the preceding table by summing the 60 experimental rows. It concerns the consistency of the table; it does not repeat the experiments or individually compare each preregistration with its final report.

**One denominator requires correction.** 'Selected' participants are recruited for characteristics considered favourable to psi; the others are not recruited on that basis. On p. 12, the text attributes 10 positive outcomes out of 17 to experiments with unselected participants. The file contains 43 experiments in that group: the rate is therefore 10/43 = 23.3%. For selected participants, it is 7/17 = 41.2%. These figures describe the groups included in the review. Tasks, teams and sample sizes may differ; a comparison assembled in this way does not demonstrate a causal effect of selection.

The availability of the table is a strength because it enables this check. Its interpretation requires several precautions. Testing more hypotheses creates more opportunities to classify an experiment as positive if thresholds are not adjusted to account for these multiple tests. Tests in the same article may also share participants or procedures: treating them as independent observations would underestimate uncertainty. Finally, the proportion of significant findings depends on the effect sizes being investigated and on **statistical power**, meaning the design's ability to detect a specified effect. It therefore cannot by itself compare the validity of psi with that of general psychology.

Requiring results to be available leaves open the question of registered, completed studies that have not disseminated them. Furthermore, the methods specify inclusion through 31 October, whereas this version is dated 28 October: the actual search cut-off requires clarification. These issues suggest using the work as a documented inventory, followed by checks of inclusion decisions, dependencies and estimates within each paradigm.

*Priority full read: read the methods, results and data table together. The percentages should not be presented as an overall estimate of psi reproducibility.*

## Catch up on a permutation test

Maier and Dechamps [3] · First online on 20 October 2026 · Journal corrigendum · Announced assignment to volume 27 of 2027

These experiments address a controversial hypothesis: retaining or erasing the computer record of a colour's parameters would be related to subjective liking of that colour. Erasure concerns the recorded data without degrading the colour displayed on screen; participants are not informed of this manipulation [4].

The sets of colours differ between conditions. A difference in liking could therefore arise from the colours themselves. The authors use a permutation analysis, among other methods, to examine that explanation. The four original studies analysed 945, 749, 562 and 1,367 participants, respectively. The standardised differences in liking, Cohen's d, were .21, .50, .37 and .14; Study 4 was preregistered [4]. Cohen's d expresses the mean difference between groups in a unit that accounts for the spread of ratings. The correction supplies a reanalysis, without a new sample.

A **permutation test** reallocates colours between conditions and recalculates the difference for each reallocation. This constructs a reference distribution: the differences those reallocations would produce under the model being tested. Here, the observed mean was **weighted**, meaning that each colour counted according to the number of people who had rated it. The script compared it with unweighted permuted means. The correction retains the same weights during permutation. The main one-sided p value changes from .005 to .003; the measured effect is unchanged [3].

The **p value** describes, under the model being tested, the frequency of differences at least as extreme as the one observed. A **one-sided** test examines a specified direction of difference; a **two-sided** test examines both directions. The correction specifies that the direction of the pooled analysis was chosen after observing the data; its two-sided p value is .007 [3].

**Our analysis.** Repairing the calculation resolves this mismatch between statistics. Valid interpretation still requires justification of the exchangeability of colours: the reallocations used must correctly represent the model with no relationship between condition and liking. A smaller p value does not, by itself, distinguish the proposed psychophysical explanations.

*Targeted reading: nature of the error, Tables 1 and 3, then justification of test direction. The correction should accompany any citation of the earlier results.*

## Metascience and scientific evaluation

### What publication preserves of the work of reviewers

Denolle Lab [5] · 27 October 2026 · Working report version 0.3 · Exploratory automated analysis without peer review · Preregistration not declared

[Full report](https://denolle-lab.github.io/metascience-and-AI/review-visibility.html)

**Peer review** is the examination of a manuscript by specialists before publication. They may request an additional check, a new analysis or revised wording. For example, a reviewer may ask whether a result survives the removal of particular observations. The published version may then incorporate that check without explaining that it was requested during review.

The Denolle Lab report compares public peer-review exchanges with the published text: can the requested changes be found, and is their origin indicated? The question therefore concerns how the final article represents the work that helped improve it.

The corpus consists of 58 geoscience articles from 2022, including 33 in The Cryosphere. AI models code the exchanges and then search for changes in the final text. Of 580 changes, 560 are located without attribution to peer review and 20 are not found: 3.4%, with a 95% interval of 1.7% to 5.6% obtained by resampling articles. Under this coding, no change is explicitly attributed to review. The coding has not been validated by humans [5].

Resampling here means repeating the calculation on samples of articles drawn from the corpus. The interval describes variation associated with the articles included; possible errors in automated coding require separate validation.

Our analysis. The work distinguishes the presence of a check from the visibility of its history. Because the exchanges are already public, this result does not measure fraud.

The quantitative interpretation remains fragile. Models from the same family may share errors. Supplying the final text when coding the exchanges may shape the reconstruction. The articles' supplements were not examined: an element not found in the body text may be present there. The 20 absences therefore do not necessarily correspond to analyses that were not performed.

Validation should involve independent specialists, successive versions and supplements, with cases of already known changes. The report provides an audit protocol to test.

*Targeted reading: methods, classification rules and limitations. The figures remain provisional pending independent validation.*

### Who can justify a conclusion written with AI

Elden [6] · 27 October 2026 · Peer-reviewed conceptual article · No new sample or effect size

AI can propose a statistical model or an interpretation of data. Who in the author team can explain why that choice is justified? This is Elden's question. Declaring the use of a tool leaves open whether authors can defend the inferences they adopt. He proposes identifying, for each consequential operation, the team members able to justify its evidence, assumptions and limitations. An **audit** would be a targeted examination of that justification when a specific concern arises. These audits are proposed normative instruments that have not yet been validated [6].

Our analysis. Identifying who can justify a conclusion makes scrutiny concrete. The procedure's effectiveness, burden and fairness require trials; a general loss of competence caused by AI has not been demonstrated.

*Targeted reading: the examples in Table 2, the proposed participation profile and the safeguards governing audits.*

## Historical anomalistics around Goethe

Puhle [7] · Created 28 October and updated 29 October 2026 · Historical synthesis in the Psi Encyclopedia · Editorial entry distinct from a peer-reviewed journal article

**Anomalistics** studies unusual experiences and their interpretations. Puhle's entry concerns Goethe, a German writer of the eighteenth and nineteenth centuries. It assembles narratives of premonitions, apparitions and other extraordinary experiences from his autobiography, letters, conversations and literary works. Its contribution is documentary: it enables readers to locate and compare these sources, without supplying a new experimental test [7].

Our analysis. Each episode requires dating, identification of witnesses and a chain of transmission. A late autobiographical text, a reported conversation and fiction require distinct treatments. Literary interpretation does not constitute an independent observation of a psi ability.

*Targeted reading: the relationship between poetry and truth, then references for the episodes. Of historical interest.*

## Synthesis and priority reading

This week's additions make verification procedures more explicit. The review of preregistered studies provides countable units and a checkable table. The colour correction recalls that the observed calculation and the reference distribution must concern the same statistic. The metascience contributions examine the traceability of revisions and authors' ability to justify their conclusions. For historical narratives, the quality of the documentary chain remains central.

1. Tressoldi and Storm [1], with the data [2]: full reading to understand positivity criteria, units of counting and proposed comparisons.

2. Maier and Dechamps [3]: full reading of the correction, particularly for any use of the retention and erasure paradigm.

3. Denolle Lab [5]: read the methods and limitations when designing an audit of changes made during peer review.

No new academic book is included in the selection for this issue.

## References

Context reference [4] is not presented as a new publication. Original titles are retained for identification; all these works were originally written in English.

[1] Tressoldi, P., & Storm, L. (2026, October 28). Outcomes of Preregistered Studies Related to Extra-Sensory Perception, and Mind-Matter Interaction: A Systematic Review. PsyArXiv, version 4. [10.31234/osf.io/ha4np_v4](https://doi.org/10.31234/osf.io/ha4np_v4)

[2] Tressoldi, P. (2026, October 28). Preregistered Studies Related to Extra-Sensory Perception and Mind-Matter Interaction [Dataset, version 5]. Zenodo. [10.5281/zenodo.23722257](https://doi.org/10.5281/zenodo.23722257)

[3] Maier, M. A., & Dechamps, M. C. (2026, October 20, advance online publication; volume 27 announced for 2027). Corrigendum to “Macroscopic Complementary Relation Between Subjective Observations and Objective Measurements of Colors” and to “Acausal Psychophysical Correlations in a Causally Closed World? Evidence from (Un)Confounded Erasure Paradigms and the Limits of Physicalist Methodology”. Journal of Anomalistics. [10.23793/zfa.2027.0001](https://doi.org/10.23793/zfa.2027.0001)

[4] Maier, M. A., & Dechamps, M. C. (2025). Macroscopic Complementary Relation Between Subjective Observations and Objective Measurements of Colors. Journal of Anomalistics, 25(1), 15–60. [10.23793/zfa.2025.015](https://doi.org/10.23793/zfa.2025.015)

[5] Denolle Lab. (2026, October 27). What review changes, and what the paper says [Working report, version 0.3]. MetaScience, Scientific Inquiry, and Agents. [Report and methods](https://denolle-lab.github.io/metascience-and-AI/review-visibility.html)

[6] Elden, Å. (2026, October 27). Derivative Epistemic Agency: AI-Mediated Scientific Cognition and the Limits of Human Answerability. JMIR Metascience and Research Integrity, 1, e105907. [10.2196/105907](https://doi.org/10.2196/105907)

[7] Puhle, A. (2026). Psychic Phenomena in Goethe’s Life and Work. Psi Encyclopedia. Created October 28; updated October 29, 2026. [Text and bibliography](https://psi-encyclopedia.spr.ac.uk/articles/psychic-phenomena-in-goethes-life-and-work/)
