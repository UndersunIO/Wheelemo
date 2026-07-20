# SupraLearning Design System

Ce dossier constitue la source de vérité visuelle de l’écosystème. Il est
autonome et peut être copié dans un autre produit sans modifier les composants.

## Architecture

- `tokens.css` contient l’identité commune, les thèmes produits, les espacements,
  la typographie, les surfaces, la profondeur et le mouvement.
- `components.css` applique ces décisions aux primitives d’interface.
- `index.jsx` fournit les composants React et leurs comportements accessibles ;
  `index.js` reste le point d'entrée stable du dossier.

Les pages applicatives peuvent composer ces primitives, mais ne doivent pas
recréer leur fond, leur bordure, leur rayon, leur ombre ou leur transition.

## Installation

1. Importer `tokens.css` une seule fois au niveau de l’application.
2. Importer les composants depuis `index.js`.
3. Placer `data-supra-product` sur le conteneur racine.

```jsx
<div data-supra-product="devlab101">
  <App />
</div>
```

## Thèmes produits

| Produit | Attribut | Accent |
| --- | --- | --- |
| SupraLearning | `supralearning` | `#2F9CFF` |
| SupraLab AI | `supralab-ai` | `#FF5A5A` |
| DevLab101 | `devlab101` | `#00D1FF` |
| FlashLearning | `flashlearning` | `#FF9F1C` |
| FeelFlow | `feelflow` | `#2DD4BF` |

Le thème commun reste inchangé. Seule la variable `--sl-accent` est remplacée
par le sélecteur produit. Une nouvelle application doit donc commencer par
choisir un accent, jamais par dupliquer le thème.

## Contrat visuel

- Fond principal : `--sl-bg-primary` (`#030711`).
- Surface secondaire : `--sl-bg-secondary` (`rgb(7, 15, 23)`).
- Rayon de composant : `--sl-radius` (`12px`).
- Espacements : exclusivement `4, 8, 12, 16, 24, 32, 48, 64px`.
- Mouvement : `220ms` avec `--sl-ease` et suppression automatique si
  `prefers-reduced-motion` est actif.
- Valeurs techniques : `--sl-font-mono` (IBM Plex Mono).
- Contenu et titres : `--sl-font-sans` (Manrope).

`--sl-text-muted` reprend la valeur discrète de la charte et reste réservé aux
états décoratifs ou désactivés. Les petits libellés utilisent
`--sl-text-subtle`, dont le contraste satisfait le niveau AA.

## Composants

`Button`, `Card`, `Input`, `Modal`, `Tooltip`, `Badge`, `ProgressBar`, `Navbar`,
`Sidebar`, `Tabs`, `Accordion`, `Callout`, `Alert` et `Toast` partagent les mêmes
tokens de forme, espacement, profondeur et mouvement.

```jsx
import {Badge, Button, Card, ProgressBar} from './design-system';

<Card as="article" interactive>
  <Badge>Nouveau module</Badge>
  <h2>Comprendre les promesses</h2>
  <ProgressBar label="Progression" value={40} />
  <Button variant="primary">Continuer</Button>
</Card>
```

## Règles de composition

1. Chercher une primitive existante avant de créer une classe.
2. Employer uniquement les tokens `--sl-*` dans un style de page.
3. Utiliser l’accent pour l’action, l’état actif ou le repère pédagogique —
   jamais comme décoration gratuite.
4. Préserver une cible tactile de 44 px pour toute action principale.
5. Donner à chaque état asynchrone une réponse visible : progression, alerte ou
   toast.
6. Conserver une seule action principale par zone de décision.

Les composants interactifs fournissent les rôles ARIA utiles, des états clavier
visibles et une réduction du mouvement. Le `Modal` ferme avec Échap, restaure le
focus et maintient la navigation clavier dans la boîte de dialogue. Les `Tabs`
répondent aux flèches, à Début et à Fin.

## Checklist avant livraison

- Aucun débordement horizontal entre 320 px et l’ultra-wide.
- Contraste AA pour le texte et les états de focus.
- Ordre de tabulation identique à l’ordre visuel.
- Libellé explicite pour chaque action et chaque champ.
- État actif visible dans la navigation, les onglets et les parcours.
- Prochaine étape identifiable dans chaque écran pédagogique.
