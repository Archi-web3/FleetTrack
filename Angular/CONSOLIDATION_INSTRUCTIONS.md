# Instructions pour finaliser la consolidation

## Fichier à modifier manuellement

**Fichier** : `gestion-des-deplacements/src/app/consolidation-mouvements/consolidation-mouvements.component.html`

**Action** : Insérer le contenu du fichier `consolidation-dialog-snippet.html` après la ligne 48 (après `\u003c/div\u003e` qui ferme le formulaire d'affectation).

## Emplacement exact

Chercher cette ligne dans le fichier HTML :
```html
    \u003c/ul\u003e
  \u003c/div\u003e


  \u003c!-- Liste des mouvements validés en attente d'affectation --\u003e
```

Insérer le contenu de `consolidation-dialog-snippet.html` entre `\u003c/div\u003e` et `\u003c!-- Liste des mouvements validés...`

## Modifications déjà appliquées

✅ Backend model (`mouvement.model.js`) - Ajout du champ `originMouvement` dans `stopSchema`
✅ TypeScript component (`consolidation-mouvements.component.ts`) - Ajout de toute la logique de consolidation
❌ HTML template - À finaliser manuellement

## Alternative rapide

Si vous préférez, vous pouvez simplement copier-coller le contenu de `consolidation-dialog-snippet.html` à la ligne 49 du fichier `consolidation-mouvements.component.html`.
