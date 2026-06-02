# Instructions de Diagnostic

## Problème
Les lieux créés par resp_log_bunia n'ont pas de pays/base assignés et ne sont donc pas visibles.

## Logs Ajoutés
J'ai ajouté des logs de débogage dans :
1. `auth.service.ts` - Pour voir ce que contient le token JWT
2. `gestion-lieux.component.ts` - Pour voir les valeurs récupérées

## Étapes de Diagnostic

### 1. Rafraîchir l'Application
- Appuyez sur Ctrl+F5 pour forcer le rechargement
- Attendez que l'application Angular recompile

### 2. Ouvrir la Console
- Appuyez sur F12
- Allez dans l'onglet "Console"

### 3. Se Connecter
- Utilisateur : `resp_log_bunia@acf-rdc.org`
- Mot de passe : `123456`

### 4. Observer les Logs au Login
Vous devriez voir dans la console :
```
=== DEBUG AUTH SERVICE ===
Token décodé: { ... }
Pays du token: { id: '...', nom: 'RDC', ... }
Base du token: { id: '...', nom: 'Bunia' }
_userPaysId défini à: [un ID]
_userBaseId défini à: [un ID]
```

### 5. Aller dans Gestion Lieux
Vous devriez voir :
```
=== DEBUG GESTION LIEUX ===
userProfile: Superviseur
userPaysId: [un ID ou null]
userBaseId: [un ID ou null]
newLieu.pays assigné: [un ID ou null]
newLieu.base assigné: [un ID ou null]
```

## Informations à Me Fournir
Copiez-moi TOUS les logs qui commencent par "=== DEBUG" depuis le login jusqu'à l'ouverture de Gestion Lieux.

## Ce Que Je Vais Vérifier
- Si le token contient bien les informations pays/base
- Si les BehaviorSubjects sont bien initialisés
- Si getUserPaysId() et getUserBaseId() retournent les bonnes valeurs
- Pourquoi newLieu.pays et newLieu.base sont null

## Solution Attendue
Une fois le diagnostic fait, je pourrai :
- Corriger le problème de récupération des IDs
- Ou proposer une solution alternative (assignation côté backend)
