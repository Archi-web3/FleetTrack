# Changelog

## [2.13.0] - 2026-01-31

### 🧠 I.A. & Prévisions Financières (Smart Cost)
- **Prévision Avancée :** Nouveau module capable d'estimer les coûts futurs de la flotte sur **1, 3, 6 et 12 mois**.
- **Algorithme Hybride :** Utilise à la fois l'historique réel (si disponible) et des projections basées sur le kilométrage théorique.
- **Services A, B, C :** Détection automatique des gros services à venir (ex: Courroie à 100k km, Vidange tous les 5k) pour affiner le budget prévisionnel.
- **Marge d'Imprévu :** Intégration d'un buffer de sécurité (10%) pour couvrir les pannes aléatoires.

### ⚙️ Configuration & Flexibilité
- **Coûts Personnalisables :** Nouvelle interface de réglages (Dialog) permettant aux administrateurs de définir le coût standard des Services A, B et C. Ces valeurs sont utilisées comme "fallback" si le véhicule n'a pas assez d'historique.
- **Sélecteur de Durée :** Bascule instantanée entre les horizons temporels (1M, 3M, 6M, 1An) sur le dashboard.

### 📊 Analyse de Fiabilité
- **Score de Fiabilité (MTBF) :** Calcul automatique d'un score (0-100) pour chaque modèle de véhicule (Toyota Land Cruiser vs Hilux, etc.) basé sur la fréquence des pannes.
- **Comparateur :** Classement des modèles les plus fiables et les plus coûteux au kilomètre.

### 🐛 Corrections (Bug Fixes)
- **Calcul "Prochain Service" :** Correction d'un bug majeur où les véhicules d'occasion (ex: 148 000 km) étaient marqués "En retard de 143 000 km" car le système basait son calcul sur 0 km. Le système prend maintenant en compte le kilométrage actuel.

---

## [2.12.1] - 2026-01-31

### 🌍 Internationalisation & Traduction
- **Traduction Complète :** Finalisation de la traduction (Français/Anglais) sur l'ensemble des modules critiques.
    - **Gestion des Véhicules :** Traduction intégrale de la page (Titres, Formulaires, Boutons d'action, Badges de statut).
    - **Consolidation :** Traduction complète du module de regroupement et d'affectation (Titres, Dialogues, Messages).
    - **Menus :** Ajout des clés manquantes pour les menus de navigation (`MENU.CONSOLIDATION`).
- **Correction Dropdowns :** Résolution des incohérences d'accents sur les modes de transport (`AERIEN` vs `AÉRIEN`) qui empêchaient l'affichage correct dans les listes déroulantes de filtre et de formulaire.

### 🗺️ Carte Interactive
- **Filtres Traduits :** Les filtres de la carte (Menu déroulant "Mode Transport") utilisent désormais les clés de traduction dynamiques.
- **Logique de Filtrage :** Mise à jour du moteur de filtrage pour supporter les nouvelles clés de traduction universelles (`ALL`, `ROUTIER`, `AERIEN`, `MARITIME`).

## [2.9.1] - 2026-01-29

### ⚙️ Maintenance & Planning
- **Slots de Maintenance :** Possibilité pour les Superviseurs et Admins de créer des créneaux d'indisponibilité directement dans le planning (Service, Réparation, Check Hebdo) en bloquant un véhicule spécifique.

## [2.9.0] - 2026-01-29

### 📊 Tableau de Bord & Analytics (Dashboard)
- **Nouveaux Indicateurs Avancés :**
    - **Trajets Courts (< 2km) :** Suivi du pourcentage de trajets pouvant potentiellement être remplacés par des mobilités douces.
    - **Kilomètres Mutualisés :** Indicateur de covoiturage et d'optimisation (trajets avec passagers ou multi-projets).
    - **Taux d'Utilisation :** Calcul du taux d'utilisation réel de la flotte par rapport à sa capacité théorique sur la période.
- **KPI Financiers (Roadmap) :** Intégration du Volume Financier dans le calcul de l'Indice d'Activité Pondéré (IAP) pour prioriser le renouvellement des véhicules.

### 🗓️ Planning & Mouvements
- **Nouveau Dashboard Mouvements :** Refonte de la vue "Planning Global". Remplacement de la carte par un tableau de bord dédié avec KPIs (Validés, En cours, En attente) et liste détaillée filtrable.
- **Affichage Code ACF :** Le tableau affiche désormais le Code ACF du véhicule (ex: V-ACF-01) pour une identification plus rapide.
- **Filtre Rapide Carte :** Ajout d'un bouton "Cette Semaine" sur la Carte Interactive pour visualiser instantanément l'activité en cours.

### 🛠️ Améliorations Diverses
- **Optimisation :** Suppression de la carte Google Maps redondante dans l'onglet Planning pour alléger le chargement.

---

## [2.8.0] - 2026-01-27

### ✨ Module Alertes : Inbox & Suppression

#### 📩 e-Logbook (Inbox)
- **Boîte de Réception :** Ajout d'une icône "Enveloppe" dans le bandeau supérieur. Accès à l'historique complet des notifications reçues (lues et non lues).
- **Gestion :** Possibilité pour le chauffeur de supprimer (masquer) une notification de sa liste personnelle.
- **Polling :** Optimisation de la récupération des messages avec un mode "Inbox" dédié.

#### 🔔 Notifications Web Push (App Fermée)
- **Support Service Worker :** Implémentation complète du standard Web Push (VAPID). Les notifications sont désormais reçues sur les tablettes Android même lorsque l'application e-Logbook est fermée ou en arrière-plan.
- **Activation Manuelle :** Ajout d'un bouton "Activer les Notifications" dans l'Inbox pour contourner les blocages de permission des navigateurs modernes.
- **Activation Manuelle :** Ajout d'un bouton "Activer les Notifications" dans l'Inbox pour contourner les blocages de permission des navigateurs modernes.
- **Indicateurs :** Feedback visuel immédiat (Succès/Erreur) lors de l'abonnement.

#### 📧 Communication & Workflow (Validations)
- **Emails Automatiques :** Intégration complète du cycle de notification :
    - **Pour validation :** Alertes envoyées aux Superviseurs Sécurité dès qu'un trajet à risque est créé.
    - **Suivi Demandeur :** Confirmation par email lors de la validation ou du refus (avec motif) du mouvement.
- **Matrice Sécurité :** Le système bloque les mouvements en zone sensible (Orange/Rouge) tant que la validation sécurité n'est pas signée numériquement.

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
