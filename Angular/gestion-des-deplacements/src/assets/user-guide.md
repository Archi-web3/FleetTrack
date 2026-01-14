# 📖 Guide Utilisateur FleetTrack (ACF)

**Version 2.2 - Janvier 2026**

---

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Accès aux Applications](#accès-aux-applications)
3. [Interface Web : Gestion des Déplacements & Flotte](#interface-web-de-gestion)
   - 3.1 [Planning & Mouvements](#32-planning-global)
   - 3.2 [Gestion des Véhicules](#33-gestion-des-véhicules)
   - 3.3 [Gestion de la Maintenance](#33-gestion-de-la-maintenance-nouveau)
4. [E-Logbook Mobile : Chauffeurs & Techniciens](#e-logbook-mobile-pwa)
   - 4.1 [Utilisation Quotidienne](#42-menu-principal)
   - 4.2 [Services Programmés (Maintenance)](#48-services-programmés-maintenance)
5. [FAQ et Dépannage](#faq-et-dépannage)

---

## 1. Introduction

FleetTrack est la solution de gestion de flotte optimisée pour ACF, comprenant :

- **Interface Web (Admin/Garage)** : Pour gérer les véhicules, planifier les mouvements et configurer la maintenance.
- **E-Logbook Mobile (Chauffeur)** : Carnet de bord numérique pour les trajets, pleins de carburant et exécution des services de maintenance.

---

## 2. Accès aux Applications

### 🌐 Interface Web (Administrateurs & Gestionnaires)
**URL** : https://fleettrack-web.vercel.app  
**Navigateurs** : Chrome (recommandé), Firefox, Edge.

### 📱 E-Logbook Mobile (Chauffeurs)
**URL** : https://fleettrack-mobile.vercel.app  
**Installation** : Ouvrez l'URL sur votre téléphone et choisissez "Ajouter à l'écran d'accueil" pour l'utiliser comme une application native.

---

## 3. Interface Web de Gestion

### 3.1 Gestion des Mouvements
(Voir sections précédentes pour Planning Global et Mes Mouvements)

### 3.2 Gestion des Véhicules
Gérez votre flotte et suivez l'état des véhicules.

**Nouveau : Kilométrage Initial**
Lors de l'ajout d'un véhicule, le champ **Kilométrage Initial** est crucial. Il définit le point de départ du compteur. 
> [!NOTE]
> Si vous modifiez le kilométrage initial et qu'aucun trajet n'a encore été effectué, le kilométrage actuel du véhicule sera automatiquement ajusté pour correspondre.

### 3.3 Gestion de la Maintenance (NOUVEAU)

Un module complet pour gérer la maintenance préventive.

#### 🛠️ Templates de Service
Configurez les listes de tâches pour chaque type de maintenance (Service A, B, C, etc.).

1. Aller dans **Maintenance > Templates**.
2. **Créer/Modifier un Template** :
   - Définissez le nom et le type (ex: Service A).
   - **Ajouter des tâches** : Pour chaque tâche, spécifiez :
     - La catégorie (Moteur, Freins, etc.).
     - La description.
     - **N° Page Manuel** : Le numéro de la page du manuel PDF de référence (ex: "7"). 
     *Ceci permettra au chauffeur d'ouvrir directement la bonne page du manuel sur son mobile.*

#### 📅 Suivi des Services
Visualisez l'état de santé de la flotte :
- **Prochain Service** : Kilométrage restant avant la prochaine échéance.
- **Alertes** : Services en retard ou imminents.
- **Checklists Hebdo** : Suivi de la réalisation des contrôles hebdomadaires.

---

## 4. E-Logbook Mobile (PWA)

### 4.1 Utilisation Quotidienne
- **Sélection Véhicule** : Choisissez votre véhicule au démarrage.
- **Trajets** : Démarrez et arrêtez vos trajets (le kilométrage est synchronisé automatiquement).
- **Checklist Hebdomadaire** : Effectuez vos contrôles réguliers directement dans l'application.

### 4.2 Services Programmés (Maintenance)

Lorsque qu'un véhicule atteint l'échéance d'un service (ex: tous les 5000 km), le chauffeur ou le mécanicien doit effectuer le service via l'application.

**Procédure d'exécution d'un service :**

1. Ouvrir le menu **"Maintenance" > "Services Programmés"**.
2. Vous verrez le service à effectuer (ex: "Service A à 150 000 km").
3. Cliquer sur le service pour voir la **Liste des Tâches**.

**Exécution des tâches :**
- La liste affiche toutes les tâches à vérifier (ex: "Vérifier niveau d'huile").
- **Cocher** une tâche une fois réalisée. L'avancement est sauvegardé automatiquement (ex: "5/24 tâches complétées").
- **Besoin d'aide ?** Cliquez sur l'icône livre 📖 à droite d'une tâche.
  - Cela ouvrira le **Manuel Atelier (PDF)** directement à la page concernée (ex: Page 7 pour les fuites).
  - Vous pouvez zoomer et naviguer dans le manuel.

**Validation du Service :**
- Une fois TOUTES les tâches cochées, le bouton **"Valider le Service"** s'active.
- Cliquez pour valider. Le compteur de maintenance du véhicule sera mis à jour et le prochain service sera programmé.

---

## 5. FAQ Mises à jour

**Q : Le manuel PDF ne s'ouvre pas à la bonne page ?**
R : Assurez-vous que le "N° Page Manuel" est bien renseigné dans le Template de maintenance sur l'interface Web (juste le chiffre, ex: "7").

**Q : J'ai changé le compteur initial mais le km actuel ne change pas ?**
R : Le système corrige automatiquement le km actuel SEULEMENT si aucun trajet n'a été enregistré. Si le véhicule a déjà roulé, le système respecte l'historique. Contactez un administrateur pour une correction manuelle si nécessaire.

**Q : Mes tâches validées ont disparu ?**
R : Les tâches sont sauvegardées en temps réel. Assurez-vous d'avoir une connexion internet pour que la synchronisation se fasse vers le serveur.

---
**© 2026 FleetTrack ACF **
