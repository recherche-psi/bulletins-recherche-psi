# Espace de données

L’adresse `/donnees/` ouvre un catalogue en français, réparti en relations psychophysiques stables, relations induites de type psi et espace synthétique. Un lien figure dans le pied de page. La page est exclue du sitemap et porte une directive `noindex`.

Le catalogue et les archives locales sont chiffrés avec AES-256-GCM. La clé est dérivée du mot de passe partagé par PBKDF2-SHA256 (600 000 itérations, sel aléatoire de 16 octets, IV aléatoire de 12 octets). Le mot de passe, le catalogue en clair et les archives en clair ne sont pas conservés dans ce dépôt. Aucun secret n’est nécessaire au build GitHub Actions. Le navigateur garde le mot de passe uniquement en mémoire pendant l’ouverture de la page. Verrouiller, recharger ou quitter efface l’état de l’interface ; les téléchargements déjà effectués restent sur l’appareil.

GitHub Pages reste un hébergement statique public : les fichiers chiffrés peuvent être copiés et faire l’objet d’essais de mot de passe hors ligne. Ce mécanisme ne remplace pas une authentification serveur avec comptes, limitation des tentatives et révocation d’accès. Les dépôts scientifiques liés sont publics ; leur accès n’est pas restreint par ce catalogue. Changer le mot de passe ne révoque pas les copies antérieures. Utiliser un hébergement avec contrôle serveur si une confidentialité forte devient nécessaire.

## Mettre à jour les fiches

Conserver les sources éditoriales et les archives en clair hors du dépôt. Le catalogue JSON contient `version: 1`, `categories` (`id`, `title`, `description`) et `protocols` (`id`, `category`, `title`, `authors`, `intro`, `structure`, `note`, `sources`, `files`). Les sources ont `label` et `url`. Chaque fichier a `name`, `role`, éventuellement `format`, `size`, `url`, `encrypted` et `downloadName`.

Les téléchargements publics utilisent les URL retournées par les dépôts originaux. Les copies locales sont des ZIP décrits dans un plan privé : liste d’objets avec `input` (chemin local) et `output` (`asset-<empreinte>.enc.json`). Leur URL dans le catalogue est `../data/research/<output>`.

Définir `RESEARCH_DATA_PASSWORD` dans l’environnement du seul processus de chiffrement, puis exécuter :

```sh
node scripts/encrypt-research-data.mjs /chemin/prive/catalogue.json /chemin/prive/archives.json
npm run build
node --test tests/research-data.test.mjs
```

Ne jamais placer le mot de passe dans un script, un fichier `.env` versionné, un workflow, un message de commit ou un journal. Après modification, vérifier l’ouverture avec le bon mot de passe, le refus avec un mauvais mot de passe, la recherche, les catégories, les téléchargements et le verrouillage. Ne publier que les sorties chiffrées et l’interface générique. Conserver les sources privées pour permettre la maintenance.

## Provenance et granularité

L’édition initiale est fondée sur l’inventaire local et les métadonnées des dépôts vérifiées le 28 octobre 2026. Elle distingue données sources, formats dérivés, transcriptions de tables, code et documentation. Une ressource documentaire n’est pas présentée comme une série brute. Les téléchargements volumineux restent chez leurs hébergeurs. Les conditions de licence restent celles de chaque source, et les copies locales ne reçoivent pas automatiquement la licence des textes du site.
