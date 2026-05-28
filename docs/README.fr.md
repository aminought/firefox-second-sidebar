[English](../README.md) | **Français**

Un script Firefox userChrome.js qui apporte une deuxième barre latérale avec des panneaux web comme dans Vivaldi/Edge/Floorp, mais en mieux.

<img width="2200" height="2131" alt="promo-rounded" src="https://github.com/user-attachments/assets/020ee8cf-1f3d-4184-98fe-889be89d6145" />

## Motivation

J'ai essayé divers navigateurs, comme Vivaldi, Edge, Floorp et Zen, et ils ont tous un point commun sans lequel je ne peux imaginer utiliser un navigateur — la barre latérale. Malheureusement, Firefox, qui correspond le mieux à mes besoins, a une barre latérale plutôt insatisfaisante. J'ai donc décidé d'en créer une moi-même, avec du blackjack et des hôtesses !

## Demo

https://github.com/user-attachments/assets/cd79d644-ca2c-4a30-ae8e-c265f41768b6

## Fonctionnalités

### Barre latérale

- Actions : `Afficher` • `Masquer`
- Personnaliser via [Personnaliser la barre d'outils...](https://support.mozilla.org/fr/kb/customize-firefox-controls-buttons-and-toolbars)
- Paramètres :
  - Général : `Position (Gauche / Droite)` • `Largeur`
  - Visibilité : `Masquer automatiquement la barre latérale` • `Comportement de masquage automatique (En ligne / Superposition)` • `Masquer le panneau web quand la barre latérale est masquée` • `Raccourci pour masquer/afficher la barre latérale`
  - Panneau web : `Décalage par défaut du panneau flottant` • `Position du nouveau panneau (Avant le bouton plus / Après le bouton plus)` • `Afficher l'indicateur de géométrie`
  - Bouton du panneau web : `Indicateur de conteneur (Désactivé / Gauche / Droite / Haut / Bas / Tout autour)` • `Info-bulle (Désactivé / Titre / URL / Titre et URL)` • `Afficher l'URL complète dans l'info-bulle`
  - Barre d'outils du panneau web : `Masquer automatiquement le bouton suivant` • `Masquer automatiquement le bouton précédent`
  - Animations : `Animer la barre latérale` • `Animer la barre d'outils du panneau web`

### Panneaux web

- Actions : `Créer` • `Supprimer` • `Modifier` • `Changer la position et la taille` • `Réinitialiser la position et la taille` • `Décharger` • `Mettre en sourdine` • `Réactiver le son` • `Épingler` • `Détacher` • `Changer le zoom` • `Précédent` • `Suivant` • `Recharger` • `Accueil`
- Prise en charge des extensions
- Prise en charge des notifications popup (permissions microphone/caméra/localisation, etc.)
- Paramètres :
  - Général : `URL` • `Conteneur multi-comptes` • `Temporaire` • `Vue mobile` • `Zoom`
  - Titre : `Dynamique` • `Définir un titre statique`
  - Favicon : `Dynamique` • `Définir un favicon statique`
  - Position et taille : `Mode (Flottant / Épinglé)` • `Toujours au premier plan` • `Ancre de position` • `Décalage horizontal` • `Décalage vertical` • `Largeur` • `Hauteur`
  - Chargement : `Charger en mémoire au démarrage` • `Restaurer la dernière page ouverte` • `Décharger de la mémoire après fermeture` • `Rechargement périodique`
  - Raccourci clavier : `Raccourci pour masquer/afficher le panneau web`
  - Sélecteur CSS : `Activer` • `Définir le sélecteur CSS`
  - Masquer les éléments : `Masquer la barre d'outils` • `Masquer l'icône son` • `Masquer le badge de notification`

### Widgets

- `Deuxième barre latérale` pour afficher / masquer la barre latérale

## Installation

### Installation en un clic (Windows, recommandé)

Ouvrir PowerShell en tant qu'**administrateur** et exécuter :

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/install.ps1 | iex
```

Le script effectuera automatiquement :

1. Télécharger fx-autoconfig et Second Sidebar depuis GitHub
2. Détecter le répertoire d'installation Firefox et le dossier de profil
3. Installer les fichiers programme et de profil fx-autoconfig
4. Installer le script Second Sidebar
5. Vérifier l'installation

> **Privilèges administrateur** : Le `config.js` de fx-autoconfig doit être copié dans `C:\Program Files\Mozilla Firefox\`, ce qui nécessite des privilèges administrateur.

**Désinstallation :**

```powershell
irm https://raw.githubusercontent.com/aminought/firefox-second-sidebar/master/uninstall.ps1 | iex
```

### Installation manuelle

1. Installer [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig).
2. Copier le contenu du répertoire `src/` (`second_sidebar/` et `second_sidebar.uc.mjs`) dans `chrome/JS/`.
3. Activer `toolkit.legacyUserProfileCustomizations.stylesheets` et `dom.allow_scripts_to_close_windows` dans `about:config`.
4. [Vider](https://github.com/MrOtherGuy/fx-autoconfig?tab=readme-ov-file#deleting-startup-cache) le cache de démarrage.
5. Profitez !

## Localisation

Le script prend en charge plusieurs langues et affiche automatiquement l'interface dans la langue de Firefox.

### Ajouter une nouvelle langue

1. Copier `en-US.mjs` dans un nouveau fichier (ex : `it.mjs`)
2. Remplacer les valeurs anglaises par des traductions (ne pas modifier les clés)
3. Importer et enregistrer la nouvelle langue dans `index.mjs`
4. Soumettre un PR
