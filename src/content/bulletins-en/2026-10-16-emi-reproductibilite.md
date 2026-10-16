---
title: "NDE spaces and computational reproducibility"
description: "A study of near-death experience drawings and a preregistered reproducibility audit. Bulletin for 10–16 October 2026."
publishedAt: "2026-10-16"
status: "Critical review of scientific publications"
reading: "Findings, methods and reading priorities"
authors: "Psi research"
publication: "Frontiers in Psychology and arXiv"
tags: ["anomalous experiences", "metascience", "NDEs"]
draft: false
announce: false
---

This issue selects a study of the visual description of near-death experiences and a metascience preprint on computational reproducibility. The former documents anomalous experiences without testing extrasensory information acquisition. The latter examines what it means to reproduce a decision when some underlying results change. No new controlled psi experiment is selected in this issue.

## Contents

- [Near-death experiences and visual reconstruction](#anomalous-experiences-and-consciousness)
- [Metascience and reproducibility of evaluations](#metascience)
- [Synthesis and reading priorities](#synthesis-and-reading-priorities)

## Anomalous experiences and consciousness

### Reconstructing spaces experienced during NDEs

Lerner et al. [1] • 15 October 2026 • Peer-reviewed empirical article • Retrospective exploratory study

A near-death experience, or NDE, is an unusual experience reported in connection with an actual or perceived threat to life. It may involve altered self-location, a sense of movement or a highly structured visual scene. Describing these properties requires distinguishing experienced space from the physical location of the body and from the accuracy of reported information. A drawing can help make these distinctions explicit. The question is whether the shapes of reported spaces are associated with their colours.

Questionnaire and drawings guided by a pictogram catalogue: 50 participants, with experiences recalled after a median of 15.1 years. Category-based analyses cover 108 reconstructed spaces; the model accounts for their clustering within 47 people. The article reports no preregistration [1].

| Geometric category | Chromatic spaces | Proportion |
| --- | --- | --- |
| A  Conical forms | 6 / 28 | 21.4% |
| B  Elliptic arcs | 27 / 31 | 87.1% |
| C1–4  Low-curvature arcs | 13 / 20 | 65.0% |
| C5  Ellipsoidal enclosures | 17 / 29 | 58.6% |

*Unit: reconstructed space, not person. One person may contribute several spaces.*

The B/A contrast yields OR = 18.4; corrected 95% CI [3.45, 98.50]. Contrasts involving C are method-sensitive; none of the eight comparisons with NDE intensity remains significant after Holm correction [1].

An odds ratio here compares the odds of a chromatic report between two categories. It does not mean that the probability of colour is multiplied by 18.4. The wide interval indicates an imprecise estimate of magnitude. Participant-level adjustment is useful: several drawings from the same person do not constitute as many independent accounts.

### What reconstruction makes testable

The methodological contribution is to make a description precise enough for other researchers to compare it against new observations. Phenomenology here studies the organisation of reported experience. It does not require deciding in advance whether that experience corresponds to an external environment. Regularity in a drawing and accuracy of perception are distinct experimental questions.

The catalogue facilitates comparison while providing a response framework that may guide recollection. To measure this influence, a replication could compare a freehand drawing made first with a reconstruction assisted by pictograms, then have drawings classified by assessors unaware of condition. This would allow separate examination of classification repeatability and the contribution of instructions.

Selection of people willing to undertake a detailed reconstruction and delayed recollection limit generalisation. The same procedure should also be applied to other experiences, such as dreams, to determine whether a geometry is specific to NDEs. A difference between categories within an NDE sample is insufficient to establish such specificity.

*Full reading recommended: interview procedure, construction of categories and participant-clustered analyses.*

## Metascience

### Reproducing measurements and reproducing decisions

Ding et al. [2] • 10 October 2026 • arXiv v1 preprint • Computational audits with reported preregistered plans

Metascience studies how research produces and checks its findings. Ding and colleagues examine artificial intelligence systems tasked with fixing computer programs. Each proposed fix undergoes automated tests: it succeeds if it meets the specified criteria. These verdicts are then used to compare AI systems or select a version to retain. Yet verdicts can depend on the computing environment, including access to software components and available resources. The authors therefore rerun previously conducted evaluations. Their first audit asks whether restricting access to required components causes previously accepted fixes to be rejected. The second examines whether rerunning tests with less computing power changes the choice of the best version or the ranking of systems. This raises a general reproducibility question: an individual result can change without altering the final decision. The work concerns AI evaluation; its relevance to experimental science lies in this distinction.

Two audits are reported, with plans frozen by commits before testing according to the authors. Of 281 evaluable fixes, 59, written in the Go language, are actually exposed to the configuration change: none loses its accepted verdict; exploratory unweighted 95% upper bound: 4.95%, assuming independence. A 3% risk therefore remains unexcluded. Across 1,929 re-executed evaluations, best-agent selection and ranking remained unchanged, with history and scores not re-executed held fixed [2].

No observed incident does not guarantee a zero rate. With zero incidents in n independent observations, the exact one-sided 95% bound is 1 − 0.05^(1/n). Dependence between programs from the same task reduces available information. Similarly, stable rankings can coexist with different individual verdicts. The objective needs specifying: identical measurements, a tolerable disagreement margin or decision stability.

Freezing rules before testing is a strength. The examination remains limited to selected evaluations and a fixed learning history: a stable decision under these conditions does not validate every possible trajectory of an adaptive system. The negative conclusion must remain tied to the question tested.

*Full reading recommended for preregistered rules and boundaries of the conclusions; software details can be consulted as needed.*

## Synthesis and reading priorities

Both additions concern the construction of comparable observations. In the NDE study, the contribution of the elicitation method to the form of the account needs estimating. In the computational audit, variation in results must be distinguished from its consequences for a decision. These requirements clarify what a replication should preserve and what it may vary.

1. Lerner et al. [1], for the reconstruction method and its limitations.

1. Ding et al. [2], for the distinction between reproducibility and decision stability.

## References

[1] Lerner, F., dos Santos, P. C. R., & Tahar, G. (2026). The perceptual geometry and chromaticity of near-death experience spaces. *Frontiers in Psychology, 17*, 1760389. [DOI](https://doi.org/10.3389/fpsyg.2026.1760389)

[2] Ding, T., Tong, Y., Yang, M., Jiang, F., Yang, L., & Yu, B. (2026). Re-executing Coding-Agent Evaluations: Unchanged Decisions and Unresolved Policy Risk. arXiv:2610.14460v1. [arXiv](https://arxiv.org/abs/2610.14460v1)
