# Espace de données

L’adresse `/donnees/` ouvre un catalogue en français, réparti en relations psychophysiques stables, relations induites de type psi et espace synthétique. Un lien figure dans le pied de page. La page est exclue du sitemap et porte une directive `noindex`.

Le catalogue et les archives locales sont chiffrés avec AES-256-GCM. La clé est dérivée du mot de passe partagé par PBKDF2-SHA256 (600 000 itérations, sel aléatoire de 16 octets, IV aléatoire de 12 octets). Le mot de passe, le catalogue en clair et les archives en clair ne sont pas conservés dans ce dépôt. Aucun secret n’est nécessaire au build GitHub Actions. Le navigateur garde le mot de passe uniquement en mémoire pendant l’ouverture de la page. Verrouiller, recharger ou quitter efface l’état de l’interface ; les téléchargements déjà effectués restent sur l’appareil.

GitHub Pages reste un hébergement statique public : les fichiers chiffrés peuvent être copiés et faire l’objet d’essais de mot de passe hors ligne. Ce mécanisme ne remplace pas une authentification serveur avec comptes, limitation des tentatives et révocation d’accès. Les dépôts scientifiques liés sont publics ; leur accès n’est pas restreint par ce catalogue. Changer le mot de passe ne révoque pas les copies antérieures. Utiliser un hébergement avec contrôle serveur si une confidentialité forte devient nécessaire.

## Mettre à jour les fiches

Conserver les sources éditoriales et les archives en clair hors du dépôt. Le catalogue JSON contient `version: 1`, `categories` (`id`, `title`, `description`) et `protocols` (`id`, `category`, `title`, `authors`, `intro`, `structure`, `note`, `sources`, `files`). Les champs facultatifs `analysis`, `granularity`, `license` et `verified` (date ISO) documentent les pistes de réanalyse, le niveau d'observation, les conditions de réutilisation et la vérification. Les sources ont `label` et `url`. Chaque fichier a `name`, `role`, éventuellement `format`, `size`, `url`, `encrypted` et `downloadName`.

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

L’enrichissement du 28 octobre 2026 porte le catalogue à 46 fiches (28 stables, 14 psi, 4 synthétiques). Les nouveaux liens renvoient aux fichiers publics d’origine. Les tables représentatives ont été téléchargées et inspectées ; les archives ECG volumineuses et les grands lots d’essais sont explicitement signalés comme inventoriés ou échantillonnés. Les journaux de vérification, la sauvegarde initiale et le script privé `extend_catalog.py` restent hors du dépôt. Appliquer cet enrichissement après une éventuelle régénération de la base initiale afin de ne pas perdre les nouvelles fiches.

## Simulateur, version 3.0

Le catalogue contient désormais 50 fiches : 28 stables, 14 psi et 8 synthétiques. Le paquet autonome V3 compare dix familles probabilistes : références iid, modèle symétrique r,G, HMM classiques, transitions selon le résultat, dérive, rupture et HQMM réel restreint à un qubit. Les observations seules alimentent l’ajustement. Le découpage sépare apprentissage (60 % des sessions), choix du modèle (20 %) et test final (20 %), avec réajustement sur les 80 % initiaux avant le test. Les gains prédictifs, intervalles par rééchantillonnage de sessions et diagnostics sont documentés. Les limites d’identification et d’interprétation restent explicites.

Les quatre jeux d’origine et leurs archives restent identiques à la V2 ; quatre nouveaux jeux ajoutent dérive, rupture, HMM avec dérive et HQMM synthétique. Le paquet comprend les huit rapports précalculés, les 27 tests, les guides et l’ancienne interface V2. La non-stationnarité couverte est commune à la position dans les sessions ; le HQMM n’est pas une famille quantique générale. Aucun résultat ne démontre automatiquement un mécanisme physique ou une ontologie.

Les sources de maintenance sont `hmm-v3/`, `package_hmm_v3.py`, `install_hmm_v3.py` et `encrypt_hmm_v3.mjs`, conservées hors dépôt. Réappliquer cette mise à jour après les scripts d’inventaire initial et d’enrichissement. La publication remplace le paquet complet chiffré et le catalogue chiffré, et ajoute quatre archives chiffrées. Le mot de passe existant reste nécessaire.
