# Assistant documentaire

Cette branche ajoute `/assistant/` et `/en/assistant/` au site Astro, une recherche locale et un relais Cloudflare Workers pour l'API Responses. Aucun appel payant n'est activé. Le corpus livré est vide : seules les fiches exportées après validation pourront y être ajoutées. Les PDF et les registres privés ne doivent jamais entrer dans ce dépôt public.

## Corpus et rédaction

La préparation reste dans le dossier documentaire privé. Exécuter son exportateur après relecture scientifique et clôture des conditions de droits, puis importer **uniquement** `export_public/corpus.json` avec :

    node assistant/import-corpus.mjs CHEMIN_ABSOLU_EXPORT_PUBLIC_CORPUS_JSON
    npm run test:assistant
    npm run build

L'import vérifie le schéma public, les identifiants, les DOI et l'absence de champs privés. Il ne se substitue pas au registre d'approbation. Chaque changement de corpus doit passer par une PR : vérifier les crédits, liens de licence et dates. Le même fichier est utilisé par la page et embarqué dans le Worker ; redéployer les deux ensemble. Pour retirer une fiche, désactiver d'abord l'IA, exporter sans cette fiche, redéployer le Worker et le site, puis réactiver. Une page déjà ouverte peut conserver une ancienne copie publique.

Les résultats sont sélectionnés lexicalement, avec inclusion des fiches explicitement liées quand elles sont disponibles. Pas d'embeddings, de téléversement de fichier ou de base vectorielle distante. L'affichage utilise `textContent`, jamais du HTML généré. Les références de réponse doivent appartenir aux fiches sélectionnées. Ce contrôle ne prouve pas la justesse scientifique de chaque phrase : une évaluation éditoriale reste nécessaire.

## Budget global de 5 USD par mois

Le service s'arrête à **4,50 USD de réservations**, tous visiteurs confondus. Il conserve 0,50 USD de marge. Chaque tentative réserve le coût maximal avant le réseau, dans un unique Durable Object SQLite. Aucune restitution sur erreur, aucune relance automatique. La réservation utilise le plafond total de tokens d'entrée du modèle, même pour une question courte, et 600 tokens de sortie : elle est volontairement conservatrice.

Configurer les prix standard d'entrée et de sortie, sans réduction de cache, et un identifiant de modèle figé. Vérifier que `MODEL_INPUT_TOKEN_CEILING` couvre réellement toute entrée acceptée par ce modèle, et que le tarif de sortie couvre les tokens de raisonnement éventuels. Les tarifs et le modèle restent vides tant que ces éléments ne sont pas établis. Aucun outil facturable supplémentaire n'est envoyé. Les prix doivent être revérifiés à chaque renouvellement mensuel.

Le registre doit être initialisé explicitement pour le mois UTC courant. Il ne se recrée pas automatiquement si l'état disparaît. L'initialisation échoue si le mois existe déjà. Le champ `alreadyReservedMicroUsd` inclut toute dépense déjà engagée ailleurs pour ce service (essais, rédaction, etc.). Une clé dédiée ne doit être utilisée par aucun autre programme : ces appels ne seraient pas contrôlés par ce registre. Ne jamais supprimer le registre, changer le nom de l'objet, multiplier les déploiements actifs ou restaurer un ancien état pour libérer du quota. Désactiver le service et réconcilier la facturation en cas d'incident de stockage.

L'IA est désactivée cinq minutes autour du changement de mois UTC, puis reste bloquée tant que `APPROVED_MONTH` et le nouveau registre n'ont pas été préparés après rapprochement de facturation. La recherche locale reste disponible. Une limite globale d'un appel toutes les dix secondes réduit les rafales ; CORS n'est pas une authentification et un tiers peut épuiser le quota. Prévoir une protection supplémentaire si nécessaire avant une ouverture large.

Configurer également une limite stricte de projet OpenAI à 5 USD. La documentation OpenAI précise que l'application de cette limite peut être légèrement différée : ce n'est pas à elle seule une garantie absolue de facture. Le contrôle applicatif suppose des tarifs exacts, une seule clé dédiée et un registre intact. Les taxes et frais de conversion ne sont pas compris dans ce budget de consommation API. L'hébergement doit rester sur l'offre Cloudflare Free, sans activation d'un forfait payant.

## Activation, après levée des conditions

1. Créer le compte Cloudflare Free. Vérifier les conditions du fournisseur, les traitements et journaux effectifs, les pays de traitement et l'information des visiteurs.
2. Utiliser l'API standard : ZDR n'est plus un prérequis pour le corpus limité aux fiches validées et contenus autorisés. Vérifier les conditions du compte et désactiver le partage volontaire pour l'entraînement. Compléter l'information des visiteurs (exploitant/contact, finalité, base légale, destinataires, durées et droits) et les conditions du relais. `LEGAL_REVIEW_CONFIRMED` confirme ce périmètre et ces éléments ; il ne certifie pas ZDR. La préparation à partir d'articles protégés reste une question distincte.
3. Wrangler 4.141.0 a été utilisé pour la vérification en mode simulation. Déployer `assistant/wrangler.jsonc` avec l'IA désactivée et la migration SQLite. Aucun déploiement Cloudflare automatique n'est inclus dans GitHub Actions.
4. Ajouter `OPENAI_API_KEY` et un `ADMIN_TOKEN` aléatoire d'au moins 32 caractères avec `wrangler secret put`, jamais dans le navigateur, un fichier versionné ou une discussion. Utiliser un projet OpenAI dédié avec limite stricte.
5. Renseigner le modèle figé, son plafond d'entrée, les tarifs et le mois. Depuis un poste d'administration, appeler `POST /admin/initialize` avec `Authorization: Bearer <ADMIN_TOKEN>` et un JSON `{"month":"AAAA-MM","alreadyReservedMicroUsd":0}` en remplaçant zéro par le montant conservateur déjà engagé. Ne jamais mettre ce jeton dans un script public.
6. Vérifier le corpus final et les tests locaux. Activer les trois indicateurs de configuration après décision documentée et effectuer un essai réel comptabilisé. Puis configurer `PUBLIC_ASSISTANT_URL=https://VOTRE_WORKER.workers.dev/ask` lors de la construction Astro.

Sans URL publique, la page reste en recherche locale. Sans corpus validé, elle affiche « corpus en préparation ». Aucune question n'est enregistrée par le code ; la base ne contient que le mois, un montant réservé et l'heure du dernier appel. L'observabilité Workers est désactivée dans la configuration. Cela ne démontre pas l'absence de tout journal fournisseur : la configuration et les contrats doivent être vérifiés.

## Vérification

`npm run test:assistant` teste la réservation dans une vraie base SQLite, l'épuisement du budget, les appels concurrents, les blocages de configuration, les références inconnues, les réponses incomplètes et l'absence de relance. Les appels OpenAI sont simulés. Tester également le Worker dans le runtime Cloudflare, puis les parcours navigateur et les limites éditoriales avant activation. Une tentative de reconstitution peut contourner une simple règle textuelle ; le corpus exclusivement composé de fiches est la barrière principale.

Sources techniques consultées le 27 septembre 2026 :

- [Conservation des données OpenAI](https://developers.openai.com/api/docs/guides/your-data)
- [Limites de dépenses OpenAI](https://developers.openai.com/api/docs/guides/spend-limits)
- [Génération de texte](https://developers.openai.com/api/docs/guides/text)
- [Transactions SQLite Durable Objects](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)
- [Tarification Workers](https://developers.cloudflare.com/workers/platform/pricing/)
- [Tarification Durable Objects](https://developers.cloudflare.com/durable-objects/platform/pricing/)
