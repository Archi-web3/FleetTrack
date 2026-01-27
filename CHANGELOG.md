# Changelog

## [2.7.0] - 2026-01-27

### ✨ Module Alertes : Inbox & Suppression

#### 📩 e-Logbook (Inbox)
- **Boîte de Réception :** Ajout d'une icône "Enveloppe" dans le bandeau supérieur. Accès à l'historique complet des notifications reçues (lues et non lues).
- **Gestion :** Possibilité pour le chauffeur de supprimer (masquer) une notification de sa liste personnelle.
- **Polling :** Optimisation de la récupération des messages avec un mode "Inbox" dédié.

#### 🔔 Notifications Web Push (App Fermée)
- **Support Service Worker :** Implémentation complète du standard Web Push (VAPID). Les notifications sont désormais reçues sur les tablettes Android même lorsque l'application e-Logbook est fermée ou en arrière-plan.
- **Activation Manuelle :** Ajout d'un bouton "Activer les Notifications" dans l'Inbox pour contourner les blocages de permission des navigateurs modernes.
- **Indicateurs :** Feedback visuel immédiat (Succès/Erreur) lors de l'abonnement.

#### 🗑️ FleetTrack (Admin)
- **Suppression Définitive :** Ajout d'un bouton "Supprimer" dans l'historique des alertes. Cette action supprime définitivement l'alerte de la base de données (et donc de toutes les tablettes).
- **Tableau de Bord :** Ajout d'une colonne "Action" pour gérer les suppressions.

#### 🛡️ Renforcement Sécurité & Conformité
- **Protection Backend 3.0 :** Déploiement du triptyque de sécurité :
    1.  **Strict CORS :** Restriction des accès API aux seules origines officielles (Vercel).
    2.  **Rate Limiter :** Protection anti-BruteForce (Max 300 requêtes/15min par IP).
    3.  **Helmet :** Sécurisation des headers HTTP (XSS, Sniffing).
- **Transparence UI :** Nouvel onglet "Sécurité & Confidentialité" dans le menu "Vision & Sécurité". Vulgarisation des protocoles techniques (JWT, Chiffrement, RBAC) pour les utilisateurs finaux.
- **Documentation :** Mise à jour majeure du Guide Utilisateur (v2.7) intégrant l'explication de l'architecture Multi-Pays et la portée des rôles.

---

## [2.6.0] - 2026-01-25

### ✨ Module 2 : Gestion Avancée & Sécurité

#### ✈️ Modes de Transport (Air & Mer)
- **Nouveaux Modes :** Support complet pour les trajets Aériens (Avion, UNHAS) et Maritimes (Bateau, Speedboat).
- **Workflow Dédié :** Création simplifiée (pas d'affectation véhicule/chauffeur). Workflow de clôture manuelle spécifique.
- **Statistiques Séparées :**
    - **Dashboard :** Nouvelles cartes dédiées "Aérien" et "Maritime".
    - **KPI CO2 :** Distinction claire entre "CO2 Total (Flotte Routière)" et "CO2 Aérien". Le KPI principal n'affiche QUE la flotte routière (demande utilisateur).
    - **Carte CO2 Aérien :** Calcul automatique basé sur la distance (Haversine) et les facteurs d'émission ADEME (Courte/Moyenne/Longue distance).

#### 🛡️ Sécurité & Validation
- **Matrice de Validation :** Le système vérifie désormais le "Niveau de Sécurité" du trajet (basé sur la couleur des lieux : Vert/Jaune/Orange/Rouge) par rapport au niveau d'habitation de l'utilisateur.
- **Workflow Intelligent :** Un trajet "Rouge" ou "Orange" nécessite une validation par un Superviseur Sécurité habilité.
- **Traçabilité :** Historique complet des validations (Qui, Quand, Niveau).

#### 💰 Gestion Financière (Multi-Projets)
- **Ventilation Automatique :** Lors de la création d'un mouvement, le coût est réparti automatiquement (en %) selon les codes projets des passagers à bord.
- **Correction Manuelle :** Possibilité de modifier la ventilation (Projet/Pourcentage) dans le formulaire de modification.

### 🛠️ Corrections & Améliorations (Fixes & Improvements)

#### 🗺️ Visualisation Carte (Logbook)
- **Fix "Trajet Planifié" :** Correction d'un bug où la ligne bleue (trajet théorique) ne s'affichait pas. Le système gère maintenant correctement tous les formats de coordonnées GPS.
- **Légende :** Ajout d'une légende claire (Bleu = Planifié, Rouge = Réel).

#### 🎨 UX / UI
- **Lisibilité :** Fond blanc forcé sur tous les menus déroulants et champs de texte (suppression de la transparence) pour une meilleure lecture sur Gestion des Déplacements et e-Logbook.
- **Icônes :** Ajout d'icônes distinctives (Avion, Bateau, Voiture) dans la liste "Mes Mouvements".

#### 🐛 Bugs Corrigés
- **Stats Globales à 0 :** Correction d'un problème d'agrégation MongoDB qui renvoyait des compteurs à 0.
- **Persistance des Dates :** Correction d'un bug où la modification d'une date de mouvement était écrasée par le serveur.
- **Calcul CO2 Aérien :** Correction d'un crash serveur dû à une fonction manquante (`calculateDistance`).

---

## [Unreleased] - 2026-01-24

### ✨ Nouvelles Fonctionnalités (New Features)

#### 📱 Mobile App (e-Logbook)
- **Traceur GPS "Boîte Noire" :** Enregistrement automatique des données GPS (Position, Vitesse, Précision) tout au long du trajet si le véhicule est configuré avec l'option "Tracking GPS".
- **Départ Position Actuelle :** Ajout de la case à cocher "Utiliser ma position actuelle (Hors-site)" dans le formulaire de départ. Désactive le sélecteur de lieu pour permettre un départ depuis n'importe où.
- **Annulation de Trajet :** Nouveau bouton "Annuler ce trajet (Erreur)" pour supprimer un trajet en cours sans l'enregistrer (utile en cas de fausse manipulation).
- **Indicateurs Visuels :** Icône Satellite (Vert/Orange) et compteur de points GPS en temps réel sur l'écran de trajet actif.
- **Logique Kilométrage (Fix) :** Amélioration de la suggestion du kilométrage de départ (`getLastMileage`). Prend désormais le **MAX** des 10 derniers trajets pour éviter les blocages dus à des erreurs de date (trajets futurs).

#### 🖥️ Web Dashboard (Gestion des Déplacements)
- **Visualisation Carte 🗺️ :** Ajout d'un bouton "Carte" dans l'historique des trajets.
- **Comparaison de Trajet :** Affichage superposé du tracé réel (Ligne Rouge) et du tracé théorique/planifié (Ligne Bleue).
- **Configuration Véhicule :** Ajout de l'option "Activer GPS" dans l'administration des véhicules.

#### ⚙️ Backend & Analyse
- **Analyse de Trace :** Réception et stockage des traces GPS complètes (`gpsTrace`) lors de la synchronisation.
- **Calcul de Distance :** Implémentation de la formule de Haversine pour calculer la distance réelle parcourue.
- **Détection de Déviation :** Le système flaggue automatiquement une "Déviation GPS" si `(Distance GPS - Distance Compteur) > 15%` (ou 5km).

### 🐛 Corrections (Bug Fixes)
- **Synchro :** Correction d'un bug où la trace GPS n'était pas envoyée au serveur.
- **Offline Service :** Correction du tri des trajets (Tri manuel JS vs Dexie) pour garantir la récupération du dernier kilométrage, même avec des dates incohérentes.
