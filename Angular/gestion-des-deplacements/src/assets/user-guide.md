# 📖 Guide Utilisateur FleetTrack

**Version 1.0 - Décembre 2025**

---

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Accès aux Applications](#accès-aux-applications)
3. [Interface Web de Gestion](#interface-web-de-gestion)
4. [E-Logbook Mobile (PWA)](#e-logbook-mobile-pwa)
5. [FAQ et Dépannage](#faq-et-dépannage)

---

## 1. Introduction

FleetTrack est une solution complète de gestion de flotte automobile comprenant :

- **Interface Web** : Gestion administrative des véhicules, mouvements, utilisateurs et planification
- **E-Logbook Mobile** : Application mobile pour les chauffeurs (carnet de bord électronique)

### Rôles Utilisateurs

| Rôle | Accès | Description |
|------|-------|-------------|
| **Super Admin** | Interface Web | Gestion complète : pays, bases, utilisateurs, véhicules |
| **Admin** | Interface Web | Gestion de sa base : utilisateurs, véhicules, mouvements |
| **Gestionnaire** | Interface Web | Consultation et création de mouvements |
| **Chauffeur** | E-Logbook Mobile | Enregistrement des trajets, carburant, incidents |
| **Technicien** | E-Logbook Mobile | Maintenance des véhicules |

---

## 2. Accès aux Applications

### 🌐 Interface Web

**URL** : https://fleettrack-web.vercel.app

**Navigateurs compatibles** :
- Chrome (recommandé)
- Firefox
- Edge
- Safari

### 📱 E-Logbook Mobile (PWA)

**URL** : https://fleettrack-mobile.vercel.app

**Installation sur Android** :
1. Ouvrir Chrome
2. Aller sur https://fleettrack-mobile.vercel.app
3. Cliquer sur "Ajouter à l'écran d'accueil"
4. L'icône FleetTrack apparaît sur l'écran d'accueil

**Installation sur iPhone/iPad** :
1. Ouvrir Safari
2. Aller sur https://fleettrack-mobile.vercel.app
3. Cliquer sur Partager → "Sur l'écran d'accueil"
4. Cliquer sur "Ajouter"

---

## 3. Interface Web de Gestion

### 3.1 Connexion

1. Accéder à https://fleettrack-web.vercel.app
2. Entrer votre email et mot de passe
3. Cliquer sur "Se connecter"

> [!TIP]
> **Première connexion** : Votre administrateur vous fournira vos identifiants

---

### 3.2 Planning Global

Le planning permet de visualiser tous les mouvements planifiés sur un calendrier.

![Planning Global](C:/Users/jonat/.gemini/antigravity/brain/74cbdd66-299b-460b-89ab-a0b60497b61a/planning_page_1766340418433.png)

**Fonctionnalités** :
- ✅ Vue calendrier mensuelle
- ✅ Filtrage par pays/base
- ✅ Création rapide de mouvements
- ✅ Modification par glisser-déposer

**Actions** :
1. **Créer un mouvement** : Cliquer sur une date
2. **Modifier** : Cliquer sur un mouvement existant
3. **Filtrer** : Utiliser les filtres en haut de page

---

### 3.3 Gestion des Véhicules

Gérez l'ensemble de votre flotte automobile.

![Gestion des Véhicules](C:/Users/jonat/.gemini/antigravity/brain/74cbdd66-299b-460b-89ab-a0b60497b61a/vehicles_page_1766340466274.png)

**Fonctionnalités** :
- ✅ Liste complète des véhicules
- ✅ Ajout de nouveaux véhicules
- ✅ Modification des informations
- ✅ Suivi de l'état (disponible, en mission, en maintenance)

**Ajouter un véhicule** :
1. Cliquer sur **"+ Nouveau Véhicule"**
2. Remplir les informations :
   - Immatriculation
   - Marque et modèle
   - Type de véhicule
   - Kilométrage initial
   - Base d'affectation
3. Cliquer sur **"Enregistrer"**

**Informations enregistrées** :
- Immatriculation
- Marque, modèle, année
- Type (4x4, berline, pick-up, etc.)
- Kilométrage actuel
- Statut (disponible, en mission, en maintenance)
- Base d'affectation

---

### 3.4 Mes Mouvements

Consultez et gérez vos demandes de mouvements.

![Mes Mouvements](C:/Users/jonat/.gemini/antigravity/brain/74cbdd66-299b-460b-89ab-a0b60497b61a/movements_page_1766340488565.png)

**Fonctionnalités** :
- ✅ Liste de vos mouvements
- ✅ Filtrage par statut (en attente, validé, en cours, terminé)
- ✅ Création de nouvelles demandes
- ✅ Suivi en temps réel

**Créer une demande de mouvement** :
1. Cliquer sur **"+ Nouvelle Demande"**
2. Remplir le formulaire :
   - **Projet** : Sélectionner le projet concerné
   - **Date et heure** : Date de départ prévue
   - **Itinéraire** : Lieu de départ et destination
   - **Passagers** : Nombre de passagers
   - **Motif** : Raison du déplacement
3. Cliquer sur **"Soumettre"**

**Statuts des mouvements** :
- 🟡 **En attente** : Demande soumise, en attente de validation
- 🟢 **Validé** : Approuvé par l'administrateur
- 🔵 **En cours** : Trajet en cours d'exécution
- ✅ **Terminé** : Trajet complété
- ❌ **Annulé** : Demande annulée

---

### 3.5 Récapitulatif de la Flotte

Vue d'ensemble de l'état de votre flotte.

![Récapitulatif Flotte](C:/Users/jonat/.gemini/antigravity/brain/74cbdd66-299b-460b-89ab-a0b60497b61a/dashboard_page_recap_1766340526188.png)

**Indicateurs affichés** :
- 📊 **Nombre total de véhicules**
- 🚗 **Véhicules disponibles**
- 🔧 **Véhicules en maintenance**
- 🚙 **Véhicules en mission**
- 📈 **Statistiques d'utilisation**

**Utilisation** :
- Consultez rapidement l'état de votre flotte
- Identifiez les véhicules disponibles
- Planifiez les maintenances

---

### 3.6 Administration

> [!IMPORTANT]
> **Réservé aux Super Admin et Admin**

**Menu Administration** :
- **Gestion Utilisateurs** : Créer, modifier, désactiver des utilisateurs
- **Gestion Pays** : Configuration des pays (Super Admin uniquement)
- **Gestion Bases** : Configuration des bases opérationnelles
- **Gestion Projets** : Création et gestion des projets
- **Gestion Lieux** : Ajout de lieux fréquents
- **Rapports** : Génération de rapports mensuels

---

## 4. E-Logbook Mobile (PWA)

### 4.1 Sélection du Véhicule

Au premier lancement, sélectionnez votre véhicule.

![Sélection Véhicule](C:/Users/jonat/.gemini/antigravity/brain/74cbdd66-299b-460b-89ab-a0b60497b61a/mobile_vehicle_selector_1766340537154.png)

**Étapes** :
1. Ouvrir l'application e-logbook
2. Sélectionner votre véhicule dans la liste déroulante
3. Cliquer sur **"CONTINUER"**

> [!TIP]
> Vous pouvez changer de véhicule à tout moment depuis le menu

---

### 4.2 Menu Principal

Accédez rapidement à toutes les fonctionnalités.

![Menu Principal](C:/Users/jonat/.gemini/antigravity/brain/74cbdd66-299b-460b-89ab-a0b60497b61a/mobile_main_menu_1766340575891.png)

**Fonctionnalités disponibles** :

#### 📅 Mon Planning
Consultez vos missions assignées

#### 🚗 Trajet Actif
Démarrez et enregistrez un nouveau trajet

#### 📋 Mes Trajets
Historique de tous vos trajets

#### ⛽ Carburant
Enregistrez les pleins de carburant

#### 🔧 Maintenance
Signalez les maintenances et réparations

#### ⚠️ Incidents
Déclarez les incidents et accidents

#### 📊 Récapitulatif
Vue d'ensemble de votre activité

---

### 4.3 Mon Planning

Visualisez vos missions assignées par l'administrateur.

![Mon Planning](C:/Users/jonat/.gemini/antigravity/brain/74cbdd66-299b-460b-89ab-a0b60497b61a/mobile_planning_page_1766340594266.png)

**Fonctionnalités** :
- ✅ Liste des missions assignées
- ✅ Détails de chaque mission (date, itinéraire, passagers)
- ✅ Prise en charge d'une mission
- ✅ Démarrage automatique du trajet

**Prendre en charge une mission** :
1. Ouvrir **"Mon Planning"**
2. Sélectionner la mission
3. Cliquer sur **"Prendre en charge"**
4. Le formulaire de trajet se pré-remplit automatiquement
5. Démarrer le trajet

---

### 4.4 Enregistrer un Trajet

**Démarrer un trajet** :
1. Depuis le menu principal, cliquer sur **"Trajet Actif"**
2. Remplir les informations :
   - **Kilométrage départ** : Relevé du compteur
   - **Lieu de départ** : Sélectionner ou saisir
   - **Destination** : Sélectionner ou saisir
   - **Passagers** : Nombre de passagers
   - **Motif** : Raison du déplacement
3. Cliquer sur **"Démarrer le Trajet"**

**Terminer un trajet** :
1. À l'arrivée, ouvrir **"Trajet Actif"**
2. Saisir le **kilométrage d'arrivée**
3. Ajouter des observations si nécessaire
4. Cliquer sur **"Terminer le Trajet"**

> [!TIP]
> **Mode Offline** : L'application fonctionne sans connexion internet. Les données seront synchronisées automatiquement lorsque vous serez connecté.

---

### 4.5 Enregistrer un Plein de Carburant

1. Cliquer sur **"Carburant"** dans le menu
2. Cliquer sur **"+ Nouveau Plein"**
3. Remplir les informations :
   - **Date et heure**
   - **Kilométrage**
   - **Quantité (litres)**
   - **Coût total**
   - **Type de carburant** (Essence, Diesel, etc.)
   - **Station-service**
4. Prendre une photo du reçu (optionnel)
5. Cliquer sur **"Enregistrer"**

---

### 4.6 Signaler une Maintenance

1. Cliquer sur **"Maintenance"**
2. Cliquer sur **"+ Nouvelle Maintenance"**
3. Remplir :
   - **Type** : Vidange, pneus, freins, etc.
   - **Date**
   - **Kilométrage**
   - **Description** : Détails de l'intervention
   - **Coût**
   - **Garage/Technicien**
4. Ajouter des photos si nécessaire
5. Cliquer sur **"Enregistrer"**

---

### 4.7 Déclarer un Incident

> [!CAUTION]
> **En cas d'accident** : Assurez-vous d'abord de la sécurité de tous, puis contactez les autorités si nécessaire.

1. Cliquer sur **"Incidents"**
2. Cliquer sur **"+ Nouvel Incident"**
3. Remplir le formulaire :
   - **Type** : Accident, panne, vol, etc.
   - **Date et heure**
   - **Lieu**
   - **Description détaillée**
   - **Dégâts estimés**
   - **Témoins** (si applicable)
4. Prendre des photos des dégâts
5. Cliquer sur **"Enregistrer"**

---

## 5. FAQ et Dépannage

### Questions Fréquentes

**Q : J'ai oublié mon mot de passe, que faire ?**  
R : Contactez votre administrateur pour réinitialiser votre mot de passe.

**Q : L'application mobile fonctionne-t-elle sans internet ?**  
R : Oui ! Le e-logbook fonctionne en mode offline. Les données seront synchronisées automatiquement lorsque vous aurez une connexion.

**Q : Comment changer de véhicule dans le e-logbook ?**  
R : Ouvrez le menu (☰) → Paramètres → Changer de véhicule

**Q : Puis-je modifier un trajet après l'avoir terminé ?**  
R : Non, pour des raisons de traçabilité. Contactez votre administrateur si une correction est nécessaire.

**Q : Comment installer l'application sur mon téléphone ?**  
R : Voir la section [2. Accès aux Applications](#accès-aux-applications)

---

### Problèmes Courants

**Problème : Je ne vois pas mes mouvements**  
**Solution** :
1. Vérifiez que vous êtes connecté avec le bon compte
2. Vérifiez les filtres (pays/base)
3. Actualisez la page (F5)

**Problème : L'application mobile ne se synchronise pas**  
**Solution** :
1. Vérifiez votre connexion internet
2. Fermez et rouvrez l'application
3. Videz le cache : Paramètres → Vider le cache

**Problème : Je ne peux pas créer de mouvement**  
**Solution** :
1. Vérifiez que vous avez les droits nécessaires
2. Vérifiez que tous les champs obligatoires sont remplis
3. Contactez votre administrateur

---

### Support Technique

**En cas de problème technique** :
- 📧 Email : kitlog@actioncontrelafaim.org
- 📞 Téléphone : [À définir]
- 💬 Chat : Disponible dans l'application (coin inférieur droit)

---

## 📝 Notes de Version

**Version 1.0** (Décembre 2025)
- ✅ Lancement initial
- ✅ Interface web complète
- ✅ E-Logbook PWA avec mode offline
- ✅ Gestion multi-pays et multi-bases
- ✅ Synchronisation en temps réel

---

**© 2025 FleetTrack - Tous droits réservés**
