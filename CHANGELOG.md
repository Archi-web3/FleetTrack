# Changelog

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
