# Bulletins de la recherche psi

Site de veille critique consacré à la parapsychologie, à l'anomalistique et aux sciences de la conscience.

## Publication d'un bulletin

1. Ajouter un fichier Markdown dans `src/content/bulletins/` avec `draft: true`.
2. Créer une branche et une pull request afin de relire le texte et de vérifier automatiquement la construction.
3. Passer `draft` à `false` après validation de fond.
4. Fusionner la pull request. GitHub Actions publie alors le site sur GitHub Pages.
5. Après le déploiement, GitHub Actions annonce automatiquement le nouveau bulletin sur Bluesky et Mastodon. Une correction ultérieure d'un bulletin déjà public ne crée pas une nouvelle annonce.

Les deux flux peuvent aussi être exécutés manuellement depuis l'onglet Actions, en mode test ou aperçu sans publication.

Pour publier un bulletin uniquement sur le site, ajouter `announce: false` à son en-tête YAML. Les scripts Bluesky et Mastodon ignorent alors ce bulletin, y compris lors d'une exécution manuelle.

## Développement local

```sh
npm install
npm run dev
```

La commande `npm run build` contrôle les types et produit le site statique dans `dist/`.

## Licences

Le code source est distribué sous licence MIT. Les textes sont distribués sous licence Creative Commons Attribution 4.0 International.

## Versions anglaises

L'interface anglaise est accessible sous `/en/`. Les versions françaises conservent leurs adresses existantes. Pour traduire un bulletin, ajouter un fichier dans `src/content/bulletins-en/` portant exactement le même nom que l'original français et utilisant les mêmes champs YAML, traduits. Le sélecteur FR | EN relie automatiquement les deux versions publiées. Si la traduction est absente ou en brouillon, EN est désactivé sur le bulletin français. La construction échoue si une traduction publiée n'a pas d'original français publié.

Vérifier les données chiffrées, les liens de sources et les nuances méthodologiques avant de publier une traduction. Les archives, le flux RSS anglais et le sitemap sont mis à jour automatiquement. Les traductions ne déclenchent pas les annonces sociales des nouveaux bulletins français.
