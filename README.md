# Portfolio Erwan Prieur — Guide de déploiement

## Structure du projet

```
portfolio-erwan-prieur/
├── index.html              ← La page complète du portfolio
├── style.css                ← Styles généraux (nav, hero, sections, timeline...)
├── projects.css              ← Styles spécifiques aux 3 fiches projets
├── script.js                 ← Animations au scroll, navigation, filtres
├── cv-erwan-prieur.pdf        ← À AJOUTER : ton CV (le bouton "CV →" y pointe déjà)
└── images/
    ├── photo-erwan.jpg        ← À AJOUTER : ta photo professionnelle
    ├── world-of-cars/
    │   ├── logo_world_of_cars.jpg
    │   ├── mockup_appstore.jpg
    │   └── mockup_gameplay_phones.jpg
    ├── foldrink/
    │   ├── logo_foldrink.png
    │   ├── mockup_laptop.jpg
    │   └── site_shop_mission.jpg
    └── rude-wallet/
        ├── logo_rude_wallet.jpg
        ├── singapore_market_stats.jpg
        ├── moodboard.png
        └── user_flow.png
```

## ⚠️ Important : ne jamais séparer les fichiers

Ce site fonctionne uniquement si **tous ces fichiers restent ensemble**, dans cette même
arborescence. Si tu déplaces juste `index.html` sans le reste, les images et le style
ne se chargeront pas.

## Étapes restantes avant mise en ligne

1. **Ajouter ta photo** : renomme ta photo en `photo-erwan.jpg`, place-la dans `images/`,
   puis ouvre `index.html`, trouve la ligne suivante (recherche "EP") et remplace :
   ```html
   <div class="hero-avatar reveal">
     EP
   </div>
   ```
   par :
   ```html
   <div class="hero-avatar reveal">
     <img src="images/photo-erwan.jpg" alt="Erwan Prieur">
   </div>
   ```

2. **Ajouter ton CV** : place ton CV en PDF à la racine du dossier, nommé exactement
   `cv-erwan-prieur.pdf` (ou modifie le `href` du bouton "CV →" dans `index.html` si tu
   préfères un autre nom).

3. **Vérifier le prototype Figma (Rude Wallet)** : confirme que les 3 liens Figma
   utilisés sont bien réglés sur "Anyone with the link can view" avant la mise en ligne
   définitive, sinon l'iframe affichera une erreur aux visiteurs.

## Déployer sur GitHub Pages (gratuit)

1. Crée un compte GitHub si tu n'en as pas : https://github.com
2. Crée un nouveau repository, par exemple nommé `portfolio`
3. Mets tous les fichiers de ce dossier (en gardant la structure) dans le repository
4. Va dans **Settings → Pages**, choisis la branche `main` et le dossier `/ (root)`
5. Ton site sera accessible à une adresse du type `tonpseudo.github.io/portfolio`

## Connecter ton nom de domaine (erwanprieur.fr ou .com)

1. Achète le domaine chez un registrar (OVH, Namecheap, Gandi...)
2. Dans les paramètres DNS du domaine, ajoute :
   - Un enregistrement **A** pointant vers les IP de GitHub Pages :
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Un enregistrement **CNAME** pour `www` pointant vers `tonpseudo.github.io`
3. Dans Settings → Pages de ton repository GitHub, ajoute ton domaine personnalisé
4. Attends la propagation DNS (24h à 48h max), puis active le HTTPS automatique proposé
   par GitHub Pages

## Mettre à jour le contenu plus tard

- Pour ajouter un nouveau projet : duplique la structure d'un `project-block` dans
  `index.html`, crée un nouveau dossier dans `images/`, et ajoute son style (avec un
  préfixe unique, ex. `np-` pour "nouveau projet") dans `projects.css`.
- Pour changer un texte : il est directement dans `index.html`, pas besoin de toucher
  au CSS ou au JS.
