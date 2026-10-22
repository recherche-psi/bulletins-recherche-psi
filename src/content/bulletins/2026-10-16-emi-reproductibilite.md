---
title: "Espaces des EMI et reproductibilité informatique"
description: "Une étude sur les dessins d'expériences de mort imminente et un audit préenregistré de reproductibilité. Bulletin du 10 au 16 octobre 2026."
publishedAt: "2026-10-16"
status: "Veille critique de publications scientifiques"
reading: "Résultats, méthodes et lectures prioritaires"
authors: "Recherche psi"
publication: "Frontiers in Psychology et arXiv"
tags: ["expériences anomales", "métascience", "EMI"]
draft: false
announce: true
---

Ce numéro retient une étude sur la description visuelle des expériences de mort imminente et une prépublication de métascience sur la reproductibilité informatique. La première documente des expériences anomales sans tester une acquisition extrasensorielle d'information. La seconde examine ce que signifie reproduire une décision lorsque certains résultats élémentaires changent. Aucun nouvel essai contrôlé de psi n'est retenu dans ce numéro.

## Sommaire

- [Expériences de mort imminente et reconstruction visuelle](#expériences-anomales-et-conscience)
- [Métascience et reproductibilité des évaluations](#métascience)
- [Synthèse et lectures prioritaires](#synthèse-et-lectures-prioritaires)

## Expériences anomales et conscience

### Reconstituer les espaces vécus lors des EMI

Lerner et al. [1] • 15 octobre 2026 • Article empirique évalué par les pairs • Étude exploratoire rétrospective

Une expérience de mort imminente, ou EMI, est un vécu inhabituel rapporté en lien avec un danger vital réel ou ressenti. Elle peut comporter une modification de la localisation de soi, une impression de déplacement ou une scène visuelle très structurée. Décrire ces propriétés exige de distinguer l'espace vécu de la position physique du corps et de la véracité d'une information rapportée. Un dessin peut aider à expliciter ces distinctions. La question posée est de savoir si les formes des espaces rapportés sont associées à leurs couleurs.

Questionnaire et dessins guidés par un catalogue de pictogrammes : 50 participants, souvenirs datant d'une médiane de 15,1 ans. Les analyses par catégories portent sur 108 espaces reconstruits ; le modèle tient compte de leur regroupement chez 47 personnes. Aucun préenregistrement n'est signalé dans l'article [1].

| Catégorie géométrique | Espaces colorés | Proportion |
| --- | --- | --- |
| A  Formes coniques | 6 / 28 | 21,4 % |
| B  Arcs elliptiques | 27 / 31 | 87,1 % |
| C1–4  Arcs peu courbés | 13 / 20 | 65,0 % |
| C5  Enveloppes ellipsoïdales | 17 / 29 | 58,6 % |

*Unité : espace reconstruit, et non personne. Une personne peut contribuer plusieurs espaces.*

Le contraste B/A donne OR = 18,4 ; IC à 95 % corrigé [3,45 ; 98,50]. Les contrastes avec C sont sensibles à la méthode ; les huit comparaisons avec l'intensité des EMI ne restent pas significatives après correction de Holm [1].

Un odds ratio, ou rapport de cotes, compare ici les cotes d'un récit coloré entre deux catégories. Il ne signifie pas que la probabilité d'une couleur serait multipliée par 18,4. L'intervalle étendu indique une estimation imprécise de l'amplitude. L'ajustement par participant est utile : plusieurs dessins d'une même personne ne constituent pas autant de témoignages indépendants.

### Ce que la reconstruction permet de tester

L'apport méthodologique est de rendre une description assez précise pour que d'autres chercheurs puissent la confronter à de nouvelles observations. La phénoménologie étudie ici l'organisation du vécu rapporté. Elle n'exige pas de décider au préalable si ce vécu correspond à un environnement extérieur. La régularité d'un dessin et la justesse d'une perception sont deux questions expérimentales distinctes.

Le catalogue facilite la comparaison, tout en fournissant un cadre de réponse susceptible d'orienter le souvenir. Pour mesurer cette influence, une réplication pourrait comparer un dessin libre réalisé d'abord à une reconstruction assistée par pictogrammes, puis faire classer les dessins par des évaluateurs ignorant la condition. On pourrait ainsi examiner séparément la répétabilité du classement et la part introduite par les consignes.

La sélection des personnes qui acceptent une reconstruction détaillée et la remémoration différée limitent la généralisation. Il faudrait également appliquer la même procédure à d'autres vécus, tels que les rêves, pour déterminer si une géométrie est spécifique aux EMI. Une différence entre catégories, à l'intérieur d'un échantillon d'EMI, ne suffit pas à établir cette spécificité.

*Lecture intégrale recommandée : procédure d'entretien, construction des catégories et analyses regroupées par participant.*

## Métascience

### Reproduire les mesures et reproduire les décisions

Ding et al. [2] • 10 octobre 2026 • Prépublication arXiv v1 • Audits informatiques avec plans préenregistrés déclarés

La métascience étudie la manière dont la recherche produit et vérifie ses résultats. L'étude de Ding et ses collègues prend pour exemple des intelligences artificielles chargées de corriger des programmes. Chaque correction est soumise à des tests automatiques : elle réussit si elle satisfait les critères prévus. Ces verdicts servent ensuite à comparer les IA ou à choisir une version à conserver. Or ils peuvent dépendre de l'environnement informatique, notamment de l'accès aux composants logiciels et des ressources disponibles. Les auteurs réexécutent donc des évaluations déjà réalisées. Leur premier audit demande si restreindre l'accès aux composants nécessaires fait rejeter des corrections auparavant acceptées. Le second examine si relancer les tests avec moins de puissance de calcul change le choix de la meilleure version ou le classement des systèmes. C'est une question générale de reproductibilité : un résultat élémentaire peut varier sans modifier la décision finale. Ce travail porte sur l'évaluation des IA ; son intérêt pour les sciences expérimentales réside dans cette distinction.

Deux audits sont rapportés, avec plans figés par commits avant les tests selon les auteurs. Parmi 281 corrections évaluables, 59, écrites dans le langage Go, sont effectivement exposées au changement de configuration : aucune ne perd son acceptation ; borne supérieure exploratoire non pondérée à 95 % : 4,95 %, sous indépendance. Le risque de 3 % reste donc non exclu. Sur 1 929 évaluations réexécutées, le meilleur agent et le classement restent inchangés, à historique et scores non réexécutés fixés [2].

L'absence d'incident observé ne garantit pas un taux nul. Pour zéro incident sur n observations indépendantes, la borne unilatérale exacte à 95 % vaut 1 − 0,05^(1/n). Une dépendance entre programmes d'une même tâche réduit l'information disponible. De même, un classement stable peut coexister avec des verdicts individuels différents. Il faut préciser si l'objectif porte sur l'identité des mesures, une marge de désaccord tolérable ou la stabilité d'une décision.

Le gel des règles avant les tests est un atout. L'examen reste limité à des évaluations sélectionnées et à une histoire d'apprentissage fixée : une décision stable dans ces conditions ne valide pas tous les parcours possibles d'un système adaptatif. La conclusion négative doit rester attachée à la question testée.

*Lecture intégrale recommandée pour les règles préenregistrées et la délimitation des conclusions ; les détails logiciels peuvent être consultés selon les besoins.*

## Synthèse et lectures prioritaires

Les deux ajouts portent sur la construction d'observations comparables. Dans l'étude des EMI, il faut estimer ce que le mode de recueil apporte à la forme du récit. Dans l'audit informatique, il faut distinguer les variations des résultats et leurs conséquences sur une décision. Ces exigences précisent ce qu'une réplication devra conserver et ce qu'elle pourra faire varier.

1. Lerner et al. [1], pour la méthode de reconstruction et ses limites.

1. Ding et al. [2], pour la distinction entre reproductibilité et stabilité des décisions.

## Références

[1] Lerner, F., dos Santos, P. C. R., & Tahar, G. (2026). The perceptual geometry and chromaticity of near-death experience spaces. *Frontiers in Psychology, 17*, 1760389. [DOI](https://doi.org/10.3389/fpsyg.2026.1760389)

[2] Ding, T., Tong, Y., Yang, M., Jiang, F., Yang, L., & Yu, B. (2026). Re-executing Coding-Agent Evaluations: Unchanged Decisions and Unresolved Policy Risk. arXiv:2610.14460v1. [arXiv](https://arxiv.org/abs/2610.14460v1)
