# 📖 Guide Utilisateur FleetTrack (ACF)

**Version 2.3 - Janvier 2026**

---

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Accès aux Applications](#accès-aux-applications)
3. [Interface Web de Gestion](#interface-web-de-gestion)
   - [Planning Global](#31-planning-global)
   - [Mes Mouvements](#32-mes-mouvements)
   - [Gestion des Véhicules](#33-gestion-des-véhicules)
   - [Gestion de la Maintenance](#34-gestion-de-la-maintenance-nouveau)
   - [Récapitulatif & Admin](#35-récapitulatif-de-la-flotte)
4. [E-Logbook Mobile (PWA)](#e-logbook-mobile-pwa)
   - [Utilisation Quotidienne](#41-sélection-du-véhicule)
   - [Services Programmés](#46-services-programmés-maintenance)
5. [FAQ et Dépannage](#faq-et-dépannage)

---

## 1. Introduction

FleetTrack est la solution de gestion de flotte optimisée pour ACF, comprenant :

- **Interface Web (Admin/Garage)** : Pour gérer les véhicules, planifier les mouvements et configurer la maintenance.
- **E-Logbook Mobile (Chauffeur)** : Carnet de bord numérique pour les trajets, pleins de carburant et exécution des services de maintenance.

| Rôle | Accès | Description |
|------|-------|-------------|
| **Super Admin** | Interface Web | Gestion complète : pays, bases, utilisateurs, véhicules |
| **Admin** | Interface Web | Gestion de sa base : utilisateurs, véhicules, mouvements |
| **Gestionnaire** | Interface Web | Consultation et création de mouvements |
| **Chauffeur** | E-Logbook Mobile | Enregistrement des trajets, carburant, incidents |
| **Technicien** | E-Logbook Mobile | Maintenance des véhicules |

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

### 3.1 Planning Global

Le planning permet de visualiser tous les mouvements planifiés sur un calendrier.

**Fonctionnalités** :
- ✅ Vue calendrier mensuelle
- ✅ Filtrage par pays/base
- ✅ Création rapide de mouvements
- ✅ Modification par glisser-déposer

**Actions** :
1. **Créer un mouvement** : Cliquer sur une date
2. **Modifier** : Cliquer sur un mouvement existant
3. **Filtrer** : Utiliser les filtres en haut de page

### 3.2 Mes Mouvements

Consultez et gérez vos demandes de mouvements.

**Créer une demande de mouvement** :
1. Cliquer sur **"+ Nouvelle Demande"**
2. Remplir le formulaire (Projet, Date, Itinéraire, Passagers, Motif)
3. Cliquer sur **"Soumettre"**

**Statuts** : 🟡 En attente, 🟢 Validé, 🔵 En cours, ✅ Terminé, ❌ Annulé.

### 3.3 Gestion des Véhicules

Gérez l'ensemble de votre flotte automobile.

**Fonctionnalités** :
- Liste complète et suivi de l'état (disponible, en mission, en maintenance)
- Ajout/Modification de véhicules

**Nouveau : Kilométrage Initial**
Lors de l'ajout d'un véhicule, le champ **Kilométrage Initial** est crucial.
> [!NOTE]
> Si vous modifiez le kilométrage initial et qu'aucun trajet n'a encore été effectué, le kilométrage actuel du véhicule sera automatiquement ajusté.

### 3.4 Gestion de la Maintenance (NOUVEAU)

Un module complet pour gérer la maintenance préventive.

#### 🛠️ Templates de Service
Configurez les listes de tâches pour chaque type de maintenance (Service A, B, C, etc.).

1. Aller dans **Maintenance > Templates**.
2. **Créer/Modifier un Template** :
   - Définissez le nom, le type et les tâches.
   - **Important** : Renseignez le **"N° Page Manuel"** pour chaque tâche (le numéro de la page du PDF associé).

#### 📅 Suivi des Services
Visualisez l'état de santé de la flotte (Prochain service, Alertes, Checklists Hebdo).

### 3.5 Récapitulatif de la Flotte

Vue d'ensemble avec indicateurs clés :
- 📊 Nombre total de véhicules
- 🚗 Véhicules disponibles / 🔧 En maintenance / 🚙 En mission

### 3.6 Administration
*(Réservé aux Admin)* : Gestion Utilisateurs, Bases, Projets, Lieux, Rapports.

---

## 4. E-Logbook Mobile (PWA)

### 4.1 Sélection du Véhicule
Au premier lancement, sélectionnez votre véhicule. Vous pouvez le changer via le menu Paramètres.

### 4.2 Menu Principal
- **📅 Mon Planning** : Vos missions assignées.
- **🚗 Trajet Actif** : Démarrer/Arrêter un trajet.
- **📋 Mes Trajets** : Historique.
- **⛽ Carburant** : Saisie des pleins.
- **🔧 Maintenance** : Services programmés et maintenances correctives.
- **⚠️ Incidents** : Déclaration d'accidents/pannes.

### 4.3 Mon Planning
1. Sélectionner une mission.
2. Cliquer sur **"Prendre en charge"**.
3. Le formulaire de trajet se pré-remplit automatiquement.

### 4.4 Enregistrer un Trajet
- **Départ** : Saisir Km départ, Lieu, Destination.
- **Arrivée** : Saisir Km arrivée. Le mode **Offline** est supporté.

### 4.5 Carburant
Enregistrez chaque plein avec la date, le kilométrage, la quantité (L), le coût et le type de carburant.

### 4.6 Services Programmés (Maintenance)

Lorsque qu'un véhicule atteint l'échéance d'un service (ex: Service A à 150 000 km).

**Procédure :**
1. Aller dans **"Maintenance" > "Services Programmés"**.
2. Cliquer sur le service dû.
3. **Exécuter les tâches** :
   - Cochez chaque tâche réalisée.
   - Cliquez sur l'icône livre 📖 pour ouvrir le **Manuel Atelier (PDF)** à la page spécifique de la tâche (ex: Page 7).
4. Une fois terminé, cliquez sur **"Valider le Service"**.

### 4.7 Signaler une panne / Incident
Utilisez le menu "Incidents" pour rapporter tout problème (accident, panne, vol) avec photos et description.

---

## 5. FAQ et Dépannage

**Q : Le manuel PDF ne s'ouvre pas à la bonne page ?**
R : Vérifiez que le "N° Page Manuel" est bien renseigné dans le Template sur l'interface Web.

**Q : J'ai changé le compteur initial mais le km actuel ne change pas ?**
R : Le système corrige automatiquement le km actuel SEULEMENT si aucun trajet n'a été enregistré. Sinon, contactez un admin.

**Q : L'application mobile fonctionne-t-elle sans internet ?**
R : Oui ! Les données se synchronisent dès le retour de la connexion.

---
**© 2026 FleetTrack ACF**
